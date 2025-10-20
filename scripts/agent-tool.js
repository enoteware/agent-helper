#!/usr/bin/env node

/**
 * Agent Helper CLI Tool
 * A command-line tool for agents to manage Shopify store data
 */

require('dotenv').config();

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error('❌ Error: Missing required environment variables');
  console.error('Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in .env');
  process.exit(1);
}

/**
 * Query the Shopify Admin API using GraphQL
 */
async function queryAdminAPI(query, variables = {}) {
  const url = `https://${STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors, null, 2)}`);
    }
    
    return data.data;
  } catch (error) {
    console.error('❌ API Error:', error.message);
    throw error;
  }
}

/**
 * Get shop information
 */
async function getShopInfo() {
  console.log('🏪 Fetching shop information...\n');

  const query = `
    query {
      shop {
        name
        url
        email
        plan {
          displayName
        }
        currencyCode
        timezone
      }
    }
  `;

  const data = await queryAdminAPI(query);
  return data.shop;
}

/**
 * Get products with basic information
 */
async function getProducts(limit = 10) {
  console.log(`📦 Fetching ${limit} products...\n`);

  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            status
            totalInventory
            createdAt
            updatedAt
          }
        }
      }
    }
  `;

  const data = await queryAdminAPI(query, { first: limit });
  return data.products.edges.map(edge => edge.node);
}

/**
 * Get recent orders
 */
async function getRecentOrders(limit = 10) {
  console.log(`🛒 Fetching ${limit} recent orders...\n`);

  const query = `
    query GetOrders($first: Int!) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            email
            totalPrice
            financialStatus
            fulfillmentStatus
            createdAt
          }
        }
      }
    }
  `;

  const data = await queryAdminAPI(query, { first: limit });
  return data.orders.edges.map(edge => edge.node);
}

/**
 * Main function - demonstrates agent tool capabilities
 */
async function main() {
  try {
    console.log('🚀 Agent Helper CLI Tool\n');
    console.log('=====================================\n');

    // Get shop information
    const shop = await getShopInfo();
    console.log('Shop Information:');
    console.log(`  Name: ${shop.name}`);
    console.log(`  URL: ${shop.url}`);
    console.log(`  Email: ${shop.email}`);
    console.log(`  Plan: ${shop.plan.displayName}`);
    console.log(`  Currency: ${shop.currencyCode}`);
    console.log(`  Timezone: ${shop.timezone}\n`);

    // Get products
    const products = await getProducts(5);
    console.log('Recent Products:');
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title}`);
      console.log(`     Handle: ${product.handle}`);
      console.log(`     Status: ${product.status}`);
      console.log(`     Inventory: ${product.totalInventory}`);
      console.log(`     Updated: ${new Date(product.updatedAt).toLocaleDateString()}`);
    });
    console.log('');

    // Get recent orders
    const orders = await getRecentOrders(5);
    console.log('Recent Orders:');
    orders.forEach((order, index) => {
      console.log(`  ${index + 1}. ${order.name}`);
      console.log(`     Email: ${order.email}`);
      console.log(`     Total: ${order.totalPrice}`);
      console.log(`     Status: ${order.financialStatus}/${order.fulfillmentStatus}`);
      console.log(`     Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    });

    console.log('\n✅ Agent tool test completed successfully!');
    console.log('\n💡 This tool can be extended with specific agent operations:');
    console.log('   - Update product information');
    console.log('   - Manage inventory levels');
    console.log('   - Process orders');
    console.log('   - Update customer information');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
