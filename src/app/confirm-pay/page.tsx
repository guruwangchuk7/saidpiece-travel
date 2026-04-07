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
                            <h3 className="serif-h2" style={{ fontSize: '28px', marginBottom: '15px' }}>Confirm Your Booking</h3>
                            <p className="payment-note">Please review your trip details below. Once confirmed, you can proceed to select your preferred payment method.</p>

                            <div className="booking-summary-highlights" style={{ background: '#F9FAFB', padding: '25px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #E5E7EB' }}>
                                <div style={{ marginBottom: '15px' }}><strong>Trip:</strong> {tripName}</div>
                                <div style={{ marginBottom: '15px' }}><strong>Traveler:</strong> {travelerName}</div>
                                <div><strong>Total Amount:</strong> {currency} {amount}</div>
                            </div>

                            <button
                                className="btn btn-primary full-width"
                                onClick={() => setCheckoutStep('method')}
                                style={{ padding: '20px' }}
                            >
                                CONFIRM & CHOOSE PAYMENT METHOD
                            </button>
                        </div>
                    )}

                    {checkoutStep === 'method' && (
                        <div className="checkout-step-content animation-slide-in">
                            <h3 className="serif-h2" style={{ fontSize: '28px', marginBottom: '15px' }}>Choose Payment Method</h3>
                            <p className="payment-note">Select how you would like to pay for your journey. We support secure card payments, crypto wallets, and bank transfers.</p>

                            <PaymentMethodSelector
                                paymentMethod={paymentMethod}
                                onMethodChange={(m) => {
                                    setPaymentMethod(m);
                                    setCheckoutStep('pay');
                                }}
                            />

                            <button
                                className="link-btn-small"
                                onClick={() => setCheckoutStep('review')}
                                style={{ marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                            >
                                ← Back to Trip Summary
                            </button>
                        </div>
                    )}

                    {checkoutStep === 'pay' && (
                        <div className="checkout-step-content animation-slide-in">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <h3 className="serif-h2" style={{ fontSize: '24px', margin: 0 }}>Secure Payment</h3>
                                <button
                                    onClick={() => setCheckoutStep('method')}
                                    style={{ fontSize: '13px', background: 'none', border: 'none', color: 'var(--color-brand)', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    Change Method
                                </button>
                            </div>

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
