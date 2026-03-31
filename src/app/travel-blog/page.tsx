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
    category: string;
    excerpt: string;
    featured_image?: string;
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
                .eq('is_published', true)
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
                    <Image
                        src="/images/bhutan/main2.webp"
                        alt="Travel journal from Bhutan"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined">
                    <h1 className="serif-title">Travel Blog</h1>
                </div>
            </section>

            <div className="breadcrumbs">
                <div className="container">
                    <Link href="/">Home</Link> &gt; <span>Travel Blog</span>
                </div>
            </div>

            <section className="endorsement-block container text-center">
                <h2>Journal & Insight</h2>
                <div className="forbes-quote">
                    <blockquote>
                        Stories, planning notes, and local perspective for travelers who want a deeper way into Bhutan.
                    </blockquote>
                </div>
            </section>

            <div className="narrative-grid container" style={{ paddingTop: '0' }}>
                <section className="asymmetric-row history-split">
                    <div className="column-assets portrait-frame">
                        <div className="bw-image-wrapper">
                            <Image
                                src="/images/bhutan/12.webp"
                                alt="Writer overlooking the valley"
                                fill
                                className="grayscale-historical"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="column-text">
                        <span className="date-marker">EDITOR&apos;S NOTE</span>
                        <h2 className="serif-h2">Stories Shaped by the Route</h2>
                        <p>
                            This journal is where we collect the textures around the trip itself: the timing of festivals, the feel of different valleys, and the reasons one itinerary flows better than another.
                        </p>
                        <p>
                            It is built for travelers who care about design, pacing, and cultural context as much as destination lists.
                        </p>
                        <Link href="/browse" className="btn btn-primary">Browse Trips</Link>
                    </div>
                </section>

                <section>
                    <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                        <h2>Latest Reads</h2>
                        <p>Editorial-style guides with the same visual language as the rest of the site.</p>
                    </div>
                    
                    <div className="connect-card-grid">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/travel-blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <article className="connect-card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
                                    <div style={{ position: 'relative', height: '260px' }}>
                                        <Image 
                                            src={(post.featured_image?.startsWith('http') ? post.featured_image : `/images/bhutan/18.webp`)} 
                                            alt={post.title} 
                                            fill 
                                            sizes="(max-width: 768px) 100vw, 33vw" 
                                            style={{ objectFit: 'cover' }} 
                                        />
                                    </div>
                                    <div style={{ padding: '28px' }}>
                                        <span className="card-label">{post.category || 'Field Notes'}</span>
                                        <h3 style={{ fontSize: '20px', fontWeight: '900', marginTop: '10px' }}>{post.title}</h3>
                                        <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', marginTop: '10px' }}>{post.excerpt}</p>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    {posts.length === 0 && !loading && (
                        <div style={{ padding: '80px', textAlign: 'center', color: '#999' }}>
                            Working on new stories. Check back soon.
                        </div>
                    )}
                </section>

                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">Need a Journey Behind the Story?</h2>
                    <p className="centered-paragraph">
                        Move from inspiration into planning with itineraries built around season, pace, and the kind of Bhutan you want to experience.
                    </p>
                    <div className="divider-line"></div>
                    <Link href="/browse" className="btn btn-primary large-btn">See All Trips</Link>
                </section>
            </div>

            <Footer />
        </main>
    );
}
