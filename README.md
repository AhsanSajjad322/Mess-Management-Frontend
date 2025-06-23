# Mess Aasan Frontend

This is the frontend for the Mess Aasan project, a web-based mess management system for students and admins. It is built using Express.js and EJS templating, and communicates with the backend via REST APIs.

## Features
- Student and Admin login
- Dashboard views for both roles
- Mess menu and attendance management
- Profile editing
- Secure session-based authentication (recommended for production)

## Prerequisites
- [Node.js](https://nodejs.org/) (v14 or above recommended)
- [npm](https://www.npmjs.com/)
- The Mess Aasan backend running and accessible

## Setup
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure (if needed):**
   - By default, the frontend expects the backend to be running on `http://localhost:3000`.
   - If your backend runs elsewhere, update the API URLs in the service files.

3. **Run the frontend:**
   - For development (with auto-reload):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```
   - The app will start on [http://localhost:3001](http://localhost:3001) by default.

## Project Structure
```
frontend/
  app.js                # Main Express app
  public/               # Static assets (CSS, JS, images)
  routes/               # Express route handlers
  services/             # API service logic
  views/                # EJS templates
  package.json          # Project metadata and scripts
```

## Notes
- Make sure the backend is running before starting the frontend.
- For production, use secure session/cookie authentication and avoid storing tokens in files.
- You can change the frontend port by editing the `PORT` variable in `app.js`.

## License
This project is for educational/demo purposes. 