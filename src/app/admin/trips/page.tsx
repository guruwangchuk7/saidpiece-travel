'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    is_published: boolean;
    trip_type?: string;
    destination: string;
    category: string;
    highlights: string[];
    meta_description: string;
    arrive_city: string;
    depart_city: string;
    secondary_image_url: string;
}

interface ItineraryItem {
    id?: string;
    day_number: number;
    title: string;
    description: string;
    accommodation?: string;
    meals?: string;
}

export default function TripManager() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentTrip, setCurrentTrip] = useState<Partial<Trip>>({
        title: '',
        slug: '',
        duration_days: 1,
        duration_nights: 0,
        starting_price: 0,
        level: 'Moderate',
        image_url: '',
        description: '',
        is_active: true,
        is_published: false,
        trip_type: 'Private Journey',
        destination: 'Bhutan',
        category: 'Cultural',
        highlights: [],
        meta_description: '',
        arrive_city: 'Paro, Bhutan',
        depart_city: 'Paro, Bhutan',
        secondary_image_url: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isStaff) {
            fetchTrips();
        } else if (isStaff === false) {
            // Ensure we don't stay stuck if not staff
            setLoading(false);
        }
    }, [isStaff]);

    const fetchTrips = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching trips:', error);
            } else {
                setTrips(data || []);
            }
        } catch (e) {
            console.error('Exception in fetchTrips:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchItinerary = async (tripId: string) => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('trip_itineraries')
            .select('*')
            .eq('trip_id', tripId)
            .order('day_number', { ascending: true });

        if (error) {
            console.error('Error fetching itinerary:', error);
            setItinerary([]);
        } else {
            setItinerary(data || []);
        }
    };

    const handleEditTrip = (trip: Trip) => {
        let tripToEdit = { ...trip };
        try {
            const parsed = JSON.parse(trip.description);
            tripToEdit.description = parsed.overview || '';
            tripToEdit.highlights = parsed.highlights || [];
            tripToEdit.meta_description = parsed.meta_description || '';
            tripToEdit.arrive_city = parsed.arrive_city || 'Paro, Bhutan';
            tripToEdit.depart_city = parsed.depart_city || 'Paro, Bhutan';
            tripToEdit.secondary_image_url = parsed.secondary_image_url || '';
        } catch (e) {
            // Legacy fallback
            tripToEdit.highlights = [];
            tripToEdit.meta_description = '';
        }
        setCurrentTrip(tripToEdit);
        setItinerary([]); // Reset first
        fetchItinerary(trip.id);
        setIsEditing(true);
    };

    const handleAddDay = () => {
        const nextDay = itinerary.length + 1;
        setItinerary([...itinerary, {
            day_number: nextDay,
            title: '',
            description: '',
            accommodation: '',
            meals: ''
        }]);
    };

    const handleRemoveDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index);
        // Re-order day numbers
        const reordered = newItinerary.map((item, i) => ({
            ...item,
            day_number: i + 1
        }));
        setItinerary(reordered);
    };

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || trip.category === filterCategory;
        const matchesStatus = filterStatus === 'All' ||
            (filterStatus === 'Published' && trip.is_published) ||
            (filterStatus === 'Draft' && !trip.is_published);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const categories = ['All', ...new Set(trips.map(t => t.category).filter(Boolean))];

    const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: any) => {
        const newItinerary = [...itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setItinerary(newItinerary);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        const slug = currentTrip.slug || currentTrip.title?.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

        const tripData = {
            title: currentTrip.title,
            slug: slug,
            duration_days: currentTrip.duration_days || 1,
            duration_nights: currentTrip.duration_nights || 0,
            starting_price: currentTrip.starting_price || 0,
            level: currentTrip.level || 'Moderate',
            image_url: currentTrip.image_url || '',
            category: currentTrip.category || 'Cultural',
            description: JSON.stringify({
                overview: currentTrip.description || '',
                highlights: currentTrip.highlights || [],
                meta_description: currentTrip.meta_description || '',
                arrive_city: currentTrip.arrive_city || 'Paro, Bhutan',
                depart_city: currentTrip.depart_city || 'Paro, Bhutan',
                secondary_image_url: currentTrip.secondary_image_url || ''
            })
        };

        if (!supabase) {
            alert('Supabase connection missing.');
            return;
        }

        setIsSaving(true);
        try {
            let tripId = currentTrip.id;
            let result;

            if (tripId) {
                result = await supabase
                    .from('trips')
                    .update(tripData)
                    .eq('id', tripId)
                    .select();
            } else {
                result = await supabase
                    .from('trips')
                    .insert([tripData])
                    .select();
            }

            if (result.error) throw result.error;

            const savedTrip = result.data?.[0];
            if (savedTrip) {
                tripId = savedTrip.id;

                // Handle Itinerary Sync
                // 1. Delete existing itinerary items for this trip
                await supabase.from('trip_itineraries').delete().eq('trip_id', tripId);

                // 2. Insert new itinerary items
                if (itinerary.length > 0) {
                    const itineraryToSave = itinerary.map(item => ({
                        trip_id: tripId,
                        day_number: item.day_number,
                        title: item.title,
                        description: item.description,
                        accommodation: item.accommodation,
                        meals: item.meals
                    }));

                    const { error: itinError } = await supabase
                        .from('trip_itineraries')
                        .insert(itineraryToSave);

                    if (itinError) throw itinError;
                }
            }

            setIsEditing(false);
            await fetchTrips();
            router.refresh();
            alert('Trip and itinerary published successfully.');
        } catch (error: any) {
            console.error('Error saving trip:', error);
            alert('Error saving: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Are you sure you want to delete this trip permanently?')) {
            const { error } = await supabase.from('trips').delete().eq('id', id);
            if (error) alert('Error deleting: ' + error.message);
            else {
                await fetchTrips();
                router.refresh();
            }
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!supabase || !file) return;
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `trip-images/${fileName}`;

            // We attempt to upload to 'trips' bucket. 
            const { error: uploadError } = await supabase.storage
                .from('trips')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('trips')
                .getPublicUrl(filePath);

            setCurrentTrip(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            // Fallback: If bucket doesn't exist, we'll just use a local data URL for preview demonstration
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentTrip(prev => ({ ...prev, image_url: e.target?.result as string }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
            alert('Note: Storage bucket "trips" not found. Using local preview for now.');
            return;
        }
        setIsUploading(false);
    };

    const normalizeImageUrl = (url: string | undefined): string | null => {
        if (!url || typeof url !== 'string' || url.trim() === '') return null;
        try {
            // If it's already a full URL or a relative path starting with /, it's fine
            if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;

            // Legacy fix: if it starts with bhutan/, it actually belongs in /images/bhutan/
            if (url.startsWith('bhutan/')) return `/images/${url}`;

            // Otherwise, assume it's a relative path and fix it with a leading slash
            return `/${url}`;
        } catch (e) {
            return null;
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    }, [handleImageUpload]);

    if (loading && !isEditing) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Synchronizing Trip Databases...</p>
            </div>
        );
    }

    return (
        <div className="trip-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Inventory Management</h1>
                    <p className="subtitle">Curate and publish premium Bhutanese travel experiences.</p>
                </div>
                {!isEditing && (
                    <div className="header-actions">
                        <Link href="/browse" target="_blank" className="btn-view-site">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                            View Public Browse
                        </Link>
                        <button className="btn-add-trip" onClick={() => {
                            setCurrentTrip({
                                title: '', slug: '', duration_days: 1, duration_nights: 0, starting_price: 0,
                                level: 'Moderate', is_active: true, is_published: false, trip_type: 'Private Journey',
                                destination: 'Bhutan', category: 'Cultural', image_url: '', description: ''
                            });
                            setItinerary([]);
                            setIsEditing(true);
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Initialize New Trip
                        </button>
                    </div>
                )}
            </header>

            {!isEditing && (
                <div className="admin-filters-bar">
                    <div className="search-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input
                            type="text"
                            placeholder="Search journeys by title or slug..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Drafts</option>
                        </select>
                    </div>
                </div>
            )}

            {!isEditing ? (
                <div className="trips-inventory-grid">
                    {filteredTrips.map(trip => (
                        <div key={trip.id} className="inventory-card">
                            <div className="card-image">
                                {normalizeImageUrl(trip.image_url) ? (
                                    <Image src={normalizeImageUrl(trip.image_url)!} alt={trip.title} fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(trip.image_url)?.startsWith('data:')} />
                                ) : (
                                    <div className="img-placeholder">No Image</div>
                                )}
                                <div className={`badge ${trip.is_active ? 'active' : 'inactive'}`}>
                                    {trip.is_active ? 'Active' : 'Draft'}
                                </div>
                            </div>
                            <div className="card-content">
                                <div className="card-meta">
                                    <span className="duration">{trip.duration_days}D / {trip.duration_nights}N</span>
                                    <span className="price">From ${trip.starting_price}</span>
                                </div>
                                <h3 className="card-title">{trip.title}</h3>
                                <div className="card-tags">
                                    <span className="tag">{trip.level}</span>
                                    <span className="tag">{trip.category}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => handleEditTrip(trip)}>Edit Details</button>
                                    <Link href={`/trips/${trip.slug}`} target="_blank" className="btn-view-live" title="View on Site">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </Link>
                                    <button className="btn-delete" onClick={() => handleDelete(trip.id)} title="Delete Trip">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="trip-editor-form" onSubmit={handleSave}>
                        <div className="editor-sidebar">
                            <div
                                className={`image-dropzone ${isUploading ? 'uploading' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <div className="upload-loader">Uploading...</div>
                                ) : normalizeImageUrl(currentTrip.image_url) ? (
                                    <>
                                        <Image src={normalizeImageUrl(currentTrip.image_url)!} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(currentTrip.image_url)?.startsWith('data:')} />
                                        <div className="dropzone-overlay">Change Image</div>
                                    </>
                                ) : (
                                    <div className="dropzone-prompt">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <p>Drag & Drop Gallery Image</p>
                                        <span>or click to browse files</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                                />
                            </div>

                            <div className="editor-aside-group">
                                <label>Trip Status</label>
                                <div className="toggle-container" onClick={() => setCurrentTrip({ ...currentTrip, is_active: !currentTrip.is_active })}>
                                    <div className={`toggle-track ${currentTrip.is_active ? 'on' : 'off'}`}>
                                        <div className="toggle-handle"></div>
                                    </div>
                                    <span>{currentTrip.is_active ? 'Live & Public' : 'Draft Only'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="editor-main">
                            <div className="editor-header">
                                <h2 className="serif-title">Trip Architect</h2>
                                <div className="editor-controls">
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</button>
                                    <button type="submit" className="btn-save" disabled={isSaving || isUploading}>
                                        {isSaving ? 'Publishing...' : 'Publish Changes'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-sections">
                                <div className="section">
                                    <h4>Essential Information</h4>
                                    <div className="form-grid">
                                        <div className="form-item span-full">
                                            <label>Trip Title</label>
                                            <input
                                                type="text"
                                                value={currentTrip.title}
                                                onChange={(e) => setCurrentTrip({ ...currentTrip, title: e.target.value })}
                                                placeholder="Enter a captivating journey name..."
                                                required
                                            />
                                        </div>
                                        <div className="form-item span-full" style={{ marginTop: '20px' }}>
                                            <label>Hero Subtitle</label>
                                            <input
                                                type="text"
                                                value={(currentTrip as any).meta_description}
                                                onChange={(e) => setCurrentTrip({ ...currentTrip, meta_description: e.target.value } as any)}
                                                placeholder="e.g. High Altitude Adventure in the High Himalayas"
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label>Duration (Days)</label>
                                            <input type="number" value={currentTrip.duration_days} onChange={(e) => setCurrentTrip({ ...currentTrip, duration_days: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-item">
                                            <label>Duration (Nights)</label>
                                            <input type="number" value={currentTrip.duration_nights} onChange={(e) => setCurrentTrip({ ...currentTrip, duration_nights: Number(e.target.value) })} />
                                        </div>
                                        <div className="form-item">
                                            <label>Starting Price ($)</label>
                                            <input type="number" value={currentTrip.starting_price} onChange={(e) => setCurrentTrip({ ...currentTrip, starting_price: Number(e.target.value) })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Categorization</h4>
                                    <div className="form-grid">
                                        <div className="form-item">
                                            <label>Trip Type</label>
                                            <select value={currentTrip.trip_type || ''} onChange={(e) => setCurrentTrip({ ...currentTrip, trip_type: e.target.value })}>
                                                <option value="" disabled>Select Trip Type</option>
                                                <option>Private Journey</option>
                                                <option>Family Adventure</option>
                                                <option>Festival Tour</option>
                                                <option>Honeymoon</option>
                                                <option>Small Group</option>
                                            </select>
                                        </div>
                                        <div className="form-item">
                                            <label>Difficulty Level</label>
                                            <select value={currentTrip.level || ''} onChange={(e) => setCurrentTrip({ ...currentTrip, level: e.target.value })}>
                                                <option value="" disabled>Select Difficulty</option>
                                                <option>Easy</option>
                                                <option>Moderate</option>
                                                <option>Strenuous</option>
                                                <option>Challenging</option>
                                            </select>
                                        </div>
                                        <div className="form-item">
                                            <label>Category</label>
                                            <select value={currentTrip.category || ''} onChange={(e) => setCurrentTrip({ ...currentTrip, category: e.target.value })}>
                                                <option value="" disabled>Select Category</option>
                                                <option>Cultural</option>
                                                <option>Wellness</option>
                                                <option>Adventure</option>
                                                <option>Nature</option>
                                                <option>Luxury</option>
                                            </select>
                                        </div>
                                        <div className="form-item">
                                            <label>Primary Destination</label>
                                            <input type="text" value={currentTrip.destination} onChange={(e) => setCurrentTrip({ ...currentTrip, destination: e.target.value })} />
                                        </div>
                                        <div className="form-item">
                                            <label>Arrive (City/Hub)</label>
                                            <input type="text" value={currentTrip.arrive_city} onChange={(e) => setCurrentTrip({ ...currentTrip, arrive_city: e.target.value })} />
                                        </div>
                                        <div className="form-item">
                                            <label>Depart (City/Hub)</label>
                                            <input type="text" value={currentTrip.depart_city} onChange={(e) => setCurrentTrip({ ...currentTrip, depart_city: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Journey Storytelling</h4>
                                    <div className="form-item">
                                        <label>Full Overview</label>
                                        <textarea
                                            rows={6}
                                            value={currentTrip.description}
                                            onChange={(e) => setCurrentTrip({ ...currentTrip, description: e.target.value })}
                                            placeholder="The main narrative for this trip..."
                                        />
                                    </div>
                                    <div className="form-item" style={{ marginTop: '30px' }}>
                                        <div className="section-header-flex">
                                            <label>Experience Highlights</label>
                                            <button type="button" className="btn-add-mini" onClick={() => {
                                                const h = (currentTrip as any).highlights || [];
                                                setCurrentTrip({ ...currentTrip, highlights: [...h, ''] } as any);
                                            }}>+ Highlight</button>
                                        </div>
                                        <div className="highlights-builder">
                                            {((currentTrip as any).highlights || []).map((hl: string, idx: number) => (
                                                <div key={idx} className="highlight-input-row">
                                                    <input
                                                        type="text"
                                                        value={hl}
                                                        onChange={(e) => {
                                                            const h = [...((currentTrip as any).highlights || [])];
                                                            h[idx] = e.target.value;
                                                            setCurrentTrip({ ...currentTrip, highlights: h } as any);
                                                        }}
                                                        placeholder="e.g. Trek to multiple high Himalayan passes"
                                                    />
                                                    <button type="button" className="btn-remove-mini" onClick={() => {
                                                        const h = [...((currentTrip as any).highlights || [])];
                                                        h.splice(idx, 1);
                                                        setCurrentTrip({ ...currentTrip, highlights: h } as any);
                                                    }}>×</button>
                                                </div>
                                            ))}
                                            {(!(currentTrip as any).highlights || (currentTrip as any).highlights.length === 0) && (
                                                <div className="empty-itinerary-prompt" style={{ padding: '15px' }} onClick={() => {
                                                    setCurrentTrip({ ...currentTrip, highlights: [''] } as any);
                                                }}>
                                                    <span style={{ fontSize: '11px' }}>Click to add your first highlight...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-item" style={{ marginTop: '20px' }}>
                                        <label>Secondary Image URL (Visualization)</label>
                                        <input
                                            type="text"
                                            value={currentTrip.secondary_image_url}
                                            onChange={(e) => setCurrentTrip({ ...currentTrip, secondary_image_url: e.target.value })}
                                            placeholder="e.g. /images/bhutan/map-preview.webp"
                                        />
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="section-header-flex">
                                        <h4>Detailed Itinerary</h4>
                                        <button type="button" className="btn-add-day" onClick={handleAddDay}>+ Add Day</button>
                                    </div>

                                    <div className="itinerary-builder-list">
                                        {itinerary.map((item, index) => (
                                            <div key={index} className="itinerary-day-card">
                                                <div className="day-card-header">
                                                    <div className="day-drag-handle">
                                                        <svg width="12" height="20" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></svg>
                                                    </div>
                                                    <span className="day-label">Day {item.day_number}</span>
                                                    <input
                                                        type="text"
                                                        className="day-title-input"
                                                        value={item.title}
                                                        onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                                                        placeholder="Day Title (e.g. Arrival in Paro)"
                                                    />
                                                    <button type="button" className="btn-remove-day" onClick={() => handleRemoveDay(index)} title="Remove Day">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    </button>
                                                </div>
                                                <div className="day-card-body">
                                                    <div className="day-main-edit">
                                                        <label>Daily Narrative</label>
                                                        <textarea
                                                            rows={3}
                                                            value={item.description}
                                                            onChange={(e) => updateItineraryItem(index, 'description', e.target.value)}
                                                            placeholder="What happens on this day? Describe the journey, hikes, and cultural experiences..."
                                                        />
                                                    </div>
                                                    <div className="day-meta-horizontal">
                                                        <div className="meta-field">
                                                            <div className="meta-icon">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={item.accommodation || ''}
                                                                onChange={(e) => updateItineraryItem(index, 'accommodation', e.target.value)}
                                                                placeholder="Accommodation"
                                                            />
                                                        </div>
                                                        <div className="meta-field">
                                                            <div className="meta-icon">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={item.meals || ''}
                                                                onChange={(e) => updateItineraryItem(index, 'meals', e.target.value)}
                                                                placeholder="Meals (e.g. B, L, D)"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {itinerary.length === 0 && (
                                            <div className="empty-itinerary-prompt" onClick={handleAddDay}>
                                                <div className="plus-circle">+</div>
                                                <p>No itinerary items defined yet.</p>
                                                <span>Click here to initialize the first day of the journey.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="form-checkbox">
                                    <input type="checkbox" checked={currentTrip.is_published} onChange={e => setCurrentTrip({ ...currentTrip, is_published: e.target.checked })} />
                                    <span>Published</span>
                                </label>
                            </div>
                            {currentTrip.slug && (
                                <button
                                    type="button"
                                    className="btn-preview"
                                    onClick={() => window.open(`/trips/${currentTrip.slug}?preview=true`, '_blank')}
                                    style={{ marginTop: '20px', width: '100%', background: '#f5f5f5', border: '1px solid #ddd', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                                >
                                    Preview Journey
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .trip-admin-container {
                    padding: 40px 0;
                    min-height: 80vh;
                }
                .admin-page-header h1 {
                    font-size: 32px;
                    margin: 0;
                    line-height: 1.2;
                }
                .admin-page-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-end; 
                    margin-bottom: 30px; 
                    padding-bottom: 30px; 
                    border-bottom: 1px solid #eee; 
                }
                
                .admin-filters-bar {
                    display: flex;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 40px;
                    background: #f9f9f9;
                    padding: 15px;
                    border-radius: 12px;
                    border: 1px solid #eee;
                }
                .search-box {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 0 15px;
                }
                .search-box input {
                    border: none;
                    padding: 12px;
                    width: 100%;
                    font-size: 14px;
                    outline: none;
                }
                .filter-group { display: flex; gap: 10px; }
                .filter-group select {
                    padding: 10px 15px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    background: white;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .admin-page-header h1 {
                        font-size: 26px;
                    }
                    .btn-add-trip {
                        width: 100%;
                        justify-content: center;
                    }
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
                }
                .header-actions {
                    display: flex;
                    gap: 15px;
                }
                .btn-view-site {
                    background: #fdfcf9;
                    border: 1px solid #d4c8b0;
                    color: #7c6f55;
                    padding: 12px 20px;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .btn-view-site:hover {
                    background: #f5f2eb;
                    transform: translateY(-1px);
                }
                .btn-add-trip {
                    background: #111;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-add-trip:hover {
                    background: #333;
                    transform: translateY(-1px);
                }

                .btn-view-live {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: #fdfcf9;
                    border: 1px solid #e8e4db;
                    color: #7c6f55;
                    border-radius: 8px;
                    transition: all 0.2s;
                }
                .btn-view-live:hover {
                    background: #111;
                    color: white;
                    border-color: #111;
                }

                /* Grid Layout */
                .trips-inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                }
                @media (max-width: 400px) {
                    .trips-inventory-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .inventory-card {
                    background: white;
                    border: 1px solid #e5e5e5;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .inventory-card:hover {
                    border-color: #d4c8b0;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
                    transform: translateY(-4px);
                }
                .card-image {
                    height: 200px;
                    position: relative;
                    background: #f5f5f5;
                }
                .img-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #ccc;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .badge.active { background: #008080; color: white; }
                .badge.inactive { background: #eee; color: #888; }

                .card-content {
                    padding: 25px;
                }
                .card-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    font-weight: 700;
                    color: #666;
                    margin-bottom: 12px;
                }
                .card-title {
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                    line-height: 1.3;
                    margin-bottom: 15px;
                    height: 52px;
                    overflow: hidden;
                }
                .card-tags {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 25px;
                }
                .tag {
                    background: #f9f9f9;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    color: #888;
                }
                .card-actions {
                    display: flex;
                    gap: 10px;
                }
                .btn-edit {
                    flex: 1;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    background: white;
                    font-weight: 700;
                    font-size: 13px;
                    color: #444;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-edit:hover {
                    border-color: #111;
                    background: #111;
                    color: white;
                }
                .btn-delete {
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    border: 1px solid #ffebeb;
                    background: white;
                    color: #d32f2f;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .btn-delete:hover {
                    background: #d32f2f;
                    color: white;
                    border-color: #d32f2f;
                }

                /* Editor Layout */
                .editor-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.98);
                    z-index: 2000;
                    overflow-y: auto;
                    padding: 60px;
                }
                @media (max-width: 1024px) {
                    .editor-overlay {
                        padding: 40px;
                    }
                }
                @media (max-width: 768px) {
                    .editor-overlay {
                        padding: 80px 20px 40px;
                    }
                }
                .trip-editor-form {
                    max-width: 1300px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 80px;
                }
                @media (max-width: 1200px) {
                    .trip-editor-form {
                        gap: 40px;
                        grid-template-columns: 300px 1fr;
                    }
                }
                @media (max-width: 900px) {
                    .trip-editor-form {
                        display: flex;
                        flex-direction: column;
                        gap: 40px;
                    }
                    .editor-sidebar {
                        position: static;
                    }
                }
                .editor-sidebar {
                    position: sticky;
                    top: 0;
                }
                .image-dropzone {
                    width: 100%;
                    aspect-ratio: 4/5;
                    background: #fafafa;
                    border: 2px dashed #eee;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.2s;
                }
                .image-dropzone:hover { border-color: #d4c8b0; background: #fffdf9; }
                .dropzone-prompt { text-align: center; }
                .dropzone-prompt p { font-weight: 700; color: #444; margin: 15px 0 5px; }
                .dropzone-prompt span { font-size: 12px; color: #999; }
                .dropzone-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    padding: 12px;
                    font-size: 12px;
                    font-weight: 700;
                    text-align: center;
                    backdrop-filter: blur(5px);
                }

                .editor-aside-group {
                    margin-top: 40px;
                    padding-top: 40px;
                    border-top: 1px solid #eee;
                }
                .editor-aside-group label {
                    display: block;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 800;
                    color: #999;
                    margin-bottom: 20px;
                }
                .toggle-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    font-weight: 700;
                    color: #111;
                }
                .toggle-track {
                    width: 48px;
                    height: 26px;
                    border-radius: 30px;
                    background: #eee;
                    position: relative;
                    transition: background 0.2s;
                }
                .toggle-track.on { background: #008080; }
                .toggle-handle {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 3px;
                    left: 3px;
                    transition: transform 0.2s;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                .toggle-track.on .toggle-handle { transform: translateX(22px); }

                .editor-header h2 {
                    font-size: 28px;
                    margin: 0;
                }
                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 60px;
                }
                @media (max-width: 640px) {
                    .editor-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                        margin-bottom: 40px;
                    }
                    .editor-controls {
                        width: 100%;
                    }
                    .btn-cancel, .btn-save {
                        flex: 1;
                        padding: 12px 15px;
                        font-size: 13px;
                    }
                }
                .editor-controls { display: flex; gap: 15px; }
                .btn-cancel {
                    background: none;
                    border: 1px solid #ddd;
                    padding: 14px 30px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-save {
                    background: #111;
                    color: white;
                    border: none;
                    padding: 14px 40px;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .form-sections { display: grid; gap: 60px; }
                .section h4 {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 900;
                    color: #d4c8b0;
                    margin-bottom: 30px;
                }
                .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
                .form-item.span-full { grid-column: span 2; }
                @media (max-width: 640px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }
                    .form-item.span-full {
                        grid-column: span 1;
                    }
                    .form-sections {
                        gap: 40px;
                    }
                }
                .form-item label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #555;
                }
                .form-item input, .form-item select, .form-item textarea {
                    width: 100%;
                    padding: 16px;
                    border-radius: 10px;
                    border: 1px solid #eee;
                    background: #fcfcfc;
                    font-family: inherit;
                    font-size: 15px;
                    transition: all 0.2s;
                }
                .form-item input:focus, .form-item select:focus, .form-item textarea:focus {
                    outline: none;
                    border-color: #d4c8b0;
                    background: white;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
                }

                /* Itinerary Builder Styles */
                .section-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }
                .btn-add-day {
                    background: #f0fdf4;
                    color: #166534;
                    border: 1px solid #bbf7d0;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-add-day:hover {
                    background: #dcfce7;
                }
                .itinerary-builder-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .itinerary-day-card {
                    background: #fdfcf9;
                    border: 1px solid #f5f2eb;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .day-card-header {
                    background: #fff;
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #f5f2eb;
                }
                .day-number {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #d4c8b0;
                    white-space: nowrap;
                }
                .day-title-input {
                    flex: 1;
                    border: none !important;
                    background: none !important;
                    font-weight: 700 !important;
                    padding: 0 !important;
                    font-size: 16px !important;
                }
                .btn-remove-day {
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: none;
                    background: #fee2e2;
                    color: #991b1b;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }
                .btn-remove-day:hover { opacity: 1; }
                .day-card-body {
                    padding: 20px;
                }
                .day-meta-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px dashed #eee;
                }
                .meta-item label {
                    display: block;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #aaa;
                    margin-bottom: 8px;
                }
                .meta-item input {
                    padding: 10px !important;
                    font-size: 13px !important;
                }
                .empty-itinerary-prompt {
                    padding: 40px;
                    border: 2px dashed #eee;
                    border-radius: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: border-color 0.2s;
                }
                .empty-itinerary-prompt:hover { border-color: #d4c8b0; }
                .empty-itinerary-prompt p { font-weight: 700; color: #444; margin: 0; }
                .empty-itinerary-prompt span { font-size: 12px; color: #999; }

                .admin-loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px;
                    color: #888;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(0,128,128,0.1);
                    border-top-color: #008080;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .itinerary-day-card {
                    background: white;
                    border: 1px solid #e5e5e5;
                    border-radius: 12px;
                    margin-bottom: 20px;
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .itinerary-day-card:hover {
                    border-color: #d4c8b0;
                }
                .day-card-header {
                    background: #fafafa;
                    padding: 12px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border-bottom: 1px solid #eee;
                }
                .day-label {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #7c6f55;
                    background: #f5f2eb;
                    padding: 4px 8px;
                    border-radius: 4px;
                    white-space: nowrap;
                }
                .day-title-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    font-family: var(--font-playfair), serif;
                    font-size: 18px;
                    font-weight: 700;
                    color: #111;
                    outline: none;
                }
                .day-card-body {
                    padding: 20px;
                }
                .day-main-edit label {
                    display: block;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 700;
                    color: #999;
                    margin-bottom: 8px;
                }
                .day-main-edit textarea {
                    width: 100%;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 12px;
                    font-size: 14px;
                    line-height: 1.6;
                    resize: vertical;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .day-main-edit textarea:focus {
                    border-color: #d4c8b0;
                }
                .day-meta-horizontal {
                    display: flex;
                    gap: 15px;
                    margin-top: 15px;
                }
                .meta-field {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    background: #f9f9f9;
                    border: 1px solid #eee;
                    border-radius: 6px;
                    padding: 0 10px;
                }
                .meta-icon {
                    color: #ccc;
                    margin-right: 8px;
                    display: flex;
                    align-items: center;
                }
                .meta-field input {
                    width: 100%;
                    background: transparent;
                    border: none;
                    padding: 10px 0;
                    font-size: 13px;
                    color: #555;
                    outline: none;
                }
                .btn-remove-day {
                    background: none;
                    border: none;
                    color: #ccc;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                .btn-remove-day:hover {
                    color: #ff5f56;
                    background: #fff0f0;
                }
                .plus-circle {
                    width: 40px;
                    height: 40px;
                    background: #f5f2eb;
                    color: #7c6f55;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin: 0 auto 15px;
                }
            `}</style>
        </div>
    );
}
