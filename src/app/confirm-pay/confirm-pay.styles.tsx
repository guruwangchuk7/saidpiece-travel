export const confirmPayStyles = (
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
            background: #F8F9FA;
            border-radius: 50%;
        }
        .method-info strong {
            display: block;
            font-size: 16px;
            margin-bottom: 2px;
        }
        .method-info span {
            font-size: 13px;
            color: #888;
        }
        .payment-options-card {
            padding: 20px 0;
        }
        .payment-note {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .wire-details-box {
            background: #F8F9FA;
            padding: 30px;
            border-radius: 4px;
            border-left: 4px solid var(--color-brand);
        }
        .wire-details-box h4 {
            margin-bottom: 20px;
            font-family: var(--font-playfair);
            font-size: 20px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #EEE;
        }
        .detail-row:last-of-type {
            border-bottom: none;
        }
        .detail-row .label {
            font-size: 13px;
            color: #888;
            text-transform: uppercase;
        }
        .detail-row .value {
            font-weight: 600;
            color: #333;
        }
        .instruction-text {
            margin-top: 25px;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            padding-top: 20px;
            border-top: 1px dashed #CCC;
        }
        .crypto-payment {
            background: #F9FAFB;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
        }
        .crypto-intro {
            font-size: 14px;
            color: #4B5563;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .crypto-connect-row {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        }
        .crypto-status-box {
            margin-bottom: 25px;
            text-align: center;
            padding: 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #E5E7EB;
        }
        .crypto-status {
            font-size: 13px;
            color: #6B7280;
            margin: 0;
        }
        .crypto-status.connected {
            color: #059669;
        }
        .crypto-meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        .crypto-meta-item {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #E5E7EB;
            text-align: center;
        }
        .crypto-meta-label {
            display: block;
            font-size: 11px;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .crypto-meta-item strong {
            font-size: 14px;
            color: #111827;
        }
        .crypto-hint {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 20px;
            text-align: center;
            font-style: italic;
        }
        .crypto-error {
            font-size: 13px;
            color: #DC2626;
            margin-bottom: 20px;
            text-align: center;
            padding: 10px;
            background: #FEF2F2;
            border-radius: 4px;
        }
        .crypto-feedback-box {
            margin-top: 20px;
            padding: 15px;
            background: #F3F4F6;
            border-radius: 6px;
            text-align: center;
        }
        .crypto-feedback {
            font-size: 13px;
            color: #374151;
            margin: 0;
        }
        
        @media (max-width: 992px) {
            .checkout-layout {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            .confirm-pay-container {
                padding-top: 120px;
            }
        }
        @media (max-width: 600px) {
            .checkout-summary-card {
                padding: 30px 20px;
            }
            .trip-preview-box {
                flex-direction: column;
                gap: 15px;
            }
            .trip-image {
                width: 100%;
                height: 200px;
            }
        }
    `}</style>
);
