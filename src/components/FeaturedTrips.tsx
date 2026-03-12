import Image from 'next/image';
import Link from 'next/link';

const featuredTrips = [
    { title: 'Bhutan Discovery', duration: '8 Days', price: 'From $2,400', image: 'bhutan/main4.JPG' },
    { title: 'Bhutan Cultural Immersion', duration: '12 Days', price: 'Price on Request', image: 'bhutan/main5.JPG' },
    { title: 'Bhutan Nature Retreat', duration: '10 Days', price: 'From $6,500', image: 'bhutan/main6.JPG' },
    { title: 'Bhutan Romantic Escape', duration: '10 Days', price: 'From $8,900', image: 'bhutan/9.JPG' }
];

export default function FeaturedTrips() {
    return (
        <section className="featured-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Featured Trips</h2>
                    <Link href="/browse" className="link-btn">View All Trips</Link>
                </div>

                <div className="featured-grid">
                    {featuredTrips.map((trip, i) => (
                        <div className="trip-card" key={i}>
                            <div className="image-placeholder" style={{ position: 'relative', background: 'transparent' }}>
                                <Image src={`/images/${trip.image}`} alt={trip.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="trip-card-content">
                                <h3 className="trip-card-title">{trip.title}</h3>
                                <div className="trip-card-details">
                                    <span>{trip.duration}</span>
                                    <span>{trip.price}</span>
                                </div>
                                <div className="trip-card-footer">
                                    <a href="#" className="link-btn-small">View Trip</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
