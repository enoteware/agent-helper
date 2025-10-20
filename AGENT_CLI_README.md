# Agent Helper

A powerful command-line tool for agents to manage Shopify store data using the Admin API.

## 🎯 What This Tool Does

This is a **public app** that can be installed on any Shopify store, perfect for agent operations:

- ✅ **Update product information** and inventory
- ✅ **Manage orders** and customer data  
- ✅ **Automate common store operations**
- ✅ **Access store data** via command-line scripts
- ✅ **Multi-store support** - works on any Shopify store

## 🚀 Quick Start

### 1. Setup Environment
```bash
npm run setup
# Edit .env with your Shopify store credentials
```

### 2. Test Connection
```bash
npm run agent
```

### 3. Start Development
```bash
npm run dev
```

## 📋 Available Commands

```bash
# Run the agent tool
npm start
npm run agent

# Development
npm run dev          # Start app in development mode
npm run deploy       # Deploy to production
npm run info         # Show app information

# Setup
npm run setup        # Create .env file from template
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with your store credentials:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_token_here
```

### Getting Store Credentials

1. **For Public App Installation**:
   - Install the app on your store via OAuth flow
   - Use `npm run dev` to get installation URLs

2. **For Direct API Access**:
   - Go to your store admin
   - Settings → Apps and integrations → Develop apps
   - Create app and generate Admin API access token

## 🛠️ Agent Operations

### Current Features

The agent tool currently supports:

- **Shop Information**: Get store details, plan, currency
- **Product Management**: List products, inventory levels
- **Order Management**: View recent orders, status
- **Error Handling**: Comprehensive error reporting

### Example Usage

```bash
# Run the agent tool
npm run agent

# Output:
# 🏪 Shop Information
# 📦 Recent Products  
# 🛒 Recent Orders
```

## 🔐 App Configuration

The app is configured with these scopes:

- `read_products` - View product information
- `write_products` - Update products
- `read_orders` - View order information  
- `write_orders` - Update orders
- `read_customers` - View customer information
- `write_customers` - Update customers
- `read_inventory` - View inventory levels
- `write_inventory` - Update inventory

## 📁 Project Structure

```
store_admin_shopify_app/
├── shopify.app.toml          # App configuration
├── package.json              # Dependencies and scripts
├── .env.example              # Environment template
├── scripts/
│   └── agent-tool.js         # Main agent tool script
└── AGENT_CLI_README.md       # This file
```

## 🚀 Development Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# This will:
# - Start the app server
# - Provide installation URLs
# - Enable hot reload
```

### 2. Testing Installation
```bash
# Get installation URL
npm run dev

# Install on test store:
# 1. Visit the provided URL
# 2. Complete OAuth flow
# 3. Test agent operations
```

### 3. Production Deployment
```bash
# Deploy to production
npm run deploy

# Update app URLs in Partners Dashboard
# Test production installation
```

## 🔧 Extending the Tool

### Adding New Agent Operations

1. **Create new script**:
```bash
touch scripts/new-operation.js
```

2. **Use the API helper**:
```javascript
const { queryAdminAPI } = require('./agent-tool.js');

// Your new operation
async function newOperation() {
  const query = `query { ... }`;
  const data = await queryAdminAPI(query);
  return data;
}
```

3. **Add to package.json scripts**:
```json
{
  "scripts": {
    "new-operation": "node scripts/new-operation.js"
  }
}
```

### Common Agent Operations

Here are some operations you might want to add:

- **Product Updates**: Update titles, descriptions, prices
- **Inventory Management**: Adjust stock levels
- **Order Processing**: Update order status, fulfillment
- **Customer Management**: Update customer information
- **Bulk Operations**: Process multiple items at once

## 🔍 Troubleshooting

### "Missing required environment variables"
→ Make sure `.env` file exists with `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN`

### "GraphQL query failed"
→ Check that your access token is valid and not expired

### "HTTP error! status: 401"
→ Your access token is invalid. Generate a new one from your store admin

### "App not found"
→ Make sure the app is properly linked: `shopify app info`

## 📚 Resources

- [Shopify Admin API](https://shopify.dev/api/admin-graphql)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- [GraphQL Documentation](https://graphql.org/)
- [App Configuration](https://shopify.dev/docs/apps/tools/cli/configuration)

## 🎯 Next Steps

1. ✅ **Test the tool**: `npm run agent`
2. ✅ **Customize operations**: Add specific agent tasks
3. ✅ **Deploy to production**: `npm run deploy`
4. ✅ **Train agents**: Create user guides for your team

## 💡 Tips

1. **Use GraphQL** - More efficient than REST API
2. **Test on staging first** - Always test operations on staging before production
3. **Implement error handling** - Handle API errors gracefully
4. **Log operations** - Keep audit trails of what agents do
5. **Use specific API versions** - Pin to a specific API version for stability

---

**Status**: ✅ Ready for Agent Use

**App Type**: Public App (can be installed on any store)

**Next Action**: Run `npm run agent` to test the tool

**Happy agent-ing! 🚀**
