'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function MeetOurTeam() {
    return (
        <main className="our-story-page page-with-header">
            <Header theme="light" />

            <section className="story-hero-refined">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main6.JPG"
                        alt="Saidpiece Travel team in Bhutan"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined">
                    <h1 className="serif-title">Meet Our Team</h1>
                </div>
            </section>

            <section className="endorsement-block container text-center">
                <h2>The People Behind Every Journey</h2>
                <div className="forbes-quote">
                    <blockquote>
                        &quot;A memorable journey is shaped by the people who guide it with care.&quot;
                    </blockquote>
                    <cite>— Saidpiece Travel</cite>
                </div>
            </section>

            <div className="narrative-grid container">
                <section className="asymmetric-row history-split">
                    <div className="column-assets portrait-frame">
                        <div className="bw-image-wrapper">
                            <Image
                                src="/images/bhutan/19.JPG"
                                alt="Bhutan travel specialist"
                                fill
                                className="grayscale-historical"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="column-text">
                        <span className="date-marker">THIMPHU BASED</span>
                        <h2 className="serif-h2">Designers of Seamless Travel</h2>
                        <p>
                            Our core team plans every itinerary from Bhutan itself. That means your trip is shaped by people who understand seasonality, road conditions, cultural calendars, and the subtle details that make a journey flow well.
                        </p>
                        <p>
                            From the first enquiry to your final departure, you are supported by travel planners who care deeply about clarity, responsiveness, and the integrity of your experience.
                        </p>
                    </div>
                </section>

                <section className="asymmetric-row founding-detail reverse">
                    <div className="column-assets stacks">
                        <div className="mini-photo-stack">
                            <div className="mini-photo p1">
                                <Image src="/images/bhutan/20.JPG" alt="Bhutanese guide" fill />
                            </div>
                            <div className="mini-photo p2">
                                <Image src="/images/bhutan/21.JPG" alt="Driver and local host" fill />
                            </div>
                        </div>
                    </div>
                    <div className="column-text">
                        <h2 className="serif-h2">Guides, Drivers, and Local Hosts</h2>
                        <p>
                            The team you meet on the ground includes experienced Bhutanese guides, trusted drivers, and local hosts who know how to balance comfort, access, and meaningful cultural context.
                        </p>
                        <p>
                            They are not simply service providers. They are interpreters of place, helping you understand the values, rituals, landscapes, and living traditions that define Bhutan.
                        </p>
                    </div>
                </section>

                <section className="asymmetric-row modern-legacy">
                    <div className="column-text">
                        <span className="date-marker">CAREFULLY CURATED</span>
                        <h2 className="serif-h2">A Team Built on Trust</h2>
                        <p>
                            We work with people we know personally and professionally. That continuity helps us maintain high standards across logistics, hospitality, and traveler care, especially when plans need to adapt in real time.
                        </p>
                        <p>
                            The result is a quieter kind of luxury: journeys that feel calm, well-supported, and deeply connected to the rhythm of the country.
                        </p>
                    </div>
                    <div className="column-assets landscape-frame">
                        <Image src="/images/bhutan/18.JPG" alt="Saidpiece team preparing a journey" fill style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                <section className="family-ownership-centered text-center">
                    <div className="column-text">
                        <span className="date-marker">WEBSUITE DEVELOPER</span>
                        <h2 className="serif-h2">Guru Wangchuk</h2>
                        <p>
                            The Saidpiece website & Saidpiece travel was developed by Guru Wangchuk, a full stack engineer based in Bhutan with hands-on experience across modern web platforms, responsive UI systems, performance optimization, blockchain-backed products, and secure application workflows.
                        </p>
                        <Link href="https://guruwangchuk.me/" target="_blank" rel="noreferrer" className="btn btn-primary large-btn">
                            Visit Developer Portfolio
                        </Link>
                    </div>
                </section>

                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">Travel with People Who Know Bhutan</h2>
                    <p className="centered-paragraph">
                        Meet the team through the journey itself: thoughtful planning, gracious hosting, and the confidence that every detail is being handled by people rooted in place.
                    </p>
                    <div className="divider-line"></div>
                    <Link href="/contact" className="btn btn-primary large-btn">Talk to Our Team</Link>
                </section>
            </div>

            <Footer />
        </main>
    );
}
