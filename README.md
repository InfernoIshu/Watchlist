# Watchlist Application

A full-stack media tracker inspired by Letterboxd and MyAnimeList. Track movies, TV shows, and anime, manage your personal watchlist, and monitor your watching progress.

## Prerequisites

Before running the application, make sure you have the following installed on your machine:
- **Node.js** (v16 or higher)
- **MongoDB** (running locally on port `27017` or a MongoDB Atlas URI)

You will also need API keys for:
- **Supabase** (for authentication)
- **TMDB** (The Movie Database API for media discovery)

## ⚙️ Environment Setup

You need to configure the environment variables for both the frontend and backend.

### 1. Backend (`/server/.env`)
Navigate to the `server` folder, copy the example `.env` file, and fill in the details:
```bash
cd server
cp .env.example .env
```
Inside `server/.env`:
```text
PORT=5000
MONGODB_URI=mongodb://localhost:27017/watchlist
FRONTEND_URL=http://localhost:5173
```

### 2. Frontend (`/client/.env`)
Navigate to the `client` folder, copy the example `.env` file, and provide your keys:
```bash
cd ../client
cp .env.example .env
```
Inside `client/.env`:
```text
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Project

You must start **both** the backend and the frontend servers concurrently for the app to work. 

### Start the Backend (API & Database)
Open a new terminal window:
```bash
cd server
npm install
node server.js
```
*The server will be running on `http://localhost:5000`*

### Start the Frontend (React UI)
Open a separate, second terminal window:
```bash
cd client
npm install
npm run dev
```
*The frontend will be running on `http://localhost:5173`*

---

## 🛠️ Tech Stack Used

- **Frontend**: React (Vite), Tailwind CSS (v4), Zustand, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Supabase (Email/Password & Google OAuth)
- **External Data**: TMDB API
