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
    console.error(e);
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
  const email = $('subEmail');
  if (!email) return;
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
    if (d.success) {
      showToast('subToast', '✅ ¡Gracias! Te mantendremos al día.', 'ok');
    } else {
      showToast('subToast', '❌ Error al suscribirte. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    showToast('subToast', '❌ Error de conexión.', 'error');
    console.error(e);
  }
  email.value = '';
  if (btn) btn.disabled = false;
}

// ── Contacto (Web3Forms) ──
async function contacto(e) {
  e.preventDefault();
  const nombre = $('conNombre');
  const email = $('conEmail');
  const asunto = $('conAsunto');
  const msg = $('conMsg');
  if (!nombre || !email || !msg) return;
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
    if (d.success) {
      showToast('conToast', '✅ Mensaje enviado. Te responderemos pronto.', 'ok');
    } else {
      showToast('conToast', '❌ Error al enviar. Intenta de nuevo.', 'error');
    }
  } catch (e) {
    showToast('conToast', '❌ Error de conexión.', 'error');
    console.error(e);
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
document.addEventListener('DOMContentLoaded', function() {
  // Limpiar cualquier token malo que haya quedado
  const userData = localStorage.getItem('user');
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      if (user && user.email) {
        document.getElementById('acceso').style.display = 'none';
      }
    } catch (e) {
      // Token corrupto, limpiar
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      token = null;
    }
  }
});
