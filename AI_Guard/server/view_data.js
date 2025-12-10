import sqlite3 from 'sqlite3';

// Open the database
const db = new sqlite3.Database('./ai_guard.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

const viewData = () => {
    const sql = 'SELECT * FROM logs';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error reading logs:', err.message);
            return;
        }

        if (rows.length === 0) {
            console.log('No logs found in the database.');
        } else {
            console.log(`Found ${rows.length} logs:`);
            console.table(rows);
        }

        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
        });
    });
};

viewData();
