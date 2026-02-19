'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }

    revalidatePath('/admin/products');
}
