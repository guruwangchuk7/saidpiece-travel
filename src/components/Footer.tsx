'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            if (!supabase) throw new Error('Supabase not configured');

            const { error: insertError } = await supabase
                .from('enquiries')
                .insert([{
                    first_name: firstName,
                    email: email,
                    message: `Newsletter Subscription: ${firstName} ${lastName}`,
                    status: 'new' as any
                }]);

            if (insertError) throw insertError;

            setStatus('success');
            setEmail('');
            setFirstName('');
            setLastName('');
        } catch (err) {
            console.error('Newsletter submission error:', err);
            setStatus('error');
        }
    };

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
                            <Link href="/about/booking-process">Booking Process</Link>
                            <a href="#">Travel Tips</a>
                            <Link href="/terms">Terms & Conditions</Link>
                            <Link href="/wizard">Trip Wizard</Link>
                            <a href="#">FAQ</a>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Stay Inspired</h4>
                        <p style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                            {status === 'success' 
                                ? "You're subscribed! Thank you for joining." 
                                : "Subscribe to our newsletter to receive the latest travel news and exclusive offers."}
                        </p>
                        
                        {status !== 'success' && (
                            <form className="newsletter-form" onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    className="newsletter-input" 
                                    placeholder="First Name" 
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    className="newsletter-input" 
                                    placeholder="Last Name" 
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                                <input 
                                    type="email" 
                                    className="newsletter-input" 
                                    placeholder="Email Address" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button type="submit" className="newsletter-btn" disabled={status === 'loading'}>
                                    {status === 'loading' ? 'Joining...' : 'Subscribe'}
                                </button>
                                {status === 'error' && <p style={{ color: '#ff4444', fontSize: '0.75rem', marginTop: '5px' }}>Error. Please try again.</p>}
                            </form>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">&copy; 2026 Saidpiece Travel. All rights reserved.</div>
                    <div className="footer-bottom-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms-of-use">Terms of Use</Link>
                        <Link href="/site-map">Sitemap</Link>
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
