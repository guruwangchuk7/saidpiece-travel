'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NatureRetreatTrip() {
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1); // 1 = days 1-3

    const toggleAccordion = (day: number) => {
        setOpenDay(openDay === day ? null : day);
    };

    return (
        <main className="trip-detail-page">
            <Header theme="light" />

            <div className="trip-hero">
                <Image src="/images/bhutan/main6.JPG" alt="Nature Retreat" fill style={{ objectFit: 'cover' }} priority />
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
                                <span className="value">7 Days / 6 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$2,100</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Moderate Trekking</span>
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
                            <Image src="/images/bhutan/main2.JPG" alt="Route Map" fill style={{ objectFit: 'cover', opacity: 0.6, borderRadius: '8px' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '15px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Interactive Route Map: Paro → Haa Valley → Paro</div>
                        </div>

                        <div className="itinerary-accordion">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-2</div>
                                    <span className="day-title">Arrival & Acclimatisation</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 1 — Arrive in Paro:</strong> Take in the freshest air in the world as you step off the plane. Enjoy a welcome dinner made from 100% organic local ingredients.</p>
                                    <p><strong>Day 2 — Paro Pine Forests:</strong> Gentle acclimatization hike to Zuri Dzong through beautiful pine forests. Afternoon yoga and meditation.</p>
                                </div>
                            </div>

                            {/* Accordion Item 2 */}
                            <div className={`accordion-item ${openDay === 2 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(2)}>
                                    <div className="day-badge">Days 3-5</div>
                                    <span className="day-title">Chele La Pass & Haa Valley</span>
                                    <svg className={`chevron ${openDay === 2 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 3 — Chele La Pass:</strong> Drive to the highest motorable road in Bhutan. Enjoy a high-altitude hike among prayer flags and blue poppies.</p>
                                    <p><strong>Day 4 — Haa Valley Exploration:</strong> Wake up in an eco-lodge. Spend the day hiking or cycling through the untouched remote wilderness of Haa.</p>
                                    <p><strong>Day 5 — Kila Nunnery:</strong> Hike to the cliffside Kila Goemba nunnery. Experience deep silence and reflection before returning to Paro.</p>
                                </div>
                            </div>

                            {/* Accordion Item 3 */}
                            <div className={`accordion-item ${openDay === 3 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(3)}>
                                    <div className="day-badge">Days 6-7</div>
                                    <span className="day-title">The Tiger&apos;s Nest & Departure</span>
                                    <svg className={`chevron ${openDay === 3 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 6 — Taktsang Hike:</strong> Rise early for the ultimate Bhutanese hike up to the Tiger&apos;s Nest. Evening traditional hot stone bath infused with mountain herbs.</p>
                                    <p><strong>Day 7 — Departure:</strong> Leave rejuvenated as our team brings you to the airport for your onward journey.</p>
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
                                        <td>Mar 21, 2026</td>
                                        <td><span className="status-badge space">Spring Blooms</span></td>
                                        <td>$2,100</td>
                                        <td><button className="btn btn-outline small">Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>May 10, 2026</td>
                                        <td>May 16, 2026</td>
                                        <td><span className="status-badge space">Space Available</span></td>
                                        <td>$2,100</td>
                                        <td><button className="btn btn-outline small">Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Sep 20, 2026</td>
                                        <td>Sep 26, 2026</td>
                                        <td><span className="status-badge last-call">Limited Space</span></td>
                                        <td>$2,450</td>
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
