'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    main_image?: string;
    status: string;
    created_at: string;
}

export default function TravelBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <main className="our-story-page page-with-header">
            <Header theme="light" />

            <section className="story-hero-refined">
                <div className="story-hero-bg">
                    <Image src="/images/bhutan/main2.webp" alt="Travel journal" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined text-center">
                    <h1 className="serif-title">Travel Blog</h1>
                </div>
            </section>

            <div className="narrative-grid container">
                <section>
                    <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                        <h2>Latest Reads</h2>
                    </div>
                    
                    <div className="connect-card-grid">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/travel-blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <article className="connect-card" style={{ padding: '0', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', height: '260px' }}>
                                        <Image 
                                            src={(post.main_image?.startsWith('http') ? post.main_image : `/images/${post.main_image || 'bhutan/18.webp'}`)} 
                                            alt={post.title} 
                                            fill 
                                            sizes="33vw" 
                                            style={{ objectFit: 'cover' }} 
                                        />
                                    </div>
                                    <div style={{ padding: '28px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: '900' }}>{post.title}</h3>
                                        <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>{post.excerpt}</p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
            <Footer />
        </main>
    );
}
