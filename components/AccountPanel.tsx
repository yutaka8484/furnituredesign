import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useDesignsStore } from '../store/useDesignsStore';
import { useCartStore } from '../store/useCartStore';
import type { SavedDesign } from '../types';

const AccountPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { user, logout } = useAuthStore();
    const { designs, fetchDesigns, deleteDesign, loadDesign, isLoading } = useDesignsStore();
    const clearCart = useCartStore(state => state.clearCart);

    useEffect(() => {
        fetchDesigns();
    }, [fetchDesigns]);

    const handleLogout = () => {
        logout();
        clearCart(); // Also clear cart on logout
        onClose();
    };

    const handleLoadDesign = (design: SavedDesign) => {
        loadDesign(design);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-40" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-md h-full shadow-xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">アカウント</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                </div>
                <div className="p-4 border-b">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm text-slate-500">{user?.email}</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <h3 className="font-semibold mb-2 text-slate-700">保存したデザイン</h3>
                    {isLoading && <p>読み込み中...</p>}
                    {!isLoading && designs.length === 0 && <p className="text-sm text-slate-500">保存されたデザインはありません。</p>}
                    <div className="space-y-2">
                        {designs.map(design => (
                            <div key={design.id} className="border rounded-md p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{design.name}</p>
                                    <p className="text-xs text-slate-400">{new Date(design.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                     <button onClick={() => handleLoadDesign(design)} className="px-2 py-1 text-xs font-medium rounded-md bg-slate-200 hover:bg-slate-300">読込</button>
                                     <button onClick={() => deleteDesign(design.id)} className="px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-600 hover:bg-red-200">&times;</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t mt-auto">
                    <button onClick={handleLogout} className="w-full py-2 bg-slate-600 text-white font-bold rounded-md hover:bg-slate-700 transition-colors">
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPanel;
