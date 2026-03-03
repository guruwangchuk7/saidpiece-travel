import Image from 'next/image';

export default function Intro() {
    return (
        <section className="intro-section">
            <div className="container">
                <div className="intro-block">
                    <div className="intro-image" style={{ position: 'relative' }}>
                        <Image src="/images/bhutan/main3.JPG" alt="Bhutan Landscape" fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                    </div>
                    <div className="intro-content">
                        <h2>Pioneering Adventure Travel for 3 Years</h2>
                        <p>We believe in the transformative power of travel. From our first expedition in 1978 to our current portfolio of over 200 trips, we have remained true to our founding principles: crafting immersive, authentic itineraries that bring travelers closer to the heart of a destination.</p>
                        <a href="#" className="link-btn">Why WT?</a>
                    </div>
                </div>


            </div>
        </section>
    );
}
