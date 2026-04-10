'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
    const [isUploading, setIsUploading] = useState(false);
    const [currentDest, setCurrentDest] = useState<Partial<Destination>>({
        name: '',
        title: '',
        slug: '',
        description: '',
        image_url: '',
        sort_order: 0
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        const slug = currentDest.slug || currentDest.name?.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
            
        const destData = {
            ...currentDest,
            slug
        };

        if (!supabase) return;
        let result;
        if (currentDest.id) {
            result = await supabase
                .from('destinations')
                .update(destData)
                .eq('id', currentDest.id);
        } else {
            result = await supabase
                .from('destinations')
                .insert([destData]);
        }

        if (result.error) {
            alert('Error saving destination: ' + result.error.message);
        } else {
            setIsEditing(false);
            fetchDestinations();
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this destination?')) {
            const { error } = await supabase.from('destinations').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else fetchDestinations();
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!supabase || !file) return;
        setIsUploading(true);
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `destination-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('destinations')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('destinations')
                .getPublicUrl(filePath);

            setCurrentDest(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentDest(prev => ({ ...prev, image_url: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleImageUpload(file);
    }, []);

    const normalizeImageUrl = (url: string | undefined): string | null => {
        if (!url || typeof url !== 'string' || url.trim() === '') return null;
        if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
        if (url.startsWith('bhutan/')) return `/images/${url}`;
        if (url.startsWith('images/')) return `/${url}`;
        return `/${url}`;
    };

    if (loading && !isEditing) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Syncing Bhutan Geography...</p>
            </div>
        );
    }

    return (
        <div className="dest-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Explore Bhutan Settings</h1>
                    <p className="subtitle">Manage valleys, regions, and key travel destinations.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add-dest" onClick={() => {
                        setCurrentDest({ name: '', title: '', slug: '', description: '', image_url: '', sort_order: 0 });
                        setIsEditing(true);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add Destination
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="dest-inventory-grid">
                    {destinations.map(dest => (
                        <div key={dest.id} className="inventory-card">
                            <div className="card-image">
                                {normalizeImageUrl(dest.image_url) ? (
                                    <Image src={normalizeImageUrl(dest.image_url)!} alt={dest.name} fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(dest.image_url)?.startsWith('data:')} />
                                ) : (
                                    <div className="img-placeholder">Gallery Image</div>
                                )}
                                <div className="order-badge">#{dest.sort_order}</div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{dest.name}</h3>
                                <p className="card-subtitle">{dest.title}</p>
                                <div className="card-actions">
                                    <button className="btn-edit" onClick={() => { setCurrentDest(dest); setIsEditing(true); }}>Edit Region</button>
                                    <button className="btn-delete" onClick={() => handleDelete(dest.id)} title="Remove Destination">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="dest-editor-form" onSubmit={handleSave}>
                        <div className="editor-sidebar">
                            <div 
                                className={`image-dropzone ${isUploading ? 'uploading' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <div className="upload-loader">Uploading...</div>
                                ) : normalizeImageUrl(currentDest.image_url) ? (
                                    <>
                                        <Image src={normalizeImageUrl(currentDest.image_url)!} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(currentDest.image_url)?.startsWith('data:')} />
                                        <div className="dropzone-overlay">Change Region Photo</div>
                                    </>
                                ) : (
                                    <div className="dropzone-prompt">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <p>Drop Region Imagery</p>
                                        <span>or click to browse</span>
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
                                <label>Priority Sorting</label>
                                <input 
                                    type="number" 
                                    className="order-input"
                                    value={currentDest.sort_order} 
                                    onChange={(e) => setCurrentDest({ ...currentDest, sort_order: Number(e.target.value) })}
                                />
                                <p className="help-text">Determines layout order on public pages.</p>
                            </div>
                        </div>

                        <div className="editor-main">
                            <div className="editor-header">
                                <h2 className="serif-title">Region Architect</h2>
                                <div className="editor-controls">
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn-save">Save Destination</button>
                                </div>
                            </div>

                            <div className="form-sections">
                                <div className="section">
                                    <h4>Geographic Identity</h4>
                                    <div className="form-grid">
                                        <div className="form-item">
                                            <label>Short Name</label>
                                            <input 
                                                type="text" 
                                                value={currentDest.name} 
                                                onChange={(e) => setCurrentDest({ ...currentDest, name: e.target.value })} 
                                                placeholder="e.g. Paro" 
                                                required 
                                            />
                                        </div>
                                        <div className="form-item">
                                            <label>Full Title</label>
                                            <input 
                                                type="text" 
                                                value={currentDest.title} 
                                                onChange={(e) => setCurrentDest({ ...currentDest, title: e.target.value })} 
                                                placeholder="e.g. The Gateway to Bhutan" 
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Atmosphere & Narrative</h4>
                                    <div className="form-item">
                                        <label>Region Description</label>
                                        <textarea 
                                            rows={8} 
                                            value={currentDest.description} 
                                            onChange={(e) => setCurrentDest({ ...currentDest, description: e.target.value })} 
                                            placeholder="Describe the essence of this valley..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .dest-admin-container {
                    padding: 40px 0;
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
                .btn-add-dest {
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
                .btn-add-dest:hover {
                    background: #333;
                }

                .dest-inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 30px;
                }
                .inventory-card {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                .inventory-card:hover {
                    border-color: #d4c8b0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.04);
                    transform: translateY(-2px);
                }
                .card-image {
                    height: 180px;
                    position: relative;
                    background: #fdfcf9;
                }
                .img-placeholder {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #ddd;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                .order-badge {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 800;
                    backdrop-filter: blur(4px);
                }
                .card-content {
                    padding: 20px;
                }
                .card-title {
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                    margin-bottom: 5px;
                }
                .card-subtitle {
                    color: #888;
                    font-size: 13px;
                    margin-bottom: 20px;
                    height: 18px;
                    overflow: hidden;
                }
                .card-actions {
                    display: flex;
                    gap: 8px;
                }
                .btn-edit {
                    flex: 1;
                    padding: 9px;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                    background: white;
                    font-weight: 700;
                    font-size: 12px;
                    cursor: pointer;
                }
                .btn-delete {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ffebeb;
                    color: #d32f2f;
                    border-radius: 6px;
                    background: white;
                    cursor: pointer;
                }

                .editor-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 2500;
                    overflow-y: auto;
                    padding: 60px;
                }
                .dest-editor-form {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 80px;
                }
                .image-dropzone {
                    width: 100%;
                    aspect-ratio: 1;
                    background: #fcfcfc;
                    border: 2px dashed #eee;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }
                .dropzone-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 10px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    text-align: center;
                    font-size: 11px;
                    font-weight: 700;
                }
                .dropzone-prompt { text-align: center; color: #999; }
                .editor-aside-group {
                    margin-top: 40px;
                    padding-top: 40px;
                    border-top: 1px solid #eee;
                }
                .editor-aside-group label {
                    display: block;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #999;
                    margin-bottom: 20px;
                }
                .order-input {
                    padding: 12px;
                    width: 100px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    font-weight: 700;
                }
                .help-text { font-size: 12px; color: #aaa; margin-top: 15px; }

                .editor-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 50px;
                }
                .editor-header h2 { font-size: 28px; margin: 0; }
                .editor-controls { display: flex; gap: 12px; }
                .btn-cancel {
                    padding: 12px 25px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-save {
                    padding: 12px 35px;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .form-sections { display: grid; gap: 50px; }
                .section h4 {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 900;
                    color: #d4c8b0;
                    margin-bottom: 25px;
                }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-item label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    margin-bottom: 10px;
                }
                .form-item input, .form-item textarea {
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    border: 1px solid #eee;
                    background: #fafafa;
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
                    width: 32px;
                    height: 32px;
                    border: 2px solid rgba(0,0,0,0.05);
                    border-top-color: #d4c8b0;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
