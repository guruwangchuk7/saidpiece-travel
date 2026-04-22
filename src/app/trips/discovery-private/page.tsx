'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function BhutanDiscoveryPrivateTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1);

    const tripData = {
        name: "Bhutan Discovery (Private Journey)",
        price: "2400",
        image: "/images/bhutan/main4.webp"
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

    const toggleAccordion = (day: number) => {
        setOpenDay(openDay === day ? null : day);
    };

    return (
        <main className="trip-detail-page">
            <div className="trip-hero">
                <Image src={tripData.image} alt={tripData.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>

                <div className="trip-hero-content container">
                    <h1>{tripData.name}</h1>
                    <p className="hero-subtitle">Your private gateway to the Kingdom of Happiness</p>
                </div>

                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Paro, Bhutan</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Duration</span>
                                <span className="value">8 Days / 7 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">${tripData.price}</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Easy Active</span>
                            </div>
                        </div>
                        <div className="quick-info-ctas">
                            <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white', marginRight: '15px' }}>DOWNLOAD ITINERARY</button>
                            <button className="btn btn-primary" style={{ backgroundColor: '#fff', color: '#111' }} onClick={handleBookOnline}>BOOK ONLINE</button>
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
                        <p className="lead-text">Experience Bhutan with the exclusivity of a private journey. This discovery tour is tailored for those who want to explore at their own pace with a dedicated guide and vehicle.</p>

                        <p>Focusing on the essential highlights of Paro and Thimphu, this 8-day private journey offers flexibility and deep personal insight into Bhutanese culture, religion, and daily life.</p>

                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image src="/images/bhutan/main4.webp" alt="Route Map" fill style={{ objectFit: 'cover' }} />
                                    <div className="map-overlay-zoom">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </div>
                                </div>
                                <div className="highlights-travel-meta">
                                    <div className="meta-row"><span className="meta-label">Arrive:</span><span className="meta-value">Paro, Bhutan</span></div>
                                    <div className="meta-row"><span className="meta-label">Depart:</span><span className="meta-value">Paro, Bhutan</span></div>
                                </div>
                            </div>
                            <div className="highlights-text-side">
                                <h3>Highlights</h3>
                                <ul className="premium-highlights-list">
                                    <li>Private dedicated guide and luxury vehicle throughout the journey.</li>
                                    <li>Bespoke itinerary adjustments to match your personal interests.</li>
                                    <li>Hike to the iconic Tiger&apos;s Nest at your own preferred time and pace.</li>
                                    <li>Private dinner with a local Bhutanese family in their traditional home.</li>
                                    <li>Exclusive access to hidden meditation spots and smaller village temples.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>
                        <div className="itinerary-accordion">
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-3</div>
                                    <span className="day-title">Arrival & Paro Discovery</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p>Your private guide will meet you at the airport and begin your personalized exploration of the Paro valley.</p>
                                </div>
                            </div>
                            {/* ... additional days */}
                        </div>
                    </section>

                    <section id="dates" className={`content-section ${activeTab === 'dates' ? 'active' : 'hidden'}`}>
                        <h2>Dates & Pricing</h2>
                        <p>This is a private journey. Please select your preferred dates below.</p>
                        <div className="table-responsive">
                            <table className="dates-pricing-table">
                                <thead>
                                    <tr><th>Month</th><th>Availability</th><th>Starting Price</th><th></th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>Flexible</td><td><span className="status-badge space">Available Daily</span></td><td>$2,400</td><td><button className="btn btn-outline small" onClick={handleBookOnline}>Inquire Now</button></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready for your private discovery?</h2>
                    <p>Start planning your bespoke journey today.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Inquire Now</button>
                </div>
            </section>
        </main>
    );
}
