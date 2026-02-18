
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';
import { PostgrestError } from '@supabase/supabase-js';

export async function getProducts(filters?: {
    brand?: string;
    category?: string;
    sort?: string;
}) {
    const supabase = createClient();
    let query = supabase.from('products').select('*, product_images(*), product_variants(*)');

    if (filters?.brand) {
        query = query.eq('brand', filters.brand);
    }

    // Sorting
    if (filters?.sort === 'price-asc') {
        query = query.order('base_price', { ascending: true });
    } else if (filters?.sort === 'price-desc') {
        query = query.order('base_price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data as Product[];
}
