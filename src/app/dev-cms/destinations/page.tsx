'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Destination {
    id: string;
    name: string;
    slug: string;
    description: string;
    image_url: string;
    is_active: boolean;
}

export default function DevDestinationManager() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDest, setCurrentDest] = useState<Partial<Destination>>({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .order('name', { ascending: true });

        if (error) console.error('Error fetching destinations:', error);
        else setDestinations(data || []);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const destData = {
            ...currentDest,
            slug: currentDest.slug || currentDest.name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        };

        if (!supabase) return;
        let result;
        if (currentDest.id) {
            result = await supabase.from('destinations').update(destData).eq('id', currentDest.id);
        } else {
            result = await supabase.from('destinations').insert([destData]);
        }

        if (result.error) alert('Error: ' + result.error.message);
        else { setIsEditing(false); fetchData(); }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Are you sure?')) {
            const { error } = await supabase.from('destinations').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else fetchData();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '28px', color: '#0f2742' }}>Destination Manager (Dev)</h1>
                {!isEditing && (
                    <button 
                        onClick={() => { setCurrentDest({ name: '', slug: '', description: '', is_active: true }); setIsEditing(true); }}
                        style={{ padding: '12px 25px', background: '#008080', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        + Add Valley
                    </button>
                )}
            </div>

            {!isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {destinations.map(dest => (
                        <div key={dest.id} style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ marginBottom: '10px' }}>{dest.name}</h3>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', minHeight: '40px' }}>{dest.description?.substring(0, 80)}...</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => { setCurrentDest(dest); setIsEditing(true); }} style={{ flex: 1, padding: '8px', cursor: 'pointer' }}>Edit</button>
                                <button onClick={() => handleDelete(dest.id)} style={{ padding: '8px', color: 'red', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eee' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px' }}>
                        <input type="text" placeholder="Valley Name (e.g., Paro Valley)" value={currentDest.name} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} onChange={e => setCurrentDest({...currentDest, name: e.target.value})} required />
                        <textarea placeholder="Description" value={currentDest.description} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '100px' }} onChange={e => setCurrentDest({...currentDest, description: e.target.value})} />
                        <input type="text" placeholder="Image URL" value={currentDest.image_url} style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }} onChange={e => setCurrentDest({...currentDest, image_url: e.target.value})} />
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="submit" style={{ padding: '15px 30px', background: '#008080', color: 'white', border: 'none', borderRadius: '6px' }}>Save Destination</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '15px 30px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
