
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

async function confirmUser() {
    console.log('Finding user gmunene561@gmail.com...');

    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error('Error listing users:', error);
        return;
    }

    const user = users.find(u => u.email === 'gmunene561@gmail.com');

    if (!user) {
        console.log('❌ User NOT found. Please sign up first.');
        return;
    }

    console.log('User found:', user.id);
    console.log('Email confirmed at:', user.email_confirmed_at);

    if (!user.email_confirmed_at) {
        console.log('📧 Confirming email...');
        const { data, error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
        );

        if (updateError) {
            console.error('Error confirming email:', updateError);
        } else {
            console.log('✅ Email confirmed successfully!');
        }
    } else {
        console.log('✅ Email is already confirmed.');
    }
}

confirmUser();
