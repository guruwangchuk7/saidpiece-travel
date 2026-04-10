'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Setting {
    key: string;
    value: string;
    description?: string;
}

export default function SettingsManager() {
    const { isStaff } = useAuth();
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'branding' | 'home' | 'story' | 'social'>('branding');

    const fetchSettings = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*');
        if (data && data.length > 0) {
            setSettings(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isStaff) {
            fetchSettings();
        }
    }, [isStaff]);

    const handleUpdate = async (key: string, value: string) => {
        if (!supabase) return;
        setUpdating(key);
        try {
            await supabase.from('site_settings').update({ value }).eq('key', key);
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
        } catch (e) {
            console.error('Update failed:', e);
        }
        setUpdating(null);
    };

    const getSetting = (key: string) => settings.find(s => s.key === key);

    const renderSetting = (key: string, label: string, isTextarea = false) => {
        const setting = getSetting(key);
        if (!setting) return null;

        return (
            <div className="setting-wrapper">
                <div className="setting-header">
                    <label className="setting-label">{label}</label>
                    {updating === key && <span className="sync-status">Syncing...</span>}
                </div>
                {isTextarea ? (
                    <textarea
                        defaultValue={setting.value}
                        onBlur={(e) => handleUpdate(key, e.target.value)}
                        rows={4}
                    />
                ) : (
                    <input
                        type="text"
                        defaultValue={setting.value}
                        onBlur={(e) => handleUpdate(key, e.target.value)}
                    />
                )}
                {setting.description && <p className="setting-desc">{setting.description}</p>}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Opening System Config...</p>
            </div>
        );
    }

    return (
        <div className="settings-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Site Settings</h1>
                    <p className="subtitle">Configure global variables and core brand identifiers.</p>
                </div>
            </header>

            <div className="settings-layout">
                <aside className="settings-nav">
                    <button className={activeTab === 'branding' ? 'active' : ''} onClick={() => setActiveTab('branding')}>Global Branding</button>
                    <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>Home Experience</button>
                    <button className={activeTab === 'story' ? 'active' : ''} onClick={() => setActiveTab('story')}>Brand Story</button>
                    <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>Social & Connectivity</button>
                </aside>

                <main className="settings-content">
                    {activeTab === 'branding' && (
                        <div className="setting-section">
                            <h4>Branding & Identity</h4>
                            {renderSetting('site_name', 'Trading Name')}
                            {renderSetting('contact_email', 'Administrative Email')}
                            {renderSetting('footer_address', 'Physical Origin')}
                        </div>
                    )}

                    {activeTab === 'home' && (
                        <div className="setting-section">
                            <h4>Homepage Narrative</h4>
                            {renderSetting('hero_title', 'Hero Headline')}
                            {renderSetting('hero_sub_title', 'Hero Sub-Headline')}
                            {renderSetting('intro_title', 'Introductory Hook')}
                        </div>
                    )}

                    {activeTab === 'story' && (
                        <div className="setting-section">
                            <h4>The Saidpiece Narrative</h4>
                            {renderSetting('story_quote', 'Signature Brand Quote', true)}
                            {renderSetting('story_body_1', 'Opening Narrative Paragraph', true)}
                            {renderSetting('story_body_2', 'Secondary Origin Story', true)}
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="setting-section">
                            <h4>Connectivity</h4>
                            {renderSetting('instagram_url', 'Instagram Profile URL')}
                            {renderSetting('facebook_url', 'Facebook Page URL')}
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .settings-admin-container {
                    padding: 40px 0;
                    width: 100%;
                }
                .admin-page-header h1 {
                    font-size: 38px;
                    margin: 0;
                    line-height: 1.1;
                    font-weight: 800;
                }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 70px;
                    padding-bottom: 40px;
                    border-bottom: 1px solid #f0f0f0;
                }
                .subtitle {
                    color: #888;
                    font-size: 16px;
                    margin-top: 10px;
                }

                .settings-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 100px;
                    align-items: start;
                }

                .settings-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: sticky;
                    top: 40px;
                }
                .settings-nav button {
                    text-align: left;
                    padding: 16px 24px;
                    background: none;
                    border: 1px solid transparent;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #999;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .settings-nav button:hover {
                    color: #111;
                    background: #fdfcf9;
                }
                .settings-nav button.active {
                    background: #111;
                    color: white;
                    border-color: #111;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.12);
                    transform: translateX(5px);
                }

                .settings-content {
                    max-width: 900px;
                    width: 100%;
                }
                .setting-section h4 {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    font-weight: 900;
                    color: #d4c8b0;
                    margin-bottom: 50px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .setting-section h4::after {
                    content: '';
                    height: 1px;
                    flex-grow: 1;
                    background: #f5f2eb;
                }

                .setting-wrapper {
                    margin-bottom: 60px;
                    position: relative;
                    width: 100%;
                }
                .setting-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    align-items: baseline;
                }
                .setting-label {
                    font-size: 16px;
                    font-weight: 800;
                    color: #111;
                    letter-spacing: 0.5px;
                }
                .sync-status {
                    font-size: 11px;
                    font-weight: 900;
                    color: #008080;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    animation: pulse 1.5s infinite;
                }

                .setting-wrapper input[type="text"], 
                .setting-wrapper textarea {
                    display: block !important;
                    width: 100% !important;
                    min-width: 600px !important;
                    padding: 22px 28px !important;
                    border-radius: 12px !important;
                    border: 2px solid #f0f0f0 !important;
                    background: #fbfbfb !important;
                    font-family: inherit !important;
                    font-size: 18px !important;
                    color: #111 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    box-sizing: border-box !important;
                }
                .setting-wrapper textarea {
                    min-height: 180px;
                    line-height: 1.7;
                    resize: vertical;
                }
                .setting-wrapper input:focus, .setting-wrapper textarea:focus {
                    outline: none !important;
                    background: white !important;
                    border-color: #d4c8b0 !important;
                    box-shadow: 0 15px 45px rgba(212, 200, 176, 0.2) !important;
                    transform: translateY(-3px) !important;
                }
                .setting-desc {
                    font-size: 13px;
                    color: #999;
                    margin-top: 15px;
                    font-style: italic;
                    line-height: 1.7;
                    max-width: 600px;
                }

                .admin-loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px;
                    color: #888;
                }
                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 2px solid rgba(0,0,0,0.05);
                    border-top-color: #d4c8b0;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
