'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function LocalExpertise() {
    return (
        <main className="our-story-page page-with-header">
            <Header theme="light" />

            {/* 1. Hero & Entry */}
            <section className="story-hero-refined">
                <div className="story-hero-bg">
                    <Image
                        src="/images/bhutan/main4.webp"
                        alt="Local Wisdom"
                        fill
                        sizes="100vw"
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined">
                    <h1 className="serif-title">Local Expertise</h1>
                </div>

            </section>

            {/* Endorsement Block */}
            <section className="endorsement-block container text-center">
                <h2>The Keepers of the Rhythm</h2>
                <div className="forbes-quote">
                    <blockquote>
                        &quot;Knowledge is the treasure, but practice is the key to it.&quot;
                    </blockquote>
                    <cite>— Bhutanese Proverb</cite>
                </div>
            </section>

            {/* Content Grid */}
            <div className="narrative-grid container">

                {/* Deep Roots */}
                <section className="asymmetric-row history-split">
                    <div className="column-assets portrait-frame">
                        <div className="bw-image-wrapper">
                            <Image
                                src="/images/bhutan/19.webp"
                                alt="Local Village"
                                fill
                                className="grayscale-historical"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="column-text">
                        <span className="date-marker">BORN IN BHUTAN</span>
                        <h2 className="serif-h2">Deep Roots, Local Heart</h2>
                        <p>
                            Unlike global operators who manage from afar, Saidpiece Travel is headquartered in the heart of Thimphu. Our expertise isn&apos;t researched; it is lived. We know the turn of every mountain pass and the history behind every monastery because we are part of the community.
                        </p>
                        <p>
                            This proximity allows us to secure access to private ceremonies, local festivals, and remote villages that remain off the map for others. We don&apos;t just show you Bhutan; we welcome you into our home.
                        </p>
                    </div>
                </section>

                {/* Wisdom Keepers */}
                <section className="asymmetric-row founding-detail reverse">
                    <div className="column-assets stacks">
                        <div className="mini-photo-stack">
                            <div className="mini-photo p1">
                                <Image src="/images/bhutan/20.webp" alt="Wisdom Keeper" fill sizes="(max-width: 768px) 50vw, 220px" />
                            </div>
                            <div className="mini-photo p2">
                                <Image src="/images/bhutan/21.webp" alt="Expert Guide" fill sizes="(max-width: 768px) 50vw, 220px" />
                            </div>
                        </div>
                    </div>
                    <div className="column-text">
                        <h2 className="serif-h2">The Wisdom Keepers</h2>
                        <p>
                            Our guides are the cornerstone of your experience. More than just navigators, they are cultural archivists, monastic students, and environmental stewards. They possess a deep understanding of Gross National Happiness and the intricate tapestry of Bhutanese Buddhism.
                        </p>
                        <p>
                            We invest heavily in the ongoing education of our team, ensuring that your companion on the road is capable of translating not just words, but the very soul of the landscape you inhabit.
                        </p>
                    </div>
                </section>

                {/* Hidden Knowledge */}
                <section className="asymmetric-row modern-legacy">
                    <div className="column-text">
                        <span className="date-marker">THE HIDDEN VALLEYS</span>
                        <h2 className="serif-h2">Beyond the Checklist</h2>
                        <p>
                            True expertise is knowing when to deviate from the planned path. Our team excels at the &quot;unscripted moments&quot;—the chance encounter with a spinning prayer wheel, an impromptu tea with a yak herder, or a quiet moment of meditation in a remote hermitage.
                        </p>
                        <p>
                            We use our local influence to ensure that your itinerary remains flexible, responsive to the rhythm of the day and the whispers of the valley.
                        </p>
                    </div>
                    <div className="column-assets landscape-frame">
                        <Image src="/images/bhutan/18.webp" alt="Hidden Valley" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                    </div>
                </section>

                {/* Centered CTA */}
                <section className="family-ownership-centered text-center">
                    <div className="divider-line"></div>
                    <h2 className="serif-h2">Experience the Unrivaled</h2>
                    <p className="centered-paragraph">
                        With over four decades of collective local experience, we invite you to see Bhutan through the eyes of those who call it home. Discover the difference that true local expertise makes.
                    </p>
                    <div className="divider-line"></div>
                    <Link href="/browse" className="btn btn-primary large-btn">Meet Our Kingdom</Link>
                </section>

            </div>

            <Footer />
        </main>
    );
}
