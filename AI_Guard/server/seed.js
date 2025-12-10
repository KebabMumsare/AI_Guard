import db from './database.js';

const sampleLogs = [
    { event_type: 'Person Detected', description: 'Person identified as Alice', camera_id: 'CAM-01' },
    { event_type: 'Unknown Object', description: 'Unidentified object in sector 4', camera_id: 'CAM-02' },
    { event_type: 'Motion Detected', description: 'Movement near entrance', camera_id: 'CAM-01' },
    { event_type: 'System Startup', description: 'AI Guard system initialized', camera_id: 'SYSTEM' },
    { event_type: 'Person Detected', description: 'Person identified as Bob', camera_id: 'CAM-03' },
    { event_type: 'Alert', description: 'Restricted area access attempt', camera_id: 'CAM-02' },
    { event_type: 'Person Detected', description: 'Person identified as Charlie', camera_id: 'CAM-01' }
];

const insertLog = (log) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO logs (event_type, description, camera_id) VALUES (?, ?, ?)`;
        db.run(sql, [log.event_type, log.description, log.camera_id], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const seed = async () => {
    console.log('Seeding database...');
    try {
        for (const log of sampleLogs) {
            await insertLog(log);
        }
        console.log(`Successfully added ${sampleLogs.length} logs to the database.`);
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        console.log('Seeding complete. Press Ctrl+C to exit if this does not close automatically.');
        process.exit(0);
    }
};

// Wait a moment for the database connection to be established
setTimeout(seed, 1000);
