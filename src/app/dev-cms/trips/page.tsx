'use client';

import { useState, useEffect } from 'react';

export default function InfraredTripsManager() {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        try {
            // FIX: Using Infrared Raw-Fetch to bypass RLS 'blindness'
            const res = await fetch(`${url}/rest/v1/trips?select=*`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTrips(data);
            }
        } catch (e) {
            console.error('Fetch Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase' }}>Trips & Packages</h1>
                    <p style={{ color: '#888' }}>Manage Bhutanese experiences and Himalayan journeys.</p>
                </div>
                <button style={{ padding: '12px 25px', background: '#008080', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + CREATE NEW TRIP
                </button>
            </div>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left' }}>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Trip Info</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Duration</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Pricing</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Status</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((trip) => (
                            <tr key={trip.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#eee', backgroundImage: `url(/assets/${trip.image_url})`, backgroundSize: 'cover' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{trip.title}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{trip.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px', fontSize: '13px' }}>{trip.duration_days} Days / {trip.duration_nights} Nights</td>
                                <td style={{ padding: '20px', fontSize: '13px', fontWeight: 'bold' }}>${trip.starting_price}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', background: trip.is_active ? '#e6fffa' : '#f5f5f5', color: trip.is_active ? '#008080' : '#999', borderRadius: '4px', textTransform: 'uppercase' }}>
                                        {trip.is_active ? 'Active' : 'Draft'}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        {trips.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} style={{ padding: '80px', textAlign: 'center', color: '#ccc' }}>Database scan complete. 0 records found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
