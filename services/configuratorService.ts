// Fix: Removed file marker comments that were causing parsing errors.
import type { Specification, PriceBreakdown } from '../types';

const getThickness = (thickness: string) => parseInt(thickness.replace('t', ''), 10);

// Pricing constants can be adjusted here
const PRICE_FACTORS = {
    BASE_RATE_PER_MM3: 0.000025, // Price per cubic millimeter for base volume
    DOOR_COST: 4500,
    DRAWER_COST: 7000,
    BASE_PLINTH_COST: 3000,
    BASE_LEG_COST: 4000,
    BASE_CASTER_COST: 5000,
    BACK_PANEL_COST_PER_M2: 2000,
    FINISH_MULTIPLIER: {
        natural_oak: 1.0,
        walnut: 1.3,
        white_laminate: 0.9,
    },
};

export const calculatePrice = (spec: Specification): PriceBreakdown => {
    const { width, height, depth, finish, cells, base, backPanel } = spec;

    // 1. Base price based on volume
    const totalVolume = width * height * depth;
    let basePrice = totalVolume * PRICE_FACTORS.BASE_RATE_PER_MM3;

    // 2. Material cost adjustment
    const materialMultiplier = PRICE_FACTORS.FINISH_MULTIPLIER[finish] || 1;
    const materials = (basePrice * materialMultiplier) - basePrice;

    // 3. Hardware cost (doors and drawers)
    const hardware = cells.flat().reduce((acc, cell) => {
        if (cell.type === 'door') return acc + PRICE_FACTORS.DOOR_COST;
        if (cell.type === 'drawer') return acc + PRICE_FACTORS.DRAWER_COST;
        return acc;
    }, 0);
    
    // 4. Options cost (base and back panel)
    let options = 0;
    if (base === 'plinth50') options += PRICE_FACTORS.BASE_PLINTH_COST;
    if (base === 'leg100') options += PRICE_FACTORS.BASE_LEG_COST;
    if (base === 'caster') options += PRICE_FACTORS.BASE_CASTER_COST;
    if (backPanel === 'on') {
        const backPanelAreaM2 = (width * height) / 1000000;
        options += backPanelAreaM2 * PRICE_FACTORS.BACK_PANEL_COST_PER_M2;
    }

    const total = basePrice + materials + hardware + options;

    return {
        base: Math.round(basePrice),
        materials: Math.round(materials),
        hardware: Math.round(hardware),
        options: Math.round(options),
        total: Math.round(total / 10) * 10, // Round to nearest 10
    };
};
