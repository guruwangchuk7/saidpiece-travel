'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useUI } from '@/contexts/UIContext';
import Link from 'next/link';

interface Trip {
    id: string;
    title: string;
    slug: string;
    duration_days: number;
    level: string;
    starting_price: number;
    image_url: string;
    trip_type: string;
    destination: string;
}

export default function ResponsibleTravel() {
    const [settings, setSettings] = useState<any>({});
    const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
    const { setHeaderTheme } = useUI();

    useEffect(() => {
        setHeaderTheme('auto');
        
        const fetchData = async () => {
            if (!supabase) return;
            
            // Fetch site settings
            const { data: settingsData } = await supabase.from('site_settings').select('*');
            if (settingsData) {
                const s: any = {};
                settingsData.forEach(item => s[item.setting_key] = item.setting_value);
                setSettings(s);
            }

            // Fetch featured trips - 8 trips to match the reference grid
            const { data: tripsData } = await supabase
                .from('trips')
                .select('*')
                .eq('is_active', true)
                .limit(8);
            
            if (tripsData) setFeaturedTrips(tripsData);
        };
        fetchData();
    }, [setHeaderTheme]);

    const siteName = settings.site_name || 'Saidpiece Travel';

    return (
        <main className="responsible-travel-page pt-0">
            {/* Hero Section */}
            <section className="story-hero-new">
                <div className="hero-bg-wrapper">
                    <Image
                        src="/images/bhutan/main5.webp"
                        alt="Responsible Travel"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">Responsible Travel</h1>
                </div>
            </section>

            {/* Intro Section */}
            <section className="welcome-section section-padding">
                <div className="container-narrow">
                    <h2 className="section-title-serif text-center">Our Ethos of Care</h2>
                    <div className="welcome-quote-block">
                        <p className="italic-lead text-center">
                            &quot;Travel is more than the seeing of sights; it is a change that goes on, deep and permanent, in the ideas of living.&quot;
                        </p>
                        <p className="text-center mt-6 font-bold tracking-widest text-xs uppercase">— Miriam Beard</p>
                    </div>
                </div>
            </section>

            {/* Content Row 1: Low Impact */}
            <section className="story-split-section section-padding-bottom">
                <div className="container grid-two-col align-center">
                    <div className="image-wrapper shadow-lg relative aspect-4-3 overflow-hidden">
                        <Image 
                            src="/images/bhutan/15.webp" 
                            alt="Low Impact Tourism" 
                            fill
                            className="object-cover" 
                        />
                    </div>
                    <div className="text-wrapper relative">
                        <span className="date-marker">OUR FOOTPRINT</span>
                        <h2 className="split-title">Low Impact, High Value</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                Bhutan is a pioneer in sustainable tourism, and {siteName} is proud to champion this &quot;High Value, Low Volume&quot; philosophy. We believe that true luxury lies in the preservation of the untouched—the quiet valleys, the pristine forests, and the unhurried way of life.
                            </p>
                            <p>
                                By meticulously planning every route, we ensure that our presence leaves no trace on the environment while maximizing the benefit to local ecosystems. Our journeys are designed to nurture the land as much as they inspire the soul.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Row 2: Community */}
            <section className="grid-section section-padding bg-cream">
                <div className="container">
                    <div className="grid-two-images mb-12">
                        <div className="image-wrapper overflow-hidden shadow-md aspect-3-2 relative">
                             <Image src="/images/bhutan/16.webp" alt="Local Community" fill className="object-cover" />
                        </div>
                        <div className="image-wrapper overflow-hidden shadow-md aspect-3-2 relative">
                             <Image src="/images/bhutan/17.webp" alt="Traditional Crafts" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="container-narrow text-center">
                        <h2 className="section-title-serif">Empowering Local Voices</h2>
                        <div className="story-text-content">
                            <p className="mb-4">
                                We don&apos;t just visit communities; we partner with them. From staying in locally-owned high-end farmstays to employing guides from the valleys you explore, our economic footprint is designed to stay within Bhutan.
                            </p>
                            <p>
                                A significant portion of your journey&apos;s cost goes directly into the Sustainable Development Fee (SDF), supporting Bhutan&apos;s free healthcare, education, and carbon-neutral initiatives. With {siteName}, your journey is an investment in a nation&apos;s future.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Row 3: Stewardship */}
            <section className="story-split-section section-padding">
                <div className="container grid-two-col alternate align-center">
                    <div className="text-wrapper pr-12">
                        <span className="date-marker">CARBON NEUTRAL</span>
                        <h2 className="split-title">Preserving the Kingdom</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                As a carbon-negative nation, Bhutan sets a global example. We mirror this commitment by eliminating single-use plastics from our expeditions and supporting reforestation projects across the kingdom.
                            </p>
                            <p>
                                Our guides are trained not only in cultural history but in environmental stewardship, ensuring that every traveler becomes a temporary guardian of this sacred landscape.
                            </p>
                        </div>
                    </div>
                    <div className="image-wrapper shadow-lg overflow-hidden relative aspect-4-3">
                        <Image 
                            src="/images/bhutan/18.webp" 
                            alt="Environmental Stewardship" 
                            fill
                            className="object-cover" 
                        />
                    </div>
                </div>
            </section>

            {/* Featured Conservation Tours - Matching reference exactly */}
            <section className="featured-tours-section">
                <div className="container">
                    <div className="mb-12 pb-4 border-b border-gray-100">
                        <h2 className="section-title-serif !mb-0 !text-3xl md:!text-5xl">Featured Conservation Tours</h2>
                    </div>

                    <div className="conservation-grid">
                        {featuredTrips.map((trip) => (
                            <div className="cons-trip-card" key={trip.id}>
                                <div className="cons-image-box">
                                    <Image 
                                        src={trip.image_url?.startsWith('http') ? trip.image_url : `/images/${trip.image_url || 'bhutan/main1.webp'}`} 
                                        alt={trip.title || 'Trip'} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <div className="cons-content">
                                    <span className="cons-tag">{trip.trip_type || 'Adventure'}</span>
                                    <h3 className="cons-title">{trip.title || 'Untitled Journey'}</h3>
                                    
                                    <div className="cons-meta-list">
                                        <div className="cons-meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            {trip.destination || 'Bhutan'}
                                        </div>
                                        <div className="cons-meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                            {trip.level || 'Moderate'}
                                        </div>
                                        <div className="cons-meta-item">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            {trip.duration_days || 'N/A'} Days
                                        </div>
                                    </div>
                                </div>
                                <div className="cons-footer">
                                    <div className="cons-price-box">
                                        <span>From</span>
                                        <div className="cons-price-val">${trip.starting_price?.toLocaleString()}</div>
                                    </div>
                                    <Link href={`/trip-detail/${trip.slug}`} className="cons-view-link">
                                        View Trip
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-banner-section section-padding">
                <div className="container-narrow text-center">
                    <div className="welcome-quote-block">
                        <h2 className="section-title-serif">A Commitment for Tomorrow</h2>
                        <p className="italic-lead mb-8">
                            Responsible travel isn&apos;t a feature of our trips; it is the foundation upon which every itinerary is built. We invite you to join us in protecting the very rhythm of the country that makes it so extraordinary.
                        </p>
                        <Link href="/browse" className="btn btn-primary" style={{ padding: '18px 40px', fontSize: '12px', letterSpacing: '2px' }}>
                            BROWSE MEANINGFUL JOURNEYS
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
