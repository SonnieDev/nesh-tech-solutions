"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProductViewProps {
    product: Product;
}

export function ProductView({ product }: ProductViewProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
        product.product_variants?.[0]?.id
    );
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    // Find the currently selected variant object
    const selectedVariant = product.product_variants?.find(v => v.id === selectedVariantId);

    // Determine which image to show
    // 1. Try to find an image linked to the selected variant
    // 2. Fallback to primary image
    // 3. Fallback to first image
    const variantImage = product.product_images?.find(img => img.product_variant_id === selectedVariantId);
    const primaryImage = product.product_images?.find(img => img.is_primary);
    const fallbackImage = product.product_images?.[0];

    const displayImage = variantImage || primaryImage || fallbackImage;

    const handleAddToCart = () => {
        if (!selectedVariantId) {
            toast.error("Please select a variant");
            return;
        }

        if (!selectedVariant) return;

        addItem({
            product: product,
            variant: selectedVariant,
            quantity: quantity
        });
        toast.success("Added to cart");
    };

    // Calculate dynamic price
    const currentPrice = product.base_price + (selectedVariant?.price_modifier || 0);

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Section */}
            <div className="space-y-4">
                <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border">
                    {displayImage ? (
                        <Image
                            src={displayImage.url}
                            alt={product.name}
                            fill
                            className="object-cover transition-opacity duration-300"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            key={displayImage.url} // Force re-render on image change for animation
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                    <p className="text-xl text-muted-foreground mt-2">{product.brand} - {product.model}</p>
                </div>

                <div className="text-2xl font-bold">
                    KES {currentPrice.toLocaleString()}
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
                <div className="space-y-6">
                    {product.product_variants && product.product_variants.length > 0 && (
                        <div className="space-y-3">
                            <Label>Color / Style</Label>
                            <RadioGroup
                                value={selectedVariantId}
                                onValueChange={setSelectedVariantId}
                                className="flex flex-wrap gap-2"
                            >
                                {product.product_variants.map((variant) => (
                                    <div key={variant.id}>
                                        <RadioGroupItem value={variant.id} id={variant.id} className="peer sr-only" />
                                        <Label
                                            htmlFor={variant.id}
                                            className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                        >
                                            {variant.color_name}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{quantity}</span>
                            <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!selectedVariantId || (selectedVariant && selectedVariant.stock_quantity <= 0)}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {selectedVariant && selectedVariant.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
