"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCartStore } from '@/lib/store';
import { toast } from "sonner"

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
        product.product_variants?.[0]?.id
    );
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!selectedVariantId) {
            toast.error("Please select a variant");
            return;
        }

        const variant = product.product_variants.find(v => v.id === selectedVariantId);

        if (!variant) return;

        addItem({
            product: product,
            variant: variant,
            quantity: quantity
        });
        toast.success("Added to cart");
    };

    const selectedVariant = product.product_variants?.find(v => v.id === selectedVariantId);

    return (
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
    )
}
