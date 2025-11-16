# HTTPS Setup Guide for Hostinger VPS

This guide documents the successful process for enabling HTTPS/SSL certificates on subdomains hosted on Hostinger VPS using Let's Encrypt and Nginx.

**Last Updated:** November 2025  
**Server:** Hostinger VPS with Nginx  
**Note:** Hostinger’s default DNS often points to their CDN/proxy (`*.cdn.hstgr.net`). To serve from your VPS, point DNS directly to your VPS IP (disable the CDN records). For SSL issuance, use DNS verification.

---

## Prerequisites

- Domain/subdomain pointing to your server
- Nginx installed and configured
- Root/sudo access to the server
- DNS access to add TXT records

---

## Step-by-Step Instructions (Working Recipe)

### Step 0: Point DNS to your VPS (disable Hostinger CDN)

In your DNS zone:

- Remove CDN records (if present):
  - Remove `ALIAS @ -> yourdomain.com.cdn.hstgr.net`
  - Remove `CNAME www -> www.yourdomain.com.cdn.hstgr.net`
- Add/keep direct records to your VPS:
  - `A @ -> YOUR_VPS_IPV4` (TTL 300)
  - Optional: `AAAA @ -> YOUR_VPS_IPV6` (only if your VPS has IPv6 and Nginx listens on it)
  - Optional: `CNAME www -> @` (or `www -> yourdomain.com`) for the www host

Verify (after a few minutes):

```bash
dig +short A yourdomain.com
dig +short A www.yourdomain.com
```

These must return only your VPS IPs (not `hstgr.net`). If you still see Hostinger’s holding page over HTTPS, your DNS is still pointing at the CDN.

### Step 1: Find Your Nginx Config File

```bash
sudo nginx -T | grep -A 10 "yourdomain.com"
```

Note the config file path (usually `/etc/nginx/sites-available/yourdomain.com`, enabled via a symlink in `sites-enabled`).

### Step 2: Add ACME Challenge Location Block

Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-enabled/yourdomain.com
```

Add this location block **inside** the `server { ... }` block, **before** the `location /` block:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/yourdomain.com;  # parent dir (not /dist or /html)
}
```

**Important:** Use the parent directory path (without `/dist`) for the `root` in this location block.

### Step 3: Create the .well-known Directory

```bash
sudo mkdir -p /var/www/yourdomain.com/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/yourdomain.com/.well-known
sudo chmod -R 755 /var/www/yourdomain.com/.well-known
```

### Step 4: Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Obtain SSL Certificate (DNS Verification)

```bash
sudo apt update
sudo apt install certbot -y
sudo certbot certonly --manual --preferred-challenges dns -d yourdomain.com
```

**Follow the prompts:**
1. Certbot will display a TXT record to add to your DNS
2. Add the TXT record at your DNS provider
3. Wait 2–10 minutes for DNS propagation (use the lowest TTL your provider allows, e.g. 300)
4. Press Enter to continue verification
5. Certificate will be saved to `/etc/letsencrypt/live/yourdomain.com/`

### Step 6: Configure Nginx for HTTPS

Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-enabled/yourdomain.com
```

Replace the entire file with this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Serve your built app via a stable docroot symlink
    # (We recommend linking /var/www/yourdomain.com/html -> dist on each deploy)
    root /var/www/yourdomain.com/html;
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/yourdomain.com;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Replace `yourdomain.com` with your actual domain in all locations.**

### Step 7: Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Verify HTTPS

Visit `https://yourdomain.com` in your browser. You should see a valid SSL certificate.

From the server:

```bash
curl -I http://yourdomain.com/
curl -I https://yourdomain.com/
```

Headers should not include `server: hcdn` (Hostinger CDN). If they do, update DNS to point directly to your VPS (see Step 0).

---

## Complete Example: React/Vite App

For a React/Vite application, here's the complete working config:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/yourdomain.com/html;  # html -> dist symlink
    index index.html;

    location /.well-known/acme-challenge/ {
        root /var/www/yourdomain.com;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Quick Copy-Paste Checklist

Replace `yourdomain.com` with your actual domain, then run:

```bash
# 0. DNS to VPS (disable CDN)
# - Remove ALIAS/CNAME to *.cdn.hstgr.net
# - Add A @ -> YOUR_VPS_IP (TTL 300), CNAME www -> yourdomain.com (optional)

# 1. Find config
sudo nginx -T | grep -A 10 "yourdomain.com"

# 2. Edit config and add ACME location block (see Step 2)

# 3. Create directory
sudo mkdir -p /var/www/yourdomain.com/.well-known/acme-challenge
sudo chown -R www-data:www-data /var/www/yourdomain.com/.well-known
sudo chmod -R 755 /var/www/yourdomain.com/.well-known

# 4. Test and reload
sudo nginx -t && sudo systemctl reload nginx

# 5. Get certificate
sudo certbot certonly --manual --preferred-challenges dns -d yourdomain.com

# 6. Update config with HTTPS (see Step 6)

# 7. Test and reload
sudo nginx -t && sudo systemctl reload nginx

# 8. Deploy app on updates
# cd /var/www/yourdomain.com && npm ci && npx vite build
# ln -sfn /var/www/yourdomain.com/dist /var/www/yourdomain.com/html
```

---

## Certificate Renewal

Certificates expire after 90 days. To renew manually:

```bash
sudo certbot certonly --manual --preferred-challenges dns -d yourdomain.com
```

Then reload Nginx:

```bash
sudo systemctl reload nginx
```

**Note:** Manual certificates don't auto-renew. You'll need to repeat the DNS verification process before expiry.

---

## Important Notes & Hostinger Gotchas

- **Disable CDN for origin:** Remove `ALIAS/CNAME` to `*.cdn.hstgr.net` so traffic hits your VPS.
- **Use DNS-01 validation:** Hostinger’s edge may interfere with HTTP validation; DNS TXT works reliably.
- **Directory Path:** The `.well-known` location uses parent directory (without `/dist` or `/html`).
- **Docroot pattern:** Use a stable docroot `/var/www/yourdomain.com/html` that symlinks to `dist` on deploys.
- **Certificate Location:** Certificates are saved to `/etc/letsencrypt/live/yourdomain.com/`.
- **Domain Matching:** Ensure `server_name` and Certbot `-d` match exactly.

---

**Document Version:** 1.0  
**Tested On:** Hostinger VPS, November 2025
