'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    main_image: string;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    author_id: string;
}

export default function BlogManager() {
    const router = useRouter();
    const { isStaff, user } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        main_image: '',
        status: 'published'
    });
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isStaff) {
            fetchPosts();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchPosts = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving) return;

        const slug = currentPost.slug || currentPost.title?.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');
            
        const postData = {
            title: currentPost.title,
            slug: slug,
            excerpt: currentPost.excerpt || '',
            content: JSON.stringify({
                subtitle: (currentPost as any).subtitle || '',
                sections: (currentPost as any).sections || []
            }),
            main_image: currentPost.main_image || '',
            status: currentPost.status || 'draft',
            author_id: currentPost.author_id || user?.id,
            updated_at: new Date().toISOString(),
            published_at: currentPost.status === 'published' ? (currentPost.published_at || new Date().toISOString()) : null
        };

        if (!supabase) {
            alert('Supabase connection missing.');
            return;
        }

        setIsSaving(true);
        try {
            let result;
            if (currentPost.id) {
                result = await supabase
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', currentPost.id);
            } else {
                result = await supabase
                    .from('blog_posts')
                    .insert([postData]);
            }

            if (result.error) throw result.error;

            setIsEditing(false);
            await fetchPosts();
            router.refresh();
            alert('Article saved successfully.');
        } catch (error: any) {
            console.error('Error saving article:', error);
            alert('Error saving article: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Permanently delete this article?')) {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else {
                await fetchPosts();
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
            const filePath = `blog-images/${fileName}`;

            // We attempt to upload to 'blog_posts' bucket.
            const { error: uploadError } = await supabase.storage
                .from('blog_posts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('blog_posts')
                .getPublicUrl(filePath);

            setCurrentPost(prev => ({ ...prev, main_image: publicUrl }));
        } catch (error: any) {
            console.error('Upload failed:', error);
            // Fallback: If bucket doesn't exist, we'll just use a local data URL for preview demonstration
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentPost(prev => ({ ...prev, main_image: e.target?.result as string }));
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
            alert('Note: Storage bucket "blog_posts" not found. Using local preview for now.');
            return; // Exit early to avoid finally setting uploading to false before reader finishes
        }
        setIsUploading(false);
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
                <p>Syncing Travel Journals...</p>
            </div>
        );
    }

    return (
        <div className="blog-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Insights Management</h1>
                    <p className="subtitle">Publish stories that inspire meaningful travel to Bhutan.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add-story" onClick={() => {
                        setCurrentPost({
                            title: '', slug: '', excerpt: '', content: '', main_image: '', status: 'draft'
                        });
                        setIsEditing(true);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Draft New Insight
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="blog-inventory-grid">
                    {posts.map(post => (
                        <div key={post.id} className="inventory-card">
                            <div className="card-image">
                                {normalizeImageUrl(post.main_image) ? (
                                    <Image src={normalizeImageUrl(post.main_image)!} alt={post.title} fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(post.main_image)?.startsWith('data:')} />
                                ) : (
                                    <div className="img-placeholder">Cover Image</div>
                                )}
                                <div className={`status-badge ${post.status}`}>
                                    {post.status}
                                </div>
                            </div>
                            <div className="card-content">
                                <h3 className="card-title">{post.title}</h3>
                                <p className="card-excerpt">{post.excerpt || 'No excerpt provided...'}</p>
                                <div className="card-footer">
                                    <span className="date">{new Date(post.created_at).toLocaleDateString()}</span>
                                    <div className="card-actions">
                                        <button className="btn-edit" onClick={() => { 
                                            let postToEdit = { ...post };
                                            try {
                                                const parsed = JSON.parse(post.content);
                                                (postToEdit as any).subtitle = parsed.subtitle || '';
                                                (postToEdit as any).sections = parsed.sections || [];
                                            } catch (e) {
                                                // Legacy content fallback
                                                (postToEdit as any).sections = [{ type: 'text', value: post.content }];
                                            }
                                            setCurrentPost(postToEdit); 
                                            setIsEditing(true); 
                                        }}>Edit Story</button>
                                        <button className="btn-delete" onClick={() => handleDelete(post.id)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="blog-editor-form" onSubmit={handleSave}>
                        <div className="editor-sidebar">
                            <div 
                                className={`image-dropzone ${isUploading ? 'uploading' : ''}`}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={onDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <div className="upload-loader">Uploading...</div>
                                ) : normalizeImageUrl(currentPost.main_image) ? (
                                    <>
                                        <Image src={normalizeImageUrl(currentPost.main_image)!} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized={normalizeImageUrl(currentPost.main_image)?.startsWith('data:')} />
                                        <div className="dropzone-overlay">Change Cover Image</div>
                                    </>
                                ) : (
                                    <div className="dropzone-prompt">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        <p>Drop Story Cover</p>
                                        <span>Click to browse</span>
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
                                <label>Publication Status</label>
                                <select value={currentPost.status || 'draft'} onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value as any })}>
                                    <option value="draft">Draft - Private</option>
                                    <option value="published">Published - Live</option>
                                </select>
                            </div>
                        </div>

                        <div className="editor-main">
                            <div className="editor-header">
                                <h2 className="serif-title">Journal Architect</h2>
                                <div className="editor-controls">
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</button>
                                    <button type="submit" className="btn-save" disabled={isSaving || isUploading}>
                                        {isSaving ? 'Saving Article...' : 'Save & Close'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-sections">
                                <div className="section">
                                    <div className="form-item">
                                        <label>Story Title</label>
                                        <input 
                                            type="text" 
                                            className="title-input"
                                            value={currentPost.title} 
                                            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })} 
                                            placeholder="The Sacred Rhythm of Paro..." 
                                            required 
                                        />
                                    </div>
                                    <div className="form-item" style={{ marginTop: '20px' }}>
                                        <label>Story Subtitle</label>
                                        <input 
                                            type="text" 
                                            value={(currentPost as any).subtitle || ''} 
                                            onChange={(e) => setCurrentPost({ ...currentPost, subtitle: e.target.value } as any)} 
                                            placeholder="Exploring the hidden sanctuaries..." 
                                        />
                                    </div>
                                    <div className="form-item" style={{ marginTop: '20px' }}>
                                        <label>Slug (URL Identifier)</label>
                                        <input 
                                            type="text" 
                                            className="slug-input"
                                            value={currentPost.slug} 
                                            onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })} 
                                            placeholder="the-sacred-rhythm-of-paro" 
                                        />
                                    </div>
                                </div>

                                <div className="section">
                                    <h4>Briefing</h4>
                                    <div className="form-item">
                                        <label>Excerpt / Summary</label>
                                        <textarea 
                                            rows={3} 
                                            value={currentPost.excerpt} 
                                            onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })} 
                                            placeholder="A short hook for the blog grid..."
                                        />
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="section-header-flex">
                                        <h4>Narrative Architecture</h4>
                                        <div className="section-add-controls">
                                            <button type="button" className="btn-add-block" onClick={() => {
                                                const sections = (currentPost as any).sections || [];
                                                setCurrentPost({ ...currentPost, sections: [...sections, { type: 'text', value: '' }] } as any);
                                            }}>+ Text</button>
                                            <button type="button" className="btn-add-block" onClick={() => {
                                                const sections = (currentPost as any).sections || [];
                                                setCurrentPost({ ...currentPost, sections: [...sections, { type: 'subtitle', value: '' }] } as any);
                                            }}>+ Subtitle</button>
                                            <button type="button" className="btn-add-block" onClick={() => {
                                                const sections = (currentPost as any).sections || [];
                                                setCurrentPost({ ...currentPost, sections: [...sections, { type: 'image', url: '', caption: '' }] } as any);
                                            }}>+ Image</button>
                                        </div>
                                    </div>

                                    <div className="dynamic-sections">
                                        {((currentPost as any).sections || []).map((sec: any, idx: number) => (
                                            <div key={idx} className="block-item">
                                                <div className="block-header">
                                                    <span>Block #{idx + 1}: {sec.type}</span>
                                                    <button type="button" className="btn-remove-block" onClick={() => {
                                                        const sections = [...(currentPost as any).sections];
                                                        sections.splice(idx, 1);
                                                        setCurrentPost({ ...currentPost, sections } as any);
                                                    }}>×</button>
                                                </div>
                                                
                                                {sec.type === 'text' && (
                                                    <textarea 
                                                        rows={6}
                                                        value={sec.value}
                                                        onChange={(e) => {
                                                            const sections = [...(currentPost as any).sections];
                                                            sections[idx].value = e.target.value;
                                                            setCurrentPost({ ...currentPost, sections } as any);
                                                        }}
                                                        placeholder="Enter narrative text..."
                                                    />
                                                )}

                                                {sec.type === 'subtitle' && (
                                                    <input 
                                                        type="text"
                                                        value={sec.value}
                                                        onChange={(e) => {
                                                            const sections = [...(currentPost as any).sections];
                                                            sections[idx].value = e.target.value;
                                                            setCurrentPost({ ...currentPost, sections } as any);
                                                        }}
                                                        placeholder="Enter section subtitle..."
                                                    />
                                                )}

                                                {sec.type === 'image' && (
                                                    <div className="block-image-inputs">
                                                        <input 
                                                            type="text"
                                                            value={sec.url}
                                                            onChange={(e) => {
                                                                const sections = [...(currentPost as any).sections];
                                                                sections[idx].url = e.target.value;
                                                                setCurrentPost({ ...currentPost, sections } as any);
                                                            }}
                                                            placeholder="Image URL (e.g., bhutan/main3.webp)"
                                                        />
                                                        <input 
                                                            type="text"
                                                            value={sec.caption}
                                                            onChange={(e) => {
                                                                const sections = [...(currentPost as any).sections];
                                                                sections[idx].caption = e.target.value;
                                                                setCurrentPost({ ...currentPost, sections } as any);
                                                            }}
                                                            placeholder="Image Caption (optional)"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {(!(currentPost as any).sections || (currentPost as any).sections.length === 0) && (
                                            <div className="block-placeholder">
                                                No content blocks yet. Use the buttons above to build your story.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .blog-admin-container {
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
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .btn-add-story {
                        width: 100%;
                        justify-content: center;
                    }
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
                }
                .btn-add-story {
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
                }

                .blog-inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                    gap: 30px;
                }
                @media (max-width: 400px) {
                    .blog-inventory-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .inventory-card {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: all 0.2s ease;
                }
                .inventory-card:hover {
                    border-color: #d4c8b0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .card-image {
                    height: 160px;
                    position: relative;
                    background: #f9f9f9;
                }
                .status-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .status-badge.published { background: #e6fffa; color: #008080; }
                .status-badge.draft { background: #eee; color: #888; }

                .card-content {
                    padding: 20px;
                }
                .card-title {
                    font-family: var(--font-playfair), serif;
                    font-size: 19px;
                    margin-bottom: 10px;
                    line-height: 1.3;
                    height: 50px;
                    overflow: hidden;
                }
                .card-excerpt {
                    font-size: 13px;
                    color: #777;
                    margin-bottom: 25px;
                    height: 36px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 15px;
                    border-top: 1px solid #f9f9f9;
                }
                .date { font-size: 11px; color: #bbb; font-weight: 600; }
                .card-actions { display: flex; gap: 8px; }
                .btn-edit {
                    padding: 6px 15px;
                    border: 1px solid #eee;
                    background: white;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-delete {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ffebeb;
                    color: #d32f2f;
                    border-radius: 4px;
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
                @media (max-width: 1024px) {
                    .editor-overlay {
                        padding: 40px;
                    }
                }
                @media (max-width: 768px) {
                    .editor-overlay {
                        padding: 100px 20px 40px;
                    }
                }
                .blog-editor-form {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 80px;
                }
                @media (max-width: 1100px) {
                    .blog-editor-form {
                        gap: 40px;
                        grid-template-columns: 280px 1fr;
                    }
                }
                @media (max-width: 900px) {
                    .blog-editor-form {
                        display: flex;
                        flex-direction: column;
                        gap: 40px;
                    }
                }
                .image-dropzone {
                    width: 100%;
                    aspect-ratio: 16/10;
                    background: #fcfcfc;
                    border: 2px dashed #eee;
                    border-radius: 8px;
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
                    padding: 8px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    text-align: center;
                    font-size: 10px;
                    font-weight: 700;
                }
                .editor-aside-group {
                    margin-top: 40px;
                }
                .editor-aside-group label {
                    display: block;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #999;
                    margin-bottom: 12px;
                }
                .editor-aside-group select {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    font-weight: 700;
                }

                .editor-header h2 { font-size: 28px; margin: 0 0 40px; }
                .editor-controls { display: flex; gap: 12px; position: fixed; top: 40px; right: 60px; }
                @media (max-width: 768px) {
                    .editor-header h2 { font-size: 24px; margin-bottom: 20px; }
                    .editor-controls {
                        position: static;
                        width: 100%;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .btn-cancel, .btn-save {
                        padding: 10px 15px;
                        font-size: 13px;
                    }
                }
                .btn-cancel {
                    padding: 10px 25px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-save {
                    padding: 10px 35px;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .form-sections { display: grid; gap: 40px; }
                .section h4 {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 900;
                    color: #d4c8b0;
                    margin-bottom: 20px;
                }
                .form-item label {
                    display: block;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #aaa;
                    margin-bottom: 8px;
                }
                .title-input {
                    font-family: var(--font-playfair), serif;
                    font-size: 32px !important;
                    font-weight: 700;
                    border: none !important;
                    background: none !important;
                    padding: 0 !important;
                    width: 100%;
                }
                @media (max-width: 640px) {
                    .title-input {
                        font-size: 24px !important;
                    }
                }
                .form-item input, .form-item textarea {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    background: #fafafa;
                }
                .form-item textarea { font-family: inherit; line-height: 1.6; }

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

                /* Dynamic Sections Styling */
                .section-header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 15px;
                }
                .section-add-controls {
                    display: flex;
                    gap: 8px;
                }
                .btn-add-block {
                    background: #fdfcf9;
                    border: 1px solid #d4c8b0;
                    color: #7c6f55;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-add-block:hover {
                    background: #111;
                    color: white;
                    border-color: #111;
                }
                
                .dynamic-sections {
                    display: grid;
                    gap: 20px;
                }
                .block-item {
                    background: #fcfcfc;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    padding: 20px;
                    position: relative;
                }
                .block-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: #bbb;
                }
                .btn-remove-block {
                    background: none;
                    border: none;
                    color: #ff5f56;
                    font-size: 20px;
                    cursor: pointer;
                    line-height: 1;
                }
                .block-image-inputs {
                    display: grid;
                    gap: 12px;
                }
                .block-placeholder {
                    padding: 40px;
                    text-align: center;
                    border: 2px dashed #f0f0f0;
                    border-radius: 12px;
                    color: #ccc;
                    font-style: italic;
                    font-size: 14px;
                }
            `}</style>
        </div>
    );
}
