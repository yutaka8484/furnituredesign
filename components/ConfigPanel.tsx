// Fix: Moved this file to the correct components/ directory and updated internal import paths.
import React from 'react';
import DimensionControls from './DimensionControls';
import MaterialControls from './MaterialControls';
import BaseControls from './BaseControls';
import GridControls from './GridControls';
import PriceBox from './PriceBox';
import ShareButton from './ShareButton';
import { useAuthStore } from '../store/useAuthStore';

const ARIcon = () => (
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8V4H8" />
    <path d="M20 8h-4V4" />
    <path d="M20 16v4h-4" />
    <path d="M12 16v4h4" />
    <path d="M4 8H8v4" />
    <path d="M4 16H8v-4" />
</svg>
);


const ConfigPanel: React.FC<{onARClick: () => void; isExporting: boolean; onSaveDesignClick: () => void;}> = ({ onARClick, isExporting, onSaveDesignClick }) => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    
    return (
        <div className="p-6 h-full flex flex-col bg-white">
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-800">仕様を選択</h2>
                 <button 
                    onClick={onARClick}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    <ARIcon/>
                    {isExporting ? '生成中...' : 'ARで見る'}
                 </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <DimensionControls />
                <GridControls />
                <MaterialControls />
                <BaseControls />
            </div>
            <div className="pt-6 border-t mt-auto">
                 <div className="flex justify-between mb-4">
                    <ShareButton />
                    {isLoggedIn && (
                        <button onClick={onSaveDesignClick} className="px-4 py-2 text-sm font-medium rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300">
                           デザインを保存
                        </button>
                    )}
                </div>
                <PriceBox />
            </div>
        </div>
    );
};

export default ConfigPanel;