# World Seasonings Agent CLI

A private command-line tool for agents to manage World Seasonings store data using the Shopify Admin API.

## 🎯 What This Tool Does

This is a **private app** designed specifically for World Seasonings agents to:
- ✅ Update product information and inventory
- ✅ Manage orders and customer data
- ✅ Automate common store operations
- ✅ Access store data via command-line scripts

## 🚀 Quick Start

### 1. Setup Environment
```bash
npm run setup
# Edit .env with your Shopify credentials
```

### 2. Test Connection
```bash
npm run example
```

### 3. Create Custom Scripts
See `scripts/` directory for examples and templates.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Store

Edit `.env` and add your Shopify credentials:

```env
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
```

**How to get your access token:**
1. Go to your Shopify store admin
2. Go to **Settings** → **Apps and integrations** → **Develop apps**
3. Create a new app or select an existing one
4. Go to **Configuration** tab
5. Under **Admin API access tokens**, click **Install an app** or view your token
6. Copy the access token (starts with `shpat_`)

### 3. Run Scripts

```bash
# Run the example script
node scripts/example-admin-api.js

# Or with npm
npm run example
```

## Available Scripts

### example-admin-api.js

Demonstrates how to query the Shopify Admin API:
- Fetches shop information
- Lists products
- Shows error handling

```bash
node scripts/example-admin-api.js
```

## Creating Custom Scripts

1. Create a new file in `scripts/` directory:

```bash
touch scripts/my-script.js
```

2. Use this template:

```javascript
#!/usr/bin/env node

require('dotenv').config();

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error('Error: Missing required environment variables');
  process.exit(1);
}

async function queryAdminAPI(query, variables = {}) {
  const url = `https://${STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors));
  }
  return data.data;
}

async function main() {
  try {
    // Your code here
    console.log('Running my script...');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
```

3. Run your script:

```bash
node scripts/my-script.js
```

## Multi-Store Setup

Create separate `.env` files for different stores:

```bash
# Create staging environment
cp .env .env.staging

# Edit .env.staging with staging credentials
```

Run scripts against different stores:

```bash
# Run against staging
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.staging | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.staging | cut -d '=' -f2) \
node scripts/example-admin-api.js
```

## Troubleshooting

### "Missing required environment variables"
→ Make sure `.env` file exists with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN`

### "GraphQL query failed"
→ Check that your access token is valid and not expired

### "HTTP error! status: 401"
→ Your access token is invalid. Generate a new one from your Shopify store admin

## Resources

- [Shopify Admin API](https://shopify.dev/api/admin-graphql)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [GraphQL Documentation](https://graphql.org/)

## License

ISC

