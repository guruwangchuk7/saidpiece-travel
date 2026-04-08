import Image from 'next/image';
import Link from 'next/link';

const services = [
    { title: 'Care', desc: 'Every journey is designed with deep care— from the pacing of the itinerary to the comfort of our boutique stays and the character of our private guides.', link: 'Our Approach', url: '/about/care', image: 'bhutan/18.webp' },
    { title: 'Respect', desc: 'Our trips are locally rooted, ensuring every interaction is culturally respectful. We protect Bhutan’s sacred traditions while sharing its living culture with you.', link: 'Our Stewardship', url: '/about/responsible-travel', image: 'bhutan/19.webp' },
    { title: 'Connection', desc: 'We bridge the gap between global curiosity and Himalayan wisdom, helping you connect deeply with the people, rituals, and stories of Bhutan.', link: 'Our Stories', url: '/about/our-story', image: 'bhutan/20.webp' }
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
