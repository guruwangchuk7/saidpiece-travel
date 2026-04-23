'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface TravelStyle {
    id: string;
    name: string;
    image_url: string;
    sort_order: number;
}

export default function TravelStyleManager() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [styles, setStyles] = useState<TravelStyle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentStyle, setCurrentStyle] = useState<Partial<TravelStyle>>({
        name: '',
        image_url: '',
        sort_order: 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isStaff) {
            fetchStyles();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchStyles = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('travel_styles')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setStyles(data || []);
        } catch (e) {
            console.error('Error fetching styles:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving || !supabase) return;

        setIsSaving(true);
        try {
            if (currentStyle.id) {
                const { error } = await supabase
                    .from('travel_styles')
                    .update(currentStyle)
                    .eq('id', currentStyle.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('travel_styles')
                    .insert([currentStyle]);
                if (error) throw error;
            }

            setIsEditing(false);
            await fetchStyles();
            router.refresh();
            alert('Travel style saved successfully.');
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this travel style?')) {
            const { error } = await supabase.from('travel_styles').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else {
                await fetchStyles();
                router.refresh();
            }
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!supabase || !file) return;
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `style-${Math.random()}.${fileExt}`;
            const filePath = `site-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('trips')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('trips')
                .getPublicUrl(filePath);

            setCurrentStyle(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert('Image upload failed.');
        } finally {
            setIsUploading(false);
        }
    };

    const normalizeImageUrl = (url: string | undefined): string | null => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
        if (url.startsWith('bhutan/')) return `/images/${url}`;
        return `/${url}`;
    };

    if (loading && !isEditing) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Curating Aesthetic Styles...</p>
            </div>
        );
    }

    return (
        <div className="admin-styles-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Travel Styles</h1>
                    <p className="subtitle">Manage the carousel of travel categories on the homepage.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add" onClick={() => {
                        setCurrentStyle({ name: '', image_url: '', sort_order: styles.length });
                        setIsEditing(true);
                    }}>
                        + Add Travel Style
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="styles-grid-admin">
                    {styles.map(s => (
                        <div key={s.id} className="style-card-admin">
                            <div className="s-image">
                                {normalizeImageUrl(s.image_url) ? (
                                    <Image src={normalizeImageUrl(s.image_url)!} alt={s.name} fill style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div className="placeholder">No Image</div>
                                )}
                                <div className="s-overlay">
                                    <h3>{s.name}</h3>
                                </div>
                            </div>
                            <div className="s-footer">
                                <span>Order: {s.sort_order}</span>
                                <div className="s-actions">
                                    <button className="btn-edit-small" onClick={() => { setCurrentStyle(s); setIsEditing(true); }}>Edit</button>
                                    <button className="btn-delete-small" onClick={() => handleDelete(s.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {styles.length === 0 && <p className="empty-state">No travel styles defined. Add your first category.</p>}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="style-form" onSubmit={handleSave}>
                        <h2 className="serif-title">Style Architect</h2>
                        
                        <div className="form-group">
                            <label>Style Name (e.g. Wellness Retreat)</label>
                            <input 
                                type="text" 
                                value={currentStyle.name} 
                                onChange={e => setCurrentStyle({...currentStyle, name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Visual Identity (Card Image)</label>
                            <div className="image-uploader-large" onClick={() => fileInputRef.current?.click()}>
                                {isUploading ? (
                                    <div className="uploading">Uploading...</div>
                                ) : normalizeImageUrl(currentStyle.image_url) ? (
                                    <Image src={normalizeImageUrl(currentStyle.image_url)!} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(currentStyle.image_url)?.startsWith('data:')} />
                                ) : (
                                    <div className="upload-prompt">Click to Select Style Image</div>
                                )}
                                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Display Sequence (Order Index)</label>
                            <input 
                                type="number" 
                                value={currentStyle.sort_order} 
                                onChange={e => setCurrentStyle({...currentStyle, sort_order: Number(e.target.value)})}
                            />
                        </div>

                        <div className="editor-footer">
                            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-save" disabled={isSaving || isUploading}>
                                {isSaving ? 'Saving...' : 'Save Travel Style'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .admin-styles-container { padding: 40px 0; }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 50px;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 30px;
                }
                .serif-title { font-family: var(--font-playfair), serif; font-size: 32px; margin: 0; }
                .subtitle { color: #888; font-size: 15px; margin-top: 5px; }
                .btn-add {
                    background: #111;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .styles-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
                .style-card-admin { background: white; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
                .s-image { height: 350px; position: relative; background: #fafafa; }
                .s-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 30px; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); color: white; }
                .s-overlay h3 { margin: 0; font-size: 20px; font-weight: 700; }
                .placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #ccc; font-size: 11px; text-transform: uppercase; }
                .s-footer { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; }
                .s-footer span { font-size: 11px; font-weight: 700; color: #aaa; }
                .s-actions { display: flex; gap: 8px; }
                .btn-edit-small, .btn-delete-small { padding: 6px 12px; border-radius: 4px; font-size: 11px; font-weight: 700; cursor: pointer; }
                .btn-edit-small { background: white; border: 1px solid #ddd; }
                .btn-delete-small { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }

                .editor-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; z-index: 2000; padding: 80px 40px; overflow-y: auto; }
                .style-form { max-width: 500px; margin: 0 auto; }
                .form-group { margin-bottom: 25px; }
                .form-group label { display: block; font-size: 13px; font-weight: 700; color: #555; margin-bottom: 8px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; font-size: 15px; }
                
                .image-uploader-large { width: 100%; aspect-ratio: 4/5; background: #f9f9f9; border: 2px dashed #eee; border-radius: 12px; position: relative; overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .upload-prompt { font-size: 12px; color: #999; font-weight: 700; }
                
                .editor-footer { margin-top: 40px; display: flex; gap: 15px; }
                .btn-save { background: #111; color: white; border: none; padding: 14px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; }
                .btn-cancel { background: white; border: 1px solid #ddd; padding: 14px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; }

                .admin-loader { text-align: center; padding: 100px; }
                .spinner { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #111; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .empty-state { text-align: center; padding: 60px; color: #888; border: 2px dashed #eee; border-radius: 12px; grid-column: 1 / -1; }
            `}</style>
        </div>
    );
}
