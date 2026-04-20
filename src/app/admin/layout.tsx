'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NavDashboardIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
const NavEnquiriesIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const NavTripsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const NavDestinationsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const NavBlogIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>;
const NavFAQIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const NavImportIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const NavSettingsIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const NavMenuIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const NavCloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isStaff, loading, signOut, supabaseConfigured } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    const menuItems = [
        { label: 'Architect Home', href: '/admin', icon: NavDashboardIcon },
        { label: 'Booking Enquiries', href: '/admin/enquiries', icon: NavEnquiriesIcon },
        { label: 'Manage Trips', href: '/admin/trips', icon: NavTripsIcon },
        { label: 'Destinations', href: '/admin/destinations', icon: NavDestinationsIcon },
        { label: 'Blog Posts', href: '/admin/blog', icon: NavBlogIcon },
        { label: 'Travel FAQs', href: '/admin/faq', icon: NavFAQIcon },
        { label: 'Import Data', href: '/admin/import', icon: NavImportIcon },
        { label: 'Site Settings', href: '/admin/settings', icon: NavSettingsIcon },
    ];

    // Track last known state for debugging
    useEffect(() => {
        setHasMounted(true);
        if (!loading && isStaff) {
            localStorage.setItem('last_known_role', 'staff');
        }
    }, [loading, isStaff]);

    // Close sidebar on navigation
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    // Boundary check for missing configuration
    if (!supabaseConfigured && !loading) {
        return <div className="admin-error">Repository not configured. Please check environment variables.</div>;
    }

    // Login page bypasses the admin layout structure
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="admin-container">
            {/* Mobile Header (Hidden during loading) */}
            <header className="admin-mobile-header">
                {!loading && (
                    <>
                        <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                            <NavMenuIcon />
                        </button>
                        <div className="mobile-brand">
                            <span className="serif-title">Saidpiece</span>
                        </div>
                        <div style={{ width: 24 }}></div> {/* Spacer */}
                    </>
                )}
            </header>

            {/* Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            <aside className={`admin-sidebar ${loading ? '' : (isSidebarOpen ? 'show' : '')}`}>
                <div className="sidebar-brand">
                    <div className="brand-header">
                        <Link href="/">
                            <span className="serif-title">Saidpiece</span>
                            <span className="admin-label">Admin Management Portal</span>
                        </Link>
                        {!loading && (
                            <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
                                <NavCloseIcon />
                            </button>
                        )}
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {loading ? (
                        menuItems.map((item, idx) => (
                            <div key={idx} className="nav-item skeleton-item">
                                <div className="skeleton-icon"></div>
                                <div className="skeleton-text" style={{ width: idx % 2 === 0 ? '60%' : '45%' }}></div>
                            </div>
                        ))
                    ) : (
                        menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                            >
                                <span className="nav-icon"><item.icon /></span>
                                <span className="nav-label">{item.label}</span>
                            </Link>
                        ))
                    )}
                </nav>
                {!loading && (
                    <div className="sidebar-footer">
                        <button onClick={() => signOut()} className="btn-logout">
                            Logout
                        </button>
                        <Link href="/" className="btn-view-site">View Website</Link>
                    </div>
                )}
            </aside>

            <main className="admin-main-content">
                {loading ? (
                    <div className="skeleton-dashboard">
                        <div className="skeleton-header"></div>
                        <div className="skeleton-grid">
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
                        </div>
                        <div className="skeleton-table"></div>
                    </div>
                ) : (
                    children
                )}
            </main>

            <style jsx>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background: #fdfcf9;
                }
                .admin-mobile-header {
                    display: none;
                }
                .admin-sidebar {
                    width: 260px;
                    background: #1a1a1a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 4px 0 15px rgba(0,0,0,0.2);
                    position: fixed;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    height: 100vh;
                    z-index: 1000;
                    transition: transform 0.3s ease;
                }
                .sidebar-brand {
                    padding: 40px 25px;
                    border-bottom: 1px solid #333;
                }
                .brand-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .sidebar-close-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    padding: 0;
                }
                .sidebar-brand a {
                    color: white;
                    text-decoration: none;
                }
                .sidebar-brand .serif-title {
                    font-family: var(--font-playfair), serif;
                    font-weight: 700;
                    color: #d4c8b0;
                    font-size: 24px;
                    display: block;
                }
                .sidebar-brand .admin-label {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #666;
                    margin-top: 5px;
                    display: block;
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                }
                :global(.nav-item) {
                    display: flex !important;
                    align-items: center;
                    padding: 14px 25px !important;
                    color: #999 !important;
                    text-decoration: none;
                    transition: all 0.2s;
                    gap: 12px;
                    font-size: 14px;
                }
                :global(.nav-item:hover) {
                    color: white !important;
                    background: #252525;
                }
                :global(.nav-item.active) {
                    color: white !important;
                    background: #008080;
                    border-left: 4px solid #d4c8b0;
                }
                .nav-icon {
                    font-size: 16px;
                    min-width: 24px;
                }
                .sidebar-footer {
                    padding: 25px;
                    border-top: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: #111;
                }
                .btn-logout {
                    background: #222;
                    border: 1px solid #333;
                    color: #888;
                    padding: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                .btn-logout:hover {
                    color: white;
                    border-color: #666;
                    background: #333;
                }
                .btn-view-site {
                    text-align: center;
                    font-size: 12px;
                    color: #777;
                    text-decoration: none;
                }
                .admin-main-content {
                    flex: 1;
                    margin-left: 260px;
                    padding: 60px 80px;
                    background: #fdfcf9;
                    min-height: 100vh;
                }
                .admin-loading-container, .admin-redirecting, .admin-error {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    width: 100vw;
                    position: fixed;
                    top: 0;
                    left: 0;
                    background: #fdfcf9;
                    z-index: 9999;
                    font-family: var(--font-playfair), serif;
                }
                .admin-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(212, 200, 176, 0.2);
                    border-top: 3px solid #d4c8b0;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .admin-error {
                    color: #cf1322;
                    text-align: center;
                    padding: 40px;
                }

                /* Skeleton Loader Styles */
                .skeleton-item {
                    opacity: 0.7;
                    cursor: default;
                }
                .skeleton-icon {
                    width: 18px;
                    height: 18px;
                    background: #333;
                    border-radius: 4px;
                }
                .skeleton-text {
                    height: 12px;
                    background: #333;
                    border-radius: 2px;
                }
                .skeleton-dashboard {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .skeleton-header {
                    height: 40px;
                    width: 300px;
                    background: #eee;
                    border-radius: 4px;
                    margin-bottom: 40px;
                    animation: skeleton-pulse 1.5s infinite ease-in-out;
                }
                .skeleton-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 30px;
                    margin-bottom: 40px;
                }
                .skeleton-card {
                    height: 140px;
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    animation: skeleton-pulse 1.5s infinite ease-in-out;
                }
                .skeleton-table {
                    height: 400px;
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    animation: skeleton-pulse 1.5s infinite ease-in-out;
                }

                @keyframes skeleton-pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                @media (max-width: 1024px) {
                    .admin-main-content {
                        padding: 40px;
                    }
                }

                @media (max-width: 768px) {
                    .admin-mobile-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 20px;
                        height: 60px;
                        background: #1a1a1a;
                        color: white;
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        z-index: 999;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .menu-toggle {
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        padding: 0;
                    }
                    .mobile-brand .serif-title {
                        font-family: var(--font-playfair), serif;
                        font-weight: 700;
                        color: #d4c8b0;
                        font-size: 20px;
                    }
                    .admin-sidebar {
                        transform: translateX(-100%);
                        box-shadow: none;
                    }
                    .admin-sidebar.show {
                        transform: translateX(0);
                        box-shadow: 10px 0 30px rgba(0,0,0,0.5);
                    }
                    .sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0,0,0,0.5);
                        z-index: 998;
                        backdrop-filter: blur(2px);
                    }
                    .sidebar-close-btn {
                        display: block;
                    }
                    .admin-main-content {
                        margin-left: 0;
                        padding: 100px 20px 40px;
                    }
                }
            `}</style>
        </div>
    );
}
