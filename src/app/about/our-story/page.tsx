'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function OurStory() {
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*');
            if (data) {
                const s: any = {};
                data.forEach(item => s[item.setting_key] = item.setting_value);
                setSettings(s);
            }
        };
        fetchSettings();
    }, []);

    return (
        <main className="our-story-page">
            <Header theme="light" />

            <section className="story-hero">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main2.webp"
                        alt="Bhutan Landscape"
                        fill
                        sizes="100vw"
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
                    <a href={`mailto:${settings.contact_email || 'saidpiece@gmail.com'}`} className="floating-mail-btn" aria-label="Contact Us">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </a>
                </div>
            </section>

            <div className="story-container">
                <section className="story-intro container">
                    <div className="quote-block">
                        <span className="quote-mark">“</span>
                        <blockquote>
                            {settings.story_quote || "The most meaningful journeys are those that lead us not just to new places, but to new ways of seeing the world."}
                        </blockquote>
                        <cite>— {settings.site_name || 'Saidpiece Travel'}</cite>
                    </div>
                </section>

                <section className="story-split container">
                    <div className="split-text">
                        <h2>The Journey Begins</h2>
                        <p>{settings.story_body_1 || "Saidpiece Travel was born from a simple yet profound realization: that travel should be more than just a checklist of sights. Founded on the principles of care and thoughtfulness."}</p>
                        <Link href="/browse" className="inline-link">Explore our journeys &rarr;</Link>
                    </div>
                    <div className="split-media">
                        <div className="media-frame">
                            <Image src="/images/bhutan/13.webp" alt="Historic Bhutan" width={600} height={400} style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                </section>

                <section className="story-split container alternate">
                    <div className="split-text">
                        <h2>Rooted in Tradition</h2>
                        <p>{settings.story_body_2 || "Since our inception, we have partnered with world-class researchers and local elders to ensure our trips are educationally rich and culturally respectful."}</p>
                    </div>
                    <div className="split-media">
                        <div className="media-frame">
                            <Image src="/images/bhutan/14.webp" alt="Bhutan Tradition" width={600} height={400} style={{ objectFit: 'cover' }} />
                        </div>
                    </div>
                </section>

                <section className="story-today container text-center">
                    <div className="divider-line"></div>
                    <h2>{settings.site_name || 'Saidpiece Travel'} Today</h2>
                    <p className="lead-text">Carrying forward a legacy of mindful exploration into the modern era.</p>
                    <p>Based in Thimphu, we continue to bridge the gap between global curiosity and Himalayan wisdom. Every trip we design is a chapter in an ongoing story of discovery and mutual respect.</p>
                    <div className="divider-line"></div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
