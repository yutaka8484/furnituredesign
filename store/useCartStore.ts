import { create } from 'zustand';
import type { CartItem, Specification } from '../types';
import * as api from '../services/apiService';

interface CartState {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    
    initializeCart: () => Promise<void>;
    addItem: (spec: Specification) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;

    totalPrice: number;
    totalItems: number;
}

const updateTotal = (items: CartItem[]) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return { totalPrice, totalItems };
};

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    isLoading: false,
    error: null,
    totalPrice: 0,
    totalItems: 0,

    initializeCart: async () => {
        set({ isLoading: true });
        try {
            const items = await api.fetchCart();
            set({ items, isLoading: false, ...updateTotal(items) });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    addItem: async (spec) => {
        set({ isLoading: true });
        try {
            const updatedItems = await api.addToCart(spec);
            set({ items: updatedItems, isLoading: false, ...updateTotal(updatedItems) });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
    
    removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
            const updatedItems = await api.removeFromCart(itemId);
            set({ items: updatedItems, isLoading: false, ...updateTotal(updatedItems) });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateQuantity: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
            const updatedItems = await api.updateCartItemQuantity(itemId, quantity);
            set({ items: updatedItems, isLoading: false, ...updateTotal(updatedItems) });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
    
    clearCart: async () => {
        set({ isLoading: true });
         try {
            const updatedItems = await api.clearUserCart();
            set({ items: updatedItems, isLoading: false, ...updateTotal(updatedItems) });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },
}));