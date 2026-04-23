'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Service {
    id: string;
    title: string;
    description: string;
    link_text: string;
    link_url: string;
    image_url: string;
    sort_order: number;
}

export default function ServiceManager() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({
        title: '',
        description: '',
        link_text: '',
        link_url: '',
        image_url: '',
        sort_order: 0
    });
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isStaff) {
            fetchServices();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchServices = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('homepage_services')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setServices(data || []);
        } catch (e) {
            console.error('Error fetching services:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving || !supabase) return;

        setIsSaving(true);
        try {
            if (currentService.id) {
                const { error } = await supabase
                    .from('homepage_services')
                    .update(currentService)
                    .eq('id', currentService.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('homepage_services')
                    .insert([currentService]);
                if (error) throw error;
            }

            setIsEditing(false);
            await fetchServices();
            router.refresh();
            alert('Service block saved successfully.');
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this service block?')) {
            const { error } = await supabase.from('homepage_services').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else {
                await fetchServices();
                router.refresh();
            }
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!supabase || !file) return;
        setIsUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `service-${Math.random()}.${fileExt}`;
            const filePath = `site-assets/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('trips')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('trips')
                .getPublicUrl(filePath);

            setCurrentService(prev => ({ ...prev, image_url: publicUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Check storage permissions.');
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
                <p>Syncing Service Architecture...</p>
            </div>
        );
    }

    return (
        <div className="admin-services-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Service Blocks</h1>
                    <p className="subtitle">Manage the &quot;What Makes Us Different&quot; section on the homepage.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add" onClick={() => {
                        setCurrentService({ title: '', description: '', link_text: '', link_url: '', image_url: '', sort_order: services.length });
                        setIsEditing(true);
                    }}>
                        + Add Service Block
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="services-grid-admin">
                    {services.map(s => (
                        <div key={s.id} className="service-card-admin">
                            <div className="s-image">
                                {normalizeImageUrl(s.image_url) ? (
                                    <Image src={normalizeImageUrl(s.image_url)!} alt={s.title} fill style={{ objectFit: 'cover' }} />
                                ) : (
                                    <div className="placeholder">No Image</div>
                                )}
                            </div>
                            <div className="s-content">
                                <h3>{s.title}</h3>
                                <p>{s.description}</p>
                                <div className="s-meta">
                                    <span>Link: {s.link_text || 'None'}</span>
                                    <span>Order: {s.sort_order}</span>
                                </div>
                                <div className="s-actions">
                                    <button className="btn-edit-small" onClick={() => { setCurrentService(s); setIsEditing(true); }}>Edit</button>
                                    <button className="btn-delete-small" onClick={() => handleDelete(s.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {services.length === 0 && <p className="empty-state">No service blocks defined. Add your first differentiator.</p>}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="service-form" onSubmit={handleSave}>
                        <h2 className="serif-title">Differentiator Architect</h2>
                        
                        <div className="form-layout-split">
                            <div className="form-main">
                                <div className="form-group">
                                    <label>Title / Heading</label>
                                    <input 
                                        type="text" 
                                        value={currentService.title} 
                                        onChange={e => setCurrentService({...currentService, title: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description Narrative</label>
                                    <textarea 
                                        rows={4}
                                        value={currentService.description} 
                                        onChange={e => setCurrentService({...currentService, description: e.target.value})}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Button Text</label>
                                        <input 
                                            type="text" 
                                            value={currentService.link_text} 
                                            onChange={e => setCurrentService({...currentService, link_text: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Target URL</label>
                                        <input 
                                            type="text" 
                                            value={currentService.link_url} 
                                            onChange={e => setCurrentService({...currentService, link_url: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-aside">
                                <div className="image-uploader" onClick={() => fileInputRef.current?.click()}>
                                    {isUploading ? (
                                        <div className="uploading">Uploading...</div>
                                    ) : normalizeImageUrl(currentService.image_url) ? (
                                        <Image src={normalizeImageUrl(currentService.image_url)!} alt="Preview" fill style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div className="upload-prompt">Click to Upload Image</div>
                                    )}
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                                </div>
                                <div className="form-group" style={{ marginTop: '20px' }}>
                                    <label>Display Order</label>
                                    <input 
                                        type="number" 
                                        value={currentService.sort_order} 
                                        onChange={e => setCurrentService({...currentService, sort_order: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="editor-footer">
                            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-save" disabled={isSaving || isUploading}>
                                {isSaving ? 'Publishing...' : 'Publish Service Block'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .admin-services-container { padding: 40px 0; }
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

                .services-grid-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
                .service-card-admin { background: white; border: 1px solid #eee; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
                .s-image { height: 180px; position: relative; background: #fafafa; }
                .placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #ccc; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
                .s-content { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
                .s-content h3 { font-size: 18px; margin: 0 0 10px; }
                .s-content p { font-size: 13px; color: #666; line-height: 1.5; margin-bottom: 20px; flex-grow: 1; }
                .s-meta { display: flex; justify-content: space-between; font-size: 11px; color: #999; font-weight: 700; margin-bottom: 20px; }
                .s-actions { display: flex; gap: 10px; }
                .btn-edit-small, .btn-delete-small { flex: 1; padding: 8px; border-radius: 6px; font-size: 12px; font-weight: 700; cursor: pointer; }
                .btn-edit-small { background: white; border: 1px solid #ddd; }
                .btn-delete-small { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }

                .editor-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; z-index: 2000; padding: 60px; overflow-y: auto; }
                .service-form { max-width: 1000px; margin: 0 auto; }
                .form-layout-split { display: grid; grid-template-columns: 1fr 300px; gap: 40px; margin-top: 40px; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; font-size: 13px; font-weight: 700; color: #555; margin-bottom: 8px; }
                .form-group input, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #eee; border-radius: 8px; font-size: 15px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                
                .image-uploader { width: 100%; aspect-ratio: 1; background: #f9f9f9; border: 2px dashed #eee; border-radius: 12px; position: relative; overflow: hidden; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                .upload-prompt { font-size: 12px; color: #999; font-weight: 700; }
                
                .editor-footer { margin-top: 40px; display: flex; gap: 15px; }
                .btn-save { background: #111; color: white; border: none; padding: 14px 40px; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; }
                .btn-cancel { background: white; border: 1px solid #ddd; padding: 14px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; }

                .admin-loader { text-align: center; padding: 100px; }
                .spinner { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #111; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .empty-state { text-align: center; padding: 60px; color: #888; border: 2px dashed #eee; border-radius: 12px; grid-column: 1 / -1; }

                @media (max-width: 768px) {
                    .form-layout-split { grid-template-columns: 1fr; }
                    .form-aside { order: -1; }
                    .editor-overlay { padding: 20px; }
                }
            `}</style>
        </div>
    );
}
