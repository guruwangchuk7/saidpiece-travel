import Image from 'next/image';

export default function CTA() {
    return (
        <section className="cta-section">
            <div className="cta-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                <Image src="/images/bhutan/main2.JPG" alt="Bhutan Mountains Background" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            </div>
            <div className="container cta-content">
                <h2>Talk to an Expert</h2>
                <p>Ready to start planning your dream adventure? Our experienced Travel Specialists are here to help you craft the perfect itinerary tailored to your unique interests.</p>
                <div className="cta-buttons">
                    <button className="btn btn-outline">Contact Us</button>
                    <button className="btn btn-primary">Choose A Trip</button>
                </div>
            </div>
        </section>
    );
}
