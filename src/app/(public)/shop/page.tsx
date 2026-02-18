
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ProductFilters } from '@/components/shop/product-filters';
import { ProductGrid } from '@/components/shop/product-grid';

// Re-fetch logic or searchParams
export default async function ShopPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const supabase = await createClient();

    // Await searchParams before accessing properties
    const params = await searchParams;
    const brand = typeof params.brand === 'string' ? params.brand : undefined;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;

    let query = supabase.from('products').select('*, product_images(*), product_variants(*)');

    if (brand) {
        const brands = brand.split(',');
        query = query.in('brand', brands);
    }

    if (sort === 'price-asc') {
        query = query.order('base_price', { ascending: true });
    } else if (sort === 'price-desc') {
        query = query.order('base_price', { ascending: false });
    } else {
        query = query.order('created_at', { ascending: false });
    }

    const { data: products } = await query;

    return (
        <div className="container px-4 md:px-6 py-8">
            <h1 className="text-3xl font-bold mb-8">Shop Cases</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64">
                    <Suspense>
                        <ProductFilters />
                    </Suspense>
                </aside>
                <main className="flex-1">
                    <ProductGrid products={products || []} />
                </main>
            </div>
        </div>
    );
}
