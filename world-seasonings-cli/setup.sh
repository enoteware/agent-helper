#!/bin/bash

# World Seasonings Agent CLI - Setup Script
# This script helps you set up the environment for the private app

echo "🚀 Setting up World Seasonings Agent CLI..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env with your Shopify credentials:"
    echo "   1. Go to https://partners.shopify.com"
    echo "   2. Create a new Custom App"
    echo "   3. Copy your Client ID and generate an Admin API access token"
    echo "   4. Edit .env file with your credentials"
    echo ""
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Shopify credentials"
echo "2. Run: npm run example"
echo "3. Check PRIVATE_APP_SUBMISSION.md for app submission guide"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Main documentation"
echo "   - SETUP.md - Quick setup guide"
echo "   - PRIVATE_APP_SUBMISSION.md - App submission guide"
echo ""
