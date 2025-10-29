// Fix: Removed file marker comments that were causing parsing errors.
import React from 'react';

// --- Base Types ---
export type Finish = 'natural_oak' | 'walnut' | 'white_laminate';
export type BoardThickness = 't18' | 't21' | 't25';
export type BaseType = 'none' | 'plinth50' | 'leg100' | 'caster';
export type BackPanel = 'off' | 'on';

export interface Cell {
    type: 'empty' | 'door' | 'drawer';
}

// --- Main Specification ---
export interface Specification {
    width: number;
    height: number;
    depth: number;
    finish: Finish;
    boardThickness: BoardThickness;
    base: BaseType;
    backPanel: BackPanel;
    // Fix: Replace simple grid with ratios for variable cell sizes
    columnRatios: number[];
    rowRatios: number[];
    cells: Cell[][]; // 2D array representing the grid content
}

// --- Pricing ---
export interface PriceBreakdown {
    base: number;
    materials: number;
    hardware: number;
    options: number;
    total: number;
}

// --- App Settings ---
export interface DimensionLimit {
    min: number;
    max: number;
    step: number;
}
export interface ColumnRowLimit {
    min: number;
    max: number;
}
export interface Settings {
    dimensionLimits: {
        width: DimensionLimit;
        height: DimensionLimit;
        depth: DimensionLimit;
        columns: ColumnRowLimit;
        rows: ColumnRowLimit;
    };
    availableOptions: {
        finishes: readonly Finish[];
        boardThicknesses: readonly BoardThickness[];
        bases: readonly BaseType[];
        backPanels: readonly BackPanel[];
    };
}


// --- User & Data ---
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface CartItem {
    id: string;
    userId: string;
    spec: Specification;
    quantity: number;
    price: number;
    createdAt: string;
}

export interface SavedDesign {
    id: string;
    userId: string;
    name: string;
    spec: Specification;
    createdAt: string;
}

// --- Component-specific types ---
export interface ARExporterHandle {
    exportToGLB: () => Promise<Blob>;
}


// --- For custom elements like <model-viewer> ---
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Fix: Use a more robust type definition for the custom element.
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
                src?: string;
                ar?: boolean;
                'ar-modes'?: string;
                'camera-controls'?: boolean;
                'shadow-intensity'?: string;
                'auto-rotate'?: boolean;
            }, HTMLElement>;
        }
    }
}
