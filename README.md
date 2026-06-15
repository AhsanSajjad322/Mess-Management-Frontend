# Mess Aasan — Frontend (MMS)

Server-rendered web frontend for **Mess Aasan** (Mess Management System), a hostel mess management platform for **students** and **admins**. Built with **Express.js** and **EJS**, it renders role-based dashboards and talks to a separate REST API backend.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Backend API Integration](#backend-api-integration)
- [Authentication](#authentication)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## About

Mess Aasan helps manage day-to-day hostel mess operations:

- Students can view menus, request mess-off days, track attendance, and review billing.
- Admins can manage students, update weekly menus, view mess statistics, and monitor who is on mess-off for the current day.

This repository is the **frontend layer** only. It does not contain the database or core business API — those live in a separate **Mess Aasan backend** service. The frontend must be run alongside that backend.

---

## Features

### Student Portal (`/mms/student`)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Personal overview and quick access to mess features |
| **Mess Menu** | View the weekly mess menu |
| **Mess Off Request** | Request to skip breakfast, lunch, or dinner on a given day |
| **Mess Attendance** | View monthly attendance calendar |
| **Mess Billings** | View billing details and mess charges |
| **Edit Profile** | Update personal profile information |
| **Logout** | End session and clear stored auth token |

### Admin Portal (`/mms/admin`)

| Feature | Description |
|---------|-------------|
| **Dashboard** | Welcome screen with student count, current month, and today's mess-off list |
| **Students** | List, view, update, and delete registered students |
| **Add Student** | Register a new student |
| **Mess Menu** | View the weekly mess menu |
| **Edit Menu** | Update menu items for each day |
| **Mess Stats** | Visual attendance/statistics charts (ApexCharts) |
| **Edit Profile** | Update admin profile |
| **Logout** | End session and clear stored auth token |

### Shared

- Unified login page at `/mms/login` with an **Is admin** checkbox to route to the correct role
- Token-based authentication with protected routes
- Responsive UI using Bootstrap 5

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Node.js](https://nodejs.org/) |
| Server | [Express.js](https://expressjs.com/) v4 |
| Templating | [EJS](https://ejs.co/) + [ejs-mate](https://www.npmjs.com/package/ejs-mate) (layouts) |
| HTTP client | [node-fetch](https://www.npmjs.com/package/node-fetch) v3 |
| Forms | [method-override](https://www.npmjs.com/package/method-override) (PUT/DELETE) |
| Session token storage | [node-localstorage](https://www.npmjs.com/package/node-localstorage) (`./scratch/`) |
| UI | Bootstrap 5, Font Awesome 6 |
| Charts | [ApexCharts](https://apexcharts.com/) |

---

## Architecture

```
┌─────────────────┐         REST API          ┌─────────────────┐
│   Browser       │ ◄──────────────────────► │   This frontend │
│  (EJS pages)    │   http://localhost:3002  │   (Express)     │
└─────────────────┘                          └────────┬────────┘
                                                      │
                                                      │ fetch()
                                                      ▼
                                             ┌─────────────────┐
                                             │  Backend API    │
                                             │  localhost:3000 │
                                             └─────────────────┘
```

1. The user submits the login form to the frontend Express server.
2. The frontend calls the backend login API and stores the returned JWT/token in `./scratch/` via `node-localstorage`.
3. Protected routes check for a stored token and validate it against the backend before rendering pages.
4. Service modules in `services/` encapsulate all backend HTTP calls.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** v14 or higher (v18+ recommended)
- **npm** (comes with Node.js)
- The **Mess Aasan backend** cloned, configured, and running on port **3000**
- (Optional) **nodemon** for development auto-reload — see [Running the App](#running-the-app)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AhsanSajjad322/Mess-Management-Frontend.git
   cd Mess-Management-Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the backend** (in a separate terminal)

   Make sure the backend API is reachable at `http://localhost:3000` before starting this frontend.

---

## Configuration

### Ports

| Service | Default URL | How to change |
|---------|-------------|---------------|
| **Frontend** | `http://localhost:3002` | Set `PORT` env variable or edit `app.js` (`process.env.PORT \|\| 3002`) |
| **Backend API** | `http://localhost:3000` | Update URLs in `services/adminService.js` and `services/studentService.js` |

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | Port the Express server listens on |

Example:

```bash
# Windows PowerShell
$env:PORT=3002; npm start

# Linux / macOS
PORT=3002 npm start
```

### Backend URL

All backend calls are currently hardcoded to `http://localhost:3000`. If your API runs on a different host or port, update the `fetch(...)` URLs in:

- `services/adminService.js`
- `services/studentService.js`
- `routes/adminRoutes.js` (token validation)
- `routes/studentRoutes.js` (token validation)

> **Note:** The login form in `views/login.ejs` posts to a hardcoded frontend URL (`http://localhost:3001/mms/login/validate`). If you change the frontend port, update that form action as well.

---

## Running the App

### Production / standard start

```bash
npm start
```

The server starts at **http://localhost:3002** (unless `PORT` is set).

### Development (auto-reload)

```bash
npm run dev
```

This uses `nodemon`. If you get a "nodemon not found" error, install it globally:

```bash
npm install -g nodemon
```

Or use `npm start` and restart manually after changes.

### Access the app

Open your browser and go to:

```
http://localhost:3002/mms/login
```

Root paths `/` and `/mms` redirect to the login page.

---

## Project Structure

```
frontend/
├── app.js                      # Express entry point, login routes, middleware setup
├── package.json
├── routes/
│   ├── adminRoutes.js          # Admin portal routes + auth middleware
│   └── studentRoutes.js        # Student portal routes + auth middleware
├── services/
│   ├── adminService.js         # Admin API calls (students, menu, auth, etc.)
│   └── studentService.js       # Student API calls (profile, mess-off, auth, etc.)
├── views/
│   ├── login.ejs               # Shared login page
│   ├── layouts/
│   │   ├── adminboilerplate.ejs
│   │   └── studentboilerplate.ejs
│   ├── includes/
│   │   ├── admin/              # Admin header & sidebar partials
│   │   └── student/            # Student header & sidebar partials
│   ├── admin/                  # Admin page templates
│   │   ├── dashboard.ejs
│   │   ├── students.ejs
│   │   ├── addStudent.ejs
│   │   ├── updateStudent.ejs
│   │   ├── messMenu.ejs
│   │   ├── editMenu.ejs
│   │   ├── messStats.ejs
│   │   └── editProfile.ejs
│   └── student/                # Student page templates
│       ├── dashboard.ejs
│       ├── messMenu.ejs
│       ├── messOff.ejs
│       ├── messAttendance.ejs
│       ├── messBillings.ejs
│       └── editProfile.ejs
├── public/
│   ├── css/style.css           # Custom styles
│   └── js/script.js            # Client-side scripts
└── scratch/                    # Gitignored — stores auth token (node-localstorage)
```

---

## Routes

### Public

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Redirect to login |
| `GET` | `/mms` | Redirect to login |
| `GET` | `/mms/login` | Render login page |
| `POST` | `/mms/login/validate` | Validate credentials; redirect to role dashboard |

### Admin (`/mms/admin`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/dashboard` | Admin dashboard |
| `GET` | `/students` | List all students |
| `GET` | `/addStudent` | Add student form |
| `GET` | `/addStudentService` | Submit new student (query params) |
| `GET` | `/student/:id` | Edit student form |
| `PUT` | `/updateStudent/:id` | Update student |
| `DELETE` | `/student/:id` | Delete student |
| `GET` | `/messMenu` | View mess menu |
| `GET` | `/editMenu` | Edit mess menu form |
| `POST` | `/updateMenu/:id` | Save menu changes |
| `GET` | `/messStats` | Mess statistics charts |
| `GET` | `/editProfile` | Admin profile form |
| `PUT` | `/updateAdmin/:id` | Update admin profile |
| `GET` | `/logout` | Logout |

### Student (`/mms/student`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/dashboard` | Student dashboard |
| `GET` | `/messMenu` | View mess menu |
| `GET` | `/messOff` | Mess-off request form |
| `POST` | `/:id/messoff` | Submit mess-off for a day/meal |
| `GET` | `/messAttendance` | Attendance calendar |
| `GET` | `/messBill` | Billing details |
| `GET` | `/editProfile` | Profile edit form |
| `PUT` | `/updateStudent/:id` | Update student profile |
| `GET` | `/logout` | Logout |

All admin and student routes (except logout entry) are protected by token middleware.

---

## Backend API Integration

The frontend proxies data through service modules. Key backend endpoints consumed:

### Authentication

| Endpoint | Method | Used by |
|----------|--------|---------|
| `/mms/admin/login-admin` | `POST` | Admin login |
| `/mms/student/login-student` | `POST` | Student login |
| `/mms/admin/logout-admin` | `POST` | Admin logout |
| `/mms/student/logout-student` | `POST` | Student logout |
| `/mms/admin/validate_token_admin` | `GET` | Token validation (both route files) |

### Admin data

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/mms/student/students` | `GET` | Fetch all students |
| `/mms/admin/students` | `POST` | Create student |
| `/mms/admin/students/:id` | `GET` / `PUT` / `DELETE` | Read, update, delete student |
| `/mms/admin/admins/:id` | `GET` / `PUT` | Admin profile |
| `/mms/admin/messmenu` | `GET` | Fetch menu |
| `/mms/admin/messmenu/:id` | `PUT` | Update menu day |
| `/mms/admin/messOffStudents/:day` | `GET` | Students on mess-off today |

### Student data

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/mms/student/students/:id` | `GET` / `PUT` | Student profile |
| `/mms/student/:id/calendar` | `PUT` | Submit mess-off request |

---

## Authentication

1. User logs in at `/mms/login` with username and password.
2. Checking **Is admin** routes the request to `adminService.validate()`; otherwise `studentService.validate()`.
3. On success, the backend returns a token stored in `./scratch/token` via `node-localstorage`.
4. `storedTokenMiddleware` checks that a token exists before allowing access to protected pages.
5. `validateTokenMiddleware` sends the token to the backend for verification and attaches `req.userId`.
6. Logout clears the token locally and calls the backend logout endpoint.

> **Security note:** Token storage in a local file (`./scratch/`) is suitable for development/demo use. For production, prefer HTTP-only cookies or a proper server-side session store.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server with `node app.js` |
| `npm run dev` | Start with `nodemon` for auto-reload on file changes |
| `npm test` | Not configured (placeholder) |

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Login redirects back to login | Backend not running or wrong credentials | Start backend on port 3000; verify username/password |
| `fetch failed` / network errors | Backend URL mismatch | Confirm backend is at `http://localhost:3000` |
| Login form does nothing | Form posts to wrong port | Update `action` in `views/login.ejs` to match your frontend port |
| `nodemon: command not found` | nodemon not installed | Run `npm install -g nodemon` or use `npm start` |
| Protected pages always redirect | Missing or invalid token | Log in again; check `./scratch/token` exists |
| Empty dashboard data | Backend returned an error | Check terminal logs for HTTP errors from service calls |

---

## Known Limitations

- Backend API URLs are hardcoded to `localhost:3000` (no central config file).
- Login form action is hardcoded to port `3001` while the server defaults to port `3002`.
- `nodemon` is used in the `dev` script but is not listed in `package.json` dependencies.
- Mess Stats charts on the admin page use sample/static data in the template, not live API data.
- Student route token validation currently calls the admin validate endpoint.

---

## License

This project is intended for **educational and demonstration purposes** (ISC license per `package.json`).

---

## Related

- **Frontend repo:** [Mess-Management-Frontend](https://github.com/AhsanSajjad322/Mess-Management-Frontend)
- **Backend:** A companion API server (default `http://localhost:3000`) is required — use the Mess Aasan backend project from the same organization or course repository
