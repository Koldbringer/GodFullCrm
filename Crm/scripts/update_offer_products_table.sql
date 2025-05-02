-- Add new columns to offer_products table
ALTER TABLE offer_products ADD COLUMN IF NOT EXISTS discount_percentage INTEGER;
ALTER TABLE offer_products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);
ALTER TABLE offer_products ADD COLUMN IF NOT EXISTS stock_status TEXT;
ALTER TABLE offer_products ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE offer_products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_offer_products_offer_option_id ON offer_products(offer_option_id);

-- Add comment to explain the purpose of the columns
COMMENT ON COLUMN offer_products.discount_percentage IS 'Percentage discount applied to the product';
COMMENT ON COLUMN offer_products.original_price IS 'Original price before discount';
COMMENT ON COLUMN offer_products.stock_status IS 'Stock status: in_stock, low_stock, out_of_stock';
COMMENT ON COLUMN offer_products.features IS 'JSON array of product features';
COMMENT ON COLUMN offer_products.image_url IS 'URL to product image';
