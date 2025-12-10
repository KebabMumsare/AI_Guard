import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to log an event (from Camera/Jetson)
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

// Endpoint to get all logs
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

// Endpoint to get stats for the graph (aggregated by day of week)
app.get('/api/stats', (req, res) => {
    // SQLite query to count events per day of the week
    // strftime('%w', timestamp) returns 0-6 (Sunday-Saturday)
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
