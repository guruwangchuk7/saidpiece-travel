import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-col">
                        <div className="footer-logo">
                            <Image
                                src="/images/logo/saidpiecetravellogo.png"
                                alt="Saidpiece Travel Logo"
                                width={180}
                                height={50}
                                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                            />
                        </div>
                        <address>
                            1102 9th Street<br />
                            Berkeley, CA 94710<br />
                            saidpiece@gmail.com<br />
                            1-800-368-2794
                        </address>
                        <div className="footer-badges">
                            <div className="footer-badge"></div>
                            <div className="footer-badge"></div>
                            <div className="footer-badge"></div>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <a href="#">About Us</a>
                            <a href="#">Our History</a>
                            <a href="#">Careers</a>
                            <a href="#">Travel Agents</a>
                            <a href="#">Press Room</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <div className="footer-links">
                            <a href="#">Travel Insurance</a>
                            <a href="#">Terms & Conditions</a>
                            <a href="#">Before You Go</a>
                            <a href="#">Guest Portal</a>
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
