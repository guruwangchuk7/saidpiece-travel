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
                        <h2>A Journey Created with Heart</h2>
                        <p>At Saidpiece Travelers, we believe travel to Bhutan should feel personal, meaningful, and unhurried. Every journey we design is crafted to help you experience the real rhythm of the country— its quiet monasteries, mountain valleys, living traditions, and warm hospitality.</p>
                        <p style={{ marginTop: '1rem' }}>Rather than rushing through a checklist of sights, we focus on thoughtful travel experiences that allow you to slow down and connect with Bhutan’s culture and landscapes. Our goal is simple: to help you experience Bhutan in a way that stays with you long after the journey ends.</p>
                        <a href="#" className="link-btn" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Our Story</a>
                    </div>
                </div>


            </div>
        </section>
    );
}
