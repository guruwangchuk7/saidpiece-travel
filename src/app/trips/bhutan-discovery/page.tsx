'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BhutanDiscoveryTrip() {
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1); // 1 = days 1-3

    const toggleAccordion = (day: number) => {
        setOpenDay(openDay === day ? null : day);
    };

    return (
        <main className="trip-detail-page">
            <Header theme="light" />

            <div className="trip-hero">
                <Image src="/images/bhutan/main4.JPG" alt="Bhutan Discovery" fill style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>

                <div className="trip-hero-content container">
                    <h1>Bhutan Discovery</h1>
                    <p className="hero-subtitle">Perfect First-Time Journey to Paro, Thimphu & Punakha</p>
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
                                <span className="value">8 Days / 7 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$2,400</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Easy Active</span>
                            </div>
                        </div>
                        <div className="quick-info-ctas">
                            <button className="btn btn-outline" style={{ borderColor: 'white', color: 'white', marginRight: '15px' }}>DOWNLOAD ITINERARY</button>
                            <button className="btn btn-primary" style={{ backgroundColor: '#fff', color: '#111' }}>BOOK ONLINE</button>
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
                        <p className="lead-text">Bhutan is one of the few places where travel still feels meaningful— quiet monasteries above pine forests, rivers flowing through fertile valleys, and a culture guided by the philosophy of Gross National Happiness.</p>

                        <p>This journey is designed for first-time visitors who want to experience Bhutan&apos;s iconic destinations without feeling rushed, while enjoying private guiding, seamless travel arrangements, and comfortable boutique stays.</p>

                        <p>You will explore the gateway valley of Paro, the vibrant capital Thimphu, and the warm river valley of Punakha— discovering Bhutan&apos;s traditions, landscapes, and spiritual heritage along the way.</p>

                        <div className="highlights-box">
                            <h3>Key Highlights</h3>
                            <ul className="highlights-list">
                                <li><strong>Hike</strong> to the iconic Tiger&apos;s Nest Monastery</li>
                                <li><strong>Explore</strong> Bhutan&apos;s capital city, Thimphu</li>
                                <li><strong>Visit</strong> Punakha Dzong, one of Bhutan&apos;s most beautiful fortresses</li>
                                <li><strong>Scenic drive</strong> over Dochula Pass with Himalayan views</li>
                                <li><strong>Hands-on</strong> cultural experiences such as archery and crafts</li>
                                <li><strong>Relax</strong> with wellness moments including meditation and hot stone baths</li>
                            </ul>
                        </div>
                    </section>

                    {/* Itinerary Content */}
                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>

                        {/* Fake Map implementation to match design spec */}
                        <div className="interactive-map-placeholder" style={{ position: 'relative', height: '300px', backgroundColor: '#e9ecef', borderRadius: '8px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="/images/bhutan/main2.JPG" alt="Route Map" fill style={{ objectFit: 'cover', opacity: 0.6, borderRadius: '8px' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '15px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Interactive Route Map: Paro → Thimphu → Punakha</div>
                        </div>

                        <div className="itinerary-accordion">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-3</div>
                                    <span className="day-title">Arrival & Paro Valley Heritage</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 1 — Arrive in Paro:</strong> Arrive in Paro and transfer to your hotel. Enjoy a gentle acclimatisation walk and a welcome dinner.</p>
                                    <p><strong>Day 2 — Paro Valley Heritage:</strong> Visit Rinpung Dzong viewpoint and explore Bhutanese heritage sites. Optional farmhouse lunch and quiet monastery visit.</p>
                                    <p><strong>Day 3 — Tiger&apos;s Nest Monastery Hike:</strong> Hike to the famous Taktsang Monastery, Bhutan&apos;s most sacred pilgrimage site.</p>
                                </div>
                            </div>

                            {/* Accordion Item 2 */}
                            <div className={`accordion-item ${openDay === 2 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(2)}>
                                    <div className="day-badge">Days 4-5</div>
                                    <span className="day-title">Thimphu Culture & Crafts</span>
                                    <svg className={`chevron ${openDay === 2 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 4 — Paro to Thimphu:</strong> Drive to Thimphu and visit Buddha Dordenma overlooking the valley.</p>
                                    <p><strong>Day 5 — Thimphu Culture & Crafts:</strong> Explore Bhutan’s traditional crafts, markets, and cultural heritage.</p>
                                </div>
                            </div>

                            {/* Accordion Item 3 */}
                            <div className={`accordion-item ${openDay === 3 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(3)}>
                                    <div className="day-badge">Days 6-8</div>
                                    <span className="day-title">Punakha Valley & Departure</span>
                                    <svg className={`chevron ${openDay === 3 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 6 — Thimphu to Punakha:</strong> Cross Dochula Pass and descend into the Punakha Valley.</p>
                                    <p><strong>Day 7 — Punakha Valley Exploration:</strong> Gentle hike to Khamsum Chorten and explore the valley.</p>
                                    <p><strong>Day 8 — Departure:</strong> Transfer to Paro airport for departure.</p>
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
                                        <td>Mar 12, 2026</td>
                                        <td>Mar 19, 2026</td>
                                        <td><span className="status-badge space">Space Available</span></td>
                                        <td>$2,400</td>
                                        <td><button className="btn btn-outline small">Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Apr 05, 2026</td>
                                        <td>Apr 12, 2026</td>
                                        <td><span className="status-badge last-call">Limited Space</span></td>
                                        <td>$2,650</td>
                                        <td><button className="btn btn-outline small">Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Oct 10, 2026</td>
                                        <td>Oct 17, 2026</td>
                                        <td><span className="status-badge guaranteed">Guaranteed</span></td>
                                        <td>$3,100</td>
                                        <td><button className="btn btn-outline small">Book Now</button></td>
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

                <section className="related-trips container">
                    <h2 className="text-center">Other Trips You Might Like</h2>
                    <div className="related-carousel">
                        <div className="trip-result-card small-card">
                            <Image src="/images/bhutan/main5.JPG" alt="Cultural Immersion" width={300} height={200} style={{ objectFit: 'cover' }} />
                            <div className="card-padding">
                                <h4>Bhutan Cultural Immersion</h4>
                                <span>12 Days</span>
                            </div>
                        </div>
                        <div className="trip-result-card small-card">
                            <Image src="/images/bhutan/main6.JPG" alt="Nature Retreat" width={300} height={200} style={{ objectFit: 'cover' }} />
                            <div className="card-padding">
                                <h4>Bhutan Nature Retreat</h4>
                                <span>10 Days</span>
                            </div>
                        </div>
                        <div className="trip-result-card small-card">
                            <Image src="/images/bhutan/9.JPG" alt="Romantic Escape" width={300} height={200} style={{ objectFit: 'cover' }} />
                            <div className="card-padding">
                                <h4>Romantic Escape</h4>
                                <span>10 Days</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Dark CTA */}
                <section className="final-dark-cta">
                    <div className="container text-center">
                        <h2>Ready to experience the true rhythm of Bhutan?</h2>
                        <p>Our travel experts are ready to personalize this itinerary for you.</p>
                        <button className="btn btn-primary large-btn">Book Your Trip Today</button>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
