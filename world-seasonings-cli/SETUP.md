# World Seasonings CLI - Setup Guide

This is a **Custom App** for managing your Shopify store via the Admin API.

## What is a Custom App?

A Custom App is a private app that only works with your specific Shopify store. It's perfect for:
- Admin automation scripts
- Internal tools
- Multi-store management
- CLI utilities

## Quick Start (5 Minutes)

### 1. Get Your Access Token

1. Go to your Shopify store admin: `https://world-seasonings-6425.myshopify.com/admin`
2. Go to **Settings** → **Apps and integrations** → **Develop apps**
3. Click **Create an app**
4. Name it "World Seasonings CLI"
5. Click **Create app**
6. Go to the **Configuration** tab
7. Scroll to **Admin API access tokens**
8. Click **Install an app** or **Reveal token**
9. Copy the access token (starts with `shpat_`)

### 2. Configure Your Environment

Edit `.env` and add your access token:

```env
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
```

### 3. Test It

```bash
npm run example
```

You should see your shop information and products!

## Available Commands

```bash
# Run the example script
npm run example

# Or directly
node scripts/example-admin-api.js
```

## Creating Your First Script

1. Create a new file:
```bash
touch scripts/my-script.js
```

2. Copy the template from `README.md`

3. Add your logic

4. Run it:
```bash
node scripts/my-script.js
```

## Multi-Store Setup

Create separate `.env` files for different stores:

```bash
# Create staging environment
cp .env .env.staging

# Edit .env.staging with staging store credentials
```

Run scripts against different stores:

```bash
# Run against staging
SHOPIFY_STORE_DOMAIN=$(grep SHOPIFY_STORE_DOMAIN .env.staging | cut -d '=' -f2) \
SHOPIFY_ACCESS_TOKEN=$(grep SHOPIFY_ACCESS_TOKEN .env.staging | cut -d '=' -f2) \
npm run example
```

## Troubleshooting

### "Missing required environment variables"
→ Make sure `.env` file exists with both `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN`

### "GraphQL query failed" or "HTTP error! status: 401"
→ Your access token is invalid or expired. Get a new one from your store admin

### "Cannot find module 'dotenv'"
→ Run `npm install`

## Next Steps

1. ✅ Get your access token
2. ✅ Add it to `.env`
3. ✅ Run `npm run example`
4. ✅ Create custom scripts for your use cases
5. ✅ Set up staging environment

## Resources

- [Shopify Admin API](https://shopify.dev/api/admin-graphql)
- [GraphQL Documentation](https://graphql.org/)
- [Shopify Community](https://community.shopify.com/)

## Security

⚠️ **Important:**
- Never commit `.env` files to git
- Keep your access token secret
- Use different tokens for different environments
- Rotate tokens regularly

---

**Status**: ✅ Ready to use

**Next Action**: Get your access token and add it to `.env`

