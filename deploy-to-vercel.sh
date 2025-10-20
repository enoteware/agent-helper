#!/bin/bash

echo "🚀 Deploying Agent Helper to Vercel"
echo "===================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Deploying to Vercel..."
vercel

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the deployment URL (e.g., https://your-app.vercel.app)"
echo "2. Update Shopify Partners Dashboard:"
echo "   - App URL: https://your-app.vercel.app"
echo "   - Redirect URL: https://your-app.vercel.app/auth/callback"
echo "3. Set environment variables in Vercel dashboard:"
echo "   - SHOPIFY_API_KEY: a501dae8bedca0ecfaf8812b5460cd68"
echo "   - SHOPIFY_API_SECRET: your_api_secret_here"
echo "4. Test installation URL:"
echo "   https://your-app.vercel.app/auth/install?shop=world-seasonings-6425.myshopify.com"
echo ""
echo "🎉 Your Agent Helper is now live and ready for clients!"
