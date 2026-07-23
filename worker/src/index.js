export default {
  async fetch(r, e) {
    const u = new URL(r.url), p = u.pathname, m = r.method;
    const c = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization' };
    const R = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: c });
    if (m === 'OPTIONS') return new Response(null, { headers: c });

    try {
      // Obtener usuario autenticado
      let uid = 0, uemp = 0;
      const auth = r.headers.get('Authorization') || '';
      if (auth.startsWith('***')) {
        const tk = auth.slice(3);
        const s = await e.DB.prepare('SELECT usuario_id, empresa_id FROM sesiones WHERE token = ?').bind(tk).first();
        if (s) { uid = s.usuario_id; uemp = s.empresa_id || 0; }
      }

      // Asegurar tablas
      await e.DB.exec(`CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_nombre TEXT NOT NULL,
        cliente_email TEXT NOT NULL,
        cliente_telefono TEXT DEFAULT "",
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        motivo TEXT DEFAULT "",
        estado TEXT DEFAULT "pendiente",
        empresa_id INTEGER,
        usuario_id INTEGER,
        created_at TEXT DEFAULT (datetime("now")),
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
      )`);
      await e.DB.exec(`CREATE TABLE IF NOT EXISTS config_citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        empresa_id INTEGER UNIQUE,
        whatsapp_activo INTEGER DEFAULT 0,
        whatsapp_token TEXT DEFAULT "",
        whatsapp_phone TEXT DEFAULT "",
        email_activo INTEGER DEFAULT 0,
        email_api_key TEXT DEFAULT "",
        email_from TEXT DEFAULT "",
        negocio_nombre TEXT DEFAULT "Mi Negocio",
	    whatsapp_plantilla_confirmacion TEXT DEFAULT "Hola {{cliente}}, te confirmamos tu cita en {{negocio}} para el {{fecha}} a las {{hora}}. Te esperamos!",
        whatsapp_plantilla_recordatorio TEXT DEFAULT "📅 Recordatorio: {{cliente}}, mañana tienes cita en {{negocio}} a las {{hora}}. Confirma o cancela respondiendo este mensaje.",
        email_plantilla_confirmacion TEXT DEFAULT "",
        email_plantilla_recordatorio TEXT DEFAULT "",
        created_at TEXT DEFAULT (datetime("now"))
      )`);

      // ==================== LOGIN ====================
      if (p === '/api/login' && m === 'POST') {
        const b = await r.json();
        if (!b.email || !b.password) return R({ ok: false, error: 'Faltan datos' }, 400);
        const usr = await e.DB.prepare('SELECT * FROM usuarios WHERE email = ? AND password = ?').bind(b.email, b.password).first();
        if (!usr) return R({ ok: false, error: 'Credenciales inválidas' }, 401);
        const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
        await e.DB.prepare('INSERT INTO sesiones (usuario_id, token, empresa_id) VALUES (?, ?, ?)').bind(usr.id, token, usr.empresa_id || 0).run();
        return R({ ok: true, token, usuario: { id: usr.id, nombre: usr.nombre, email: usr.email, empresa_id: usr.empresa_id || 0 } });
      }

      // ==================== CITAS ====================
      if (p === '/api/citas') {
        // GET: listar
        if (m === 'GET') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          let sql, params;
          const emp = u.searchParams.get('empresa_id');
          if (emp) { sql = 'SELECT * FROM citas WHERE empresa_id = ? ORDER BY fecha DESC, hora ASC'; params = [emp]; }
          else if (uemp) { sql = 'SELECT * FROM citas WHERE empresa_id = ? ORDER BY fecha DESC, hora ASC'; params = [uemp]; }
          else { sql = 'SELECT * FROM citas ORDER BY fecha DESC, hora ASC'; params = []; }
          const x = await e.DB.prepare(sql).bind(...params).all();
          return R({ ok: true, citas: x.results });
        }
        // POST: crear cita + enviar notificaciones
        if (m === 'POST') {
          const b = await r.json();
          if (!b.cliente_nombre || !b.cliente_email || !b.fecha || !b.hora)
            return R({ ok: false, error: 'Faltan campos obligatorios' }, 400);
          const emp_id = b.empresa_id || uemp || 0;
          const x = await e.DB.prepare(
            'INSERT INTO citas (cliente_nombre, cliente_email, cliente_telefono, fecha, hora, motivo, estado, empresa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(b.cliente_nombre, b.cliente_email, b.cliente_telefono || '', b.fecha, b.hora, b.motivo || '', 'pendiente', emp_id).run();
          const citaId = x.meta.last_row_id;

          // Enviar notificaciones automáticas
          await enviarNotificaciones(e, emp_id, b, citaId);

          return R({ ok: true, id: citaId });
        }
        // DELETE
        if (m === 'DELETE') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          const id = u.searchParams.get('id');
          if (!id) return R({ ok: false, error: 'Falta id' }, 400);
          await e.DB.prepare('DELETE FROM citas WHERE id = ?').bind(id).run();
          return R({ ok: true });
        }
      }

      // Cambiar estado de cita
      if (p === '/api/citas/estado' && m === 'POST') {
        if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
        const b = await r.json();
        if (!['pendiente','confirmada','cancelada','completada'].includes(b.estado))
          return R({ ok: false, error: 'Estado inválido' }, 400);
        await e.DB.prepare('UPDATE citas SET estado = ? WHERE id = ?').bind(b.estado, b.id).run();
        // Si se confirma, re-enviar confirmación
        if (b.estado === 'confirmada') {
          const cita = await e.DB.prepare('SELECT * FROM citas WHERE id = ?').bind(b.id).first();
          if (cita) await enviarNotificaciones(e, cita.empresa_id || 0, cita, b.id, true);
        }
        return R({ ok: true });
      }

      // ==================== CONFIGURACIÓN CITAS ====================
      if (p === '/api/citas/config') {
        if (m === 'GET') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          const cfg = await e.DB.prepare('SELECT * FROM config_citas WHERE empresa_id = ?').bind(uemp || 0).first();
          return R({ ok: true, config: cfg || null });
        }
        if (m === 'POST') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          const b = await r.json();
          await e.DB.prepare(`INSERT INTO config_citas (empresa_id, whatsapp_activo, whatsapp_token, whatsapp_phone, email_activo, email_api_key, email_from, negocio_nombre, whatsapp_plantilla_confirmacion, whatsapp_plantilla_recordatorio)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(empresa_id) DO UPDATE SET
            whatsapp_activo=excluded.whatsapp_activo, whatsapp_token=excluded.whatsapp_token, whatsapp_phone=excluded.whatsapp_phone,
            email_activo=excluded.email_activo, email_api_key=excluded.email_api_key, email_from=excluded.email_from,
            negocio_nombre=excluded.negocio_nombre,
            whatsapp_plantilla_confirmacion=excluded.whatsapp_plantilla_confirmacion,
            whatsapp_plantilla_recordatorio=excluded.whatsapp_plantilla_recordatorio`
          ).bind(uemp || 0, b.whatsapp_activo ? 1 : 0, b.whatsapp_token || '', b.whatsapp_phone || '',
                 b.email_activo ? 1 : 0, b.email_api_key || '', b.email_from || '', b.negocio_nombre || 'Mi Negocio',
                 b.whatsapp_plantilla_confirmacion || '', b.whatsapp_plantilla_recordatorio || '').run();
          return R({ ok: true });
        }
      }

      // ==================== ENVIAR RECORDATORIO MANUAL ====================
      if (p === '/api/citas/recordatorio' && m === 'POST') {
        if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
        const b = await r.json();
        const cita = await e.DB.prepare('SELECT * FROM citas WHERE id = ?').bind(b.id).first();
        if (!cita) return R({ ok: false, error: 'Cita no encontrada' }, 404);
        await enviarNotificaciones(e, cita.empresa_id || 0, cita, b.id, true);
        return R({ ok: true, mensaje: 'Recordatorio enviado' });
      }

      return R({ ok: false, error: 'No encontrada' }, 404);
    } catch (e) { return R({ ok: false, error: e.message }, 500); }
  }
};

// ==================== FUNCIÓN DE NOTIFICACIONES ====================
async function enviarNotificaciones(e, empresa_id, datos, citaId, esRecordatorio = false) {
  try {
    if (!empresa_id) return;
    const cfg = await e.DB.prepare('SELECT * FROM config_citas WHERE empresa_id = ?').bind(empresa_id).first();
    if (!cfg) return;

    const negocio = cfg.negocio_nombre || 'Mi Negocio';
    const fecha = datos.fecha || '';
    const hora = datos.hora || '';
    const cliente = datos.cliente_nombre || 'Cliente';

    // Reemplazar plantillas
    const reemplazar = (txt) => {
      if (!txt) return '';
      return txt.replace(/\{\{cliente\}\}/g, cliente)
                .replace(/\{\{negocio\}\}/g, negocio)
                .replace(/\{\{fecha\}\}/g, fecha)
                .replace(/\{\{hora\}\}/g, hora);
    };

    let msgWhatsapp = '';
    let msgEmail = '';
    if (esRecordatorio) {
      msgWhatsapp = reemplazar(cfg.whatsapp_plantilla_recordatorio || `📅 Recordatorio: {{cliente}}, mañana tienes cita en {{negocio}} a las {{hora}}.`);
      msgEmail = cfg.email_plantilla_recordatorio || `Hola ${cliente}, te recordamos tu cita en ${negocio} para el ${fecha} a las ${hora}.`;
    } else {
      msgWhatsapp = reemplazar(cfg.whatsapp_plantilla_confirmacion || `Hola {{cliente}}, te confirmamos tu cita en {{negocio}} para el {{fecha}} a las {{hora}}. Te esperamos!`);
      msgEmail = cfg.email_plantilla_confirmacion || `Hola ${cliente},\n\nTu cita en ${negocio} ha sido confirmada.\n📅 Fecha: ${fecha}\n⏰ Hora: ${hora}\n\nTe esperamos!`;
    }

    const telefono = datos.cliente_telefono || '';
    const email = datos.cliente_email || '';

    // Enviar WhatsApp
    if (cfg.whatsapp_activo && cfg.whatsapp_token && cfg.whatsapp_phone && telefono) {
      try {
        const waPhone = cfg.whatsapp_phone.replace(/[^0-9]/g, '');
        const clientPhone = telefono.replace(/[^0-9]/g, '');
        // Usar WhatsApp Cloud API
        await fetch('https://graph.facebook.com/v18.0/' + waPhone + '/messages', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + cfg.whatsapp_token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: clientPhone,
            type: 'text',
            text: { body: msgWhatsapp }
          })
        });
      } catch(e) { console.error('WhatsApp error:', e.message); }
    }

    // Enviar Email
    if (cfg.email_activo && cfg.email_api_key && email) {
      try {
        const apiKey = cfg.email_api_key;
        const fromEmail = cfg.email_from || 'noreply@clubcontable.com';
        // Usar Resend (gratis 100/día)
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: negocio + ' <' + fromEmail + '>',
            to: [email],
            subject: esRecordatorio ? '📅 Recordatorio: tu cita en ' + negocio : '✅ Cita confirmada en ' + negocio,
            text: msgEmail
          })
        });
      } catch(e) { console.error('Email error:', e.message); }
    }
  } catch(e) { console.error('Notificaciones error:', e.message); }
}
