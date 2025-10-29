import React, { useState } from 'react';
import { useConfigStore } from '../store/useConfigStore';

// Simple SVG Icon components to avoid adding dependencies
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);


const ShareButton: React.FC = () => {
    const spec = useConfigStore(state => state.spec);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        try {
            const specString = JSON.stringify(spec);
            const compressed = btoa(specString); // simple base64 encoding
            const url = `${window.location.origin}${window.location.pathname}?config=${compressed}`;
            
            navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } catch (error) {
            console.error("Failed to create share link:", error);
            alert("共有リンクの作成に失敗しました。");
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
        >
            {copied ? <CheckIcon /> : <ShareIcon />}
            {copied ? 'コピーしました！' : '共有'}
        </button>
    );
};

export default ShareButton;
