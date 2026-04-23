'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function BhutanPeaksValleysTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const tripData = {
        name: "Bhutan Peaks & Valleys",
        price: "8295",
        image: "/images/bhutan/main4.webp"
    };

    const handleBookOnline = () => {
        if (!user) {
            const destination = `/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=${tripData.price}`;
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem('booking_redirect', destination);
            }
            signInWithGoogle();
        } else {
            router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=${tripData.price}`);
        }
    };

    return (
        <main className="trip-detail-page pt-0">
            <HeaderThemeHandler theme="auto" />
            <div className="trip-hero">
                <Image src={tripData.image} alt={tripData.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>
                <div className="trip-hero-content container">
                    <h1>{tripData.name}</h1>
                    <p className="hero-subtitle">High Altitude Adventure in the High Himalayas</p>
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
                                <span className="value">14 Days</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$8,295</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Level 4</span>
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
                        <p className="lead-text">For the truly adventurous. This 14-day expedition reaches the highest peaks and deepest valleys of Bhutan, offering unparalleled views of the Himalayas.</p>
                        <p>Challenge yourself with high-altitude treks and be rewarded with the raw, untouched beauty of Bhutan\'s most remote landscapes.</p>
                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image 
                                        src="/images/bhutan/main4.webp" 
                                        alt="Peaks & Valleys Visualization" 
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
                                    <li>An ambitious 14-day expedition designed for experienced trekkers and mountain lovers.</li>
                                    <li>Trek to multiple high Himalayan passes with sweeping, panoramic views of 7,000m+ peaks.</li>
                                    <li>Camp under the brilliant starlit skies in the most pristine and remote wilderness on Earth.</li>
                                    <li>Visit isolated mountain communities and learn about their resilient, high-altitude way of life.</li>
                                    <li>Experience the sheer scale and raw beauty of Bhutan&apos;s untouched alpine landscapes.</li>
                                    <li>Full support from our expert mountain crews, including specialized guides and equipment.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready for a high-altitude challenge?</h2>
                    <p>Embark on the ultimate 14-day Bhutanese expedition.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Trip Today</button>
                </div>
            </section>
        </main>
    );
}
