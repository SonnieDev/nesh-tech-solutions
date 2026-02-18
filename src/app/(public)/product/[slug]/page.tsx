
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, ShieldCheck, ShoppingCart } from 'lucide-react';
import { AddToCartButton } from '@/components/shop/add-to-cart-button'; // To be created

export default async function ProductPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();
    const { slug } = params;

    const { data: product, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_variants(*)')
        .eq('id', slug) // Assuming slug is ID for now, ideally slug would be a unique string
        .single();

    if (error || !product) {
        notFound();
    }

    const primaryImage = product.product_images?.find((img: any) => img.is_primary) || product.product_images?.[0];

    return (
        <div className="container px-4 md:px-6 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Gallery Section */}
                <div className="space-y-4">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border">
                        {primaryImage ? (
                            <Image
                                src={primaryImage.url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                            </div>
                        )}
                    </div>
                    {/* Small thumbnails could go here */}
                </div>

                {/* Product Info Section */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                        <p className="text-xl text-muted-foreground mt-2">{product.brand} - {product.model}</p>
                    </div>

                    <div className="text-2xl font-bold">
                        KES {product.base_price.toLocaleString()}
                    </div>

                    <div className="space-y-4">
                        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                            {product.description}
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <span>Genuine Spigen Product</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Truck className="w-5 h-5 text-primary" />
                                <span>Fast Shipping Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Variants & Add to Cart */}
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}
