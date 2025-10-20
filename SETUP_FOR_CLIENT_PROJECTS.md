# Setting Up Agent Helper for Client Projects

This guide shows you how to use Agent Helper in your client projects (like World Seasonings).

## Option 1: Copy Agent Helper to Client Project

### 1. Copy Agent Helper Files

Copy these files from the Agent Helper project to your World Seasonings project:

```bash
# From your World Seasonings project directory
mkdir -p scripts/agent-helper
cp -r /Users/elliotnoteware/Documents/store_admin_shopify_app/scripts/agent-tool.js scripts/agent-helper/
cp /Users/elliotnoteware/Documents/store_admin_shopify_app/.env.example scripts/agent-helper/.env.example
```

### 2. Install Dependencies

In your World Seasonings project:

```bash
npm install dotenv
```

### 3. Create Environment File

```bash
cd scripts/agent-helper
cp .env.example .env
```

Edit `.env` with World Seasonings credentials:

```env
# World Seasonings Store Configuration
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_world_seasonings_token_here

# App Configuration
HOST=http://localhost:3001
PORT=3001
```

### 4. Add Scripts to package.json

In your World Seasonings project's `package.json`:

```json
{
  "scripts": {
    "agent": "node scripts/agent-helper/agent-tool.js",
    "agent-server": "node scripts/agent-helper/simple-oauth-server.js"
  }
}
```

### 5. Test the Setup

```bash
# Test agent tool
npm run agent

# Start OAuth server (if needed)
npm run agent-server
```

## Option 2: Use Agent Helper as External Tool

### 1. Keep Agent Helper Separate

Keep Agent Helper as a separate project and use it for multiple clients.

### 2. Create Client-Specific Environment Files

In your Agent Helper project:

```bash
# World Seasonings environment
cp .env.example .env.world-seasonings

# Edit with World Seasonings credentials
# SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
# SHOPIFY_ACCESS_TOKEN=shpat_world_seasonings_token
```

### 3. Run Against Specific Client

```bash
# Run against World Seasonings
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.world-seasonings | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.world-seasonings | cut -d '=' -f2) \
npm run agent
```

## Option 3: Git Submodule (Advanced)

### 1. Add Agent Helper as Submodule

In your World Seasonings project:

```bash
git submodule add https://github.com/your-repo/agent-helper.git scripts/agent-helper
```

### 2. Initialize and Update

```bash
git submodule init
git submodule update
```

## Recommended Approach: Option 2

I recommend **Option 2** because:

✅ **Centralized tool** - One Agent Helper for all clients  
✅ **Easy updates** - Update once, use everywhere  
✅ **Client isolation** - Separate environment files per client  
✅ **Professional setup** - Scalable for multiple clients  

## Quick Setup for World Seasonings

### 1. Get World Seasonings Access Token

1. Go to `https://world-seasonings-6425.myshopify.com/admin`
2. **Settings** → **Apps and integrations** → **Develop apps**
3. Create app or use existing one
4. **Configuration** → **Admin API access tokens**
5. **Install app** and copy the token

### 2. Create World Seasonings Environment

In your Agent Helper project:

```bash
cp .env.example .env.world-seasonings
```

Edit `.env.world-seasonings`:

```env
# World Seasonings Store Configuration
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_actual_token_here

# App Configuration
HOST=http://localhost:3001
PORT=3001
```

### 3. Test with World Seasonings

```bash
# Run agent tool against World Seasonings
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.world-seasonings | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.world-seasonings | cut -d '=' -f2) \
npm run agent
```

## Commands Summary

```bash
# Setup for World Seasonings
cp .env.example .env.world-seasonings
# Edit .env.world-seasonings with World Seasonings credentials

# Run against World Seasonings
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.world-seasonings | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.world-seasonings | cut -d '=' -f2) \
npm run agent

# Start OAuth server
npm run server
```

---

**Status**: Ready for Client Setup

**Next Action**: Choose your preferred option and set up for World Seasonings

**Recommended**: Option 2 (External Tool with Environment Files)
