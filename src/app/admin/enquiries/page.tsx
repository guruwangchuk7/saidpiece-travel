'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EnquiryManager() {
    const { user, loading, isStaff, signOut, signInWithGoogle } = useAuth();
    const router = useRouter();

    interface Enquiry {
        id: string;
        firstName: string;
        email: string;
        trip: string;
        date: string;
        status: string;
        message: string;
    }

    const [view, setView] = useState<'enquiries' | 'bookings'>('enquiries');
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (!loading && !isStaff) {
            router.push('/admin/login');
        }
    }, [loading, isStaff, router]);

    useEffect(() => {
        if (isStaff && supabase) {
            if (view === 'enquiries') fetchEnquiries();
            else fetchBookings();
        }
    }, [isStaff, view]);

    const fetchEnquiries = async () => {
        if (!supabase) return;
        setIsFetching(true);
        try {
            const { data, error } = await supabase
                .from('enquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const mapped: Enquiry[] = data.map(item => ({
                    id: item.id,
                    firstName: item.first_name,
                    email: item.email,
                    trip: item.trip_name_fallback || 'Custom Request',
                    date: new Date(item.created_at).toLocaleDateString(),
                    status: item.status,
                    message: item.message || ''
                }));
                setEnquiries(mapped);
            }
        } catch (err) {
            console.error('Error fetching enquiries:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchBookings = async () => {
        if (!supabase) return;
        setIsFetching(true);
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, trips(title)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSendEmail = async (templateName: string) => {
        if (!selectedEnquiry || !supabase) {
            return;
        }

        let newStatus = selectedEnquiry.status;
        if (templateName === 'Proposal') {
            newStatus = 'proposed';
        } else if (templateName === 'Confirm & Pay') {
            newStatus = 'awaiting_payment';
        }

        try {
            const { error } = await supabase
                .from('enquiries')
                .update({ status: newStatus })
                .eq('id', selectedEnquiry.id);

            if (error) throw error;

            alert(`Email sent to ${selectedEnquiry.firstName} using "${templateName}" template.\nStatus updated to: ${newStatus}`);
            
            setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? { ...e, status: newStatus } : e));
            setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
            setActiveTemplate(null);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status in database.');
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    if (loading || (isStaff && isFetching)) {
        return <div style={{ padding: '100px', textAlign: 'center' }}>Verifying Staff Access & Loading Data...</div>;
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

    return (
        <main className="admin-page page-with-header">
            <Header theme="light" />
            <div className="container" style={{ padding: '120px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h1 className="serif-title" style={{ margin: 0 }}>Management Dashboard</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Logged in as: <strong>{user?.email}</strong></span>
                        <button className="btn btn-outline" style={{ padding: '8px 20px' }} onClick={handleSignOut}>Logout</button>
                    </div>
                </div>

                <div className="view-toggle" style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
                    <button 
                        className={`btn ${view === 'enquiries' ? 'btn-primary' : 'btn-outline'}`} 
                        onClick={() => setView('enquiries')}
                    >
                        Leads / Enquiries
                    </button>
                    <button 
                        className={`btn ${view === 'bookings' ? 'btn-primary' : 'btn-outline'}`} 
                        onClick={() => setView('bookings')}
                    >
                        Confirmed Bookings
                    </button>
                </div>

                <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
                    {/* List */}
                    <aside className="enquiry-list" style={{ borderRight: '1px solid #eee', overflowY: 'auto', maxHeight: '70vh', paddingRight: '10px' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>{view === 'enquiries' ? 'Recent Enquiries' : 'Finalized Bookings'}</h3>
                        
                        {view === 'enquiries' ? (
                            enquiries.length === 0 ? <p>None found.</p> : enquiries.map(enq => (
                                <div key={enq.id} className={`enq-item ${selectedEnquiry?.id === enq.id ? 'active' : ''}`} onClick={() => setSelectedEnquiry(enq)} style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selectedEnquiry?.id === enq.id ? '#f0fafa' : 'transparent', borderRadius: '8px', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 600 }}>{enq.firstName}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{enq.trip} • <span style={{ color: enq.status === 'new' ? '#d32f2f' : '#666' }}>{enq.status.toUpperCase()}</span></div>
                                </div>
                            ))
                        ) : (
                            bookings.length === 0 ? <p>No bookings yet.</p> : bookings.map(bk => (
                                <div key={bk.id} className={`enq-item ${selectedBooking?.id === bk.id ? 'active' : ''}`} onClick={() => setSelectedBooking(bk)} style={{ padding: '15px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', background: selectedBooking?.id === bk.id ? '#f0fafa' : 'transparent', borderRadius: '8px', marginBottom: '10px' }}>
                                    <div style={{ fontWeight: 600 }}>{bk.traveler_name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{bk.trips?.title} • <span style={{ color: bk.status === 'paid' ? '#008080' : '#666' }}>{bk.status.toUpperCase()}</span></div>
                                </div>
                            ))
                        )}
                    </aside>

                    {/* Details */}
                    <section className="enquiry-details">
                        {view === 'enquiries' ? (
                            selectedEnquiry ? (
                                <div className="details-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <div>
                                            <h2>{selectedEnquiry.firstName}&apos;s Request</h2>
                                            <p style={{ fontSize: '13px', color: '#666' }}>{selectedEnquiry.email} | Received: {selectedEnquiry.date}</p>
                                        </div>
                                        <div style={{ padding: '5px 15px', borderRadius: '20px', background: '#008080', color: 'white', fontSize: '12px', height: 'fit-content' }}>{selectedEnquiry.status.toUpperCase()}</div>
                                    </div>
                                    <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', borderLeft: '4px solid #008080' }}>
                                        <h4 style={{ fontSize: '11px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>Customer Message:</h4>
                                        <div style={{ whiteSpace: 'pre-wrap' }}>{selectedEnquiry.message}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
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
                                                        Once payment is received, we’ll begin visa processing and secure all on-ground arrangements for your journey.<br /><br />
                                                        If you have any final questions before completing payment, feel free to reply to this email and we’ll be happy to assist.
                                                    </>
                                                )}

                                                <br /><br />
                                                Warm regards,<br />
                                                <strong>Pema Nyamdrol</strong><br />
                                                {activeTemplate === 'Enquiry Received' ? 'Travel Planner' : 'Co-Founder'} | Saidpiece Travelers
                                            </div>
                                            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                                                <button className="btn btn-primary" onClick={() => handleSendEmail(activeTemplate)}>Mark as Sent & Update Status</button>
                                                <button className="btn btn-outline" onClick={() => setActiveTemplate(null)}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : <div>Select an enquiry to manage</div>
                        ) : (
                            selectedBooking ? (
                                <div className="details-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <h2>Booking: {selectedBooking.traveler_name}</h2>
                                        <div style={{ padding: '5px 15px', borderRadius: '20px', background: selectedBooking.status === 'paid' ? '#008080' : '#888', color: 'white', fontSize: '12px' }}>{selectedBooking.status.toUpperCase()}</div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div style={{ background: '#fcfaf7', padding: '20px', borderRadius: '8px' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Financials</h4>
                                            <div style={{ fontSize: '24px', fontWeight: 700 }}>{selectedBooking.currency} {selectedBooking.total_amount}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Method: {selectedBooking.payment_method?.toUpperCase()}</div>
                                            <div style={{ fontSize: '11px', color: '#888', marginTop: '5px', wordBreak: 'break-all' }}>Ref: {selectedBooking.payment_reference}</div>
                                        </div>
                                        <div style={{ background: '#fcfaf7', padding: '20px', borderRadius: '8px' }}>
                                            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', textTransform: 'uppercase' }}>Trip Details</h4>
                                            <div style={{ fontWeight: 600 }}>{selectedBooking.trips?.title}</div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Traveler: {selectedBooking.traveler_name}</div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>Email: {selectedBooking.traveler_email}</div>
                                        </div>
                                    </div>
                                    {selectedBooking.status === 'paid' && (
                                        <div style={{ marginTop: '30px', padding: '15px', background: '#e6f4f4', borderRadius: '8px', borderLeft: '4px solid #008080' }}>
                                            <strong>Verified:</strong> Automated confirmation emails have been sent to this traveler via Resend.
                                        </div>
                                    )}
                                </div>
                            ) : <div>Select a booking to view details</div>
                        )}
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
