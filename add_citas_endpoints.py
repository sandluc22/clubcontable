#!/usr/bin/env python3
import os

os.chdir('/home/node/workspace/clubcontable')

with open('worker/src/index.js') as f:
    content = f.read()

# Add citas endpoints before the 404 return
citas_endpoints = '''
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
'''

old_return = "return new Response(JSON.stringify({ ok: false, error: 'No encontrada' }), { status: 404, headers: c });"
if citas_endpoints not in content:
    content = content.replace(old_return, citas_endpoints + '      ' + old_return)
    print('✅ Endpoints de citas añadidos al worker')

with open('worker/src/index.js', 'w') as f:
    f.write(content)
