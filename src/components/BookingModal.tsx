'use client';

import { useState } from 'react';
import Image from 'next/image';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tripName: string;
    tripPrice: string;
    tripImage: string;
}

export default function BookingModal({ isOpen, onClose, tripName, tripPrice, tripImage }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        passengers: '2',
        message: ''
    });

    if (!isOpen) return null;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.firstName,
                    email: formData.email,
                    message: `Passengers: ${formData.passengers}\nMessage: ${formData.message}`.trim(),
                    trip_name_fallback: tripName
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send request');
            }

            setStep(2);
        } catch (err: any) {
            console.error('Booking request error:', err);
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="booking-modal-overlay">
            <div className="booking-modal-container animation-slide-up">
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                {step === 1 ? (
                    <div className="modal-content-split">
                        <div className="modal-info-side">
                            <div className="modal-trip-preview">
                                <Image src={tripImage} alt={tripName} fill sizes="(max-width: 768px) 100vw, 40vw" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="modal-text-content">
                                <span className="modal-label">Your Selection</span>
                                <h2 className="serif-title">{tripName}</h2>
                                <div className="modal-price-lock">
                                    <span>From</span>
                                    <strong>{tripPrice}</strong>
                                    <small>per person</small>
                                </div>
                                <ul className="modal-perks">
                                    <li>✨ Private Local Guide</li>
                                    <li>✨ Heritage Stays</li>
                                    <li>✨ Visa & SDF Included</li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-form-side">
                            <h3>Secure Your Booking Inquiry</h3>
                            <p>Enter your details and our team will review your request and send a secure payment link.</p>

                            <form onSubmit={handleSubmit} className="modal-form">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Travelers</label>
                                        <select
                                            value={formData.passengers}
                                            onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4+</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Message (Optional)</label>
                                    <textarea
                                         rows={3}
                                         placeholder="Special requests, dates, etc."
                                         value={formData.message}
                                         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                     ></textarea>
                                 </div>
                                 
                                 {error && <p style={{ color: '#d32f2f', marginBottom: '15px', fontSize: '13px' }}>{error}</p>}
                                 
                                 <button 
                                     type="submit" 
                                     className="btn btn-primary full-width" 
                                     disabled={isSubmitting}
                                 >
                                     {isSubmitting ? 'SENDING...' : 'SEND BOOKING REQUEST'}
                                 </button>
                                 <p className="form-footer-note">Secure & Private • No immediate payment required</p>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="modal-success-state text-center">
                        <div className="success-icon">🏔️</div>
                        <h2 className="serif-title">Request Received</h2>
                        <p>Thank you, {formData.firstName}. Your booking inquiry for <strong>{tripName}</strong> has been sent to our Thimphu office.</p>
                        <div className="process-preview">
                            <div className="process-step">
                                <span className="num">1</span>
                                <p>Pema reviews your request</p>
                            </div>
                            <div className="process-arrow">→</div>
                            <div className="process-step">
                                <span className="num">2</span>
                                <p>Receive Secure Payment Link</p>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={onClose}>CONTINUE BROWSING</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .booking-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    padding: 20px;
                }
                .booking-modal-container {
                    background: white;
                    width: 100%;
                    max-width: 1000px;
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                }
                .modal-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 32px;
                    cursor: pointer;
                    z-index: 10;
                    color: #999;
                }
                .modal-content-split {
                    display: grid;
                    grid-template-columns: 400px 1fr;
                }
                .modal-info-side {
                    background: var(--color-brand);
                    color: white;
                    padding: 50px;
                    display: flex;
                    flex-direction: column;
                }
                .modal-trip-preview {
                    position: relative;
                    height: 200px;
                    width: 100%;
                    margin-bottom: 30px;
                    border-radius: 2px;
                    overflow: hidden;
                }
                .modal-label {
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 10px;
                    opacity: 0.7;
                    display: block;
                    margin-bottom: 10px;
                }
                .modal-price-lock {
                    margin: 25px 0;
                    padding: 20px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
                .modal-price-lock span { font-size: 12px; display: block; opacity: 0.8; }
                .modal-price-lock strong { font-size: 32px; display: block; font-family: var(--font-playfair); }
                .modal-price-lock small { font-size: 11px; opacity: 0.6; }
                .modal-perks {
                    list-style: none;
                    padding: 0;
                    font-size: 14px;
                }
                .modal-perks li { margin-bottom: 12px; }

                .modal-form-side {
                    padding: 50px;
                }
                .modal-form-side h3 { font-size: 28px; margin-bottom: 15px; font-family: var(--font-playfair); }
                .modal-form-side p { color: #666; margin-bottom: 30px; line-height: 1.6; }
                
                .modal-form .form-group { margin-bottom: 20px; }
                .modal-form label { display: block; font-size: 12px; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; color: #888; letter-spacing: 1px; }
                .modal-form input, .modal-form select, .modal-form textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #eee;
                    border-radius: 4px;
                    font-family: inherit;
                    outline: none;
                }
                .modal-form input:focus { border-color: var(--color-brand); }
                .full-width { width: 100%; padding: 18px; margin-top: 20px; }
                .form-footer-note { font-size: 11px; color: #999; margin-top: 15px; text-align: center; }

                .modal-success-state { padding: 80px 50px; }
                .success-icon { font-size: 64px; margin-bottom: 25px; }
                .process-preview {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 30px;
                    margin: 40px 0;
                }
                .process-step { max-width: 150px; }
                .process-step .num { width: 30px; height: 30px; background: var(--color-brand); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: 700; }
                .process-step p { font-size: 12px; color: #666; font-weight: 600; }
                .process-arrow { font-size: 24px; color: #ddd; }

                @media (max-width: 900px) {
                    .modal-content-split { grid-template-columns: 1fr; }
                    .modal-info-side { display: none; }
                    .modal-form-side { padding: 40px 30px; }
                }
            `}</style>
        </div>
    );
}
