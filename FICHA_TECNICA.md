# 🏢 Club Contable — Ficha Técnica

## Datos generales
- **Web:** https://clubcontable.com
- **API:** https://clubcontable-api.crecimientofinancieroglobal.workers.dev
- **Login admin:** admin@clubcontable.com / admin2025
- **Repositorio:** https://github.com/sandluc22/clubcontable (rama master)
- **Proyecto Pages:** `clubcontable-front` (Cloudflare Pages)
- **Proyecto Worker:** `clubcontable-api` (Cloudflare Workers)

## Arquitectura
| Componente | Tecnología | Despliegue |
|---|---|---|
| Frontend | HTML+CSS+JS vanilla | Cloudflare Pages (auto-deploy desde GitHub) |
| Backend API | Cloudflare Workers (ES module) | Cloudflare Workers |
| Base de datos | D1 (SQLite) | Cloudflare D1 |

---

## 🚀 Deploy

### Frontend
- Push a GitHub → Cloudflare Pages detecta cambios y redeploya automáticamente
- Proyecto: `clubcontable-front`
- Raíz: `public/` (index.html)

### Worker
- Código en `worker/src/index.js`
- `npx wrangler deploy` para crear nueva versión
- Si no se activa automáticamente: `npx wrangler versions deploy <version-id> --yes`

---

## 🗄️ Base de datos D1

### Tablas
- **usuarios** (id, nombre, email, password, rol, token, created_at)
- **empresas** (id, nombre, nit, direccion, telefono, created_at)
- **usuario_empresas** (id, usuario_id, empresa_id)
- **tareas** (id, titulo, descripcion, categoria_id, subcategoria_id, empresa_id, usuario_id, fecha_limite, ok, created_at, updated_at)
- **categorias** (id, nombre, orden)
- **subcategorias** (id, nombre, categoria_id)

---

## 🌐 API Endpoints

### Auth
- `POST /api/login` → `{email, password}` → `{ok, token, user, empresas}`

### Categorías
- `GET /api/categorias` → lista de categorías
- `POST /api/categorias` → `{nombre}` → crea categoría
- `POST /api/categorias/delete` → `{id}` → elimina categoría (y subcats asociadas)

### Subcategorías
- `GET /api/subcategorias?categoria_id=X` → filtradas
- `POST /api/subcategorias` → `{nombre, categoria_id}`
- `POST /api/subcategorias/delete` → `{id}`

### Tareas
- `GET /api/tareas?empresa_id=X&usuario_id=X&desde=X&hasta=X` → listado con joins
- `POST /api/tareas` → `{titulo, descripcion, categoria_id, subcategoria_id, empresa_id, fecha_limite}`
- `POST /api/tareas/delete` → `{id}`

### Dashboard
- `GET /api/dashboard?empresa_id=X` → `{total, completadas, pendientes, a_tiempo, fuera_fecha, tareas[]}`

### Admin (solo rol admin/superadmin)
- `GET /api/empresas` → lista
- `POST /api/empresas` → `{nombre, nit, direccion, telefono}`
- `GET /api/usuarios` → lista
- `POST /api/usuarios` → `{nombre, email, password, rol, empresa_id}`
- `POST /api/usuario_empresas` → `{usuario_id, empresa_id}`

---

## 🎨 Diseño
- **Sidebar:** #1e293b (oscuro)
- **Primario:** #2563eb (azul)
- **Hover/accent:** #f59e0b (amarillo)
- **Background:** #f1f5f9
- **Botones danger:** #dc2626 / #fee2e2

---

## ⏭️ Pendientes
- [ ] Filtro reportes por rango de fechas
- [ ] Filtro por usuario en reportes
- [ ] Contador tareas a tiempo vs fuera de plazo
- [ ] Panel Admin: asignar empresa a usuario existente
- [ ] Nombre del producto dentro de Club Contable (tuController, MiContable, etc.)
- [ ] Verificar que Colors CFG se vean en producción (Ctrl+Shift+R)
