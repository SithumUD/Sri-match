# 🚀 SriMatch Enterprise Production Deployment Guide (Beginner-to-End)

**Domain:** `sithum-dev.online` (Registered at Namecheap)  
**Infrastructure Stack:** Namecheap $\rightarrow$ Cloudflare $\rightarrow$ Hetzner Cloud (Backend/DB) & Netlify (Frontend)  
**Audience:** First-time Deployer / Full-Stack Engineer

---

## 📑 Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Phase 1: Connect Namecheap Domain to Cloudflare](#phase-1-connect-namecheap-domain-to-cloudflare)
3. [Phase 2: Cloudflare Setup (DNS, SSL, WebSockets, Turnstile, R2)](#phase-2-cloudflare-setup-dns-ssl-websockets-turnstile-r2)
4. [Phase 3: Hetzner Cloud Server Setup (Backend & Database)](#phase-3-hetzner-cloud-server-setup-backend--database)
5. [Phase 4: Generate All Security Secrets Locally](#phase-4-generate-all-security-secrets-locally)
6. [Phase 5: Deploy Frontend to Netlify](#phase-5-deploy-frontend-to-netlify)
7. [Phase 6: Configure GitHub Secrets & Trigger CI/CD](#phase-6-configure-github-secrets--trigger-cicd)
8. [Phase 7: End-to-End Verification & Health Checks](#phase-7-end-to-end-verification--health-checks)
9. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## 1. High-Level Architecture

```
                             End User (Browser / Mobile App)
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE (DNS, DDoS, SSL, WAF)                           │
│                     Nameservers delegated from Namecheap DNS                           │
└──────────────────┬──────────────────────────────────────────────┬──────────────────────┘
                   │ (sithum-dev.online & www.sithum-dev.online)  │ (api.sithum-dev.online)
                   ▼                                              ▼
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│           NETLIFY EDGE CDN           │          │     HETZNER CLOUD VPS (Ubuntu 24.04) │
│ - Next.js 16 SSR & Static Web App    │          │ - Caddy (Auto Let's Encrypt HTTPS)   │
│ - Global High-Speed CDN Caching      │          │ - Spring Boot 3.3.4 (Java 21 REST)   │
│ - Automatic Netlify SSL              │          │ - PostgreSQL 16 (Flyway Migrations)  │
└──────────────────┬───────────────────┘          │ - Redis 7 (Cache, Sessions, Presence)│
                   │                              └───────────────▲──────────────────────┘
                   │ HTTPS API Requests                           │
                   └──────────────────────────────────────────────┘
```

---

## Phase 1: Connect Namecheap Domain to Cloudflare

Because Namecheap holds your domain (`sithum-dev.online`), you will delegate the DNS management to Cloudflare for enterprise DDoS protection, automatic CDN caching, and free SSL certificates.

### Step 1.1: Add `sithum-dev.online` in Cloudflare

1. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com/) (or log in).
2. On your Cloudflare dashboard, click **Add a Domain** (or **Add a Site**).
3. Type **`sithum-dev.online`** $\rightarrow$ Click **Continue**.
4. Select the **Free Plan** ($0/mo) at the bottom $\rightarrow$ Click **Continue**.
5. Cloudflare will scan existing DNS records. Click **Continue** to reach the nameserver screen.
6. Cloudflare will give you **2 Custom Nameservers** (for example: `dave.ns.cloudflare.com` and `chloe.ns.cloudflare.com`). **Copy both nameservers**.

### Step 1.2: Point Namecheap to Cloudflare Nameservers

1. Log into your [Namecheap Dashboard](https://ap.www.namecheap.com/).
2. In the left menu, click **Domain List** $\rightarrow$ Find **`sithum-dev.online`** $\rightarrow$ Click **Manage**.
3. Scroll to the **Nameservers** section:
   - Change the dropdown from _Namecheap BasicDNS_ to **Custom DNS**.
   - Paste **Nameserver 1** into the first box.
   - Paste **Nameserver 2** into the second box.
   - Click the **Green Checkmark (✓)** on the right to save.
4. Go back to Cloudflare and click **Done, check nameservers**. _(DNS propagation takes anywhere from 2 to 15 minutes)_.

---

## Phase 2: Cloudflare Setup (DNS, SSL, WebSockets, Turnstile, R2)

### Step 2.1: Configure SSL/TLS Mode

1. In Cloudflare, click your domain **`sithum-dev.online`**.
2. Go to **SSL/TLS** $\rightarrow$ **Overview**.
3. Set the encryption mode to **Full (Strict)**.

### Step 2.2: Enable WebSockets

1. In the Cloudflare left sidebar, go to **Network**.
2. Ensure **WebSockets** is toggled **ON** _(This is required for real-time match chat and notifications)_.

### Step 2.3: Create Cloudflare Turnstile CAPTCHA (Bot Defense)

1. In the left sidebar of Cloudflare, click **Turnstile**.
2. Click **Add Widget**:
   - **Widget Name:** `SriMatch Auth`
   - **Domain:** `sithum-dev.online` (also add `localhost` for local dev)
   - **Widget Mode:** `Managed` (recommended)
3. Click **Create**:
   - Save the **Site Key** (Public, used on Frontend).
   - Save the **Secret Key** (Private, used on Backend).

### Step 2.4: Set Up Cloudflare R2 (Media & Profile Photo Storage)

1. In the left sidebar, click **R2 Object Storage**.
2. Click **Create Bucket**:
   - **Bucket Name:** `srimatch-media`
   - Click **Create Bucket**.
3. Click on the newly created `srimatch-media` bucket $\rightarrow$ Go to the **Settings** tab:
   - Under **Public access** $\rightarrow$ **Custom Domains** $\rightarrow$ Click **Connect Domain**.
   - Enter: **`media.sithum-dev.online`** $\rightarrow$ Click **Continue** $\rightarrow$ Click **Connect Domain**.
4. Go back to **R2 Object Storage** main page $\rightarrow$ Click **Manage R2 API Tokens** (top right):
   - Click **Create API Token**.
   - Permissions: **Object Read & Write**.
   - Bucket: Select `srimatch-media`.
   - Click **Create API Token**.
5. Save the generated credentials:
   - **Account ID:** (Found in Cloudflare Dashboard URL or right sidebar of Overview)
   - **Access Key ID**
   - **Secret Access Key**

---

## Phase 3: Hetzner Cloud Server Setup (Backend & Database)

### Option A: Using Terraform (Recommended & 100% Automated)

1. Sign up / log into [Hetzner Cloud Console](https://console.hetzner.cloud/).
2. Create a Project named `SriMatch-Production`.
3. Go to **Security** $\rightarrow$ **API Tokens** $\rightarrow$ Click **Generate API Token** (Read & Write permissions) $\rightarrow$ Copy the token.
4. On your local machine in PowerShell, generate a dedicated SSH key pair:
   ```powershell
   ssh-keygen -t ed25519 -C "deploy@sithum-dev.online" -f "$HOME/.ssh/srimatch_deploy"
   ```
5. In your project, navigate to `terraform/`:
   ```powershell
   cd terraform
   copy terraform.tfvars.example terraform.tfvars
   ```
6. Open `terraform/terraform.tfvars` and set:
   - `hcloud_token` = `"<YOUR_HETZNER_API_TOKEN>"`
   - `ssh_public_key` = `"<Contents of $HOME/.ssh/srimatch_deploy.pub>"`
   - `server_location` = `"sin"` (Singapore) or `"fsn1"` (Germany)
7. Run Terraform:
   ```powershell
   terraform init
   terraform apply
   ```
   _(Type `yes` when prompted)_.
8. Terraform will print the **`server_ipv4`** (e.g., `128.140.x.x`).

### Option B: Manual Server Creation in Hetzner Console

If not using Terraform:

1. Click **Add Server**:
   - **Location:** Singapore (`sin`) or Germany (`fsn1`)
   - **Image:** Ubuntu 24.04 LTS
   - **Type:** Standard Cloud $\rightarrow$ `CPX21` (3 vCPU, 4GB RAM) or `CPX31` (4 vCPU, 8GB RAM)
   - **SSH Key:** Paste the content of your public key (`$HOME/.ssh/srimatch_deploy.pub`).
   - **Name:** `srimatch-prod-backend`
2. Click **Create & Buy Now**. Note down the public **IPv4 address**.

---

## Phase 4: Configure Cloudflare DNS Records

Now that you have your Hetzner Server IP and will connect Netlify, add these DNS records in Cloudflare:

1. In Cloudflare, go to **DNS** $\rightarrow$ **Records** $\rightarrow$ Click **Add Record**:

| Type      | Name    | Target / Content                                       | Proxy Status                                                           | Notes                       |
| :-------- | :------ | :----------------------------------------------------- | :--------------------------------------------------------------------- | :-------------------------- |
| **A**     | `api`   | `<YOUR_HETZNER_SERVER_IPV4>`                           | **DNS Only (Grey Cloud)** _(Switch to Proxied after first SSL issued)_ | Backend API                 |
| **CNAME** | `@`     | `<your-site-name>.netlify.app`                         | **Proxied (Orange Cloud)**                                             | Web Root                    |
| **CNAME** | `www`   | `<your-site-name>.netlify.app`                         | **Proxied (Orange Cloud)**                                             | WWW Web                     |
| **CNAME** | `media` | `srimatch-media.<account-id>.r2.cloudflarestorage.com` | **Proxied (Orange Cloud)**                                             | (Added automatically by R2) |

---

## Phase 5: Generate All Security Secrets Locally

Run these quick commands in PowerShell / Terminal to generate high-entropy cryptographic keys:

```powershell
# 1. 256-bit Hex JWT Secret
$jwt = -join ((1..32) | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 256) })
Write-Host "JWT_SECRET = $jwt"

# 2. 32-character AES-256 Key
$aes = -join ((1..16) | ForEach-Object { "{0:x2}" -f (Get-Random -Minimum 0 -Maximum 256) })
Write-Host "APP_ENCRYPTION_KEY = $aes"

# 3. Secure Passwords for Postgres & Redis
$dbPass = [Convert]::ToBase64String((1..24 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
$redisPass = [Convert]::ToBase64String((1..24 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
Write-Host "DB_PASSWORD = $dbPass"
Write-Host "REDIS_PASSWORD = $redisPass"
```

Save these values securely.

---

## Phase 6: Deploy Frontend to Netlify

1. Sign up / log into [Netlify](https://app.netlify.com/).
2. Click **Add new site** $\rightarrow$ **Import an existing project** $\rightarrow$ Select **GitHub** $\rightarrow$ Choose your `Sri-match` repository.
3. Configure Build Settings:
   - **Base directory:** `srimatch-web`
   - **Build command:** `npm run build`
   - **Publish directory:** `srimatch-web/.next`
4. In **Environment variables**, click **Add a variable** and enter:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://api.sithum-dev.online`
   - `NEXT_PUBLIC_API_URL` = `https://api.sithum-dev.online`
   - `NEXT_PUBLIC_WS_URL` = `wss://api.sithum-dev.online/ws-chat`
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = `<Your Cloudflare Turnstile Site Key>`
5. Click **Deploy Site**.
6. Once created, go to **Site configuration** $\rightarrow$ **Domain management** $\rightarrow$ Click **Add a domain**:
   - Enter `sithum-dev.online` and `www.sithum-dev.online`.
7. Retrieve your Netlify credentials for automated GitHub CI/CD:
   - **Site ID:** Found in **Site configuration** $\rightarrow$ **General** $\rightarrow$ **Site details** $\rightarrow$ **Site ID**.
   - **Auth Token:** Click your Profile avatar (top right) $\rightarrow$ **User settings** $\rightarrow$ **Applications** $\rightarrow$ **OAuth** $\rightarrow$ **New access token**.

---

## Phase 7: Configure GitHub Secrets & Trigger CI/CD

In your GitHub repository, navigate to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ Click **New repository secret** for each of the following:

### A. Infrastructure & Hetzner Server

| Secret Name               | Value                                    | Description                              |
| :------------------------ | :--------------------------------------- | :--------------------------------------- |
| `HETZNER_HOST_IP`         | `128.140.x.x`                            | Your Hetzner Server Public IPv4          |
| `HETZNER_SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | Contents of `$HOME/.ssh/srimatch_deploy` |

### B. Backend Production Configuration

| Secret Name               | Value                                                     | Description                           |
| :------------------------ | :-------------------------------------------------------- | :------------------------------------ |
| `DOMAIN_NAME`             | `api.sithum-dev.online`                                   | Domain for backend API                |
| `ACME_EMAIL`              | `admin@sithum-dev.online`                                 | Email for Let's Encrypt notifications |
| `DB_NAME`                 | `srimatch_db`                                             | Database name                         |
| `DB_USERNAME`             | `srimatch_user`                                           | Database username                     |
| `DB_PASSWORD`             | `<Generated DB Password>`                                 | PostgreSQL password                   |
| `REDIS_PASSWORD`          | `<Generated Redis Password>`                              | Redis password                        |
| `JWT_SECRET`              | `<Generated 64-char Hex>`                                 | JWT Secret key                        |
| `APP_ENCRYPTION_KEY`      | `<Generated 32-char AES>`                                 | Encryption key                        |
| `R2_ENABLED`              | `true`                                                    | Enable Cloudflare R2                  |
| `R2_ACCOUNT_ID`           | `<Cloudflare Account ID>`                                 | Cloudflare Account ID                 |
| `R2_ACCESS_KEY_ID`        | `<R2 Access Key ID>`                                      | Cloudflare R2 Access Key              |
| `R2_SECRET_ACCESS_KEY`    | `<R2 Secret Access Key>`                                  | Cloudflare R2 Secret Key              |
| `R2_BUCKET_NAME`          | `srimatch-media`                                          | R2 Bucket Name                        |
| `R2_PUBLIC_CUSTOM_DOMAIN` | `https://media.sithum-dev.online`                         | Public custom media domain            |
| `BREVO_API_KEY`           | `<Brevo API Key>`                                         | Transactional email API key           |
| `CORS_ALLOWED_ORIGINS`    | `https://sithum-dev.online,https://www.sithum-dev.online` | Allowed frontend origins              |

### C. Frontend Netlify Deployment

| Secret Name               | Value                                 | Description              |
| :------------------------ | :------------------------------------ | :----------------------- |
| `NETLIFY_AUTH_TOKEN`      | `<Netlify Access Token>`              | Netlify API token        |
| `NETLIFY_SITE_ID`         | `<Netlify Site ID>`                   | Netlify API site ID      |
| `NEXT_PUBLIC_BACKEND_URL` | `https://api.sithum-dev.online`       | Production backend URL   |
| `NEXT_PUBLIC_API_URL`     | `https://api.sithum-dev.online`       | Production backend URL   |
| `NEXT_PUBLIC_WS_URL`      | `wss://api.sithum-dev.online/ws-chat` | Production WebSocket URL |

---

## Phase 8: Deploy Everything!

Commit and push to the `main` branch:

```bash
git add .
git commit -m "chore: configure production deployment for sithum-dev.online"
git push origin main
```

### What happens automatically:

1. **Frontend CI/CD (`frontend-netlify.yml`):** Runs `npm run build` and deploys the optimized Next.js bundle directly to Netlify edge.
2. **Backend CI/CD (`backend-ci-cd.yml`):**
   - Executes Spring Boot test suite.
   - Builds and publishes Docker image to `ghcr.io`.
   - Connects via SSH to your Hetzner VPS.
   - Creates `/opt/srimatch/.env` with your secure secrets.
   - Runs `docker compose -f docker-compose.prod.yml up -d`.
   - Automatically provisions SSL certificates via Caddy.
   - Verifies health via `http://localhost:8080/api/actuator/health`.

---

## 9. Verification & Health Checks

Once GitHub Actions finishes (green checkmarks):

1. **Verify Backend Health:**
   Open in browser or terminal:

   ```bash
   curl -I https://api.sithum-dev.online/api/actuator/health
   ```

   _Expected result: `HTTP/2 200 OK` with status `{"status":"UP"}`._

2. **Verify Frontend:**
   - Visit `https://sithum-dev.online` and `https://www.sithum-dev.online`.
   - Test registering an account, logging in, uploading a profile picture (verifying R2 connection), and checking real-time chat.

---

## 💡 Troubleshooting & FAQs

- **Caddy SSL Error (Self-Signed / Certificate Not Issued):**  
  Ensure the Cloudflare `api` A-record was set to **DNS Only (Grey Cloud)** for the first 5 minutes so Let's Encrypt ACME HTTP-01 challenge can reach Caddy directly. Once the cert is issued, you can turn Cloudflare Proxy (Orange Cloud) back on.
- **CORS Blocked Error:**  
  Make sure `CORS_ALLOWED_ORIGINS` includes both `https://sithum-dev.online` and `https://www.sithum-dev.online` (no trailing slash).
- **WebSocket Connection Drops:**  
  Verify in Cloudflare $\rightarrow$ **Network** that **WebSockets** is enabled.
