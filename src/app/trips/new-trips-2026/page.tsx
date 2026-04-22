import Image from 'next/image';
import Link from 'next/link';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function NewTrips2026Page() {
    const newTrips = [
        // ... (existing data)
        {
            id: 'treasures-of-himalayas',
            title: 'Treasures of the Himalayas: Tibet, Nepal & Bhutan',
            subtitle: 'Small Group Adventure',
            image: '/images/bhutan/main1.webp',
            location: 'Bhutan, Nepal, Tibet',
            level: 'Level 2+',
            days: '15 Days',
            price: '11,295',
            link: '/trips/treasures-of-himalayas'
        },
        {
            id: 'bhutan-walking-tour',
            title: 'Bhutan Walking Tour: The Dragon Kingdom',
            subtitle: 'Small Group Adventure',
            image: '/images/bhutan/main2.webp',
            location: 'Bhutan',
            level: 'Level 3',
            days: '12 Days',
            price: '7,495',
            link: '/trips/bhutan-walking-tour'
        },
        {
            id: 'cultural-crossroads',
            title: 'Cultural Crossroads of Bhutan',
            subtitle: 'Private Journey',
            image: '/images/bhutan/main3.webp',
            location: 'Bhutan',
            level: 'Level 2',
            days: '10 Days',
            price: '5,995',
            link: '/trips/cultural-crossroads'
        },
        {
            id: 'bhutan-peaks-valleys',
            title: 'Bhutan Peaks & Valleys',
            subtitle: 'Small Group Adventure',
            image: '/images/bhutan/main4.webp',
            location: 'Bhutan',
            level: 'Level 4',
            days: '14 Days',
            price: '8,295',
            link: '/trips/bhutan-peaks-valleys'
        }
    ];

    return (
        <main className="new-trips-page pt-0">
            <HeaderThemeHandler theme="auto" />
            {/* Hero Section */}
            <section className="new-trips-hero">
                <div className="hero-bg-wrapper">
                    <Image 
                        src="/images/bhutan/main4.webp" 
                        alt="Himalayan Mountains" 
                        fill 
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">New Trips for 2026</h1>
                </div>
            </section>

            {/* Intro Section */}
            <section className="new-trips-intro container">
                <div className="intro-grid-premium">
                    <div className="intro-title-col">
                        <h2 className="premium-heading">A New Era of Exploration</h2>
                        <div className="accent-line"></div>
                    </div>
                    <div className="intro-content-col">
                        <div className="intro-text-main">
                            We’re thrilled to share our new adventures for 2026 and beyond! This epic collection includes first-time 
                            exploratories, rugged expeditions, classic destinations, and dream trips inspired by our phenomenal Trip Leaders.
                            Hike footpaths between ancient villages, meet Tibetan monks in 
                            Lhasa’s famed Potala Palace, and explore the hidden trails of the Himalayas. No matter your passions, 
                            2026 has an unforgettable adventure in store for you.
                        </div>
                    </div>
                </div>
            </section>

            {/* Asia Section */}
            <section className="trips-section container">
                <h2 className="section-title">Bhutan</h2>
                <div className="trips-grid-4">
                    {newTrips.map((trip) => (
                        <div key={trip.id} className="trip-card-detailed">
                            <div className="trip-card-top">
                                <div className="new-trip-badge">NEW TRIP</div>
                                <div className="trip-image-wrap">
                                    <Image src={trip.image} alt={trip.title} fill style={{ objectFit: 'cover' }} />
                                </div>
                            </div>
                            <div className="trip-card-body">
                                <div className="trip-subtitle-box">{trip.subtitle}</div>
                                <h3 className="trip-title">{trip.title}</h3>
                                
                                <ul className="trip-info-list">
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {trip.location}
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="20" x2="12" y2="10"></line>
                                            <line x1="18" y1="20" x2="18" y2="4"></line>
                                            <line x1="6" y1="20" x2="6" y2="16"></line>
                                        </svg>
                                        {trip.level}
                                    </li>
                                    <li>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                        {trip.days}
                                    </li>
                                </ul>
                            </div>
                            <div className="trip-card-footer">
                                <div className="trip-price">From ${trip.price}</div>
                                <Link href={trip.link} className="view-trip-btn">VIEW TRIP</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
