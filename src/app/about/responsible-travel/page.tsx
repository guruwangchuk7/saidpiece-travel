'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function ResponsibleTravel() {
    return (
        <main className="our-story-page page-with-header">
            <Header theme="light" />

            {/* 1. Hero & Entry */}
            <section className="story-hero-refined">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main5.JPG"
                        alt="Sustainable Bhutan"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined">
                    <h1 className="serif-title">Responsible Travel</h1>
                </div>

            </section>

            {/* Endorsement Block */}
            <section className="endorsement-block container text-center">
                <h2>Our Ethos of Care</h2>
                <div className="forbes-quote">
                    <blockquote>
                        &quot;Travel is more than the seeing of sights; it is a change that goes on, deep and permanent, in the ideas of living.&quot;
                    </blockquote>
                    <cite>— Miriam Beard</cite>
                </div>
            </section>

            {/* Content Grid */}
            <div className="narrative-grid container">

                {/* Low Impact Tourism */}
                <section className="asymmetric-row history-split">
                    <div className="column-assets portrait-frame">
                        <div className="bw-image-wrapper">
                            <Image
                                src="/images/bhutan/15.JPG"
                                alt="Pristine Nature"
                                fill
                                className="grayscale-historical"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="column-text">
                        <span className="date-marker">OUR FOOTPRINT</span>
                        <h2 className="serif-h2">Low Impact, High Value</h2>
                        <p>
                            Bhutan is a pioneer in sustainable tourism, and Saidpiece Travel is proud to champion this &quot;High Value, Low Volume&quot; philosophy. We believe that true luxury lies in the preservation of the untouched—the quiet valleys, the pristine forests, and the unhurried way of life.
                        </p>
                        <p>
                            By meticulously planning every route, we ensure that our presence leaves no trace on the environment while maximizing the benefit to local ecosystems. Our journeys are designed to nurture the land as much as they inspire the soul.
                        </p>
                    </div>
                </section>

                {/* Community Support */}
                <section className="asymmetric-row founding-detail reverse">
                    <div className="column-assets stacks">
                        <div className="mini-photo-stack">
                            <div className="mini-photo p1">
                                <Image src="/images/bhutan/16.JPG" alt="Local Community" fill sizes="(max-width: 768px) 50vw, 220px" />
                            </div>
                            <div className="mini-photo p2">
                                <Image src="/images/bhutan/17.JPG" alt="Traditional Crafts" fill sizes="(max-width: 768px) 50vw, 220px" />
                            </div>
                        </div>
                    </div>
                    <div className="column-text">
                        <h2 className="serif-h2">Empowering Local Voices</h2>
                        <p>
                            We don&apos;t just visit communities; we partner with them. From staying in locally-owned high-end farmstays to employing guides from the valleys you explore, our economic footprint is designed to stay within Bhutan.
                        </p>
                        <p>
                            A significant portion of your journey&apos;s cost goes directly into the Sustainable Development Fee (SDF), supporting Bhutan&apos;s free healthcare, education, and carbon-neutral initiatives. With Saidpiece, your journey is an investment in a nation&apos;s future.
                        </p>
                    </div>
                </section>

                {/* Environmental Stewardship */}
                <section className="asymmetric-row modern-legacy">
                    <div className="column-text">
                        <span className="date-marker">CARBON NEUTRAL</span>
                        <h2 className="serif-h2">Preserving the Kingdom</h2>
                        <p>
                            As a carbon-negative nation, Bhutan sets a global example. We mirror this commitment by eliminating single-use plastics from our expeditions and supporting reforestation projects across the kingdom.
                        </p>
                        <p>
                            Our guides are trained not only in cultural history but in environmental stewardship, ensuring that every traveler becomes a temporary guardian of this sacred landscape.
                        </p>
                    </div>
                    <div className="column-assets landscape-frame">
                        <Image src="/images/bhutan/18.JPG" alt="Reforestation" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Centered CTA */}
                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">A Commitment for Tomorrow</h2>
                    <p className="centered-paragraph">
                        Responsible travel isn&apos;t a feature of our trips; it is the foundation upon which every itinerary is built. We invite you to join us in protecting the very rhythm of the country that makes it so extraordinary.
                    </p>
                    <div className="divider-line"></div>
                    <Link href="/browse" className="btn btn-primary large-btn">Browse Meaningful Journeys</Link>
                </section>

            </div>

            <Footer />
        </main>
    );
}
