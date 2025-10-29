import { create } from 'zustand';
import type { SavedDesign, Specification } from '../types';
import * as api from '../services/apiService';

interface DesignsState {
    designs: SavedDesign[];
    isLoading: boolean;
    error: string | null;

    fetchDesigns: () => Promise<void>;
    saveDesign: (name: string, spec: Specification) => Promise<void>;
    deleteDesign: (designId: string) => Promise<void>;
    loadDesign: (design: SavedDesign) => void;
}

// This function will be replaced by a direct call to the config store's setter
// in App.tsx to avoid circular dependencies.
let loadDesignIntoConfigurator: (spec: Specification) => void = () => {
    console.error("loadDesign function not implemented yet.");
};

export const setLoadDesignFunction = (fn: (spec: Specification) => void) => {
    loadDesignIntoConfigurator = fn;
}

export const useDesignsStore = create<DesignsState>((set) => ({
    designs: [],
    isLoading: false,
    error: null,

    fetchDesigns: async () => {
        set({ isLoading: true });
        try {
            const designs = await api.fetchDesigns();
            set({ designs, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    saveDesign: async (name, spec) => {
        set({ isLoading: true, error: null });
        try {
            const updatedDesigns = await api.saveDesign(name, spec);
            set({ designs: updatedDesigns, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    deleteDesign: async (designId) => {
        set({ isLoading: true });
        try {
            const updatedDesigns = await api.deleteDesign(designId);
            set({ designs: updatedDesigns, isLoading: false });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    loadDesign: (design) => {
       loadDesignIntoConfigurator(design.spec);
    },
}));
