'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

import { useAuth } from '@/hooks/useAuth';

export default function Footer({ isAuto = false }: { isAuto?: boolean }) {
    const pathname = usePathname();
    const { isStaff } = useAuth();
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [settings, setSettings] = useState<any>({});


    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*');
            if (data) {
                const s: any = {};
                data.forEach(item => s[item.setting_key] = item.setting_value);
                setSettings(s);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: firstName,
                    email: email,
                    message: `Newsletter Subscription: ${firstName} ${lastName}`.trim(),
                    trip_name_fallback: 'Newsletter'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to subscribe');
            }

            setStatus('success');
            setEmail('');
            setFirstName('');
            setLastName('');
        } catch (err) {
            console.error('Newsletter submission error:', err);
            setStatus('error');
        }
    };

    // Hide footer on admin pages if it's the automatic one
    if (isAuto && pathname?.startsWith('/admin')) return null;

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
                            {settings.footer_address || 'Thimphu, Bhutan'}<br />
                            {settings.contact_email || 'saidpiece@gmail.com'}
                        </address>
                    </div>
                    <div className="footer-col">
                        <h4>QUICK LINKS</h4>
                        <div className="footer-links">
                            <Link href="/about/our-story">About Us</Link>
                            <Link href="/about/our-story">Our Story</Link>
                            <Link href="/browse">Travel Styles</Link>
                            <Link href="/browse">Destinations</Link>
                            <Link href="/contact">Contact</Link>
                            
                            <Link href="/admin" className="footer-admin-link">
                                Admin Access
                            </Link>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Resources</h4>
                        <div className="footer-links">
                            <Link href="/about/booking-process">Booking Process</Link>
                            <a href="#">Travel Tips</a>
                            <Link href="/terms">Terms & Conditions</Link>
                            <Link href="/wizard">Trip Wizard</Link>
                            <Link href="/faq">FAQ</Link>
                        </div>
                    </div>
                    <div className="footer-col">
                        <h4>Stay Inspired</h4>
                        <p style={{ marginBottom: '15px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                            {status === 'success' 
                                ? "You're subscribed! Thank you for joining." 
                                : (settings.newsletter_text || "Subscribe to our newsletter to receive the latest travel news and exclusive offers.")}
                        </p>
                        
                        {status !== 'success' && (
                            <form className="newsletter-form" onSubmit={handleSubmit}>
                                <input type="text" className="newsletter-input" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                <input type="text" className="newsletter-input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                <input type="email" className="newsletter-input" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                <button type="submit" className="newsletter-btn" disabled={status === 'loading'}>{status === 'loading' ? 'Joining...' : 'Subscribe'}</button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">&copy; {new Date().getFullYear()} {settings.site_name || 'Saidpiece Travel'}. All rights reserved.</div>
                    <div className="footer-bottom-links">
                        <Link href="/privacy">Privacy Policy</Link>
                        <Link href="/terms-of-use">Terms of Use</Link>
                        <Link href="/site-map">Sitemap</Link>
                    </div>
                    <div className="social-icons">
                        {settings.facebook_url && <a href={settings.facebook_url} className="social-icon" target="_blank">f</a>}
                        {settings.linkedin_url && <a href={settings.linkedin_url} className="social-icon" target="_blank">in</a>}
                        {settings.instagram_url && <a href={settings.instagram_url} className="social-icon" target="_blank">ig</a>}
                        {!settings.facebook_url && <a href="#" className="social-icon">f</a>}
                        {!settings.instagram_url && <a href="#" className="social-icon">ig</a>}
                    </div>
                </div>
            </div>
        </footer>
    );
}
