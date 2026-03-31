'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Trip {
    id: string;
    title: string;
    slug: string;
    duration_days: number;
    duration_nights: number;
    starting_price: number;
    level: string;
    image_url: string;
    description: string;
    is_active: boolean;
}

export default function TripManager() {
    const { isStaff } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({
        title: '',
        slug: '',
        duration_days: 1,
        duration_nights: 0,
        starting_price: 0,
        level: 'Moderate',
        image_url: '',
        description: '',
        is_active: true
    });

    useEffect(() => {
        if (isStaff) {
            fetchTrips();
        }
    }, [isStaff]);

    const fetchTrips = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching trips:', error);
        } else {
            setTrips(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const tripData = {
            ...currentTrip,
            slug: currentTrip.slug || currentTrip.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        };

        if (!supabase) return;
        let result;
        if (currentTrip.id) {
            result = await supabase
                .from('trips')
                .update(tripData)
                .eq('id', currentTrip.id);
        } else {
            result = await supabase
                .from('trips')
                .insert([tripData]);
        }

        if (result.error) {
            alert('Error saving trip: ' + result.error.message);
        } else {
            setIsEditing(false);
            fetchTrips();
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Are you sure you want to delete this trip?')) {
            const { error } = await supabase.from('trips').delete().eq('id', id);
            if (error) alert('Error deleting: ' + error.message);
            else fetchTrips();
        }
    };

    if (loading && !isEditing) return <div className="p-10">Loading Trips Data...</div>;

    return (
        <div className="trip-manager-page">
            <header className="manager-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1 className="serif-title">Manage Trips & Packages</h1>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => {
                        setCurrentTrip({ title: '', slug: '', duration_days: 1, duration_nights: 0, starting_price: 0, level: 'Moderate', is_active: true });
                        setIsEditing(true);
                    }}>
                        + Create New trip
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="trips-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} className="trip-card" style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #eee', position: 'relative', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <div className="status-badge" style={{ position: 'absolute', top: '15px', right: '15px', padding: '3px 10px', borderRadius: '4px', fontSize: '10px', background: trip.is_active ? '#008080' : '#888', color: 'white', fontWeight: 600 }}>
                                {trip.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </div>
                            <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>{trip.title}</h3>
                            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
                                {trip.duration_days} Days / {trip.duration_nights} Nights • ${trip.starting_price}
                            </p>
                            <div className="trip-meta" style={{ fontSize: '12px', color: '#999', marginBottom: '20px' }}>
                                Level: <strong>{trip.level}</strong> | Slug: <code>{trip.slug}</code>
                            </div>
                            <div className="actions" style={{ display: 'flex', gap: '10px' }}>
                                <button className="btn btn-outline small" style={{ flex: 1 }} onClick={() => { setCurrentTrip(trip); setIsEditing(true); }}>Edit Details</button>
                                <button className="btn btn-outline danger small" onClick={() => handleDelete(trip.id)}>🗑️</button>
                            </div>
                        </div>
                    ))}
                    {trips.length === 0 && <p className="p-10 text-gray-400">No trips found in the database. Create your first package to get started.</p>}
                </div>
            ) : (
                <div className="edit-form-container" style={{ maxWidth: '900px', background: 'white', padding: '50px', borderRadius: '12px', border: '1px solid #d4c8b0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <h2 className="serif-title" style={{ marginBottom: '40px', fontSize: '24px' }}>{currentTrip.id ? 'Edit Trip' : 'New Trip'}</h2>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '30px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Trip Title</label>
                            <input
                                type="text"
                                style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                                value={currentTrip.title}
                                placeholder="E.g., Kingdom in the Clouds: 10 Days in Bhutan"
                                onChange={(e) => setCurrentTrip({ ...currentTrip, title: e.target.value })}
                                required
                            />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Days</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    value={currentTrip.duration_days}
                                    onChange={(e) => setCurrentTrip({ ...currentTrip, duration_days: Number(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Nights</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    value={currentTrip.duration_nights}
                                    onChange={(e) => setCurrentTrip({ ...currentTrip, duration_nights: Number(e.target.value) })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Starting Price ($)</label>
                                <input
                                    type="number"
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                    value={currentTrip.starting_price}
                                    onChange={(e) => setCurrentTrip({ ...currentTrip, starting_price: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Trip Level</label>
                            <select
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                                value={currentTrip.level}
                                onChange={(e) => setCurrentTrip({ ...currentTrip, level: e.target.value })}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Strenuous">Strenuous</option>
                                <option value="Challenging">Challenging</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '14px', color: '#555' }}>Status</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={currentTrip.is_active}
                                    onChange={(e) => setCurrentTrip({ ...currentTrip, is_active: e.target.checked })}
                                    style={{ width: '20px', height: '20px' }}
                                />
                                Account is Active & Visible to Public
                            </label>
                        </div>

                        <div className="form-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '15px 40px' }}>Save Trip Details</button>
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Back to List</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
