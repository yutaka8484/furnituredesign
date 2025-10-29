import React, { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../constants';
import type { Settings } from '../types';

const AdminPanel: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [status, setStatus] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem('configurator_settings');
            if (stored) {
                setSettings(JSON.parse(stored));
            }
        } catch {
            // Use default settings if parsing fails
        }
    }, []);

    const handleSave = () => {
        try {
            localStorage.setItem('configurator_settings', JSON.stringify(settings, null, 2));
            setStatus('Settings saved! Refresh the page to apply them.');
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error(error);
            setStatus('Failed to save settings.');
        }
    };
    
    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        try {
            const newSettings = JSON.parse(e.target.value);
            setSettings(newSettings);
            setStatus('');
        } catch (error) {
            setStatus('Invalid JSON format.');
        }
    }

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem('configurator_settings');
        setStatus('Settings reset to default. Refresh the page.');
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Admin Settings</h2>
            <p className="text-sm text-slate-600 mb-4">
                This panel allows editing the application settings (e.g., dimension limits, available materials). Changes are saved to local storage.
                You must refresh the main application page for new settings to take effect.
            </p>
            <textarea
                className="w-full flex-1 p-2 font-mono text-sm border rounded-md bg-slate-50"
                value={JSON.stringify(settings, null, 2)}
                onChange={handleJsonChange}
                spellCheck="false"
            />
            {status && <p className="text-sm mt-2 text-center text-slate-600">{status}</p>}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                >
                    Save Settings
                </button>
                 <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-md hover:bg-slate-300"
                >
                    Reset to Default
                </button>
            </div>
        </div>
    );
};

export default AdminPanel;
