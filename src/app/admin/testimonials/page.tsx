'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Testimonial {
    id: string;
    client_name: string;
    role: string;
    content: string;
    rating: number;
    is_featured: boolean;
}

export default function TestimonialManager() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTest, setCurrentTest] = useState<Partial<Testimonial>>({
        client_name: '',
        role: '',
        content: '',
        rating: 5,
        is_featured: false
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isStaff) {
            fetchTestimonials();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchTestimonials = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (e) {
            console.error('Error fetching testimonials:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving || !supabase) return;

        setIsSaving(true);
        try {
            if (currentTest.id) {
                const { error } = await supabase
                    .from('testimonials')
                    .update(currentTest)
                    .eq('id', currentTest.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('testimonials')
                    .insert([currentTest]);
                if (error) throw error;
            }

            setIsEditing(false);
            await fetchTestimonials();
            router.refresh();
            alert('Testimonial saved successfully.');
        } catch (error: any) {
            alert('Error saving: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this testimonial?')) {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else {
                await fetchTestimonials();
                router.refresh();
            }
        }
    };

    if (loading && !isEditing) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Syncing Social Proof...</p>
            </div>
        );
    }

    return (
        <div className="admin-testimonials-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Traveler Voice</h1>
                    <p className="subtitle">Manage testimonials and client feedback for the homepage.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add" onClick={() => {
                        setCurrentTest({ client_name: '', role: '', content: '', rating: 5, is_featured: false });
                        setIsEditing(true);
                    }}>
                        + Add Testimonial
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="testimonials-list">
                    {testimonials.map(t => (
                        <div key={t.id} className="testimonial-card-admin">
                            <div className="t-header">
                                <div className="t-author">
                                    <strong>{t.client_name}</strong>
                                    <span>{t.role}</span>
                                </div>
                                <div className="t-status">
                                    {t.is_featured && <span className="featured-badge">Featured</span>}
                                    <div className="rating">{'★'.repeat(t.rating)}</div>
                                </div>
                            </div>
                            <p className="t-content">&quot;{t.content}&quot;</p>
                            <div className="t-actions">
                                <button className="btn-edit-small" onClick={() => { setCurrentTest(t); setIsEditing(true); }}>Edit</button>
                                <button className="btn-delete-small" onClick={() => handleDelete(t.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && <p className="empty-state">No testimonials found. Add your first client review.</p>}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="testimonial-form" onSubmit={handleSave}>
                        <h2 className="serif-title">Review Architect</h2>
                        
                        <div className="form-group">
                            <label>Client Name</label>
                            <input 
                                type="text" 
                                value={currentTest.client_name} 
                                onChange={e => setCurrentTest({...currentTest, client_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Role / Location (e.g. San Francisco, CA)</label>
                            <input 
                                type="text" 
                                value={currentTest.role} 
                                onChange={e => setCurrentTest({...currentTest, role: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Testimonial Content</label>
                            <textarea 
                                rows={5}
                                value={currentTest.content} 
                                onChange={e => setCurrentTest({...currentTest, content: e.target.value})}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Rating (1-5)</label>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="5" 
                                    value={currentTest.rating} 
                                    onChange={e => setCurrentTest({...currentTest, rating: Number(e.target.value)})}
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input 
                                        type="checkbox" 
                                        checked={currentTest.is_featured} 
                                        onChange={e => setCurrentTest({...currentTest, is_featured: e.target.checked})}
                                    />
                                    Feature on Homepage
                                </label>
                            </div>
                        </div>

                        <div className="editor-footer">
                            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-save" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Testimonial'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .admin-testimonials-container { padding: 40px 0; }
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

                .testimonials-list { display: grid; gap: 20px; }
                .testimonial-card-admin {
                    background: white;
                    border: 1px solid #eee;
                    padding: 25px;
                    border-radius: 12px;
                }
                .t-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
                .t-author { display: flex; flex-direction: column; }
                .t-author strong { font-size: 18px; color: #111; }
                .t-author span { font-size: 13px; color: #888; }
                .t-status { text-align: right; }
                .featured-badge {
                    background: #f0fdfa;
                    color: #0d9488;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-bottom: 5px;
                    display: inline-block;
                }
                .rating { color: #f59e0b; font-size: 14px; }
                .t-content { font-style: italic; color: #444; line-height: 1.6; margin-bottom: 20px; }
                .t-actions { display: flex; gap: 10px; }
                .btn-edit-small, .btn-delete-small {
                    padding: 6px 15px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-edit-small { background: white; border: 1px solid #ddd; }
                .btn-delete-small { background: #fee2e2; border: 1px solid #fecaca; color: #991b1b; }

                .editor-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 2000;
                    padding: 80px 40px;
                    overflow-y: auto;
                }
                .testimonial-form { max-width: 600px; margin: 0 auto; }
                .form-group { margin-bottom: 25px; }
                .form-group label { display: block; font-size: 14px; font-weight: 700; margin-bottom: 8px; }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    font-size: 16px;
                }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: center; }
                .checkbox-group label { display: flex; align-items: center; gap: 10px; cursor: pointer; }
                .checkbox-group input { width: auto; }
                .editor-footer { margin-top: 40px; display: flex; gap: 15px; }
                .btn-save { background: #111; color: white; border: none; padding: 14px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; flex: 1; }
                .btn-cancel { background: white; border: 1px solid #ddd; padding: 14px 30px; border-radius: 8px; font-weight: 700; cursor: pointer; }

                .admin-loader { text-align: center; padding: 100px; }
                .spinner { 
                    width: 40px; height: 40px; border: 3px solid #eee; border-top-color: #111; 
                    border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .empty-state { text-align: center; padding: 60px; color: #888; border: 2px dashed #eee; border-radius: 12px; }
            `}</style>
        </div>
    );
}
