
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import { Product } from "@/types";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = params;

    const { data: product } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', id)
        .single();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <ProductForm initialData={product as Product} />
        </div>
    );
}
