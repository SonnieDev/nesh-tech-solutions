
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductView } from '@/components/shop/product-view';


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;

    console.log("Fetching product with ID:", slug);

    const { data: product, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_variants(*)')
        .eq('id', slug)
        .single();

    if (error || !product) {
        notFound();
    }

    return (
        <div className="container px-4 md:px-6 py-8">
            <ProductView product={product} />
        </div>
    );
}
