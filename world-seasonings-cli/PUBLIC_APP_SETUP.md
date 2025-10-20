# Public App Setup Guide

This guide helps you create a **Public App** that can be installed on any Shopify store, perfect for agent tools.

## What is a Public App?

A **Public App** is an app that:
- ✅ Can be installed on ANY Shopify store
- ✅ Uses OAuth for installation and authentication
- ✅ Store owners can install/uninstall from their admin
- ✅ Perfect for agent tools used across multiple stores
- ✅ Can be listed in the Shopify App Store (optional)

## Step-by-Step Setup

### 1. Create New Public App in Partners Dashboard

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click **Apps** in the sidebar
3. Click **Create app**
4. Choose **Public app** (NOT Custom app)
5. Fill in the details:

```
App name: Agent CLI Tool
App URL: https://your-domain.com (or use ngrok for development)
Allowed redirection URL(s): https://your-domain.com/auth/callback
```

### 2. Configure App Settings

#### Basic Information
- **App name**: Agent CLI Tool
- **App description**: A powerful CLI tool for agents to manage Shopify store data including products, orders, customers, and inventory.
- **App category**: Tools
- **App type**: Public app

#### App URLs
For development, you can use ngrok:
```bash
# Install ngrok if you haven't already
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000
```

Use the ngrok URLs:
- **App URL**: `https://your-ngrok-url.ngrok.io`
- **Allowed redirection URL(s)**: `https://your-ngrok-url.ngrok.io/auth/callback`

#### Required Scopes
Select these scopes for agent operations:

**Products**
- ✅ Read products
- ✅ Write products

**Orders**
- ✅ Read orders
- ✅ Write orders

**Customers**
- ✅ Read customers
- ✅ Write customers

**Inventory**
- ✅ Read inventory
- ✅ Write inventory

**Analytics**
- ✅ Read analytics

### 3. Initialize with Shopify CLI

```bash
cd /Users/elliotnoteware/Documents/store_admin_shopify_app
shopify app init --name="agent-cli-tool" --template=node
```

This will:
- Create a new app directory
- Set up OAuth flow
- Configure for public app use
- Generate proper templates

### 4. Configure OAuth Flow

The CLI will create an app with proper OAuth setup. Key files:

#### `shopify.app.toml`
```toml
name = "agent-cli-tool"
client_id = "your_client_id_here"
application_url = "https://your-domain.com"
embedded = false

# OAuth Configuration
auth_redirect_urls = ["https://your-domain.com/auth/callback"]

# Required Scopes
scopes = "write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_inventory,read_inventory"
```

#### Environment Variables
```env
SHOPIFY_API_KEY=your_api_key_here
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_inventory,read_inventory
HOST=https://your-domain.com
```

### 5. Test Installation

1. Start the app:
```bash
shopify app dev
```

2. Install on a test store:
   - Go to the provided installation URL
   - Complete OAuth flow
   - Test agent operations

## Public App vs Custom App Comparison

| Feature | Public App | Custom App |
|---------|------------|------------|
| **Store Access** | Any store | One store only |
| **Installation** | OAuth flow | Direct token |
| **Use Case** | Agent tools | Internal tools |
| **Setup Complexity** | Medium | Simple |
| **Perfect for** | Multi-store agents | Single store |

## Development Workflow

### 1. Local Development
```bash
# Start ngrok tunnel
ngrok http 3000

# Update app URLs in Partners Dashboard with ngrok URL

# Start app
shopify app dev
```

### 2. Testing Installation
```bash
# Get installation URL
shopify app generate url

# Install on test store
# Complete OAuth flow
# Test agent operations
```

### 3. Production Deployment
```bash
# Deploy to your hosting platform
shopify app deploy

# Update app URLs in Partners Dashboard
# Test production installation
```

## Agent Tool Features

Your public app can include:

### CLI Scripts
- Product management scripts
- Order processing scripts
- Customer management scripts
- Inventory update scripts

### Web Interface (Optional)
- Agent dashboard
- Store selection
- Operation history
- Error logging

### API Endpoints
- OAuth callback handling
- Store data endpoints
- Agent operation endpoints

## Next Steps

1. ✅ Create public app in Partners Dashboard
2. ✅ Initialize with Shopify CLI
3. ✅ Set up OAuth flow
4. ✅ Test installation on different stores
5. ✅ Create agent-specific scripts
6. ✅ Deploy to production

## Resources

- [Public App Development](https://shopify.dev/docs/apps/tools/cli/public-apps)
- [OAuth Documentation](https://shopify.dev/docs/apps/auth/oauth)
- [App Installation Guide](https://shopify.dev/docs/apps/tools/cli/development)

---

**Status**: Ready for Public App Creation

**Next Action**: Create public app in Partners Dashboard and initialize with CLI
