"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                No products found.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
                <Card key={product.id} className="overflow-hidden group">
                    <div className="aspect-square relative bg-muted">
                        {product.product_images?.[0]?.url ? (
                            <Image
                                src={product.product_images[0].url}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                            </div>
                        )}
                        {product.is_featured && (
                            <Badge className="absolute top-2 right-2">Featured</Badge>
                        )}
                    </div>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-muted-foreground">{product.brand} - {product.model}</p>
                                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="font-bold text-lg">KES {product.base_price.toLocaleString()}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/product/${product.id}`} className="w-full">
                            <div className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-center hover:bg-primary/90 transition-colors">
                                View Details
                            </div>
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
