# Agent Helper - Production Deployment Guide

This guide shows you how to deploy Agent Helper for production use with real clients.

## Current Status: Development Only

**Current setup**: `http://localhost:3001` (development only)
**For production**: Need to deploy to a hosting platform

## Recommended Hosting Options

### Option 1: Vercel (Recommended)

**Pros**: Easy deployment, automatic HTTPS, custom domains
**Cost**: Free tier available
**Setup**: 5 minutes

#### Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Create vercel.json**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "simple-oauth-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/simple-oauth-server.js"
    }
  ]
}
```

3. **Deploy**:
```bash
vercel
```

4. **Update Partners Dashboard**:
- App URL: `https://your-app.vercel.app`
- Redirect URL: `https://your-app.vercel.app/auth/callback`

### Option 2: Railway

**Pros**: Simple deployment, good for Node.js apps
**Cost**: $5/month for hobby plan
**Setup**: 3 minutes

#### Deploy to Railway

1. **Connect GitHub repo**
2. **Set environment variables**:
   - `SHOPIFY_API_KEY`
   - `SHOPIFY_API_SECRET`
   - `HOST` (auto-generated)
3. **Deploy automatically**

### Option 3: Heroku

**Pros**: Reliable, well-documented
**Cost**: $7/month for basic plan
**Setup**: 10 minutes

#### Deploy to Heroku

1. **Create Procfile**:
```
web: node simple-oauth-server.js
```

2. **Deploy**:
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-app-name
git push heroku main
```

3. **Set environment variables**:
```bash
heroku config:set SHOPIFY_API_KEY=your_key
heroku config:set SHOPIFY_API_SECRET=your_secret
```

### Option 4: DigitalOcean App Platform

**Pros**: Simple deployment, good performance
**Cost**: $5/month
**Setup**: 5 minutes

## Quick Setup with Vercel (Recommended)

### 1. Prepare for Deployment

```bash
# Create vercel.json
cat > vercel.json << 'EOF'
{
  "version": 2,
  "builds": [
    {
      "src": "simple-oauth-server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/simple-oauth-server.js"
    }
  ]
}
EOF
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? agent-helper
# - Directory? ./
```

### 3. Update Environment Variables

In Vercel dashboard:
- `SHOPIFY_API_KEY`: `a501dae8bedca0ecfaf8812b5460cd68`
- `SHOPIFY_API_SECRET`: `your_api_secret_here`

### 4. Update Partners Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Find your "admin-helper" app
3. Update URLs:
   - **App URL**: `https://your-app.vercel.app`
   - **Redirect URL**: `https://your-app.vercel.app/auth/callback`

## Production vs Development

### Development (Current)
```
URL: http://localhost:3001
Use: Testing, development
Clients: Can't access
```

### Production (Recommended)
```
URL: https://agent-helper.vercel.app
Use: Real client installations
Clients: Can install and use
```

## Testing Production Deployment

### 1. Test Installation URL

```
https://your-app.vercel.app/auth/install?shop=world-seasonings-6425.myshopify.com
```

### 2. Complete OAuth Flow

1. Visit installation URL
2. Authorize the app
3. Get redirected back
4. App receives access token

### 3. Test Agent Tool

```bash
# Use production OAuth tokens
npm run agent
```

## Environment Variables for Production

### Required
```env
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_api_secret_here
HOST=https://your-app.vercel.app
```

### Optional
```env
PORT=3000
LOG_LEVEL=info
```

## Security Considerations

### Production Checklist
- ✅ **HTTPS only**: All URLs use HTTPS
- ✅ **Environment variables**: Secrets stored securely
- ✅ **Domain validation**: Validate shop domains
- ✅ **State parameter**: Use for CSRF protection
- ✅ **Token storage**: Store tokens securely

## Cost Comparison

| Platform | Cost | Setup Time | Features |
|----------|------|------------|----------|
| Vercel | Free | 5 min | Auto HTTPS, custom domains |
| Railway | $5/mo | 3 min | Simple deployment |
| Heroku | $7/mo | 10 min | Reliable, well-documented |
| DigitalOcean | $5/mo | 5 min | Good performance |

## Recommended: Vercel

**Why Vercel?**
- ✅ **Free tier** available
- ✅ **Automatic HTTPS**
- ✅ **Easy deployment**
- ✅ **Custom domains**
- ✅ **Good for Node.js apps**

## Next Steps

1. **Choose hosting platform** (recommend Vercel)
2. **Deploy OAuth server**
3. **Update Partners Dashboard URLs**
4. **Test with real client store**
5. **Share installation URL with clients**

---

**Current Status**: Development ready
**Next Action**: Deploy to production hosting platform
**Recommended**: Vercel (free, easy, reliable)
