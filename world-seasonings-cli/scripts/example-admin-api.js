#!/usr/bin/env node

require('dotenv').config();

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

if (!STORE_DOMAIN || !ACCESS_TOKEN) {
  console.error('Error: Missing required environment variables');
  console.error('Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN in .env');
  process.exit(1);
}

async function queryAdminAPI(query, variables = {}) {
  const url = `https://${STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

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
    throw new Error(JSON.stringify(data.errors));
  }
  return data.data;
}

async function main() {
  try {
    console.log('Fetching shop information...\n');

    // Get shop info
    const shopQuery = `
      query {
        shop {
          name
          url
          email
          plan {
            displayName
          }
        }
      }
    `;

    const shopData = await queryAdminAPI(shopQuery);
    console.log('Shop Information:');
    console.log(JSON.stringify(shopData.shop, null, 2));
    console.log('\n---\n');

    // Get products
    console.log('Fetching products...\n');
    const productsQuery = `
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              status
            }
          }
        }
      }
    `;

    const productsData = await queryAdminAPI(productsQuery);
    console.log('Products:');
    console.log(JSON.stringify(productsData.products, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();

