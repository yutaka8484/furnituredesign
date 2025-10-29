import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Viewer3D from './components/Viewer3D';
import ConfigPanel from './components/ConfigPanel';
import ARModal from './components/ARModal';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Cart from './components/Cart';
import AccountPanel from './components/AccountPanel';
import SaveDesignModal from './components/SaveDesignModal';
import { useConfigStore } from './store/useConfigStore';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { setLoadDesignFunction } from './store/useDesignsStore';
import type { ARExporterHandle, Specification } from './types';

function App() {
    const viewerRef = useRef<ARExporterHandle>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    
    // Modal states
    const [activeModal, setActiveModal] = useState<'login' | 'register' | 'save' | null>(null);
    const [isCartOpen, setCartOpen] = useState(false);
    const [isAccountPanelOpen, setAccountPanelOpen] = useState(false);

    const { loadSpec } = useConfigStore();
    const { isLoggedIn, checkAuthStatus } = useAuthStore();
    const { initializeCart } = useCartStore();

    // Effect to check auth status and initialize cart on app load
    useEffect(() => {
        checkAuthStatus();
        if (isLoggedIn) {
            initializeCart();
        }
    }, [isLoggedIn, checkAuthStatus, initializeCart]);

    // Effect to load spec from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        if (config) {
            try {
                const specString = atob(config);
                const spec = JSON.parse(specString);
                // Simple validation could be added here
                loadSpec(spec as Specification);
            } catch (error) {
                console.error("Failed to parse config from URL", error);
            }
        }
    }, [loadSpec]);
    
    // Effect to link the designs store to the config store
    useEffect(() => {
        setLoadDesignFunction(loadSpec);
    }, [loadSpec]);

    const handleARClick = async () => {
        if (!viewerRef.current) return;
        setIsExporting(true);
        try {
            const blob = await viewerRef.current.exportToGLB();
            const url = URL.createObjectURL(blob);
            setModelUrl(url);
        } catch (error) {
            console.error("Failed to export for AR:", error);
            alert("ARモデルの生成に失敗しました。");
        } finally {
            setIsExporting(false);
        }
    };

    const handleSaveDesignClick = () => {
        if (isLoggedIn) {
            setActiveModal('save');
        } else {
            alert("デザインを保存するにはログインが必要です。");
            setActiveModal('login');
        }
    };
    
    // Cleanup for the generated model URL
    useEffect(() => {
        return () => {
            if (modelUrl) {
                URL.revokeObjectURL(modelUrl);
            }
        };
    }, [modelUrl]);

    return (
        <div className="flex flex-col h-screen font-sans bg-slate-50">
            <Header
                onLoginClick={() => setActiveModal('login')}
                onCartClick={() => setCartOpen(true)}
                onAccountClick={() => setAccountPanelOpen(true)}
            />
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
                <div className="lg:col-span-2 bg-slate-200 rounded-lg overflow-hidden relative">
                    <Viewer3D ref={viewerRef} />
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <ConfigPanel
                        onARClick={handleARClick}
                        isExporting={isExporting}
                        onSaveDesignClick={handleSaveDesignClick}
                    />
                </div>
            </main>

            {/* Modals and Side Panels */}
            {modelUrl && <ARModal modelUrl={modelUrl} onClose={() => setModelUrl(null)} />}
            
            {activeModal === 'login' && <LoginModal onClose={() => setActiveModal(null)} onSwitchToRegister={() => setActiveModal('register')} />}
            {activeModal === 'register' && <RegisterModal onClose={() => setActiveModal(null)} onSwitchToLogin={() => setActiveModal('login')} />}
            {activeModal === 'save' && <SaveDesignModal onClose={() => setActiveModal(null)} />}
            
            {isCartOpen && <Cart onClose={() => setCartOpen(false)} />}
            {isAccountPanelOpen && isLoggedIn && <AccountPanel onClose={() => setAccountPanelOpen(false)} />}
        </div>
    );
}

export default App;
