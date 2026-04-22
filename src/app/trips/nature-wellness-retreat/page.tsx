'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function NatureWellnessRetreatTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1);

    const tripData = {
        name: "Nature & Wellness Retreat",
        price: "3000",
        image: "/images/bhutan/main6.webp"
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
        <main className="trip-detail-page pt-0">
            <HeaderThemeHandler theme="auto" />
            
            <div className="trip-hero">
                <Image src={tripData.image} alt={tripData.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="hero-overlay-subtle"></div>

                <div className="container hero-content-center">
                    <h1 className="hero-title">{tripData.name}</h1>
                </div>

                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Phobjikha, Bhutan</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Duration</span>
                                <span className="value">10 Days / 9 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">${tripData.price}</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Wellness</span>
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
                        <p className="lead-text">Discover the restorative power of Bhutan&apos;s untouched nature. This wellness retreat blends gentle wilderness exploration with traditional healing practices and mindful meditation.</p>

                        <p>Set in the high-altitude glacial valley of Phobjikha, you will find sanctuary in eco-luxury lodges, practicing yoga as the sun rises over the Himalayas and ending your days with traditional hot stone baths infused with medicinal herbs.</p>

                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image src="/images/bhutan/main6.webp" alt="Wellness Journey" fill style={{ objectFit: 'cover' }} />
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
                                    <li>Daily guided meditation and yoga in breathtaking alpine settings.</li>
                                    <li>Traditional Bhutanese hot stone baths using local medicinal herbs.</li>
                                    <li>Mindful nature walks through the glacial Phobjikha Valley.</li>
                                    <li>Consultation with a traditional Sowa Rigpa (Bhutanese medicine) practitioner.</li>
                                    <li>Digital detox focus with structured quiet time and starlit evenings.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>
                        <div className="itinerary-accordion">
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-5</div>
                                    <span className="day-title">Acclimatization & Valley Sanctuary</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p>Begin your wellness journey in the quietest corners of Paro before heading deep into the Phobjikha sanctuary.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="dates" className={`content-section ${activeTab === 'dates' ? 'active' : 'hidden'}`}>
                        <h2>Dates & Pricing</h2>
                        <div className="table-responsive">
                            <table className="dates-pricing-table">
                                <thead>
                                    <tr><th>Departure</th><th>Availability</th><th>Starting Price</th><th></th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>Oct 12, 2026</td><td><span className="status-badge space">Space Available</span></td><td>$3,000</td><td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready to reconnect?</h2>
                    <p>Start your wellness journey in the heart of the Himalayas.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Retreat</button>
                </div>
            </section>
        </main>
    );
}
