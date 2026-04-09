'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

export default function CatalogPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const payload = {
            first_name: formData.get('firstName') as string,
            email: formData.get('email') as string,
            message: `Catalog Request. Interests: ${formData.get('interests')}. Address: ${formData.get('address')}`,
            trip_name_fallback: 'Saidpiece Catalog Request'
        };

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to submit request');
            }

            setSubmitted(true);
        } catch (err: any) {
            console.error('Error submitting catalog request:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="catalog-page page-with-header">
            <Header theme="light" />

            <div className="contact-content-scaffold">
                <div className="container">
                    <div className="contact-grid">
                        {/* Left Column: Catalog Info & Preview */}
                        <div className="contact-info-col">
                            <div className="contact-hero-frame">
                                <Image
                                    src="/images/bhutan/21.webp"
                                    alt="Saidpiece Catalog"
                                    width={600}
                                    height={800}
                                    style={{ objectFit: 'cover', borderRadius: '4px' }}
                                    priority
                                />
                            </div>

                            <div className="contact-details-block">
                                <h2 className="serif-h2">The Saidpiece Guide</h2>
                                <p className="mb-30" style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.7', marginTop: '15px' }}>
                                    Explore the hidden valleys of Bhutan through our curated collection of journeys. 
                                    Our catalog includes detailed itineraries, cultural insights, and stunning photography 
                                    to inspire your next great adventure.
                                </p>
                                
                                <div className="detail-item">
                                    <span className="label">Current Edition</span>
                                    <p>Spring / Summer 2026</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Digital Copy</span>
                                    <p>Sent immediately to your inbox</p>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Physical Copy</span>
                                    <p>Delivered worldwide within 5-7 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Request Form */}
                        <div className="contact-form-col">
                            {submitted ? (
                                <div className="contact-success-message">
                                    <h2 className="serif-h2">Thank You!</h2>
                                    <p>Your catalog request has been received. A digital copy is on its way to your inbox.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ marginTop: '20px' }}>Request another copy</button>
                                </div>
                            ) : (
                                <div className="catalog-form-wrapper">
                                    <h2 className="serif-h2 mb-40">Request a Catalog</h2>
                                    <form className="contact-form" onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="firstName">Full Name *</label>
                                            <input type="text" id="firstName" name="firstName" required placeholder="Enter your full name" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input type="email" id="email" name="email" required placeholder="Enter your email" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="interests">Areas of Interest</label>
                                            <select id="interests" name="interests" className="form-input-select" style={{ 
                                                width: '100%', 
                                                padding: '15px', 
                                                border: '1px solid #ddd', 
                                                borderRadius: '4px',
                                                background: 'white',
                                                fontSize: '1rem'
                                            }}>
                                                <option value="Cultural Immersion">Cultural Immersion</option>
                                                <option value="Adventure & Trekking">Adventure & Trekking</option>
                                                <option value="Spiritual Retreats">Spiritual Retreats</option>
                                                <option value="Photography Expeditions">Photography Expeditions</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address">Mailing Address (Optional for Physical Copy)</label>
                                            <textarea id="address" name="address" rows={4} placeholder="Street, City, Country, ZIP..."></textarea>
                                        </div>

                                        {error && <p style={{ color: '#d32f2f', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</p>}

                                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting} style={{ padding: '18px' }}>
                                            {isSubmitting ? 'SENDING REQUEST...' : 'REQUEST CATALOG'}
                                        </button>
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
