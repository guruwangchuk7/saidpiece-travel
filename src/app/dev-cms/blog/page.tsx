'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author_name: string;
    featured_image: string;
    category: string;
    is_published: boolean;
    created_at: string;
}

export default function DevBlogManager() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
        title: '',
        excerpt: '',
        content: '',
        author_name: '',
        category: 'Bhutan Travel Guide',
        is_published: true
    });

    useEffect(() => {
        fetchData();
        // FORCE UNLOCK: After 1.5s, let the user see the page no matter what
        const unlock = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(unlock);
    }, []);

    const fetchData = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching blog:', error);
            else setPosts(data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            ...currentPost,
            slug: currentPost.slug || currentPost.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        };

        if (!supabase) return;
        let result;
        if (currentPost.id) {
            result = await supabase.from('blog_posts').update(postData).eq('id', currentPost.id);
        } else {
            result = await supabase.from('blog_posts').insert([postData]);
        }

        if (result.error) alert('Error: ' + result.error.message);
        else { setIsEditing(false); fetchData(); }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this article?')) {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else fetchData();
        }
    };

    if (loading && !isEditing) return <div>Loading articles...</div>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '32px' }}>Insights (Blog) Manager</h1>
                {!isEditing && (
                    <button 
                        onClick={() => { setCurrentPost({ title: '', excerpt: '', content: '', author_name: '', category: 'Bhutan Travel Guide', is_published: true }); setIsEditing(true); }}
                        style={{ padding: '12px 25px', background: '#008080', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Write New Post
                    </button>
                )}
            </div>

            {!isEditing ? (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#fcfaf7', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '20px', fontSize: '11px', textTransform: 'uppercase', color: '#999' }}>Article Title</th>
                                <th style={{ padding: '20px', fontSize: '11px', textTransform: 'uppercase', color: '#999' }}>Category</th>
                                <th style={{ padding: '20px', fontSize: '11px', textTransform: 'uppercase', color: '#999' }}>Status</th>
                                <th style={{ padding: '20px', fontSize: '11px', textTransform: 'uppercase', color: '#999' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '20px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                                        <div style={{ fontSize: '12px', color: '#888' }}>By {post.author_name}</div>
                                    </td>
                                    <td style={{ padding: '20px', fontSize: '14px' }}>{post.category}</td>
                                    <td style={{ padding: '20px' }}>
                                        <span style={{ 
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                                            background: post.is_published ? '#e6f7f7' : '#f5f5f5', color: post.is_published ? '#008080' : '#888'
                                        }}>
                                            {post.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px' }}>
                                        <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} style={{ marginRight: '10px', background: 'none', border: 'none', color: '#008080', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                                        <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eee', maxWidth: '1000px' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '25px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Article Title</label>
                            <input type="text" value={currentPost.title} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentPost({...currentPost, title: e.target.value})} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Author</label>
                                <input type="text" value={currentPost.author_name} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentPost({...currentPost, author_name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Category</label>
                                <select value={currentPost.category} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentPost({...currentPost, category: e.target.value})}>
                                    <option value="Bhutan Travel Guide">Travel Guide</option>
                                    <option value="Cultural Stories">Cultural Stories</option>
                                    <option value="Adventure Blog">Adventure Blog</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Short Teaser / Excerpt</label>
                            <textarea value={currentPost.excerpt} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '80px' }} onChange={e => setCurrentPost({...currentPost, excerpt: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>Full Story Content</label>
                            <textarea value={currentPost.content} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '300px' }} onChange={e => setCurrentPost({...currentPost, content: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <button type="submit" style={{ padding: '15px 40px', background: '#008080', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Article</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '15px 40px', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
