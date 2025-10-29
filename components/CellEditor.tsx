import React from 'react';
import { useConfigStore } from '../store/useConfigStore';
import type { Cell } from '../types';

interface CellEditorProps {
    row: number;
    col: number;
    onClose: () => void;
}

const CellEditor: React.FC<CellEditorProps> = ({ row, col, onClose }) => {
    const updateCellType = useConfigStore(state => state.updateCellType);

    const handleSelect = (type: Cell['type']) => {
        updateCellType(row, col, type);
        onClose();
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl p-2 flex flex-col gap-1 w-32"
             onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling up to the canvas
        >
            <button
                onClick={() => handleSelect('empty')}
                className="text-left w-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
                空にする
            </button>
            <button
                onClick={() => handleSelect('door')}
                className="text-left w-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
                扉を追加
            </button>
            <button
                onClick={() => handleSelect('drawer')}
                className="text-left w-full px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
                引き出しを追加
            </button>
        </div>
    );
};

export default CellEditor;
