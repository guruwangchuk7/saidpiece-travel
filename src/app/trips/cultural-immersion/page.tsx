'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

import { useAuth } from '@/hooks/useAuth';

export default function CulturalImmersionTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1); // 1 = days 1-3

    const tripData = {
        name: "Cultural Immersion",
        price: "3600",
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
            <Header theme="light" />

            <div className="trip-hero">
                <Image src="/images/bhutan/main5.webp" alt="Cultural Immersion" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>

                <div className="trip-hero-content container">
                    <h1>Cultural Immersion</h1>
                    <p className="hero-subtitle">Deep dive into Bhutan&apos;s living traditions</p>
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
                                <span className="value">12 Days / 11 Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">$3,600</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">Moderate Cultural</span>
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
                        <p className="lead-text">Experience the beating heart of Bhutanese tradition. This journey goes beyond the surface, offering profound encounters with monks, artisans, and remote villagers whose way of life has remained unchanged for centuries.</p>

                        <p>Designed for travelers who seek authentic connection, this 12-day immersion takes you into the hidden valleys of central Bhutan. You will witness vibrant Tshechu festivals, learn the intricate art of Thangka painting, and partake in private ceremonies with local lamas.</p>

                        <p>We trace the ancient trading routes through Paro, Thimphu, Punakha, and the spiritual heartland of Bumthang, blending deep cultural insight with breathtaking Himalayan landscapes.</p>

                        <div className="highlights-box">
                            <h3>Key Highlights</h3>
                            <ul className="highlights-list">
                                <li><strong>Participate</strong> in a private Buddhist butter lamp blessing ceremony</li>
                                <li><strong>Explore</strong> the spiritual valley of Bumthang and its ancient monasteries</li>
                                <li><strong>Visit</strong> local weaving and traditional paper-making workshops</li>
                                <li><strong>Stay</strong> overnight in a traditional Bhutanese farmhouse</li>
                                <li><strong>Witness</strong> masked dances at a local Tsechu (festival dependent)</li>
                                <li><strong>Hike</strong> to the iconic Tiger&apos;s Nest as a concluding pilgrimage</li>
                            </ul>
                        </div>
                    </section>

                    {/* Itinerary Content */}
                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>

                        {/* Fake Map implementation to match design spec */}
                        <div className="interactive-map-placeholder" style={{ position: 'relative', height: '300px', backgroundColor: '#e9ecef', borderRadius: '8px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="/images/bhutan/main5.webp" alt="Route Map" fill sizes="(max-width: 768px) 100vw, 900px" style={{ objectFit: 'cover', opacity: 0.6, borderRadius: '8px' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '15px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Interactive Route Map: Paro → Thimphu → Punakha → Bumthang</div>
                        </div>

                        <div className="itinerary-accordion">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-3</div>
                                    <span className="day-title">Arrival & The Capital&apos;s Culture</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 1 — Arrive in Paro to Thimphu:</strong> Arrive in Paro and drive straight to Thimphu. Evening welcome dinner with traditional music.</p>
                                    <p><strong>Day 2 — Thimphu Textile & Arts:</strong> Visit the National Institute for Zorig Chusum (13 Traditional Arts) and the vast weekend market.</p>
                                    <p><strong>Day 3 — Monastic Life:</strong> Private audience with a local monk to discuss Buddhism, followed by a visit to the giant Buddha Dordenma.</p>
                                </div>
                            </div>

                            {/* Accordion Item 2 */}
                            <div className={`accordion-item ${openDay === 2 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(2)}>
                                    <div className="day-badge">Days 4-7</div>
                                    <span className="day-title">Punakha & Trongsa Valleys</span>
                                    <svg className={`chevron ${openDay === 2 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 4 — Dochula Pass to Punakha:</strong> Cross the 3,100m Dochula Pass. Visit the stunning architecture of Punakha Dzong.</p>
                                    <p><strong>Day 5 — Rural Life:</strong> Hike to Khamsum Yulley Namgyal Chorten. Afternoon archery session with local villagers.</p>
                                    <p><strong>Day 6 — Journey to Trongsa:</strong> Drive into central Bhutan via Pele La Pass. Stop at Chendebji Chorten.</p>
                                    <p><strong>Day 7 — Trongsa Dzong:</strong> Explore the ancestral home of the royal family before continuing to Bumthang.</p>
                                </div>
                            </div>

                            {/* Accordion Item 3 */}
                            <div className={`accordion-item ${openDay === 3 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(3)}>
                                    <div className="day-badge">Days 8-12</div>
                                    <span className="day-title">Bumthang Heartland & Departure</span>
                                    <svg className={`chevron ${openDay === 3 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 8-9 — Bumthang Exploration:</strong> Two full days exploring Bhutan&apos;s most sacred district. Visit Jambay Lhakhang and Kurjey Lhakhang. Evening farmhouse stay.</p>
                                    <p><strong>Day 10 — Domestic Flight to Paro:</strong> Take a short scenic flight from Bumthang back to Paro valley to avoid the long drive.</p>
                                    <p><strong>Day 11 — Tiger&apos;s Nest:</strong> Conclude your cultural journey with the essential pilgrimage hike to Taktsang Monastery.</p>
                                    <p><strong>Day 12 — Departure:</strong> Our team will see you off at Paro International Airport.</p>
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
                                        <td>May 10, 2026</td>
                                        <td>May 21, 2026</td>
                                        <td><span className="status-badge space">Space Available</span></td>
                                        <td>$3,600</td>
                                        <td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Sep 15, 2026</td>
                                        <td>Sep 26, 2026</td>
                                        <td><span className="status-badge last-call">Festival Dates</span></td>
                                        <td>$3,900</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=3900`)}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Oct 05, 2026</td>
                                        <td>Oct 16, 2026</td>
                                        <td><span className="status-badge guaranteed">Guaranteed</span></td>
                                        <td>$4,500</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=4500`)}>Book Now</button></td>
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

            <Footer />
        </main>
    );
}
