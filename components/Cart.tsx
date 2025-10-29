// Fix: Implement the Cart component to display and manage cart items.
import React from 'react';
import { useCartStore } from '../store/useCartStore';
import type { Specification } from '../types';

const Cart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { items, totalPrice, totalItems, isLoading, removeItem, updateQuantity } = useCartStore();

    const renderSpecSummary = (spec: Specification) => {
        return `${spec.width}x${spec.height}x${spec.depth}mm, ${spec.finish}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-40" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-md h-full shadow-xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">ショッピングカート ({totalItems})</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                </div>
                
                {isLoading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p>カートを読み込んでいます...</p>
                    </div>
                ) : !isLoading && items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-slate-500">カートは空です。</p>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex gap-4 border-b pb-4">
                                <div className="w-24 h-24 bg-slate-200 rounded-md flex-shrink-0"></div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">カスタム家具</h3>
                                    <p className="text-sm text-slate-500">{renderSpecSummary(item.spec)}</p>
                                    <p className="font-bold text-lg my-1">¥{(item.price * item.quantity).toLocaleString()}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border rounded-md">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1">-</button>
                                            <span className="px-3">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">+</button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:underline">削除</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.length > 0 && (
                     <div className="p-4 border-t mt-auto space-y-4">
                        <div className="flex justify-between font-bold text-xl">
                            <span>合計</span>
                            <span>¥{totalPrice.toLocaleString()}</span>
                        </div>
                        <button className="w-full py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600">
                            ご購入手続きへ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
