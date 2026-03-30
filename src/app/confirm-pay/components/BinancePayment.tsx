interface BinancePaymentProps {
    currency: string;
    amount: string;
    travelerName: string;
    acceptedTerms: boolean;
    setAcceptedTerms: (accepted: boolean) => void;
    isBinancePayLoading: boolean;
    binancePayError: string | null;
    binanceCheckoutUrl: string | null;
    onSubmit: (e: React.FormEvent) => void;
}

export default function BinancePayment({
    currency,
    amount,
    travelerName,
    acceptedTerms,
    setAcceptedTerms,
    isBinancePayLoading,
    binancePayError,
    binanceCheckoutUrl,
    onSubmit
}: BinancePaymentProps) {
    return (
        <form className="confirmation-form" style={{ marginTop: '20px' }} onSubmit={onSubmit}>
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
                    id="terms-binance"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="terms-binance" style={{ color: '#666' }}>
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
    );
}
