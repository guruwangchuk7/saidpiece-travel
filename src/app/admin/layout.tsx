'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Icons = {
    Enquiries: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    Trips: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Destinations: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Blog: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
    FAQ: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Import: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isStaff, loading, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Protection logic
    useEffect(() => {
        if (!loading && !isStaff && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isStaff, loading, pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return <div className="admin-loading">Loading Admin Panel...</div>;
    }

    if (!isStaff) {
        return null; // Will redirect via useEffect
    }

    const menuItems = [
        { label: 'Booking Enquiries', href: '/admin/enquiries', icon: Icons.Enquiries },
        { label: 'Manage Trips', href: '/admin/trips', icon: Icons.Trips },
        { label: 'Destinations', href: '/admin/destinations', icon: Icons.Destinations },
        { label: 'Blog Posts', href: '/admin/blog', icon: Icons.Blog },
        { label: 'Travel FAQs', href: '/admin/faq', icon: Icons.FAQ },
        { label: 'Import Data', href: '/admin/import', icon: Icons.Import },
        { label: 'Site Settings', href: '/admin/settings', icon: Icons.Settings },
    ];

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Link href="/">
                        <span className="serif-title">Saidpiece</span>
                        <span className="admin-label">Admin Management Portal</span>
                    </Link>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon"><item.icon /></span>
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => signOut()} className="btn-logout">
                        Logout
                    </button>
                    <Link href="/" className="btn-view-site">View Website</Link>
                </div>
            </aside>
            <main className="admin-main-content">
                {children}
            </main>

            <style jsx>{`
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                    background: #fdfcf9;
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
                }
                .sidebar-brand {
                    padding: 40px 25px;
                    border-bottom: 1px solid #333;
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
                .admin-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                    background: #fdfcf9;
                }
            `}</style>
        </div>
    );
}
