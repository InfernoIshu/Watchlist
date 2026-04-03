# 🚀 Deploying to Render

I've prepared your project for deployment! Here's a quick guide on how to get it live.

## 1. Prerequisites Check
I've already:
- ✅ Added a `start` script to the backend (`server/package.json`).
- ✅ Created a `.gitignore` to keep things clean.
- ✅ Created a `render.yaml` blueprint for automatic setup on Render.
- ✅ Initialized a local Git repository and committed your changes.

---

## 2. Push to GitHub
Before you can deploy to Render, you need to put your code on GitHub.

1.  Go to [github.com/new](https://github.com/new).
2.  Create a new repository (name it `mywatchlist`).
3.  Run these commands in your project terminal:
    ```bash
    git remote add origin YOUR_GITHUB_REPO_URL
    git branch -M main
    git push -u origin main
    ```

---

## 3. Deploy to Render
Once your code is on GitHub:

1.  Go to [dashboard.render.com](https://dashboard.render.com).
2.  Click **New +** → **Blueprint**.
3.  Connect your GitHub account and select the `mywatchlist` repository.
4.  Render will automatically detect the `render.yaml` file.
5.  It will ask you to fill in the **Environment Variables** (check your `.env` files for values!):
    - `MONGO_URI` (Your MongoDB connection string)
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `VITE_TMDB_API_KEY`
    - `VITE_API_URL` (Wait! You'll get the backend URL FROM Render's dashboard after it starts creating items).

---

## 4. Post-Deployment Updates
After the backend starts deploying, it will give you a URL (e.g., `https://watchlist-backend.onrender.com`).
1.  Update the `VITE_API_URL` in the Render dashboard for the `watchlist-frontend` to `https://watchlist-backend.onrender.com/api`.
2.  Add the frontend URL (e.g., `https://watchlist-frontend.onrender.com`) to:
    -   The `FRONTEND_URL` environment variable for the backend service.
    -   Your Supabase project's **Authentication** → **URL Configuration** → **Redirect URLs**.
    -   Your Supabase project's **API** → **CORS** settings.

---

> [!TIP]
> Both services are configured to use the **Free** plan in `render.yaml`. Note that the backend might "sleep" after 15 minutes of inactivity on the free tier, and will take 30-60 seconds to wake up on the first request.
