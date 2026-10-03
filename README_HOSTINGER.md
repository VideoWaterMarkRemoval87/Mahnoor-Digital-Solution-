# Hostinger Shared Hosting Deployment Guide – Mahnoor Digital Solution

This React Single Page Application (SPA) is built with **Vite**, **TypeScript**, and **Tailwind CSS**. It builds into high-speed, purely static HTML, CSS, JavaScript, and asset files that run natively on **Hostinger Web Hosting**, **Hostinger Cloud Hosting**, **Hostinger WordPress Hosting**, and **cPanel**.

---

## 📁 1. Key Configuration Files Included

To ensure zero 404 errors on page refreshes and maximum performance, the following configuration files are already prepared:

| File Location | Purpose on Hostinger |
| :--- | :--- |
| `public/.htaccess` | Automatically copied to `dist/.htaccess` during `npm run build`. Directs all subroutes (`/services`, `/portfolio`, `/about`, `/contact`) to `index.html`, enables **Gzip compression**, configures **browser caching** for 1 year on hashed assets, and adds **security headers**. |
| `/.htaccess` | Root reference `.htaccess` for manual cPanel/hPanel setups. |
| `public/_redirects` | Netlify & Cloudflare fallback SPA redirect file. |
| `vercel.json` | Vercel SPA rewrite configuration. |

---

## ⚙️ 2. Build Steps Before Uploading

In your terminal or local environment, run the production build command:

```bash
npm run build
```

This compiles your application into the **`dist/`** directory.

### What is inside `dist/`?
- `index.html` – Primary entry point with SEO metadata, OpenGraph tags, and favicon.
- `.htaccess` – The LiteSpeed/Apache configuration file ensuring smooth routing and asset caching.
- `assets/` – Bundled and hashed CSS stylesheets, JS chunks, and images.

---

## 🚀 3. Step-by-Step Deployment on Hostinger hPanel

### Method A: Hostinger File Manager (Quickest & Simplest)

1. **Log in to Hostinger hPanel**:
   Navigate to [https://hpanel.hostinger.com](https://hpanel.hostinger.com).

2. **Open Your Website Dashboard**:
   Go to **Websites** → Find your domain (e.g., `mahnoordigitalsolution.com`) → Click **Manage**.

3. **Launch File Manager**:
   - In the left sidebar or quick search, click **Files** → **File Manager** (or **File Manager for Website**).
   - Double-click to enter the **`public_html`** directory.
   - *Note: If there is a default Hostinger `default.php` or `index.php` placeholder, delete or rename it.*

4. **Upload the `dist` Contents**:
   - **Tip**: To upload fast, zip your local `dist` folder into `dist.zip`.
   - In File Manager, click the **Upload** icon (top right) → select `dist.zip`.
   - Right-click `dist.zip` inside `public_html` → Click **Extract**.
   - Make sure all files (`index.html`, `.htaccess`, `assets/`) reside directly in `public_html/`, not inside a nested subfolder.
   - Alternatively, drag-and-drop the contents of `dist/` directly into File Manager.

5. **Verify Hidden Files**:
   - In Hostinger File Manager, ensure hidden files (dotfiles) are visible so you can see `.htaccess`.
   - Confirm that `public_html/.htaccess` exists alongside `public_html/index.html`.

---

### Method B: Deploying via Hostinger Git Auto-Deployment

If your code is in a GitHub, GitLab, or Bitbucket repository:

1. In **hPanel**, go to **Advanced** → **GIT**.
2. Paste your repository URL and choose branch `main`.
3. Set Directory to `/public_html` (or a subfolder).
4. Run `npm install && npm run build` (if SSH access is enabled on your plan) or use a GitHub Action that builds and FTPs the `dist/` folder.

---

## 🔒 4. Enable Free SSL & HTTPS

1. In hPanel, go to **Security** → **SSL**.
2. Click **Install SSL** for your domain (Hostinger includes free unlimited Let's Encrypt SSL).
3. Toggle on **Force HTTPS** so all visitors are automatically redirected to the secure `https://` version.
4. *(Optional)* If Force HTTPS is not available via the toggle, you can uncomment the HTTPS rewrite lines in `.htaccess`:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

## 📧 5. Set Up Professional Business Email

1. In hPanel, navigate to **Emails** → **Email Accounts**.
2. Click **Create Email Account** (e.g., `contact@mahnoordigitalsolution.com` or `info@...`).
3. Set your password.
4. Update `src/config/portfolioData.ts` to connect your contact forms and direct email links.

---

## ❓ 6. Common Issues & Troubleshooting

### Issue 1: "Refreshing `/services` gives a 404 Error"
- **Cause**: Shared hosting (LiteSpeed/Apache) tries to find a physical directory named `/services/index.html`.
- **Solution**: Ensure `.htaccess` is uploaded to `public_html/`. In File Manager, click Settings (gear icon) → enable **"Show Hidden Files"**. Verify `.htaccess` contains:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
  </IfModule>
  ```

### Issue 2: "Site is displaying a white blank screen"
- **Cause**: Assets linked with wrong base path or JavaScript bundle path error.
- **Solution**: The `vite.config.ts` in this project is set to relative root resolution. Ensure you uploaded files directly inside `public_html/`, so that `index.html` is at `public_html/index.html`, not inside `public_html/dist/index.html`.

### Issue 3: "Old version of the site keeps loading"
- **Cause**: Browser cache or Hostinger LiteSpeed cache.
- **Solution**: In hPanel, go to **LSCache / Cache Manager** and click **Purge All**. Then hard-refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`).
