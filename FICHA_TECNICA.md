# FICHA TÉCNICA — Club Contable

> **URL:** https://clubcontable.com
> **API:** https://clubcontable-api.crecimientofinancieroglobal.workers.dev
> **Login admin:** admin@clubcontable.com / admin2025
> **Ruta directa login:** https://clubcontable.com/#acceso

---

## 1. DATOS DEL PROYECTO

| Campo | Valor |
|---|---|
| **Nombre del sitio** | Club Contable |
| **Dominio principal** | clubcontable.com |
| **Propietaria** | Sandra Caicedo |
| **País** | Colombia |
| **Idioma** | Español (es) |
| **Fecha de lanzamiento** | Julio 2026 |
| **Estado** | Activo / En desarrollo |

---

## 2. INFRAESTRUCTURA TÉCNICA

| Componente | Tecnología | Estado |
|---|---|---|
| **Hosting frontend** | Cloudflare Pages | ✅ Activo |
| **Backend API** | Cloudflare Workers (ES module) | ✅ Activo |
| **Base de datos** | Cloudflare D1 (SQLite) | ✅ Activo |
| **CDN** | Cloudflare (global) | ✅ Activo |
| **SSL** | Automático Cloudflare | ✅ Activo |
| **Repositorio** | GitHub sandluc22/clubcontable (master) | ✅ Conectado |
| **Deploy frontend** | Automático desde GitHub | ✅ |
| **Output directory** | `/public` | ✅ |
| **Proyecto Pages** | `clubcontable-front` | ✅ |
| **Proyecto Worker** | `clubcontable-api` | ✅ |
| **Database** | `clubcontable-db` | ✅ |

### Tokens y credenciales
- **Token Cloudflare Workers + D1:** Guardado en `.creds/cloudflare.json`
- **Account ID:** `72305fb85467e89da2940e359f9e09cc`
- **Último commit web:** `8d63d93` — "Fusion: web informativa + panel gestor con login" (22 jul)

---

## 3. CORREOS (Migadu)

| Dirección | Función |
|---|---|
| info@clubcontable.com | Información general |
| ventas@clubcontable.com | Ventas |
| soporte@clubcontable.com | Soporte técnico |
| financiero@clubcontable.com | Facturación |

✅ DNS configurado: TXT Verificación, DKIM, SPF, DMARC

---

## 4. ESTRUCTURA DEL SITIO

### Web informativa (visible sin login)

| Sección | Contenido |
|---|---|
| **Inicio** | Hero + tarjetas explicativas del gestor de tareas |
| **Guías** | 3 artículos: contabilidad pymes, facturación electrónica, calendario tributario |
| **Herramientas** | Calculadora IVA, calendario vencimientos, formatos (próximamente) |
| **Para empresas** | Libros contables, autónomos, beneficios tributarios |
| **Para contadores** | Responsabilidades, organización, software vs Excel |
| **Gestor de tareas** | Cápsula informativa + login + precios + suscripción |
| **Novedades** | Normativas contables y fiscales Colombia |
| **FAQ** | Preguntas frecuentes |
| **Contacto** | Formulario de contacto |

### Panel del gestor (visible tras login)

| Sección | Función |
|---|---|
| **Dashboard** | Resumen de tareas con % cumplimiento |
| **Tareas** | CRUD completo (crear, listar, eliminar) |
| **Categorías** | CRUD de categorías |
| **Subcategorías** | CRUD filtrado por categoría |
| **Reportes** | Reportes por categoría y empresa |
| **Admin** | Crear usuarios y empresas (solo admin) |

---

## 5. MAPA DEL SITIO (páginas / secciones)

```
clubcontable.com/
├── #inicio      → Presentación + tarjetas
├── #guias       → Artículos informativos
├── #herramientas→ Calculadoras y recursos
├── #empresas    → Contenido para pymes
├── #contadores  → Contenido profesional
├── #gestor      → Info del producto + login (#acceso) + precios + suscripción
├── #novedades   → Normativas contables y fiscales
├── #faq         → Preguntas frecuentes
├── #contacto    → Formulario de contacto
└── #acceso      → Login (ancla directa al formulario)
```

---

## 6. API — ENDPOINTS

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/login` | Autenticación (email + password → token) |
| GET | `/api/categorias` | Listar categorías |
| POST | `/api/categorias` | Crear categoría |
| POST | `/api/categorias/delete` | Eliminar categoría |
| GET | `/api/subcategorias?categoria_id=X` | Listar subcategorías |
| POST | `/api/subcategorias` | Crear subcategoría |
| POST | `/api/subcategorias/delete` | Eliminar subcategoría |
| GET | `/api/tareas?empresa_id=X&usuario_id=X` | Listar tareas |
| POST | `/api/tareas` | Crear tarea |
| POST | `/api/tareas/delete` | Eliminar tarea |
| GET | `/api/dashboard?empresa_id=X` | Dashboard con estadísticas |
| GET | `/api/empresas` | Listar empresas |
| POST | `/api/empresas` | Crear empresa |
| GET | `/api/usuarios` | Listar usuarios (admin) |

---

## 7. PRECIOS (COP/mes)

| Empresas | Precio |
|---|---|
| Prueba 7 días | Gratis 🆓 |
| 1 empresa | $12.999 |
| 2-3 empresas | $19.999 |
| 4-10 empresas | $29.999 |
| +10 empresas | $39.999 |

---

## 8. DISEÑO

| Elemento | Valor |
|---|---|
| **Fuente** | Inter (Google Fonts) |
| **Layout** | Una página con scroll suave, secciones ancladas |
| **Responsive** | Menú hamburguesa en móvil, grid adaptable |
| **Color fondo** | #f8fafc |
| **Color texto** | #1e293b |
| **Color primario** | #2563eb (azul) |
| **Hover primario** | #1d4ed8 |
| **Color acento** | #f59e0b (amarillo) |
| **Header** | #1e293b (oscuro) |

---

## 9. FLUJO DE USUARIO

1. Visitante entra a **clubcontable.com**
2. Navega por la web informativa (guías, precios, FAQ...)
3. Va a la sección **Gestor de tareas** → ve la información del producto + precios
4. Si tiene cuenta, pone email + contraseña en el **login (#acceso)**
5. Al hacer login exitoso → se oculta la web informativa → se muestra el **panel del gestor**
6. Admin puede crear usuarios y empresas desde el panel
7. Cada cliente ve solo sus empresas y tareas

---

## 10. PENDIENTES

- [ ] Conectar formularios (suscripción y contacto) a Web3Forms para que lleguen correos a Sandra
- [ ] Sandra probar login en clubcontable.com desde el móvil y confirmar que funciona
- [ ] Ajustar diseño del panel al nuevo estilo de la web informativa
- [ ] Más contenido: artículos para Guías, Empresas, Contadores
- [ ] Filtro reportes por rango de fechas
- [ ] Panel Admin: asignar empresa a usuario existente
- [ ] Nombre del producto dentro de Club Contable
- [ ] Verificar que se vea correctamente en producción
