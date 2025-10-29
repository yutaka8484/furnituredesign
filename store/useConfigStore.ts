
import { create } from 'zustand';
import { produce } from 'immer';
import type { Specification, Settings, Cell } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

// A sensible default specification for the initial state
const DEFAULT_SPECIFICATION: Specification = {
    width: 1200,
    height: 800,
    depth: 400,
    finish: 'natural_oak',
    boardThickness: 't18',
    base: 'none',
    backPanel: 'off',
    columnRatios: [1],
    rowRatios: [1],
    cells: [[{ type: 'empty' }]],
};

// Function to load settings from localStorage or use defaults
const loadSettings = (): Settings => {
    try {
        const storedSettings = localStorage.getItem('configurator_settings');
        if (storedSettings) {
            // Add some validation here if needed
            return JSON.parse(storedSettings) as Settings;
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    return DEFAULT_SETTINGS;
};

interface ConfigState {
    spec: Specification;
    settings: Settings;
}

interface ConfigActions {
    updateSpec: (newSpec: Partial<Specification>) => void;
    loadSpec: (specToLoad: Specification) => void;
    addColumn: () => void;
    removeColumn: () => void;
    addRow: () => void;
    removeRow: () => void;
    updateCellType: (row: number, col: number, type: Cell['type']) => void;
    reset: () => void;
}

export const useConfigStore = create<ConfigState & ConfigActions>((set, get) => ({
    spec: DEFAULT_SPECIFICATION,
    settings: loadSettings(),

    updateSpec: (newSpec) => {
        set(produce((state: ConfigState) => {
            Object.assign(state.spec, newSpec);
        }));
    },
    
    loadSpec: (specToLoad) => {
        set({ spec: specToLoad });
    },

    addColumn: () => {
        set(produce((state: ConfigState) => {
            const numCols = state.spec.columnRatios.length;
            if (numCols < get().settings.dimensionLimits.columns.max) {
                state.spec.columnRatios.push(1);
                state.spec.cells.forEach(row => row.push({ type: 'empty' }));
            }
        }));
    },
    
    removeColumn: () => {
         set(produce((state: ConfigState) => {
            const numCols = state.spec.columnRatios.length;
            if (numCols > get().settings.dimensionLimits.columns.min) {
                state.spec.columnRatios.pop();
                state.spec.cells.forEach(row => row.pop());
            }
        }));
    },

    addRow: () => {
        set(produce((state: ConfigState) => {
            const numRows = state.spec.rowRatios.length;
            const numCols = state.spec.columnRatios.length;
            if (numRows < get().settings.dimensionLimits.rows.max) {
                state.spec.rowRatios.push(1);
                state.spec.cells.push(Array(numCols).fill(0).map(() => ({ type: 'empty' })));
            }
        }));
    },
    
    removeRow: () => {
        set(produce((state: ConfigState) => {
            const numRows = state.spec.rowRatios.length;
             if (numRows > get().settings.dimensionLimits.rows.min) {
                state.spec.rowRatios.pop();
                state.spec.cells.pop();
            }
        }));
    },
    
    updateCellType: (row, col, type) => {
        set(produce((state: ConfigState) => {
            if (state.spec.cells[row] && state.spec.cells[row][col]) {
                state.spec.cells[row][col].type = type;
            }
        }));
    },

    reset: () => {
        set({ spec: DEFAULT_SPECIFICATION });
    }
}));
