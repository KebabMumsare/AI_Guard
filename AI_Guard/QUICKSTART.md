# AI_Guard Raspberry Pi Guide 🍓

This guide explains how to manage the system directly on the Raspberry Pi.

**Note:** The system is designed to start automatically when the Pi turns on. You usually don't need to do anything!

## 1. Open the Terminal
Click the **Terminal** icon (black box) on the top bar of the Raspberry Pi desktop.

## 2. Check System Status
To see if the Backend and Database are running:

```bash
pm2 status
```
- You should see `ai-guard-backend` with status `online`.
- If it says `stopped` or `errored`, type: `pm2 restart ai-guard-backend`

## 3. View the Website
Open the **Chromium Web Browser** on the Pi and go to:
`http://localhost`

## 4. Troubleshooting & Maintenance

### "The logs are empty!"
If you need to add test data to the database:
1.  Go to the server folder:
    ```bash
    cd ~/AI_Guard/AI_Guard/server
    ```
2.  Run the seed script:
    ```bash
    node seed.js
    ```

### "I want to see the raw database data"
To view the database tables directly in the terminal:
1.  Go to the server folder:
    ```bash
    cd ~/AI_Guard/AI_Guard/server
    ```
2.  Run the viewer:
    ```bash
    node view_data.js
    ```

### "I updated the code, but nothing changed"
If you pulled new code from Git, you need to rebuild the website:
1.  Go to the project folder:
    ```bash
    cd ~/AI_Guard/AI_Guard
    ```
2.  Install and Build:
    ```bash
    npm install
    npm run build
    ```
3.  Restart the backend just in case:
    ```bash
    pm2 restart ai-guard-backend
    ```
