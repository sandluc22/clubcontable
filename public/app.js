// Club Contable - App
const API = 'https://clubcontable-api.crecimientofinancieroglobal.workers.dev';
let token = localStorage.getItem('token');

console.log('Club Contable - App cargada', token ? 'sesión detectada' : 'sin sesión');

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
  console.log('login() llamada');
  const em = $('loginEmail');
  const pw = $('loginPass');
  if (!em || !pw) { console.error('No se encontraron campos login'); return; }
  const email = em.value.trim();
  const pass = pw.value.trim();
  if (!email || !pass) return showToast('loginToast', 'Completa todos los campos', 'error');
  try {
    console.log('Enviando login...');
    const r = await fetch(API + '/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await r.json();
    console.log('Respuesta login:', d.ok);
    if (d.ok && d.token) {
      showToast('loginToast', '✅ Ingreso exitoso', 'ok');
      localStorage.setItem('token', d.token);
      localStorage.setItem('user', JSON.stringify(d.user || {}));
      setTimeout(() => window.location.reload(), 1000);
    } else {
      showToast('loginToast', '❌ ' + (d.error || 'Credenciales incorrectas'), 'error');
    }
  } catch (e) {
    console.error('Error login:', e);
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
  console.log('suscripcion() llamada');
  const email = $('subEmail');
  if (!email) { console.error('No se encontró subEmail'); return; }
  const val = email.value.trim();
  if (!val) return showToast('subToast', 'Escribe tu correo', 'error');
  const btn = e.target.querySelector('button');
  if (btn) btn.disabled = true;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '58b165d2-318b-4718-bb6a-9b46dbb4540d',
        email: val,
        subject: 'Club Contable - Nueva suscripción',
        from_name: 'Club Contable Web',
        botcheck: ''
      })
    });
    const d = await r.json();
    console.log('Respuesta suscripcion:', d.success);
    if (d.success) {
      showToast('subToast', '✅ ¡Gracias! Te mantendremos al día.', 'ok');
    } else {
      showToast('subToast', '❌ Error al suscribirte. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    console.error('Error suscripcion:', e);
    showToast('subToast', '❌ Error de conexión.', 'error');
  }
  email.value = '';
  if (btn) btn.disabled = false;
}

// ── Contacto (Web3Forms) ──
async function contacto(e) {
  e.preventDefault();
  console.log('contacto() llamada');
  const nombre = $('conNombre');
  const email = $('conEmail');
  const asunto = $('conAsunto');
  const msg = $('conMsg');
  if (!nombre || !email || !msg) { console.error('No se encontraron campos contacto'); return; }
  const nv = nombre.value.trim();
  const ev = email.value.trim();
  const av = asunto.value.trim();
  const mv = msg.value.trim();
  if (!nv || !ev || !mv) return showToast('conToast', 'Completa nombre, email y mensaje', 'error');
  const btn = e.target.querySelector('button');
  if (btn) btn.disabled = true;
  try {
    const r = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: '58b165d2-318b-4718-bb6a-9b46dbb4540d',
        name: nv,
        email: ev,
        subject: 'Club Contable - Contacto: ' + (av || 'Sin asunto'),
        message: mv,
        botcheck: ''
      })
    });
    const d = await r.json();
    console.log('Respuesta contacto:', d.success);
    if (d.success) {
      showToast('conToast', '✅ Mensaje enviado. Te responderemos pronto.', 'ok');
    } else {
      showToast('conToast', '❌ Error al enviar. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    console.error('Error contacto:', e);
    showToast('conToast', '❌ Error de conexión.', 'error');
  }
  nombre.value = '';
  email.value = '';
  asunto.value = '';
  msg.value = '';
  if (btn) btn.disabled = false;
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

// ── Init ──
try {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Usuario recuperado:', user.email);
        document.getElementById('acceso').style.display = 'none';
      } catch (e) {
        console.warn('Token corrupto, limpiando');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        token = null;
      }
    }
  });
} catch(e) {
  console.error('Error en init:', e);
}

console.log('App lista - funciones disponibles: login, suscripcion, contacto, toggleFaq, logout');
