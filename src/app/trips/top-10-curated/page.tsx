import Image from 'next/image';
import Link from 'next/link';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function Top10CuratedPage() {
    const curatedTrips = [
        {
            id: 'bhutan-discovery',
            title: 'Bhutan Discovery',
            image: '/images/bhutan/main1.webp',
            description: 'A comprehensive journey through the heart of the Dragon Kingdom, visiting the iconic Tiger\'s Nest and the serene valleys of Paro and Punakha.',
            link: '/trips/discovery'
        },
        {
            id: 'cultural-immersion',
            title: 'Cultural Immersion',
            image: '/images/bhutan/main2.webp',
            description: 'Dive deep into the living traditions of Bhutan. Experience village life, traditional arts, and ancient festivals that have remained unchanged for centuries.',
            link: '/trips/cultural'
        },
        {
            id: 'bhutan-family-adventure',
            title: 'Bhutan Family Adventure',
            image: '/images/bhutan/main3.webp',
            description: 'An engaging itinerary designed for all ages, featuring archery, light hikes, and interactive cultural experiences that bring the family together.',
            link: '/trips/family'
        },
        {
            id: 'nature-retreat',
            title: 'Nature Retreat',
            image: '/images/bhutan/main4.webp',
            description: 'Find serenity in the pristine landscapes of Phobjikha and Bumthang. A journey focused on wellness, meditation, and the untouched natural beauty of the Himalayas.',
            link: '/trips/nature'
        }
    ];

    return (
        <main className="top-10-page pt-0">
            <HeaderThemeHandler theme="auto" />
            {/* Hero Section */}
            <section className="top-10-hero">
                <div className="hero-bg-wrapper">
                    <Image
                        src="/images/bhutan/main1.webp"
                        alt="Bhutan Landscape"
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">Top 10 Curated Trips for 2026</h1>
                </div>
            </section>

            {/* Intro Section */}
            <section className="top-10-intro container">
                <div className="intro-grid-premium">
                    <div className="intro-title-col">
                        <h2 className="premium-heading">Handpicked for the Discerning Explorer</h2>
                        <div className="accent-line"></div>
                    </div>
                    <div className="intro-content-col">
                        <div className="intro-text-main">
                            Discover our most inspiring destinations for 2026, handpicked by Regional Specialists and seasoned
                            Trip Leaders to guarantee off-the-beaten-path delights and cultural immersion. Expect a balance of
                            hidden gems and iconic destinations reinvigorated by new momentum. Our curated collection represents the pinnacle of travel in Bhutan, focusing on authenticity, luxury, and profound connection to the land and its people.
                        </div>
                    </div>
                </div>
            </section>

            {/* Trips Grid */}
            <section className="top-10-grid container">
                <div className="trips-grid-inner">
                    {curatedTrips.map((trip) => (
                        <div key={trip.id} className="trip-card-v">
                            <div className="trip-card-image">
                                <Image src={trip.image} alt={trip.title} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="trip-card-content">
                                <h2>{trip.title}</h2>
                                <p>{trip.description}</p>
                                <Link href={trip.link} className="visit-link">
                                    VISIT {trip.title.toUpperCase()}
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="top-10-cta container" style={{ marginBottom: '100px' }}>
                <div className="cta-card">
                    <div className="cta-image-side">
                        <Image src="/images/bhutan/main2.webp" alt="Catalog" width={400} height={300} />
                    </div>
                    <div className="cta-text-side">
                        <h3>Plan Your 2026 Journey</h3>
                        <p>
                            Our specialists are ready to help you craft the perfect itinerary.
                            Contact us today to start planning your bespoke Bhutanese adventure.
                        </p>
                        <div className="cta-buttons">
                            <Link href="/contact" className="btn btn-primary">Contact a Specialist</Link>
                            <Link href="/catalog" className="btn btn-outline">Request Catalog</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
