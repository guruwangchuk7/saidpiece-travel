'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
    id: string;
    title: string;
    content: string;
    category: string;
    author_name: string;
    featured_image?: string;
    created_at: string;
}

export default function DynamicBlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!supabase || !slug) return;
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Opening journal...</div>;
    if (!post) return <div style={{ padding: '100px', textAlign: 'center' }}>Story not found. <Link href="/travel-blog">Return to Blog</Link></div>;

    return (
        <main className="blog-post-page page-with-header">
            <Header theme="light" />

            <article style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 20px' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#008080' }}>
                        {post.category || 'Field Notes'}
                    </span>
                    <h1 style={{ 
                        fontSize: '48px', 
                        fontFamily: 'var(--font-playfair), serif', 
                        marginTop: '20px',
                        marginBottom: '30px',
                        lineHeight: '1.2'
                    }}>
                        {post.title}
                    </h1>
                    <div style={{ fontSize: '14px', color: '#888', fontWeight: '400' }}>
                        By {post.author_name || 'Saidpiece Team'} • {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </header>

                <div style={{ 
                    position: 'relative', 
                    height: '500px', 
                    width: '100vw', 
                    left: '50%', 
                    right: '50%', 
                    marginLeft: '-50vw', 
                    marginRight: '-50vw',
                    marginBottom: '80px'
                }}>
                    <Image 
                        src={(post.featured_image?.startsWith('http') ? post.featured_image : `/images/bhutan/main2.webp`)} 
                        alt={post.title} 
                        fill 
                        style={{ objectFit: 'cover' }} 
                        priority 
                    />
                </div>

                <div 
                    className="blog-rich-text"
                    style={{ 
                        fontSize: '18px', 
                        lineHeight: '1.8', 
                        color: '#333',
                        fontFamily: 'var(--font-lato), sans-serif'
                    }}
                >
                    {/* Render content - assuming basic paragraphs for now, could be markdown later */}
                    {post.content.split('\n').map((para, i) => (
                        <p key={i} style={{ marginBottom: '25px' }}>{para}</p>
                    ))}
                </div>

                <footer style={{ marginTop: '100px', paddingTop: '40px', borderTop: '1px solid #eee', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '30px', letterSpacing: '1px' }}>More from the Journal</h3>
                    <Link href="/travel-blog" className="btn btn-outline">Back to All Stories</Link>
                </footer>
            </article>

            <Footer />
        </main>
    );
}
