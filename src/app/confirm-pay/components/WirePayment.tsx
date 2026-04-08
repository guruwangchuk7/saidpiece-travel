interface WirePaymentProps {
    currency: string;
    amount: string;
}

export default function WirePayment({ currency, amount }: WirePaymentProps) {
    return (
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
    );
}
