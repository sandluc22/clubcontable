
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'clubcontable.db');

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
');

// Empresas
db.prepare('INSERT INTO empresas (nombre) VALUES (?)').run('Celpa');
db.prepare('INSERT INTO empresas (nombre) VALUES (?)').run('Copropiedad');

// Contraseñas
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

// Actividades
const insertAct = db.prepare('INSERT INTO actividades (nombre, empresa_id, categoria) VALUES (?,?,?)');

insertAct.run('SOL - Respuesta alcaldía', 1, 'legales');
insertAct.run('Actualizar RUT SOL', 1, 'legales');
insertAct.run('Supersociedades', 1, 'legales');
insertAct.run('Bloqueo documentos', 1, 'legales');
insertAct.run('Tasa Supersociedades', 1, 'legales');
insertAct.run('Verificación legalización anticipos', 1, 'tributarias');
insertAct.run('Verificación NR IVA 3500 UVT', 1, 'tributarias');
insertAct.run('Notas y conciliación de Impuestos', 1, 'tributarias');
insertAct.run('Informe de operaciones y por tercero', 1, 'tributarias');
insertAct.run('Verificación notas crédito y devoluciones', 1, 'tributarias');
insertAct.run('Facturas de compra - Listado DIAN', 1, 'tributarias');
insertAct.run('RADIAN y Doc. Electrónico', 1, 'tributarias');
insertAct.run('Operaciones sospechosas', 1, 'tributarias');
insertAct.run('Renovación factura electrónica', 1, 'tributarias');
insertAct.run('Borradores impuestos', 1, 'tributarias');
insertAct.run('Cálculo retefuente por salarios', 1, 'tributarias');
insertAct.run('Agentes de retención IVA factura', 1, 'tributarias');
insertAct.run('Certificado de ingresos y retenciones', 1, 'tributarias');
insertAct.run('Renta', 1, 'tributarias');
insertAct.run('Exógena DIAN', 1, 'tributarias');
insertAct.run('B/Tura - ICA', 1, 'tributarias');
insertAct.run('Traslado retenciones al Pasivo', 1, 'tributarias');
insertAct.run('Seguimiento circularizaciones - certificado retención', 1, 'tributarias');
insertAct.run('Solicitud certificados retenciones', 1, 'tributarias');
insertAct.run('Informe de cartera', 1, 'contables');
insertAct.run('Traslado al Inventario', 1, 'contables');
insertAct.run('Conciliación activos fijos', 1, 'contables');
insertAct.run('Revisión saldos de cartera', 1, 'contables');
insertAct.run('Libros oficiales', 1, 'contables');
insertAct.run('Activos fijos Celpa', 1, 'contables');
insertAct.run('Notas Estados Financieros', 1, 'contables');
insertAct.run('Conciliaciones bancarias', 1, 'cierre_mensual');
insertAct.run('Cierre Fiducia', 1, 'cierre_mensual');
insertAct.run('Cierre año - programa', 1, 'cierre_anual');
insertAct.run('Primas', 1, 'nomina');
insertAct.run('Seguridad social', 1, 'nomina');
insertAct.run('Nota Seguridad social', 1, 'nomina');
insertAct.run('Incapacidades por cobrar', 1, 'nomina');
insertAct.run('Vacaciones equipo', 1, 'nomina');
insertAct.run('Conciliación seguridad social', 1, 'nomina');
insertAct.run('Anexos Plan Maestro', 1, 'gerencia');
insertAct.run('Informe proveedores nuevos Celpa', 1, 'gerencia');
insertAct.run('Formato de proveedores - BEPROX', 1, 'gerencia');
insertAct.run('FIC', 1, 'otras');
insertAct.run('Gestión RUB (FEB, MAYO, AGO, NOV)', 1, 'otras');
insertAct.run('Conciliación de cuentas por pagar', 1, 'otras');
insertAct.run('Nóminas', 1, 'otras');
insertAct.run('Consolidación prestaciones (Excel)', 1, 'otras');
insertAct.run('Consolidación prestaciones (World Office)', 1, 'otras');
insertAct.run('Facturación usuarios', 1, 'otras');
insertAct.run('Conciliación vinculadas', 1, 'otras');
insertAct.run('Envío carpeta SOL', 1, 'otras');
insertAct.run('Bajar VISUM ADVYSORE', 1, 'otras');
insertAct.run('Conciliación fiscal', 1, 'otras');
insertAct.run('Bogotá - Exógena', 1, 'otras');
insertAct.run('B/Tura - Exógena', 1, 'otras');
insertAct.run('Cámara de Comercio Celpa Capital al mil', 1, 'otras');
insertAct.run('Paz y salvo Alcaldía', 1, 'otras');
insertAct.run('Visita Régimen Franco', 1, 'otras');
insertAct.run('Predial', 1, 'otras');
insertAct.run('Intereses cesantías', 1, 'otras');
insertAct.run('Cesantías', 1, 'otras');
insertAct.run('Evaluación de desempeño', 1, 'otras');
insertAct.run('Renovación Cámara de Comercio', 1, 'otras');
insertAct.run('SOL - Respuesta alcaldía', 2, 'legales');
insertAct.run('Actualizar RUT SOL', 2, 'legales');
insertAct.run('Supersociedades', 2, 'legales');
insertAct.run('Bloqueo documentos', 2, 'legales');
insertAct.run('Tasa Supersociedades', 2, 'legales');
insertAct.run('Verificación legalización anticipos', 2, 'tributarias');
insertAct.run('Verificación NR IVA 3500 UVT', 2, 'tributarias');
insertAct.run('Notas y conciliación de Impuestos', 2, 'tributarias');
insertAct.run('Informe de operaciones y por tercero', 2, 'tributarias');
insertAct.run('Verificación notas crédito y devoluciones', 2, 'tributarias');
insertAct.run('Facturas de compra - Listado DIAN', 2, 'tributarias');
insertAct.run('RADIAN y Doc. Electrónico', 2, 'tributarias');
insertAct.run('Operaciones sospechosas', 2, 'tributarias');
insertAct.run('Renovación factura electrónica', 2, 'tributarias');
insertAct.run('Borradores impuestos', 2, 'tributarias');
insertAct.run('Cálculo retefuente por salarios', 2, 'tributarias');
insertAct.run('Agentes de retención IVA factura', 2, 'tributarias');
insertAct.run('Certificado de ingresos y retenciones', 2, 'tributarias');
insertAct.run('Renta', 2, 'tributarias');
insertAct.run('Exógena DIAN', 2, 'tributarias');
insertAct.run('B/Tura - ICA', 2, 'tributarias');
insertAct.run('Traslado retenciones al Pasivo', 2, 'tributarias');
insertAct.run('Seguimiento circularizaciones - certificado retención', 2, 'tributarias');
insertAct.run('Solicitud certificados retenciones', 2, 'tributarias');
insertAct.run('Informe de cartera', 2, 'contables');
insertAct.run('Traslado al Inventario', 2, 'contables');
insertAct.run('Conciliación activos fijos', 2, 'contables');
insertAct.run('Revisión saldos de cartera', 2, 'contables');
insertAct.run('Libros oficiales', 2, 'contables');
insertAct.run('Activos fijos Celpa', 2, 'contables');
insertAct.run('Notas Estados Financieros', 2, 'contables');
insertAct.run('Conciliaciones bancarias', 2, 'cierre_mensual');
insertAct.run('Cierre Fiducia', 2, 'cierre_mensual');
insertAct.run('Cierre año - programa', 2, 'cierre_anual');
insertAct.run('Primas', 2, 'nomina');
insertAct.run('Seguridad social', 2, 'nomina');
insertAct.run('Nota Seguridad social', 2, 'nomina');
insertAct.run('Incapacidades por cobrar', 2, 'nomina');
insertAct.run('Vacaciones equipo', 2, 'nomina');
insertAct.run('Conciliación seguridad social', 2, 'nomina');
insertAct.run('Anexos Plan Maestro', 2, 'gerencia');
insertAct.run('Informe proveedores nuevos Celpa', 2, 'gerencia');
insertAct.run('Formato de proveedores - BEPROX', 2, 'gerencia');
insertAct.run('FIC', 2, 'otras');
insertAct.run('Gestión RUB (FEB, MAYO, AGO, NOV)', 2, 'otras');
insertAct.run('Conciliación de cuentas por pagar', 2, 'otras');
insertAct.run('Nóminas', 2, 'otras');
insertAct.run('Consolidación prestaciones (Excel)', 2, 'otras');
insertAct.run('Consolidación prestaciones (World Office)', 2, 'otras');
insertAct.run('Facturación usuarios', 2, 'otras');
insertAct.run('Conciliación vinculadas', 2, 'otras');
insertAct.run('Envío carpeta SOL', 2, 'otras');
insertAct.run('Bajar VISUM ADVYSORE', 2, 'otras');
insertAct.run('Conciliación fiscal', 2, 'otras');
insertAct.run('Bogotá - Exógena', 2, 'otras');
insertAct.run('B/Tura - Exógena', 2, 'otras');
insertAct.run('Cámara de Comercio Celpa Capital al mil', 2, 'otras');
insertAct.run('Paz y salvo Alcaldía', 2, 'otras');
insertAct.run('Visita Régimen Franco', 2, 'otras');
insertAct.run('Predial', 2, 'otras');
insertAct.run('Intereses cesantías', 2, 'otras');
insertAct.run('Cesantías', 2, 'otras');
insertAct.run('Evaluación de desempeño', 2, 'otras');
insertAct.run('Renovación Cámara de Comercio', 2, 'otras');

// Asignar tareas a cada usuario
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

console.log(`✅ Seed completado: ${users.length} usuarios, ${acts.length} actividades`);
db.close();
