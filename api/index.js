const express = require('express');
const crypto = require('crypto');
const https = require('https');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Agent Helper</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .status { padding: 15px; border-radius: 5px; margin: 10px 0; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .code { background: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Agent Helper</h1>
            <p>A powerful tool for agents to manage Shopify store data</p>
        </div>

        <div class="status success">
            <h3>✅ Agent Helper is Live!</h3>
            <p>Your Agent Helper OAuth server is successfully deployed.</p>
            <p><strong>Status:</strong> Ready for client installations</p>
        </div>

        <div class="status">
            <h3>📋 Installation Instructions</h3>
            <p>To install this app on a store:</p>
            <p>1. Replace <code>store-name.myshopify.com</code> with the actual Shopify store domain:</p>
            <div class="code">${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'}/auth/install?shop=store-name.myshopify.com</div>
            <p>2. Visit the URL in your browser and follow the prompts.</p>
            <p>3. After installation, you can use the CLI tool to manage store data.</p>
        </div>

        <div class="status">
            <h3>🔧 Configuration</h3>
            <ul>
                <li><strong>API Key:</strong> ${process.env.SHOPIFY_API_KEY || 'a501dae8bedca0ecfaf8812b5460cd68'}</li>
                <li><strong>Host:</strong> ${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'}</li>
            </ul>
        </div>
    </body>
    </html>
  `);
});

app.get('/auth/install', (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-store.myshopify.com');
  }

  // Generate state for security
  const state = crypto.randomBytes(16).toString('hex');

  // Build OAuth URL
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_products,read_orders,write_orders,read_customers,write_customers,read_inventory,write_inventory';
  const redirectUri = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'}/auth/callback`;
  const apiKey = process.env.SHOPIFY_API_KEY || 'a501dae8bedca0ecfaf8812b5460cd68';

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;

  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const { shop, hmac, code, state } = req.query;
  const apiKey = process.env.SHOPIFY_API_KEY || 'a501dae8bedca0ecfaf8812b5460cd68';
  const apiSecret = process.env.SHOPIFY_API_SECRET || 'your_api_secret_here';

  if (!shop || !code) {
    return res.status(400).send('Missing required parameters');
  }

  // Exchange code for access token
  const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
  const accessTokenRequestHeaders = {
    'Content-Type': 'application/json',
  };
  const accessTokenRequestBody = JSON.stringify({
    client_id: apiKey,
    client_secret: apiSecret,
    code,
  });

  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(accessTokenRequestUrl, {
        method: 'POST',
        headers: accessTokenRequestHeaders,
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      });
      req.on('error', (e) => {
        reject(e);
      });
      req.write(accessTokenRequestBody);
      req.end();
    });

    const { access_token } = response;

    if (!access_token) {
      return res.status(400).send('Failed to get access token');
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Agent Helper - Installation Success</title>
          <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; text-align: center; }
              .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 20px; border-radius: 8px; }
          </style>
      </head>
      <body>
          <div class="success">
              <h2>🎉 Installation Successful!</h2>
              <p><strong>Store:</strong> ${shop}</p>
              <p>The Agent Helper has been successfully installed on your store.</p>

              <h3>Next Steps:</h3>
              <ol>
                  <li>Close this window</li>
                  <li>Use the agent CLI tools to manage your store</li>
                  <li>For CLI tools, ensure your .env file has SHOPIFY_STORE_DOMAIN=${shop} and SHOPIFY_ACCESS_TOKEN=${access_token}</li>
              </ol>
          </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error exchanging code for access token:', error);
    res.status(500).send('Error during token exchange.');
  }
});

// API endpoint to test connection
app.get('/api/test', async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Agent Helper API is working',
      timestamp: new Date().toISOString(),
      app: 'Agent Helper',
      url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app.vercel.app'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = app;
