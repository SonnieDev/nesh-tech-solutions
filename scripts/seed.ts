import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
    console.log('Seeding products...');

    // iPhone 15 Pro ZeroOne
    const { data: iphone, error: iphoneError } = await supabase
        .from('products')
        .insert({
            name: 'Spigen ZeroOne Case',
            description: 'Teardown aesthetic case with Mil-grade protection for iPhone 15 Pro.',
            brand: 'iPhone',
            model: 'iPhone 15 Pro',
            base_price: 2500,
            is_featured: true,
        })
        .select()
        .single();

    if (iphoneError) {
        console.error('Error creating iPhone product:', iphoneError);
    } else {
        console.log('Created iPhone product:', iphone.id);
        await supabase.from('product_variants').insert([
            { product_id: iphone.id, color_name: 'Dark Mode', sku: 'SP-I15P-ZO-DM', stock_quantity: 50 },
            { product_id: iphone.id, color_name: 'Light Mode', sku: 'SP-I15P-ZO-LM', stock_quantity: 30 },
        ]);

        // Add Image
        await supabase.from('product_images').insert([
            { product_id: iphone.id, url: 'https://m.media-amazon.com/images/I/71ReplaceWithRealUrl.jpg', is_primary: true }
        ]);
    }

    // Samsung S24 Ultra ZeroOne
    const { data: samsung, error: samsungError } = await supabase
        .from('products')
        .insert({
            name: 'Spigen ZeroOne Case',
            description: 'Teardown aesthetic case for Galaxy S24 Ultra.',
            brand: 'Samsung',
            model: 'Galaxy S24 Ultra',
            base_price: 2600,
            is_featured: true,
        })
        .select()
        .single();

    if (samsungError) {
        console.error('Error creating Samsung product:', samsungError);
    } else {
        console.log('Created Samsung product:', samsung.id);
        await supabase.from('product_variants').insert([
            { product_id: samsung.id, color_name: 'Dark Mode', sku: 'SP-S24U-ZO-DM', stock_quantity: 40 },
        ]);
        // Add Image
        await supabase.from('product_images').insert([
            { product_id: samsung.id, url: 'https://m.media-amazon.com/images/I/71ReplaceWithRealUrlSamsung.jpg', is_primary: true }
        ]);
    }

    console.log('Seeding complete.');
}

seed();
