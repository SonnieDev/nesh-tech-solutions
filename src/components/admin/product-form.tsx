"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types';

const productSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    brand: z.enum(["iPhone", "Samsung"]),
    model: z.string().min(2, { message: "Model is required." }),
    base_price: z.coerce.number().min(0, { message: "Price must be positive." }),
    is_featured: z.boolean().default(false),
    image_url: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
});

interface ProductFormProps {
    initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            brand: initialData?.brand || "iPhone",
            model: initialData?.model || "",
            base_price: initialData?.base_price || 0,
            is_featured: initialData?.is_featured || false,
            image_url: initialData?.product_images?.[0]?.url || "",
        },
    });

    async function onSubmit(values: z.infer<typeof productSchema>) {
        setLoading(true);
        try {
            let productId = initialData?.id;

            const productData = {
                name: values.name,
                description: values.description,
                brand: values.brand,
                model: values.model,
                base_price: values.base_price,
                is_featured: values.is_featured,
            };

            if (initialData) {
                const { error } = await supabase.from('products').update(productData).eq('id', initialData.id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase.from('products').insert(productData).select().single();
                if (error) throw error;
                productId = data.id;
            }

            // Handle Image (Simple URL update for MVP)
            if (values.image_url && productId) {
                // Check if image exists
                if (initialData?.product_images?.[0]) {
                    await supabase.from('product_images').update({ url: values.image_url }).eq('id', initialData.product_images[0].id);
                } else {
                    await supabase.from('product_images').insert({ product_id: productId, url: values.image_url, is_primary: true, display_order: 0 });
                }
            }

            toast.success(initialData ? "Product updated" : "Product created");
            router.push('/admin/products');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Spigen ZeroOne" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a brand" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="iPhone">iPhone</SelectItem>
                                        <SelectItem value="Samsung">Samsung</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="iPhone 15 Pro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Product description..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="base_price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Base Price (KES)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormDescription>Link to an image (e.g., from Unsplash or Amazon)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Featured
                                </FormLabel>
                                <FormDescription>
                                    This product will appear on the home page.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
                </Button>
            </form>
        </Form>
    )
}
