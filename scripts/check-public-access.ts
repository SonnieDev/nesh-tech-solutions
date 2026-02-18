
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Use ANON key to test public access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkAccess() {
    console.log('Testing public access to products...');
    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error('❌ Public Access Error:', error.message);
        console.error('Details:', error);
    } else {
        console.log('✅ Public Access Successful! Found', data.length, 'products.');
    }
}

checkAccess();
