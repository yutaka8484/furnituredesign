import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

interface HeaderProps {
    onLoginClick: () => void;
    onCartClick: () => void;
    onAccountClick: () => void;
}

const CartIcon: React.FC<{count: number}> = ({count}) => (
    <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        {count > 0 && <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{count}</span>}
    </div>
);

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onLoginClick, onCartClick, onAccountClick }) => {
    const { isLoggedIn } = useAuthStore();
    const { totalItems } = useCartStore();

    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md z-10">
            <h1 className="text-2xl font-bold text-slate-800">
                <a href="/">Custom Furniture Configurator</a>
            </h1>
            <nav className="flex items-center gap-6">
                {isLoggedIn ? (
                    <>
                        <button onClick={onAccountClick} className="text-slate-600 hover:text-slate-900" title="Account"><UserIcon /></button>
                        <button onClick={onCartClick} className="text-slate-600 hover:text-slate-900" title="Cart"><CartIcon count={totalItems} /></button>
                    </>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                    >
                        ログイン/登録
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
