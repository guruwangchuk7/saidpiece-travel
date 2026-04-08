export const confirmPayStyles = (
    <style jsx>{`
        :global(.confirm-pay-container) {
            padding: 180px 20px 100px !important;
            position: relative;
            z-index: 5;
            background: #fff;
            min-height: 80vh;
        }
        .checkout-layout {
            display: flex;
            justify-content: center;
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 10;
        }
        .checkout-summary-card {
            background: var(--color-cream);
            padding: 50px;
            border-radius: 4px;
            position: relative;
            z-index: 10;
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
        :global(.method-selector) {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin: 32px 0;
            width: 100%;
        }
        :global(.method-btn) {
            display: grid;
            grid-template-columns: 56px 1fr;
            align-items: center;
            column-gap: 20px;
            padding: 24px;
            border: 1px solid #EEE;
            background: #fff;
            border-radius: 10px;
            cursor: pointer;
            text-align: left;
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        :global(.method-btn:hover) {
            border-color: var(--color-brand);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.06);
            background: #F9FBFF;
        }
        :global(.method-btn.active) {
            border-color: var(--color-brand);
            background: #F9FBFF;
            box-shadow: 0 5px 15px rgba(30, 58, 95, 0.1), inset 0 0 0 1px var(--color-brand);
        }
        :global(.method-icon) {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            background: #F4F7FA;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        :global(.method-btn.active .method-icon) {
            background: #fff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        :global(.method-info strong) {
            display: block;
            font-size: 17px;
            margin-bottom: 4px;
            color: #111;
            font-weight: 700;
        }
        :global(.method-info span) {
            font-size: 14px;
            color: #777;
            line-height: 1.4;
        }
        .payment-options-card {
            padding: 20px 0;
        }
        .payment-note {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        :global(.wire-details-box) {
            background: #F8F9FA;
            padding: 30px;
            border-radius: 8px;
            border-left: 4px solid var(--color-brand);
        }
        :global(.wire-details-box h4) {
            margin-bottom: 20px;
            font-family: var(--font-playfair);
            font-size: 20px;
        }
        :global(.detail-row) {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #EEE;
        }
        :global(.detail-row:last-of-type) {
            border-bottom: none;
        }
        :global(.detail-row .label) {
            font-size: 13px;
            color: #888;
            text-transform: uppercase;
        }
        :global(.detail-row .value) {
            font-weight: 600;
            color: #333;
        }
        :global(.instruction-text) {
            margin-top: 25px;
            font-size: 14px;
            color: #666;
            line-height: 1.5;
            padding-top: 20px;
            border-top: 1px dashed #CCC;
        }
        :global(.crypto-payment) {
            background: #F9FAFB;
            padding: 30px;
            border-radius: 8px;
            border: 1px solid #E5E7EB;
            width: 100%;
        }
        :global(.crypto-intro) {
            font-size: 14px;
            color: #4B5563;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        :global(.crypto-connect-row) {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
        }
        :global(.crypto-status-box) {
            margin-bottom: 25px;
            text-align: center;
            padding: 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #E5E7EB;
        }
        :global(.crypto-status) {
            font-size: 13px;
            color: #6B7280;
            margin: 0;
        }
        :global(.crypto-status.connected) {
            color: #059669;
        }
        :global(.crypto-meta-grid) {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        :global(.crypto-meta-item) {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #E5E7EB;
            text-align: center;
        }
        :global(.crypto-meta-label) {
            display: block;
            font-size: 11px;
            color: #9CA3AF;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        :global(.crypto-meta-item strong) {
            font-size: 14px;
            color: #111827;
        }
        :global(.crypto-hint) {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 20px;
            text-align: center;
            font-style: italic;
        }
        :global(.crypto-error) {
            font-size: 13px;
            color: #DC2626;
            margin-bottom: 20px;
            text-align: center;
            padding: 10px;
            background: #FEF2F2;
            border-radius: 4px;
        }
        :global(.crypto-feedback-box) {
            margin-top: 20px;
            padding: 15px;
            background: #F3F4F6;
            border-radius: 6px;
            text-align: center;
        }
        :global(.crypto-feedback) {
            font-size: 13px;
            color: #374151;
            margin: 0;
        }
        
        /* Premium Redesign Styles - Using :global to ensure application */
        :global(.booking-checkout-stepper) {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 40px;
        }
        :global(.step-indicator) {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ccc;
        }
        :global(.step-indicator.active) {
            color: var(--color-brand);
        }
        :global(.step-dot) {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #eee;
        }
        :global(.step-indicator.active .step-dot) {
            background: var(--color-brand);
            box-shadow: 0 0 0 4px rgba(30, 58, 95, 0.1);
        }
        :global(.step-line) {
            width: 30px;
            height: 1px;
            background: #eee;
        }
        
        :global(.premium-summary-card) {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid rgba(0,0,0,0.03);
            transition: transform 0.3s ease;
        }
        :global(.premium-card-header) {
            padding: 40px 40px 20px;
            text-align: center;
        }
        :global(.premium-card-body) {
            padding: 20px 40px 40px;
        }
        :global(.premium-details-grid) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        :global(.detail-item) {
            background: #F9FBFF;
            padding: 20px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            border: 1px solid rgba(30, 58, 95, 0.05);
        }
        :global(.detail-label) {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #888;
            font-weight: 700;
            margin-bottom: 4px;
        }
        :global(.detail-value) {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-brand);
        }
        :global(.premium-amount-box) {
            grid-column: span 2;
            background: var(--color-brand);
            color: #fff;
            padding: 25px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        :global(.amount-info .label) {
            font-size: 12px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
            display: block;
        }
        :global(.amount-info .value) {
            font-size: 32px;
            font-weight: 800;
            font-family: var(--font-playfair);
            display: block;
        }
        :global(.premium-badge) {
            background: rgba(255,255,255,0.2);
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        :global(.confirm-actions) {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        :global(.btn-confirm-booking) {
            background: var(--color-brand);
            color: #fff;
            border: none;
            width: 100%;
            padding: 22px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            box-shadow: 0 10px 25px rgba(30, 58, 95, 0.2);
        }
        :global(.btn-confirm-booking:hover) {
            transform: translateY(-3px);
            box-shadow: 0 15px 35px rgba(30, 58, 95, 0.3);
            background: #152A45;
        }
        :global(.security-footer) {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }

        :global(.checkout-step-content) {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        :global(.checkout-layout) {
            width: 100%;
            display: flex;
            justify-content: center;
        }

        @media (max-width: 992px) {
            :global(.confirm-pay-container) {
                padding-top: 160px !important;
            }
        }
        @media (max-width: 600px) {
            :global(.premium-details-grid) {
                grid-template-columns: 1fr;
            }
            :global(.premium-amount-box) {
                grid-column: span 1;
            }
            :global(.booking-checkout-stepper) {
                gap: 5px;
            }
            :global(.step-indicator) {
                font-size: 11px;
                gap: 4px;
            }
            :global(.step-line) {
                width: 15px;
            }
        }
    `}</style>
);
