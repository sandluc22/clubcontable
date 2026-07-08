const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { initDatabase, seedDatabase, getDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'clubcontable_secret_2026';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar DB
const db = initDatabase();
seedDatabase(db);

// Middleware de autenticación
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido' });
    }
}

// Auth
app.post('/api/login', (req, res) => {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    
    const user = db.prepare('SELECT * FROM usuarios WHERE correo = ? AND activo = 1').get(correo);
    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const token = jwt.sign({ id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, empresa_id: user.empresa_id }, JWT_SECRET);
    res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol, empresa_id: user.empresa_id } });
});

// Empresas
app.get('/api/empresas', authMiddleware, (req, res) => {
    const empresas = db.prepare('SELECT * FROM empresas').all();
    res.json(empresas);
});

// Actividades por empresa
// Cambiar categoría de actividad
app.post('/api/actividades/:id/categoria', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const { categoria } = req.body;
    db.prepare('UPDATE actividades SET categoria = ? WHERE id = ?').run(categoria, req.params.id);
    res.json({ success: true });
});

// Asignar fecha a tarea
app.post('/api/tareas/:id/fecha', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const { fecha_entrega } = req.body;
    db.prepare('UPDATE tareas SET fecha_entrega = ? WHERE id = ?').run(fecha_entrega || null, req.params.id);
    res.json({ success: true });
});

app.get('/api/actividades/:empresa_id', authMiddleware, (req, res) => {
    const actividades = db.prepare('SELECT * FROM actividades WHERE empresa_id = ? AND activo = 1 ORDER BY categoria, nombre').all(req.params.empresa_id);
    // Agrupar por categoria
    const agrupadas = {};
    for (const a of actividades) {
        const c = a.categoria || 'otras';
        if (!agrupadas[c]) agrupadas[c] = [];
        agrupadas[c].push(a);
    }
    res.json({ actividades, agrupadas });
});

// Tareas del usuario
app.get('/api/tareas', authMiddleware, (req, res) => {
    let tareas;
    if (req.user.rol === 'admin') {
        tareas = db.prepare(`
            SELECT t.*, a.nombre as actividad_nombre, a.categoria, u.nombre as usuario_nombre, e.nombre as empresa_nombre
            FROM tareas t
            JOIN actividades a ON t.actividad_id = a.id
            JOIN usuarios u ON t.usuario_id = u.id
            JOIN empresas e ON t.empresa_id = e.id
            ORDER BY a.categoria, t.fecha_entrega ASC
        `).all();
    } else {
        tareas = db.prepare(`
            SELECT t.*, a.nombre as actividad_nombre, a.categoria, e.nombre as empresa_nombre
            FROM tareas t
            JOIN actividades a ON t.actividad_id = a.id
            JOIN empresas e ON t.empresa_id = e.id
            WHERE t.usuario_id = ?
            ORDER BY a.categoria, t.fecha_entrega ASC
        `).all(req.user.id);
    }
    res.json(tareas);
});

// Crear tarea (admin)
app.post('/api/tareas', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const { actividad_id, usuario_id, empresa_id, fecha_entrega, notas, articulo_destacado } = req.body;
    if (!actividad_id || !usuario_id || !empresa_id) return res.status(400).json({ error: 'Faltan campos' });
    
    const result = db.prepare('INSERT INTO tareas (actividad_id, usuario_id, empresa_id, fecha_entrega, notas, articulo_destacado) VALUES (?, ?, ?, ?, ?, ?)').run(
        actividad_id, usuario_id, empresa_id, fecha_entrega || null, notas || null, articulo_destacado || null
    );
    res.json({ id: result.lastInsertRowid, mensaje: 'Tarea creada' });
});

// Completar tarea
app.post('/api/tareas/:id/completar', authMiddleware, (req, res) => {
    const tarea = db.prepare('SELECT * FROM tareas WHERE id = ?').get(req.params.id);
    if (!tarea) return res.status(404).json({ error: 'Tarea no encontrada' });
    if (tarea.usuario_id !== req.user.id && req.user.rol !== 'admin') return res.status(403).json({ error: 'No autorizado' });
    
    db.prepare('UPDATE tareas SET completada = 1, completada_por = ?, fecha_completado = datetime("now") WHERE id = ?').run(req.user.id, req.params.id);
    db.prepare('INSERT INTO logs (tarea_id, usuario_id, accion) VALUES (?, ?, "completada")').run(req.params.id, req.user.id);
    res.json({ mensaje: 'Tarea completada' });
});

// Usuarios (admin)
app.get('/api/usuarios', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const usuarios = db.prepare('SELECT id, nombre, correo, rol, empresa_id, activo FROM usuarios').all();
    res.json(usuarios);
});

// Crear usuario (admin)
app.post('/api/usuarios', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const { nombre, correo, password, rol, empresa_id } = req.body;
    if (!nombre || !correo || !password) return res.status(400).json({ error: 'Faltan campos' });
    
    const hash = bcrypt.hashSync(password, 10);
    try {
        const result = db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?, ?, ?, ?, ?)').run(
            nombre, correo, hash, rol || 'asistente', empresa_id || null
        );
        // Asignar todas las actividades de la empresa al nuevo usuario
        if (empresa_id) {
            const actividades = db.prepare('SELECT id FROM actividades WHERE empresa_id = ? AND activo = 1').all(empresa_id);
            const insertTarea = db.prepare('INSERT OR IGNORE INTO tareas (actividad_id, usuario_id, empresa_id, completada) VALUES (?, ?, ?, 0)');
            for (const act of actividades) {
                insertTarea.run(act.id, result.lastInsertRowid, empresa_id);
            }
        }
        res.json({ id: result.lastInsertRowid, mensaje: 'Usuario creado' });
    } catch (e) {
        res.status(400).json({ error: 'El correo ya existe' });
    }
});

// Artículos destacados
app.get('/api/articulos/:empresa_id', authMiddleware, (req, res) => {
    const articulos = db.prepare('SELECT * FROM articulos WHERE empresa_id = ? AND activo = 1 ORDER BY created_at DESC').all(req.params.empresa_id);
    res.json(articulos);
});

app.post('/api/articulos', authMiddleware, (req, res) => {
    if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Solo admin' });
    const { empresa_id, titulo, contenido, url } = req.body;
    const result = db.prepare('INSERT INTO articulos (empresa_id, titulo, contenido, url) VALUES (?, ?, ?, ?)').run(empresa_id, titulo, contenido, url);
    res.json({ id: result.lastInsertRowid });
});

// Log de actividad
app.get('/api/logs', authMiddleware, (req, res) => {
    const logs = db.prepare(`
        SELECT l.*, u.nombre as usuario_nombre
        FROM logs l
        JOIN usuarios u ON l.usuario_id = u.id
        ORDER BY l.created_at DESC LIMIT 50
    `).all();
    res.json(logs);
});

// Dashboard stats
app.get('/api/stats', authMiddleware, (req, res) => {
    let stats;
    if (req.user.rol === 'admin') {
        stats = {
            total_tareas: db.prepare('SELECT COUNT(*) as c FROM tareas').get().c,
            completadas: db.prepare('SELECT COUNT(*) as c FROM tareas WHERE completada = 1').get().c,
            pendientes: db.prepare('SELECT COUNT(*) as c FROM tareas WHERE completada = 0').get().c,
            vencidas: db.prepare("SELECT COUNT(*) as c FROM tareas WHERE completada = 0 AND fecha_entrega < date('now')").get().c,
            usuarios: db.prepare('SELECT COUNT(*) as c FROM usuarios WHERE activo = 1').get().c,
            empresas: db.prepare('SELECT COUNT(*) as c FROM empresas').get().c
        };
    } else {
        stats = {
            total_tareas: db.prepare('SELECT COUNT(*) as c FROM tareas WHERE usuario_id = ?').get(req.user.id).c,
            completadas: db.prepare('SELECT COUNT(*) as c FROM tareas WHERE usuario_id = ? AND completada = 1').get(req.user.id).c,
            pendientes: db.prepare('SELECT COUNT(*) as c FROM tareas WHERE usuario_id = ? AND completada = 0').get(req.user.id).c,
            vencidas: db.prepare("SELECT COUNT(*) as c FROM tareas WHERE usuario_id = ? AND completada = 0 AND fecha_entrega < date('now')").get(req.user.id).c,
        };
    }
    // Tareas próximas a vencer (7 días)
    stats.proximas = db.prepare("SELECT COUNT(*) as c FROM tareas WHERE completada = 0 AND fecha_entrega BETWEEN date('now') AND date('now','+7 days')").get().c;
    res.json(stats);
});

// Todo el HTML se sirve desde public/
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Club Contable API corriendo en http://0.0.0.0:${PORT}`);
});
