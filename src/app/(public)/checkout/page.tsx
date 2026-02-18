"use client";

import { useState } from 'react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
    const { items, getTotalPrice } = useCartStore();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });

    const total = getTotalPrice();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWhatsAppCheckout = async () => {
        if (!formData.name || !formData.phone || !formData.address) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const phoneNumber = "254700000000"; // Replace with actual business number

        const supabase = createClient();

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    delivery_address: formData.address,
                    total_amount: total,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product.id,
                variant_id: item.variant.id,
                quantity: item.quantity,
                price_at_purchase: item.product.base_price + (item.variant.price_modifier || 0)
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) throw itemsError;

            let message = `*New Order from ${formData.name}*\n`;
            message += `*Order ID:* ${order.id.slice(0, 8)}\n\n`; // Add Order ID
            message += `*Phone:* ${formData.phone}\n`;
            message += `*Address:* ${formData.address}\n`;
            if (formData.notes) message += `*Notes:* ${formData.notes}\n`;
            message += `\n*Items:*\n`;

            items.forEach(item => {
                message += `- ${item.product.name} (${item.variant.color_name}) x${item.quantity} @ KES ${((item.product.base_price + (item.variant.price_modifier || 0)) * item.quantity).toLocaleString()}\n`;
            });

            message += `\n*Total:* KES ${total.toLocaleString()}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Clear cart
            useCartStore.getState().clearCart();

            window.open(whatsappUrl, '_blank');
            toast.success("Order placed! Redirecting to WhatsApp...");
            router.push('/');

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to place order. Please try again or contact support.");
        }
    };

    if (items.length === 0) {
        return (
            <div className="container px-4 py-16 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground">Add some items to your cart to proceed to checkout.</p>
                <Button asChild>
                    <Link href="/shop">Go to Shop</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Review your items before proceeding.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div key={item.variant.id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.product.brand} - {item.variant.color_name} (x{item.quantity})</p>
                                </div>
                                <p className="font-medium">KES {((item.product.base_price + (item.variant.price_modifier || 0)) * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>KES {total.toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Delivery Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Details</CardTitle>
                        <CardDescription>Enter your details to complete the order via WhatsApp.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" name="phone" placeholder="+254 7..." value={formData.phone} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Delivery Address *</Label>
                            <Textarea id="address" name="address" placeholder="Street, Building, Apartment..." value={formData.address} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Order Notes (Optional)</Label>
                            <Textarea id="notes" name="notes" placeholder="Any special instructions..." value={formData.notes} onChange={handleInputChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg" onClick={handleWhatsAppCheckout}>
                            Complete Order via WhatsApp
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
