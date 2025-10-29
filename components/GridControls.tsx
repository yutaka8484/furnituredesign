// Fix: Removed file marker comments that were causing parsing errors.
import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { ConfigSection, ControlWrapper } from './ConfigShared';

const AddRemoveControl: React.FC<{
    label: string;
    count: number;
    onAdd: () => void;
    onRemove: () => void;
    min: number;
    max: number;
}> = ({ label, count, onAdd, onRemove, min, max }) => (
    <ControlWrapper label={label}>
        <div className="flex items-center gap-4">
            <button onClick={onRemove} disabled={count <= min} className="px-4 py-2 text-lg font-bold rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50">-</button>
            <span className="text-center font-medium text-slate-700 w-8">{count}</span>
            <button onClick={onAdd} disabled={count >= max} className="px-4 py-2 text-lg font-bold rounded-md bg-slate-200 hover:bg-slate-300 disabled:opacity-50">+</button>
        </div>
    </ControlWrapper>
);


const GridControls: React.FC = () => {
    const { columnRatios, rowRatios } = useConfigStore(state => state.spec);
    const { addColumn, removeColumn, addRow, removeRow } = useConfigStore.getState();
    const { dimensionLimits } = useConfigStore(state => state.settings);

    return (
        <ConfigSection title="レイアウト">
            <div className="grid grid-cols-2 gap-4">
                <AddRemoveControl
                    label="列数"
                    count={columnRatios.length}
                    onAdd={addColumn}
                    onRemove={removeColumn}
                    min={dimensionLimits.columns.min}
                    max={dimensionLimits.columns.max}
                />
                <AddRemoveControl
                    label="行数"
                    count={rowRatios.length}
                    onAdd={addRow}
                    onRemove={removeRow}
                    min={dimensionLimits.rows.min}
                    max={dimensionLimits.rows.max}
                />
            </div>
        </ConfigSection>
    );
};

export default GridControls;
