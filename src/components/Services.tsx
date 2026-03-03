import Image from 'next/image';

const services = [
    { title: 'Thoughtful Itinerary Design', desc: 'Every journey is meticulously crafted by our destination experts to ensure a perfect balance of iconic highlights and hidden gems, offering a truly immersive experience.', link: 'New Trips', image: 'bhutan/18.JPG' },
    { title: 'Expert Trip Leaders', desc: 'Our Trip Leaders are passionate locals, renowned naturalists, and expert guides who bring each destination to life with their deep knowledge and captivating storytelling.', link: 'Meet Our Leaders', image: 'bhutan/19.JPG' },
    { title: 'Community & Conservation', desc: 'We are deeply committed to protecting the places we visit and supporting the communities that welcome us through sustainable tourism practices and dedicated conservation projects.', link: 'Community & Conservation', image: 'bhutan/20.JPG' }
];

export default function Services() {
    return (
        <section className="service-section">
            <div className="container">
                <h2>Providing Unparalleled, Best-in-Class Service</h2>
                <div className="service-grid">
                    {services.map((service, i) => (
                        <div className="service-item" key={i}>
                            <div className="image-placeholder" style={{ position: 'relative', background: 'transparent' }}>
                                <Image src={`/images/${service.image}`} alt={service.title} fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <a href="#" className="link-btn">{service.link}</a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
