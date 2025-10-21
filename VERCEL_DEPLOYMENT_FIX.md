# Fix Vercel Deployment Issues

## Problem
Your Vercel project `store_admin_shopify_app` is linked to a different repository than your new `agent-helper` repository.

## Solutions

### Option 1: Update Existing Vercel Project (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/noteware/store_admin_shopify_app
2. **Settings** → **Git**
3. **Disconnect** current repository
4. **Connect** to `enoteware/agent-helper`
5. **Save** and trigger deployment

### Option 2: Create New Vercel Project

1. **Go to**: https://vercel.com/new
2. **Import Git Repository**: `enoteware/agent-helper`
3. **Project Name**: `agent-helper`
4. **Deploy**

### Option 3: Manual Deployment

1. **Download ZIP**: From https://github.com/enoteware/agent-helper/archive/main.zip
2. **Upload to Vercel**: Drag and drop the ZIP file
3. **Deploy**

## Environment Variables to Set

In Vercel dashboard, add these:

```
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory
```

## After Deployment

1. **Get deployment URL**: `https://your-app.vercel.app`
2. **Update Shopify Partners Dashboard**:
   - App URL: `https://your-app.vercel.app`
   - Redirect URL: `https://your-app.vercel.app/auth/callback`

## Test Installation

```
https://your-app.vercel.app/auth/install?shop=world-seasonings-6425.myshopify.com
```

---

**Recommended**: Option 1 (Update existing project)
**Status**: Ready for deployment once linked correctly
