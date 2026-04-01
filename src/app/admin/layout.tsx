'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
        { label: 'Booking Enquiries', href: '/admin/enquiries', icon: '📩' },
        { label: 'Manage Trips', href: '/admin/trips', icon: '✈️' },
        { label: 'Destinations', href: '/admin/destinations', icon: '🗺️' },
        { label: 'Testimonials', href: '/admin/testimonials', icon: '💬' },
        { label: 'Blog Posts', href: '/admin/blogs', icon: '✍️' },
        { label: 'Site Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <Link href="/">
                        <span className="serif-title">Saidpiece</span> Admin
                    </Link>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{item.icon}</span>
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
                    background: #f8f9fa;
                }
                .admin-sidebar {
                    width: 280px;
                    background: #1a1a1a;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
                    position: sticky;
                    top: 0;
                    height: 100vh;
                }
                .sidebar-brand {
                    padding: 30px;
                    font-size: 20px;
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
                }
                .sidebar-nav {
                    flex: 1;
                    padding: 20px 0;
                }
                .nav-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 30px;
                    color: #ccc;
                    text-decoration: none;
                    transition: all 0.2s;
                    gap: 12px;
                }
                .nav-item:hover {
                    color: white;
                    background: #333;
                }
                .nav-item.active {
                    color: white;
                    background: #008080;
                    border-right: 4px solid #d4c8b0;
                }
                .nav-icon {
                    font-size: 18px;
                }
                .sidebar-footer {
                    padding: 20px 30px;
                    border-top: 1px solid #333;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .btn-logout {
                    background: none;
                    border: 1px solid #666;
                    color: #999;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                }
                .btn-logout:hover {
                    color: white;
                    border-color: white;
                }
                .btn-view-site {
                    text-align: center;
                    font-size: 12px;
                    color: #888;
                    text-decoration: none;
                }
                .admin-main-content {
                    flex: 1;
                    padding: 40px;
                    background: #fdfcf9;
                    overflow-y: auto;
                }
                .admin-loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    font-family: var(--font-playfair), serif;
                    font-size: 20px;
                }
            `}</style>
        </div>
    );
}
