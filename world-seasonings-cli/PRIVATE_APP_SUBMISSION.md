# Private App Submission Guide

This guide walks you through submitting the World Seasonings Agent CLI as a private app in the Shopify Partners Dashboard.

## What is a Private App?

A **Private App** is an app that:
- ✅ Only works with your specific store(s)
- ✅ Doesn't appear in the public Shopify App Store
- ✅ Perfect for internal tools and agent automation
- ✅ Easier to submit and maintain than public apps
- ✅ No app review process required

## Step-by-Step Submission Process

### 1. Create Shopify Partners Account

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Sign up or log in with your Shopify account
3. Verify your email address

### 2. Create New App

1. In Partners Dashboard, click **Apps**
2. Click **Create app**
3. Choose **Custom app** (for private use)
4. Fill in the app details:

```
App Name: World Seasonings Agent CLI
App URL: https://your-app-url.com (can be placeholder for CLI)
Allowed redirection URL(s): https://your-app-url.com/auth/callback
```

### 3. Configure App Settings

#### Basic Information
- **App name**: World Seasonings Agent CLI
- **App description**: A command-line tool for agents to manage World Seasonings store data including products, orders, customers, and inventory.
- **App category**: Tools
- **App type**: Custom app (private)

#### App URLs (for CLI apps, these can be placeholders)
- **App URL**: `https://world-seasonings-cli.com`
- **Allowed redirection URL(s)**: `https://world-seasonings-cli.com/auth/callback`

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

### 4. Generate App Credentials

After creating the app:

1. Go to **App setup** tab
2. Copy the **Client ID**
3. Generate an **Admin API access token**
4. Copy the access token (starts with `shpat_`)

### 5. Update Local Configuration

Update your local files with the app credentials:

#### Update `.env` file:
```bash
cd world-seasonings-cli
cp .env.example .env
# Edit .env with your credentials
```

```env
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
SHOPIFY_CLIENT_ID=your_client_id_here
```

#### Update `shopify.app.toml`:
```toml
name = "World Seasonings Agent CLI"
client_id = "your_client_id_here"
application_url = "https://your-app-url.com"
```

### 6. Test Your App

```bash
# Test the connection
npm run example

# Should show your shop information and products
```

### 7. Deploy (Optional)

If you want to host your CLI tool:

```bash
# Deploy to your hosting platform
npm run deploy
```

## App Store vs Private App Comparison

| Feature | App Store App | Private App |
|---------|---------------|-------------|
| **Visibility** | Public in app store | Private to your store |
| **Review Process** | Shopify review required | No review needed |
| **Submission Time** | 2-4 weeks | Immediate |
| **Maintenance** | Regular updates required | Update as needed |
| **Perfect for** | Customer-facing tools | Internal agent tools |

## Why Private App is Perfect for Agent Tools

✅ **No app review** - Deploy immediately  
✅ **Full control** - Update whenever you need  
✅ **Internal use only** - Perfect for agent operations  
✅ **Simpler setup** - Less configuration required  
✅ **Cost effective** - No app store fees  

## Next Steps After Submission

1. **Test thoroughly** - Verify all agent operations work
2. **Train agents** - Create user guides for your team
3. **Monitor usage** - Track which operations are used most
4. **Iterate** - Add new features based on agent feedback

## Troubleshooting

### "Invalid client ID"
→ Make sure you copied the Client ID correctly from Partners Dashboard

### "Access token invalid"
→ Generate a new access token in the app settings

### "Insufficient permissions"
→ Check that you selected all required scopes

### "App not found"
→ Verify the app is created and active in Partners Dashboard

## Resources

- [Shopify Partners Dashboard](https://partners.shopify.com)
- [Custom App Documentation](https://shopify.dev/docs/apps/tools/cli/custom-apps)
- [Admin API Scopes](https://shopify.dev/docs/api/admin-graphql/access_scopes)

## Support

For questions about app submission:
- Check the [Shopify Partners Help Center](https://help.shopify.com/en/partners)
- Contact Shopify Partners Support
- Review the [App Development Documentation](https://shopify.dev/docs/apps)

---

**Status**: Ready for Private App Submission

**Estimated Time**: 30-60 minutes

**Next Action**: Create app in Partners Dashboard and get credentials
