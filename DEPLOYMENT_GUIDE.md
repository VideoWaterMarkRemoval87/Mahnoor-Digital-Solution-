# Mahnoor Digital Solution – Production Deployment Guide

## 1. Project Specifications
- **Framework**: React 19 Single Page Application (React Router v7, Tailwind CSS v4)
- **Build System**: Vite 8.3 + TypeScript
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Handled via `dist/_redirects` (`/* /index.html 200`) and `vercel.json`
- **Security & Caching**: Handled via `dist/_headers` and `dist/.htaccess`

---

## 2. Option 1: Cloudflare Pages (Recommended - 100% Free Forever)
Cloudflare Pages provides generous free hosting (unlimited bandwidth, 500 builds/month, global anycast edge network).

### Method A: Git Integration (Zero Maintenance)
1. Push this project repository to **GitHub** or **GitLab**.
2. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Set Build Settings:
   - **Framework Preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment Variable**: `NODE_VERSION` = `20`
5. Click **Save and Deploy**. Your site will be live instantly on `*.pages.dev`.

### Method B: Direct Upload via Wrangler CLI (Command Line)
If you have a Cloudflare API Token:
```bash
CLOUDFLARE_ACCOUNT_ID="your-account-id" \
CLOUDFLARE_API_TOKEN="your-api-token" \
npx wrangler pages deploy dist --project-name=mahnoor-digital-solution
```

---

## 3. Option 2: Netlify (100% Free Tier)
1. Go to [Netlify](https://app.netlify.com/).
2. Choose **Add new site** > **Import an existing project** (or drag and drop the `dist/` folder).
3. The included `netlify.toml` automatically configures:
   - Build Command: `npm run build`
   - Publish directory: `dist`
   - SPA 200 rewrites for `/index.html`

---

## 4. Full-Stack / Backend Deployment for CRM Engine
The client-facing portfolio, contact forms, pricing calculator, and WhatsApp chat links work statically on Cloudflare Pages or Netlify.

To run the Node.js Client Acquisition Engine (`server.ts` - automated lead discovery, real IMAP inbox monitoring, and SMTP/WhatsApp dispatch):
- **Free Full-Stack Hosting Options**:
  1. **Render.com** (Free Web Service tier):
     - Build Command: `npm run build`
     - Start Command: `npm run start`
  2. **Railway.app** or **Fly.io**:
     - Connect repo, starts automatically with `npm run start`.
- **Connecting Frontend to Backend**:
  Set the environment variable in Cloudflare Pages / Netlify:
  `VITE_API_BASE_URL=https://your-backend-service.onrender.com`
  (The CRM client code will automatically direct all API requests to your live backend server).
