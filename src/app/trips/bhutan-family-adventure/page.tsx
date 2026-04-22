'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function FamilyAdventureTrip() {
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1); // 1 = days 1-3

    const tripData = {
        name: "Bhutan Family Adventure",
        price: "3000",
        image: "/images/bhutan/9.webp"
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
                <Image src="/images/bhutan/9.webp" alt="Bhutan Family Adventure" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="hero-overlay-subtle"></div>

                <div className="container hero-content-center">
                    <h1 className="hero-title">Bhutan Family Adventure</h1>
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
                                <span className="value">Family Friendly</span>
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
                        <p className="lead-text">A journey crafted for families seeking meaningful adventure. Discover a kingdom where success is measured in happiness, nature is revered, and children are welcomed with open arms.</p>

                        <p>This 10-day family adventure balances cultural discovery with engaging outdoor activities designed to keep all generations entertained. From learning traditional archery to hiking through enchanted pine forests, every day brings a new hands-on experience.</p>

                        <p>Our expert guides are specially trained to engage younger travelers, turning temples into magical castles and hikes into exciting explorations of Himalayan wildlife.</p>

                        <div className="premium-highlights-frame">
                            <div className="highlights-map-side">
                                <div className="map-visual-wrap">
                                    <Image 
                                        src="/images/bhutan/9.webp" 
                                        alt="Family Journey Visualization" 
                                        fill 
                                        style={{ objectFit: 'cover' }} 
                                    />
                                    <div className="map-overlay-zoom">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                                    </div>
                                </div>
                                <div className="highlights-travel-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">Arrive:</span>
                                        <span className="meta-value">Paro, Bhutan</span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label">Depart:</span>
                                        <span className="meta-value">Paro, Bhutan</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="highlights-text-side">
                                <h3>Highlights</h3>
                                <ul className="premium-highlights-list">
                                    <li>With years of experience guiding families, we&apos;ve created the ultimate balanced itinerary.</li>
                                    <li>Learn the national sport of archery with traditional bamboo bows.</li>
                                    <li>Visit the Takin Preserve to see Bhutan&apos;s unique and legendary national animal.</li>
                                    <li>Hike gently through the Phobjikha Valley, home to rare black-necked cranes.</li>
                                    <li>Create your own personalized Bhutanese stamps at the National Post Office.</li>
                                    <li>River raft on the gentle, sparkling waters of the Mo Chhu River in Punakha.</li>
                                    <li>Enjoy a private family picnic in the pristine Himalayan countryside.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Itinerary Content */}
                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>

                        {/* Fake Map implementation to match design spec */}
                        <div className="interactive-map-placeholder" style={{ position: 'relative', height: '300px', backgroundColor: '#e9ecef', borderRadius: '8px', marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Image src="/images/bhutan/main2.webp" alt="Route Map" fill sizes="(max-width: 768px) 100vw, 900px" style={{ objectFit: 'cover', opacity: 0.6, borderRadius: '8px' }} />
                            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '15px 30px', borderRadius: '4px', fontWeight: 'bold' }}>Interactive Route Map: Paro → Thimphu → Punakha → Phobjikha</div>
                        </div>

                        <div className="itinerary-accordion">
                            {/* Accordion Item 1 */}
                            <div className={`accordion-item ${openDay === 1 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(1)}>
                                    <div className="day-badge">Days 1-3</div>
                                    <span className="day-title">Arrival & Thimphu Fun</span>
                                    <svg className={`chevron ${openDay === 1 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 1 — Welcome to Bhutan:</strong> Arrive in Paro. Drive to Thimphu and settle into your family-friendly hotel.</p>
                                    <p><strong>Day 2 — Takins & Stamps:</strong> Visit the Motithang Takin Preserve. Head to the General Post office where kids can make stamps featuring their own faces!</p>
                                    <p><strong>Day 3 — Folk Heritage:</strong> Visit the Simply Bhutan museum for interactive demonstrations of traditional life and archery.</p>
                                </div>
                            </div>

                            {/* Accordion Item 2 */}
                            <div className={`accordion-item ${openDay === 2 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(2)}>
                                    <div className="day-badge">Days 4-6</div>
                                    <span className="day-title">Punakha Adventures & Phobjikha</span>
                                    <svg className={`chevron ${openDay === 2 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 4 — Dochula pass & Punakha:</strong> See the 108 memorial chortens. Descend into Punakha for a mild river rafting experience perfect for families.</p>
                                    <p><strong>Day 5 — Punakha Dzong & Villages:</strong> Walk across the longest suspension bridge in Bhutan. Picnic lunch by the river.</p>
                                    <p><strong>Day 6 — Phobjikha Valley:</strong> Drive to the glacial valley of Phobjikha. Visit the Black-Necked Crane Information Centre.</p>
                                </div>
                            </div>

                            {/* Accordion Item 3 */}
                            <div className={`accordion-item ${openDay === 3 ? 'open' : ''}`}>
                                <button className="accordion-header" onClick={() => toggleAccordion(3)}>
                                    <div className="day-badge">Days 7-10</div>
                                    <span className="day-title">Paro Valley & The Tiger&apos;s Nest</span>
                                    <svg className={`chevron ${openDay === 3 ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </button>
                                <div className="accordion-content">
                                    <p><strong>Day 7 — Return to Paro:</strong> Enjoy the scenic drive back to Paro valley. Evening free for souvenir shopping.</p>
                                    <p><strong>Day 8 — Explorations:</strong> Visit the massive ruins of Drukgyel Dzong. Try a traditional hot stone bath to relax.</p>
                                    <p><strong>Day 9 — The Big Hike:</strong> A family achievement—hiking to the legendary Tiger&apos;s Nest monastery. Ponies can be arranged for younger children for the first half.</p>
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
                                        <td>Jul 10, 2026</td>
                                        <td>Jul 19, 2026</td>
                                        <td><span className="status-badge space">School Holidays</span></td>
                                        <td>$3,000</td>
                                        <td><button className="btn btn-outline small" onClick={handleBookOnline}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Aug 05, 2026</td>
                                        <td>Aug 14, 2026</td>
                                        <td><span className="status-badge last-call">Limited Space</span></td>
                                        <td>$3,000</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=3000`)}>Book Now</button></td>
                                    </tr>
                                    <tr>
                                        <td>Dec 20, 2026</td>
                                        <td>Dec 29, 2026</td>
                                        <td><span className="status-badge guaranteed">Guaranteed</span></td>
                                        <td>$3,400</td>
                                        <td><button className="btn btn-outline small" onClick={() => router.push(`/confirm-pay?trip=${encodeURIComponent(tripData.name)}&amount=3400`)}>Book Now</button></td>
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

