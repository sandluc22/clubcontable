# 📋 FICHA — Club Contable

**Propietaria:** Sandra Caicedo
**Desarrollador:** Alfa (OpenClaw)
**Última actualización:** 19-jul-2026

---

## 📌 DATOS GENERALES

| Elemento | Detalle |
|---|---|
| **Nombre** | Club Contable |
| **Concepto** | Gestión tributaria Colombia 🇨🇴 |
| **Dominio** | clubcontable.com |
| **Stack frontend** | HTML puro + CSS + JS (API real con Cloudflare) |
| **API backend** | Cloudflare Worker (ES module) + D1 database |
| **URL API** | https://clubcontable-api.crecimientofinancieroglobal.workers.dev |
| **DNS** | Cloudflare (proxy naranja) — SSL activo ✅ |
| **Código fuente** | `/home/node/workspace/clubcontable/` |
| **Frontend deploy** | Cloudflare Pages (desde GitHub sandluc22/clubcontable) |
| **GitHub** | https://github.com/sandluc22/clubcontable |

---

## ✅ ESTADO ACTUAL

### Backend (Cloudflare Workers + D1) — ✅ COMPLETO

| Componente | Estado | Detalle |
|---|---|---|
| **Worker clubcontable-api** | ✅ Creado + desplegado | ES module con wrangler |
| **Binding D1 (DB)** | ✅ Configurado | `database_id: 9025f5c2-19a7-4561-8a52-b23132374b42` |
| **D1 database** | ✅ Creada y poblada | Tablas: empresas, usuarios, categorias, subcategorias, tareas |
| **Login** | 🟡 Error 1042 | Worker se cuelga con D1. Posible fix: Compatibility Date → 2024-09-23+ |
| **API endpoints** | 🟡 Worker caído | Error 1042 impide ejecución del worker |

### Endpoints de la API

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/login` | POST | Login (email + password) |
| `/api/reset` | POST | Reset base de datos a valores iniciales |
| `/api/categorias` | GET | Listar categorías |
| `/api/subcategorias` | GET | Listar subcategorías (filtro: `?categoria_id=X`) |
| `/api/tareas` | GET | Listar tareas (filtro: `?usuario_id=X`) |
| `/api/tareas` | POST | Crear tarea |
| `/api/empresas` | GET | Listar empresas |

### Frontend (localStorage) — 🟡 Pendiente migrar a API real

| Elemento | Estado |
|---|---|
| **HTML/CSS completo** | ✅ En `/home/node/workspace/clubcontable/codigo/index.html` |
| **Login con selector de usuarios** | ✅ Funcionando (localStorage) |
| **Categorías y subcategorías** | ✅ Reordenadas y funcionales |
| **Persistencia localStorage** | ✅ |
| **Migrar a login real con API** | ❌ Pendiente |
| **Migrar tareas a D1** | ❌ Pendiente |

---

## 📍 CÓDIGO FUENTE

```
/home/node/workspace/clubcontable/
├── codigo/
│   └── index.html              — Frontend (HTML + CSS + JS)
├── worker-v2.js                — Código Worker versión 2 (obsoleto)
├── worker-esm.js               — ES module (copia de seguridad)
├── src-worker.mjs              — Código activo del Worker ES module
├── worker.mjs                  — Copia del Worker
├── wrangler.toml               — Config wrangler
├── init-db.sql                 — SQL de creación de tablas
├── seed-data.sql               — SQL de datos iniciales
├── subcategorias.sql           — SQL de subcategorías
├── deploy.zip                  — ZIP de deploy
└── varios .js / .mjs           — Versiones anteriores
```

---

## ⏳ PENDIENTES

### Alta prioridad
- [ ] Migrar frontend a API real (login con email/contraseña desde D1, no localStorage)
- [ ] Hacer que el frontend guarde tareas en D1 en lugar de localStorage
- [ ] Sincronizar GitHub con Cloudflare (deploy automático)

### 🟡 URGENTE
- [ ] Arreglar error 1042 — cambiar Compatibility Date a 2024-09-23+
- [ ] Verificar diseño de subcategorías dentro de categorías
- [ ] Probar login admin2025

### 🟢 SIGUIENTES
- [ ] Diseño tipo Cloudflare (menú lateral)
- [ ] Diseño responsive/móvil
- [ ] Configurar Google Search Console para clubcontable.com

### ⏳ FUTURO
- [ ] Plan de marketing Colombia 🇨🇴
- [ ] Pasarela de pago (precios desde $12.999 COP/mes)

---

## 🔑 CREDENCIALES

| Servicio | Detalle |
|---|---|
| **Cloudflare** | sandluc22@gmail.com |
| **Account ID** | `72305fb85467e89da2940e359f9e09cc` |
| **Zone ID** | (DNS en Cloudflare) |
| **D1 Database ID** | `9025f5c2-19a7-4561-8a52-b23132374b42` |
| **Token API** | En `.creds/cloudflare.json` |
| **Usuario test API** | admin@clubcontable.com / admin2025 |

---

## 🐛 PROBLEMAS CONOCIDOS

- 🟡 Error 1042 en worker — el binding D1 manual no termina de sincronizar con el worker. Solución: cambiar Compatibility Date a 2024-09-23+
- La API NO responde por el error 1042, el login falla (admin2025 sí está en DB)
- Binding D1 configurado manualmente (DB → clubcontable-db) pero choca con subida multipart
- Sandra usa tablet/Android — no puede borrar bindings ni editar código en Cloudflare


## 💰 PRECIOS (definidos 19 jul)

| Empresas | Precio COP/mes |
|---|---|
| Prueba 7 días | Gratis 🆓 |
| 1 empresa | $12.999 |
| 2-3 empresas | $19.999 |
| 4-10 empresas | $29.999 |
| +10 empresas | $39.999 |
