import React, { useState } from 'react';
import { useDesignsStore } from '../store/useDesignsStore';
import { useConfigStore } from '../store/useConfigStore';

const SaveDesignModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { saveDesign, isLoading, error } = useDesignsStore();
    const spec = useConfigStore(state => state.spec);
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await saveDesign(name, spec);
        // Only close if there was no error during save
        if (!useDesignsStore.getState().error) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">デザインを保存</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="design-name">デザイン名</label>
                        <input
                            id="design-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            placeholder="例：リビングの新しい棚"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        disabled={isLoading || !name.trim()}
                    >
                        {isLoading ? '保存中...' : '保存'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SaveDesignModal;
