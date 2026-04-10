'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



import { useAuth } from '@/hooks/useAuth';

export default function NatureRetreatTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1); // 1 = days 1-3

    const tripData = {
        name: "Nature Retreat",
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
        <main className="trip-detail-page">

            <div className="trip-hero">
                <Image src="/images/bhutan/main6.webp" alt="Nature Retreat" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>

                <div className="trip-hero-content container">
                    <h1>Nature Retreat</h1>
                    <p className="hero-subtitle">Disconnect and Recharge in the Himalayas</p>
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
                                <span className="value">10 Days / 9 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$3,000</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Moderate Trekking</span>
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
                {/* Sticky Side Navigation */}
                <aside className="trip-sidebar">
                    <nav className="sticky-nav">
                        <ul>
                            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                            <li className={activeTab === 'itinerary' ? 'active' : ''} onClick={() => setActiveTab('itinerary')}>Itinerary</li>
                            <li className={activeTab === 'dates' ? 'active' : ''} onClick={() => setActiveTab('dates')}>Dates & Pricing</li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content Sections */}
                <div className="trip-main-content">
                    {/* Overview Content */}
                    <section id="overview" className={`content-section ${activeTab === 'overview' ? 'active' : 'hidden'}`}>
                        <h2>Journey Overview</h2>
                        <p className="lead-text">Step off the map and into some of the most pristine wilderness remaining on Earth. Bhutan is the world&apos;s only carbon-negative country, proudly protecting its ancient old-growth forests and alpine meadows.</p>

                        <p>This 7-day retreat is perfect for nature lovers, bird watchers, and those who want to reset their minds away from the noise of the modern world. You will spend your days hiking through rhododendron forests and your evenings in eco-lodges or glamping under the Himalayan stars.</p>

                        <p>Guided by our local naturalists, you&apos;ll discover the rich biodiversity of the Paro and Haa Valleys, learning about Bhutan&apos;s unique approaches to conservation and environmental harmony.</p>

                        <div className="highlights-box">
                            <h3>Key Highlights</h3>
                            <ul className="highlights-list">
                                <li><strong>Hike</strong> the untouched trails of the remote Haa Valley</li>
                                <li><strong>Spot</strong> rare Himalayan bird species with expert naturalist guides</li>
                                <li><strong>Meditate</strong> in a secluded alpine nunnery overlooking the valley</li>
                                <li><strong>Stay</strong> in sustainable eco-lodges and luxury canvas tents</li>
                                <li><strong>Drive</strong> across the spectacular Chele La pass (3,988m)</li>
                                <li><strong>Disconnect</strong> fully with dedicated digital detox days</li>
                            </ul>
                        </div>
                    </section>

                    {/* Itinerary Content */}
                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>

                        {/* Fake Map implementation to match design spec */}
                        <div className="interactive-map-placeholder" style={{ position: 'relative', height: '300px', backgroundColor: '#e9ecef', borderRadius: '8px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="/images/bhutan/main2.webp" alt="Route Map" fill sizes="(max-width: 768px) 100vw, 900px" style={{ objectFit: 'cover', opacity: 0.6, borderRadius: '8px' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '15px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Interactive Route Map: Paro → Haa Valley → Paro</div>
                        </div>

                        <div className="itinerary-accordion">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-3</div>
                                    <span className="day-title">Arrival & Spirit of Paro</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 1 — Arrive in Paro:</strong> Take in the freshest air in the world. Welcome dinner with organic local ingredients.</p>
                                    <p><strong>Day 2 — Paro Valley Slow Day:</strong> Gentle walk to Zuri Dzong for panoramic views. Afternoon meditation session.</p>
                                    <p><strong>Day 3 — Paro to Thimphu:</strong> Scenic drive to the capital. Visit Buddha Dordenma for a sunset mindfulness moment.</p>
                                </div>
                            </div>

                            <div className={`accordion-item ${openDay === 2 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(2)}>
                                    <div className="day-badge">Days 4-6</div>
                                    <span className="day-title">Thimphu & Punakha Valleys</span>
                                    <svg className={`chevron ${openDay === 2 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 4 — Thimphu Nature & Spirit:</strong> Explore Sangaygang for views and visit the Cheri Monastery hike— Bhutan’s first monastery.</p>
                                    <p><strong>Day 5 — Thimphu to Punakha:</strong> Cross Dochula Pass (3,100m). Visit the architectural masterpiece of Punakha Dzong.</p>
                                    <p><strong>Day 6 — Punakha Valley Leisure:</strong> A slow day by the Mo Chhu river. Optional riverside picnic and village walk.</p>
                                </div>
                            </div>

                            <div className={`accordion-item ${openDay === 3 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(3)}>
                                    <div className="day-badge">Days 7-10</div>
                                    <span className="day-title">Phobjikha Wildlife & The Tiger&apos;s Nest</span>
                                    <svg className={`chevron ${openDay === 3 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 7 — Punakha to Phobjikha:</strong> Drive to the stunning glacial valley of Phobjikha, home to black-necked cranes.</p>
                                    <p><strong>Day 8 — Phobjikha Slow Pacing:</strong> Wander through the valley trails. Visit Gangtey Goemba monastery.</p>
                                    <p><strong>Day 9 — Phobjikha to Paro:</strong> Return to Paro. Conclude with a traditional hot stone bath infused with mountain herbs.</p>
                                    <p><strong>Day 10 — Departure:</strong> Say goodbye to the Dragon Kingdom as you fly onward.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dates & Pricing */}
                    <section id="dates" className={`content-section ${activeTab === 'dates' ? 'active' : 'hidden'}`}>
                        <h2>Dates & Pricing</h2>
                        <div className="table-responsive">
                            <table className="dates-pricing-table">
                                <thead>
                                    <tr>
                                        <th>Departure Date</th>
                                        <th>Return Date</th>
                                        <th>Status</th>
                                        <th>Starting Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Mar 15, 2026</td>
                                        <td>Mar 24, 2026</td>
                                        <td><span className="status-badge space">Spring Blooms</span></td>
                                        <td>$3,000</td>
                                        <td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>May 10, 2026</td>
                                        <td>May 19, 2026</td>
                                        <td><span className="status-badge space">Space Available</span></td>
                                        <td>$3,250</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=3250`)}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Sep 20, 2026</td>
                                        <td>Sep 29, 2026</td>
                                        <td><span className="status-badge last-call">Limited Space</span></td>
                                        <td>$3,800</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=3800`)}>Book Now</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="pricing-note">* Pricing based on double occupancy. Single supplements apply. SDF taxes and visa fees included.</p>
                    </section>
                </div>
            </div>

            {/* Social Proof Gallery & Bottom CTA Container */}
            <div className="bottom-sections">
                <section className="testimonials-masonry container">
                    <h2 className="text-center">Past Travelers Speak</h2>
                    <div className="masonry-grid">
                        <div className="masonry-item">
                            <div className="quote-icon">&quot;</div>
                            <p>The entire trip was perfectly orchestrated. Our guide was incredibly knowledgeable and passionate, making every day an unforgettable adventure.</p>
                            <span className="author">— Sarah Mitchell</span>
                        </div>
                        <div className="masonry-item">
                            <div className="quote-icon">&quot;</div>
                            <p>An absolute life-changing experience. Being so close to nature while feeling completely supported by expert guides is something I&apos;ll never forget.</p>
                            <span className="author">— Elena Rodriguez</span>
                        </div>
                    </div>
                </section>


                {/* Final Dark CTA */}
                <section className="final-dark-cta">
                    <div className="container text-center">
                        <h2>Ready to experience the true rhythm of Bhutan?</h2>
                        <p>Our travel experts are ready to personalize this itinerary for you.</p>
                        <button className="btn btn-primary large-btn" onClick={handleBookOnline}>Book Your Trip Today</button>
                    </div>
                </section>
            </div>

        </main>
    );
}

