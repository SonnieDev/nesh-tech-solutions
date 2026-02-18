"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function CartSheet() {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
                    <span className="sr-only">Shopping Cart</span>
                    {getTotalItems() > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in">
                            {getTotalItems()}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                    <SheetTitle>Your Cart ({getTotalItems()})</SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground opacity-20" />
                        <p className="text-muted-foreground text-center">Your cart is empty.</p>
                        <SheetClose asChild>
                            <Button variant="outline" className="mt-4">Continue Shopping</Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <div className="space-y-4 py-4">
                                {items.map((item) => (
                                    <div key={item.variant.id} className="flex gap-4">
                                        <div className="relative h-20 w-20 rounded-md border bg-muted overflow-hidden flex-shrink-0">
                                            {item.product.product_images?.[0]?.url ? (
                                                <Image
                                                    src={item.product.product_images[0].url}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 gap-1">
                                            <h4 className="font-semibold line-clamp-1">{item.product.name}</h4>
                                            <p className="text-sm text-muted-foreground">{item.product.brand} - {item.variant.color_name}</p>
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center border rounded-md h-8">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.variant.id, Math.max(1, item.quantity - 1))}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-medium text-sm">
                                                        KES {((item.product.base_price + (item.variant.price_modifier || 0)) * item.quantity).toLocaleString()}
                                                    </span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.variant.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <Separator />
                        <SheetFooter className="pt-4 sm:flex-col gap-4">
                            <div className="flex items-center justify-between w-full">
                                <span className="font-semibold text-lg">Total</span>
                                <span className="font-bold text-xl">KES {getTotalPrice().toLocaleString()}</span>
                            </div>
                            <SheetClose asChild>
                                <Button asChild className="w-full" size="lg">
                                    <Link href="/checkout">Proceed to Checkout</Link>
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}
