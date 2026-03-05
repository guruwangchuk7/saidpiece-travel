import Image from 'next/image';
import Link from 'next/link';

const travelStyles = [
    { name: 'Discovery', image: 'bhutan/7.JPG' },
    { name: 'Cultural Immersion', image: 'bhutan/8.JPG' },
    { name: 'Family Adventure', image: 'bhutan/9.JPG' },
    { name: 'Festival Tours', image: 'bhutan/10.JPG' },
    { name: 'Nature Retreat', image: 'bhutan/11.JPG' },
    { name: 'Romantic Escape', image: 'bhutan/12.JPG' }
];

export default function TravelStyles() {
    return (
        <section className="styles-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Crafting Trips for Every Travel Style</h2>
                    <Link href="/browse" className="link-btn">Browse All Trips</Link>
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
