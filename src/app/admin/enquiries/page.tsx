'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

// Mock enquiries
const initialEnquiries = [
    { id: '1', firstName: 'Julian', email: 'julian@example.com', trip: 'Highland Trek', date: '2026-03-05', status: 'new' },
    { id: '2', firstName: 'Elena', email: 'elena@travel.com', trip: 'Cultural Heritage', date: '2026-03-04', status: 'proposed' },
];

export default function EnquiryManager() {
    const { user, loading, isStaff, signOut, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [enquiries, setEnquiries] = useState(initialEnquiries);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !isStaff) {
            router.push('/admin/login');
        }
    }, [loading, isStaff, router]);

    if (loading) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Verifying Staff Access...</div>;
    }

    if (!isStaff) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <h2 className="serif-title">Access Denied</h2>
                <p>You are not authorized to access this dashboard. Please log in with a staff Gmail account.</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => signInWithGoogle('/admin/enquiries')}>Sign in with Staff Gmail</button>
            </div>
        );
    }

    const handleSendEmail = (templateName: string) => {
        alert(`Email sent to ${selectedEnquiry.firstName} using "${templateName}" template.`);
        if (templateName === 'Proposal') {
            setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? { ...e, status: 'proposed' } : e));
        } else if (templateName === 'Confirm & Pay') {
            setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? { ...e, status: 'awaiting-payment' } : e));
        }
        setActiveTemplate(null);
    };

    const getLink = (type: string) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.saidpiecetravels.com';
        if (type === 'confirm') {
            return `${baseUrl}/confirm-pay?name=${selectedEnquiry.firstName}&email=${selectedEnquiry.email}&amount=4250&trip=${encodeURIComponent(selectedEnquiry.trip)}`;
        }
        return '#';
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    return (
        <main className="admin-page page-with-header">
            <Header theme="light" />
            <div className="container" style={{ padding: '120px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 className="serif-title" style={{ margin: 0 }}>Booking Management Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Logged in as: <strong>{user?.email}</strong></span>
                        <button className="btn btn-outline" style={{ padding: '8px 20px' }} onClick={handleSignOut}>Logout</button>
                    </div>
                </div>

                <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
                    {/* List */}
                    <aside className="enquiry-list" style={{ borderRight: '1px solid #eee' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Recent Enquiries</h3>
                        {enquiries.map(enq => (
                            <div
                                key={enq.id}
                                className={`enq-item ${selectedEnquiry?.id === enq.id ? 'active' : ''}`}
                                onClick={() => setSelectedEnquiry(enq)}
                                style={{
                                    padding: '15px',
                                    borderBottom: '1px solid #f0f0f0',
                                    cursor: 'pointer',
                                    background: selectedEnquiry?.id === enq.id ? '#f0fafa' : 'transparent',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{enq.firstName}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>{enq.trip} • {enq.status}</div>
                            </div>
                        ))}
                    </aside>

                    {/* Details & Templates */}
                    <section className="enquiry-details">
                        {selectedEnquiry ? (
                            <div className="details-card">
                                <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                                    <div>
                                        <h2>{selectedEnquiry.firstName}&apos;s Trip Request</h2>
                                        <p>{selectedEnquiry.email} | Received: {selectedEnquiry.date}</p>
                                    </div>
                                    <div className="status-badge" style={{ padding: '5px 15px', borderRadius: '20px', background: '#008080', color: 'white', fontSize: '12px', alignSelf: 'center' }}>
                                        Status: {selectedEnquiry.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="template-actions" style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                                    <button className="btn btn-outline" onClick={() => setActiveTemplate('Enquiry Received')}>1. Auto-Reply</button>
                                    <button className="btn btn-outline" onClick={() => setActiveTemplate('Proposal')}>2. Send Proposal</button>
                                    <button className="btn btn-primary" onClick={() => setActiveTemplate('Confirm & Pay')}>3. Confirm & Pay</button>
                                </div>

                                {activeTemplate && (
                                    <div className="email-preview-box" style={{ background: '#fdfcf9', padding: '30px', borderRadius: '12px', border: '1px solid #d4c8b0' }}>
                                        <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                            <strong>Subject:</strong> {
                                                activeTemplate === 'Enquiry Received' ? 'We’ve received your Bhutan travel enquiry' :
                                                    activeTemplate === 'Proposal' ? 'Your Bhutan Journey Proposal with Saidpiece Travelers' : 'Confirm & Secure Your Bhutan Journey'
                                            }
                                        </div>
                                        <div className="email-body" style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', fontSize: '15px', lineHeight: '1.6', color: '#333' }}>
                                            Dear {selectedEnquiry.firstName},<br /><br />

                                            {activeTemplate === 'Enquiry Received' && (
                                                <>
                                                    Thank you for reaching out to Saidpiece Travelers and for your interest in travelling to Bhutan with us. <br /><br />
                                                    We’ve received your enquiry successfully. <br /><br />
                                                    <strong>What happens next</strong><br />
                                                    Over the next 24–48 hours, our team will carefully review the details you shared and prepare:<br />
                                                    • A draft itinerary tailored to your travel interests and pace<br />
                                                    • A curated selection of hotel options (standard / luxury / ultra-luxury, where applicable)<br />
                                                    • A clear cost breakdown, including government fees and visa requirements<br /><br />
                                                    Bhutan travel is thoughtfully planned and regulated, which is why we design each journey personally rather than offering instant bookings. This ensures your experience is seamless, meaningful, and well-supported from start to finish.<br /><br />
                                                    <strong>Prefer to talk it through?</strong><br />
                                                    If you’d feel more comfortable speaking with us directly, you’re welcome to schedule a short video call. We’re happy to walk you through how travel works in Bhutan and answer any questions you may have.<br /><br />
                                                    👉 <a href="#" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Talk to Us (video call link)</a><br /><br />
                                                    If you have any additional preferences, you’d like us to consider—such as travel pace, accommodation style, or special occasions—you’re welcome to reply to this email.
                                                </>
                                            )}

                                            {activeTemplate === 'Proposal' && (
                                                <>
                                                    Thank you for your patience, and for sharing your travel plans with us.<br /><br />
                                                    Based on the details you provided, we’ve prepared a draft proposal for your journey to Bhutan, designed around your interests, travel pace, and the time you have available.<br /><br />
                                                    <strong>What we’ve prepared for you</strong><br />
                                                    Attached to this email, you’ll find:<br />
                                                    • A proposed itinerary, outlining the flow of your journey day by day<br />
                                                    • A curated selection of accommodation options (by comfort level, where applicable)<br />
                                                    • A transparent cost breakdown, including the Sustainable Development Fee (SDF) and visa fees<br /><br />
                                                    This proposal is a starting point. Nothing is fixed yet, and we’re happy to refine the itinerary, adjust the pace, or explore alternative accommodation options based on your preferences.<br /><br />
                                                    <strong>A note on travelling in Bhutan</strong><br />
                                                    Travel in Bhutan is thoughtfully planned and regulated, which allows us to manage logistics, permits, guides, and accommodation seamlessly on your behalf. Our role is to take care of these details so you can focus on the experience itself.<br /><br />
                                                    <strong>Prefer to talk it through?</strong><br />
                                                    If you’d like to walk through the proposal together or have any questions, you’re welcome to schedule a short video call with us. <br /><br />
                                                    👉 <a href="#" style={{ color: 'var(--color-brand)', fontWeight: 600 }}>Talk to Us (video call link)</a><br /><br />
                                                    Please take your time reviewing the proposal, and feel free to reply to this email with any questions or feedback. Once you’re comfortable and ready to proceed, we’ll guide you through the next steps to confirm your trip.<br /><br />
                                                    <strong>ATTACH:</strong> [Itinerary PDF] [Cost Summary Branded PDF]
                                                </>
                                            )}

                                            {activeTemplate === 'Confirm & Pay' && (
                                                <>
                                                    Thank you for confirming that you’d like to proceed with your Bhutan journey.<br /><br />
                                                    Based on our discussion and the approved itinerary and cost summary, you can now move ahead with confirming your trip.<br /><br />
                                                    <strong>Next step: Confirm & Pay</strong><br />
                                                    Please use the secure link below to review your booking details and complete payment.<br /><br />
                                                    👉 <a href="https://buy.stripe.com/00w6oHc3Daev27M9Bm93y00" style={{ color: 'var(--color-brand)', fontWeight: 700, textDecoration: 'underline' }}>Confirm & Secure My Trip</a><br /><br />
                                                    On this page, you’ll be able to:<br />
                                                    • Review your final trip summary<br />
                                                    • See the confirmed total cost<br />
                                                    • Choose between paying a deposit or the full amount<br /><br />
                                                    Once payment is received, we’ll begin visa processing and secure all on-ground arrangements for your journey.<br /><br />
                                                    If you have any final questions before completing payment, feel free to reply to this email and we’ll be happy to assist.
                                                </>
                                            )}

                                            <br /><br />
                                            Warm regards,<br />
                                            <strong>Pema Nyamdrol</strong><br />
                                            {activeTemplate === 'Enquiry Received' ? 'Travel Planner' : 'Co-Founder'} | Saidpiece Travelers<br />
                                            Bhutan<br />
                                            🌐 <a href="https://www.saidpiecetravels.com" style={{ color: '#666' }}>www.saidpiecetravels.com</a>
                                        </div>
                                        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                                            <button className="btn btn-primary" onClick={() => handleSendEmail(activeTemplate)}>Send Email Now</button>
                                            <button className="btn btn-outline" onClick={() => setActiveTemplate(null)}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '100px', color: '#999' }}>
                                Select an enquiry to manage templates
                            </div>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
