export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const cors = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization' };
    if (method === 'OPTIONS') return new Response(null, { headers: cors });

    try {
      // LOGIN
      if (path === '/api/login' && method === 'POST') {
        const { email, password } = await request.json();
        const user = await env.DB.prepare('SELECT * FROM usuarios WHERE email = ? AND password = ?').bind(email, password).first();
        if (!user) return new Response(JSON.stringify({ ok: false, error: 'Credenciales inválidas' }), { status: 401, headers: cors });
        const token = crypto.randomUUID();
        await env.DB.prepare('UPDATE usuarios SET token = ? WHERE id = ?').bind(token, user.id).run();
        const emp = await env.DB.prepare('SELECT e.* FROM empresas e INNER JOIN usuario_empresas ue ON e.id = ue.empresa_id WHERE ue.usuario_id = ?').bind(user.id).all();
        return new Response(JSON.stringify({ ok: true, token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol || 'usuario' }, empresas: emp.results || [] }), { headers: cors });
      }

      // AUTH
      const auth = request.headers.get('Authorization');
      if (!auth || !auth.startsWith('Bearer ')) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401, headers: cors });
      const token = auth.slice(7);
      const user = await env.DB.prepare('SELECT * FROM usuarios WHERE token = ?').bind(token).first();
      if (!user) return new Response(JSON.stringify({ ok: false, error: 'Token inválido' }), { status: 401, headers: cors });

      const uid = user.id;
      const empresaId = url.searchParams.get('empresa_id') ? parseInt(url.searchParams.get('empresa_id')) : null;

      const ok = (data, st = 200) => new Response(JSON.stringify(data), { status: st, headers: cors });

      // CATEGORIAS
      if (path === '/api/categorias') {
        if (method === 'GET') {
          const r = await env.DB.prepare('SELECT * FROM categorias ORDER BY orden').all();
          return ok({ ok: true, result: r.results });
        }
        if (method === 'POST') {
          const b = await request.json();
          const r = await env.DB.prepare('INSERT INTO categorias (nombre) VALUES (?)').bind(b.nombre).run();
          return ok({ ok: true, id: r.meta.last_row_id });
        }
      }

      // SUBCATEGORIAS
      if (path === '/api/subcategorias') {
        if (method === 'GET') {
          const catId = url.searchParams.get('categoria_id');
          let q = 'SELECT * FROM subcategorias';
          let p = [];
          if (catId) { q += ' WHERE categoria_id = ?'; p.push(parseInt(catId)); }
          q += ' ORDER BY id';
          const r = await env.DB.prepare(q).bind(...p).all();
          return ok({ ok: true, result: r.results });
        }
        if (method === 'POST') {
          const b = await request.json();
          const r = await env.DB.prepare('INSERT INTO subcategorias (nombre, categoria_id) VALUES (?, ?)').bind(b.nombre, parseInt(b.categoria_id)).run();
          return ok({ ok: true, id: r.meta.last_row_id });
        }
      }

      // TAREAS
      if (path === '/api/tareas') {
        if (method === 'GET') {
          let q = 'SELECT t.*, c.nombre as categoria_nombre, e.nombre as empresa_nombre FROM tareas t LEFT JOIN categorias c ON t.categoria_id = c.id LEFT JOIN empresas e ON t.empresa_id = e.id WHERE t.usuario_id = ?';
          let p = [uid];
          if (empresaId) { q += ' AND t.empresa_id = ?'; p.push(empresaId); }
          q += ' ORDER BY t.created_at DESC LIMIT 500';
          const r = await env.DB.prepare(q).bind(...p).all();
          return ok({ ok: true, result: r.results });
        }
        if (method === 'POST') {
          const b = await request.json();
          const r = await env.DB.prepare(
            'INSERT INTO tareas (titulo, descripcion, categoria_id, subcategoria_id, empresa_id, usuario_id, fecha_limite, ok) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(b.titulo, b.descripcion || '', b.categoria_id || null, b.subcategoria_id || null, b.empresa_id || null, uid, b.fecha_limite || null, b.ok || 0).run();
          return ok({ ok: true, id: r.meta.last_row_id });
        }
      }

      // DELETE CATEGORIA
      if (path === '/api/categorias/delete' && method === 'POST') {
        const b = await request.json();
        await env.DB.prepare('DELETE FROM subcategorias WHERE categoria_id = ?').bind(b.id).run();
        await env.DB.prepare('DELETE FROM categorias WHERE id = ?').bind(b.id).run();
        return ok({ ok: true });
      }

      // DELETE SUBCATEGORIA
      if (path === '/api/subcategorias/delete' && method === 'POST') {
        const b = await request.json();
        await env.DB.prepare('DELETE FROM subcategorias WHERE id = ?').bind(b.id).run();
        return ok({ ok: true });
      }

      // DELETE TAREA
      if (path === '/api/tareas/delete' && method === 'POST') {
        const b = await request.json();
        await env.DB.prepare('DELETE FROM tareas WHERE id = ?').bind(b.id).run();
        return ok({ ok: true });
      }

      // DASHBOARD
      if (path === '/api/dashboard') {
        const ew = empresaId ? ' AND t.empresa_id = ' + empresaId : '';
        const total = await env.DB.prepare('SELECT COUNT(*) as count FROM tareas t WHERE t.usuario_id = ?' + (ew || '')).bind(uid).first();
        const completadas = await env.DB.prepare('SELECT COUNT(*) as count FROM tareas t WHERE t.usuario_id = ? AND t.ok = 1' + (ew || '')).bind(uid).first();
        const recientes = await env.DB.prepare('SELECT t.*, c.nombre as categoria_nombre FROM tareas t LEFT JOIN categorias c ON t.categoria_id = c.id WHERE t.usuario_id = ?' + (ew || '') + ' ORDER BY t.created_at DESC LIMIT 5').bind(uid).all();
        return ok({ ok: true, result: { total: total.count, completadas: completadas.count, pendientes: total.count - completadas.count, tareas: recientes.results || [] } });
      }

      // EMPRESAS
      if (path === '/api/empresas' && method === 'GET') {
        const r = await env.DB.prepare('SELECT * FROM empresas ORDER BY nombre').all();
        return ok({ ok: true, result: r.results });
      }

      return new Response(JSON.stringify({ ok: false, error: 'No encontrada' }), { status: 404, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: cors });
    }
  }
};
