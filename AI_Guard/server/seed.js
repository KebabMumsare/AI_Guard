import db from './database.js';

const sampleLogs = [
    { event_type: 'Person Detected', description: 'Person identified as Eliah', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Carl', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Mykyta', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Jesper', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Andi', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Eliah', camera_id: 'CAM-01' },
    { event_type: 'Person Detected', description: 'Person identified as Carl', camera_id: 'CAM-01' }
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const seed = async () => {
    console.log('Seeding database...');
    try {
        for (const log of sampleLogs) {
            // Random delay between 2000ms (2s) and 6000ms (6s)
            const delay = Math.floor(Math.random() * (6000 - 2000 + 1) + 2000);
            console.log(`Waiting ${delay / 1000}s before adding next log...`);
            await sleep(delay);

            await insertLog(log);
            console.log(`Added: ${log.description}`);
        }
        console.log(`Successfully added ${sampleLogs.length} logs to the database.`);
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        console.log('Seeding complete.');
        process.exit(0);
    }
};

// Wait a moment for the database connection to be established
setTimeout(seed, 1000);
