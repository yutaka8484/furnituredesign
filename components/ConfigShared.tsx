import React from 'react';
import type { Finish } from '../types';
import type { FINISH_MATERIALS } from './materials';

// A section container with a title
export const ConfigSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// A wrapper for a single control with a label
export const ControlWrapper: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
        {children}
    </div>
);

// A group of selectable options (buttons)
interface OptionGroupProps<T extends string | number> {
    options: readonly T[];
    selectedValue: T;
    onChange: (value: T) => void;
    disabledOptions?: T[];
}

export function OptionGroup<T extends string | number>({ options, selectedValue, onChange, disabledOptions = [] }: OptionGroupProps<T>) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(option => {
                const isSelected = selectedValue === option;
                const isDisabled = disabledOptions.includes(option);
                const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors";
                const selectedClasses = "bg-orange-500 text-white";
                const unselectedClasses = "bg-slate-200 text-slate-700 hover:bg-slate-300";
                const disabledClasses = "bg-slate-100 text-slate-400 cursor-not-allowed";

                return (
                    <button
                        key={String(option)}
                        type="button"
                        onClick={() => !isDisabled && onChange(option)}
                        className={`${baseClasses} ${isDisabled ? disabledClasses : (isSelected ? selectedClasses : unselectedClasses)}`}
                        disabled={isDisabled}
                    >
                        {String(option)}
                    </button>
                );
            })}
        </div>
    );
}


// A group of selectable color swatches
interface ColorSwatchGroupProps {
    options: readonly Finish[];
    selectedValue: Finish;
    onChange: (value: Finish) => void;
    materialMap: typeof FINISH_MATERIALS;
}

export const ColorSwatchGroup: React.FC<ColorSwatchGroupProps> = ({ options, selectedValue, onChange, materialMap }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(option => {
                const isSelected = selectedValue === option;
                const material = materialMap[option];
                const color = material ? `#${material.color.getHexString()}` : '#ccc';

                return (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${isSelected ? 'border-orange-500 scale-110' : 'border-slate-300'}`}
                        style={{ backgroundColor: color }}
                        title={option}
                    >
                        {isSelected && <span className="text-white text-lg">&#10003;</span>}
                    </button>
                );
            })}
        </div>
    );
}