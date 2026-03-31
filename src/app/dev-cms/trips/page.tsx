'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Trip {
    id: string;
    title: string;
    slug: string;
    duration_days: number;
    duration_nights: number;
    starting_price: number;
    level: string;
    image_url: string;
    gallery_urls: string[]; // NEW: Gallery Support
    description: string;
    is_active: boolean;
    meta_title?: string; // NEW: SEO
    meta_description?: string; // NEW: SEO
}

interface ItineraryItem {
    id?: string;
    trip_id: string;
    day_number: number;
    title: string;
    description: string;
    accommodation?: string;
    meals?: string;
}

export default function DevTripManager() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isManagingItinerary, setIsManagingItinerary] = useState(false);
    const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({
        title: '',
        slug: '',
        duration_days: 1,
        duration_nights: 0,
        starting_price: 0,
        level: 'Moderate',
        image_url: '',
        gallery_urls: [],
        description: '',
        is_active: true,
        meta_title: '',
        meta_description: ''
    });

    const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>([]);
    const [itineraryLoading, setItineraryLoading] = useState(false);

    useEffect(() => {
        fetchTrips();
        // FORCE UNLOCK: After 1.5s, let the user see the page no matter what
        const unlock = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(unlock);
    }, []);

    const fetchTrips = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching trips:', error);
            else setTrips(data || []);
        } finally {
            setLoading(false);
        }
    };

    const fetchItinerary = async (tripId: string) => {
        if (!supabase) return;
        setItineraryLoading(true);
        const { data, error } = await supabase
            .from('trip_itineraries')
            .select('*')
            .eq('trip_id', tripId)
            .order('day_number', { ascending: true });

        if (error) console.error('Error fetching itinerary:', error);
        else setItineraryItems(data || []);
        setItineraryLoading(false);
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
            result = await supabase.from('trips').update(tripData).eq('id', currentTrip.id);
        } else {
            result = await supabase.from('trips').insert([tripData]);
        }

        if (result.error) alert('Error: ' + result.error.message);
        else { setIsEditing(false); fetchTrips(); }
    };

    const handleSaveItinerary = async () => {
        if (!supabase || !currentTrip.id) return;
        setItineraryLoading(true);
        await supabase.from('trip_itineraries').delete().eq('trip_id', currentTrip.id);
        const { error } = await supabase.from('trip_itineraries').insert(
            itineraryItems.map(item => ({
                trip_id: currentTrip.id,
                day_number: item.day_number,
                title: item.title,
                description: item.description,
                accommodation: item.accommodation,
                meals: item.meals
            }))
        );
        if (error) alert('Error: ' + error.message);
        else { alert('Itinerary saved!'); setIsManagingItinerary(false); }
        setItineraryLoading(false);
    };

    if (loading && !isEditing && !isManagingItinerary) return <div>Loading Trips...</div>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '32px' }}>
                    {isManagingItinerary ? `📅 Itinerary: ${currentTrip.title}` : 'Trips & Package Manager'}
                </h1>
                
                {!isEditing && !isManagingItinerary && (
                    <button onClick={() => { setCurrentTrip({ title: '', slug: '', duration_days: 1, duration_nights: 0, starting_price: 0, level: 'Moderate', is_active: true }); setIsEditing(true); }} style={{ padding: '12px 25px', background: '#008080', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>+ Create Trip</button>
                )}
                
                {isManagingItinerary && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setIsManagingItinerary(false)} style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                        <button onClick={handleSaveItinerary} style={{ padding: '10px 20px', background: '#008080', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save Itinerary</button>
                    </div>
                )}
            </div>

            {!isEditing && !isManagingItinerary ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ marginBottom: '5px' }}>{trip.title}</h3>
                            <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>{trip.duration_days} Days | ${trip.starting_price} | Level: {trip.level}</p>
                            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                                <button onClick={() => { setCurrentTrip(trip); setIsManagingItinerary(true); fetchItinerary(trip.id); }} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px' }}>📅 Itinerary</button>
                                <button onClick={() => { setCurrentTrip(trip); setIsEditing(true); }} style={{ padding: '10px', cursor: 'pointer', borderRadius: '6px' }}>📝 Edit Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : isEditing ? (
                <div style={{ background: 'white', padding: '50px', borderRadius: '12px', border: '1px solid #eee', maxWidth: '1000px' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '30px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Trip Title</label>
                                <input type="text" value={currentTrip.title} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentTrip({...currentTrip, title: e.target.value})} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Slug</label>
                                <input type="text" placeholder="auto-generated" value={currentTrip.slug} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', background: '#f9f9f9' }} onChange={e => setCurrentTrip({...currentTrip, slug: e.target.value})} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>SEO Meta Description (Google results)</label>
                            <textarea value={currentTrip.meta_description} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentTrip({...currentTrip, meta_description: e.target.value})} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                            <input type="number" placeholder="Days" value={currentTrip.duration_days} onChange={e => setCurrentTrip({...currentTrip, duration_days: Number(e.target.value)})} />
                            <input type="number" placeholder="Price" value={currentTrip.starting_price} onChange={e => setCurrentTrip({...currentTrip, starting_price: Number(e.target.value)})} />
                            <select value={currentTrip.level} onChange={e => setCurrentTrip({...currentTrip, level: e.target.value})}>
                                <option value="Easy">Easy</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Strenuous">Strenuous</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Main Hero image URL</label>
                            <input type="text" value={currentTrip.image_url} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentTrip({...currentTrip, image_url: e.target.value})} />
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                            <button type="submit" style={{ padding: '15px 40px', background: '#008080', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Trip Package</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '15px 40px', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {itineraryItems.length === 0 && <p style={{ color: '#999', padding: '20px', textAlign: 'center', background: '#f5f5f5', borderRadius: '8px' }}>No itinerary data. Click "Add Day" to begin.</p>}
                    {itineraryItems.map((item, index) => (
                        <div key={index} style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #ddd' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h4 style={{ color: '#008080', fontWeight: 'bold' }}>Day {item.day_number}</h4>
                                <button onClick={() => setItineraryItems(itineraryItems.filter((_, i) => i !== index).map((it, i) => ({...it, day_number: i+1})))} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px' }}>Remove Day</button>
                            </div>
                            <div style={{ display: 'grid', gap: '15px' }}>
                                <input type="text" placeholder="Title for the day (e.g. Arrival in Paro)" value={item.title} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee' }} onChange={e => { const n = [...itineraryItems]; n[index].title = e.target.value; setItineraryItems(n); }} />
                                <textarea placeholder="Describe the day's events..." value={item.description} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #eee', minHeight: '80px' }} onChange={e => { const n = [...itineraryItems]; n[index].description = e.target.value; setItineraryItems(n); }} />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <input type="text" placeholder="Accommodation" value={item.accommodation} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} onChange={e => { const n = [...itineraryItems]; n[index].accommodation = e.target.value; setItineraryItems(n); }} />
                                    <input type="text" placeholder="Meals (e.g. B, L, D)" value={item.meals} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #eee' }} onChange={e => { const n = [...itineraryItems]; n[index].meals = e.target.value; setItineraryItems(n); }} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={() => setItineraryItems([...itineraryItems, { trip_id: currentTrip.id!, day_number: itineraryItems.length + 1, title: '', description: '', accommodation: '', meals: '' }])}
                        style={{ padding: '20px', border: '2px dashed #008080', borderRadius: '12px', background: 'transparent', cursor: 'pointer', color: '#008080', fontWeight: 'bold' }}
                    >
                        + Add Next Day
                    </button>
                </div>
            )}
        </section>
    );
}
