DO $$
BEGIN
    -- 1. Add product_variant_id column to product_images if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_images' AND column_name = 'product_variant_id') THEN
        ALTER TABLE product_images 
        ADD COLUMN product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;
        RAISE NOTICE 'Added product_variant_id column to product_images';
    END IF;

    -- 2. Link the S24 Ultra White Image to the Light Mode Variant
    -- We find the variant ID for 'SP-S24U-ZO-LM' (Light Mode) and update the image record
    UPDATE product_images
    SET product_variant_id = (
        SELECT id FROM product_variants 
        WHERE sku = 'SP-S24U-ZO-LM' 
        LIMIT 1
    )
    WHERE url = '/products/spigen_s24u_white.jpg';
    
    RAISE NOTICE 'Linked White Image to Light Mode Variant';

END $$;
