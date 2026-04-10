'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

const TripIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20M2 12h20"></path></svg>;
const InsightsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path></svg>;
const MessagesIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v5"></path></svg>;
const DestinationsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>;
const FAQIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path></svg>;
const SyncIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>;
const SettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33"></path></svg>;

export default function ArchitectDashboard() {
    const { isStaff } = useAuth();
    const [counts, setCounts] = useState({ trips: 0, blog: 0, dests: 0, msgs: 0, faqs: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isStaff) fetchCounts();
    }, [isStaff]);

    const fetchCounts = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const [trips, blog, dests, enquiries, faqs] = await Promise.all([
                supabase.from('trips').select('*', { count: 'exact', head: true }),
                supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
                supabase.from('destinations').select('*', { count: 'exact', head: true }),
                supabase.from('enquiries').select('*', { count: 'exact', head: true }),
                supabase.from('faqs').select('*', { count: 'exact', head: true })
            ]);

            setCounts({
                trips: trips.count || 0,
                blog: blog.count || 0,
                dests: dests.count || 0,
                msgs: enquiries.count || 0,
                faqs: faqs.count || 0
            });
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
    ];

    return (
        <div className="admin-dashboard-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Saidpiece Architect</h1>
                    <p className="subtitle">Central command for Bhutanese travel infrastructure.</p>
                </div>
                <button className="btn-sync" onClick={fetchCounts}>
                    <SyncIcon />
                    <span>Sync Repository</span>
                </button>
            </header>

            <div className="dashboard-grid">
                {modules.map((mod, i) => (
                    <Link key={i} href={mod.href} className="dash-card">
                        <div className="card-header">
                            <span className="category-tag">{mod.cat}</span>
                            <div className="icon-badge"><mod.icon /></div>
                        </div>
                        <div className="card-body">
                            <h3 className="card-stat">{loading ? '...' : mod.count}</h3>
                            <p className="card-label">{mod.label}</p>
                        </div>
                        <div className="card-footer">
                            <span>Manage Module</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </div>
                    </Link>
                ))}

                <Link href="/admin/import" className="dash-card maintenance-card">
                    <div className="card-header">
                        <span className="category-tag">System</span>
                        <div className="icon-badge dark"><SyncIcon /></div>
                    </div>
                    <div className="card-body">
                        <h3 className="card-title">Sync Manager</h3>
                        <p className="card-description">Reconcile local cache with master repository.</p>
                    </div>
                    <div className="card-footer">
                        <span>Initialize Recovery</span>
                        <div className="status-dot"></div>
                    </div>
                </Link>

                <Link href="/admin/settings" className="dash-card maintenance-card">
                    <div className="card-header">
                        <span className="category-tag">Identity</span>
                        <div className="icon-badge dark"><SettingsIcon /></div>
                    </div>
                    <div className="card-body">
                        <h3 className="card-title">Site Settings</h3>
                        <p className="card-description">Manage global variables and brand identity.</p>
                    </div>
                    <div className="card-footer">
                        <span>Edit Configuration</span>
                        <div className="status-dot"></div>
                    </div>
                </Link>
            </div>

            <style jsx>{`
                .admin-dashboard-container {
                    padding: 40px 0;
                }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                    .btn-sync {
                        width: 100%;
                        justify-content: center;
                    }
                }
                .admin-page-header h1 {
                    font-size: 32px;
                    margin: 0;
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
                }
                .btn-sync {
                    background: white;
                    border: 1px solid #eee;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-sync:hover {
                    border-color: #111;
                    color: #111;
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 25px;
                }
                @media (max-width: 400px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .dash-card {
                    background: white;
                    border: 1.5px solid #dcd8cd;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }
                .dash-card:hover {
                    border-color: #d4c8b0;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.06);
                    transform: translateY(-4px);
                }
                .card-header {
                    padding: 20px 25px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f7f5f0;
                }
                .category-tag {
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: #f9f9f9;
                    color: #999;
                    padding: 3px 8px;
                    border-radius: 4px;
                }
                .icon-badge {
                    width: 36px;
                    height: 36px;
                    background: #fdfcf9;
                    border: 1px solid #f5f2eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #d4c8b0;
                }
                .icon-badge.dark {
                    background: #1a1a1a;
                    color: #d4c8b0;
                    border-color: #1a1a1a;
                }
                .card-body {
                    padding: 20px 25px 30px;
                    flex-grow: 1;
                }
                .card-stat {
                    font-family: var(--font-playfair), serif;
                    font-size: 42px;
                    margin: 0 0 5px;
                    font-weight: 800;
                }
                .card-label {
                    font-size: 14px;
                    font-weight: 700;
                    color: #111;
                    margin: 0;
                }
                .card-title {
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                    margin: 0 0 10px;
                }
                .card-description {
                    font-size: 13px;
                    color: #888;
                    margin: 0;
                    line-height: 1.5;
                }
                .card-footer {
                    padding: 15px 25px;
                    border-top: 1px solid #f7f5f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #bbb;
                    transition: color 0.2s;
                }
                .dash-card:hover .card-footer {
                    color: #d4c8b0;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #52c41a;
                    border-radius: 50%;
                }
                .maintenance-card {
                    background: #fdfcf9;
                    border-style: dashed;
                }
            `}</style>
        </div>
    );
}
