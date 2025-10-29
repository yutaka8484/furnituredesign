import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const RegisterModal: React.FC<{ onClose: () => void; onSwitchToLogin: () => void; }> = ({ onClose, onSwitchToLogin }) => {
    const { register, isLoading, error } = useAuthStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await register(name, email, password);
        if (success) {
            onClose();
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">新規登録</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="name">氏名</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="email-reg">メールアドレス</label>
                        <input
                            id="email-reg"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor="password-reg">パスワード</label>
                        <input
                            id="password-reg"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full py-2 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        disabled={isLoading}
                    >
                        {isLoading ? '登録中...' : '登録して開始'}
                    </button>
                </form>
                <p className="text-center text-sm text-slate-500 mt-6">
                    すでにアカウントをお持ちですか？{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-orange-500 hover:underline">
                        ログイン
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterModal;