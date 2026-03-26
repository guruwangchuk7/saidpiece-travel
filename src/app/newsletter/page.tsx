'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function NewsletterPage() {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            if (!supabase) throw new Error('Supabase not configured');

            const { error: insertError } = await supabase
                .from('enquiries')
                .insert([{
                    first_name: firstName,
                    email: email,
                    message: 'Newsletter Subscription Request',
                    status: 'new' as any
                }]);

            if (insertError) throw insertError;

            setStatus('success');
            setEmail('');
            setFirstName('');
        } catch (err: any) {
            console.error('Error submitting newsletter subscription:', err);
            setStatus('error');
            setErrorMessage(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <main className="newsletter-page page-with-header">
            <Header theme="light" />

            <div className="contact-content-scaffold">
                <div className="container">
                    <div className="contact-grid">
                        {/* Left Column: Inspiration Info */}
                        <div className="contact-info-col">
                            <div className="contact-hero-frame">
                                <Image
                                    src="/images/bhutan/main2.webp"
                                    alt="Stay Inspired"
                                    width={600}
                                    height={800}
                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    priority
                                />
                            </div>

                            <div className="contact-details-block">
                                <h2 className="serif-h2">Saidpiece Newsletter</h2>
                                <p className="mb-30" style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.7', marginTop: '15px' }}>
                                    Monthly stories from the Kingdom. Discover hidden trails, 
                                    local recipes, and insights from the people of Bhutan.
                                </p>
                                
                                <div className="detail-item">
                                    <span className="label">Frequency</span>
                                    <p>Once per month</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Content</span>
                                    <p>Travel stories, photo essays, and special offers</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Community</span>
                                    <p>Joined by 10,000+ Bhutan travelers</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Subscribe Form */}
                        <div className="contact-form-col">
                            {status === 'success' ? (
                                <div className="contact-success-message">
                                    <h2 className="serif-h2">You're on the list!</h2>
                                    <p>Thank you for joining our community. We've sent a welcome email to your inbox.</p>
                                    <button onClick={() => setStatus('idle')} className="btn btn-outline" style={{ marginTop: '20px' }}>Back home</button>
                                </div>
                            ) : (
                                <div className="newsletter-form-wrapper">
                                    <h2 className="serif-h2 mb-40">Stay Inspired</h2>
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name *</label>
                                            <input 
                                                type="text" 
                                                id="firstName" 
                                                required 
                                                placeholder="Enter your first name" 
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                required 
                                                placeholder="Enter your email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>

                                        {status === 'error' && <p style={{ color: '#d32f2f', marginBottom: '20px', fontSize: '0.9rem' }}>{errorMessage}</p>}

                                        <button type="submit" className="btn btn-primary w-full" disabled={status === 'loading'} style={{ padding: '18px' }}>
                                            {status === 'loading' ? 'JOINING...' : 'JOIN THE COMMUNITY'}
                                        </button>

                                        <p className="mt-30 text-center opacity-60" style={{ fontSize: '0.8rem' }}>
                                            Privately stored. We only send inspiration, never spam.
                                        </p>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
