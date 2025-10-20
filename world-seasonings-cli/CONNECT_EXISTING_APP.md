# Connect to Existing Admin-Helper App

Now that the Shopify CLI is updated to version 3.86.0, you can connect to your existing "admin-helper" public app.

## Step 1: Run the Config Link Command

Open your terminal and run this command:

```bash
cd /Users/elliotnoteware/Documents/store_admin_shopify_app
shopify app config link
```

## Step 2: Follow the Interactive Prompts

The CLI will ask you to:

1. **Select Organization**: Choose your organization from the list
2. **Select App**: Choose "admin-helper" from your apps list
3. **Confirm Configuration**: The CLI will pull the app configuration

## Step 3: What This Command Does

The `shopify app config link` command will:

✅ **Pull app configuration** from Partners Dashboard  
✅ **Create/update `shopify.app.toml`** with your app settings  
✅ **Set up OAuth configuration** for public app functionality  
✅ **Configure scopes and permissions** from your Partners Dashboard  
✅ **Create environment files** if needed  

## Step 4: After Linking

Once the command completes successfully, you'll have:

- `shopify.app.toml` - App configuration file
- Proper OAuth setup for public app installation
- Environment configuration ready for development

## Step 5: Start Development

After linking, you can:

```bash
# Start the app in development mode
shopify app dev

# This will:
# - Start the app server
# - Provide installation URLs for testing
# - Enable hot reload for development
```

## Troubleshooting

### "Failed to prompt" Error
This happens when running in non-interactive environments. Make sure to:
- Run the command in your local terminal (not through automation)
- Allow the CLI to prompt for organization and app selection

### "App not found"
Make sure:
- You're logged in with the correct Shopify account
- The "admin-helper" app exists in your Partners Dashboard
- You have access to the organization that owns the app

### "Organization not found"
Make sure:
- You're logged in with the correct account
- Your account has access to the organization
- Try logging out and back in: `shopify auth logout && shopify auth login`

## Next Steps After Linking

1. ✅ **Test the connection**: `shopify app info`
2. ✅ **Start development**: `shopify app dev`
3. ✅ **Create agent scripts**: Add CLI tools for store management
4. ✅ **Test installation**: Install on test stores via OAuth flow

## Manual Alternative

If the interactive command doesn't work, you can manually configure:

### Get App Details from Partners Dashboard
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Find your "admin-helper" app
3. Copy the **Client ID** and **Client Secret**

### Create shopify.app.toml manually
```toml
# App Information
name = "admin-helper"
client_id = "your_client_id_from_partners_dashboard"
application_url = "https://your-app-url.com"
embedded = false

# OAuth Configuration
auth_redirect_urls = ["https://your-app-url.com/auth/callback"]

# Required Scopes
scopes = "write_products,read_products,write_orders,read_orders,write_customers,read_customers,write_inventory,read_inventory"
```

---

**Status**: Ready for App Linking

**Next Action**: Run `shopify app config link` in your terminal and follow the prompts

**Command**: `shopify app config link`
