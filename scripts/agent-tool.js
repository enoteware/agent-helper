#!/usr/bin/env node

/**
 * Agent Helper CLI Tool
 * A comprehensive command-line tool for agents to manage Shopify store data
 * 
 * Usage:
 *   node agent-tool.js [command] [options]
 * 
 * Commands:
 *   info                    - Get shop information
 *   products [options]      - Manage products
 *   inventory [options]     - Manage inventory
 *   orders [options]        - Manage orders
 *   customers [options]     - Manage customers
 *   reports [options]       - Generate reports
 *   bulk [options]          - Bulk operations
 *   export [options]        - Export data
 *   health                  - Store health check
 *   help                    - Show this help
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

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
 * Query the Shopify Admin API using REST
 */
async function queryRestAPI(endpoint, method = 'GET', body = null) {
  const url = `https://${STORE_DOMAIN}/admin/api/2024-01/${endpoint}`;

  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`REST API Error: ${data.error || response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ REST API Error:', error.message);
    throw error;
  }
}

/**
 * Utility function to format currency
 */
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Utility function to format date
 */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================================================
// SHOP INFORMATION
// ============================================================================

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
        myshopifyDomain
        primaryDomain {
          host
        }
        billingAddress {
          address1
          city
          country
          zip
        }
      }
    }
  `;

  const data = await queryAdminAPI(query);
  return data.shop;
}

// ============================================================================
// PRODUCT MANAGEMENT
// ============================================================================

/**
 * List products with filtering options
 */
async function listProducts(options = {}) {
  const { limit = 10, status = 'all', search = '', sortBy = 'CREATED_AT', reverse = true } = options;
  
  console.log(`📦 Fetching products (limit: ${limit})...\n`);

  let query = `
    query GetProducts($first: Int!, $query: String) {
      products(first: $first, query: $query, sortKey: ${sortBy}, reverse: ${reverse}) {
        edges {
          node {
            id
            title
            handle
            status
            totalInventory
            createdAt
            updatedAt
            vendor
            productType
            tags
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  sku
                  price
                  inventoryQuantity
                  availableForSale
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  let queryString = '';
  if (status !== 'all') queryString += `status:${status}`;
  if (search) queryString += ` title:*${search}*`;

  const data = await queryAdminAPI(query, { 
    first: limit, 
    query: queryString || null 
  });
  
  return data.products;
}

/**
 * Get a single product by ID or handle
 */
async function getProduct(identifier) {
  console.log(`🔍 Fetching product: ${identifier}...\n`);

  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        description
        status
        vendor
        productType
        tags
        totalInventory
        createdAt
        updatedAt
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              sku
              price
              compareAtPrice
              inventoryQuantity
              availableForSale
              weight
              weightUnit
              requiresShipping
              taxable
              position
            }
          }
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  `;

  // Convert handle to ID if needed
  let productId = identifier;
  if (!identifier.startsWith('gid://shopify/Product/')) {
    productId = `gid://shopify/Product/${identifier}`;
  }

  const data = await queryAdminAPI(query, { id: productId });
  return data.product;
}

/**
 * Create a new product
 */
async function createProduct(productData) {
  console.log('➕ Creating new product...\n');

  const mutation = `
    mutation productCreate($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, { input: productData });
  
  if (data.productCreate.userErrors.length > 0) {
    throw new Error(`Product creation errors: ${JSON.stringify(data.productCreate.userErrors, null, 2)}`);
  }
  
  return data.productCreate.product;
}

/**
 * Update an existing product
 */
async function updateProduct(productId, updates) {
  console.log(`✏️ Updating product: ${productId}...\n`);

  const mutation = `
    mutation productUpdate($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = { id: productId, ...updates };
  const data = await queryAdminAPI(mutation, { input });
  
  if (data.productUpdate.userErrors.length > 0) {
    throw new Error(`Product update errors: ${JSON.stringify(data.productUpdate.userErrors, null, 2)}`);
  }
  
  return data.productUpdate.product;
}

/**
 * Delete a product
 */
async function deleteProduct(productId) {
  console.log(`🗑️ Deleting product: ${productId}...\n`);

  const mutation = `
    mutation productDelete($input: ProductDeleteInput!) {
      productDelete(input: $input) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, { 
    input: { id: productId } 
  });
  
  if (data.productDelete.userErrors.length > 0) {
    throw new Error(`Product deletion errors: ${JSON.stringify(data.productDelete.userErrors, null, 2)}`);
  }
  
  return data.productDelete.deletedProductId;
}

// ============================================================================
// INVENTORY MANAGEMENT
// ============================================================================

/**
 * Get inventory levels for products
 */
async function getInventoryLevels(productIds = []) {
  console.log('📊 Fetching inventory levels...\n');

  const query = `
    query GetInventoryLevels($first: Int!, $query: String) {
      inventoryItems(first: $first, query: $query) {
        edges {
          node {
            id
            sku
            tracked
            inventoryLevels(first: 10) {
              edges {
                node {
                  id
                  available
                  location {
                    id
                    name
                  }
                }
              }
            }
            product {
              id
              title
            }
          }
        }
      }
    }
  `;

  let queryString = '';
  if (productIds.length > 0) {
    const productIdStrings = productIds.map(id => 
      id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`
    );
    queryString = `product_id:(${productIdStrings.join(' OR ')})`;
  }

  const data = await queryAdminAPI(query, { 
    first: 50, 
    query: queryString || null 
  });
  
  return data.inventoryItems;
}

/**
 * Adjust inventory levels
 */
async function adjustInventoryLevel(inventoryItemId, locationId, adjustment) {
  console.log(`📈 Adjusting inventory: ${adjustment}...\n`);

  const mutation = `
    mutation inventoryAdjustQuantity($input: InventoryAdjustQuantityInput!) {
      inventoryAdjustQuantity(input: $input) {
        inventoryAdjustmentGroup {
          id
          reason
          reference
          changes {
            name
            delta
            item {
              id
              sku
            }
            location {
              id
              name
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, {
    input: {
      inventoryItemId,
      locationId,
      quantityDelta: adjustment,
      reason: 'MANUAL'
    }
  });
  
  if (data.inventoryAdjustQuantity.userErrors.length > 0) {
    throw new Error(`Inventory adjustment errors: ${JSON.stringify(data.inventoryAdjustQuantity.userErrors, null, 2)}`);
  }
  
  return data.inventoryAdjustQuantity.inventoryAdjustmentGroup;
}

/**
 * Set inventory levels
 */
async function setInventoryLevel(inventoryItemId, locationId, quantity) {
  console.log(`📊 Setting inventory level: ${quantity}...\n`);

  const mutation = `
    mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup {
          id
          reason
          changes {
            name
            delta
            item {
              id
              sku
            }
            location {
              id
              name
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, {
    input: {
      setQuantities: [{
        inventoryItemId,
        locationId,
        quantity
      }]
    }
  });
  
  if (data.inventorySetQuantities.userErrors.length > 0) {
    throw new Error(`Inventory set errors: ${JSON.stringify(data.inventorySetQuantities.userErrors, null, 2)}`);
  }
  
  return data.inventorySetQuantities.inventoryAdjustmentGroup;
}

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

/**
 * List orders with filtering options
 */
async function listOrders(options = {}) {
  const { limit = 10, status = 'all', financialStatus = 'all', fulfillmentStatus = 'all' } = options;
  
  console.log(`🛒 Fetching orders (limit: ${limit})...\n`);

  let queryString = '';
  if (status !== 'all') queryString += `status:${status}`;
  if (financialStatus !== 'all') queryString += ` financial_status:${financialStatus}`;
  if (fulfillmentStatus !== 'all') queryString += ` fulfillment_status:${fulfillmentStatus}`;

  const query = `
    query GetOrders($first: Int!, $query: String) {
      orders(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            email
            phone
            totalPrice
            subtotalPrice
            totalTax
            totalShippingPrice
            displayFinancialStatus
            displayFulfillmentStatus
            processedAt
            createdAt
            updatedAt
            customer {
              id
              firstName
              lastName
              email
            }
            shippingAddress {
              firstName
              lastName
              address1
              city
              province
              country
              zip
            }
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  price
                  variant {
                    id
                    title
                    sku
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  const data = await queryAdminAPI(query, { 
    first: limit, 
    query: queryString || null 
  });
  
  return data.orders;
}

/**
 * Get a single order by ID or name
 */
async function getOrder(identifier) {
  console.log(`🔍 Fetching order: ${identifier}...\n`);

  const query = `
    query GetOrder($id: ID!) {
      order(id: $id) {
        id
        name
        email
        phone
        totalPrice
        subtotalPrice
        totalTax
        totalShippingPrice
        displayFinancialStatus
        displayFulfillmentStatus
        processedAt
        createdAt
        updatedAt
        customer {
          id
          firstName
          lastName
          email
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
        }
        billingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              price
              variant {
                id
                title
                sku
              }
            }
          }
        }
        fulfillments {
          id
          status
          trackingInfo {
            number
            url
            company
          }
        }
      }
    }
  `;

  // Convert name to ID if needed
  let orderId = identifier;
  if (!identifier.startsWith('gid://shopify/Order/')) {
    orderId = `gid://shopify/Order/${identifier}`;
  }

  const data = await queryAdminAPI(query, { id: orderId });
  return data.order;
}

/**
 * Fulfill an order
 */
async function fulfillOrder(orderId, lineItems, trackingInfo = null) {
  console.log(`📦 Fulfilling order: ${orderId}...\n`);

  const mutation = `
    mutation fulfillmentCreate($fulfillment: FulfillmentInput!) {
      fulfillmentCreate(fulfillment: $fulfillment) {
        fulfillment {
          id
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const fulfillmentData = {
    orderId,
    lineItems: lineItems.map(item => ({
      id: item.id,
      quantity: item.quantity
    }))
  };

  if (trackingInfo) {
    fulfillmentData.trackingInfo = trackingInfo;
  }

  const data = await queryAdminAPI(mutation, { fulfillment: fulfillmentData });
  
  if (data.fulfillmentCreate.userErrors.length > 0) {
    throw new Error(`Fulfillment errors: ${JSON.stringify(data.fulfillmentCreate.userErrors, null, 2)}`);
  }
  
  return data.fulfillmentCreate.fulfillment;
}

/**
 * Cancel an order
 */
async function cancelOrder(orderId, reason = 'OTHER', refund = false) {
  console.log(`❌ Canceling order: ${orderId}...\n`);

  const mutation = `
    mutation orderCancel($input: OrderCancelInput!) {
      orderCancel(input: $input) {
        order {
          id
          name
          displayFinancialStatus
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, {
    input: {
      id: orderId,
      reason,
      refund
    }
  });
  
  if (data.orderCancel.userErrors.length > 0) {
    throw new Error(`Order cancellation errors: ${JSON.stringify(data.orderCancel.userErrors, null, 2)}`);
  }
  
  return data.orderCancel.order;
}

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

/**
 * List customers with filtering options
 */
async function listCustomers(options = {}) {
  const { limit = 10, search = '', sortBy = 'CREATED_AT', reverse = true } = options;
  
  console.log(`👥 Fetching customers (limit: ${limit})...\n`);

  let queryString = '';
  if (search) queryString += `*${search}*`;

  const query = `
    query GetCustomers($first: Int!, $query: String, $sortKey: CustomerSortKeys, $reverse: Boolean) {
      customers(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            firstName
            lastName
            email
            phone
            createdAt
            updatedAt
            totalSpent
            ordersCount
            tags
            defaultAddress {
              id
              firstName
              lastName
              address1
              city
              province
              country
              zip
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
  `;

  const data = await queryAdminAPI(query, { 
    first: limit, 
    query: queryString || null,
    sortKey: sortBy,
    reverse
  });
  
  return data.customers;
}

/**
 * Get a single customer by ID or email
 */
async function getCustomer(identifier) {
  console.log(`🔍 Fetching customer: ${identifier}...\n`);

  const query = `
    query GetCustomer($id: ID!) {
      customer(id: $id) {
        id
        firstName
        lastName
        email
        phone
        createdAt
        updatedAt
        totalSpent
        ordersCount
        tags
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
            }
          }
        }
        orders(first: 10) {
          edges {
            node {
              id
              name
              totalPrice
              displayFinancialStatus
              createdAt
            }
          }
        }
      }
    }
  `;

  // Convert email to ID if needed
  let customerId = identifier;
  if (!identifier.startsWith('gid://shopify/Customer/')) {
    if (identifier.includes('@')) {
      // Search by email first
      const searchQuery = `
        query SearchCustomer($query: String!) {
          customers(first: 1, query: $query) {
            edges {
              node {
                id
              }
            }
          }
        }
      `;
      const searchData = await queryAdminAPI(searchQuery, { query: `email:${identifier}` });
      if (searchData.customers.edges.length === 0) {
        throw new Error(`Customer not found: ${identifier}`);
      }
      customerId = searchData.customers.edges[0].node.id;
    } else {
      customerId = `gid://shopify/Customer/${identifier}`;
    }
  }

  const data = await queryAdminAPI(query, { id: customerId });
  return data.customer;
}

/**
 * Create a new customer
 */
async function createCustomer(customerData) {
  console.log('➕ Creating new customer...\n');

  const mutation = `
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await queryAdminAPI(mutation, { input: customerData });
  
  if (data.customerCreate.userErrors.length > 0) {
    throw new Error(`Customer creation errors: ${JSON.stringify(data.customerCreate.userErrors, null, 2)}`);
  }
  
  return data.customerCreate.customer;
}

/**
 * Update an existing customer
 */
async function updateCustomer(customerId, updates) {
  console.log(`✏️ Updating customer: ${customerId}...\n`);

  const mutation = `
    mutation customerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = { id: customerId, ...updates };
  const data = await queryAdminAPI(mutation, { input });
  
  if (data.customerUpdate.userErrors.length > 0) {
    throw new Error(`Customer update errors: ${JSON.stringify(data.customerUpdate.userErrors, null, 2)}`);
  }
  
  return data.customerUpdate.customer;
}

// ============================================================================
// REPORTING & ANALYTICS
// ============================================================================

/**
 * Get sales analytics
 */
async function getSalesAnalytics(options = {}) {
  const { days = 30, startDate, endDate } = options;
  
  console.log(`📊 Fetching sales analytics (${days} days)...\n`);

  const query = `
    query GetSalesAnalytics($query: String!) {
      orders(first: 250, query: $query) {
        edges {
          node {
            id
            totalPrice
            subtotalPrice
            totalTax
            totalShippingPrice
            createdAt
            displayFinancialStatus
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  price
                  variant {
                    id
                    title
                    sku
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let queryString = `created_at:>=${startDate || new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()}`;
  if (endDate) {
    queryString += ` AND created_at:<=${endDate}`;
  }

  const data = await queryAdminAPI(query, { query: queryString });
  
  // Calculate analytics
  const orders = data.orders.edges.map(edge => edge.node);
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Product performance
  const productSales = {};
  orders.forEach(order => {
    order.lineItems.edges.forEach(edge => {
      const item = edge.node;
      const productTitle = item.title;
      if (!productSales[productTitle]) {
        productSales[productTitle] = { quantity: 0, revenue: 0 };
      }
      productSales[productTitle].quantity += item.quantity;
      productSales[productTitle].revenue += parseFloat(item.price) * item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort(([,a], [,b]) => b.revenue - a.revenue)
    .slice(0, 10);

  return {
    period: { days, startDate, endDate },
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue
    },
    topProducts
  };
}

/**
 * Get inventory report
 */
async function getInventoryReport() {
  console.log('📊 Generating inventory report...\n');

  const query = `
    query GetInventoryReport {
      products(first: 250) {
        edges {
          node {
            id
            title
            totalInventory
            status
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  sku
                  inventoryQuantity
                  availableForSale
                  price
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await queryAdminAPI(query);
  
  const products = data.products.edges.map(edge => edge.node);
  const lowStockProducts = products.filter(product => product.totalInventory < 10);
  const outOfStockProducts = products.filter(product => product.totalInventory === 0);
  const totalValue = products.reduce((sum, product) => {
    return sum + product.variants.edges.reduce((variantSum, variant) => {
      return variantSum + (parseFloat(variant.node.price) * variant.node.inventoryQuantity);
    }, 0);
  }, 0);

  return {
    summary: {
      totalProducts: products.length,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      totalInventoryValue: totalValue
    },
    lowStockProducts: lowStockProducts.map(p => ({
      title: p.title,
      inventory: p.totalInventory
    })),
    outOfStockProducts: outOfStockProducts.map(p => ({
      title: p.title,
      inventory: p.totalInventory
    }))
  };
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk update products
 */
async function bulkUpdateProducts(updates) {
  console.log(`🔄 Bulk updating ${updates.length} products...\n`);

  const results = [];
  const batchSize = 10; // Process in batches to avoid rate limits

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    const batchPromises = batch.map(async (update) => {
      try {
        const result = await updateProduct(update.id, update.data);
        return { success: true, id: update.id, result };
      } catch (error) {
        return { success: false, id: update.id, error: error.message };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches to respect rate limits
    if (i + batchSize < updates.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`✅ Bulk update completed: ${successCount} successful, ${failureCount} failed`);
  return { results, successCount, failureCount };
}

/**
 * Bulk inventory adjustment
 */
async function bulkAdjustInventory(adjustments) {
  console.log(`🔄 Bulk adjusting inventory for ${adjustments.length} items...\n`);

  const results = [];
  const batchSize = 5; // Smaller batch size for inventory operations

  for (let i = 0; i < adjustments.length; i += batchSize) {
    const batch = adjustments.slice(i, i + batchSize);
    const batchPromises = batch.map(async (adjustment) => {
      try {
        const result = await adjustInventoryLevel(
          adjustment.inventoryItemId,
          adjustment.locationId,
          adjustment.quantityDelta
        );
        return { success: true, inventoryItemId: adjustment.inventoryItemId, result };
      } catch (error) {
        return { success: false, inventoryItemId: adjustment.inventoryItemId, error: error.message };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < adjustments.length) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failureCount = results.filter(r => !r.success).length;

  console.log(`✅ Bulk inventory adjustment completed: ${successCount} successful, ${failureCount} failed`);
  return { results, successCount, failureCount };
}

// ============================================================================
// DATA EXPORT
// ============================================================================

/**
 * Export products to CSV
 */
async function exportProductsToCSV(filename = 'products-export.csv') {
  console.log('📤 Exporting products to CSV...\n');

  const products = await listProducts({ limit: 250 });
  const csvData = [];
  
  // CSV header
  csvData.push([
    'ID', 'Title', 'Handle', 'Status', 'Vendor', 'Type', 'Tags', 
    'Total Inventory', 'Price Range', 'Created At', 'Updated At'
  ].join(','));

  // CSV rows
  products.edges.forEach(edge => {
    const product = edge.node;
    const priceRange = `${product.priceRangeV2.minVariantPrice.amount} - ${product.priceRangeV2.maxVariantPrice.amount} ${product.priceRangeV2.minVariantPrice.currencyCode}`;
    
    csvData.push([
      product.id,
      `"${product.title.replace(/"/g, '""')}"`,
      product.handle,
      product.status,
      `"${product.vendor || ''}"`,
      `"${product.productType || ''}"`,
      `"${product.tags.join(', ')}"`,
      product.totalInventory,
      `"${priceRange}"`,
      product.createdAt,
      product.updatedAt
    ].join(','));
  });

  const csvContent = csvData.join('\n');
  fs.writeFileSync(filename, csvContent);
  
  console.log(`✅ Products exported to ${filename}`);
  return filename;
}

/**
 * Export orders to CSV
 */
async function exportOrdersToCSV(filename = 'orders-export.csv', options = {}) {
  console.log('📤 Exporting orders to CSV...\n');

  const orders = await listOrders({ limit: 250, ...options });
  const csvData = [];
  
  // CSV header
  csvData.push([
    'ID', 'Name', 'Email', 'Total Price', 'Financial Status', 'Fulfillment Status',
    'Customer Name', 'Created At', 'Processed At'
  ].join(','));

  // CSV rows
  orders.edges.forEach(edge => {
    const order = edge.node;
    const customerName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '';
    
    csvData.push([
      order.id,
      order.name,
      order.email,
      order.totalPrice,
      order.displayFinancialStatus,
      order.displayFulfillmentStatus,
      `"${customerName}"`,
      order.createdAt,
      order.processedAt || ''
    ].join(','));
  });

  const csvContent = csvData.join('\n');
  fs.writeFileSync(filename, csvContent);
  
  console.log(`✅ Orders exported to ${filename}`);
  return filename;
}

// ============================================================================
// STORE HEALTH CHECK
// ============================================================================

/**
 * Perform store health check
 */
async function performHealthCheck() {
  console.log('🏥 Performing store health check...\n');

  const health = {
    timestamp: new Date().toISOString(),
    checks: {},
    overall: 'healthy'
  };

  try {
    // Check API connectivity
    const shop = await getShopInfo();
    health.checks.api = { status: 'pass', message: 'API connection successful' };
  } catch (error) {
    health.checks.api = { status: 'fail', message: error.message };
    health.overall = 'unhealthy';
  }

  try {
    // Check for low stock products
    const inventoryReport = await getInventoryReport();
    const lowStockCount = inventoryReport.summary.lowStockProducts;
    const outOfStockCount = inventoryReport.summary.outOfStockProducts;
    
    health.checks.inventory = {
      status: lowStockCount > 0 || outOfStockCount > 0 ? 'warning' : 'pass',
      message: `${lowStockCount} low stock, ${outOfStockCount} out of stock`,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount
    };

    if (outOfStockCount > 0) {
      health.overall = 'warning';
    }
  } catch (error) {
    health.checks.inventory = { status: 'fail', message: error.message };
  }

  try {
    // Check recent orders (simplified query without line items)
    const query = `
      query GetOrders($first: Int!) {
        orders(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              displayFulfillmentStatus
            }
          }
        }
      }
    `;
    
    const data = await queryAdminAPI(query, { first: 10 });
    const recentOrders = data.orders.edges;
    const unfulfilledOrders = recentOrders.filter(edge => 
      edge.node.displayFulfillmentStatus === 'unfulfilled'
    ).length;
    
    health.checks.orders = {
      status: unfulfilledOrders > 5 ? 'warning' : 'pass',
      message: `${unfulfilledOrders} unfulfilled orders in last 10`,
      unfulfilled: unfulfilledOrders
    };

    if (unfulfilledOrders > 10) {
      health.overall = 'warning';
    }
  } catch (error) {
    health.checks.orders = { status: 'fail', message: error.message };
  }

  return health;
}

// ============================================================================
// COMMAND LINE INTERFACE
// ============================================================================

/**
 * Display help information
 */
function showHelp() {
  console.log(`
🚀 Agent Helper CLI Tool

USAGE:
  node agent-tool.js [command] [options]

COMMANDS:
  info                    - Get shop information
  products [options]      - Manage products
    --list               - List products
    --get <id>           - Get specific product
    --create             - Create new product (interactive)
    --update <id>        - Update product (interactive)
    --delete <id>        - Delete product
    --search <term>      - Search products
    --status <status>    - Filter by status (active, draft, archived)
    --limit <number>     - Limit results (default: 10)

  inventory [options]     - Manage inventory
    --list               - List inventory levels
    --adjust <item> <location> <delta> - Adjust inventory
    --set <item> <location> <quantity> - Set inventory level
    --low-stock          - Show low stock items

  orders [options]        - Manage orders
    --list               - List orders
    --get <id>           - Get specific order
    --fulfill <id>       - Fulfill order (interactive)
    --cancel <id>        - Cancel order
    --status <status>    - Filter by status
    --limit <number>     - Limit results (default: 10)

  customers [options]     - Manage customers
    --list               - List customers
    --get <id|email>     - Get specific customer
    --create             - Create new customer (interactive)
    --update <id>        - Update customer (interactive)
    --search <term>      - Search customers
    --limit <number>     - Limit results (default: 10)

  reports [options]       - Generate reports
    --sales [days]       - Sales analytics (default: 30 days)
    --inventory          - Inventory report
    --customers          - Customer analytics

  bulk [options]          - Bulk operations
    --update-products    - Bulk update products (from file)
    --adjust-inventory   - Bulk adjust inventory (from file)

  export [options]        - Export data
    --products [file]    - Export products to CSV
    --orders [file]      - Export orders to CSV

  health                  - Store health check

  help                    - Show this help

EXAMPLES:
  node agent-tool.js info
  node agent-tool.js products --list --limit 20
  node agent-tool.js products --search "coffee"
  node agent-tool.js inventory --low-stock
  node agent-tool.js orders --list --status unfulfilled
  node agent-tool.js customers --search "john@example.com"
  node agent-tool.js reports --sales 7
  node agent-tool.js export --products my-products.csv
  node agent-tool.js health

ENVIRONMENT VARIABLES:
  SHOPIFY_STORE_DOMAIN   - Your store domain (e.g., mystore.myshopify.com)
  SHOPIFY_ACCESS_TOKEN   - Your access token (shpat_...)
`);
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    return { command: 'help' };
  }

  const command = args[0];
  const options = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      options[key] = value;
      if (value !== true) i++; // Skip next arg if it was used as value
    }
  }

  return { command, options };
}

/**
 * Main function
 */
async function main() {
  const { command, options } = parseArgs();

  try {
    switch (command) {
      case 'info':
        const shop = await getShopInfo();
        console.log('🏪 Shop Information:');
        console.log(`  Name: ${shop.name}`);
        console.log(`  URL: ${shop.url}`);
        console.log(`  Email: ${shop.email}`);
        console.log(`  Plan: ${shop.plan.displayName}`);
        console.log(`  Currency: ${shop.currencyCode}`);
        console.log(`  Domain: ${shop.myshopifyDomain}`);
        break;

      case 'products':
        if (options.list || !Object.keys(options).length) {
          const products = await listProducts(options);
          console.log(`📦 Products (${products.edges.length}):`);
          products.edges.forEach((edge, index) => {
            const product = edge.node;
            console.log(`  ${index + 1}. ${product.title}`);
            console.log(`     Handle: ${product.handle}`);
            console.log(`     Status: ${product.status}`);
            console.log(`     Inventory: ${product.totalInventory}`);
            console.log(`     Price: ${formatCurrency(product.priceRangeV2.minVariantPrice.amount, product.priceRangeV2.minVariantPrice.currencyCode)}`);
            console.log(`     Updated: ${formatDate(product.updatedAt)}`);
            console.log('');
          });
        } else if (options.get) {
          const product = await getProduct(options.get);
          console.log('📦 Product Details:');
          console.log(`  Title: ${product.title}`);
          console.log(`  Handle: ${product.handle}`);
          console.log(`  Description: ${product.description || 'No description'}`);
          console.log(`  Status: ${product.status}`);
          console.log(`  Vendor: ${product.vendor || 'No vendor'}`);
          console.log(`  Type: ${product.productType || 'No type'}`);
          console.log(`  Tags: ${product.tags.join(', ') || 'No tags'}`);
          console.log(`  Total Inventory: ${product.totalInventory}`);
          console.log(`  Price Range: ${formatCurrency(product.priceRangeV2.minVariantPrice.amount, product.priceRangeV2.minVariantPrice.currencyCode)} - ${formatCurrency(product.priceRangeV2.maxVariantPrice.amount, product.priceRangeV2.maxVariantPrice.currencyCode)}`);
          console.log(`  Created: ${formatDate(product.createdAt)}`);
          console.log(`  Updated: ${formatDate(product.updatedAt)}`);
          
          if (product.variants.edges.length > 0) {
            console.log('\n  Variants:');
            product.variants.edges.forEach((edge, index) => {
              const variant = edge.node;
              console.log(`    ${index + 1}. ${variant.title}`);
              console.log(`       SKU: ${variant.sku || 'No SKU'}`);
              console.log(`       Price: ${formatCurrency(variant.price)}`);
              console.log(`       Inventory: ${variant.inventoryQuantity}`);
              console.log(`       Available: ${variant.availableForSale ? 'Yes' : 'No'}`);
            });
          }
        } else {
          console.log('❌ Invalid products command. Use --help for options.');
        }
        break;

      case 'inventory':
        if (options.list || !Object.keys(options).length) {
          const inventory = await getInventoryLevels();
          console.log('📊 Inventory Levels:');
          inventory.edges.forEach((edge, index) => {
            const item = edge.node;
            console.log(`  ${index + 1}. ${item.product.title}`);
            console.log(`     SKU: ${item.sku || 'No SKU'}`);
            console.log(`     Tracked: ${item.tracked ? 'Yes' : 'No'}`);
            if (item.inventoryLevels.edges.length > 0) {
              item.inventoryLevels.edges.forEach(levelEdge => {
                const level = levelEdge.node;
                console.log(`     ${level.location.name}: ${level.available}`);
              });
            }
            console.log('');
          });
        } else if (options['low-stock']) {
          const report = await getInventoryReport();
          console.log('⚠️ Low Stock Products:');
          if (report.lowStockProducts.length === 0) {
            console.log('  No low stock products found.');
          } else {
            report.lowStockProducts.forEach((product, index) => {
              console.log(`  ${index + 1}. ${product.title} (${product.inventory} in stock)`);
            });
          }
        } else {
          console.log('❌ Invalid inventory command. Use --help for options.');
        }
        break;

      case 'orders':
        if (options.list || !Object.keys(options).length) {
          const orders = await listOrders(options);
          console.log(`🛒 Orders (${orders.edges.length}):`);
          orders.edges.forEach((edge, index) => {
            const order = edge.node;
            console.log(`  ${index + 1}. ${order.name}`);
            console.log(`     Email: ${order.email}`);
            console.log(`     Total: ${formatCurrency(order.totalPrice)}`);
            console.log(`     Status: ${order.displayFinancialStatus}/${order.displayFulfillmentStatus}`);
            console.log(`     Date: ${formatDate(order.createdAt)}`);
            console.log('');
          });
        } else if (options.get) {
          const order = await getOrder(options.get);
          console.log('🛒 Order Details:');
          console.log(`  Name: ${order.name}`);
          console.log(`  Email: ${order.email}`);
          console.log(`  Phone: ${order.phone || 'No phone'}`);
          console.log(`  Total: ${formatCurrency(order.totalPrice)}`);
          console.log(`  Subtotal: ${formatCurrency(order.subtotalPrice)}`);
          console.log(`  Tax: ${formatCurrency(order.totalTax)}`);
          console.log(`  Shipping: ${formatCurrency(order.totalShippingPrice)}`);
          console.log(`  Financial Status: ${order.displayFinancialStatus}`);
          console.log(`  Fulfillment Status: ${order.displayFulfillmentStatus}`);
          console.log(`  Created: ${formatDate(order.createdAt)}`);
          console.log(`  Processed: ${order.processedAt ? formatDate(order.processedAt) : 'Not processed'}`);
          
          if (order.customer) {
            console.log(`\n  Customer: ${order.customer.firstName} ${order.customer.lastName}`);
            console.log(`  Customer Email: ${order.customer.email}`);
          }
          
          if (order.shippingAddress) {
            console.log('\n  Shipping Address:');
            console.log(`    ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`);
            console.log(`    ${order.shippingAddress.address1}`);
            if (order.shippingAddress.address2) console.log(`    ${order.shippingAddress.address2}`);
            console.log(`    ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.zip}`);
            console.log(`    ${order.shippingAddress.country}`);
          }
          
          if (order.lineItems.edges.length > 0) {
            console.log('\n  Line Items:');
            order.lineItems.edges.forEach((edge, index) => {
              const item = edge.node;
              console.log(`    ${index + 1}. ${item.title} x${item.quantity}`);
              console.log(`       Price: ${formatCurrency(item.price)}`);
              if (item.variant) {
                console.log(`       Variant: ${item.variant.title}`);
                console.log(`       SKU: ${item.variant.sku || 'No SKU'}`);
              }
            });
          }
        } else {
          console.log('❌ Invalid orders command. Use --help for options.');
        }
        break;

      case 'customers':
        if (options.list || !Object.keys(options).length) {
          const customers = await listCustomers(options);
          console.log(`👥 Customers (${customers.edges.length}):`);
          customers.edges.forEach((edge, index) => {
            const customer = edge.node;
            console.log(`  ${index + 1}. ${customer.firstName} ${customer.lastName}`);
            console.log(`     Email: ${customer.email}`);
            console.log(`     Phone: ${customer.phone || 'No phone'}`);
            console.log(`     Total Spent: ${formatCurrency(customer.totalSpent)}`);
            console.log(`     Orders: ${customer.ordersCount}`);
            console.log(`     Created: ${formatDate(customer.createdAt)}`);
            console.log('');
          });
        } else if (options.get) {
          const customer = await getCustomer(options.get);
          console.log('👥 Customer Details:');
          console.log(`  Name: ${customer.firstName} ${customer.lastName}`);
          console.log(`  Email: ${customer.email}`);
          console.log(`  Phone: ${customer.phone || 'No phone'}`);
          console.log(`  Total Spent: ${formatCurrency(customer.totalSpent)}`);
          console.log(`  Orders: ${customer.ordersCount}`);
          console.log(`  Tags: ${customer.tags.join(', ') || 'No tags'}`);
          console.log(`  Created: ${formatDate(customer.createdAt)}`);
          console.log(`  Updated: ${formatDate(customer.updatedAt)}`);
          
          if (customer.defaultAddress) {
            console.log('\n  Default Address:');
            const addr = customer.defaultAddress;
            console.log(`    ${addr.firstName} ${addr.lastName}`);
            console.log(`    ${addr.address1}`);
            if (addr.address2) console.log(`    ${addr.address2}`);
            console.log(`    ${addr.city}, ${addr.province} ${addr.zip}`);
            console.log(`    ${addr.country}`);
          }
          
          if (customer.orders.edges.length > 0) {
            console.log('\n  Recent Orders:');
            customer.orders.edges.forEach((edge, index) => {
              const order = edge.node;
              console.log(`    ${index + 1}. ${order.name} - ${formatCurrency(order.totalPrice)} (${order.displayFinancialStatus})`);
              console.log(`       Date: ${formatDate(order.createdAt)}`);
            });
          }
        } else {
          console.log('❌ Invalid customers command. Use --help for options.');
        }
        break;

      case 'reports':
        if (options.sales) {
          const days = parseInt(options.sales) || 30;
          const analytics = await getSalesAnalytics({ days });
          console.log(`📊 Sales Analytics (${days} days):`);
          console.log(`  Total Revenue: ${formatCurrency(analytics.summary.totalRevenue)}`);
          console.log(`  Total Orders: ${analytics.summary.totalOrders}`);
          console.log(`  Average Order Value: ${formatCurrency(analytics.summary.averageOrderValue)}`);
          
          if (analytics.topProducts.length > 0) {
            console.log('\n  Top Products:');
            analytics.topProducts.forEach(([title, data], index) => {
              console.log(`    ${index + 1}. ${title}`);
              console.log(`       Quantity Sold: ${data.quantity}`);
              console.log(`       Revenue: ${formatCurrency(data.revenue)}`);
            });
          }
        } else if (options.inventory) {
          const report = await getInventoryReport();
          console.log('📊 Inventory Report:');
          console.log(`  Total Products: ${report.summary.totalProducts}`);
          console.log(`  Low Stock: ${report.summary.lowStockProducts}`);
          console.log(`  Out of Stock: ${report.summary.outOfStockProducts}`);
          console.log(`  Total Inventory Value: ${formatCurrency(report.summary.totalInventoryValue)}`);
          
          if (report.lowStockProducts.length > 0) {
            console.log('\n  Low Stock Products:');
            report.lowStockProducts.forEach((product, index) => {
              console.log(`    ${index + 1}. ${product.title} (${product.inventory} in stock)`);
            });
          }
        } else {
          console.log('❌ Invalid reports command. Use --help for options.');
        }
        break;

      case 'export':
        if (options.products) {
          const filename = options.products === true ? 'products-export.csv' : options.products;
          await exportProductsToCSV(filename);
        } else if (options.orders) {
          const filename = options.orders === true ? 'orders-export.csv' : options.orders;
          await exportOrdersToCSV(filename);
        } else {
          console.log('❌ Invalid export command. Use --help for options.');
        }
        break;

      case 'health':
        const health = await performHealthCheck();
        console.log('🏥 Store Health Check:');
        console.log(`  Overall Status: ${health.overall.toUpperCase()}`);
        console.log(`  Timestamp: ${health.timestamp}`);
        console.log('');
        
        Object.entries(health.checks).forEach(([check, result]) => {
          const status = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
          console.log(`  ${status} ${check.toUpperCase()}: ${result.message}`);
        });
        break;

      case 'help':
      default:
        showHelp();
        break;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
