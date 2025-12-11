import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from other domains (like the frontend)
app.use(express.json()); // Parse incoming JSON data

// --- API Endpoints ---

// 1. Log an Event
// Receives data from the Camera/Jetson Nano and saves it to the database.
// Expected body: { event_type: "Person Detected", description: "...", camera_id: "..." }
app.post('/api/log', (req, res) => {
    const { event_type, description, camera_id } = req.body;

    if (!event_type) {
        return res.status(400).json({ error: 'event_type is required' });
    }

    const sql = `INSERT INTO logs (event_type, description, camera_id) VALUES (?, ?, ?)`;
    const params = [event_type, description || '', camera_id || 'default'];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Log entry created',
            id: this.lastID,
            data: { event_type, description, camera_id }
        });
    });
});

// 2. Get All Logs
// Fetches the most recent 100 logs to display on the Log page.
app.get('/api/logs', (req, res) => {
    const sql = `SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ logs: rows });
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

        // Map 0-6 to Monday-Sunday format or whatever the frontend expects
        // Frontend expects: Monday, Tuesday, Wednesday, Thursday, Friday
        // Let's format it for the frontend
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const stats = {
            Monday: 0,
            Tuesday: 0,
            Wednesday: 0,
            Thursday: 0,
            Friday: 0,
            Saturday: 0,
            Sunday: 0
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
