DO $$
DECLARE
    -- Variable to store the product ID for the Samsung S24 Ultra Spigen Case
    v_product_id UUID;
BEGIN
    -- 1. Check if the parent product "Spigen ZeroOne Case" for "Galaxy S24 Ultra" exists
    SELECT id INTO v_product_id 
    FROM products 
    WHERE model = 'Galaxy S24 Ultra' 
      AND brand = 'Samsung' 
      AND name = 'Spigen ZeroOne Case' 
    LIMIT 1;

    -- If the product does not exist, insert it (though it is in seed data, safety check)
    IF v_product_id IS NULL THEN
        INSERT INTO products (name, description, brand, model, base_price, is_featured)
        VALUES (
            'Spigen ZeroOne Case', 
            'Teardown aesthetic case for Galaxy S24 Ultra.', 
            'Samsung', 
            'Galaxy S24 Ultra', 
            2600, 
            true
        )
        RETURNING id INTO v_product_id;
        
        RAISE NOTICE 'New Product Created with ID: %', v_product_id;
    ELSE
        RAISE NOTICE 'Product Exists with ID: %', v_product_id;
    END IF;

    -- 2. Insert the 'Light Mode' Variant (White) if it doesn't already exist
    IF NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = v_product_id AND color_name = 'Light Mode') THEN
        INSERT INTO product_variants (product_id, color_name, sku, stock_quantity, price_modifier)
        VALUES (
            v_product_id, 
            'Light Mode', 
            'SP-S24U-ZO-LM', 
            30, 
            0
        );
        RAISE NOTICE 'Added Light Mode Variant for Galaxy S24 Ultra';
    ELSE
        RAISE NOTICE 'Light Mode Variant already exists';
    END IF;

    -- 3. Insert the Product Image for the Light Mode variant
    -- Check if this specific URL is already associated with the product to avoid duplicates
    IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = v_product_id AND url = '/products/spigen_s24u_white.jpg') THEN
        INSERT INTO product_images (product_id, url, display_order, is_primary)
        VALUES (
            v_product_id, 
            '/products/spigen_s24u_white.jpg', 
            2,     -- Assuming Dark Mode images are at 0 or 1. 
            false  -- Not primary (assuming Dark Mode is primary as per seed)
        );
        RAISE NOTICE 'Added Light Mode Image';
    ELSE
        RAISE NOTICE 'Image /products/spigen_s24u_white.jpg already linked';
    END IF;

END $$;
