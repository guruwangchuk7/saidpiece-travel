'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

const featuredPosts = [
    {
        title: 'Five Quiet Valleys to Experience Bhutan Beyond the Main Route',
        category: 'Field Notes',
        excerpt: 'A slower circuit through forest monasteries, farmhouse stays, and ridge trails where the pace of the journey becomes the point.',
        image: '/images/bhutan/main3.webp'
    },
    {
        title: 'How to Plan a First Bhutan Journey Without Overpacking the Itinerary',
        category: 'Planning',
        excerpt: 'Why fewer hotel changes, more local encounters, and one strong thematic thread usually create the best first impression.',
        image: '/images/bhutan/18.webp'
    },
    {
        title: 'Festival Travel Done Well: Timing, Etiquette, and Where to Linger',
        category: 'Culture',
        excerpt: 'What matters before you go, how to move respectfully through festival spaces, and how to avoid turning the trip into a checklist.',
        image: '/images/bhutan/21.webp'
    }
];

export default function TravelBlogPage() {
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
                            This journal is where we collect the textures around the trip itself: the timing of festivals, the feel of different valleys, the reasons one itinerary flows better than another.
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
                        {featuredPosts.map((post) => (
                            <article key={post.title} className="connect-card" style={{ padding: '0', overflow: 'hidden' }}>
                                <div style={{ position: 'relative', height: '260px' }}>
                                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '28px' }}>
                                    <span className="card-label">{post.category}</span>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">Need a Journey Behind the Story?</h2>
                    <p className="centered-paragraph">
                        Move from inspiration into planning with itineraries built around season, pace, and the kind of Bhutan you want to experience.
                    </p>
                    <div className="divider-line"></div>
                    <Link href="/browse?filter=new" className="btn btn-primary large-btn">See New Trips</Link>
                </section>
            </div>

            <Footer />
        </main>
    );
}
