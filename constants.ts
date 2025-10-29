// Fix: Removed type import to prevent circular dependency with types.ts
export const FINISH_OPTIONS = ['natural_oak', 'walnut', 'white_laminate'] as const;
export const BOARD_THICKNESS_OPTIONS = ['t18', 't21', 't25'] as const;
export const BASE_OPTIONS = ['none', 'plinth50', 'leg100', 'caster'] as const;
export const BACK_PANEL_OPTIONS = ['off', 'on'] as const;

// Fix: Removed explicit type to break circular dependency.
// The type is validated in the store where it's used.
export const DEFAULT_SETTINGS = {
    dimensionLimits: {
        width: { min: 400, max: 2400, step: 10 },
        height: { min: 400, max: 2400, step: 10 },
        depth: { min: 200, max: 800, step: 10 },
        columns: { min: 1, max: 6 },
        rows: { min: 1, max: 8 },
    },
    availableOptions: {
        finishes: FINISH_OPTIONS,
        boardThicknesses: BOARD_THICKNESS_OPTIONS,
        bases: BASE_OPTIONS,
        backPanels: BACK_PANEL_OPTIONS,
    },
};
