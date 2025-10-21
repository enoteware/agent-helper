# 🚀 Enhanced Agent Helper CLI Guide

The Enhanced Agent Helper CLI is a comprehensive command-line tool for managing Shopify stores. It provides all the essential functions agents need for store management, from basic operations to advanced analytics and bulk operations.

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Basic Usage](#basic-usage)
- [Commands Reference](#commands-reference)
- [Examples](#examples)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)

## 🛠 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/enoteware/agent-helper.git
   cd agent-helper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Shopify credentials
   ```

## ⚙️ Configuration

Create a `.env` file with your Shopify store credentials:

```env
# Agent Helper Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_your_access_token_here
```

## 🚀 Basic Usage

### Quick Start
```bash
# Run the enhanced CLI
npm run enhanced

# Or directly
node scripts/enhanced-agent-tool.js [command] [options]
```

### Get Help
```bash
npm run enhanced help
```

## 📚 Commands Reference

### 🏪 Shop Information
```bash
# Get basic shop information
npm run enhanced info
```

### 📦 Product Management
```bash
# List products
npm run enhanced products --list

# List with options
npm run enhanced products --list --limit 20 --status active

# Get specific product
npm run enhanced products --get 123456789

# Search products
npm run enhanced products --search "coffee"

# Filter by status
npm run enhanced products --status draft
```

**Product Status Options:**
- `active` - Published products
- `draft` - Draft products
- `archived` - Archived products

### 📊 Inventory Management
```bash
# List inventory levels
npm run enhanced inventory --list

# Show low stock items
npm run enhanced inventory --low-stock

# Adjust inventory (requires item ID, location ID, and delta)
npm run enhanced inventory --adjust <item_id> <location_id> <delta>

# Set inventory level (requires item ID, location ID, and quantity)
npm run enhanced inventory --set <item_id> <location_id> <quantity>
```

### 🛒 Order Management
```bash
# List orders
npm run enhanced orders --list

# List with filters
npm run enhanced orders --list --status unfulfilled --limit 20

# Get specific order
npm run enhanced orders --get 123456789

# Fulfill order (interactive)
npm run enhanced orders --fulfill 123456789

# Cancel order
npm run enhanced orders --cancel 123456789
```

**Order Status Options:**
- `open` - Open orders
- `closed` - Closed orders
- `cancelled` - Cancelled orders
- `any` - All orders

**Financial Status Options:**
- `pending` - Pending payment
- `authorized` - Authorized
- `partially_paid` - Partially paid
- `paid` - Paid
- `partially_refunded` - Partially refunded
- `refunded` - Refunded
- `voided` - Voided

**Fulfillment Status Options:**
- `fulfilled` - Fulfilled
- `null` - Unfulfilled
- `partial` - Partially fulfilled
- `restocked` - Restocked

### 👥 Customer Management
```bash
# List customers
npm run enhanced customers --list

# Search customers
npm run enhanced customers --search "john@example.com"

# Get specific customer
npm run enhanced customers --get 123456789
# Or by email
npm run enhanced customers --get john@example.com

# Create customer (interactive)
npm run enhanced customers --create

# Update customer (interactive)
npm run enhanced customers --update 123456789
```

### 📈 Reports & Analytics
```bash
# Sales analytics (last 30 days)
npm run enhanced reports --sales

# Sales analytics (last 7 days)
npm run enhanced reports --sales 7

# Inventory report
npm run enhanced reports --inventory

# Customer analytics
npm run enhanced reports --customers
```

### 📤 Data Export
```bash
# Export products to CSV
npm run enhanced export --products

# Export products to specific file
npm run enhanced export --products my-products.csv

# Export orders to CSV
npm run enhanced export --orders

# Export orders to specific file
npm run enhanced export --orders my-orders.csv
```

### 🔄 Bulk Operations
```bash
# Bulk update products (from file)
npm run enhanced bulk --update-products

# Bulk adjust inventory (from file)
npm run enhanced bulk --adjust-inventory
```

### 🏥 Store Health Check
```bash
# Perform comprehensive health check
npm run enhanced health
```

## 💡 Examples

### Daily Store Management
```bash
# Check store health
npm run enhanced health

# Review low stock items
npm run enhanced inventory --low-stock

# Check unfulfilled orders
npm run enhanced orders --list --status unfulfilled

# Review recent customers
npm run enhanced customers --list --limit 10
```

### Product Management
```bash
# Search for products
npm run enhanced products --search "coffee"

# Get detailed product info
npm run enhanced products --get 123456789

# List all draft products
npm run enhanced products --list --status draft
```

### Order Processing
```bash
# List recent orders
npm run enhanced orders --list --limit 20

# Get order details
npm run enhanced orders --get 123456789

# Fulfill an order
npm run enhanced orders --fulfill 123456789
```

### Analytics & Reporting
```bash
# Weekly sales report
npm run enhanced reports --sales 7

# Monthly sales report
npm run enhanced reports --sales 30

# Export product data
npm run enhanced export --products products-backup.csv
```

## 🔧 Advanced Features

### Command Line Options

Most commands support these common options:
- `--limit <number>` - Limit number of results
- `--search <term>` - Search for specific items
- `--status <status>` - Filter by status
- `--help` - Show command-specific help

### Interactive Mode

Some commands (like `--create` and `--update`) run in interactive mode, prompting you for required information.

### Batch Processing

Bulk operations process items in batches to respect Shopify's rate limits and provide progress feedback.

### Error Handling

The CLI provides detailed error messages and suggestions for common issues.

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```
   ❌ Error: Missing required environment variables
   ```
   - Check your `.env` file
   - Verify `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ACCESS_TOKEN`

2. **API Rate Limits**
   ```
   ❌ API Error: Rate limit exceeded
   ```
   - Wait a few minutes before retrying
   - Use bulk operations for large datasets

3. **Invalid Product/Order IDs**
   ```
   ❌ Error: Product not found
   ```
   - Use the correct ID format
   - Check if the item exists in your store

4. **Permission Errors**
   ```
   ❌ Error: Insufficient permissions
   ```
   - Verify your access token has the required scopes
   - Check your app permissions in Shopify Admin

### Getting Help

- Use `npm run enhanced help` for general help
- Use `npm run enhanced [command] --help` for command-specific help
- Check the logs for detailed error information

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Use environment variables for production deployments
- Regularly rotate your access tokens
- Use the minimum required permissions for your use case

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Happy Store Managing! 🚀**
