'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function FestivalToursTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1);

    const tripData = {
        name: "Festival Tours",
        price: "3000",
        image: "/images/bhutan/main5.webp"
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
                    <p className="hero-subtitle">Witness the spectacular living culture of Bhutan</p>
                </div>

                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Punakha, Bhutan</span>
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
                                <span className="value">Cultural</span>
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
                        <p className="lead-text">Experience the vibrant soul of Bhutan at a traditional Tshechu (monastic festival). Witness masked dances, ancient rituals, and the deep devotion of the Bhutanese people in this immersive cultural celebration.</p>

                        <p>Our festival tours are timed perfectly to coincide with Bhutan&apos;s most significant religious events, primarily in the majestic Punakha and Paro Dzongs. You will join thousands of locals dressed in their finest attire for a sensory journey of color, music, and spiritual meaning.</p>

                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image src="/images/bhutan/main5.webp" alt="Festival Celebration" fill style={{ objectFit: 'cover' }} />
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
                                    <li>Witness the mesmerizing masked dances (Cham) performed by monks in ancient courtyards.</li>
                                    <li>Unfurl the sacred Thangkha (scroll painting) at dawn for a spiritual blessing.</li>
                                    <li>Join local families in their festival celebrations and enjoy traditional food.</li>
                                    <li>Explore the stunning Punakha Dzong, the focal point of many major festivals.</li>
                                    <li>Expert commentary on the symbolism and history of the festival rituals.</li>
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
                                    <span className="day-title">Festival Atmosphere & Rituals</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p>Your journey begins with the building excitement of the festival season, culminating in the first day of monastic dances.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="dates" className={`content-section ${activeTab === 'dates' ? 'active' : 'hidden'}`}>
                        <h2>Dates & Pricing</h2>
                        <div className="table-responsive">
                            <table className="dates-pricing-table">
                                <thead>
                                    <tr><th>Festival Date</th><th>Location</th><th>Price</th><th></th></tr>
                                </thead>
                                <tbody>
                                    <tr><td>Mar 10, 2026</td><td>Punakha Tshechu</td><td>$3,000</td><td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td></tr>
                                    <tr><td>Oct 20, 2026</td><td>Thimphu Tshechu</td><td>$3,200</td><td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready for the celebration?</h2>
                    <p>Secure your spot for Bhutan&apos;s most spectacular festivals.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Festival Tour</button>
                </div>
            </section>
        </main>
    );
}
