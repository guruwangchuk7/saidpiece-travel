import { ConnectButton } from '@rainbow-me/rainbowkit';

interface CryptoPaymentProps {
    isConnected: boolean;
    address: `0x${string}` | undefined;
    cryptoTokenSymbol: string;
    cryptoAmountValue: string | null;
    activePaymentChainId: number;
    quoteExpiresAt: string | null;
    isCorrectCryptoChain: boolean;
    contractCall: any;
    canSubmitCryptoPayment: boolean;
    isCryptoBusy: boolean;
    isPreparingCrypto: boolean;
    isSwitchingChain: boolean;
    isSendingCrypto: boolean;
    isConfirmingCrypto: boolean;
    pendingCryptoHash: `0x${string}` | undefined;
    cryptoError: string | null;
    onPay: () => Promise<void>;
    amount: string; // for fallback display
}

export default function CryptoPayment({
    isConnected,
    address,
    cryptoTokenSymbol,
    cryptoAmountValue,
    activePaymentChainId,
    quoteExpiresAt,
    isCorrectCryptoChain,
    contractCall,
    canSubmitCryptoPayment,
    isCryptoBusy,
    isPreparingCrypto,
    isSwitchingChain,
    isSendingCrypto,
    isConfirmingCrypto,
    pendingCryptoHash,
    cryptoError,
    onPay,
    amount
}: CryptoPaymentProps) {
    return (
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
                    <strong>{cryptoAmountValue ? `${cryptoAmountValue} ${cryptoTokenSymbol}` : 'Unavailable'}</strong>
                </div>
                <div className="crypto-meta-item">
                    <span className="crypto-meta-label">Chain</span>
                    <strong>{activePaymentChainId === 8453 ? 'Base' : activePaymentChainId === 1 ? 'Ethereum' : activePaymentChainId}</strong>
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

            {!contractCall && (
                <p className="crypto-error">
                    Crypto payments are disabled until the business wallet and token contract are configured.
                </p>
            )}

            <button
                type="button"
                className="btn btn-primary full-width-btn"
                style={{ padding: '22px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#1c1c1f', width: '100%', border: 'none', color: 'white', cursor: 'pointer' }}
                disabled={!canSubmitCryptoPayment || isCryptoBusy}
                onClick={onPay}
            >
                <span style={{ fontWeight: 700, letterSpacing: '1px' }}>
                    {isPreparingCrypto
                        ? 'PREPARING PAYMENT...'
                        : isSwitchingChain
                        ? 'SWITCHING TO BASE...'
                        : isSendingCrypto
                        ? `CONFIRM ${cryptoTokenSymbol} TRANSFER...`
                        : isConfirmingCrypto
                        ? 'WAITING FOR CONFIRMATION...'
                        : !isCorrectCryptoChain
                        ? 'SWITCH TO BASE TO PAY'
                        : `PAY ${cryptoAmountValue || amount} ${cryptoTokenSymbol}`}
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
    );
}
