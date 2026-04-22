'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function BhutanWalkingTourTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const tripData = {
        name: "Bhutan Walking Tour: The Dragon Kingdom",
        price: "7495",
        image: "/images/bhutan/main2.webp"
    };

    const handleBookOnline = () => {
        if (!user) {
            const destination = `/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=${tripData.price}`;
            localStorage.setItem('booking_redirect', destination);
            signInWithGoogle();
        } else {
            router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=${tripData.price}`);
        }
    };

    return (
        <main className="trip-detail-page">
            <div className="trip-hero">
                <Image src={tripData.image} alt={tripData.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>
                <div className="trip-hero-content container">
                    <h1>{tripData.name}</h1>
                    <p className="hero-subtitle">Step into the Timeless Landscapes of Bhutan</p>
                </div>
                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Bhutan</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Duration</span>
                                <span className="value">12 Days</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$7,495</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Level 3</span>
                            </div>
                        </div>
                        <div className="quick-info-ctas">
                            <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white', marginRight: '15px' }}>DOWNLOAD ITINERARY</button>
                            <button className="btn btn-primary" style={{ backgroundColor: '#fff', color: '#111' }} onClick={handleBookOnline}>CONFIRM BOOKING</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container trip-content-layout">
                <aside className="trip-sidebar">
                    <nav className="sticky-nav">
                        <ul>
                            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                            <li className={activeTab === 'itinerary' ? 'active' : ''} onClick={() => setActiveTab('itinerary')}>Itinerary</li>
                            <li className={activeTab === 'dates' ? 'active' : ''} onClick={() => setActiveTab('dates')}>Dates & Pricing</li>
                        </ul>
                    </nav>
                </aside>

                <div className="trip-main-content">
                    <section id="overview" className={`content-section ${activeTab === 'overview' ? 'active' : 'hidden'}`}>
                        <h2>Journey Overview</h2>
                        <p className="lead-text">Discover Bhutan on foot. This 12-day walking tour takes you through emerald valleys, across suspension bridges, and up to ancient monasteries.</p>
                        <p>Immerse yourself in the local way of life as you traverse the trails of the Dragon Kingdom, enjoying the perfect blend of activity and cultural discovery.</p>
                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image 
                                        src="/images/bhutan/main2.webp" 
                                        alt="Walking Tour Visualization" 
                                        fill 
                                        style={{ objectFit: 'cover' }} 
                                    />
                                    <div className="map-overlay-zoom">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </div>
                                </div>
                                <div className="highlights-travel-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">Arrive:</span>
                                        <span className="meta-value">Paro, Bhutan</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Depart:</span>
                                        <span className="meta-value">Paro, Bhutan</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="highlights-text-side">
                                <h3>Highlights</h3>
                                <ul className="premium-highlights-list">
                                    <li>A meticulously planned walking adventure through Bhutan&apos;s most scenic valleys.</li>
                                    <li>Walk through pristine ancient forests and remote, high-altitude villages.</li>
                                    <li>Engage in meaningful conversations with local monks and master artisans.</li>
                                    <li>Stay in handpicked boutique lodges that blend comfort with tradition.</li>
                                    <li>Marvel at the sheer architectural scale and detail of Bhutan&apos;s historic Dzongs.</li>
                                    <li>Experience the perfect balance of physical activity and spiritual discovery.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready to walk the trails of Bhutan?</h2>
                    <p>Start your 12-day walking adventure today.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Trip Today</button>
                </div>
            </section>
        </main>
    );
}
