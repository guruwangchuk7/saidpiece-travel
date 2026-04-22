'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function TreasuresHimalayasTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const tripData = {
        name: "Treasures of the Himalayas: Tibet, Nepal & Bhutan",
        price: "11295",
        image: "/images/bhutan/main1.webp"
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
                    <p className="hero-subtitle">A Grand Journey Through Three Sacred Kingdoms</p>
                </div>
                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Bhutan, Nepal, Tibet</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Duration</span>
                                <span className="value">15 Days</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$11,295</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Level 2+</span>
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
                        <p className="lead-text">Experience the ultimate Himalayan odyssey. This 15-day journey takes you through the spiritual heart of Tibet, the vibrant valleys of Nepal, and the pristine Dragon Kingdom of Bhutan.</p>
                        <p>From the Potala Palace in Lhasa to the sacred temples of Kathmandu and the iconic Tiger\'s Nest in Paro, this is a journey of a lifetime.</p>
                        <div className="highlights-box">
                            <h3>Key Highlights</h3>
                            <ul className="highlights-list">
                                <li><strong>Explore</strong> the Potala Palace, former home of the Dalai Lama</li>
                                <li><strong>Witness</strong> sunrise over the Himalayas in Nepal</li>
                                <li><strong>Hike</strong> to Taktsang (Tiger\'s Nest) in Bhutan</li>
                                <li><strong>Experience</strong> traditional Buddhist ceremonies</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>

            <section className="final-dark-cta">
                <div className="container text-center">
                    <h2>Ready to explore the Himalayas?</h2>
                    <p>Our experts are ready to help you plan this epic 15-day adventure.</p>
                    <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Trip Today</button>
                </div>
            </section>
        </main>
    );
}
