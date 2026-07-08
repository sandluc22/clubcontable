const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'clubcontable.db');

// Si la DB ya existe, no hacer nada
if (fs.existsSync(dbPath)) {
    console.log('✅ DB ya existe');
    process.exit(0);
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Crear tablas
db.exec(`
    CREATE TABLE empresas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        rol TEXT DEFAULT 'usuario',
        empresa_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );

    CREATE TABLE actividades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        empresa_id INTEGER NOT NULL,
        categoria TEXT DEFAULT 'otras',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );

    CREATE TABLE tareas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER NOT NULL,
        actividad_id INTEGER NOT NULL,
        empresa_id INTEGER NOT NULL,
        completada INTEGER DEFAULT 0,
        fecha_asignada TEXT,
        fecha_limite TEXT,
        fecha_completada TEXT,
        notas TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (actividad_id) REFERENCES actividades(id),
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    );

    CREATE TABLE logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        accion TEXT,
        detalle TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE articulos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        contenido TEXT,
        autor TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Empresas
db.prepare('INSERT INTO empresas (nombre) VALUES (?)').run('Celpa');
db.prepare('INSERT INTO empresas (nombre) VALUES (?)').run('Copropiedad');

const passSandra = bcrypt.hashSync('Sandra2925', 10);
const passMaria = bcrypt.hashSync('MariaAngel2026', 10);
const passYurleny = bcrypt.hashSync('Yurleny2026', 10);
const passKareling = bcrypt.hashSync('Kareling2026', 10);

// Admin
db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?,?,?,?,?)')
    .run('Sandra Caicedo', 'sandluc22@gmail.com', passSandra, 'admin', 1);

// Asistentes
db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?,?,?,?,?)')
    .run('María Ángel', 'aux.contable@celpa.com.co', passMaria, 'usuario', 1);
db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?,?,?,?,?)')
    .run('Yurleny', 'cartera@celpa.com.co', passYurleny, 'usuario', 1);
db.prepare('INSERT INTO usuarios (nombre, correo, password, rol, empresa_id) VALUES (?,?,?,?,?)')
    .run('Kareling', 'aux.contable2@celpa.com.co', passKareling, 'usuario', 1);

// Actividades (64 de Celpa)
const actividades = JSON.parse(fs.readFileSync('/home/node/workspace/proyectos/Club Contable/actividades.json', 'utf8'));

const insertAct = db.prepare('INSERT INTO actividades (nombre, empresa_id, categoria) VALUES (?,?,?)');
for (const act of actividades) {
    if (act.empresa === 'Celpa' || act.empresa_id === 1) {
        insertAct.run(act.nombre, 1, act.categoria || 'otras');
    }
    if (act.empresa === 'Copropiedad' || act.empresa_id === 2) {
        insertAct.run(act.nombre, 2, act.categoria || 'otras');
    }
}

// Asignar tareas a cada usuario (todas las actividades de su empresa)
const insertTarea = db.prepare('INSERT INTO tareas (usuario_id, actividad_id, empresa_id) VALUES (?,?,?)');
const users = db.prepare('SELECT id, empresa_id FROM usuarios').all();
const acts = db.prepare('SELECT id, empresa_id FROM actividades').all();

for (const user of users) {
    for (const act of acts) {
        if (act.empresa_id === user.empresa_id) {
            insertTarea.run(user.id, act.id, act.empresa_id);
        }
    }
}

console.log(`✅ Seed completado: ${actividades.length} actividades, ${users.length} usuarios`);
db.close();
