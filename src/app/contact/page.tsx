'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    return (
        <main className="contact-page page-with-header">
            <Header theme="light" />

            <div className="contact-content-scaffold">
                <div className="container">
                    <div className="contact-grid">
                        {/* 2. Left Column: Information */}
                        <div className="contact-info-col">
                            <div className="contact-hero-frame">
                                <Image
                                    src="/images/bhutan/main5.JPG"
                                    alt="Our Team"
                                    width={600}
                                    height={400}
                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                />
                            </div>

                            <div className="contact-details-block">
                                <h2 className="serif-h2">Get in Touch</h2>
                                <div className="detail-item">
                                    <span className="label">Address</span>
                                    <p>Saidpiece Travel,<br />Thimphu, Bhutan</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Phone</span>
                                    <p><a href="tel:1-800-368-2794">1-800-368-2794</a></p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Hours</span>
                                    <p>Mon - Fri: 8:30am - 5:30pm (BST)</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Email</span>
                                    <p><a href="mailto:saidpiece@gmail.com">saidpiece@gmail.com</a></p>
                                </div>

                                <div className="social-links-suite">
                                    <a href="#" aria-label="Facebook">FB</a>
                                    <a href="#" aria-label="Instagram">IG</a>
                                    <a href="#" aria-label="YouTube">YT</a>
                                    <a href="#" aria-label="LinkedIn">LI</a>
                                </div>
                            </div>
                        </div>

                        {/* 3. Right Column: Contact Form */}
                        <div className="contact-form-col">
                            {submitted ? (
                                <div className="contact-success-message">
                                    <h2 className="serif-h2">Thank You!</h2>
                                    <p>Your message has been sent. One of our Bhutan travel experts will reach out to you within 24 hours.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn btn-outline">Send another message</button>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name *</label>
                                            <input type="text" id="firstName" required placeholder="Enter your first name" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input type="text" id="lastName" placeholder="Enter your last name" />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input type="email" id="email" required placeholder="Enter your email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input type="tel" id="phone" placeholder="Enter your phone" />
                                        </div>
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <input type="checkbox" id="catalog" />
                                        <label htmlFor="catalog">Request a catalog</label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message</label>
                                        <textarea id="message" rows={5} placeholder="Tell us about the trips or regions you're interested in..."></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* C. "More Ways to Connect" Section */}
            <section className="connect-bridge-section">
                <div className="connect-bridge-bg">
                    <Image
                        src="/images/bhutan/main6.JPG"
                        alt="Join the adventure"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    <div className="connect-overlay"></div>
                </div>
                <div className="container relative z-10">
                    <h2 className="serif-h2 text-center text-white mb-60">More Ways to Connect</h2>
                    <div className="connect-card-grid">
                        <Link href="#" className="connect-card">
                            <span className="card-label">Catalog</span>
                            <h3>Request a Catalog</h3>
                            <p>Explore our latest expedition guide.</p>
                        </Link>
                        <Link href="/travel-blog" className="connect-card">
                            <span className="card-label">Community</span>
                            <h3>Travel Blog</h3>
                            <p>Stories from the hidden valleys.</p>
                        </Link>
                        <Link href="#" className="connect-card">
                            <span className="card-label">Updates</span>
                            <h3>E-Newsletter</h3>
                            <p>Monthly insights delivered to you.</p>
                        </Link>
                        <Link href="/browse" className="connect-card">
                            <span className="card-label">Plan</span>
                            <h3>Browse Trips</h3>
                            <p>Find your next Bhutanese journey.</p>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
