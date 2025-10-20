#!/bin/bash

# Setup script for World Seasonings store
echo "🚀 Setting up Agent Helper for World Seasonings"
echo "================================================"

# Create environment file for World Seasonings
cat > .env.world-seasonings << 'EOF'
# Agent Helper Configuration for World Seasonings
SHOPIFY_API_KEY=a501dae8bedca0ecfaf8812b5460cd68
SHOPIFY_API_SECRET=your_api_secret_key_here
SHOPIFY_SCOPES=read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory
HOST=http://localhost:3001
PORT=3001

# World Seasonings Store Configuration
SHOPIFY_STORE_DOMAIN=world-seasonings-6425.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_world_seasonings_token_here
EOF

echo "✅ Created .env.world-seasonings file"
echo ""
echo "📋 Next Steps:"
echo "1. Get API Secret from Shopify Partners Dashboard"
echo "2. Get Access Token from World Seasonings store"
echo "3. Update .env.world-seasonings with real values"
echo "4. Test the connection"
echo ""
echo "🔗 World Seasonings Store: https://admin.shopify.com/store/world-seasonings-6425"
echo ""
echo "To get Access Token:"
echo "1. Go to https://admin.shopify.com/store/world-seasonings-6425"
echo "2. Settings → Apps and integrations → Develop apps"
echo "3. Create app or use existing one"
echo "4. Configuration → Admin API access tokens"
echo "5. Install app and copy the token"
echo ""
echo "To test with World Seasonings:"
echo "SHOPIFY_STORE_DOMAIN=\$(grep SHOPIFY_STORE_DOMAIN .env.world-seasonings | cut -d '=' -f2) \\"
echo "SHOPIFY_ACCESS_TOKEN=\$(grep SHOPIFY_ACCESS_TOKEN .env.world-seasonings | cut -d '=' -f2) \\"
echo "npm run agent"
