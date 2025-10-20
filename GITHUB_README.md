# Agent Helper

A powerful command-line tool for agents to manage Shopify store data using the Admin API.

## 🚀 Quick Start

### For Vercel Deployment

1. **Clone this repository**
2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import this GitHub repository
   - Set environment variables:
     - `SHOPIFY_API_KEY`: `a501dae8bedca0ecfaf8812b5460cd68`
     - `SHOPIFY_API_SECRET`: `your_api_secret_here`

3. **Update Shopify Partners Dashboard**:
   - App URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`

### For Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run server

# Run agent tool
npm run agent
```

## 📋 Features

- ✅ **OAuth Installation Flow** - Easy store installation
- ✅ **CLI Tools** - Command-line store management
- ✅ **Multi-Store Support** - Works with any Shopify store
- ✅ **Production Ready** - Deployed on Vercel

## 🔧 Configuration

### Environment Variables

```env
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory
```

### Client Store Setup

```env
SHOPIFY_STORE_DOMAIN=client-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_client_token_here
```

## 🎯 Usage

### Install on a Store

```
https://your-app.vercel.app/auth/install?shop=store-name.myshopify.com
```

### Run Agent Tools

```bash
# With environment variables
SHOPIFY_STORE_DOMAIN=store.myshopify.com \
SHOPIFY_ACCESS_TOKEN=shpat_token_here \
npm run agent
```

## 📁 Project Structure

```
├── api/
│   └── index.js          # Vercel serverless function
├── scripts/
│   └── agent-tool.js     # CLI tool for store management
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🚀 Deployment

This project is optimized for Vercel deployment:

- **Serverless Functions**: `/api/index.js`
- **Environment Variables**: Set in Vercel dashboard
- **Automatic Deployments**: Push to GitHub triggers deployment

## 📞 Support

For questions or issues, please check the documentation or create an issue in this repository.

---

**Status**: Production Ready  
**Deployment**: Vercel + GitHub  
**Client Ready**: ✅
