# Deploy to Railway

This project is configured to deploy on [Railway](https://railway.app) from a
GitHub repository. The visit/download counters are stored in a JSON file, so we
attach a **Volume** to keep that file across redeploys.

## What's already set up for you

- `railway.json` — build & start commands (`npm run build` / `npm run start`)
- `package.json` `engines.node` — pins a compatible Node version
- `STATS_DIR` env var support — the counter file is written to this path when set

---

## Step-by-step

### 1. Push the latest code to GitHub
Make sure these new/changed files are committed and pushed:
`railway.json`, `package.json`, `src/lib/stats.ts`.

```bash
git add .
git commit -m "Add Railway deploy config + persistent stats path"
git push
```

### 2. Create the Railway project
1. Go to https://railway.app and sign in (with GitHub).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Pick this repository. Railway auto-detects Next.js (Nixpacks) and starts the
   first build using `railway.json`.

### 3. Add a Volume (so counters persist)
Railway containers have an ephemeral filesystem; a Volume gives you a real disk.

1. Open your service → **Variables / Settings** → find **Volumes** (or right-click
   the service → **Attach Volume**).
2. Create a Volume with **Mount path = `/data`**.
3. The smallest size is fine (the counter file is a few bytes).

### 4. Tell the app to use the Volume
Add an environment variable so the counter writes into the mounted Volume:

| Variable    | Value   |
| ----------- | ------- |
| `STATS_DIR` | `/data` |

(Service → **Variables** → **New Variable**.) Railway redeploys automatically.

> Without `STATS_DIR`, the app still runs but writes the counter inside the
> container, which resets on each redeploy. Set it to the Volume path to persist.

### 5. Get your public URL
Service → **Settings** → **Networking** → **Generate Domain**.
You'll get a `https://<your-app>.up.railway.app` URL. Open it — the badge in the
top-left should show live visit/download counts.

---

## Verifying it works
- Visit a few pages → the **visit** number should climb.
- Download a file from `/downloads` → the **download** number should climb.
- Redeploy (push a commit). With the Volume + `STATS_DIR` set, the numbers should
  **not** reset.

## Adding your PDFs
Put real files in `public/downloads/` (`Resume.pdf`, `CV.pdf`,
`Kalgoorlie_Report.pdf`, `GIS_Portfolio.pdf`) and push — they deploy with the app.

## Custom domain (optional)
Service → **Settings** → **Networking** → **Custom Domain**, then add the CNAME
record Railway shows you at your domain registrar.

## Cost note
The app itself fits in Railway's usage-based pricing (~$5/mo credit covers a small
portfolio). A Volume adds a small storage charge (well under $1/mo at minimum size).
