import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'ai_guard.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Create logs table
        db.run(`CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

        // Seed admin user
        const adminUsername = 'admin';
        const adminPassword = 'rosaelefant';

        db.get('SELECT id FROM users WHERE username = ?', [adminUsername], async (err, row) => {
            if (err) {
                console.error('Error checking for admin user:', err.message);
                return;
            }
            if (!row) {
                try {
                    const hashedPassword = await bcrypt.hash(adminPassword, 10);
                    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [adminUsername, hashedPassword], (err) => {
                        if (err) {
                            console.error('Error creating admin user:', err.message);
                        } else {
                            console.log('Admin user created.');
                        }
                    });
                } catch (hashError) {
                    console.error('Error hashing admin password:', hashError);
                }
            }
        });

        console.log('Database tables initialized.');
    });
}

export default db;
