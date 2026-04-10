'use client';

import { useState, useRef, useEffect } from 'react';

export default function FAQSyncUpgrade() {
    const [status, setStatus] = useState({ trips: 'waiting', dests: 'waiting', blog: 'waiting', faqs: 'waiting' });
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll log
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [log]);

    const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runBypassSync = async (table: string, data: any, conflictCol: string) => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const response = await fetch(`${url}/rest/v1/${table}?on_conflict=${conflictCol}`, {
            method: 'POST',
            headers: { 
                'apikey': key, 
                'Authorization': `Bearer ${key}`, 
                'Content-Type': 'application/json', 
                'Prefer': 'resolution=merge-duplicates' 
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const err = await response.text();
            if (err.includes('already exists')) return;
            throw new Error(`API ${response.status}: ${err}`);
        }
    };

    const startSync = async () => {
        setLoading(true);
        setLog([]);
        addLog('SYSTEM: Initializing Architect Data Recovery Protocol...');

        try {
            addLog('SYNC: Calibrating Bhutanese Expeditions (Trips)...');
            await runBypassSync('trips', [{ title: 'Bhutan Discovery', slug: 'discovery', duration_days: 8, duration_nights: 7, starting_price: 2400, level: 'Easy', image_url: 'bhutan/main4.webp', description: 'Group Adventure', is_active: true }], 'slug');
            setStatus(s => ({ ...s, trips: 'success' }));

            addLog('SYNC: Validating Geographic Valleys (Destinations)...');
            await runBypassSync('destinations', [{ name: 'Paro', title: 'Paro Valley', slug: 'paro', description: 'Historic home.', image_url: 'bhutan/13.webp', sort_order: 1 }], 'slug');
            setStatus(s => ({ ...s, dests: 'success' }));

            addLog('SYNC: Indexing Travel Narratives (Blog)...');
            await runBypassSync('blog_posts', [{ title: 'Five Quiet Valleys', slug: 'quiet-valleys', excerpt: 'Beyond main routes.', content: 'Bhutan story...', status: 'published', main_image: 'bhutan/main2.webp' }], 'slug');
            setStatus(s => ({ ...s, blog: 'success' }));

            addLog('SYNC: Aligning Wisdom Commons (FAQs)...');
            await runBypassSync('faqs', [
                { question: 'When is the best time to visit Bhutan?', answer: 'March to May and September to November offer clear skies and vibrant festivals.', category: 'Travel Planning' },
                { question: 'Is a visa required?', answer: 'Yes, all international travelers (except for certain neighbors) require a visa processed via a registered tour operator.', category: 'Entry Requirements' }
            ], 'question');
            setStatus(s => ({ ...s, faqs: 'success' }));

            addLog('SUCCESS: Full Architectural Sync Complete.');
        } catch (e: any) {
            addLog(`ERROR: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sync-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <div className="architect-badge">Architect Suite</div>
                    <h1 className="serif-title">Sync Manager</h1>
                    <p className="subtitle">Synchronize local cache with the Supabase master repository.</p>
                </div>
            </header>

            <div className="sync-dashboard">
                <div className="status-grid">
                    <div className={`status-card ${status.trips}`}>
                        <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
                        </div>
                        <div className="card-info">
                            <span className="label">Expeditions</span>
                            <span className="value">{status.trips === 'success' ? 'Synchronized' : 'Ready'}</span>
                        </div>
                        {status.trips === 'success' && <div className="dot"></div>}
                    </div>
                    
                    <div className={`status-card ${status.dests}`}>
                        <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                        </div>
                        <div className="card-info">
                            <span className="label">Geography</span>
                            <span className="value">{status.dests === 'success' ? 'Synchronized' : 'Ready'}</span>
                        </div>
                        {status.dests === 'success' && <div className="dot"></div>}
                    </div>

                    <div className={`status-card ${status.blog}`}>
                        <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>
                        </div>
                        <div className="card-info">
                            <span className="label">Narratives</span>
                            <span className="value">{status.blog === 'success' ? 'Synchronized' : 'Ready'}</span>
                        </div>
                        {status.blog === 'success' && <div className="dot"></div>}
                    </div>

                    <div className={`status-card ${status.faqs}`}>
                        <div className="card-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                        </div>
                        <div className="card-info">
                            <span className="label">Knowledge</span>
                            <span className="value">{status.faqs === 'success' ? 'Synchronized' : 'Ready'}</span>
                        </div>
                        {status.faqs === 'success' && <div className="dot"></div>}
                    </div>
                </div>

                <div className="console-wrapper">
                    <div className="console-header">
                        <div className="console-lights">
                            <span></span><span></span><span></span>
                        </div>
                        <span className="console-title">Architect.sys Diagnostics</span>
                    </div>
                    <div className="console-body" ref={logContainerRef}>
                        {log.map((line, i) => (
                            <div key={i} className="log-line">
                                <span className="caret">&gt;</span> {line}
                            </div>
                        ))}
                        {log.length === 0 && (
                            <div className="log-idle">System standing by for activation signal...</div>
                        )}
                        {loading && (
                            <div className="log-line blinking">
                                <span className="caret">&gt;</span> Processing packets...
                            </div>
                        )}
                    </div>
                </div>

                <div className="action-footer">
                    <button onClick={startSync} disabled={loading} className={`btn-sync ${loading ? 'syncing' : ''}`}>
                        {loading ? (
                            <>
                                <div className="spinner-small"></div>
                                Running Recovery...
                            </>
                        ) : (
                            <>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                Launch Full Architectural Sync
                            </>
                        )}
                    </button>
                    <p className="disclaimer">Note: This action uses resolution=merge-duplicates to prevent data collision.</p>
                </div>
            </div>

            <style jsx>{`
                .sync-admin-container {
                    padding: 40px 0;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .admin-page-header {
                    margin-bottom: 50px;
                    padding-bottom: 30px;
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
                    font-size: 36px;
                    margin: 0;
                    color: #1a1a1a;
                }
                .subtitle {
                    color: #888;
                    font-size: 16px;
                    margin-top: 5px;
                }
                @media (max-width: 768px) {
                    .serif-title { font-size: 28px; }
                    .admin-page-header { margin-bottom: 30px; }
                }

                .status-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                @media (max-width: 480px) {
                    .status-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                }
                .status-card {
                    background: white;
                    border: 1px solid #eee;
                    padding: 20px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    position: relative;
                    transition: all 0.3s ease;
                }
                .status-card.success {
                    border-color: #0d948844;
                    background: #f0fdfa;
                }
                .card-icon {
                    font-size: 24px;
                    width: 44px;
                    height: 44px;
                    background: #f8f8f8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                }
                .status-card.success .card-icon {
                    background: #ccfbf1;
                }
                .card-info {
                    display: flex;
                    flex-direction: column;
                }
                .label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                    color: #999;
                }
                .value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                }
                .dot {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 8px;
                    height: 8px;
                    background: #0d9488;
                    border-radius: 50%;
                    box-shadow: 0 0 10px rgba(13, 148, 136, 0.5);
                }

                .console-wrapper {
                    background: #111;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    margin-bottom: 40px;
                }
                .console-header {
                    background: #1a1a1a;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }
                .console-lights {
                    display: flex;
                    gap: 6px;
                    margin-right: 20px;
                }
                .console-lights span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }
                .console-lights span:nth-child(1) { background: #ff5f56; }
                .console-lights span:nth-child(2) { background: #ffbd2e; }
                .console-lights span:nth-child(3) { background: #27c93f; }
                .console-title {
                    color: #666;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .console-body {
                    padding: 25px;
                    height: 250px;
                    overflow-y: auto;
                    font-family: 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', monospace;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #d1d1d1;
                }
                .log-line { margin-bottom: 8px; }
                .caret { color: #0d9488; font-weight: bold; margin-right: 8px; }
                .log-idle { color: #444; font-style: italic; }
                .blinking { animation: blink 1s infinite; }
                @keyframes blink { 0% { opacity: 0.1; } 50% { opacity: 1; } 100% { opacity: 0.1; } }

                .action-footer {
                    text-align: center;
                }
                .btn-sync {
                    width: 100%;
                    max-width: 400px;
                    background: #111;
                    color: white;
                    border: none;
                    padding: 18px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 15px;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin: 0 auto 20px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                @media (max-width: 640px) {
                    .console-body {
                        height: 350px;
                        font-size: 12px;
                        padding: 15px;
                    }
                    .btn-sync {
                        padding: 14px 20px;
                        font-size: 13px;
                    }
                }
                .btn-sync:hover:not(:disabled) {
                    background: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.2);
                }
                .btn-sync:active:not(:disabled) {
                    transform: translateY(0);
                }
                .btn-sync:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    background: #444;
                }
                .disclaimer {
                    font-size: 12px;
                    color: #aaa;
                }
                .spinner-small {
                    width: 18px;
                    height: 18px;
                    border: 2px solid rgba(255,255,255,0.2);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s infinite linear;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
