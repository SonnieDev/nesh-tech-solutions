
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";
import { Product } from "@/types";

type Params = Promise<{ id: string }>;

export default async function EditProductPage(props: { params: Params }) {
    const params = await props.params;
    const { id } = params;
    const supabase = await createClient();

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
