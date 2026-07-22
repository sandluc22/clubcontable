# 🏢 Club Contable — Ficha Técnica

## Datos generales
- **Web:** https://clubcontable.com
- **API:** https://clubcontable-api.crecimientofinancieroglobal.workers.dev
- **Login admin:** admin@clubcontable.com / admin2025
- **Ruta directa login:** https://clubcontable.com/#acceso
- **Repositorio:** https://github.com/sandluc22/clubcontable (rama master)
- **Proyecto Pages:** `clubcontable-front` (Cloudflare Pages)
- **Proyecto Worker:** `clubcontable-api` (Cloudflare Workers)
- **Último commit:** `8d63d93` — "Fusion: web informativa + panel gestor con login" (22 jul)

## Arquitectura
| Componente | Tecnología | Despliegue |
|---|---|---|
| Frontend | HTML+CSS+JS vanilla (SPA) | Cloudflare Pages (auto-deploy desde GitHub) |
| Backend API | Cloudflare Workers (ES module) | Cloudflare Workers |
| Base de datos | D1 (SQLite) | Cloudflare D1 |

---

## 🚀 Deploy

### Frontend
- Push a GitHub → Cloudflare Pages detecta cambios y redeploya automáticamente
- Proyecto: `clubcontable-front`
- Comando: `git push origin master`

### Worker API
- Desplegar con: `npx wrangler deploy`
- Proyecto: `clubcontable-api`
- Account ID: `72305fb85467e89da2940e359f9e09cc`

---

## 🗂️ Estructura del sitio

### Web informativa (visible sin login)
| Sección | Contenido |
|---|---|
| 🏠 **Inicio** | Hero + tarjetas explicativas del producto |
| 📖 **Guías** | Artículos: contabilidad pymes, facturación electrónica, calendario tributario |
| 🛠️ **Herramientas** | Calculadora IVA, calendario vencimientos, formatos |
| 🏢 **Para empresas** | Libros contables, autónomos, beneficios tributarios |
| 👨‍💼 **Para contadores** | Responsabilidades, organización, software vs Excel |
| 💻 **Gestor de tareas** | **Cápsula informativa + login + precios + suscripción** |
| 🆕 **Novedades** | Normativas contables y fiscales Colombia |
| ❓ **FAQ** | Preguntas frecuentes |
| 📬 **Contacto** | Formulario de contacto |

### Panel del gestor (visible tras login)
- Sidebar: Dashboard, Tareas, Categorías, Subcategorías, Reportes, Admin
- El panel se oculta/muestra automáticamente según sesión

---

## 🔐 Sistema de login

### Cómo funciona
1. Usuario entra a `clubcontable.com/#acceso`
2. Introduce email + contraseña
3. La web llama a `POST /api/login` en la API
4. Si es correcto → guarda token en localStorage → recarga la página
5. Al recargar, detecta el token → oculta web informativa → muestra panel del gestor

### Usuarios de prueba
- **Admin:** admin@clubcontable.com / admin2025

### Flujo para nuevos usuarios
1. Cliente visita la web y ve la info
2. Se suscribe (formulario en sección Gestor) — **pendiente conectar correo**
3. Admin crea usuario desde el panel
4. Cliente entra con su email y contraseña

---

## 🌐 API Endpoints

### Autenticación
- `POST /api/login` → `{email, password}` → `{ok, token, user}`

### Categorías
- `GET /api/categorias` → lista de categorías
- `POST /api/categorias` → `{nombre}` → crea categoría
- `POST /api/categorias/delete` → `{id}` → elimina categoría

### Subcategorías
- `GET /api/subcategorias?categoria_id=X` → filtradas por categoría
- `POST /api/subcategorias` → `{nombre, categoria_id}`
- `POST /api/subcategorias/delete` → `{id}`

### Tareas
- `GET /api/tareas?empresa_id=X&usuario_id=X&desde=X&hasta=X` → listado con joins
- `POST /api/tareas` → `{titulo, descripcion, categoria_id, subcategoria_id, empresa_id, fecha_limite}`
- `POST /api/tareas/delete` → `{id}`

### Dashboard
- `GET /api/dashboard?empresa_id=X` → `{total, completadas, pendientes, a_tiempo, fuera_fecha, tareas[]}`

### Admin (solo rol admin/superadmin)
- `GET /api/empresas` → lista de empresas
- `POST /api/empresas` → `{nombre, nit, direccion, telefono}`
- `GET /api/usuarios` → lista de usuarios

---

## 🎨 Diseño
- **Fuente:** Inter (Google Fonts)
- **Layout:** Una página con scroll suave, secciones ancladas (#guias, #gestor, #acceso...)
- **Responsive:** Menú hamburguesa en móvil, grid adaptable
- **Colores:** Fondo #f8fafc, texto #1e293b, azul #2563eb, hover #1d4ed8, amarillo #f59e0b

---

## ⏭️ Pendientes
- [ ] Conectar formularios (suscripción y contacto) a Web3Forms para que lleguen correos a Sandra
- [ ] Sandra probar login en clubcontable.com desde el móvil y confirmar que funciona
- [ ] Ajustar diseño del panel al nuevo estilo de la web
- [ ] Más contenido: artículos para Guías, Empresas, Contadores
- [ ] Filtro reportes por rango de fechas
- [ ] Panel Admin: asignar empresa a usuario existente
- [ ] Nombre del producto dentro de Club Contable
- [ ] Verificar que se vea correctamente en producción (Ctrl+Shift+R)

---

## 📧 Migadu — Correos clubcontable.com
- info@clubcontable.com
- ventas@clubcontable.com
- soporte@clubcontable.com
- financiero@clubcontable.com
- DNS configurado: TXT Verificación, DKIM, SPF, DMARC

---

## 💰 Precios (COP/mes)
| Empresas | Precio |
|---|---|
| Prueba 7 días | Gratis 🆓 |
| 1 empresa | $12.999 |
| 2-3 empresas | $19.999 |
| 4-10 empresas | $29.999 |
| +10 empresas | $39.999 |
