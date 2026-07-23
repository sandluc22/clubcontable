// Club Contable - App
const API = 'https://clubcontable-api.crecimientofinancieroglobal.workers.dev';
let token = localStorage.getItem('token');

// ── Utilidades ──
function showToast(id, msg, type) {
  const t = document.getElementById(id);
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + (type || 'info');
  t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 4000);
}

function $(id) { return document.getElementById(id); }

// ── Login ──
async function login(e) {
  e.preventDefault();
  const em = $('loginEmail').value.trim();
  const pw = $('loginPass').value.trim();
  if (!em || !pw) return showToast('loginToast', 'Completa todos los campos', 'error');
  try {
    const r = await fetch(API + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: em, password: pw })
    });
    const d = await r.json();
    if (d.ok && d.token) {
      showToast('loginToast', '✅ Ingreso exitoso', 'ok');
      localStorage.setItem('token', d.token);
      localStorage.setItem('user', JSON.stringify(d.user || {}));
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('loginToast', '❌ ' + (d.error || 'Credenciales incorrectas'), 'error');
    }
  } catch (e) {
    showToast('loginToast', '❌ Error de conexión', 'error');
  }
}

// ── Cerrar sesión ──
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
}

// ── Suscripción newsletter (Web3Forms) ──
async function suscripcion(e) {
  e.preventDefault();
  const email = $('subEmail').value.trim();
  if (!email) return showToast('subToast', 'Escribe tu correo', 'error');
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '58b165d2-318b-4718-bb6a-9b46dbb4540d',
        email: email,
        subject: 'Club Contable - Nueva suscripción',
        from_name: 'Club Contable Web',
        botcheck: ''
      })
    });
    const d = await r.json();
    if (d.success) {
      showToast('subToast', '✅ ¡Gracias! Te mantendremos al día.', 'ok');
    } else {
      showToast('subToast', '❌ Error al suscribirte. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    showToast('subToast', '❌ Error de conexión.', 'error');
  }
  $('subEmail').value = '';
  btn.disabled = false;
}

// ── Contacto (Web3Forms) ──
async function contacto(e) {
  e.preventDefault();
  const nombre = $('conNombre').value.trim();
  const email = $('conEmail').value.trim();
  const asunto = $('conAsunto').value.trim();
  const msg = $('conMsg').value.trim();
  if (!nombre || !email || !msg) return showToast('conToast', 'Completa nombre, email y mensaje', 'error');
  const btn = e.target.querySelector('button');
  btn.disabled = true;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '58b165d2-318b-4718-bb6a-9b46dbb4540d',
        name: nombre,
        email: email,
        subject: 'Club Contable - Contacto: ' + (asunto || 'Sin asunto'),
        message: msg,
        botcheck: ''
      })
    });
    const d = await r.json();
    if (d.success) {
      showToast('conToast', '✅ Mensaje enviado. Te responderemos pronto.', 'ok');
    } else {
      showToast('conToast', '❌ Error al enviar. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    showToast('conToast', '❌ Error de conexión.', 'error');
  }
  $('conNombre').value = '';
  $('conEmail').value = '';
  $('conAsunto').value = '';
  $('conMsg').value = '';
  btn.disabled = false;
}

// ── FAQ Toggle ──
function toggleFaq(el) {
  const ans = el.nextElementSibling;
  if (ans) {
    ans.classList.toggle('open');
    const span = el.querySelector('span');
    if (span) span.textContent = ans.classList.contains('open') ? '−' : '+';
  }
}

// ── Panel gestor (requiere sesión) ──
function afterLogin(user) {
  document.getElementById('acceso').style.display = 'none';
  document.getElementById('panelGestor').style.display = 'block';
  document.getElementById('panelUserEmail').textContent = user.email || user.name || 'Usuario';
  cargarPanel();
}

// ── Cargar datos del panel ──
async function cargarPanel() {
  try {
    const [tareas, cats, subcats, empresas] = await Promise.all([
      fetchApi('/api/tareas'),
      fetchApi('/api/categorias'),
      fetchApi('/api/subcategorias'),
      fetchApi('/api/empresas')
    ]);
    renderTareas(tareas);
    renderCategorias(cats);
    renderSubcategorias(subcats);
    renderEmpresas(empresas);
    renderReportes(tareas, cats);
  } catch (e) {
    console.error('Error cargando panel:', e);
  }
}

async function fetchApi(path) {
  const r = await fetch(API + path, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const d = await r.json();
  return d.ok ? (d.result || []) : [];
}

// ── Render ──
function renderTareas(lista) {
  const c = $('listaTareas');
  if (!c) return;
  c.innerHTML = lista.map(t => `<div class="tarjeta"><strong>${t.nombre}</strong> ${t.completada ? '✅' : '⏳'}<br><small>${t.categoria_nombre || ''} · ${t.empresa_nombre || ''}</small></div>`).join('');
}

function renderCategorias(lista) {
  const c = $('listaCategorias');
  if (!c) return;
  c.innerHTML = lista.map(cat => `<div class="tarjeta"><strong>${cat.nombre}</strong></div>`).join('') || '<p class="text-gray">Sin categorías</p>';
}

function renderSubcategorias(lista) {
  const c = $('listaSubcategorias');
  if (!c) return;
  c.innerHTML = lista.map(s => `<div class="tarjeta"><strong>${s.nombre}</strong> <small>→ ${s.categoria_nombre || ''}</small></div>`).join('') || '<p class="text-gray">Sin subcategorías</p>';
}

function renderEmpresas(lista) {
  const sel = $('empresaSelect');
  if (!sel) return;
  sel.innerHTML = '<option value="">Seleccionar empresa</option>' + lista.map(e => `<option value="${e.id}">${e.nombre}</option>`).join('');
}

function renderReportes(tareas, cats) {
  const c = $('reportesContent');
  if (!c) return;
  const total = tareas.length;
  const completadas = tareas.filter(t => t.completada).length;
  const pct = total ? Math.round(completadas / total * 100) : 0;
  c.innerHTML = `
    <div class="tarjeta">📊 Completadas: ${completadas}/${total} (${pct}%)</div>
    <div class="barra-progreso"><div class="barra-llena" style="width:${pct}%"></div></div>
    ${cats.map(cat => {
      const ct = tareas.filter(t => t.categoria_id === cat.id);
      const cc = ct.filter(t => t.completada).length;
      const cp = ct.length ? Math.round(cc / ct.length * 100) : 0;
      return ct.length ? `<div class="tarjeta">${cat.nombre}: ${cc}/${ct.length} (${cp}%)</div>` : '';
    }).join('')}
  `;
}

// ── Crear elementos ──
async function crearTarea() {
  const nombre = $('tareaNombre').value.trim();
  const catId = $('tareaCategoria').value;
  const empId = $('empresaSelect').value;
  if (!nombre) return showToast('panelToast', 'Escribe un nombre', 'error');
  try {
    const r = await fetch(API + '/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ nombre, categoria_id: catId ? parseInt(catId) : null, empresa_id: empId ? parseInt(empId) : null })
    });
    const d = await r.json();
    if (d.ok) {
      showToast('panelToast', '✅ Tarea creada', 'ok');
      $('tareaNombre').value = '';
      cargarPanel();
    } else showToast('panelToast', '❌ ' + (d.error || 'Error'), 'error');
  } catch (e) { showToast('panelToast', '❌ Error de conexión', 'error'); }
}

async function crearCategoria() {
  const nombre = $('catNombre').value.trim();
  if (!nombre) return showToast('panelToast', 'Escribe un nombre', 'error');
  try {
    const r = await fetch(API + '/api/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ nombre })
    });
    const d = await r.json();
    if (d.ok) {
      showToast('panelToast', '✅ Categoría creada', 'ok');
      $('catNombre').value = '';
      cargarPanel();
    } else showToast('panelToast', '❌ ' + (d.error || 'Error'), 'error');
  } catch (e) { showToast('panelToast', '❌ Error de conexión', 'error'); }
}

async function crearSubcategoria() {
  const nombre = $('subcatNombre').value.trim();
  const catId = $('subcatCategoria').value;
  if (!nombre || !catId) return showToast('panelToast', 'Completa nombre y categoría', 'error');
  try {
    const r = await fetch(API + '/api/subcategorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ nombre, categoria_id: parseInt(catId) })
    });
    const d = await r.json();
    if (d.ok) {
      showToast('panelToast', '✅ Subcategoría creada', 'ok');
      $('subcatNombre').value = '';
      cargarPanel();
    } else showToast('panelToast', '❌ ' + (d.error || 'Error'), 'error');
  } catch (e) { showToast('panelToast', '❌ Error de conexión', 'error'); }
}

// ── Navegación panel ──
function mostrarSeccion(id) {
  document.querySelectorAll('.panel-section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById(id);
  if (sec) sec.style.display = 'block';
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  // Verificar sesión al cargar
  const userData = localStorage.getItem('user');
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      afterLogin(user);
    } catch (e) { /* no hay sesión */ }
  }
});
