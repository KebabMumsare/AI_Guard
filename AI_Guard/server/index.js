import express from 'express';
import cors from 'cors';
import db from './database.js';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from other domains (like the frontend)
app.use(express.json()); // Parse incoming JSON data

// --- API Endpoints ---

// 0. Authentication
// Register a new user
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

        db.run(sql, [username, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Username already exists' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login user
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const sql = `SELECT * FROM users WHERE username = ?`;

    db.get(sql, [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        try {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // In a real app, we would generate a JWT token here
                res.json({ message: 'Login successful', user: { id: user.id, username: user.username } });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error verifying credentials' });
        }
    });
});

// 1. Log an Event
// Receives data from the Camera/Jetson Nano and saves it to the database.
// Expected body: { event_type: "Person Detected", description: "...", camera_id: "..." }
app.post('/api/log', (req, res) => {
    const { event_type } = req.body;

    if (!event_type) {
        return res.status(400).json({ error: 'event_type is required' });
    }

    const sql = `INSERT INTO logs (event_type) VALUES (?)`;
    const params = [event_type];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Log entry created',
            id: this.lastID,
            data: { event_type }
        });
    });
});

// 2. Get All Logs (Paginated)
// Fetches logs with pagination support.
// Query params: ?page=1&limit=20
app.get('/api/logs', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // First, get the total count of logs
    db.get('SELECT COUNT(*) as count FROM logs', [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const totalLogs = row.count;
        const totalPages = Math.ceil(totalLogs / limit);

        // Then, get the actual logs for this page
        const sql = `SELECT * FROM logs ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
        db.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.json({
                logs: rows,
                pagination: {
                    page,
                    limit,
                    totalLogs,
                    totalPages
                }
            });
        });
    });
});

// 3. Get Statistics (Graph Data)
// Aggregates logs by day of the week for the Graph page.
app.get('/api/stats', (req, res) => {
    // Get logs from the last 7 days
    const sql = `
    SELECT 
      strftime('%w', timestamp) as day_index,
      COUNT(*) as count 
    FROM logs 
    WHERE timestamp >= datetime('now', '-7 days')
    GROUP BY day_index
  `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Map 0-6 to Monday-Sunday format
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const stats = {
            Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
        };

        rows.forEach(row => {
            const dayName = days[parseInt(row.day_index)];
            if (stats.hasOwnProperty(dayName)) {
                stats[dayName] = row.count;
            }
        });

        res.json(stats);
    });
});

// 4. Get Admin Stats
// Fetches total events and events today for the Admin panel.
app.get('/api/admin/stats', (req, res) => {
    const sqlTotal = `SELECT COUNT(*) as count FROM logs`;
    const sqlToday = `SELECT COUNT(*) as count FROM logs WHERE date(timestamp) = date('now')`;

    db.get(sqlTotal, [], (err, rowTotal) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        db.get(sqlToday, [], (err, rowToday) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.json({
                totalEvents: rowTotal.count,
                eventsToday: rowToday.count
            });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
