import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the database
const dbPromise = open({
    filename: './ai_guard.db',
    driver: sqlite3.Database
});

const viewData = async () => {
    try {
        const db = await dbPromise;
        const logs = await db.all('SELECT * FROM logs');

        if (logs.length === 0) {
            console.log('No logs found in the database.');
        } else {
            console.log(`Found ${logs.length} logs:`);
            console.table(logs);
        }
    } catch (err) {
        console.error('Error reading database:', err);
    }
};

viewData();
