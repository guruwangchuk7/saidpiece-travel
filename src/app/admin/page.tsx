'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

// --- Premium Architectural Icons ---
const TripIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const InsightsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const MessagesIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const DestinationsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FAQIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const SyncIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>;
const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1.51-1H11a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1-1.51H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.51-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1 1.51H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const ServiceIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const TestimonialIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><path d="M8 9h8"></path><path d="M8 13h6"></path></svg>;

export default function ArchitectDashboard() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [counts, setCounts] = useState({
        trips: 0, blog: 0, dests: 0, msgs: 0, faqs: 0,
        testimonials: 0, services: 0, styles: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isStaff) {
            fetchCounts();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchCounts = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const [trips, blog, dests, enquiries, faqs, testimonials, services, styles] = await Promise.all([
                supabase.from('trips').select('*', { count: 'exact', head: true }),
                supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
                supabase.from('destinations').select('*', { count: 'exact', head: true }),
                supabase.from('enquiries').select('*', { count: 'exact', head: true }),
                supabase.from('faqs').select('*', { count: 'exact', head: true }),
                supabase.from('testimonials').select('*', { count: 'exact', head: true }),
                supabase.from('homepage_services').select('*', { count: 'exact', head: true }),
                supabase.from('travel_styles').select('*', { count: 'exact', head: true })
            ]);

            setCounts({
                trips: trips.count || 0,
                blog: blog.count || 0,
                dests: dests.count || 0,
                msgs: enquiries.count || 0,
                faqs: faqs.count || 0,
                testimonials: testimonials.count || 0,
                services: services.count || 0,
                styles: styles.count || 0
            });
            router.refresh();
        } catch (e) {
            console.error('Failed to sync dashboard telemetry:', e);
        } finally {
            setLoading(false);
        }
    };

    const modules = [
        { label: 'Trips & Packages', count: counts.trips, icon: TripIcon, href: '/admin/trips', cat: 'Inventory' },
        { label: 'Travel Insights', count: counts.blog, icon: InsightsIcon, href: '/admin/blog', cat: 'Publications' },
        { label: 'Region Manager', count: counts.dests, icon: DestinationsIcon, href: '/admin/destinations', cat: 'Geography' },
        { label: 'Knowledge Base', count: counts.faqs, icon: FAQIcon, href: '/admin/faq', cat: 'FAQS' },
        { label: 'Enquiry Center', count: counts.msgs, icon: MessagesIcon, href: '/admin/enquiries', cat: 'Communication' },
        { label: 'Social Proof', count: counts.testimonials, icon: TestimonialIcon, href: '/admin/testimonials', cat: 'Reputation' },
        { label: 'Service Blocks', count: counts.services, icon: ServiceIcon, href: '/admin/services', cat: 'Page Blocks' },
        { label: 'Travel Styles', count: counts.styles, icon: TripIcon, href: '/admin/travel-styles', cat: 'Page Blocks' },
    ];

    return (
        <div className="architect-bg">
            <div className="admin-dashboard-container">
                <header className="admin-page-header">
                    <div className="header-titles">
                        <div className="brand-accent">Saidpiece Architect</div>
                        <h1 className="serif-title">Central Command</h1>
                        <p className="subtitle">Orchestrating the premium infrastructure of Bhutanese travel.</p>
                    </div>
                    <div className="header-actions">
                        <button className="btn-sync-glass" onClick={fetchCounts}>
                            <SyncIcon />
                            <span>Sync Telemetry</span>
                        </button>
                    </div>
                </header>

                <div className="dashboard-grid">
                    {modules.map((mod, i) => (
                        <Link key={i} href={mod.href} className="dash-card-premium">
                            <div className="card-inner">
                                <div className="card-top">
                                    <span className="category-label">{mod.cat}</span>
                                    <div className="icon-wrap"><mod.icon /></div>
                                </div>
                                <div className="card-mid">
                                    <h3 className="stat-number">{loading ? '...' : mod.count}</h3>
                                    <p className="stat-label">{mod.label}</p>
                                </div>
                                <div className="card-bottom">
                                    <span>Manage Module</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>

                <style jsx>{`
                    .architect-bg {
                        min-height: 100vh;
                        background: radial-gradient(circle at 0% 0%, #fdfcf9 0%, #f5f2eb 100%);
                        padding-bottom: 80px;
                    }
                    .admin-dashboard-container {
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 60px 20px;
                    }
                    
                    .admin-page-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-bottom: 60px;
                    }
                    .brand-accent {
                        font-size: 11px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 3px;
                        color: #d4c8b0;
                        margin-bottom: 10px;
                    }
                    .admin-page-header h1 {
                        font-size: 48px;
                        margin: 0;
                        line-height: 1;
                        color: #1a1a1a;
                    }
                    .subtitle {
                        color: #888;
                        font-size: 16px;
                        margin-top: 10px;
                        max-width: 500px;
                    }

                    .btn-sync-glass {
                        background: rgba(255, 255, 255, 0.6);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(212, 200, 176, 0.3);
                        padding: 12px 24px;
                        border-radius: 100px;
                        font-size: 11px;
                        font-weight: 700;
                        text-transform: uppercase;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        color: #7c6f55;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .btn-sync-glass:hover {
                        background: white;
                        border-color: #d4c8b0;
                        transform: translateY(-2px);
                        box-shadow: 0 10px 30px rgba(212, 200, 176, 0.2);
                    }

                    /* Premium Grid */
                    .dashboard-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                        gap: 24px;
                    }

                    .dash-card-premium {
                        text-decoration: none;
                        color: inherit;
                        perspective: 1000px;
                    }
                    .card-inner {
                        background: white;
                        border: 1px solid #e8e4db;
                        border-radius: 20px;
                        padding: 30px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                        position: relative;
                        overflow: hidden;
                    }
                    .dash-card-premium:hover .card-inner {
                        border-color: #d4c8b0;
                        transform: translateY(-8px);
                        box-shadow: 0 20px 40px rgba(212, 200, 176, 0.15);
                    }
                    .card-top {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 40px;
                    }
                    .category-label {
                        font-size: 9px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                        color: #b0a68d;
                    }
                    .icon-wrap {
                        width: 44px;
                        height: 44px;
                        background: #fdfcf9;
                        border: 1px solid #f2ede4;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #d4c8b0;
                        transition: all 0.3s;
                    }
                    .dash-card-premium:hover .icon-wrap {
                        background: #111;
                        color: white;
                        border-color: #111;
                    }
                    
                    .card-mid {
                        flex-grow: 1;
                    }
                    .stat-number {
                        font-family: var(--font-playfair), serif;
                        font-size: 56px;
                        font-weight: 900;
                        margin: 0;
                        color: #1a1a1a;
                        line-height: 1;
                    }
                    .stat-label {
                        font-size: 15px;
                        font-weight: 600;
                        color: #666;
                        margin-top: 8px;
                    }

                    .card-bottom {
                        margin-top: 30px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 10px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        color: #d4c8b0;
                        opacity: 0;
                        transform: translateX(-10px);
                        transition: all 0.3s;
                    }
                    .dash-card-premium:hover .card-bottom {
                        opacity: 1;
                        transform: translateX(0);
                    }

                    @media (max-width: 768px) {
                        .admin-page-header h1 { font-size: 36px; }
                        .dashboard-grid { grid-template-columns: 1fr; }
                    }
                `}</style>
            </div>
        </div>
    );
}
