'use client';

import { useState } from 'react';

export default function FAQSyncUpgrade() {
    const [status, setStatus] = useState({ trips: 'waiting', dests: 'waiting', blog: 'waiting', faqs: 'waiting' });
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState<string[]>([]);

    const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const runBypassSync = async (table: string, data: any, conflictCol: string) => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const response = await fetch(`${url}/rest/v1/${table}?on_conflict=${conflictCol}`, {
            method: 'POST',
            headers: { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
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
        addLog('Launching Full Recovery Suite...');

        try {
            addLog('🏔️ Syncing Trips...');
            await runBypassSync('trips', [{ title: 'Bhutan Discovery', slug: 'discovery', duration_days: 8, duration_nights: 7, starting_price: 2400, level: 'Easy', image_url: 'bhutan/main4.webp', description: 'Group Adventure', is_active: true }], 'slug');
            setStatus(s => ({ ...s, trips: 'success' }));

            addLog('🌏 Syncing Valleys...');
            await runBypassSync('destinations', [{ name: 'Paro', title: 'Paro Valley', slug: 'paro', description: 'Historic home.', image_url: 'bhutan/13.webp', sort_order: 1 }], 'slug');
            setStatus(s => ({ ...s, dests: 'success' }));

            addLog('✍️ Syncing Blog...');
            await runBypassSync('blog_posts', [{ title: 'Five Quiet Valleys', slug: 'quiet-valleys', excerpt: 'Beyond main routes.', content: 'Bhutan story...', status: 'published', main_image: 'bhutan/main2.webp' }], 'slug');
            setStatus(s => ({ ...s, blog: 'success' }));

            // NEW: FAQ DATA Recovery
            addLog('📋 Syncing help center FAQs...');
            await runBypassSync('faqs', [
                { question: 'When is the best time to visit Bhutan?', answer: 'March to May and September to November offer clear skies and vibrant festivals.', category: 'Travel Planning' },
                { question: 'Is a visa required?', answer: 'Yes, all international travelers (except for certain neighbors) require a visa processed via a registered tour operator.', category: 'Entry Requirements' }
            ], 'question');
            setStatus(s => ({ ...s, faqs: 'success' }));

            addLog('🎉 FULL ARCHITECTURAL SYNC COMPLETE!');
        } catch (e: any) {
            addLog(`❌ SYNC FAILED: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '80px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px' }}>Sync Manager</h1>
            <p style={{ color: '#888', marginBottom: '50px' }}>Final architectural content recovery calibrated for all tables.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', background: status.trips === 'success' ? '#e6fffa' : '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>✅ TRIPS</div>
                <div style={{ padding: '20px', background: status.dests === 'success' ? '#e6fffa' : '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>✅ VALLEYS</div>
                <div style={{ padding: '20px', background: status.blog === 'success' ? '#e6fffa' : '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>✅ BLOG</div>
                <div style={{ padding: '20px', background: status.faqs === 'success' ? '#e6fffa' : '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>{status.faqs === 'success' ? '✅ FAQ' : '📋 FAQ'}</div>
            </div>

            <div style={{ background: '#111', color: '#00ff00', padding: '30px', borderRadius: '16px', fontFamily: 'monospace', fontSize: '12px', height: '180px', overflowY: 'auto', marginBottom: '40px', textAlign: 'left' }}>
                {log.map((line, i) => <div key={i} style={{ marginBottom: '5px' }}>{line}</div>)}
                {log.length === 0 && <div style={{ color: '#444' }}>Waiting for System Activation...</div>}
            </div>

            <button onClick={startSync} disabled={loading} style={{ width: '100%', padding: '20px', background: '#111', color: 'white', border: 'none', borderRadius: '40px', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'RECOVERING...' : '🚀 START FULL ARCHITECTURAL SYNC'}
            </button>
        </div>
    );
}
