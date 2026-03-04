import Image from 'next/image';

export default function CTA() {
    return (
        <section className="cta-section">
            <div className="cta-bg" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
                <Image src="/images/bhutan/main2.JPG" alt="Bhutan Mountains Background" fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            </div>
            <div className="container cta-content">
                <h2>Talk to a Bhutan Expert</h2>
                <p>If you prefer to discuss your trip in person, you can schedule a short video call with our team. We can explain how travel works in Bhutan, walk through your itinerary, and answer any questions.</p>
                <div className="cta-buttons">
                    <button className="btn btn-outline">Schedule Video Call</button>
                    <button className="btn btn-primary">Enquire Now</button>
                </div>
            </div>
        </section>
    );
}
