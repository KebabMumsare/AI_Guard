# AI_Guard Local Development Guide 💻

This guide is for developers who want to run the project on their own laptop (Windows/Mac/Linux).

## Prerequisites
- **Node.js**: Install it from [nodejs.org](https://nodejs.org/).
- **Git**: To download the code.

## 1. Get the Code
Clone the repository to your computer:
```bash
git clone <YOUR_REPO_URL>
cd AI_Guard
```

## 2. Start the Backend (API & Database)
The backend must be running for the website to work.

1.  Open a terminal.
2.  Navigate to the `server` folder:
    ```bash
    cd server
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the server:
    ```bash
    node index.js
    ```
    *You should see: "Server running on port 3000"*

## 3. Start the Frontend (Website)
1.  Open a **new** terminal window (keep the backend running!).
2.  Navigate to the main project folder:
    ```bash
    cd AI_Guard  # Adjust path if needed to get to the root where vite.config.js is
    ```
3.  Install dependencies (first time only):
    ```bash
    npm install
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
5.  Open the link shown (usually `http://localhost:5173`).

## 4. Common Tasks

### Seed the Database (Add Fake Data)
If your local database is empty:
1.  Open a terminal in the `server` folder.
2.  Run:
    ```bash
    node seed.js
    ```

### View Raw Data
To see what's in your local database:
1.  Open a terminal in the `server` folder.
2.  Run:
    ```bash
    node view_data.js
    ```

## Note on "Proxy"
When running locally, `npm run dev` uses a "proxy" (configured in `vite.config.js`) to send API requests to `localhost:3000`. This is why you don't need Nginx on your laptop!
