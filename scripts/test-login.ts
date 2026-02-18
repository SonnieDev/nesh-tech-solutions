
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testLogin() {
    console.log('Testing login for gmunene561@gmail.com...');

    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'gmunene561@gmail.com',
        password: 'Thewolf@254'
    });

    if (error) {
        console.error('❌ Login Failed:', error.message);
        console.error('Code:', error.status);
    } else {
        console.log('✅ Login Successful!');
        console.log('User ID:', data.user.id);
        console.log('Email:', data.user.email);
    }
}

testLogin();
