import db from './database.js';

// Helper to create a timestamp string for SQLite
const createTimestamp = (year, month, day, hour, minute, second) => {
    const date = new Date(year, month - 1, day, hour, minute, second);
    return date.toISOString().slice(0, 19).replace('T', ' ');
};

// Generate sample logs with specific timestamps
const generateSampleLogs = () => {
    const logs = [];
    
    // === Before Christmas Break 2025 ===
    
    // Monday Dec 15, 2025 - A few detections
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 15, 9, 15, 23) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 15, 11, 42, 8) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 15, 14, 28, 55) });
    
    // Tuesday Dec 16, 2025 - More activity
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 16, 8, 5, 12) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 16, 10, 33, 47) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 16, 10, 45, 19) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 16, 13, 22, 31) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 16, 15, 8, 44) });
    
    // Wednesday Dec 17, 2025 - Busy day
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 7, 55, 3) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 9, 12, 28) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 9, 18, 52) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 11, 45, 16) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 14, 3, 39) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 14, 27, 11) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 17, 16, 41, 55) });
    
    // Thursday Dec 18, 2025 - Moderate activity
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 18, 8, 22, 17) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 18, 10, 55, 42) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 18, 13, 8, 29) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 18, 15, 33, 8) });
    
    // Friday Dec 19, 2025 - Last day before break
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 9, 5, 33) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 9, 48, 21) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 11, 15, 47) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 11, 22, 59) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 12, 45, 14) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2025, 12, 19, 14, 18, 36) });
    
    // === After Christmas Break - Last week (Jan 12-18, 2026) ===
    
    // Monday Jan 12, 2026 - Back to work
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 12, 8, 45, 12) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 12, 10, 22, 38) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 12, 14, 55, 27) });
    
    // Tuesday Jan 13, 2026
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 13, 9, 8, 45) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 13, 11, 33, 19) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 13, 13, 47, 52) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 13, 15, 12, 8) });
    
    // Wednesday Jan 14, 2026
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 14, 8, 28, 33) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 14, 10, 5, 17) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 14, 10, 42, 51) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 14, 12, 18, 29) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 14, 14, 55, 43) });
    
    // Thursday Jan 15, 2026
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 15, 9, 15, 8) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 15, 11, 42, 36) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 15, 13, 28, 14) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 15, 15, 5, 49) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 15, 16, 33, 22) });
    
    // Friday Jan 16, 2026
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 16, 8, 55, 41) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 16, 10, 22, 17) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 16, 11, 8, 53) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 16, 14, 45, 29) });
    
    // Saturday Jan 17, 2026 - Weekend, less activity
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 17, 10, 15, 33) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 17, 14, 42, 8) });
    
    // Sunday Jan 18, 2026 - Weekend
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 18, 11, 22, 14) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 18, 15, 8, 47) });
    
    // === This week ===
    
    // Monday Jan 19, 2026 (TODAY) - Spread throughout the day
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 8, 12, 45) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 9, 33, 17) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 10, 5, 28) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 10, 48, 52) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 11, 22, 14) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 11, 55, 39) });
    logs.push({ event_type: 'Rock_FIST', timestamp: createTimestamp(2026, 1, 19, 12, 18, 7) });
    
    return logs;
};

// Clear existing logs
const clearLogs = () => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM logs', [], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};

// Insert a log with a specific timestamp
const insertLog = (log) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO logs (event_type, timestamp) VALUES (?, ?)`;
        db.run(sql, [log.event_type, log.timestamp], function (err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

const seed = async () => {
    console.log('Seeding database...');
    try {
        // Clear existing logs first
        const deleted = await clearLogs();
        console.log(`Cleared ${deleted} existing logs.`);
        
        // Generate and insert sample logs
        const sampleLogs = generateSampleLogs();
        
        for (const log of sampleLogs) {
            await insertLog(log);
        }
        
        console.log(`Successfully added ${sampleLogs.length} logs to the database.`);
        console.log('Data includes:');
        console.log('  - Dec 15-19, 2025 (before Christmas break)');
        console.log('  - Jan 12-18, 2026 (last week)');
        console.log('  - Jan 19, 2026 (today)');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        console.log('Seeding complete.');
        process.exit(0);
    }
};

// Wait a moment for the database connection to be established
setTimeout(seed, 1000);
