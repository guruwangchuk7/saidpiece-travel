import Image from 'next/image';

const travelStyles = [
    { name: 'Safari', image: 'bhutan/7.JPG' },
    { name: 'Snorkeling', image: 'bhutan/8.JPG' },
    { name: 'Cultural', image: 'bhutan/9.JPG' },
    { name: 'Trekking', image: 'bhutan/10.JPG' },
    { name: 'Expedition', image: 'bhutan/11.JPG' },
    { name: 'Family', image: 'bhutan/12.JPG' }
];

export default function TravelStyles() {
    return (
        <section className="styles-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Crafting Trips for Every Travel Style</h2>
                    <a href="#" className="link-btn">Browse All Trips</a>
                </div>

                <div className="styles-carousel">
                    {travelStyles.map((style, i) => (
                        <div className="style-card" key={i}>
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }} className="image-placeholder">
                                <Image src={`/images/${style.image}`} alt={style.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="style-overlay">
                                <h3 className="style-title">{style.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
