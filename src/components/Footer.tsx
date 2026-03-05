import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-col">
                        <div className="footer-logo">
                            <Link href="/">
                                <Image
                                    src="/images/logo/saidpiecetravellogo.png"
                                    alt="Saidpiece Travel Logo"
                                    width={180}
                                    height={50}
                                    style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                                />
                            </Link>
                        </div>
                        <address>
                            Thimphu, Bhutan<br />
                            saidpiece@gmail.com
                        </address>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <a href="#">About Us</a>
                            <Link href="/about/our-story">Our Story</Link>
                            <a href="#">Travel Styles</a>
                            <Link href="/browse">Destinations</Link>
                            <Link href="/contact">Contact</Link>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <div className="footer-links">
                            <a href="#">Booking Process</a>
                            <a href="#">Travel Tips</a>
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Trip Wizard</a>
                            <a href="#">FAQ</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Stay Inspired</h4>
                        <p style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6' }}>Subscribe to our newsletter to receive the latest travel news and exclusive offers.</p>
                        <form className="newsletter-form">
                            <input type="text" className="newsletter-input" placeholder="First Name" />
                            <input type="text" className="newsletter-input" placeholder="Last Name" />
                            <input type="email" className="newsletter-input" placeholder="Email Address" />
                            <button type="submit" className="newsletter-btn">Subscribe</button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">&copy; 2026 Saidpiece Travel. All rights reserved.</div>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Use</a>
                        <a href="#">Sitemap</a>
                    </div>
                    <div className="social-icons">
                        <a href="#" className="social-icon">f</a>
                        <a href="#" className="social-icon">in</a>
                        <a href="#" className="social-icon">yt</a>
                        <a href="#" className="social-icon">ig</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
