const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'clubcontable.db');

function initDatabase() {
    const db = new Database(DB_PATH);
    
    // Activar WAL para mejor rendimiento
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    // Crear tablas
    db.exec(`
        -- Empresas
        CREATE TABLE IF NOT EXISTS empresas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            nombre TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Usuarios
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL DEFAULT 'asistente',
            empresa_id INTEGER,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        );
        
        -- Actividades (tareas)
        CREATE TABLE IF NOT EXISTS actividades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa_id INTEGER NOT NULL,
            nombre TEXT NOT NULL,
            descripcion TEXT,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        );
        
        -- Tareas asignadas
        CREATE TABLE IF NOT EXISTS tareas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            actividad_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            empresa_id INTEGER NOT NULL,
            fecha_entrega DATE,
            completada INTEGER DEFAULT 0,
            completada_por INTEGER,
            fecha_completado DATETIME,
            notas TEXT,
            articulo_destacado TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (actividad_id) REFERENCES actividades(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (empresa_id) REFERENCES empresas(id),
            FOREIGN KEY (completada_por) REFERENCES usuarios(id)
        );
        
        -- Log de completado (historial)
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tarea_id INTEGER NOT NULL,
            usuario_id INTEGER NOT NULL,
            accion TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (tarea_id) REFERENCES tareas(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
        
        -- Artículos destacados
        CREATE TABLE IF NOT EXISTS articulos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empresa_id INTEGER NOT NULL,
            titulo TEXT NOT NULL,
            contenido TEXT,
            url TEXT,
            activo INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        );
    `);
    
    return db;
}

function seedDatabase(db) {
    // Verificar si ya hay datos
    const count = db.prepare('SELECT COUNT(*) as c FROM empresas').get();
    if (count.c > 0) return;
    
    const actividades = require('./actividades.json');
    
    // Crear empresas
    const insertEmpresa = db.prepare('INSERT INTO empresas (slug, nombre) VALUES (?, ?)');
    insertEmpresa.run('celpa', 'Celpa');
    insertEmpresa.run('copropiedad', 'Copropiedad');
    
    // Crear admin
    const adminPass = bcrypt.hashSync('admin123', 10);
    const insertUsuario = db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?, ?, ?, ?, ?)');
    insertUsuario.run('Sandra Caicedo', 'sandluc22@gmail.com', adminPass, 'admin', null);
    
    // Crear actividades para Celpa
    const insertActividad = db.prepare('INSERT INTO actividades (empresa_id, nombre) VALUES (?, ?)');
    const celpaActividades = actividades.empresas.celpa.actividades;
    const insertCelpa = db.transaction((acts) => {
        for (const a of acts) {
            insertActividad.run(1, a);
        }
    });
    insertCelpa(celpaActividades);
    
    // Copropiedad mismas actividades
    const insertCopropiedad = db.transaction((acts) => {
        for (const a of acts) {
            insertActividad.run(2, a);
        }
    });
    insertCopropiedad(celpaActividades);
    
    console.log(`✅ Datos iniciales cargados:
    - 2 empresas
    - ${celpaActividades.length} actividades por empresa
    - 1 admin (sandluc22@gmail.com)
    - Contraseña admin: admin123`);
}

function getDb() {
    return new Database(DB_PATH);
}

module.exports = { initDatabase, seedDatabase, getDb };
