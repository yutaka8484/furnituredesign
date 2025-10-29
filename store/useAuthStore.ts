import { create } from 'zustand';
import type { User } from '../types';
import * as api from '../services/apiService';

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    
    login: (email: string, pass: string) => Promise<boolean>;
    register: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isLoggedIn: !!sessionStorage.getItem('api_userId'), // Basic check on init
    isLoading: false,
    error: null,
    
    login: async (email, pass) => {
        set({ isLoading: true, error: null });
        try {
            const user = await api.loginUser(email, pass);
            set({ user, isLoggedIn: true, isLoading: false });
            return true;
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            return false;
        }
    },
    
    register: async (name, email, pass) => {
        set({ isLoading: true, error: null });
        try {
            const user = await api.registerUser(name, email, pass);
            set({ user, isLoggedIn: true, isLoading: false });
            return true;
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
            return false;
        }
    },
    
    logout: () => {
        api.logoutUser();
        set({ user: null, isLoggedIn: false });
    },
    
    checkAuthStatus: () => {
        // In this mock setup, we just check sessionStorage.
        // A real app would validate a token and fetch user data.
        if (!get().isLoggedIn) {
           set({ user: null });
        }
    },
}));
