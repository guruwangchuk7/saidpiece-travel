import Image from 'next/image';
import Link from 'next/link';

export default function Catalog() {
    return (
        <section className="catalog-section">
            <div className="catalog-pattern"></div>
            <div className="container catalog-container">
                <div className="catalog-image" style={{ position: 'relative' }}>
                    <Image src="/images/bhutan/21.JPG" alt="Physical Catalogs" fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                </div>
                <div className="catalog-content">
                    <h2>Plan Your Bhutan Journey</h2>
                    <p>Travel to Bhutan is carefully organised to ensure every journey is smooth, meaningful, and well supported. Tell us your travel dates, interests, and preferences, and we will prepare a personalised itinerary including hotel options and a transparent cost summary.</p>
                    <div className="catalog-buttons">
                        <Link href="/wizard" className="btn btn-primary">Plan Your Trip</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
