import Image from 'next/image';

interface PaymentMethodSelectorProps {
    paymentMethod: 'card' | 'crypto' | 'wire' | 'binance' | null;
    onMethodChange: (method: 'card' | 'crypto' | 'wire' | 'binance') => void;
}

export default function PaymentMethodSelector({ paymentMethod, onMethodChange }: PaymentMethodSelectorProps) {
    return (
        <div className="method-selector">
            <button
                type="button"
                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                onClick={() => onMethodChange('card')}
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
                onClick={() => onMethodChange('crypto')}
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
                onClick={() => onMethodChange('binance')}
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
                onClick={() => onMethodChange('wire')}
            >
                <span className="method-icon">🏦</span>
                <div className="method-info">
                    <strong>Wire Transfer</strong>
                    <span>Request bank details to pay by SWIFT.</span>
                </div>
            </button>
        </div>
    );
}
