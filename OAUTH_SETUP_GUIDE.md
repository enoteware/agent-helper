# OAuth Setup Guide

This guide helps you set up OAuth for your World Seasonings Agent CLI public app.

## Current Status

✅ **App Connected**: admin-helper (Client ID: a501dae8bedca0ecfaf8812b5460cd68)  
✅ **Server Created**: Express server with OAuth endpoints  
✅ **Dependencies Installed**: Express and Shopify API libraries  
⏳ **API Secret Needed**: Get from Partners Dashboard  

## Step 1: Get API Secret from Partners Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Find your "admin-helper" app
3. Go to **App setup** tab
4. Copy the **API secret key**
5. Update your `.env` file:

```env
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_actual_api_secret_here
HOST=http://localhost:3000
PORT=3000
```

## Step 2: Update App URLs in Partners Dashboard

1. In Partners Dashboard, go to your app
2. Go to **App setup** tab
3. Update these URLs:

```
App URL: http://localhost:3000
Allowed redirection URL(s): http://localhost:3000/auth/callback
```

## Step 3: Test the OAuth Server

```bash
# Start the OAuth server
npm run server

# Server will start on http://localhost:3000
```

## Step 4: Test Installation

1. **Visit the installation URL**:
   ```
   http://localhost:3000/auth/install?shop=your-store.myshopify.com
   ```

2. **Complete OAuth flow**:
   - Authorize the app
   - Get redirected back to your server
   - App gets access token automatically

## Step 5: Use the Agent Tool

After successful installation:

```bash
# Test the agent tool
npm run agent

# The tool will now work with the installed store
```

## OAuth Flow Explained

```
1. Store Owner → Visits installation URL
2. Shopify → Shows authorization page
3. Store Owner → Authorizes the app
4. Shopify → Redirects to /auth/callback with code
5. Your App → Exchanges code for access token
6. Your App → Stores token and shows success page
7. Agent Tool → Can now access store data
```

## Development vs Production

### Development (Current Setup)
- **URL**: http://localhost:3000
- **Use ngrok** for external access during development
- **Test with dev stores**

### Production
- **Deploy to hosting platform** (Heroku, Vercel, etc.)
- **Update URLs** in Partners Dashboard
- **Use HTTPS** for security

## Using ngrok for Development

```bash
# Install ngrok
npm install -g ngrok

# Start your server
npm run server

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL in Partners Dashboard
```

## Testing with Different Stores

Once OAuth is set up:

1. **Install on Store 1**:
   ```
   http://localhost:3000/auth/install?shop=store1.myshopify.com
   ```

2. **Install on Store 2**:
   ```
   http://localhost:3000/auth/install?shop=store2.myshopify.com
   ```

3. **Agent tool works with all installed stores**

## Troubleshooting

### "Invalid API secret"
→ Make sure you copied the correct API secret from Partners Dashboard

### "Redirect URI mismatch"
→ Update the redirect URL in Partners Dashboard to match your server

### "Shop parameter missing"
→ Make sure to include ?shop=store-name.myshopify.com in the URL

### "Authentication failed"
→ Check that your API key and secret are correct

## Next Steps

1. ✅ **Get API secret** from Partners Dashboard
2. ✅ **Update .env file** with correct credentials
3. ✅ **Start OAuth server**: `npm run server`
4. ✅ **Test installation** on a store
5. ✅ **Use agent tool** with installed stores

## Commands Summary

```bash
# Start OAuth server
npm run server

# Test agent tool
npm run agent

# Show app info
npm run info

# Deploy to production
npm run deploy
```

---

**Status**: Ready for OAuth Setup

**Next Action**: Get API secret from Partners Dashboard and update .env file

**Server URL**: http://localhost:3000

**Installation URL**: http://localhost:3000/auth/install?shop=your-store.myshopify.com
