'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Enquiry {
    id: string;
    full_name: string;
    email: string;
    trip_id: string;
    travellers_count: number;
    arrival_date: string;
    message: string;
    status: string;
    created_at: string;
}

export default function DevEnquiryManager() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('enquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error:', error);
        else setEnquiries(data || []);
        setLoading(false);
    };

    const updateStatus = async (id: string, status: string) => {
        if (!supabase) return;
        const { error } = await supabase
            .from('enquiries')
            .update({ status })
            .eq('id', id);
        
        if (error) alert('Error: ' + error.message);
        else fetchEnquiries();
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <section>
            <h1 style={{ fontSize: '32px', marginBottom: '40px' }}>Booking Enquiries</h1>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#fcfaf7', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '20px', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Date</th>
                            <th style={{ padding: '20px', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Customer</th>
                            <th style={{ padding: '20px', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Trip</th>
                            <th style={{ padding: '20px', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Status</th>
                            <th style={{ padding: '20px', fontSize: '12px', textTransform: 'uppercase', color: '#888' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map((enq) => (
                            <tr key={enq.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '20px', fontSize: '14px' }}>{new Date(enq.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{enq.full_name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{enq.email}</div>
                                </td>
                                <td style={{ padding: '20px', fontSize: '14px' }}>{enq.trip_id}</td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        background: enq.status === 'New' ? '#fff9e6' : '#e6f7f7',
                                        color: enq.status === 'New' ? '#8b6e1b' : '#008080',
                                        fontWeight: 'bold'
                                    }}>
                                        {enq.status || 'New'}
                                    </span>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <select 
                                        onChange={(e) => updateStatus(enq.id, e.target.value)}
                                        value={enq.status || 'New'}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '12px' }}
                                    >
                                        <option value="New">Mark New</option>
                                        <option value="InProgress">In Progress</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {enquiries.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No enquiries found.</div>}
            </div>
        </section>
    );
}
