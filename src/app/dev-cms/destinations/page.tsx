'use client';

import { useState, useEffect } from 'react';

export default function InfraredDestinationsManager() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        try {
            // FIX: Using Infrared Raw-Fetch to bypass RLS 'blindness'
            const res = await fetch(`${url}/rest/v1/destinations?select=*&order=sort_order.asc`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setDestinations(data);
            }
        } catch (e) {
            console.error('Fetch Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase' }}>Destinations</h1>
                    <p style={{ color: '#888' }}>Manage valleys and points of interest across Bhutan.</p>
                </div>
                <button style={{ padding: '12px 25px', background: '#111', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + ADD DESTINATION
                </button>
            </div>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left' }}>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Name & Slug</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Order</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((dest) => (
                            <tr key={dest.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#eee', backgroundImage: `url(/assets/${dest.image_url})`, backgroundSize: 'cover' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{dest.name}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{dest.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', fontSize: '13px' }}>{dest.sort_order}</td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        {destinations.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} style={{ padding: '80px', textAlign: 'center', color: '#ccc' }}>No destinations found. Check your sync tool!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
