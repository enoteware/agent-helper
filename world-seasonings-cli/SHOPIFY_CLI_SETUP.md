# Shopify CLI Setup Guide

This guide helps you connect your existing "admin-helper-2-1" app from the Partners Dashboard to a local CLI project.

## Step 1: Get Your App Client ID

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Find your "admin-helper-2-1" app
3. Go to **App setup** tab
4. Copy the **Client ID** (it looks like: `abc123def456ghi789`)

## Step 2: Initialize App with Shopify CLI

### Option A: Using Client ID (Recommended)
```bash
cd /Users/elliotnoteware/Documents/store_admin_shopify_app
shopify app init --client-id=YOUR_CLIENT_ID_HERE --template=node --name="admin-helper-2-1"
```

### Option B: Interactive Setup
```bash
cd /Users/elliotnoteware/Documents/store_admin_shopify_app
shopify app init --name="admin-helper-2-1" --template=node
```

## Step 3: Configure App Settings

After initialization, you'll need to configure:

1. **Organization selection** - Choose your organization
2. **App selection** - Select "admin-helper-2-1" from the list
3. **Template selection** - Choose "node" for CLI tools

## Step 4: Update Configuration

The CLI will create a new directory. Update the configuration:

```bash
# Navigate to the new app directory
cd admin-helper-2-1

# Update shopify.app.toml with your app settings
# The CLI should have populated this automatically
```

## Step 5: Test the Setup

```bash
# Check app info
shopify app info

# Start development
shopify app dev
```

## Alternative: Manual Configuration

If the CLI setup doesn't work, you can manually configure:

### 1. Update shopify.app.toml
```toml
# App Information
name = "admin-helper-2-1"
client_id = "your_client_id_from_partners_dashboard"
application_url = "https://your-app-url.com"
embedded = false

# Private App Configuration
access_scopes = "write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_inventory,read_inventory"
```

### 2. Get Admin API Access Token
1. In Partners Dashboard, go to your app
2. Go to **Configuration** tab
3. Under **Admin API access tokens**, click **Install an app**
4. Copy the access token (starts with `shpat_`)

### 3. Create .env file
```bash
cp .env.example .env
# Edit .env with your credentials
```

```env
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
SHOPIFY_CLIENT_ID=your_client_id_here
```

## Troubleshooting

### "Failed to prompt" Error
This happens in non-interactive environments. Try:
1. Run commands in your local terminal (not through automation)
2. Use the `--client-id` flag to avoid prompts
3. Make sure you're logged in: `shopify auth login`

### "Command not found"
Make sure Shopify CLI is installed:
```bash
npm install -g @shopify/cli @shopify/theme
```

### "Organization not found"
Make sure you're logged in with the correct account:
```bash
shopify auth login
```

## Next Steps After Setup

1. ✅ Test app connection: `shopify app info`
2. ✅ Start development: `shopify app dev`
3. ✅ Create agent scripts in the new project
4. ✅ Deploy when ready: `shopify app deploy`

## Resources

- [Shopify CLI Documentation](https://shopify.dev/docs/apps/tools/cli)
- [App Development Guide](https://shopify.dev/docs/apps)
- [Partners Dashboard](https://partners.shopify.com)

---

**Status**: Ready for CLI Setup

**Next Action**: Get Client ID from Partners Dashboard and run `shopify app init`
