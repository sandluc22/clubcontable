export default {
  async fetch(r, e) {
    const u = new URL(r.url), p = u.pathname, m = r.method;
    const c = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization' };
    if (m === 'OPTIONS') return new Response(null, { headers: c });
    try {
      // LOGIN
            // Asegurar que existe la tabla citas
      await e.DB.exec('CREATE TABLE IF NOT EXISTS citas (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_nombre TEXT NOT NULL, cliente_email TEXT NOT NULL, cliente_telefono TEXT DEFAULT "", fecha TEXT NOT NULL, hora TEXT NOT NULL, motivo TEXT DEFAULT "", estado TEXT DEFAULT "pendiente", empresa_id INTEGER, usuario_id INTEGER, created_at TEXT DEFAULT (datetime("now")))');
      if (p === '/api/login' && m === 'POST') {
        const b = await r.json();
        const usr = await e.DB.prepare('SELECT * FROM usuarios WHERE email = ? AND password = ?').bind(b.email, b.password).first();
        if (!usr) return new Response(JSON.stringify({ ok: false, error: 'Credenciales inválidas' }), { status: 401, headers: c });
        const tok = crypto.randomUUID();
        await e.DB.prepare('UPDATE usuarios SET token = ? WHERE id = ?').bind(tok, usr.id).run();
        const emps = await e.DB.prepare('SELECT e.* FROM empresas e INNER JOIN usuario_empresas ue ON e.id = ue.empresa_id WHERE ue.usuario_id = ?').bind(usr.id).all();
        return new Response(JSON.stringify({ ok: true, token: tok, user: { id: usr.id, nombre: usr.nombre, email: usr.email, rol: usr.rol || 'usuario' }, empresas: emps.results || [] }), { headers: c });
      }
      // AUTH
      const ah = r.headers.get('Authorization');
      if (!ah || !ah.startsWith('Bearer ')) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: c });
      const usr = await e.DB.prepare('SELECT * FROM usuarios WHERE token = ?').bind(ah.slice(7)).first();
      if (!usr) return new Response(JSON.stringify({ ok: false, error: 'Token inválido' }), { status: 401, headers: c });
      const uid = usr.id, rol = usr.rol || 'usuario';
      const eid = u.searchParams.get('empresa_id') ? parseInt(u.searchParams.get('empresa_id')) : null;
      const R = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: c });

      // CATEGORIAS
      if (p === '/api/categorias') {
        if (m === 'GET') { const x = await e.DB.prepare('SELECT * FROM categorias ORDER BY orden').all(); return R({ ok: true, result: x.results }); }
        if (m === 'POST') { const b = await r.json(); const x = await e.DB.prepare('INSERT INTO categorias (nombre) VALUES (?)').bind(b.nombre).run(); return R({ ok: true, id: x.meta.last_row_id }); }
      }
      // SUBCATEGORIAS
      if (p === '/api/subcategorias') {
        if (m === 'GET') { const cat = u.searchParams.get('categoria_id'); let q = 'SELECT * FROM subcategorias'; let pr = []; if (cat) { q += ' WHERE categoria_id = ?'; pr.push(parseInt(cat)); } const x = await e.DB.prepare(q).bind(...pr).all(); return R({ ok: true, result: x.results }); }
        if (m === 'POST') { const b = await r.json(); const x = await e.DB.prepare('INSERT INTO subcategorias (nombre, categoria_id) VALUES (?, ?)').bind(b.nombre, parseInt(b.categoria_id)).run(); return R({ ok: true, id: x.meta.last_row_id }); }
      }
      // TAREAS
      if (p === '/api/tareas') {
        if (m === 'GET') {
          let q = "SELECT t.*, c.nombre as categoria_nombre, s.nombre as subcategoria_nombre, e.nombre as empresa_nombre, u.nombre as usuario_nombre FROM tareas t LEFT JOIN categorias c ON t.categoria_id = c.id LEFT JOIN subcategorias s ON t.subcategoria_id = s.id LEFT JOIN empresas e ON t.empresa_id = e.id LEFT JOIN usuarios u ON t.usuario_id = u.id WHERE t.usuario_id = ?";
          let pr = [uid];
          if (eid) { q += ' AND t.empresa_id = ?'; pr.push(eid); }
          if (u.searchParams.get('usuario_id')) { q += ' AND t.usuario_id = ?'; pr.push(parseInt(u.searchParams.get('usuario_id'))); }
          if (u.searchParams.get('desde')) { q += ' AND t.created_at >= ?'; pr.push(u.searchParams.get('desde')); }
          if (u.searchParams.get('hasta')) { q += ' AND t.created_at <= ?'; pr.push(u.searchParams.get('hasta')); }
          const x = await e.DB.prepare(q + ' ORDER BY t.created_at DESC LIMIT 500').bind(...pr).all();
          return R({ ok: true, result: x.results });
        }
        if (m === 'POST') {
          const b = await r.json();
          const x = await e.DB.prepare("INSERT INTO tareas (titulo, descripcion, categoria_id, subcategoria_id, empresa_id, usuario_id, fecha_limite, ok) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            .bind(b.titulo, b.descripcion || '', b.categoria_id || null, b.subcategoria_id || null, b.empresa_id || null, uid, b.fecha_limite || null, b.ok || 0).run();
          return R({ ok: true, id: x.meta.last_row_id });
        }
      }
      // ELIMINAR
      if (p === '/api/categorias/delete' && m === 'POST') { const b = await r.json(); await e.DB.prepare('DELETE FROM subcategorias WHERE categoria_id = ?').bind(b.id).run(); await e.DB.prepare('DELETE FROM categorias WHERE id = ?').bind(b.id).run(); return R({ ok: true }); }
      if (p === '/api/subcategorias/delete' && m === 'POST') { const b = await r.json(); await e.DB.prepare('DELETE FROM subcategorias WHERE id = ?').bind(b.id).run(); return R({ ok: true }); }
      if (p === '/api/tareas/delete' && m === 'POST') { const b = await r.json(); await e.DB.prepare('DELETE FROM tareas WHERE id = ?').bind(b.id).run(); return R({ ok: true }); }

      // DASHBOARD
      if (p === '/api/dashboard' && m === 'GET') {
        const ew = eid ? ' AND t.empresa_id = ' + eid : '';
        const t = await e.DB.prepare('SELECT COUNT(*) as c FROM tareas t WHERE t.usuario_id = ?' + ew).bind(uid).first();
        const ok = await e.DB.prepare("SELECT COUNT(*) as c FROM tareas t WHERE t.usuario_id = ? AND t.ok = 1" + ew).bind(uid).first();
        const aTiempo = await e.DB.prepare("SELECT COUNT(*) as c FROM tareas t WHERE t.usuario_id = ? AND t.ok = 1 AND t.fecha_limite IS NOT NULL AND DATE(t.created_at) <= DATE(t.fecha_limite)" + ew).bind(uid).first();
        const fuera = await e.DB.prepare("SELECT COUNT(*) as c FROM tareas t WHERE t.usuario_id = ? AND (t.ok = 1 AND t.fecha_limite IS NOT NULL AND DATE(t.created_at) > DATE(t.fecha_limite))" + ew).bind(uid).first();
        const r5 = await e.DB.prepare("SELECT t.*, c.nombre as categoria_nombre FROM tareas t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.usuario_id = ?" + ew + " ORDER BY t.created_at DESC LIMIT 5").bind(uid).all();
        return R({ ok: true, result: { total: t.c, completadas: ok.c, pendientes: t.c - ok.c, a_tiempo: aTiempo.c, fuera_fecha: fuera.c, tareas: r5.results || [] } });
      }

      // EMPRESAS
      if (p === '/api/empresas') {
        if (m === 'GET') { const x = await e.DB.prepare('SELECT * FROM empresas ORDER BY nombre').all(); return R({ ok: true, result: x.results }); }
        if (m === 'POST' && (rol === 'admin' || rol === 'superadmin')) {
          const b = await r.json();
          const x = await e.DB.prepare('INSERT INTO empresas (nombre, nit, direccion, telefono) VALUES (?, ?, ?, ?)').bind(b.nombre, b.nit || '', b.direccion || '', b.telefono || '').run();
          return R({ ok: true, id: x.meta.last_row_id });
        }
      }
      // USUARIOS (solo admin)
      if (p === '/api/usuarios') {
        if (m === 'GET' && (rol === 'admin' || rol === 'superadmin')) { const x = await e.DB.prepare('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY nombre').all(); return R({ ok: true, result: x.results }); }
        if (m === 'POST' && (rol === 'admin' || rol === 'superadmin')) {
          const b = await r.json();
          const x = await e.DB.prepare('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)').bind(b.nombre, b.email, b.password, b.rol || 'usuario').run();
          if (b.empresa_id) { await e.DB.prepare('INSERT INTO usuario_empresas (usuario_id, empresa_id) VALUES (?, ?)').bind(x.meta.last_row_id, b.empresa_id).run(); }
          return R({ ok: true, id: x.meta.last_row_id });
        }
      }
      // ASIGNAR EMPRESA A USUARIO
      if (p === '/api/usuario_empresas' && m === 'POST' && (rol === 'admin' || rol === 'superadmin')) {
        const b = await r.json();
        await e.DB.prepare('INSERT OR IGNORE INTO usuario_empresas (usuario_id, empresa_id) VALUES (?, ?)').bind(b.usuario_id, b.empresa_id).run();
        return R({ ok: true });
      }

      
      // CITAS
      if (p === '/api/citas') {
        if (m === 'GET') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          let sql, params;
          if (b_empresa_id) {
            sql = 'SELECT * FROM citas WHERE empresa_id = ? ORDER BY fecha DESC, hora ASC';
            params = [b_empresa_id];
          } else {
            sql = 'SELECT * FROM citas ORDER BY fecha DESC, hora ASC';
            params = [];
          }
          const x = await e.DB.prepare(sql).bind(...params).all();
          return R({ ok: true, citas: x.results });
        }
        if (m === 'POST') {
          const b = await r.json();
          if (!b.cliente_nombre || !b.cliente_email || !b.fecha || !b.hora)
            return R({ ok: false, error: 'Faltan campos obligatorios' }, 400);
          const x = await e.DB.prepare('INSERT INTO citas (cliente_nombre, cliente_email, cliente_telefono, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .bind(b.cliente_nombre, b.cliente_email, b.cliente_telefono || '', b.fecha, b.hora, b.motivo || '', 'pendiente').run();
          return R({ ok: true, id: x.meta.last_row_id });
        }
        if (m === 'DELETE') {
          if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
          const id = u.searchParams.get('id');
          if (!id) return R({ ok: false, error: 'Falta id' }, 400);
          await e.DB.prepare('DELETE FROM citas WHERE id = ?').bind(id).run();
          return R({ ok: true });
        }
      }
      if (p === '/api/citas/estado' && m === 'POST') {
        if (!uid) return R({ ok: false, error: 'No autorizado' }, 401);
        const b = await r.json();
        if (!['pendiente','confirmada','cancelada'].includes(b.estado))
          return R({ ok: false, error: 'Estado invalido' }, 400);
        await e.DB.prepare('UPDATE citas SET estado = ? WHERE id = ?').bind(b.estado, b.id).run();
        return R({ ok: true });
      }
      return new Response(JSON.stringify({ ok: false, error: 'No encontrada' }), { status: 404, headers: c });
    } catch (e) { return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: c }); }
  }
};
