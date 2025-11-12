# HTTPS Setup Guide for Hostinger VPS

This guide documents the successful process for enabling HTTPS/SSL certificates on subdomains hosted on Hostinger VPS using Let's Encrypt and Nginx.

**Last Updated:** November 2025  
**Server:** Hostinger VPS with Nginx  
**Note:** Hostinger uses a CDN/proxy layer that forces HTTP→HTTPS redirects, so DNS verification is required.

---

## Prerequisites

- Domain/subdomain pointing to your server
- Nginx installed and configured
- Root/sudo access to the server
- DNS access to add TXT records

---

## Step-by-Step Instructions

### Step 1: Find Your Nginx Config File

```bash
sudo nginx -T | grep -A 10 "yourdomain.com"
```

Note the config file path (usually `/etc/nginx/sites-enabled/yourdomain.com`).

### Step 2: Add ACME Challenge Location Block

Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-enabled/yourdomain.com
```

Add this location block **inside** the `server { ... }` block, **before** the `location /` block:

```nginx
location /.well-known/acme-challenge/ {
    root /var/www/yourdomain.com;
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
3. Wait 2-5 minutes for DNS propagation
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

    root /var/www/yourdomain.com/dist;
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

    root /var/www/yourdomain.com/dist;
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

## Important Notes

- **DNS Verification Required:** Hostinger's CDN forces HTTP→HTTPS redirects, so HTTP verification won't work
- **Directory Path:** The `.well-known` location uses parent directory (without `/dist`)
- **Certificate Location:** Certificates are saved to `/etc/letsencrypt/live/yourdomain.com/`
- **Domain Matching:** Ensure domain name matches exactly in certbot command and Nginx config

---

**Document Version:** 1.0  
**Tested On:** Hostinger VPS, November 2025
