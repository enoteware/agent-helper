# Manual Vercel Deployment Guide

Since the CLI deployment is having issues, let's deploy manually through the Vercel web interface.

## Step 1: Prepare Files for Upload

### Files to Deploy:
1. `api/index.js` (main server file)
2. `package.json` (dependencies)
3. `vercel.json` (configuration)

### Dependencies needed:
```json
{
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

## Step 2: Deploy via Vercel Web Interface

### Option A: GitHub Integration (Recommended)

1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/agent-helper.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Node.js project

### Option B: Direct Upload

1. **Create ZIP file** with these files:
   - `api/index.js`
   - `package.json`
   - `vercel.json`

2. **Upload to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Choose "Browse all templates"
   - Upload your ZIP file

## Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_api_secret_here
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory
```

## Step 4: Update Shopify Partners Dashboard

After deployment, you'll get a URL like: `https://your-app.vercel.app`

Update your Shopify app settings:
- **App URL**: `https://your-app.vercel.app`
- **Redirect URL**: `https://your-app.vercel.app/auth/callback`

## Step 5: Test Installation

Test with World Seasonings:
```
https://your-app.vercel.app/auth/install?shop=world-seasonings-6425.myshopify.com
```

## Quick Setup Commands

```bash
# Create minimal deployment package
mkdir agent-helper-deploy
cp api/index.js agent-helper-deploy/
cp package.json agent-helper-deploy/
cp vercel.json agent-helper-deploy/

# Create ZIP for upload
cd agent-helper-deploy
zip -r agent-helper.zip .
```

## Alternative: Use Railway

If Vercel continues to have issues, Railway is a great alternative:

1. Go to [railway.app](https://railway.app)
2. Connect GitHub or upload files
3. Set environment variables
4. Deploy automatically

---

**Status**: Ready for manual deployment
**Next Action**: Choose deployment method (GitHub + Vercel recommended)
