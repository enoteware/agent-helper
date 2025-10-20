/**
 * World Seasonings Agent CLI - OAuth Server
 * Simple server to handle OAuth installation flow
 */

const express = require('express');
const crypto = require('crypto');
const { shopifyApi } = require('@shopify/shopify-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Shopify API
const shopify = shopifyApi({
  API_KEY: process.env.SHOPIFY_API_KEY || 'your_api_key_here',
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET || 'your_api_secret_here',
  SCOPES: process.env.SHOPIFY_SCOPES?.split(',') || [
    'read_products',
    'write_products',
    'read_orders',
    'write_orders',
    'read_customers',
    'write_customers',
    'read_inventory',
    'write_inventory'
  ],
  HOST_NAME: process.env.HOST || `http://localhost:${PORT}`,
  API_VERSION: '2024-01',
  IS_EMBEDDED_APP: false,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page - shows installation status
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>World Seasonings Agent CLI</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .status { padding: 15px; border-radius: 5px; margin: 10px 0; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 World Seasonings Agent CLI</h1>
            <p>A powerful tool for agents to manage Shopify store data</p>
        </div>
        
        <div class="status info">
            <h3>📋 Installation Instructions</h3>
            <p>To install this app on your store:</p>
            <ol>
                <li>Go to your Shopify admin</li>
                <li>Navigate to Apps → Manage private apps</li>
                <li>Click "Create an app"</li>
                <li>Use this installation URL:</li>
            </ol>
            <div class="code">
                ${req.protocol}://${req.get('host')}/auth/install
            </div>
        </div>
        
        <div class="status success">
            <h3>✅ App Features</h3>
            <ul>
                <li>📦 Product management and inventory updates</li>
                <li>🛒 Order processing and status updates</li>
                <li>👥 Customer information management</li>
                <li>📊 Store analytics and reporting</li>
                <li>🔧 CLI tools for automation</li>
            </ul>
        </div>
        
        <div class="status info">
            <h3>🔧 For Developers</h3>
            <p>This app provides:</p>
            <ul>
                <li>GraphQL API integration</li>
                <li>OAuth authentication</li>
                <li>Multi-store support</li>
                <li>Agent-friendly CLI interface</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

// OAuth installation endpoint
app.get('/auth/install', async (req, res) => {
  try {
    const shop = req.query.shop;
    
    if (!shop) {
      return res.status(400).send('Missing shop parameter. Usage: /auth/install?shop=your-store.myshopify.com');
    }
    
    // Validate shop domain
    if (!shop.endsWith('.myshopify.com') && !shop.endsWith('.myshopify.io')) {
      return res.status(400).send('Invalid shop domain. Must be a .myshopify.com or .myshopify.io domain');
    }
    
    // Generate state for security
    const state = crypto.randomBytes(16).toString('hex');
    
    // Create OAuth URL
    const authUrl = shopify.auth.buildAuthURL({
      shop: shop,
      state: state,
      redirectUri: `${process.env.HOST || `http://localhost:${PORT}`}/auth/callback`,
    });
    
    // Store state for validation (in production, use a database)
    // For now, we'll just redirect
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('Installation error:', error);
    res.status(500).send('Installation failed. Please try again.');
  }
});

// OAuth callback endpoint
app.get('/auth/callback', async (req, res) => {
  try {
    const { shop, code, state } = req.query;
    
    if (!shop || !code) {
      return res.status(400).send('Missing required parameters');
    }
    
    // Exchange code for access token
    const session = await shopify.auth.validateAuthCallback(req, res);
    
    if (!session) {
      return res.status(400).send('Authentication failed');
    }
    
    // Store session (in production, use a database)
    console.log('✅ App installed successfully on:', shop);
    console.log('📝 Access token obtained for store:', shop);
    
    // Success page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Installation Successful</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; }
              .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; margin: 10px 0; }
          </style>
      </head>
      <body>
          <div class="success">
              <h2>🎉 Installation Successful!</h2>
              <p><strong>Store:</strong> ${shop}</p>
              <p>The World Seasonings Agent CLI has been successfully installed on your store.</p>
              
              <h3>Next Steps:</h3>
              <ol>
                  <li>Close this window</li>
                  <li>Use the agent CLI tools to manage your store</li>
                  <li>Contact your agent team for assistance</li>
              </ol>
              
              <div class="code">
                  Store: ${shop}<br>
                  Status: ✅ Connected<br>
                  Access: ✅ Granted
              </div>
          </div>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
});

// API endpoint to test connection
app.get('/api/test', async (req, res) => {
  try {
    // This would test the API connection
    // For now, just return success
    res.json({
      status: 'success',
      message: 'Agent CLI API is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 World Seasonings Agent CLI Server Started');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 Installation URL: http://localhost:${PORT}/auth/install?shop=your-store.myshopify.com`);
  console.log('');
  console.log('💡 To install on a store:');
  console.log(`   Visit: http://localhost:${PORT}/auth/install?shop=store-name.myshopify.com`);
  console.log('');
  console.log('🔧 For production deployment:');
  console.log('   1. Set HOST environment variable to your domain');
  console.log('   2. Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET');
  console.log('   3. Deploy to your hosting platform');
});

module.exports = app;
