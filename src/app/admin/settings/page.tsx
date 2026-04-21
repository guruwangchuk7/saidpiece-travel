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
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase.from('site_settings').select('*');
            if (error) throw error;
            if (data && data.length > 0) {
                setSettings(data);
            }
        } catch (e) {
            console.error('Failed to fetch settings:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isStaff) {
            fetchSettings();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const handleUpdate = async (key: string, value: string) => {
        if (!supabase) return;
        
        // Find existing value to compare
        const existing = settings.find(s => s.key === key);
        if (existing?.value === value) return;

        setUpdating(key);
        try {
            const { error } = await supabase.from('site_settings').update({ value }).eq('key', key);
            if (error) throw error;
            setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
        } catch (e) {
            console.error('Update failed:', e);
            alert('Settings sync failed: check connection');
        }
        setUpdating(null);
    };

    const getSetting = (key: string) => settings.find(s => s.key === key);

    const renderSetting = (key: string, label: string, isTextarea = false) => {
        const setting = getSetting(key);
        if (!setting) return (
            <div className="setting-wrapper placeholder">
                <label className="setting-label">{label}</label>
                <div className="skeleton-input"></div>
            </div>
        );

        return (
            <div className="setting-wrapper">
                <div className="setting-header">
                    <label className="setting-label">{label}</label>
                    {updating === key ? (
                        <span className="sync-status active">Synchronizing...</span>
                    ) : (
                        <span className="sync-status">Cloud Synced</span>
                    )}
                </div>
                <div className="input-group">
                    {isTextarea ? (
                        <textarea 
                            defaultValue={setting.value} 
                            onBlur={(e) => handleUpdate(key, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                        />
                    ) : (
                        <input 
                            type="text" 
                            defaultValue={setting.value} 
                            onBlur={(e) => handleUpdate(key, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                        />
                    )}
                    <div className="input-focus-border"></div>
                </div>
                {setting.description && <p className="setting-desc">{setting.description}</p>}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Decoding System Configuration...</p>
            </div>
        );
    }

    return (
        <div className="settings-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <div className="architect-badge">Architect Suite</div>
                    <h1 className="serif-title">Site Settings</h1>
                    <p className="subtitle">Configure global variables, core metadata, and brand identifiers.</p>
                </div>
            </header>

            <div className="settings-layout">
                <aside className="settings-sidebar">
                    <nav className="settings-nav">
                        <button className={activeTab === 'branding' ? 'active' : ''} onClick={() => setActiveTab('branding')}>
                            <span className="nav-dot"></span> Global Branding
                        </button>
                        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
                            <span className="nav-dot"></span> Home Experience
                        </button>
                        <button className={activeTab === 'story' ? 'active' : ''} onClick={() => setActiveTab('story')}>
                            <span className="nav-dot"></span> Brand Story
                        </button>
                        <button className={activeTab === 'social' ? 'active' : ''} onClick={() => setActiveTab('social')}>
                            <span className="nav-dot"></span> Social & Connectivity
                        </button>
                    </nav>

                    <div className="sidebar-info-box hide-mobile">
                        <h5>System Meta</h5>
                        <p>All changes are automatically synced to the Supabase master repository on field exit.</p>
                        <div className="meta-stats">
                            <div className="stat"><span>Table:</span> site_settings</div>
                            <div className="stat"><span>State:</span> Live</div>
                        </div>
                    </div>
                </aside>

                <main className="settings-content">
                    {activeTab === 'branding' && (
                        <div className="setting-section">
                            <h4>Branding & Identity</h4>
                            <div className="settings-grid">
                                {renderSetting('site_name', 'Trading Name')}
                                {renderSetting('contact_email', 'Administrative Email')}
                                {renderSetting('footer_address', 'Physical Origin')}
                            </div>
                        </div>
                    )}

                    {activeTab === 'home' && (
                        <div className="setting-section">
                            <h4>Homepage Narrative</h4>
                            <div className="settings-grid">
                                {renderSetting('hero_title', 'Hero Headline')}
                                {renderSetting('hero_sub_title', 'Hero Sub-Headline')}
                                {renderSetting('intro_title', 'Introductory Hook')}
                            </div>
                        </div>
                    )}

                    {activeTab === 'story' && (
                        <div className="setting-section">
                            <h4>The Saidpiece Narrative</h4>
                            <div className="settings-grid full-width">
                                {renderSetting('story_quote', 'Signature Brand Quote', true)}
                                {renderSetting('story_body_1', 'Opening Narrative Paragraph', true)}
                                {renderSetting('story_body_2', 'Secondary Origin Story', true)}
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="setting-section">
                            <h4>Connectivity</h4>
                            <div className="settings-grid">
                                {renderSetting('instagram_url', 'Instagram Profile URL')}
                                {renderSetting('facebook_url', 'Facebook Page URL')}
                                {renderSetting('whatsapp_number', 'WhatsApp Connectivity')}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .settings-admin-container {
                    padding: 40px 0;
                    width: 100%;
                }
                .admin-page-header {
                    margin-bottom: 70px;
                    padding-bottom: 40px;
                    border-bottom: 1px solid #eee;
                }
                .architect-badge {
                    display: inline-block;
                    background: #f0fdfa;
                    color: #0d9488;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    padding: 4px 10px;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    border: 1px solid #ccfbf1;
                }
                .serif-title {
                    font-family: var(--font-playfair), serif;
                    font-size: 42px;
                    margin: 0;
                    color: #1a1a1a;
                    font-weight: 700;
                }
                .subtitle {
                    color: #888;
                    font-size: 16px;
                    margin-top: 5px;
                }

                .settings-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 80px;
                    align-items: start;
                }

                .settings-sidebar {
                    position: sticky;
                    top: 40px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
                .settings-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .settings-nav button {
                    text-align: left;
                    padding: 16px 20px;
                    background: none;
                    border: 1px solid transparent;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 700;
                    color: #999;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .nav-dot {
                    width: 6px;
                    height: 6px;
                    background: transparent;
                    border-radius: 50%;
                    border: 1px solid #ccc;
                    flex-shrink: 0;
                }
                .settings-nav button:hover {
                    color: #111;
                    background: #fdfcf9;
                }
                .settings-nav button.active {
                    background: #111;
                    color: white;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .settings-nav button.active .nav-dot {
                    background: #d4c8b0;
                    border-color: #d4c8b0;
                    box-shadow: 0 0 8px #d4c8b0;
                }

                .sidebar-info-box {
                    padding: 24px;
                    background: #fdfcf9;
                    border: 1px solid #f5f2eb;
                    border-radius: 16px;
                }
                .sidebar-info-box h5 {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #b5a484;
                    margin-bottom: 15px;
                }
                .sidebar-info-box p {
                    font-size: 13px;
                    color: #888;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .meta-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .stat {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                }
                .stat span { font-weight: 700; color: #aaa; }

                .settings-content {
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

                .settings-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 40px;
                }
                .settings-grid.full-width {
                    grid-template-columns: 1fr;
                }

                .setting-wrapper {
                    margin-bottom: 20px;
                    position: relative;
                }
                .setting-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    align-items: baseline;
                }
                .setting-label {
                    font-size: 17px;
                    font-weight: 800;
                    color: #1a1a1a;
                    letter-spacing: -0.2px;
                }
                .sync-status {
                    font-size: 10px;
                    font-weight: 700;
                    color: #ccc;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .sync-status.active {
                    color: #008080;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }

                .input-group {
                    position: relative;
                }
                input[type="text"], 
                textarea {
                    display: block;
                    width: 100%;
                    padding: 24px 30px;
                    border-radius: 14px;
                    border: 1px solid #eee;
                    background: #fdfcf9;
                    font-family: inherit;
                    font-size: 20px;
                    font-weight: 500;
                    color: #1a1a1a;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-sizing: border-box;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                }
                textarea {
                    min-height: 140px;
                    line-height: 1.6;
                    resize: vertical;
                }
                input:focus, textarea:focus {
                    outline: none;
                    background: white;
                    border-color: #d4c8b055;
                    box-shadow: 0 10px 30px rgba(212, 200, 176, 0.1);
                    transform: translateY(-1px);
                }
                .input-focus-border {
                    position: absolute;
                    bottom: 0;
                    left: 20px;
                    right: 20px;
                    height: 2px;
                    background: #d4c8b0;
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                    opacity: 0.6;
                }
                input:focus + .input-focus-border, 
                textarea:focus + .input-focus-border {
                    transform: scaleX(1);
                }

                .setting-desc {
                    font-size: 12px;
                    color: #aaa;
                    margin-top: 12px;
                    font-style: italic;
                    line-height: 1.5;
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

                .skeleton-input {
                    height: 60px;
                    background: #fdfcf9;
                    border-radius: 12px;
                    animation: pulse 2s infinite;
                }

                @media (max-width: 1024px) {
                    .serif-title { font-size: 32px; }
                    .settings-layout {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }
                    .settings-sidebar {
                        position: static;
                    }
                    .settings-nav {
                        flex-direction: row;
                        overflow-x: auto;
                        padding-bottom: 10px;
                        -webkit-overflow-scrolling: touch;
                    }
                    .settings-nav button {
                        flex-shrink: 0;
                        white-space: nowrap;
                    }
                    .hide-mobile { display: none; }
                }

                @media (max-width: 768px) {
                    .admin-page-header { margin-bottom: 40px; padding-bottom: 25px; }
                    .settings-grid { grid-template-columns: 1fr; gap: 30px; }
                    input[type="text"], textarea { font-size: 18px; padding: 18px 24px; }
                }
            `}</style>
        </div>
    );
}
