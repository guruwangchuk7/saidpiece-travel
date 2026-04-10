'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
    trip_type: string;
    destination: string;
    category: string;
}

export default function TripManager() {
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
        trip_type: 'Private Journey',
        destination: 'Bhutan',
        category: 'Cultural'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        const slug = currentTrip.slug || currentTrip.title?.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
            
        const tripData = {
            ...currentTrip,
            slug
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
        if (confirm('Are you sure you want to delete this trip permanently?')) {
            const { error } = await supabase.from('trips').delete().eq('id', id);
            if (error) alert('Error deleting: ' + error.message);
            else fetchTrips();
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
            // In a real prod environment, ensure this bucket exists and has public access.
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
            };
            reader.readAsDataURL(file);
            alert('Note: Storage bucket not configured. Showing local preview only.');
        } finally {
            setIsUploading(false);
        }
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
                    <button className="btn-add-trip" onClick={() => {
                        setCurrentTrip({
                            title: '', slug: '', duration_days: 1, duration_nights: 0, starting_price: 0,
                            level: 'Moderate', is_active: true, trip_type: 'Private Journey', 
                            destination: 'Bhutan', category: 'Cultural', image_url: '', description: ''
                        });
                        setIsEditing(true);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Initialize New Trip
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="trips-inventory-grid">
                    {trips.map(trip => (
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
                                    <button className="btn-edit" onClick={() => { setCurrentTrip(trip); setIsEditing(true); }}>Edit Details</button>
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
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn-save">Publish Changes</button>
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
                                            <select value={currentTrip.trip_type} onChange={(e) => setCurrentTrip({ ...currentTrip, trip_type: e.target.value })}>
                                                <option>Private Journey</option>
                                                <option>Family Adventure</option>
                                                <option>Festival Tour</option>
                                                <option>Honeymoon</option>
                                                <option>Small Group</option>
                                            </select>
                                        </div>
                                        <div className="form-item">
                                            <label>Difficulty Level</label>
                                            <select value={currentTrip.level} onChange={(e) => setCurrentTrip({ ...currentTrip, level: e.target.value })}>
                                                <option>Easy</option>
                                                <option>Moderate</option>
                                                <option>Strenuous</option>
                                                <option>Challenging</option>
                                            </select>
                                        </div>
                                        <div className="form-item">
                                            <label>Category</label>
                                            <select value={currentTrip.category} onChange={(e) => setCurrentTrip({ ...currentTrip, category: e.target.value })}>
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
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Content & Narrative</h4>
                                    <div className="form-item">
                                        <label>Trip Description</label>
                                        <textarea 
                                            rows={8} 
                                            value={currentTrip.description} 
                                            onChange={(e) => setCurrentTrip({ ...currentTrip, description: e.target.value })} 
                                            placeholder="Write the journey's story here..."
                                        />
                                    </div>
                                </div>
                            </div>
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
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
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

                /* Grid Layout */
                .trips-inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
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
                .trip-editor-form {
                    max-width: 1300px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    gap: 80px;
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
            `}</style>
        </div>
    );
}
