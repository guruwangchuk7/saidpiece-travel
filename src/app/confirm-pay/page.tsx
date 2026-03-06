'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';

function ConfirmPayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading, signInWithGoogle } = useAuth();
    const [paymentMethod, setPaymentMethod] = useState<'wire' | 'card' | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);

    useEffect(() => {
        // Simple check to see if we came from a redirect
        const redirect = localStorage.getItem('booking_redirect');
        if (redirect && user) {
            localStorage.removeItem('booking_redirect');
            // If the redirect URL is different from current, we could navigate there
            // But usually we just want them here
        }
    }, [user]);

    // Mock data based on URL params or defaults
    const travelerName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';
    const tripName = searchParams.get('trip') || 'Custom Bhutan Discovery';
    const amount = searchParams.get('amount') || '4,250';
    const currency = searchParams.get('currency') || 'USD';

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmed(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <div className="container" style={{ padding: '150px 20px', textAlign: 'center' }}>Verifying booking session...</div>;
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ padding: '150px 20px' }}>
                <h2 className="serif-title">Secure Login Required</h2>
                <p style={{ margin: '20px auto', maxWidth: '500px' }}>To protect your personal details and booking history, please sign in with Google to continue your booking.</p>
                <button className="btn btn-primary" onClick={signInWithGoogle}>Sign in with Google</button>
            </div>
        );
    }

    if (isConfirmed) {
        return (
            <div className="confirmation-success animation-fade-in text-center" style={{ padding: '100px 20px' }}>
                <div className="success-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>💳</div>
                <h1 className="serif-title">Redirecting to Secure Payment</h1>
                <p className="lead-text" style={{ maxWidth: '600px', margin: '20px auto' }}>
                    Thank you, {travelerName}. We are now connecting you to our secure payment gateway to finalize your booking for <strong>{tripName}</strong>.
                </p>
                <div className="loader-dots" style={{ fontSize: '24px', letterSpacing: '8px', color: 'var(--color-brand)' }}>
                    <span>.</span><span>.</span><span>.</span>
                </div>
                <div style={{ marginTop: '40px' }}>
                    <p style={{ fontSize: '13px', color: '#888' }}>If you are not redirected automatically, please click below:</p>
                    <a href="https://buy.stripe.com/00w6oHc3Daev27M9Bm93y00" className="btn btn-primary">Go to Stripe Payment</a>
                </div>
            </div>
        );
    }

    return (
        <div className="confirm-pay-container container">
            <div className="checkout-layout">
                {/* Left Column: Trip Summary */}
                <div className="checkout-summary-card">
                    <div className="summary-header">
                        <span className="step-tag">Step 3: Secure Your Trip</span>
                        <h1 className="serif-h2">Review & Confirm</h1>
                    </div>

                    <div className="trip-preview-box">
                        <div className="trip-image">
                            <Image src="/images/bhutan/11.JPG" alt="Bhutan" fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div className="trip-details">
                            <h3 className="serif-title" style={{ fontSize: '24px' }}>{tripName}</h3>
                            <p className="traveler-info">Prepared for: {travelerName}</p>
                            <div className="price-tag">
                                <span className="label">Total Amount:</span>
                                <span className="value">{currency} {amount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="summary-items">
                        <div className="summary-item">
                            <span className="dot"></span>
                            <span>All accommodation & meals included</span>
                        </div>
                        <div className="summary-item">
                            <span className="dot"></span>
                            <span>Licensed private guide & driver</span>
                        </div>
                        <div className="summary-item">
                            <span className="dot"></span>
                            <span>Sustainable Development Fee (SDF) included</span>
                        </div>
                        <div className="summary-item">
                            <span className="dot"></span>
                            <span>Visa processing & permits</span>
                        </div>
                    </div>

                    <div className="trust-badge" style={{ marginTop: '40px', padding: '20px', background: '#F0F4F8', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '24px' }}>🛡️</span>
                        <div>
                            <strong style={{ display: 'block', fontSize: '14px', color: 'var(--color-brand)' }}>Authorized Experience</strong>
                            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Secure payment processed via Stripe. Authorized by the Department of Tourism.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stripe Checkout */}
                <div className="payment-options-card">
                    <h3 className="serif-h2" style={{ fontSize: '28px', marginBottom: '15px' }}>Secure Checkout</h3>
                    <p className="payment-note">Complete your booking using our global secure payment gateway. We accept all major international cards.</p>

                    <div className="stripe-benefit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '30px 0' }}>
                        <div className="benefit-item" style={{ background: '#F9F9F9', padding: '15px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '20px', display: 'block', marginBottom: '10px' }}>🔒</span>
                            <strong style={{ fontSize: '14px', display: 'block' }}>PCI Compliant</strong>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Safe & encrypted</p>
                        </div>
                        <div className="benefit-item" style={{ background: '#F9F9F9', padding: '15px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '20px', display: 'block', marginBottom: '10px' }}>⚡</span>
                            <strong style={{ fontSize: '14px', display: 'block' }}>Instant Slot</strong>
                            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Confirm immediately</p>
                        </div>
                    </div>

                    <form className="confirmation-form" style={{ marginTop: '40px' }} onSubmit={(e) => {
                        e.preventDefault();
                        setIsConfirmed(true);
                        setTimeout(() => {
                            window.location.href = "https://buy.stripe.com/00w6oHc3Daev27M9Bm93y00";
                        }, 2000);
                    }}>
                        <div className="checkbox-group" style={{ display: 'flex', gap: '12px', marginBottom: '30px', fontSize: '14px' }}>
                            <input type="checkbox" id="terms" required />
                            <label htmlFor="terms" style={{ color: '#666' }}>I agree to the <a href="/terms" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Booking Terms</a> & <a href="/cancellation" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Cancellation Policy</a>.</label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary full-width-btn stripe-btn"
                            style={{ padding: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#635bff', width: '100%', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <span style={{ fontWeight: 700, letterSpacing: '1px' }}>PROCEED TO SECURE PAYMENT</span>
                            <span>→</span>
                        </button>

                        <div className="payment-methods-icons" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px', opacity: 0.5 }}>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>VISA</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>MASTERCARD</span>
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>AMEX</span>
                        </div>
                    </form>

                    <div className="wire-alternative" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #EEE', textAlign: 'center' }}>
                        <p style={{ fontSize: '13px', color: '#888' }}>Prefer to pay via SWIFT Wire Transfer?</p>
                        <a href="mailto:saidpiece@gmail.com" style={{ fontSize: '13px', color: 'var(--color-brand)', fontWeight: 600 }}>Request Bank Details</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .confirm-pay-container {
                    padding: 160px 20px 100px;
                }
                .checkout-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .checkout-summary-card {
                    background: var(--color-cream);
                    padding: 50px;
                    border-radius: 4px;
                }
                .step-tag {
                    color: var(--color-brand);
                    text-transform: uppercase;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 3px;
                    display: block;
                    margin-bottom: 15px;
                }
                .trip-preview-box {
                    display: flex;
                    gap: 25px;
                    margin: 40px 0;
                    background: white;
                    padding: 20px;
                    border-radius: 4px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .trip-image {
                    width: 120px;
                    height: 120px;
                    position: relative;
                    border-radius: 2px;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .traveler-info {
                    font-size: 14px;
                    color: var(--color-text-secondary);
                    margin: 8px 0;
                }
                .price-tag {
                    margin-top: 15px;
                    padding-top: 15px;
                    border-top: 1px solid #F0F0F0;
                }
                .price-tag .label {
                    font-size: 11px;
                    color: #888;
                    display: block;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .price-tag .value {
                    font-size: 28px;
                    font-weight: 700;
                    color: var(--color-brand);
                    font-family: var(--font-playfair);
                }
                .summary-items {
                    margin-top: 40px;
                }
                .summary-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                    font-size: 15px;
                    color: var(--color-text-secondary);
                }
                .dot {
                    width: 5px;
                    height: 5px;
                    background: var(--color-brand);
                    border-radius: 50%;
                }
                .method-selector {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    margin: 40px 0;
                }
                .method-btn {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                    padding: 25px;
                    border: 1px solid #EAEAEA;
                    background: white;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .method-btn:hover {
                    border-color: var(--color-brand);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }
                .method-btn.active {
                    border-color: var(--color-brand);
                    background: #FAFBFD;
                    box-shadow: inset 0 0 0 1px var(--color-brand);
                }
                .method-icon {
                    font-size: 28px;
                }
                .method-info strong {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                .method-info span {
                    font-size: 13px;
                    color: var(--color-text-secondary);
                }
                .wire-details-box {
                    background: #F9F9F9;
                    padding: 35px;
                    margin-bottom: 40px;
                }
                .wire-details-box h4 {
                    margin-bottom: 25px;
                    font-size: 18px;
                    border-bottom: 1px solid #EEE;
                    padding-bottom: 15px;
                    color: var(--color-brand);
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 18px;
                    font-size: 14px;
                }
                .detail-row .label { color: #888; }
                .detail-row .value { font-weight: 600; color: var(--color-text-primary); }
                .instruction-text {
                    font-size: 13px;
                    line-height: 1.6;
                    color: #555;
                    margin-top: 30px;
                    padding: 20px;
                    background: white;
                    border-left: 4px solid var(--color-brand);
                }
                .confirmation-form { margin-top: 40px; }
                .checkbox-group {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 35px;
                    font-size: 14px;
                    color: var(--color-text-secondary);
                }
                .full-width-btn {
                    width: 100%;
                    letter-spacing: 2px;
                }

                .process-infographic {
                    margin: 40px 0;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .process-item {
                    display: flex;
                    gap: 20px;
                    align-items: flex-start;
                }
                .process-icon {
                    width: 32px;
                    height: 32px;
                    background: var(--color-brand);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    flex-shrink: 0;
                }
                .process-text strong {
                    display: block;
                    font-size: 15px;
                    margin-bottom: 4px;
                }
                .process-text p {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                    line-height: 1.5;
                }
                .process-line {
                    width: 2px;
                    height: 20px;
                    background: #EEE;
                    margin-left: 15px;
                }

                @media (max-width: 1000px) {
                    .checkout-layout {
                        grid-template-columns: 1fr;
                        gap: 60px;
                    }
                    .confirm-pay-container { padding-top: 120px; }
                }
            `}</style>
        </div>
    );
}

export default function ConfirmPayPage() {
    return (
        <main className="confirm-pay-page page-with-header">
            <Header theme="light" />
            <Suspense fallback={<div className="container" style={{ padding: '150px 20px' }}>Loading confirmation page...</div>}>
                <ConfirmPayContent />
            </Suspense>
            <Footer />
        </main>
    );
}
