export interface Product {
    id: string;
    name: string;
    description: string;
    brand: 'iPhone' | 'Samsung';
    model: string;
    base_price: number;
    is_featured: boolean;
    created_at: string;
    product_variants: ProductVariant[];
    product_images: ProductImage[];
}

export interface ProductVariant {
    id: string;
    product_id: string;
    color_name: string;
    sku: string;
    stock_quantity: number;
    price_modifier: number;
}

export interface ProductImage {
    id: string;
    product_id: string;
    url: string;
    display_order: number;
    is_primary: boolean;
    product_variant_id?: string | null;
}
