'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { WalletProvider } from '@/lib/wallet';

// Components
import TripSummary from './components/TripSummary';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import CardPayment from './components/CardPayment';
import CryptoPayment from './components/CryptoPayment';
import BinancePayment from './components/BinancePayment';
import WirePayment from './components/WirePayment';
import SuccessView from './components/SuccessView';

// Hooks
import { useCryptoPayment } from './hooks/useCryptoPayment';

// Styles
import { confirmPayStyles } from './confirm-pay.styles';

function ConfirmPayContent() {
    const searchParams = useSearchParams();
    const { user, session, loading, signInWithGoogle } = useAuth();

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'wire' | 'binance' | null>(null);
    const [checkoutStep, setCheckoutStep] = useState<'review' | 'method' | 'pay'>('review');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [cryptoTxId, setCryptoTxId] = useState<string | null>(null);

    // Binance specific state
    const [isBinancePayLoading, setIsBinancePayLoading] = useState(false);
    const [binancePayError, setBinancePayError] = useState<string | null>(null);
    const [binanceCheckoutUrl, setBinanceCheckoutUrl] = useState<string | null>(null);

    // Metadata from URL or defaults
    const travelerName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveler';
    const tripName = searchParams.get('trip') || 'Custom Bhutan Discovery';
    const amount = searchParams.get('amount') || '4,250';
    const currency = searchParams.get('currency') || 'USD';
    const cryptoAmountFromUrl = searchParams.get('cryptoAmount');
    const normalizedFiatAmount = amount.replace(/,/g, '').trim();

    // Use specialized hook for crypto logic
    const crypto = useCryptoPayment({
        user,
        session,
        tripName,
        travelerName,
        normalizedFiatAmount,
        currency,
        cryptoAmountFromUrl,
        paymentMethod: paymentMethod === 'crypto' ? 'crypto' : 'card', // Fallback for hook
        onSuccess: (txHash) => {
            setCryptoTxId(txHash);
            setIsConfirmed(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    useEffect(() => {
        const redirect = localStorage.getItem('booking_redirect');
        if (redirect && user) {
            localStorage.removeItem('booking_redirect');
        }
    }, [user]);

    const handleStripePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmed(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            window.location.href = 'https://buy.stripe.com/00w6oHc3Daev27M9Bm93y00';
        }, 2000);
    };

    const handleBinancePayment = async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!session?.access_token) {
            setBinancePayError('Your session is missing an access token. Please sign in again and retry.');
            return;
        }

        setIsBinancePayLoading(true);
        setBinancePayError(null);
        setBinanceCheckoutUrl(null);
        try {
            const response = await fetch('/api/binance-pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    tripName,
                    travelerName,
                    fiatAmount: normalizedFiatAmount,
                    currency,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Failed to create Binance Pay order.');
            }

            setBinanceCheckoutUrl(data.checkoutUrl);
            window.location.href = data.checkoutUrl;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred.';
            setBinancePayError(message);
        } finally {
            setIsBinancePayLoading(false);
        }
    };

    if (loading) {
        return <div className="container" style={{ padding: '180px 20px', textAlign: 'center' }}>Verifying booking session...</div>;
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ padding: '180px 20px' }}>
                <h2 className="serif-title">Secure Login Required</h2>
                <p style={{ margin: '20px auto', maxWidth: '500px' }}>To protect your personal details and booking history, please sign in with Google to continue your booking.</p>
                <button className="btn btn-primary" onClick={() => signInWithGoogle('/confirm-pay')}>Sign in with Google</button>
            </div>
        );
    }

    if (isConfirmed) {
        return <SuccessView travelerName={travelerName} paymentMethod={paymentMethod} cryptoTxId={cryptoTxId} />;
    }

    return (
        <div className="confirm-pay-container container">
            <div className="checkout-layout">
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div className="payment-options-card" style={{ maxWidth: '650px', width: '100%' }}>
                        {checkoutStep === 'review' && (
                            <div className="checkout-step-content animation-slide-in">
                                <div className="booking-checkout-stepper">
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Review
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator">
                                        <div className="step-dot"></div>
                                        Payment
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator">
                                        <div className="step-dot"></div>
                                        Confirm
                                    </div>
                                </div>
                                
                                <div className="premium-summary-card">
                                    <div className="premium-card-header">
                                        <h3 className="serif-h2" style={{ fontSize: '32px', margin: '0 0 10px' }}>Confirm Your Booking</h3>
                                        <p style={{ color: '#666', fontSize: '15px', maxWidth: '400px', margin: '0 auto' }}>
                                            Please review your journey details before we proceed to secure payment.
                                        </p>
                                    </div>
                                    
                                    <div className="premium-card-body">
                                        <div className="premium-details-grid">
                                            <div className="detail-item">
                                                <div className="detail-label">Destined For</div>
                                                <div className="detail-value">{tripName}</div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Lead Traveler</div>
                                                <div className="detail-value">{travelerName}</div>
                                            </div>
                                            
                                            <div className="premium-amount-box">
                                                <div className="amount-info">
                                                    <div className="label">Total Investment</div>
                                                    <div className="value">{currency} {amount}</div>
                                                </div>
                                                <div className="premium-badge">
                                                    ★ Premium Experience
                                                </div>
                                            </div>
                                        </div>

                                        <div className="confirm-actions">
                                            <button
                                                className="btn-confirm-booking"
                                                onClick={() => {
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    setCheckoutStep('method');
                                                }}
                                            >
                                                CONFIRM & CHOOSE PAYMENT METHOD
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                            </button>
                                            
                                            <div className="security-footer">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                                </svg>
                                                256-bit Secure SSL Booking
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'method' && (
                            <div className="checkout-step-content animation-slide-in">
                                <div className="booking-checkout-stepper">
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Review
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Payment
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator">
                                        <div className="step-dot"></div>
                                        Confirm
                                    </div>
                                </div>

                                <div className="premium-summary-card">
                                    <div className="premium-card-header">
                                        <h3 className="serif-h2" style={{ fontSize: '32px', margin: '0 0 10px' }}>Choose Payment Method</h3>
                                        <p style={{ color: '#666', fontSize: '15px', maxWidth: '450px', margin: '0 auto' }}>
                                            Select your preferred secure payment channel. All transactions are encrypted and processed through industry-leading providers.
                                        </p>
                                    </div>

                                    <div className="premium-card-body">
                                        <PaymentMethodSelector
                                            paymentMethod={paymentMethod}
                                            onMethodChange={(m) => {
                                                setPaymentMethod(m);
                                                setCheckoutStep('pay');
                                            }}
                                        />

                                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                                            <button
                                                className="link-btn-small"
                                                onClick={() => setCheckoutStep('review')}
                                                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}
                                            >
                                                ← Back to Summary
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {checkoutStep === 'pay' && (
                            <div className="checkout-step-content animation-slide-in">
                                <div className="booking-checkout-stepper">
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Review
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Payment
                                    </div>
                                    <div className="step-line"></div>
                                    <div className="step-indicator active">
                                        <div className="step-dot"></div>
                                        Confirm
                                    </div>
                                </div>

                                <div className="premium-summary-card">
                                    <div className="premium-card-header">
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <h3 className="serif-h2" style={{ fontSize: '30px', margin: 0 }}>Secure Finalization</h3>
                                            <button
                                                onClick={() => setCheckoutStep('method')}
                                                style={{ fontSize: '11px', background: 'none', border: 'none', color: 'var(--color-brand)', cursor: 'pointer', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}
                                            >
                                                Change Method
                                            </button>
                                        </div>
                                        <p style={{ color: '#666', fontSize: '14px', textAlign: 'left' }}>
                                            Complete the fields below to finalize your booking for <strong>{tripName}</strong>.
                                        </p>
                                    </div>

                                    <div className="premium-card-body" style={{ paddingTop: '10px' }}>
                                        {paymentMethod === 'card' && (
                                            <CardPayment
                                                acceptedTerms={acceptedTerms}
                                                setAcceptedTerms={setAcceptedTerms}
                                                onSubmit={handleStripePayment}
                                            />
                                        )}

                                {paymentMethod === 'crypto' && (
                                    <CryptoPayment
                                        {...crypto}
                                        amount={amount}
                                        onPay={crypto.handleCryptoPayment}
                                    />
                                )}

                                {paymentMethod === 'binance' && (
                                    <BinancePayment
                                        currency={currency}
                                        amount={amount}
                                        travelerName={travelerName}
                                        acceptedTerms={acceptedTerms}
                                        setAcceptedTerms={setAcceptedTerms}
                                        isBinancePayLoading={isBinancePayLoading}
                                        binancePayError={binancePayError}
                                        binanceCheckoutUrl={binanceCheckoutUrl}
                                        onSubmit={handleBinancePayment}
                                    />
                                )}

                                        {paymentMethod === 'wire' && (
                                            <WirePayment currency={currency} amount={amount} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {confirmPayStyles}
        </div>
    );
}

export default function ConfirmPayPage() {
    return (
        <WalletProvider>
            <div className="min-h-screen bg-white" style={{ position: 'relative', zIndex: 1 }}>
                <Header theme="light" />
                <main style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '120px' }}>
                    <Suspense fallback={<div className="container" style={{ padding: '180px 20px', textAlign: 'center' }}>Loading trip details...</div>}>
                        <ConfirmPayContent />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </WalletProvider>
    );
}
