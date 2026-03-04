'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const heroImages = ['/images/bhutan/main1.JPG', '/images/bhutan/main2.JPG'];

export default function Hero() {
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const heroInterval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(heroInterval);
    }, []);

    return (
        <section className="hero-section">
            <div className="hero-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
                {heroImages.map((src, i) => (
                    <div
                        key={src}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            opacity: heroIndex === i ? 1 : 0,
                            transition: 'opacity 2s ease-in-out'
                        }}
                    >
                        <Image src={src} alt={`Hero Image ${i + 1}`} fill style={{ objectFit: 'cover' }} priority={i === 0} />
                    </div>
                ))}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1 }} />
            </div>

            {/* Hero Carousel Indicators */}
            <div className="hero-indicators">
                {heroImages.map((_, i) => (
                    <div key={i} className={`indicator-item ${heroIndex === i ? 'active' : ''}`} onClick={() => setHeroIndex(i)}>
                        {String(i + 1).padStart(2, '0')}
                    </div>
                ))}
                <div className="indicator-line"></div>
            </div>

            <div className="hero-content">
                <h1 className="hero-h1">Authentic Travel Experiences</h1>
                <p className="hero-sub">For Every Adventurous Spirit</p>
            </div>

            <div className="trip-finder">
                <div className="trip-finder-field trip-finder-branding">
                    <span className="trip-finder-brand-label">Find Your Trip</span>
                </div>
                <div className="trip-finder-field">
                    <span className="trip-finder-label">Destination</span>
                    <select className="trip-finder-input">
                        <option>Anywhere</option>
                        <option>Africa</option>
                        <option>Asia</option>
                        <option>Europe</option>
                        <option>Latin America</option>
                    </select>
                </div>
                <div className="trip-finder-field date-field">
                    <span className="trip-finder-label">Date</span>
                    <div className="trip-finder-dates">
                        <input type="text" className="trip-finder-input small-input" placeholder="Start Date" />
                        <span className="date-separator">-</span>
                        <input type="text" className="trip-finder-input small-input" placeholder="End Date" />
                    </div>
                </div>
                <div className="trip-finder-field">
                    <span className="trip-finder-label">Activity</span>
                    <select className="trip-finder-input">
                        <option>Any activity</option>
                        <option>Cultural</option>
                        <option>Hiking & Trekking</option>
                        <option>Wildlife Safaris</option>
                    </select>
                </div>
                <button className="btn btn-primary trip-finder-btn">BROWSE TRIPS</button>
            </div>
        </section>
    );
}
