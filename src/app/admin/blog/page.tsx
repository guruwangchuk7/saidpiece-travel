'use client';

import { useState, useEffect } from 'react';

export default function InfraredBlogManager() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        
        try {
            // FIX: Using Infrared Raw-Fetch to bypass RLS 'blindness'
            const res = await fetch(`${url}/rest/v1/blog_posts?select=*&order=created_at.desc`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setPosts(data);
            }
        } catch (e) {
            console.error('Fetch Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', textTransform: 'uppercase' }}>Insights Manager</h1>
                    <p style={{ color: '#888' }}>Manage stories, field notes, and travel journals.</p>
                </div>
                <button style={{ padding: '12px 25px', background: '#111', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + NEW STORY
                </button>
            </div>

            <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #eaeaea', textAlign: 'left' }}>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Article</th>
                            <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#999' }}>Status</th>
                            <th style={{ padding: '20px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                                <td style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#eee', backgroundImage: `url(/assets/${post.main_image})`, backgroundSize: 'cover' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{post.title}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{post.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '20px' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', background: '#e6fffa', color: '#008080', borderRadius: '4px', textTransform: 'uppercase' }}>
                                        {post.status}
                                    </span>
                                </td>
                                <td style={{ padding: '20px', textAlign: 'right' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && !loading && (
                            <tr>
                                <td colSpan={3} style={{ padding: '80px', textAlign: 'center', color: '#ccc' }}>No articles found. Ready to sync?</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
