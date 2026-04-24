import Image from 'next/image';
import Link from 'next/link';
import { getCachedBlogPostBySlug } from '@/lib/data';
import BlogClientWrapper from '@/components/BlogClientWrapper';
import { notFound } from 'next/navigation';

export default async function DynamicBlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getCachedBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const publishDate = post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
    }).toUpperCase() : 'RECENTLY PUBLISHED';

    return (
        <BlogClientWrapper>
            <main className="blog-article-page bg-white min-h-screen">
                <div className="article-wrapper">
                    {/* Top Navigation */}
                    <div className="article-nav">
                        <Link href="/travel-blog" className="back-link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            <span>Blog</span>
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="article-header">
                        <div className="article-date-line">
                            <span className="line"></span>
                            <span className="date-text">{publishDate}</span>
                            <span className="line"></span>
                        </div>
                        
                        <h1 className="article-title">{post.title}</h1>
                        
                        <div className="article-meta-info">
                            <span className="location">{post.location || 'Bhutan'}</span>
                            <span className="meta-separator">|</span>
                            <span className="category">{post.category || 'Travel Journal'}</span>
                        </div>
                    </header>

                    {/* Main Featured Image */}
                    <div className="article-hero-image">
                        <Image
                            src={(post.main_image?.startsWith('http') ? post.main_image : `/images/${post.main_image || 'bhutan/main2.webp'}`)}
                            alt={post.title}
                            width={1200}
                            height={800}
                            className="hero-img"
                            priority
                        />
                    </div>

                    {/* Article Body */}
                    <article className="article-body">
                        <div className="author-line">
                            <strong>Text and photos by {post.author_name || 'Saidpiece Team'}</strong>
                            {post.location && <span className="author-link"> | {post.location}: Explore the Journal</span>}
                        </div>

                        <div className="article-content">
                            {(() => {
                                let contentToRender: any[] = [];
                                
                                if (post.excerpt) {
                                    contentToRender.push(<p key="excerpt" className="intro-para">{post.excerpt}</p>);
                                }

                                if (!post.content || post.content === 'null' || post.content === '{}' || post.content === '{"subtitle":"","sections":[]}') {
                                    return contentToRender.length > 0 ? contentToRender : <div className="no-content-notice">Narrative coming soon...</div>;
                                }
                                
                                try {
                                    const parsed = JSON.parse(post.content);
                                    
                                    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections)) {
                                        if (parsed.subtitle) {
                                            contentToRender.push(<h2 key="subtitle" className="content-subtitle">{parsed.subtitle}</h2>);
                                        }

                                        if (parsed.sections.length > 0) {
                                            parsed.sections.forEach((sec: any, i: number) => {
                                                if (sec.type === 'text' && sec.value) {
                                                    contentToRender.push(
                                                        <div key={`sec-${i}`} className="text-block">
                                                            {sec.value.split('\n').map((p: string, pi: number) => (
                                                                <p key={pi}>{p}</p>
                                                            ))}
                                                        </div>
                                                    );
                                                } else if (sec.type === 'subtitle' && sec.value) {
                                                    contentToRender.push(<h3 key={`sec-${i}`} className="section-h3">{sec.value}</h3>);
                                                } else if (sec.type === 'image' && sec.url) {
                                                    contentToRender.push(
                                                        <figure key={`sec-${i}`} className="body-image">
                                                            <div className="body-image-wrapper">
                                                                <Image 
                                                                    src={sec.url.startsWith('http') ? sec.url : `/images/${sec.url}`} 
                                                                    alt={sec.caption || 'Article image'} 
                                                                    width={1000}
                                                                    height={600}
                                                                    className="inner-body-img"
                                                                />
                                                            </div>
                                                            {sec.caption && <figcaption>{sec.caption}</figcaption>}
                                                        </figure>
                                                    );
                                                }
                                            });
                                        }
                                    } else {
                                        throw new Error('Fallback');
                                    }
                                } catch (e) {
                                    const paragraphs = post.content.split('\n').filter((p: string) => p.trim());
                                    paragraphs.forEach((para: string, i: number) => {
                                        contentToRender.push(<p key={`para-${i}`}>{para}</p>);
                                    });
                                }

                                return contentToRender.length > 0 ? contentToRender : <div className="no-content-notice">Narrative coming soon...</div>;
                            })()}
                        </div>
                    </article>

                    <footer className="article-footer">
                        <div className="footer-divider"></div>
                        <div className="footer-nav">
                            <Link href="/travel-blog" className="btn btn-outline">Back to All Journals</Link>
                        </div>
                    </footer>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                .article-wrapper {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 180px 20px 100px;
                }
                .article-nav {
                    margin-bottom: 40px;
                }
                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    color: #1a1a1a;
                    font-weight: 700;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .article-header {
                    text-align: center;
                    margin-bottom: 60px;
                }
                .article-date-line {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .article-date-line .line {
                    height: 1px;
                    width: 60px;
                    background: #d4c8b0;
                }
                .date-text {
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #1a1a1a;
                }
                .article-title {
                    font-family: var(--font-playfair), serif;
                    font-size: clamp(32px, 5vw, 64px);
                    line-height: 1.1;
                    margin-bottom: 30px;
                    color: #1a1a1a;
                    max-width: 900px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .article-meta-info {
                    font-size: 14px;
                    font-weight: 600;
                    color: #3b82f6;
                    letter-spacing: 0.5px;
                }
                .meta-separator {
                    margin: 0 15px;
                    color: #ddd;
                }
                .article-hero-image {
                    margin-bottom: 60px;
                    border-radius: 4px;
                    overflow: hidden;
                }
                .hero-img {
                    width: 100%;
                    height: auto;
                    object-fit: cover;
                }
                .article-body {
                    max-width: 740px;
                    margin: 0 auto;
                }
                .author-line {
                    text-align: center;
                    margin-bottom: 50px;
                    font-size: 15px;
                    color: #1a1a1a;
                    line-height: 1.6;
                }
                .author-link {
                    color: #3b82f6;
                    cursor: pointer;
                }
                .article-content {
                    font-family: 'Georgia', serif;
                    font-size: 20px;
                    line-height: 1.85;
                    color: #2c2c2c;
                }
                .article-content p {
                    margin-bottom: 35px;
                }
                .intro-para::first-letter {
                    float: left;
                    font-size: 84px;
                    line-height: 1;
                    margin: 8px 12px 0 0;
                    font-family: var(--font-playfair);
                    color: var(--color-brand);
                }
                .section-h3 {
                    font-family: var(--font-playfair);
                    font-size: 32px;
                    margin: 60px 0 30px;
                    color: #1a1a1a;
                }
                .body-image {
                    margin: 60px -130px;
                }
                .inner-body-img {
                    width: 100%;
                    height: auto;
                    border-radius: 2px;
                }
                figcaption {
                    text-align: center;
                    font-size: 13px;
                    color: #888;
                    margin-top: 15px;
                    font-style: italic;
                }
                .article-footer {
                    margin-top: 100px;
                    text-align: center;
                }
                .footer-divider {
                    height: 1px;
                    background: #f0f0f0;
                    margin-bottom: 60px;
                }
                @media (max-width: 1000px) {
                    .body-image { margin: 60px 0; }
                }
                @media (max-width: 768px) {
                    .article-wrapper { padding-top: 180px; }
                    .article-content { font-size: 18px; }
                }
            ` }} />
        </BlogClientWrapper>
    );
}
