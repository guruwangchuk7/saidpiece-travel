'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DevCMSFAQ() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
            if (error) {
                if (error.code === '42P01') {
                    setError('The "faqs" table does not exist in your database yet. Please run the sync tool.');
                } else {
                    setError(error.message);
                }
            } else {
                setFaqs(data || []);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '38px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '10px' }}>Travel FAQs</h1>
                    <p style={{ color: '#888' }}>Manage help topics and common traveler questions.</p>
                </div>
                <button style={{ padding: '12px 25px', background: '#111', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + NEW FAQ
                </button>
            </div>

            {error && (
                <div style={{ padding: '30px', background: '#fff5f5', border: '1px solid #feb2b2', borderRadius: '12px', color: '#822727', marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '10px' }}>⚠️ System Notice</h3>
                    <p style={{ fontSize: '14px', marginBottom: '15px' }}>{error}</p>
                    {error.includes('does not exist') && (
                        <button onClick={() => window.location.href='/dev-cms/import'} style={{ padding: '8px 15px', background: '#822727', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                            Go to Sync Tool →
                        </button>
                    )}
                </div>
            )}

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left' }}>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Question</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Status</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqs.map((faq) => (
                            <tr key={faq.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{faq.question}</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>{faq.category || 'General'}</div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', background: '#e6fffa', color: '#008080', borderRadius: '4px', textTransform: 'uppercase' }}>Published</span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        {!loading && faqs.length === 0 && !error && (
                            <tr>
                                <td colSpan={3} style={{ padding: '60px', textAlign: 'center', color: '#ccc' }}>No FAQs found. Click "New FAQ" to start.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
