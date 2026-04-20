'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

interface Enquiry {
    id: string;
    firstName: string;
    email: string;
    trip: string;
    date: string;
    status: string;
    message: string;
    description?: string;
}

export default function EnquiryManager() {
    const { user, isStaff, signOut, signInWithGoogle } = useAuth();
    const router = useRouter();

    const [view, setView] = useState<'enquiries' | 'bookings'>('enquiries');
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        if (isStaff && supabase) {
            if (view === 'enquiries') fetchEnquiries();
            else fetchBookings();
        }
    }, [isStaff, view]);

    const fetchEnquiries = async () => {
        setIsFetching(true);
        if (!supabase) {
            setIsFetching(false);
            return;
        }
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
                if (mapped.length > 0 && !selectedEnquiry) setSelectedEnquiry(mapped[0]);
            }
        } catch (err) {
            console.error('Error fetching enquiries:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const fetchBookings = async () => {
        setIsFetching(true);
        if (!supabase) {
            setIsFetching(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select('*, trips(title)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
            if (data && data.length > 0 && !selectedBooking) setSelectedBooking(data[0]);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSendEmail = async (templateName: string) => {
        if (!selectedEnquiry || !supabase) return;

        let newStatus = selectedEnquiry.status;
        if (templateName === 'Proposal') newStatus = 'proposed';
        else if (templateName === 'Confirm & Pay') newStatus = 'awaiting_payment';

        try {
            const { error } = await supabase
                .from('enquiries')
                .update({ status: newStatus })
                .eq('id', selectedEnquiry.id);

            if (error) throw error;

            alert(`Status updated for ${selectedEnquiry.firstName} to: ${newStatus}`);
            setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? { ...e, status: newStatus } : e));
            setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus } : null);
            setActiveTemplate(null);
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDeleteEnquiry = async () => {
        if (!selectedEnquiry || !supabase) return;
        
        const confirmed = window.confirm(`Are you sure you want to delete the enquiry from ${selectedEnquiry.firstName}? This action cannot be undone.`);
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('enquiries')
                .delete()
                .eq('id', selectedEnquiry.id);

            if (error) throw error;

            setEnquiries(prev => prev.filter(e => e.id !== selectedEnquiry.id));
            setSelectedEnquiry(null);
            alert('Enquiry deleted successfully.');
        } catch (err) {
            console.error('Error deleting enquiry:', err);
            alert('Failed to delete enquiry. Please try again.');
        }
    };

    const handleDeleteBooking = async () => {
        if (!selectedBooking || !supabase) return;

        const confirmed = window.confirm(`Are you sure you want to delete the booking for ${selectedBooking.traveler_name}? This action cannot be undone.`);
        if (!confirmed) return;

        try {
            const { error } = await supabase
                .from('bookings')
                .delete()
                .eq('id', selectedBooking.id);

            if (error) throw error;

            setBookings(prev => prev.filter(b => b.id !== selectedBooking.id));
            setSelectedBooking(null);
            alert('Booking deleted successfully.');
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to delete booking. Please try again.');
        }
    };

    if (isStaff && isFetching) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Establishing Staff Connection...</p>
            </div>
        );
    }

    if (!isStaff) return null;

    return (
        <div className="dashboard-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Command Center</h1>
                    <p className="subtitle">Liaison and management of traveler journeys.</p>
                </div>
                <div className="staff-profile">
                    <div className="staff-info">
                        <span className="role-tag">Staff Access</span>
                        <span className="email">{user?.email}</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-layout">
                <aside className="view-selector">
                    <div className="switcher">
                        <button className={view === 'enquiries' ? 'active' : ''} onClick={() => setView('enquiries')}>
                            Incoming Leads
                            <span className="count">{enquiries.length}</span>
                        </button>
                        <button className={view === 'bookings' ? 'active' : ''} onClick={() => setView('bookings')}>
                            Active Bookings
                            <span className="count">{bookings.length}</span>
                        </button>
                    </div>

                    <div className="item-list">
                        {view === 'enquiries' ? (
                            enquiries.map(enq => (
                                <div key={enq.id} className={`list-item ${selectedEnquiry?.id === enq.id ? 'active' : ''}`} onClick={() => setSelectedEnquiry(enq)}>
                                    <div className="item-main">
                                        <span className="name">{enq.firstName}</span>
                                        <span className="date">{enq.date}</span>
                                    </div>
                                    <div className="item-meta">
                                        <span className="trip-tag">{enq.trip}</span>
                                        <span className={`status-dot ${enq.status}`}></span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            bookings.map(bk => (
                                <div key={bk.id} className={`list-item ${selectedBooking?.id === bk.id ? 'active' : ''}`} onClick={() => setSelectedBooking(bk)}>
                                    <div className="item-main">
                                        <span className="name">{bk.traveler_name}</span>
                                        <span className="date">{new Date(bk.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="item-meta">
                                        <span className="trip-tag">{bk.trips?.title}</span>
                                        <span className={`status-dot ${bk.status}`}></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                <main className="details-view">
                    {view === 'enquiries' ? (
                        selectedEnquiry ? (
                            <div className="architect-details">
                                <div className="detail-header">
                                    <div className="id-card">
                                        <div className="initials">{selectedEnquiry.firstName[0]}</div>
                                        <div>
                                            <h2>{selectedEnquiry.firstName}</h2>
                                            <p>{selectedEnquiry.email}</p>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        <span className={`status-pill ${selectedEnquiry.status}`}>{selectedEnquiry.status.replace(/_/g, ' ')}</span>
                                        <button className="btn-delete" onClick={handleDeleteEnquiry} title="Delete Lead">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="narrative-section">
                                    <h4>Traveler Message</h4>
                                    <div className="message-content">
                                        {selectedEnquiry.message || 'No additional notes provided.'}
                                    </div>
                                </div>

                                <div className="action-hub">
                                    <h4>Workflow Actions</h4>
                                    <div className="btn-group">
                                        <button className="btn-outline-dark" onClick={() => setActiveTemplate('Enquiry Received')}>Generate Acknowledgement</button>
                                        <button className="btn-outline-dark" onClick={() => setActiveTemplate('Proposal')}>Draft Proposal</button>
                                        <button className="btn-accent" onClick={() => setActiveTemplate('Confirm & Pay')}>Prepare Secure Payment</button>
                                    </div>
                                </div>

                                {activeTemplate && (
                                    <div className="template-architect">
                                        <div className="architect-header">
                                            <span>Document Template: <strong>{activeTemplate}</strong></span>
                                            <button className="btn-close" onClick={() => setActiveTemplate(null)}>×</button>
                                        </div>
                                        <div className="architect-content">
                                            <div className="preview-subject">
                                                <strong>Subject:</strong> {activeTemplate === 'Confirm & Pay' ? 'Confirm & Secure Your Bhutan Journey' : 'Your Bhutan Travel Inquiry'}
                                            </div>
                                            <div className="preview-body">
                                                Dear {selectedEnquiry.firstName},<br /><br />
                                                {activeTemplate === 'Confirm & Pay' ? 
                                                    "Thank you for confirming your journey. You can now finalize your booking via our secure payment portal below." : 
                                                    "We have received your request for a journey to Bhutan. Our team is currently reviewing your details to craft a personalized proposal."
                                                }
                                                <br /><br />
                                                Regards,<br /><strong>Staff Operations</strong>
                                            </div>
                                            <div className="architect-footer">
                                                <button className="btn-publish" onClick={() => handleSendEmail(activeTemplate)}>Commit Change & Update Status</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <div className="empty-state">Select a lead to visualize details.</div>
                    ) : (
                        selectedBooking ? (
                            <div className="architect-details">
                                <div className="detail-header">
                                    <div className="id-card">
                                        <div className="initials paid">{selectedBooking.traveler_name[0]}</div>
                                        <div>
                                            <h2>{selectedBooking.traveler_name}</h2>
                                            <p>{selectedBooking.traveler_email}</p>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        <span className={`status-pill ${selectedBooking.status}`}>{selectedBooking.status}</span>
                                        <button className="btn-delete" onClick={handleDeleteBooking} title="Delete Booking">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <label>Net Transaction</label>
                                        <div className="value">{selectedBooking.currency} ${selectedBooking.total_amount}</div>
                                        <span className="sub">{selectedBooking.payment_method} • {selectedBooking.payment_reference?.substring(0,12)}...</span>
                                    </div>
                                    <div className="stat-card">
                                        <label>Confirmed Journey</label>
                                        <div className="value">{selectedBooking.trips?.title}</div>
                                        <span className="sub">Booking ID: {selectedBooking.id.substring(0,8)}</span>
                                    </div>
                                </div>

                                {selectedBooking.status === 'paid' && (
                                    <div className="security-notice">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                        <div>
                                            <strong>Verification Complete</strong>
                                            <p>This transaction is secured. Automated confirmation and tax receipts have been dispatched.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <div className="empty-state">Select a confirmed booking for insights.</div>
                    )}
                </main>
            </div>

            <style jsx>{`
                .dashboard-container {
                    padding: 40px 0;
                }
                .admin-page-header h1 {
                    font-size: 32px;
                    margin: 0;
                }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
                }
                .staff-profile {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .staff-info { text-align: right; }
                .role-tag {
                    display: block;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 800;
                    color: #008080;
                    margin-bottom: 4px;
                }
                .email { font-size: 13px; font-weight: 700; color: #111; }

                .dashboard-layout {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 60px;
                    height: calc(100vh - 250px);
                }

                @media (max-width: 1200px) {
                    .dashboard-layout {
                        gap: 30px;
                        grid-template-columns: 280px 1fr;
                    }
                }

                @media (max-width: 900px) {
                    .dashboard-layout {
                        display: flex;
                        flex-direction: column;
                        height: auto;
                        gap: 40px;
                    }
                    .view-selector {
                        max-height: 400px;
                    }
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                    .staff-info {
                        text-align: left;
                    }
                }

                .view-selector {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    overflow: hidden;
                }
                .switcher {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    background: #f9f9f9;
                    padding: 8px;
                    border-radius: 12px;
                }
                .switcher button {
                    padding: 12px 15px;
                    border: none;
                    background: none;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #888;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.2s;
                }
                .switcher button.active { background: white; color: #111; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .count { font-size: 10px; background: #eee; padding: 2px 8px; border-radius: 10px; color: #666; }
                .active .count { background: #111; color: white; }

                .item-list {
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    padding-right: 10px;
                }
                .list-item {
                    padding: 18px;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .list-item:hover { background: #fdfdfd; border-color: #d4c8b0; }
                .list-item.active { border-color: #111; background: #fafafa; }
                .item-main { display: flex; justify-content: space-between; margin-bottom: 8px; }
                .name { font-weight: 700; font-size: 14px; color: #111; }
                .date { font-size: 11px; color: #bbb; }
                .item-meta { display: flex; justify-content: space-between; align-items: center; }
                .trip-tag { font-size: 10px; color: #888; font-weight: 600; }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; }
                .status-dot.new { background: #ff4d4f; box-shadow: 0 0 8px rgba(255,77,79,0.5); }
                .status-dot.proposed { background: #faad14; }
                .status-dot.paid { background: #52c41a; }

                .details-view {
                    background: white;
                    border: 1px solid #ebebeb;
                    border-radius: 20px;
                    padding: 50px;
                    overflow-y: auto;
                }
                @media (max-width: 640px) {
                    .details-view {
                        padding: 30px 20px;
                    }
                    .detail-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 15px;
                    }
                }
                .architect-details { max-width: 800px; }
                .detail-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #f5f5f5;
                }
                .id-card { display: flex; gap: 20px; align-items: center; }
                .initials {
                    width: 50px;
                    height: 50px;
                    background: #fdfcf9;
                    border: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                    font-weight: 700;
                    border-radius: 12px;
                    color: #d4c8b0;
                }
                .initials.paid { background: #e6fffa; color: #008080; border-color: #b2f5ea; }
                .id-card h2 { font-family: var(--font-playfair), serif; font-size: 24px; margin: 0; }
                .id-card p { font-size: 13px; color: #888; margin: 4px 0 0; }
                .status-pill {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 6px 14px;
                    border-radius: 20px;
                    background: #f5f5f5;
                    color: #999;
                }
                .status-pill.new { background: #fff1f0; color: #cf1322; }
                .status-pill.paid { background: #e6f7ff; color: #008080; }

                .narrative-section { margin-bottom: 40px; }
                .narrative-section h4, .action-hub h4 {
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 900;
                    color: #d4c8b0;
                    margin-bottom: 20px;
                }
                .message-content {
                    background: #fdfcf9;
                    padding: 30px;
                    border-radius: 12px;
                    font-size: 15px;
                    line-height: 1.7;
                    color: #444;
                    border: 1px solid #f5f2eb;
                }

                .btn-group { display: flex; gap: 12px; }
                @media (max-width: 640px) {
                    .btn-group {
                        flex-direction: column;
                    }
                    .btn-accent, .btn-outline-dark {
                        width: 100%;
                    }
                }
                .btn-outline-dark {
                    padding: 12px 20px;
                    border: 1px solid #111;
                    background: white;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-outline-dark:hover { background: #111; color: white; }
                .btn-accent {
                    padding: 12px 25px;
                    background: #008080;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                }

                .template-architect {
                    margin-top: 50px;
                    border: 1px solid #d4c8b0;
                    border-radius: 16px;
                    background: #fdfcf9;
                    overflow: hidden;
                }
                .architect-header {
                    padding: 12px 20px;
                    background: #fff;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 11px;
                    text-transform: uppercase;
                    color: #999;
                }
                .btn-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #ccc; }
                .architect-content { padding: 30px; }
                .preview-subject { font-size: 14px; margin-bottom: 20px; border-bottom: 1px solid #f5f2eb; padding-bottom: 15px; }
                .preview-body { font-family: serif; font-size: 16px; line-height: 1.6; color: #333; }
                .architect-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #f5f2eb; }
                .btn-publish {
                    padding: 10px 25px;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
                @media (max-width: 640px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .stat-card { padding: 25px; background: #fcfcfc; border: 1px solid #eee; border-radius: 12px; }
                .stat-card label { display: block; font-size: 10px; text-transform: uppercase; color: #aaa; margin-bottom: 10px; font-weight: 800; }
                .stat-card .value { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
                .stat-card .sub { font-size: 11px; color: #999; }

                .security-notice {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    padding: 20px;
                    background: #e6f7f7;
                    border-radius: 12px;
                    color: #008080;
                }
                .security-notice strong { display: block; font-size: 13px; }
                .security-notice p { font-size: 12px; margin: 4px 0 0; }

                .admin-loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px;
                    color: #888;
                }
                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 2px solid rgba(0,0,0,0.05);
                    border-top-color: #d4c8b0;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .btn-delete {
                    background: none;
                    border: 1px solid #f5f5f5;
                    color: #ff4d4f;
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-delete:hover {
                    background: #fff1f0;
                    border-color: #ffa39e;
                }

                .empty-state { padding: 100px; text-align: center; color: #ccc; font-size: 15px; }
            `}</style>
        </div>
    );
}
