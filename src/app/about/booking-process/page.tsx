'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function BookingProcess() {
    return (
        <main className="our-story-page page-with-header">
            <Header theme="light" />

            {/* 1. Hero & Entry */}
            <section className="story-hero-refined">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main2.JPG"
                        alt="Planning Your Trip"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined">
                    <h1 className="serif-title">Booking Process</h1>
                </div>

                <div className="floating-contact">
                    <a href="mailto:saidpiece@gmail.com" className="floating-mail-btn" aria-label="Contact Us">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </a>
                </div>
            </section>

            {/* Endorsement Block */}
            <section className="endorsement-block container text-center">
                <h2>Seemless Planning, Tailored Results</h2>
                <div className="forbes-quote">
                    <blockquote>
                        &quot;Ease is the hallmark of professional planning. We handle the complexity, so you can focus on the experience.&quot;
                    </blockquote>
                    <cite>— Our Service Promise</cite>
                </div>
            </section>

            {/* Content Grid */}
            <div className="narrative-grid container">

                {/* Consultation */}
                <section className="asymmetric-row history-split">
                    <div className="column-assets portrait-frame">
                        <div className="bw-image-wrapper">
                            <Image
                                src="/images/bhutan/13.JPG"
                                alt="Consultation"
                                fill
                                className="grayscale-historical"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="column-text">
                        <span className="date-marker">STEP 01</span>
                        <h2 className="serif-h2">Personal Consultation</h2>
                        <p>
                            Every journey with Saidpiece begins with a conversation. We don&apos;t believe in one-size-fits-all itineraries. Whether you start by browsing our curated trips or using our Trip Wizard, our experts reach out to understand your passions, pace, and purpose.
                        </p>
                        <p>
                            We discuss everything from seasonal nuances to physical comfort levels, ensuring that the draft itinerary is a true reflection of your vision for Bhutan.
                        </p>
                    </div>
                </section>

                {/* Tailoring */}
                <section className="asymmetric-row founding-detail reverse">
                    <div className="column-assets stacks">
                        <div className="mini-photo-stack">
                            <div className="mini-photo p1">
                                <Image src="/images/bhutan/14.JPG" alt="Planning Details" fill />
                            </div>
                            <div className="mini-photo p2">
                                <Image src="/images/bhutan/15.JPG" alt="Document Prep" fill />
                            </div>
                        </div>
                    </div>
                    <div className="column-text">
                        <h2 className="serif-h2">Tailoring the Itinerary</h2>
                        <p>
                            Once we have a foundation, the refinement begins. We hand-select accommodations—from luxury mountain lodges to authentic village farmstays—and choose the specific guides whose expertise best matches your interests.
                        </p>
                        <p>
                            This is also where we integrate special requests: private monastic blessings, helicopter transfers to remote valleys, or specialized photography permits. Your final itinerary is a bespoke document of discovery.
                        </p>
                    </div>
                </section>

                {/* Logistics */}
                <section className="asymmetric-row modern-legacy">
                    <div className="column-text">
                        <span className="date-marker">STEP 03</span>
                        <h2 className="serif-h2">Seamless Logistics</h2>
                        <p>
                            Bhutan&apos;s visa process and flight logistics can be intricate. We handle everything. From your visa application and Sustainable Development Fee processing to booking Drukair or Bhutan Airlines flights, our team ensures every bureaucratic detail is perfect.
                        </p>
                        <p>
                            You receive a comprehensive pre-departure kit with everything from packing lists to cultural etiquette guides, so you can step off the plane in Paro feeling fully prepared and completely at ease.
                        </p>
                    </div>
                    <div className="column-assets landscape-frame">
                        <Image src="/images/bhutan/16.JPG" alt="Arriving in Bhutan" fill style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Centered CTA */}
                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">Start Your Journey Today</h2>
                    <p className="centered-paragraph">
                        Ready to begin the process? Use our interactive Trip Wizard or browse our flagship itineraries to find your starting point. Our experts are standing by to guide you through every step.
                    </p>
                    <div className="divider-line"></div>
                    <div className="cta-buttons">
                        <Link href="/wizard" className="btn btn-primary large-btn">Start Trip Wizard</Link>
                        <Link href="/browse" className="btn btn-outline large-btn">Browse Itineraries</Link>
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    );
}
