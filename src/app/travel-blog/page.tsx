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
                        <h2>Latest Reads</h2>
                    </div>

                    <div className="connect-card-grid">
                        {posts.map((post: any) => (
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
                        {posts.length === 0 && (
                            <p style={{ gridColumn: 'span 3', textAlign: 'center', color: '#999', padding: '40px' }}>
                                No stories have been shared yet. Check back soon.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
