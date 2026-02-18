
import { createClient } from '@supabase/supabase-js';

async function checkImage() {
    const url = 'https://bwlvwwbmcuzvoymthnah.supabase.co/storage/v1/object/public/product-images/1771429255473-md1mqk4keo.jpg';
    console.log('Testing image access:', url);

    try {
        const response = await fetch(url);
        console.log('Status:', response.status);
        if (response.ok) {
            console.log('✅ Image is accessible!');
        } else {
            console.error('❌ Image access failed:', response.statusText);
            const text = await response.text();
            console.error('Body:', text);
        }
    } catch (error) {
        console.error('❌ Fetch error:', error);
    }
}

checkImage();
