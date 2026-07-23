# MEMORY.md — Memoria permanente de Sandra

> Esta es tu memoria permanente y el ÚNICO archivo de memoria que se carga solo en cada sesión. Mantenla SIEMPRE al día. Aquí está el mapa de TODO tu trabajo; los detalles viven en las carpetas y en tu diario `memory/AAAA-MM-DD.md`.

## Quién es Sandra
Sandra Caicedo — agente de **Grupo Galilea** (seguros, ahorro e inversión) en Madrid, opera en toda España. Vendió su primera póliza y está montando su presencia online desde cero; dispone de ~2h/semana. También lleva **Club Contable** (Colombia). Tú eres **Alfa**, su asistente autónomo.

## Mapa de tu espacio de trabajo (/home/node/workspace)
Cuando trabajes en algo, ENTRA a la carpeta correspondiente y revisa/actualiza sus archivos. Todo esto ya existe:

**Seguros — CFG / Grupo Galilea (lo principal):**
- `crecimiento-financiero-global/`, `crecimientofinancieroglobal.com/` — web principal de CFG ✅ COMPLETA (23 jul)
- `cfg-seguros/` — web corporativa cfg-seguros.com (ramo seguros) ✅ COMPLETA
- `cfg-backend/`, `cfg-endpoint/`, `form-endpoint/`, `form-handler/` — backend y formularios de contacto
- `cfg-restauracion/`, `deploy-cfg-limpio/`, `deploy-netlify/` — despliegues y restauraciones
- `sandra-galilea/` — material Grupo Galilea

## ⚠️ REGLA IMPORTANTE — NO cerrar conversaciones
Nunca digas "cerramos", "¿cerramos?", "¿algo más o cerramos?", "¿seguimos o paramos aquí?" o cualquier variante. Sandra decide cuándo termina. Simplemente responde, actualiza, y espera.

**Club Contable (Colombia):**
- `clubcontable/` — plataforma clubcontable.com con backend Cloudflare Workers + D1
- `club-contable/`, `contabilidad/` — versiones anteriores

**Otros:**
- `sandra-tech/` — proyecto/marca SandraTech
- `Fivver/` — trabajos de Fiverr
- `proyectos/` — proyectos varios
- `pendientes/` — tareas pendientes
- `logo-opciones/definitivo/` — logos CFG (icono + header + moderno)

**Credenciales y respaldos (SENSIBLE — nunca las pegues en el chat):**
- `CONTRASEÑAS/`, `.creds/` (incluye `cloudflare.json`), `credenciales.md`, `CLAVES.md`
- `backup-web-*` — respaldos

**Tu memoria y diario:**
- `MEMORY.md` (este archivo)
- `memory/AAAA-MM-DD.md` — tu DIARIO por día

## Historial (resumen)
- **17 jun:** configuración de voz (TTS)
- **21 jun:** arranque — Sandra (Grupo Galilea, Madrid)
- **26–28 jun:** web crecimientofinancieroglobal.com montada
- **29 jun – 1 jul:** revisiones, ajustes, CFG seguros
- **jul:** CFG seguros, Club Contable y Fiverr en marcha
- **18 jul:** Club Contable: Backend D1 completo, frontend con login real, panel admin y reportes
- **19 jul:** Club Contable MULTIEMPRESA ✅ — Backend v2 con empresas
- **20 jul:** Jornada maratónica Club Contable (Worker v2, frontend reescrito 3 veces)
- **21 jul:** Crecimiento Financiero Global desplegada + videos CFG
- **22 jul:** Club Contable restaurado, logo Cuenta T, actualizaciones varias
- **23 jul:** ⭐ **DÍA CLAVE** — crecimientofinancieroglobal.com completada al 100%

==================== ESTADO ACTUAL DE PROYECTOS ====================

---

## 🟢 crecimientofinancieroglobal.com — COMPLETA ✅ (23 jul 2026)

### Estado final
- ✅ Diseño profesional responsive completo
- ✅ Logo CFG en cabecera (logo-cfg-header.png) + favicon
- ✅ 48 artículos en 7 categorías
- ✅ Sección Estudiar España Colombia (7 artículos + testimonios)
- ✅ 7 fotos reales Unsplash en Estudiar España
- ✅ Newsletter suscripción (Web3Forms)
- ✅ Portafolio PDF profesional para clientes
- ✅ Guía PDF para compartir en Facebook (textos listos para copiar/pegar)
- ✅ WhatsApp flotante + formulario contacto
- ✅ Google Analytics (G-XVVBY349WZ) + Search Console
- ✅ Sitemap 50 URLs
- ✅ Quiénes somos + valores + estadísticas (95% visados, 50+ estudiantes)
- ✅ Testimonios mejorados con badges de resultados
- ✅ Redes sociales en footer
- ✅ Páginas legales: Aviso Legal + Privacidad
- ✅ Sin precios visibles en la web (consulta gratuita)
- ✅ CTA "Solicitar presupuesto gratuito"
- ✅ Sin Sandra/Galilea en contacto

### Lo que necesita para generar ingresos (no código)
1. ⏳ Que **Sandra comparta en Facebook** (guía PDF ya tiene)
2. ⏳ Que **financeAds acepte** para poner enlaces de afiliado
3. ⏳ **Tiempo** para que Google posicione (2-3 semanas)
4. ⏳ Publicar 1-2 artículos/semana para contenido fresco

## 🟢 cfg-seguros.com — MEJORADO (23 jul 2026)
- ✅ OG tags (og:title, og:description) en TODAS las páginas (16/16)
- ✅ Schema.org (datos estructurados) en todas las páginas
- ✅ CTAs "Solicitar presupuesto" visibles en cada producto y blog
- ✅ Footer añadido a páginas de blog
- ✅ Todo subido a GitHub y desplegado

---

## 🟢 cfg-seguros.com — COMPLETO ✅

### Estado actual
- ✅ 16 páginas funcionando, formulario Web3Forms, WhatsApp flotante
- ✅ 6 seguros (vida, salud, hogar, coche, empresas, ahorro-inversión)
- ✅ Blog con 4 artículos
- ✅ Redes sociales: IG @cfg_seguros_gg, FB CFG Seguros, LinkedIn cfg-seguros, TikTok @cfgsegurosgg
- ✅ Google Search Console verificado
- ✅ Google Business Profile en revisión
- ✅ Deploy automático GitHub → Cloudflare Pages (sandluc22/cfg-seguros)
- ✅ Supervende (bot "Lucía") configurado y activo

### Recordatorios activos
- ✅ Saludo diario 6:30h — Activo
- ✅ Publicar lun/mié/vie 6:30h — Activo (cron expr: 30 6 * * 1,3,5 Europe/Madrid)
- ✅ Cierre del día 22:30h — Activo (cron expr: 30 22 * * * Europe/Madrid)

### Próximos pasos
- ⏳ Próxima tanda de posts: viernes 24 jul 6:30h
- ⏳ Viernes 24 jul 20:00h — revisar seguidores
- ⏳ Google Business Profile (esperando carta)

---

## 🟢 Club Contable — MULTIEMPRESA ✅

### Estado
- API backend v2 desplegada en Cloudflare Worker
- D1 database con multiempresa operativa
- Login: admin@clubcontable.com / admin2025
- Frontend con colores CFG (azul #2563eb + amarillo hover)
- Logo Cuenta T (T + C$C) con eslogan "Menos estrés, más control"
- Web3Forms conectado (suscripción + contacto)
- Ficha técnica actualizada
- Panel gestor oculto hasta login

### Migadu — Correos clubcontable.com
- info@, ventas@, soporte@, financiero@clubcontable.com

### Repositorio
- GitHub: sandluc22/clubcontable (master) → Cloudflare Pages + Worker
- URL: https://clubcontable.com
- API: https://clubcontable-api.crecimientofinancieroglobal.workers.dev

### Estado actual HOY (23 jul 2026) — EN DESARROLLO 🏗️
- ✅ Gestor de Citas: API completa con endpoints CRUD + DB
- ✅ Página pública agendar.html: clientes piden cita sin login
- ✅ Zona Relax: 4 pestañas (Música, Videos, Humor, Juegos con Wordle Contable)
- ✅ Sección Productos: tarjetas con gestores disponibles
- ✅ Notificaciones automáticas: WhatsApp Cloud API + Email (Resend)
- ✅ Guía WhatsApp para clientes
- 🏗️ Sistema de clientes: login por cliente, paneles independientes
- 🟡 Login Gestor de Tareas — pendiente de arreglar
- ❌ Google Sheets (pendiente)
- ❌ Sistema PSE / pagos Colombia (pendiente)

---

## 🎬 Videos CFG — CREADOS (21 jul 2026)
7 videos generados (CFG Global + Seguros) con ffmpeg + Unsplash/Pexels.
Ubicación: `/home/node/workspace/videos/para_enviar/` y `/home/node/workspace/videos-con-movimiento/`
Ficha técnica: `/home/node/workspace/videos/FICHA_TECNICA.md`

## ✈️ Aviación TikTok (marido de Sandra)
10 videos creados en `/home/node/workspace/aviacion/`

## 🟣 Gafi
Marketing de afiliados — Sin empezar

## 🎨 diseño-y-video
Carpeta central con fichas de herramientas y scripts

---

## 🔐 Contraseñas
- Todo en `/home/node/workspace/CONTRASEÑAS/`

## 💰 Precios Club Contable
| Empresas | Precio COP/mes |
|---|---|
| Prueba 7 días | Gratis |
| 1 empresa | $12.999 |
| 2-3 empresas | $19.999 |
| 4-10 empresas | $29.999 |
| +10 empresas | $39.999 |

## 🎥 YouTube — Club Contable (ACTIVO, 23 jul)
- **Inspiración:** @MindsetTracy-c7b (mentalidad emprendedora/desarrollo personal)
- **Formato definitivo:** videos horizontales 1920x1080, 6-20 min, narración + imágenes Unsplash + texto en pantalla
- **Contenido:** libros de desarrollo personal/contabilidad resumidos para contadores
- **Voz:** Jorge (es-MX-JorgeNeural) — mexicano, grave, con autoridad ✅ DEFINITIVA
- **Herramientas:** Edge TTS (voz) + FFmpeg (montaje video) + Unsplash (imágenes)
- **Scripts guardados en:** `clubcontable/videos/gen_video_habitos.sh` y `gen_short01.sh`
- **Serie HÁBITOS ATÓMICOS completa (5 videos):**
  - Video 1: "Hábitos Atómicos para Contadores" → `clubcontable/videos/video_habitos_final.mp4` ✅
  - Video 2: "Las 4 Leyes en Acción" → `clubcontable/videos/video_habitos_02_final.mp4` ✅
  - Video 3: "Diseña tu Entorno" → `clubcontable/videos/video_habitos_03_final.mp4` ✅
  - Video 4: "Cómo Mantener los Hábitos" → `clubcontable/videos/video_habitos_04_final.mp4` ✅
  - Video 5: "Tu Plan de Hábitos de 30 Días" → `clubcontable/videos/video_habitos_05_final.mp4` ✅
- **Primer short:** "El contador que cobraba 50.000" → `clubcontable/videos/short01_final.mp4` ✅
- **Pendiente:** 
  - ⏳ Crear página Facebook Club Contable
  - ⏳ Crear canal YouTube Club Contable
  - ⏳ Buscar voz del video de doblaje automático que le gustó a Sandra
  - ⏳ Más adelante: podcast con contadores

## 🎯 ESTRATEGIA GLOBAL — Meta: 300.000€ para la casa 🏠

### Prioridades actuales
1. **CFG Seguros** — Publicar lun/mié/vie 6:30h. Revisar seguidores viernes 20h
2. **crecimientofinancieroglobal.com** — Compartir en Facebook + esperar financeAds + artículos semanales
3. **Club Contable** — Verificar login, preparar videos cortos YouTube, luego gestor de citas + zona relax
