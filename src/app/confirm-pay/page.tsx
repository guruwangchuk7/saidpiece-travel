'use client';

import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { WalletProvider } from '@/lib/wallet';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { erc20Abi, parseUnits } from 'viem';

const cryptoRecipient = process.env.NEXT_PUBLIC_CRYPTO_RECIPIENT_ADDRESS as `0x${string}` | undefined;
const cryptoTokenAddress = process.env.NEXT_PUBLIC_CRYPTO_TOKEN_ADDRESS as `0x${string}` | undefined;
const cryptoTokenSymbol = process.env.NEXT_PUBLIC_CRYPTO_TOKEN_SYMBOL || 'USDC';
const cryptoTokenDecimals = Number(process.env.NEXT_PUBLIC_CRYPTO_TOKEN_DECIMALS || '6');
const cryptoPaymentChainId = Number(process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_CHAIN_ID || '8453');
const isCryptoConfigured = Boolean(cryptoRecipient && cryptoTokenAddress);

function ConfirmPayContent() {
    const searchParams = useSearchParams();
    const { user, session, loading, signInWithGoogle } = useAuth();
    const { isConnected, address } = useAccount();
    const chainId = useChainId();
    const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();
    const { writeContractAsync, isPending: isSendingCrypto } = useWriteContract();

    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'wire' | 'binance'>('card');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [cryptoTxId, setCryptoTxId] = useState<string | null>(null);
    const [pendingCryptoHash, setPendingCryptoHash] = useState<`0x${string}` | undefined>();
    const [cryptoError, setCryptoError] = useState<string | null>(null);
    const [cryptoIntentId, setCryptoIntentId] = useState<string | null>(null);
    const [quotedCryptoAmount, setQuotedCryptoAmount] = useState<string | null>(null);
    const [quoteExpiresAt, setQuoteExpiresAt] = useState<string | null>(null);
    const [isPreparingCrypto, setIsPreparingCrypto] = useState(false);
    const [intentRequestKey, setIntentRequestKey] = useState<string | null>(null);
    const [isBinancePayLoading, setIsBinancePayLoading] = useState(false);
    const [binancePayError, setBinancePayError] = useState<string | null>(null);
    const [binanceCheckoutUrl, setBinanceCheckoutUrl] = useState<string | null>(null);

    const { isLoading: isConfirmingCrypto } = useWaitForTransactionReceipt({
        hash: pendingCryptoHash,
        query: {
            enabled: Boolean(pendingCryptoHash),
        },
    });

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
    const cryptoAmountFromUrl = searchParams.get('cryptoAmount');
    const normalizedFiatAmount = amount.replace(/,/g, '').trim();
    const cryptoAmount =
        quotedCryptoAmount ||
        cryptoAmountFromUrl ||
        (currency.toUpperCase() === 'USD' && ['USDC', 'USDT'].includes(cryptoTokenSymbol.toUpperCase())
            ? normalizedFiatAmount
            : null);
    const isCorrectCryptoChain = chainId === cryptoPaymentChainId;
    const canSubmitCryptoPayment = isConnected && isCryptoConfigured && Boolean(cryptoAmount) && isCorrectCryptoChain && Boolean(cryptoIntentId);
    const isCryptoBusy = isPreparingCrypto || isSwitchingChain || isSendingCrypto || isConfirmingCrypto;

    useEffect(() => {
        if (paymentMethod !== 'crypto' || !user || !session?.access_token || !isCryptoConfigured) {
            return;
        }

        const requestKey = [tripName, travelerName, normalizedFiatAmount, currency, cryptoAmountFromUrl || ''].join('|');
        if (intentRequestKey === requestKey && cryptoIntentId) {
            return;
        }

        let active = true;
        setIsPreparingCrypto(true);
        setCryptoError(null);
        setIntentRequestKey(requestKey);

        fetch('/api/crypto-payment-intents', {
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
                cryptoAmount: cryptoAmountFromUrl,
            }),
        })
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || 'Failed to prepare crypto payment.');
                }
                return payload.intent;
            })
            .then((intent) => {
                if (!active) {
                    return;
                }

                setCryptoIntentId(intent.id);
                setQuotedCryptoAmount(intent.expected_token_amount);
                setQuoteExpiresAt(intent.quote_expires_at);
            })
            .catch((error) => {
                if (!active) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Failed to prepare crypto payment.';
                setCryptoError(message);
                setIntentRequestKey(null);
            })
            .finally(() => {
                if (active) {
                    setIsPreparingCrypto(false);
                }
            });

        return () => {
            active = false;
        };
    }, [paymentMethod, user, session?.access_token, tripName, travelerName, normalizedFiatAmount, currency, cryptoAmountFromUrl, cryptoIntentId, intentRequestKey]);

    const handleStripePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsConfirmed(true);
        // Scroll to top
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

    const handleCryptoPayment = async () => {
        if (!isConnected) {
            alert('Please connect your wallet to pay with crypto.');
            return;
        }

        if (!isCryptoConfigured || !cryptoRecipient || !cryptoTokenAddress) {
            setCryptoError('Crypto payments are not configured yet. Add the business wallet and token env vars first.');
            return;
        }

        if (!cryptoAmount) {
            setCryptoError(`Missing crypto amount. Add a cryptoAmount query param, or use USD with ${cryptoTokenSymbol}.`);
            return;
        }

        setCryptoError(null);

        try {
            if (!isCorrectCryptoChain) {
                await switchChainAsync({ chainId: cryptoPaymentChainId });
            }

            const hash = await writeContractAsync({
                address: cryptoTokenAddress,
                abi: erc20Abi,
                functionName: 'transfer',
                args: [cryptoRecipient, parseUnits(cryptoAmount, cryptoTokenDecimals)],
            });

            setPendingCryptoHash(hash);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'The crypto transaction could not be completed.';
            setCryptoError(message);
        }
    };

    useEffect(() => {
        if (!pendingCryptoHash || isConfirmingCrypto || !cryptoIntentId || !address || !session?.access_token) {
            return;
        }

        let active = true;

        fetch('/api/crypto-payment-intents/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                intentId: cryptoIntentId,
                txHash: pendingCryptoHash,
                senderAddress: address,
            }),
        })
            .then(async (response) => {
                const payload = await response.json();
                if (!response.ok || !payload.ok) {
                    throw new Error(payload.error || 'Failed to verify crypto payment.');
                }

                return payload.payment;
            })
            .then((payment) => {
                if (!active) {
                    return;
                }

                setCryptoTxId(payment.txHash);
                setIsConfirmed(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch((error) => {
                if (!active) {
                    return;
                }

                const message = error instanceof Error ? error.message : 'Failed to verify crypto payment.';
                setCryptoError(message);
            });

        return () => {
            active = false;
        };
    }, [pendingCryptoHash, isConfirmingCrypto, cryptoIntentId, address, session?.access_token]);

    if (loading) {
        return <div className="container" style={{ padding: '150px 20px', textAlign: 'center' }}>Verifying booking session...</div>;
    }

    if (!user) {
        return (
            <div className="container text-center" style={{ padding: '150px 20px' }}>
                <h2 className="serif-title">Secure Login Required</h2>
                <p style={{ margin: '20px auto', maxWidth: '500px' }}>To protect your personal details and booking history, please sign in with Google to continue your booking.</p>
                <button className="btn btn-primary" onClick={() => signInWithGoogle()}>Sign in with Google</button>
            </div>
        );
    }

    if (isConfirmed) {
        const isStripe = paymentMethod === 'card';
        const isCrypto = paymentMethod === 'crypto';
        const isWire = paymentMethod === 'wire';
        const isBinance = paymentMethod === 'binance';

        const icon = isCrypto ? (
            <Image src="/crypto.svg" alt="Crypto" width={32} height={32} />
        ) : isBinance ? (
            <Image src="/binance.svg" alt="Binance" width={32} height={32} />
        ) : isWire ? (
            '🏦'
        ) : (
            '💳'
        );
        const title = isCrypto
            ? 'Crypto Payment Initiated'
            : isWire
            ? 'Wire Transfer Requested'
            : 'Redirecting to Secure Payment';

        return (
            <div className="confirmation-success animation-fade-in text-center" style={{ padding: '100px 20px' }}>
                <div className="success-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
                <h1 className="serif-title">{title}</h1>
                <p className="lead-text" style={{ maxWidth: '600px', margin: '20px auto' }}>
                    Thank you, {travelerName}. {isCrypto ? 'Your wallet has initiated a transaction to finalize your booking.' : isWire ? 'We have provided the bank details below to complete your booking.' : 'We are now connecting you to our secure payment gateway to finalize your booking.'}
                </p>

                {isStripe && (
                    <>
                        <div className="loader-dots" style={{ fontSize: '24px', letterSpacing: '8px', color: 'var(--color-brand)' }}>
                            <span>.</span><span>.</span><span>.</span>
                        </div>
                        <div style={{ marginTop: '40px' }}>
                            <p style={{ fontSize: '13px', color: '#888' }}>If you are not redirected automatically, please click below:</p>
                            <a href="https://buy.stripe.com/00w6oHc3Daev27M9Bm93y00" className="btn btn-primary">Go to Stripe Payment</a>
                        </div>
                    </>
                )}

                {isCrypto && cryptoTxId && (
                    <div style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '13px', color: '#666' }}>Transaction ID:</p>
                        <code style={{ display: 'block', fontSize: '13px', color: '#222', marginTop: '8px' }}>{cryptoTxId}</code>
                    </div>
                )}

                {isWire && (
                    <div style={{ marginTop: '40px' }}>
                        <p style={{ fontSize: '13px', color: '#888' }}>Please send the wire transfer and email the payment receipt to <a href="mailto:saidpiece@gmail.com" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>saidpiece@gmail.com</a>.</p>
                    </div>
                )}
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

                {/* Right Column: Payment Options */}
                <div className="payment-options-card">
                    <h3 className="serif-h2" style={{ fontSize: '28px', marginBottom: '15px' }}>Secure Checkout</h3>
                    <p className="payment-note">Complete your booking using our global secure payment gateway. We accept major international cards, Rainbow Wallet crypto payments, Binance Pay, and wire transfer.</p>

                    <div className="method-selector">
                        <button
                            type="button"
                            className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <span className="method-icon">💳</span>
                            <div className="method-info">
                                <strong>Credit / Debit</strong>
                                <span>Pay with Stripe (card).</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`method-btn ${paymentMethod === 'crypto' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('crypto')}
                        >
                            <span className="method-icon">🪙</span>
                            <div className="method-info">
                                <strong>Crypto Wallet</strong>
                                <span>Pay using Rainbow Wallet (web3 wallet connect).</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`method-btn ${paymentMethod === 'binance' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('binance')}
                        >
                            <span className="method-icon">
                                <Image src="/binance.svg" alt="Binance" width={24} height={24} />
                            </span>
                            <div className="method-info">
                                <strong>Binance Pay</strong>
                                <span>Pay with Binance Pay using your Binance wallet balance.</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            className={`method-btn ${paymentMethod === 'wire' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('wire')}
                        >
                            <span className="method-icon">🏦</span>
                            <div className="method-info">
                                <strong>Wire Transfer</strong>
                                <span>Request bank details to pay by SWIFT.</span>
                            </div>
                        </button>
                    </div>

                    {paymentMethod === 'card' && (
                        <form className="confirmation-form" style={{ marginTop: '20px' }} onSubmit={handleStripePayment}>
                            <div className="checkbox-group" style={{ display: 'flex', gap: '12px', marginBottom: '30px', fontSize: '14px' }}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="terms" style={{ color: '#666' }}>
                                    I agree to the <a href="/terms" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Booking Terms</a> & <a href="/cancellation" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Cancellation Policy</a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!acceptedTerms}
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
                    )}

                    {paymentMethod === 'crypto' && (
                        <div className="crypto-payment" style={{ marginTop: '20px' }}>
                            <p className="crypto-intro">
                                Pay directly to the company wallet using {cryptoTokenSymbol}. For USD bookings, the checkout uses a 1:1 {cryptoTokenSymbol} amount unless you pass a custom <code>cryptoAmount</code> in the URL.
                            </p>
                            <div className="crypto-connect-row">
                                <ConnectButton showBalance={false} accountStatus="address" chainStatus="none" />
                            </div>

                            <div className="crypto-status-box">
                                {isConnected ? (
                                    <p className="crypto-status connected">
                                        Wallet connected: <strong>{address}</strong>
                                    </p>
                                ) : (
                                    <p className="crypto-status">
                                        Connect your wallet above to enable crypto payments.
                                    </p>
                                )}
                            </div>

                            <div className="crypto-meta-grid">
                                <div className="crypto-meta-item">
                                    <span className="crypto-meta-label">Token</span>
                                    <strong>{cryptoTokenSymbol}</strong>
                                </div>
                                <div className="crypto-meta-item">
                                    <span className="crypto-meta-label">Amount</span>
                                    <strong>{cryptoAmount ? `${cryptoAmount} ${cryptoTokenSymbol}` : 'Unavailable'}</strong>
                                </div>
                                <div className="crypto-meta-item">
                                    <span className="crypto-meta-label">Chain</span>
                                    <strong>{cryptoPaymentChainId === 8453 ? 'Base' : cryptoPaymentChainId === 1 ? 'Ethereum' : cryptoPaymentChainId}</strong>
                                </div>
                            </div>

                            {quoteExpiresAt && (
                                <p className="crypto-hint">
                                    Quote expires at {new Date(quoteExpiresAt).toLocaleString()}.
                                </p>
                            )}

                            {!isCorrectCryptoChain && isConnected && (
                                <p className="crypto-hint">
                                    Switch your wallet to the configured payment network before sending the transaction.
                                </p>
                            )}

                            {!isCryptoConfigured && (
                                <p className="crypto-error">
                                    Crypto payments are disabled until the business wallet and token contract are configured.
                                </p>
                            )}

                            <button
                                type="button"
                                className="btn btn-primary full-width-btn"
                                style={{ padding: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#1c1c1f', width: '100%', border: 'none', color: 'white', cursor: 'pointer' }}
                                disabled={!canSubmitCryptoPayment || isCryptoBusy}
                                onClick={handleCryptoPayment}
                            >
                                <span style={{ fontWeight: 700, letterSpacing: '1px' }}>
                                    {isSwitchingChain ? 'SWITCHING NETWORK...' : isSendingCrypto ? `CONFIRM ${cryptoTokenSymbol} TRANSFER...` : isConfirmingCrypto ? 'WAITING FOR CONFIRMATION...' : `PAY ${cryptoAmount || amount} ${cryptoTokenSymbol}`}
                                </span>
                            </button>

                            {(pendingCryptoHash || cryptoError) && (
                                <div className="crypto-feedback-box">
                                    {pendingCryptoHash && (
                                        <p className="crypto-feedback">
                                            Transaction submitted. Tx ID: <code style={{ fontSize: '12px' }}>{pendingCryptoHash}</code>
                                        </p>
                                    )}
                                    {cryptoError && <p className="crypto-error" style={{ marginTop: pendingCryptoHash ? '10px' : 0 }}>{cryptoError}</p>}
                                </div>
                            )}
                        </div>
                    )}

                    {paymentMethod === 'binance' && (
                        <form className="confirmation-form" style={{ marginTop: '20px' }} onSubmit={handleBinancePayment}>
                            <div className="crypto-payment" style={{ marginBottom: '20px' }}>
                                <p className="crypto-intro" style={{ marginBottom: '12px' }}>
                                    Binance Pay creates a hosted checkout order for this booking amount and redirects you to Binance to finish payment securely.
                                </p>
                                <div className="crypto-meta-grid" style={{ marginBottom: 0 }}>
                                    <div className="crypto-meta-item">
                                        <span className="crypto-meta-label">Amount</span>
                                        <strong>{currency} {amount}</strong>
                                    </div>
                                    <div className="crypto-meta-item">
                                        <span className="crypto-meta-label">Traveler</span>
                                        <strong>{travelerName}</strong>
                                    </div>
                                    <div className="crypto-meta-item">
                                        <span className="crypto-meta-label">Settlement</span>
                                        <strong>Binance Pay Checkout</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="checkbox-group" style={{ display: 'flex', gap: '12px', marginBottom: '30px', fontSize: '14px' }}>
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                />
                                <label htmlFor="terms" style={{ color: '#666' }}>
                                    I agree to the <a href="/terms" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Booking Terms</a> & <a href="/cancellation" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Cancellation Policy</a>.
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary full-width-btn"
                                style={{ padding: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#000000', width: '100%', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
                                disabled={!acceptedTerms || isBinancePayLoading}
                            >
                                <span style={{ fontWeight: 700, letterSpacing: '1px' }}>
                                    {isBinancePayLoading ? 'CREATING ORDER...' : 'PROCEED TO BINANCE PAY'}
                                </span>
                            </button>
                            {binancePayError && (
                                <div className="crypto-feedback-box" style={{ marginTop: '16px' }}>
                                    <p className="crypto-error">{binancePayError}</p>
                                </div>
                            )}
                            {binanceCheckoutUrl && !binancePayError && (
                                <div className="crypto-feedback-box" style={{ marginTop: '16px' }}>
                                    <p className="crypto-feedback">
                                        If the redirect does not start, continue here: <a href={binanceCheckoutUrl} style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Open Binance Pay checkout</a>
                                    </p>
                                </div>
                            )}
                        </form>
                    )}

                    {paymentMethod === 'wire' && (
                        <div className="wire-details-box" style={{ marginTop: '20px' }}>
                            <h4>Wire Transfer Instructions</h4>
                            <div className="detail-row">
                                <span className="label">Bank:</span>
                                <span className="value">Royal Bank of Bhutan</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Name:</span>
                                <span className="value">Saidpiece Travel Pvt Ltd</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Account Number:</span>
                                <span className="value">123456789</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">SWIFT:</span>
                                <span className="value">RBBTBTBT</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Amount:</span>
                                <span className="value">{currency} {amount}</span>
                            </div>

                            <div className="instruction-text">
                                <strong>How to confirm:</strong> After sending your wire, please email your payment confirmation to <a href="mailto:saidpiece@gmail.com" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>saidpiece@gmail.com</a> so we can finalize your booking.
                            </div>
                        </div>
                    )}
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
                    gap: 16px;
                    margin: 32px 0;
                }
                .method-btn {
                    display: grid;
                    grid-template-columns: 44px 1fr;
                    align-items: center;
                    column-gap: 18px;
                    padding: 22px 26px;
                    border: 1px solid #EAEAEA;
                    background: white;
                    cursor: pointer;
                    text-align: left;
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
                    width: 44px;
                    height: 44px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    border-radius: 50%;
                    background: #F5F7FA;
                }
                .method-info {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    min-width: 0;
                }
                .method-info strong {
                    display: block;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                .method-info span {
                    font-size: 13px;
                    color: var(--color-text-secondary);
                    line-height: 1.5;
                }
                .crypto-payment {
                    background: #FCFCFD;
                    border: 1px solid #ECEFF3;
                    border-radius: 6px;
                    padding: 24px;
                }
                .crypto-intro {
                    font-size: 14px;
                    color: #555;
                    margin: 0 0 18px;
                    line-height: 1.6;
                }
                .crypto-connect-row {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 16px;
                }
                .crypto-status-box {
                    min-height: 48px;
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    padding: 12px 14px;
                    background: white;
                    border: 1px solid #ECEFF3;
                    border-radius: 4px;
                }
                .crypto-status {
                    margin: 0;
                    font-size: 13px;
                    color: #777;
                    line-height: 1.5;
                    word-break: break-word;
                }
                .crypto-status.connected {
                    color: #444;
                }
                .crypto-meta-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 12px;
                    margin-bottom: 16px;
                }
                .crypto-meta-item {
                    padding: 14px;
                    background: white;
                    border: 1px solid #ECEFF3;
                    border-radius: 4px;
                }
                .crypto-meta-item strong {
                    display: block;
                    color: #1f2937;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .crypto-meta-label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #6b7280;
                }
                .crypto-hint {
                    margin: 0 0 16px;
                    font-size: 13px;
                    color: #555;
                }
                .crypto-feedback-box {
                    margin-top: 16px;
                    padding: 14px;
                    background: white;
                    border: 1px solid #ECEFF3;
                    border-radius: 4px;
                }
                .crypto-feedback {
                    margin: 0;
                    font-size: 13px;
                    color: #555;
                    line-height: 1.5;
                    word-break: break-word;
                }
                .crypto-error {
                    margin: 12px 0 0;
                    font-size: 13px;
                    color: #b42318;
                    line-height: 1.5;
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
                @media (max-width: 640px) {
                    .method-btn {
                        grid-template-columns: 40px 1fr;
                        padding: 18px 18px;
                        column-gap: 14px;
                    }
                    .method-icon {
                        width: 40px;
                        height: 40px;
                        font-size: 22px;
                    }
                    .crypto-payment {
                        padding: 18px;
                    }
                    .crypto-meta-grid {
                        grid-template-columns: 1fr;
                    }
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
                <WalletProvider>
                    <ConfirmPayContent />
                </WalletProvider>
            </Suspense>
            <Footer />
        </main>
    );
}
