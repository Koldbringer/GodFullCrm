# Enhanced Quotes Functionality

This document describes the enhanced quotes functionality in the GodLike HVAC CRM/ERP system.

## New Features

### 1. Enhanced Product Display
- Product cards now show more detailed information
- Stock status indicators (in stock, low stock, out of stock)
- Support for product images
- Quantity display
- Discount functionality with original price strikethrough

### 2. Improved Option Selection
- Visually enhanced option tabs
- Price display in option tabs
- Better visual indication of recommended options

### 3. Enhanced Services Display
- Improved service table with descriptions
- Subtotal calculation for services
- Hover effects for better UX

### 4. Improved Summary Section
- Visually enhanced summary card
- Discount calculation and display
- Detailed pricing breakdown
- Additional information about offer validity

### 5. Enhanced Installation Date Selection
- Calendar view with month grouping
- Visual indication of weekend dates
- Availability indicators with color coding
- Selected date display with change option
- Additional information about installation process

### 6. Improved Approval Confirmation
- Detailed confirmation screen
- Order summary with selected option and price
- Installation date confirmation
- Next steps information
- Contact information

## Database Changes

The following columns have been added to the `offer_products` table:

- `discount_percentage`: INTEGER - Percentage discount applied to the product
- `original_price`: DECIMAL(10, 2) - Original price before discount
- `stock_status`: TEXT - Stock status (in_stock, low_stock, out_of_stock)
- `features`: JSONB - JSON array of product features
- `image_url`: TEXT - URL to product image

To apply these changes, run the SQL script in `scripts/update_offer_products_table.sql`.

## Implementation Details

### Product Display

Products now support:
- Discount functionality with original price display
- Stock status indicators
- Multiple product images
- Feature lists
- Quantity display with subtotal calculation

### Installation Date Selection

The installation date selection now includes:
- Visual calendar with month grouping
- Weekend highlighting
- Availability indicators
- Selected date display with change option
- Additional information about installation process

### Approval Confirmation

The approval confirmation screen now includes:
- Order summary with selected option and price
- Installation date confirmation
- Next steps information
- Contact information
- Option to download confirmation

## Usage Instructions

### Adding Discounts to Products

1. When creating an offer, select a product from the inventory
2. Enter a discount percentage in the "Zniżka (%)" field
3. The original price will be automatically saved
4. The discounted price will be displayed in the offer

### Using Stock Status

Stock status is automatically determined based on the quantity in inventory:
- More than 10 items: "in_stock" (Dostępny)
- 1-10 items: "low_stock" (Mała ilość)
- 0 items: "out_of_stock" (Niedostępny)

### Adding Product Features

Product features are automatically loaded from the inventory if available. Features should be stored as a JSON array in the `features` column of the `inventory` table.

### Adding Product Images

Product images are automatically loaded from the inventory if available. The image URL should be stored in the `image_url` column of the `inventory` table.
