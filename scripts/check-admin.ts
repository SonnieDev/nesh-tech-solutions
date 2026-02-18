
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Use Service Role to bypass RLS and read all profiles
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAdmin() {
    console.log('Checking for admin user...');

    // Check if we can find a user with the admin email in auth.users? 
    // The JS client admin api is: supabase.auth.admin.listUsers()

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const adminUser = users.find(u => u.email === 'admin@neshtech.com');

    if (adminUser) {
        console.log('✅ Admin user found:', adminUser.email, adminUser.id);
    } else {
        console.log('❌ Admin user NOT found!');
        console.log('Current users:', users.map(u => u.email));
    }
}

checkAdmin();
