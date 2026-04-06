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
    
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'wire' | 'binance'>('card');
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
        paymentMethod,
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
        return <div className="container" style={{ padding: '150px 20px', textAlign: 'center' }}>Verifying booking session...</div>;
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ padding: '150px 20px' }}>
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
                <TripSummary 
                    tripName={tripName} 
                    travelerName={travelerName} 
                    amount={amount} 
                    currency={currency} 
                />

                <div className="payment-options-card">
                    <h3 className="serif-h2" style={{ fontSize: '28px', marginBottom: '15px' }}>Secure Checkout</h3>
                    <p className="payment-note">Complete your booking using our global secure payment gateway. We accept major international cards, Rainbow Wallet crypto payments, Binance Pay, and wire transfer.</p>

                    <PaymentMethodSelector 
                        paymentMethod={paymentMethod} 
                        onMethodChange={(m) => setPaymentMethod(m)} 
                    />

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

            {confirmPayStyles}
        </div>
    );
}

export default function ConfirmPayPage() {
    return (
        <WalletProvider>
            <div className="min-h-screen bg-white">
                <Header />
                <main>
                    <Suspense fallback={<div className="container" style={{ padding: '150px 20px', textAlign: 'center' }}>Loading trip details...</div>}>
                        <ConfirmPayContent />
                    </Suspense>
                </main>
                <Footer />
            </div>
        </WalletProvider>
    );
}
