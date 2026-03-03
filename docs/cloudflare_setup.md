# Cloudflare Pages + Access Setup

How this site is deployed and protected with email-based access control.

## Architecture

- **Hosting:** Cloudflare Pages (static site)
- **Access Control:** Cloudflare Zero Trust Access
- **Auth Methods:** Google OAuth + One-time PIN fallback
- **URL:** https://peru-brazil.pages.dev

## Deployment

### Prerequisites

```bash
brew install cloudflare-wrangler2
wrangler login
```

### Deploy

From the project root:

```bash
wrangler pages deploy . --project-name peru-brazil
```

This uploads all files (HTML, assets, PDFs) to Cloudflare Pages.

### Project Details

- **Project name:** `peru-brazil`
- **Production branch:** `main`
- **Account ID:** `4f4fe92062960d3669e1c9254bcce016`

## Access Control Setup

### 1. Set Up Cloudflare Zero Trust

1. Go to https://one.dash.cloudflare.com
2. First time: choose a team name (e.g. `harms`) — this becomes `harms.cloudflareaccess.com`
3. Select the free plan (up to 50 users)

### 2. Add Google OAuth as Login Method

1. In Zero Trust dashboard, go to **Settings > Authentication > Login methods**
2. Click **Add new** > **Google**

#### Create Google OAuth Credentials

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project (or use an existing one)
3. Go to **OAuth consent screen** and configure:
   - User type: External
   - App name: anything (e.g. "Peru Brazil Trip")
   - Add your email as a test user
4. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
   - Application type: Web application
   - Name: anything (e.g. "Cloudflare Access")
   - Authorized redirect URI: `https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/callback`
5. Copy the **Client ID** and **Client Secret**
6. Paste them into the Cloudflare Google login method configuration
7. Save

### 3. Create Access Application

1. In Zero Trust dashboard, go to **Access > Applications**
2. Click **Add an application** > **Self-hosted**
3. Configure:
   - **Application name:** Peru Brazil Trip
   - **Session duration:** 30 days (or your preference)
   - **Application domain:** `peru-brazil.pages.dev`
4. Create a policy:
   - **Policy name:** Whitelisted Emails
   - **Action:** Allow
   - **Include rule:** Emails
   - Add each email address you want to allow access
5. Save

## How It Works

1. User visits https://peru-brazil.pages.dev
2. Cloudflare Access intercepts the request
3. User sees a login page with "Sign in with Google" button
4. User authenticates with Google
5. If their email is on the whitelist, they're granted access
6. Session lasts for the configured duration (no re-login needed)

## Managing Access

### Add/Remove Users

1. Go to Zero Trust dashboard > **Access > Applications**
2. Edit the "Peru Brazil Trip" application
3. Edit the policy to add/remove email addresses

### Revoke a Session

1. Go to **Access > Applications > Peru Brazil Trip**
2. View active sessions and revoke if needed

## Redeploying

After making changes to the site:

```bash
wrangler pages deploy . --project-name peru-brazil
```

No access configuration changes needed — the policy stays in place.
