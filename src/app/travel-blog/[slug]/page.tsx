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
    const [scrollProgress, setScrollProgress] = useState(0);

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

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(parseFloat(scroll) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <main className="blog-post-page page-with-header bg-white">
                <Header theme="light" />
                <div className="blog-article skeleton-load">
                    <header className="blog-header container">
                        <div className="skeleton category-skeleton"></div>
                        <div className="skeleton title-skeleton"></div>
                        <div className="skeleton title-skeleton short"></div>
                        <div className="skeleton meta-skeleton"></div>
                    </header>
                    <div className="skeleton image-skeleton"></div>
                    <div className="blog-body container">
                        <div className="skeleton text-line"></div>
                        <div className="skeleton text-line"></div>
                        <div className="skeleton text-line"></div>
                        <div className="skeleton text-line short"></div>
                        <div style={{ height: '40px' }}></div>
                        <div className="skeleton text-line"></div>
                        <div className="skeleton text-line"></div>
                        <div className="skeleton text-line short"></div>
                    </div>
                </div>
                <Footer />
                <style jsx>{`
                    .skeleton {
                        background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
                        background-size: 200% 100%;
                        animation: shimmer 1.5s infinite;
                        border-radius: 4px;
                    }
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                    .category-skeleton { height: 12px; width: 80px; margin: 0 auto 25px; }
                    .title-skeleton { height: 45px; width: 80%; margin: 0 auto 15px; }
                    .title-skeleton.short { width: 50%; margin-bottom: 30px; }
                    .meta-skeleton { height: 14px; width: 200px; margin: 0 auto; }
                    .image-skeleton { height: 70vh; width: 100%; margin-bottom: 80px; }
                    .text-line { height: 18px; width: 100%; margin-bottom: 20px; }
                    .text-line.short { width: 60%; }
                `}</style>
                <style jsx>{`
                    .blog-article {
                        padding-top: 160px;
                        padding-bottom: 100px;
                    }
                    .blog-header {
                        max-width: 900px;
                        margin: 0 auto 60px;
                        text-align: center;
                    }
                    .blog-body {
                        max-width: 740px;
                        margin: 0 auto;
                        padding: 0 20px;
                    }
                `}</style>
            </main>
        );
    }

    if (!post) return <div style={{ padding: '100px', textAlign: 'center' }}>Story not found. <Link href="/travel-blog">Return to Blog</Link></div>;

    return (
        <main className="blog-post-page page-with-header bg-white">
            <Header theme="light" />
            
            {/* Scroll Progress Bar */}
            <div className="scroll-progress-container" style={{
                position: 'fixed',
                top: '90px', // Header height
                left: 0,
                width: '100%',
                height: '3px',
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.05)'
            }}>
                <div className="scroll-progress-bar" style={{
                    height: '100%',
                    backgroundColor: 'var(--color-brand)',
                    width: `${scrollProgress}%`,
                    transition: 'width 0.1s ease-out'
                }} />
            </div>

            <article className="blog-article">
                <header className="blog-header container">
                    <div className="category-tag">{post.category || 'Field Notes'}</div>
                    <h1 className="blog-title serif-title">{post.title}</h1>
                    <div className="blog-meta">
                        <span className="author">By {post.author_name || 'Saidpiece Team'}</span>
                        <span className="separator">•</span>
                        <span className="date">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </header>

                <div className="featured-image-wrapper">
                    <Image
                        src={(post.featured_image?.startsWith('http') ? post.featured_image : `/images/bhutan/main2.webp`)}
                        alt={post.title}
                        fill
                        className="featured-image"
                        priority
                    />
                </div>

                <div className="blog-body container">
                    <div className="blog-content-inner">
                        {post.content.split('\n').map((para, i) => {
                            if (!para.trim()) return null;
                            return (
                                <p key={i} className={i === 0 ? 'first-paragraph' : ''}>
                                    {para}
                                </p>
                            );
                        })}
                    </div>
                </div>

                <footer className="blog-footer container">
                    <div className="footer-content">
                        <h3>More from the Journal</h3>
                        <Link href="/travel-blog" className="btn btn-outline">Back to All Stories</Link>
                    </div>
                </footer>
            </article>

            <Footer />

            <style jsx>{`
                .blog-article {
                    padding-top: 160px;
                    padding-bottom: 100px;
                }
                .blog-header {
                    max-width: 900px;
                    margin: 0 auto 60px;
                    text-align: center;
                }
                .category-tag {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    color: var(--color-brand);
                    margin-bottom: 25px;
                    opacity: 0.8;
                }
                .blog-title {
                    font-size: clamp(32px, 5vw, 56px);
                    line-height: 1.15;
                    margin-bottom: 30px;
                    color: #1a1a1a;
                }
                .blog-meta {
                    font-size: 14px;
                    color: #666;
                    letter-spacing: 0.5px;
                }
                .blog-meta .separator {
                    margin: 0 12px;
                    opacity: 0.4;
                }
                .featured-image-wrapper {
                    position: relative;
                    height: 70vh;
                    min-height: 500px;
                    width: 100%;
                    margin-bottom: 80px;
                    overflow: hidden;
                }
                .featured-image {
                    object-fit: cover;
                }
                .blog-body {
                    max-width: 740px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                .blog-content-inner {
                    font-size: 20px;
                    line-height: 1.85;
                    color: #2c2c2c;
                    font-family: 'Georgia', serif; /* Classic reading font */
                }
                .blog-content-inner p {
                    margin-bottom: 35px;
                }
                .first-paragraph::first-letter {
                    float: left;
                    font-size: 84px;
                    line-height: 1;
                    margin: 8px 12px 0 0;
                    font-family: var(--font-playfair);
                    color: var(--color-brand);
                }
                .blog-footer {
                    max-width: 740px;
                    margin: 100px auto 0;
                    padding-top: 60px;
                    border-top: 1px solid #f0f0f0;
                    text-align: center;
                }
                .footer-content h3 {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 30px;
                    color: #999;
                }

                @media (max-width: 768px) {
                    .blog-article { padding-top: 120px; }
                    .featured-image-wrapper { height: 50vh; margin-bottom: 50px; }
                    .blog-content-inner { font-size: 18px; line-height: 1.7; }
                    .first-paragraph::first-letter { font-size: 72px; }
                }
            `}</style>
        </main>
    );
}
