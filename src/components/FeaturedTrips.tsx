import Image from 'next/image';

const featuredTrips = [
    { title: 'Ultimate Bhutan', duration: '10 Days', price: 'From $8,295', image: 'bhutan/main4.JPG' },
    { title: 'Tigers Nest Trek', duration: '8 Days', price: 'From $5,595', image: 'bhutan/main5.JPG' },
    { title: 'Paro Festival Safari', duration: '9 Days', price: 'From $7,995', image: 'bhutan/main6.JPG' },
    { title: 'Snowman Trek Hiking', duration: '12 Days', price: 'From $6,895', image: 'bhutan/9.JPG' }
];

export default function FeaturedTrips() {
    return (
        <section className="featured-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Featured Trips</h2>
                    <a href="#" className="link-btn">View All Trips</a>
                </div>

                <div className="featured-grid">
                    {featuredTrips.map((trip, i) => (
                        <div className="trip-card" key={i}>
                            <div className="image-placeholder" style={{ position: 'relative', background: 'transparent' }}>
                                <Image src={`/images/${trip.image}`} alt={trip.title} fill style={{ objectFit: 'cover' }} />
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
