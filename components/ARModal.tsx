import React, { useEffect } from 'react';
// FIX: Add a type-only import to ensure the global JSX augmentations from types.ts are applied.
import type {} from '../types';

interface ARModalProps {
    modelUrl: string;
    onClose: () => void;
}

const ARModal: React.FC<ARModalProps> = ({ modelUrl, onClose }) => {
    useEffect(() => {
        const scriptId = 'model-viewer-script';
        // Prevent adding script if it already exists
        if (document.getElementById(scriptId)) {
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.type = 'module';
        script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
        document.head.appendChild(script);

        // Clean up script on component unmount
        return () => {
            const scriptElement = document.getElementById(scriptId);
            if (scriptElement && scriptElement.parentNode) {
                scriptElement.parentNode.removeChild(scriptElement);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col items-center gap-4 relative"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-2 right-4 text-slate-500 hover:text-slate-800 text-3xl leading-none">&times;</button>
                <h2 className="text-xl font-bold text-slate-800">ARで表示</h2>
                <p className="text-sm text-center text-slate-600">
                    AR対応デバイスで下の「AR」ボタンをクリックして、<br />
                    現実空間にモデルを配置します。
                </p>
                <div className="w-full aspect-square bg-slate-100 rounded-md">
                    {modelUrl && (
                        <model-viewer
                            src={modelUrl}
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            camera-controls
                            shadow-intensity="1"
                            auto-rotate
                            style={{ width: '100%', height: '100%' }}
                        ></model-viewer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ARModal;