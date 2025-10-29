import type { User, Specification, CartItem, SavedDesign } from '../types';
import { calculatePrice } from './configuratorService';

// --- Utils ---
const MOCK_DELAY = 500;
const apiRequest = <T>(data: T): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), MOCK_DELAY));
};
const apiRequestWithError = <T>(message: string): Promise<T> => {
    return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), MOCK_DELAY));
}

// --- Local Storage Data ---
let users: User[] = JSON.parse(localStorage.getItem('api_users') || '[]');
let designs: SavedDesign[] = JSON.parse(localStorage.getItem('api_designs') || '[]');
let carts: CartItem[] = JSON.parse(localStorage.getItem('api_carts') || '[]');
let loggedInUserId: string | null = sessionStorage.getItem('api_userId');

const persist = () => {
    localStorage.setItem('api_users', JSON.stringify(users));
    localStorage.setItem('api_designs', JSON.stringify(designs));
    localStorage.setItem('api_carts', JSON.stringify(carts));
    if (loggedInUserId) {
        sessionStorage.setItem('api_userId', loggedInUserId);
    } else {
        sessionStorage.removeItem('api_userId');
    }
}

// --- Auth ---
export const loginUser = async (email: string, pass: string): Promise<User> => {
    const user = users.find(u => u.email === email);
    // Note: In a real app, password would be hashed and checked. Here we just check for existence.
    if (user) {
        loggedInUserId = user.id;
        persist();
        return apiRequest(user);
    }
    return apiRequestWithError('Invalid email or password.');
};

export const registerUser = async (name: string, email: string, pass: string): Promise<User> => {
    if (users.some(u => u.email === email)) {
        return apiRequestWithError('User with this email already exists.');
    }
    const newUser: User = { id: `user_${Date.now()}`, name, email };
    users.push(newUser);
    loggedInUserId = newUser.id;
    persist();
    return apiRequest(newUser);
};

export const logoutUser = (): void => {
    loggedInUserId = null;
    persist();
};


// --- Cart ---
export const fetchCart = async (): Promise<CartItem[]> => {
    if (!loggedInUserId) return apiRequest([]);
    const userCart = carts.filter(item => item.userId === loggedInUserId);
    return apiRequest(userCart);
};

export const addToCart = async (spec: Specification): Promise<CartItem[]> => {
    if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
    
    // Check if an identical item already exists
    const existingItem = carts.find(item => item.userId === loggedInUserId && JSON.stringify(item.spec) === JSON.stringify(spec));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const priceBreakdown = calculatePrice(spec);
        const newItem: CartItem = {
            id: `cart_${Date.now()}`,
            userId: loggedInUserId,
            spec,
            quantity: 1,
            price: priceBreakdown.total, // Use total from breakdown
            createdAt: new Date().toISOString()
        };
        carts.push(newItem);
    }
    
    persist();
    return fetchCart();
};

export const removeFromCart = async (itemId: string): Promise<CartItem[]> => {
    if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
    carts = carts.filter(item => !(item.id === itemId && item.userId === loggedInUserId));
    persist();
    return fetchCart();
};

export const updateCartItemQuantity = async (itemId: string, quantity: number): Promise<CartItem[]> => {
    if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
    const item = carts.find(i => i.id === itemId && i.userId === loggedInUserId);
    if (item) {
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
             carts = carts.filter(i => i.id !== itemId);
        }
    }
    persist();
    return fetchCart();
};

export const clearUserCart = async (): Promise<CartItem[]> => {
    if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
    carts = carts.filter(item => item.userId !== loggedInUserId);
    persist();
    return apiRequest([]);
};


// --- Designs ---
export const fetchDesigns = async (): Promise<SavedDesign[]> => {
    if (!loggedInUserId) return apiRequest([]);
    const userDesigns = designs.filter(d => d.userId === loggedInUserId);
    return apiRequest(userDesigns);
};

export const saveDesign = async (name: string, spec: Specification): Promise<SavedDesign[]> => {
    if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
    const newDesign: SavedDesign = {
        id: `design_${Date.now()}`,
        userId: loggedInUserId,
        name,
        spec,
        createdAt: new Date().toISOString()
    };
    designs.push(newDesign);
    persist();
    return fetchDesigns();
};

export const deleteDesign = async (designId: string): Promise<SavedDesign[]> => {
     if (!loggedInUserId) return apiRequestWithError('You must be logged in.');
     designs = designs.filter(d => !(d.id === designId && d.userId === loggedInUserId));
     persist();
     return fetchDesigns();
};
