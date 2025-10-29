import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { ConfigSection, ControlWrapper } from './ConfigShared';

const DimensionInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}> = ({ label, value, min, max, step, onChange }) => (
    <ControlWrapper label={label}>
        <div className="flex items-center gap-4">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-700 w-20 text-right">{value} mm</span>
        </div>
    </ControlWrapper>
);


const DimensionControls: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const updateSpec = useConfigStore(state => state.updateSpec);
    const { dimensionLimits } = useConfigStore(state => state.settings);

    return (
        <ConfigSection title="サイズ">
            <DimensionInput
                label="幅"
                value={spec.width}
                min={dimensionLimits.width.min}
                max={dimensionLimits.width.max}
                step={dimensionLimits.width.step}
                onChange={(width) => updateSpec({ width })}
            />
            <DimensionInput
                label="高さ"
                value={spec.height}
                min={dimensionLimits.height.min}
                max={dimensionLimits.height.max}
                step={dimensionLimits.height.step}
                onChange={(height) => updateSpec({ height })}
            />
            <DimensionInput
                label="奥行"
                value={spec.depth}
                min={dimensionLimits.depth.min}
                max={dimensionLimits.depth.max}
                step={dimensionLimits.depth.step}
                onChange={(depth) => updateSpec({ depth })}
            />
        </ConfigSection>
    );
};

export default DimensionControls;
