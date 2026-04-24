import Image from 'next/image';
import Link from 'next/link';
import { getCachedBlogPosts } from '@/lib/data';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default async function TravelBlogPage() {
    // Fetch cached blog posts on the server
    const posts = await getCachedBlogPosts();

    return (
        <main className="our-story-page pt-0">
            <HeaderThemeHandler theme="auto" />

            <section className="story-hero-new">
                <div className="hero-bg-wrapper">
                    <Image src="/images/bhutan/main2.webp" alt="Travel journal" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">Travel Blog</h1>
                </div>
            </section>

            <div className="narrative-grid container">
                <section>
                    <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                        <h2 className="serif-title" style={{ fontSize: '42px' }}>Latest Reads</h2>
                        <p style={{ color: '#888', marginTop: '10px' }}>Journals from the heart of the Himalayas and beyond.</p>
                    </div>

                    <div className="blog-card-grid">
                        {posts.map((post: any) => (
                            <Link key={post.id} href={`/travel-blog/${post.slug}`} className="blog-card-link">
                                <article className="blog-card">
                                    <div className="blog-card-image">
                                        <Image
                                            src={(post.main_image?.startsWith('http') ? post.main_image : `/images/${post.main_image || 'bhutan/18.webp'}`)}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="blog-card-content">
                                        <div className="blog-card-category">
                                            {post.category || 'Wildlife & Natural History'}
                                        </div>
                                        <h3 className="blog-card-title">{post.title}</h3>
                                        
                                        <div className="blog-card-meta">
                                            <div className="meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                <span>{post.location || 'Bhutan'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="blog-card-footer">
                                        <span>VIEW POST</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {posts.length === 0 && (
                        <div className="no-posts">
                            <p>No stories have been shared yet. Check back soon.</p>
                        </div>
                    )}
                </section>
            </div>

        </main>
    );
}
