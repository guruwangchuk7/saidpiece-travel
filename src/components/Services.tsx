import Image from 'next/image';
import Link from 'next/link';

const services = [
    { title: 'Care & Thoughtful Design', desc: 'Every journey is thoughtfully designed with attention to detail— from pacing and accommodation to the small cultural moments that make travel memorable.', link: 'Local Expertise', url: '/about/local-expertise', image: 'bhutan/18.JPG' },
    { title: 'Local Expertise', desc: 'Our journeys are designed and hosted by Bhutanese travel professionals. We work with experienced guides and skilled drivers to ensure every trip runs smoothly and authentically.', link: 'Meet Our Team', url: '/about/meet-our-team', image: 'bhutan/19.JPG' },
    { title: 'Meaningful Connection', desc: 'Our journeys focus on meaningful interactions— with monks, artisans, and local communities— so travelers experience Bhutan as a living culture.', link: 'Booking Process', url: '/about/booking-process', image: 'bhutan/20.JPG' }
];

export default function Services() {
    return (
        <section className="service-section">
            <div className="container">
                <h2>What Makes Saidpiece Different</h2>
                <div className="service-grid">
                    {services.map((service, i) => (
                        <div className="service-item" key={i}>
                            <div className="image-placeholder" style={{ position: 'relative', background: 'transparent' }}>
                                <Image src={`/images/${service.image}`} alt={service.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <Link href={service.url} className="link-btn">{service.link}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
