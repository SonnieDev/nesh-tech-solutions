
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, ProductVariant } from '@/types';

export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => set((state) => {
                const existingItem = state.items.find(
                    (item) => item.variant.id === newItem.variant.id
                );
                if (existingItem) {
                    return {
                        items: state.items.map((item) =>
                            item.variant.id === newItem.variant.id
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    };
                }
                return { items: [...state.items, newItem] };
            }),
            removeItem: (variantId) => set((state) => ({
                items: state.items.filter((item) => item.variant.id !== variantId),
            })),
            updateQuantity: (variantId, quantity) => set((state) => ({
                items: state.items.map((item) =>
                    item.variant.id === variantId ? { ...item, quantity } : item
                ),
            })),
            clearCart: () => set({ items: [] }),
            getTotalPrice: () => {
                const state = get();
                return state.items.reduce((acc, item) => {
                    return acc + (item.product.base_price + (item.variant.price_modifier || 0)) * item.quantity;
                }, 0);
            },
            getTotalItems: () => {
                const state = get();
                return state.items.reduce((acc, item) => acc + item.quantity, 0);
            }
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
