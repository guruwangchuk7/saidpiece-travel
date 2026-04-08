import Image from 'next/image';

interface SuccessViewProps {
    travelerName: string;
    paymentMethod: 'card' | 'crypto' | 'wire' | 'binance' | null;
    cryptoTxId: string | null;
}

export default function SuccessView({ travelerName, paymentMethod, cryptoTxId }: SuccessViewProps) {
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

    const message = isCrypto 
        ? 'Your wallet has initiated a transaction to finalize your booking.' 
        : isWire 
            ? 'We have provided the bank details below to complete your booking.' 
            : 'We are now connecting you to our secure payment gateway to finalize your booking.';

    return (
        <div className="confirmation-success animation-fade-in text-center" style={{ padding: '180px 20px' }}>
            <div className="success-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>{icon}</div>
            <h1 className="serif-title">{title}</h1>
            <p className="lead-text" style={{ maxWidth: '600px', margin: '20px auto' }}>
                Thank you, {travelerName}. {message}
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
                    <p style={{ fontSize: '13px', color: '#888' }}>
                        Please send the wire transfer and email the payment receipt to <a href="mailto:saidpiece@gmail.com" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>saidpiece@gmail.com</a>.
                    </p>
                </div>
            )}
        </div>
    );
}
