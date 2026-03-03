import Image from 'next/image';

export default function Catalog() {
    return (
        <section className="catalog-section">
            <div className="catalog-pattern"></div>
            <div className="container catalog-container">
                <div className="catalog-image" style={{ position: 'relative' }}>
                    <Image src="/images/bhutan/21.JPG" alt="Physical Catalogs" fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                </div>
                <div className="catalog-content">
                    <h2>Request a Free Catalog</h2>
                    <p>Immerse yourself in our world of adventure. Our beautifully printed catalogs are filled with stunning photography, detailed itineraries, and essential travel inspiration to help you plan your next journey.</p>
                    <div className="catalog-buttons">
                        <button className="btn btn-outline">Request Print Catalog</button>
                        <button className="btn btn-primary">Digital Catalog</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
