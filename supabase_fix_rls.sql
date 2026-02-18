-- Drop the broken policy
DROP POLICY IF EXISTS "Only admin can insert/update/delete products" ON products;

-- Create the fixed policy using auth.jwt() instead of querying auth.users
CREATE POLICY "Only admin can insert/update/delete products"
ON products
FOR ALL
USING ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') )
WITH CHECK ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') );

-- Do the same for variants if needed
DROP POLICY IF EXISTS "Only admin can manage variants" ON product_variants;

CREATE POLICY "Only admin can manage variants"
ON product_variants
FOR ALL
USING ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') )
WITH CHECK ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') );

-- Do the same for images if needed
DROP POLICY IF EXISTS "Only admin can manage images" ON product_images;

CREATE POLICY "Only admin can manage images"
ON product_images
FOR ALL
USING ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') )
WITH CHECK ( auth.jwt() ->> 'email' IN ('admin@neshtech.com', 'gmunene561@gmail.com') );
