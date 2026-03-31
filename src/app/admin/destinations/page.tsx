'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Destination {
    id: string;
    name: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
    sort_order: number;
}

export default function DestinationManager() {
    const { isStaff } = useAuth();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDest, setCurrentDest] = useState<Partial<Destination>>({
        name: '',
        title: '',
        slug: '',
        description: '',
        image_url: '',
        sort_order: 0
    });

    useEffect(() => {
        if (isStaff) {
            fetchDestinations();
        }
    }, [isStaff]);

    const fetchDestinations = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching destinations:', error);
        } else {
            setDestinations(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const destData = {
            ...currentDest,
            slug: currentDest.slug || currentDest.name?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        };

        if (!supabase) return;
        if (currentDest.id) {
            await supabase.from('destinations').update(destData).eq('id', currentDest.id);
        } else {
            await supabase.from('destinations').insert([destData]);
        }

        setIsEditing(false);
        fetchDestinations();
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this destination?')) {
            await supabase.from('destinations').delete().eq('id', id);
            fetchDestinations();
        }
    };

    if (loading && !isEditing) return <div>Loading Destinations...</div>;

    return (
        <div className="destination-manager">
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 className="serif-title">Explore Bhutan Settings: Valleys & Destinations</h1>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => {
                        setCurrentDest({ name: '', title: '', slug: '', description: '', image_url: '', sort_order: 0 });
                        setIsEditing(true);
                    }}>
                        + Add Destination
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {destinations.map(dest => (
                        <div key={dest.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{dest.name}</h3>
                            <p style={{ color: '#666', fontSize: '13px' }}>{dest.title}</p>
                            <div style={{ marginTop: '15px', color: '#888', fontSize: '11px' }}>Order: {dest.sort_order}</div>
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                <button className="btn btn-outline small" onClick={() => { setCurrentDest(dest); setIsEditing(true); }}>Edit</button>
                                <button className="btn btn-outline danger small" onClick={() => handleDelete(dest.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {destinations.length === 0 && <p>No destinations found.</p>}
                </div>
            ) : (
                <div style={{ maxWidth: '600px', background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #d4c8b0' }}>
                    <h2>{currentDest.id ? 'Edit' : 'Add'} Destination</h2>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '20px', marginTop: '30px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Short Name (e.g. Paro)</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                                value={currentDest.name}
                                onChange={(e) => setCurrentDest({ ...currentDest, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Full Title (e.g. Paro Valley)</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                                value={currentDest.title}
                                onChange={(e) => setCurrentDest({ ...currentDest, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Short Description</label>
                            <textarea
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '100px' }}
                                value={currentDest.description}
                                onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Sort Order (Priority)</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
                                value={currentDest.sort_order}
                                onChange={(e) => setCurrentDest({ ...currentDest, sort_order: Number(e.target.value) })}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button type="submit" className="btn btn-primary">Save Destination</button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
