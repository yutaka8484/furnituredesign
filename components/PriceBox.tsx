import React, { useState } from 'react';
import { useConfigStore } from '../store/useConfigStore';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { calculatePrice } from '../services/configuratorService';

const PriceBox: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const { addItem, isLoading } = useCartStore();
    const { isLoggedIn } = useAuthStore();
    const [isDetailsVisible, setDetailsVisible] = useState(false);
    
    const priceBreakdown = calculatePrice(spec);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert("カートに追加するにはログインしてください。");
            return;
        }
        addItem(spec);
    };

    return (
        <div className="bg-slate-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-slate-600">概算価格</span>
                <span className="text-2xl font-bold text-slate-800">¥{priceBreakdown.total.toLocaleString()}</span>
            </div>
            <div className="text-center mb-4">
                <button
                    onClick={() => setDetailsVisible(!isDetailsVisible)}
                    className="text-sm text-slate-500 hover:underline"
                >
                    {isDetailsVisible ? '詳細を隠す' : '詳細を表示'}
                </button>
            </div>
            
            {isDetailsVisible && (
                <div className="text-sm text-slate-600 space-y-1 mb-4 border-t pt-4">
                    <div className="flex justify-between"><span>基本料金:</span> <span>¥{priceBreakdown.base.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>材料費:</span> <span>¥{priceBreakdown.materials.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>金具 (扉/引出し):</span> <span>¥{priceBreakdown.hardware.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>オプション (ベース/背板):</span> <span>¥{priceBreakdown.options.toLocaleString()}</span></div>
                </div>
            )}

            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
                {isLoading ? '追加中...' : 'カートに追加'}
            </button>
             {!isLoggedIn && <p className="text-xs text-center text-slate-500 mt-2">カート機能を利用するにはログインが必要です。</p>}
        </div>
    );
};

export default PriceBox;
