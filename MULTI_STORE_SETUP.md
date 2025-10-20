# Multi-Store Setup Guide

This guide explains how to use your public app across multiple stores.

## Approach 1: Public App with OAuth (Recommended)

### How It Works
- ✅ **One app** works on **all stores**
- ✅ **OAuth flow** handles authentication per store
- ✅ **No manual token management** needed
- ✅ **Store owners install** the app themselves

### Setup Process

1. **Deploy your app** to production
2. **Store owners install** the app via OAuth
3. **App automatically gets** store-specific access tokens
4. **Agents use the app** on any installed store

### Installation Flow
```
Store Owner → Installs App → OAuth Flow → App Gets Token → Ready to Use
```

## Approach 2: Per-Store Environment Files

If you prefer to manage tokens manually per store:

### Store-Specific Setup
```bash
# Store 1 (World Seasonings)
cp .env.example .env.world-seasonings
# Edit .env.world-seasonings with store 1 credentials

# Store 2 (Another Store)  
cp .env.example .env.another-store
# Edit .env.another-store with store 2 credentials
```

### Running Against Specific Stores
```bash
# Run against World Seasonings
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.world-seasonings | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.world-seasonings | cut -d '=' -f2) \
npm run agent

# Run against Another Store
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.another-store | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.another-store | cut -d '=' -f2) \
npm run agent
```

## Getting Access Tokens

### For Public App (OAuth Method)
1. **Deploy app**: `npm run deploy`
2. **Get installation URL** from Partners Dashboard
3. **Store owners install** the app
4. **App automatically gets** access tokens

### For Manual Token Method
1. **Go to store admin**: `https://store.myshopify.com/admin`
2. **Settings** → **Apps and integrations** → **Develop apps**
3. **Create app** or select existing one
4. **Configuration** tab → **Admin API access tokens**
5. **Install app** and copy the token

## Recommended Project Structure

### Single App, Multiple Stores (OAuth)
```
admin-helper-agent-cli/
├── shopify.app.toml          # App configuration
├── package.json              # Dependencies
├── scripts/
│   └── agent-tool.js         # Works with any installed store
└── .env                      # Optional: for development only
```

### Multiple Apps, Multiple Stores (Manual Tokens)
```
store-management-tools/
├── world-seasonings-cli/
│   ├── .env                  # World Seasonings credentials
│   └── scripts/
├── another-store-cli/
│   ├── .env                  # Another store credentials
│   └── scripts/
└── shared/
    └── common-scripts/       # Shared agent tools
```

## Which Approach Should You Use?

### Use OAuth (Public App) When:
- ✅ **Multiple stores** need the same functionality
- ✅ **Store owners** can install the app themselves
- ✅ **You want automatic** token management
- ✅ **Professional deployment** with proper OAuth flow

### Use Manual Tokens When:
- ✅ **Internal tools** for specific stores
- ✅ **Custom scripts** per store
- ✅ **Direct API access** without OAuth complexity
- ✅ **Development/testing** scenarios

## Quick Start for OAuth Approach

1. **Deploy your app**:
```bash
npm run deploy
```

2. **Get installation URL** from Partners Dashboard

3. **Store owners install** the app

4. **Agents use the app** on any installed store

## Quick Start for Manual Token Approach

1. **Create store-specific environment**:
```bash
cp .env.example .env.world-seasonings
# Edit with World Seasonings credentials
```

2. **Run against specific store**:
```bash
# Use the environment file
source .env.world-seasonings && npm run agent
```

## Example: Running Against Different Stores

### Method 1: Environment Files
```bash
# World Seasonings
source .env.world-seasonings && npm run agent

# Another Store
source .env.another-store && npm run agent
```

### Method 2: Command Line Override
```bash
# World Seasonings
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com \
SHOPIFY_ACCESS_TOKEN=shpat_world_seasonings_token \
npm run agent

# Another Store
SHOPIFY_STORE_DOMAIN=another-store.myshopify.com \
SHOPIFY_ACCESS_TOKEN=shpat_another_store_token \
npm run agent
```

## Security Considerations

### OAuth Method
- ✅ **Secure** - Tokens managed by Shopify
- ✅ **Automatic expiration** handling
- ✅ **Proper permissions** per store
- ✅ **Revocable** by store owners

### Manual Token Method
- ⚠️ **Store tokens** in secure locations
- ⚠️ **Rotate tokens** regularly
- ⚠️ **Never commit** tokens to git
- ⚠️ **Use different tokens** for different environments

## Next Steps

1. **Choose your approach** (OAuth vs Manual)
2. **Set up your first store** for testing
3. **Test the agent tool** functionality
4. **Scale to additional stores** as needed

---

**Recommendation**: Use the **OAuth approach** for a professional, scalable solution that works across multiple stores.
