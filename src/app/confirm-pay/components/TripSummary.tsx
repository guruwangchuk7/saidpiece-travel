import Image from 'next/image';

interface TripSummaryProps {
    tripName: string;
    travelerName: string;
    amount: string;
    currency: string;
}

export default function TripSummary({ tripName, travelerName, amount, currency }: TripSummaryProps) {
    return (
        <div className="checkout-summary-card">
            <div className="summary-header">
                <span className="step-tag">Step 3: Secure Your Trip</span>
                <h1 className="serif-h2">Review & Confirm</h1>
            </div>

            <div className="trip-preview-box">
                <div className="trip-image">
                    <Image 
                        src="/images/bhutan/11.webp" 
                        alt="Bhutan" 
                        fill 
                        sizes="120px" 
                        style={{ objectFit: 'cover' }} 
                    />
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
    );
}
