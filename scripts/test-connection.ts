
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function testConnection() {
    console.log('Testing connection to Supabase...');

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Missing environment variables!');
        return;
    }

    try {
        // Try to select from products to check if table exists
        const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });

        if (error) {
            // PGRST205 is "relation does not exist" which means we connected but table is missing
            if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
                console.log('✅ Connection Successful!');
                console.log('⚠️  Status: Connected to Supabase, but the "products" table does not exist yet.');
                console.log('➡️  ACTION REQUIRED: Go to your Supabase Dashboard -> SQL Editor and run the content of "supabase_schema.sql".');
            } else {
                console.error('❌ Connection Error:', error.message, error.details, error.hint);
            }
        } else {
            console.log('✅ Connection Successful!');
            console.log('✅ Status: Database schema is set up correctly.');
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testConnection();
