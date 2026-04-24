# MERN Auth App

A full-stack web application built with the MERN stack featuring complete user authentication, JWT sessions, profile management, password reset, and dark mode.

## Features

- **Authentication** — Signup, Login, JWT-based session management
- **Security** — bcrypt password hashing, protected routes, token verification
- **Password Reset** — Forgot password email flow with tokenized links
- **Email Verification** — Verify account via emailed link
- **Profile Management** — Edit name, bio, avatar URL
- **Change Password** — Secure in-app password change
- **Dark Mode** — System-aware toggle persisted in localStorage
- **Responsive UI** — Works on mobile and desktop
- **Form Validation** — Client-side + server-side validation
- **Error Handling** — Centralized error middleware, toast notifications

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 18, React Router 6, Vite |
| Backend   | Node.js, Express.js            |
| Database  | MongoDB, Mongoose              |
| Auth      | JWT, bcryptjs                  |
| Email     | Nodemailer                     |
| UI        | Custom CSS with dark mode      |
| Toasts    | react-hot-toast                |

---

## Project Structure

```
Full Stack/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Navbar, Spinner, ProtectedRoute
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # LoginPage, SignupPage, Dashboard, Profile, ...
│   │   ├── utils/       # axios instance
│   │   └── App.jsx
│   └── vite.config.js
└── server/              # Express backend
    ├── config/          # MongoDB connection
    ├── controllers/     # authController, userController
    ├── middleware/       # JWT auth, error handler
    ├── models/          # User schema
    ├── routes/          # /api/auth, /api/user
    ├── utils/           # generateToken, sendEmail
    └── server.js
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- SMTP credentials (Gmail App Password recommended)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Full Stack"
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mern-auth
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Set up the frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
# Client runs on http://localhost:5173
```

---

## API Reference

### Auth routes — `/api/auth`

| Method | Endpoint                    | Auth | Description              |
|--------|-----------------------------|------|--------------------------|
| POST   | `/signup`                   | —    | Register new user        |
| POST   | `/login`                    | —    | Login, get JWT           |
| GET    | `/me`                       | ✅   | Get current user         |
| POST   | `/forgot-password`          | —    | Send reset email         |
| PUT    | `/reset-password/:token`    | —    | Reset password           |
| GET    | `/verify-email/:token`      | —    | Verify email address     |

### User routes — `/api/user`

| Method | Endpoint           | Auth | Description          |
|--------|--------------------|------|----------------------|
| PUT    | `/profile`         | ✅   | Update profile       |
| PUT    | `/change-password` | ✅   | Change password      |

---

## Deployment

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist all IPs (`0.0.0.0/0`)
3. Copy the connection string into `MONGO_URI`

### Backend — Render

1. Push the `server/` folder to a GitHub repo (or use a monorepo)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`

### Frontend — Vercel

1. Push the `client/` folder to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Set framework preset: **Vite**
4. Add environment variable: `VITE_API_URL=https://<your-render-url>/api`
5. Deploy

---

## Security Practices

- Passwords hashed with **bcrypt** (salt rounds: 12)
- JWT secrets stored in environment variables only
- Password reset tokens are **hashed** before storage
- Email enumeration prevented on forgot-password endpoint
- Server-side validation via **express-validator**
- CORS restricted to the frontend origin

---

## Screenshots

> Add screenshots of Login, Signup, Dashboard, and Profile pages here after deploying.

---

## License

MIT
