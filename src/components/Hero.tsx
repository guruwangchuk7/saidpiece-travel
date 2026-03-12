'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const heroImages = ['/images/bhutan/main1.JPG', '/images/bhutan/main2.JPG'];

export default function Hero() {
    const [heroIndex, setHeroIndex] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
                        <Image src={src} alt={`Hero Image ${i + 1}`} fill sizes="100vw" style={{ objectFit: 'cover' }} priority={i === 0} />
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
                <h1 className="hero-h1">Meaningful Journeys to Bhutan</h1>
                <p className="hero-sub">Experience the real rhythm of the country</p>
            </div>

            <div className="trip-finder" style={{ zIndex: 50 }}>
                <div className="trip-finder-field trip-finder-branding">
                    <span className="trip-finder-brand-label">Find Your Trip</span>
                </div>
                <div className="trip-finder-field">
                    <span className="trip-finder-label">Destination</span>
                    <select className="trip-finder-input">
                        <option>Anywhere in Bhutan</option>
                        <option>Paro</option>
                        <option>Thimphu</option>
                        <option>Punakha</option>
                        <option>Bumthang</option>
                    </select>
                </div>
                <div className="trip-finder-field date-field">
                    <span className="trip-finder-label">Date</span>
                    <div className="trip-finder-dates">
                        <input
                            type="date"
                            className="trip-finder-input small-input"
                            aria-label="Start date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                        />
                        <span className="date-separator">-</span>
                        <input
                            type="date"
                            className="trip-finder-input small-input"
                            aria-label="End date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            onFocus={(e) => e.currentTarget.showPicker?.()}
                        />
                    </div>
                </div>
                <div className="trip-finder-field">
                    <span className="trip-finder-label">Activity</span>
                    <select className="trip-finder-input">
                        <option>Any activity</option>
                        <option>Cultural Immersion</option>
                        <option>Nature & Wellness</option>
                        <option>Festivals & Traditions</option>
                        <option>Trekking & Hiking</option>
                    </select>
                </div>
                <Link
                    href="/browse"
                    className="btn btn-primary trip-finder-btn"
                    style={{ position: 'relative', zIndex: 100, display: 'inline-block' }}
                >
                    BROWSE TRIPS
                </Link>
            </div>
        </section>
    );
}
