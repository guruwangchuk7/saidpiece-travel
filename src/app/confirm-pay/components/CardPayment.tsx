interface CardPaymentProps {
    acceptedTerms: boolean;
    setAcceptedTerms: (accepted: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function CardPayment({ acceptedTerms, setAcceptedTerms, onSubmit }: CardPaymentProps) {
    return (
        <form className="confirmation-form" style={{ marginTop: '20px' }} onSubmit={onSubmit}>
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
                style={{ 
                    padding: '22px', 
                    borderRadius: '4px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '12px', 
                    background: '#635bff', 
                    width: '100%', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer' 
                }}
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
    );
}
