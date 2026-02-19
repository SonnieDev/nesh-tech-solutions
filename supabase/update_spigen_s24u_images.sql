DO $$
DECLARE
    v_product_id UUID;
    v_variant_dark UUID;
    v_variant_light UUID;
BEGIN
    -- 1. Get Product ID for "Samsung Galaxy S24 Ultra" Spigen Case
    SELECT id INTO v_product_id 
    FROM products 
    WHERE model = 'Galaxy S24 Ultra' 
      AND brand = 'Samsung' 
      AND name = 'Spigen ZeroOne Case' 
    LIMIT 1;

    IF v_product_id IS NULL THEN
        RAISE EXCEPTION 'Product Spigen ZeroOne Case for S24 Ultra not found';
    END IF;

    -- 2. Get Variant IDs
    SELECT id INTO v_variant_dark FROM product_variants WHERE product_id = v_product_id AND color_name = 'Dark Mode';
    SELECT id INTO v_variant_light FROM product_variants WHERE product_id = v_product_id AND color_name = 'Light Mode';

    -- 3. Upsert Dark Mode Image (Black)
    -- Check if image exists for this product variant, if so update url, else insert
    IF EXISTS (SELECT 1 FROM product_images WHERE product_variant_id = v_variant_dark) THEN
        UPDATE product_images 
        SET url = '/products/spigen-black-s24-ultra.jpg'
        WHERE product_variant_id = v_variant_dark;
        RAISE NOTICE 'Updated Dark Mode Image';
    ELSE
        INSERT INTO product_images (product_id, url, is_primary, product_variant_id)
        VALUES (v_product_id, '/products/spigen-black-s24-ultra.jpg', true, v_variant_dark);
        RAISE NOTICE 'Inserted Dark Mode Image';
    END IF;

    -- 4. Upsert Light Mode Image (White)
    IF EXISTS (SELECT 1 FROM product_images WHERE product_variant_id = v_variant_light) THEN
        UPDATE product_images 
        SET url = '/products/spigen-white-s24-ultra.jpg'
        WHERE product_variant_id = v_variant_light;
        RAISE NOTICE 'Updated Light Mode Image';
    ELSE
        INSERT INTO product_images (product_id, url, is_primary, product_variant_id)
        VALUES (v_product_id, '/products/spigen-white-s24-ultra.jpg', false, v_variant_light);
        RAISE NOTICE 'Inserted Light Mode Image';
    END IF;

END $$;
