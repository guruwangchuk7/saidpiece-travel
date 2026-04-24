import Image from 'next/image';
import Link from 'next/link';
import { getCachedTrips } from '@/lib/data';

export default async function FeaturedTrips() {
    // Fetch cached trips on the server
    const allTrips = await getCachedTrips();
    const trips = allTrips.slice(0, 4);

    return (
        <section className="featured-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Featured Trips</h2>
                    <Link href="/browse" className="link-btn">View All Trips</Link>
                </div>

                <div className="featured-grid">
                    {trips.map((trip: any) => (
                        <div className="trip-card" key={trip.id}>
                            <div className="image-placeholder" style={{ position: 'relative', background: '#f5f5f5' }}>
                                <Image
                                    src={trip.image_url.startsWith('http') ? trip.image_url : `/images/${trip.image_url}`}
                                    alt={trip.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="trip-card-content">
                                <h3 className="trip-card-title">{trip.title}</h3>
                                <div className="trip-card-details">
                                    <span>{trip.duration_days} Days</span>
                                </div>
                                <div className="trip-card-footer">
                                    <span className="trip-price">From ${trip.starting_price}</span>
                                    <Link href={`/trips/${trip.slug}`} className="link-btn-small">View Trip</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trips.length === 0 && (
                        <p style={{ gridColumn: 'span 4', textAlign: 'center', color: '#999', padding: '40px' }}>
                            No featured journeys available at the moment.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

