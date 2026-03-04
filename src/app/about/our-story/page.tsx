'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function OurStory() {
    return (
        <main className="our-story-page">
            <Header theme="light" />

            {/* 1. Page Header & Hero Section */}
            <section className="story-hero">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main2.JPG"
                        alt="Bhutan Landscape"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay"></div>
                </div>
                <div className="container story-hero-content">
                    <h1>Our Story</h1>
                </div>
                {/* Sticky Utility */}
                <div className="sticky-contact">
                    <a href="mailto:saidpiece@gmail.com" className="floating-mail-btn" aria-label="Contact Us">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </a>
                </div>
            </section>

            {/* 2. Narrative Content Layout - Magazine Style */}
            <div className="story-container">
                {/* A. Introductory Quote */}
                <section className="story-intro container">
                    <div className="quote-block">
                        <span className="quote-mark">“</span>
                        <blockquote>
                            The most meaningful journeys are those that lead us not just to new places, but to new ways of seeing the world.
                        </blockquote>
                        <cite>— Inspired by the rhythm of Bhutan</cite>
                    </div>
                </section>

                {/* B. The Story of Saidpiece Travel (History Block) */}
                <section className="story-split container">
                    <div className="split-text">
                        <h2>The Journey Begins</h2>
                        <p>
                            Saidpiece Travel was born from a simple yet profound realization: that travel should be more than just a checklist of sights. Founded on the principles of care, thoughtfulness, and local deep-rooted expertise, our story traces back to the early days of Bhutan&apos;s opening to the world.
                        </p>
                        <p>
                            What started as a small, family-driven initiative in the heart of the Himalayas has grown into a beacon for travelers seeking authenticity. We believe in the rhythm of the country—the slow, deliberate pace that allows for genuine connection.
                        </p>
                        <Link href="/browse" className="inline-link">Explore our journeys &rarr;</Link>
                    </div>
                    <div className="split-media">
                        <div className="media-frame">
                            <Image
                                src="/images/bhutan/13.JPG"
                                alt="Historic Bhutan"
                                width={600}
                                height={400}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </section>

                <section className="story-split container alternate">
                    <div className="split-text">
                        <h2>Rooted in Tradition</h2>
                        <p>
                            Since our inception, we have partnered with world-class researchers and local elders to ensure our trips are educationally rich and culturally respectful. Following in the footsteps of legendary explorers, we curate paths that others often overlook.
                        </p>
                        <p>
                            Our leadership remains family-run, maintaining the same passion and personal touch that defined our first expedition decades ago. Today, Saidpiece Travel stands as a testament to over 45 years of navigating the kingdom&apos;s hidden valleys.
                        </p>
                    </div>
                    <div className="split-media">
                        <div className="media-frame">
                            <Image
                                src="/images/bhutan/14.JPG"
                                alt="Bhutan Tradition"
                                width={600}
                                height={400}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Media & Brand Credibility */}
                <section className="story-gallery container">
                    <div className="section-header text-center">
                        <h2>Expeditions of a Lifetime</h2>
                        <p>From sacred tribal encounters to high-altitude treks.</p>
                    </div>
                    <div className="image-grid-story">
                        <div className="grid-item">
                            <Image src="/images/bhutan/main5.JPG" alt="Expedition 1" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="grid-item">
                            <Image src="/images/bhutan/main6.JPG" alt="Expedition 2" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="grid-item">
                            <Image src="/images/bhutan/17.JPG" alt="Expedition 3" fill style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                </section>

                <section className="notable-names container text-center">
                    <h5>Collaborators & Inspiration</h5>
                    <p className="names-list">
                        Local Monastic Communities • Valley Elders • Environmental Researchers • Cultural Archivists • Our Dedicated Field Guides
                    </p>
                </section>

                <section className="story-today container text-center">
                    <h2>Saidpiece Travel Today</h2>
                    <p className="lead-text">
                        Carrying forward a legacy of mindful exploration into the modern era.
                    </p>
                    <p>
                        Based in Thimphu, we continue to bridge the gap between global curiosity and Himalayan wisdom. Every trip we design is a chapter in an ongoing story of discovery and mutual respect.
                    </p>
                </section>
            </div>

            <Footer />
        </main>
    );
}
