'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

// Clean SVG Icons for the full suite
const Icons = {
    Dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    Trips: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Destinations: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Insights: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    Messages: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    FAQ: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Back: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    SignOut: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Import: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
};

export default function DevCMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { isStaff, loading, user, supabaseConfigured } = useAuth();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        if (!loading && !isStaff) {
            console.log(`[DevCMSLayout] Unauthorized access attempt. Redirecting...`);
            router.push('/admin/login');
        }
    }, [isStaff, loading, router]);

    if (!supabaseConfigured && !loading && hasMounted) {
        return <div style={{ padding: '40px', color: 'red' }}>Repository not configured. Please check environment variables.</div>;
    }

    if (!hasMounted || loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontFamily: 'var(--font-lato), sans-serif',
                background: '#f8f9fa'
            }}>
                Initializing Dev Suite...
            </div>
        );
    }

    if (!isStaff) return null;

    const menuItems = [
        { label: 'Dashboard', href: '/dev-cms', icon: Icons.Dashboard },
        { label: 'Trips & Packages', href: '/dev-cms/trips', icon: Icons.Trips },
        { label: 'Destinations', href: '/dev-cms/destinations', icon: Icons.Destinations },
        { label: 'Insights (Blog)', href: '/dev-cms/blog', icon: Icons.Insights },
        { label: 'Travel FAQs', href: '/dev-cms/faq', icon: Icons.FAQ },
        { label: 'Messages', href: '/dev-cms/enquiries', icon: Icons.Messages },
        { label: 'Import Data', href: '/dev-cms/import', icon: Icons.Import },
        { label: 'Site Settings', href: '/dev-cms/settings', icon: Icons.Settings },
    ];

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#f8f9fa',
            fontFamily: 'var(--font-lato), sans-serif',
            color: '#1a1a1a'
        }}>
            {/* Dark Sidebar */}
            <aside style={{
                width: '260px',
                background: '#121212',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 100
            }}>
                <div style={{ padding: '30px 25px', marginBottom: '20px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'white'
                    }}>Saidpiece Admin</h2>
                </div>

                <nav style={{ flex: 1, padding: '0 15px' }}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px 15px',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                color: pathname === item.href ? '#fff' : '#888',
                                background: pathname === item.href ? '#222' : 'transparent',
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '5px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon()}</span>
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            padding: '12px 15px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            color: '#888',
                            fontSize: '14px',
                            fontWeight: '500',
                            marginTop: '20px'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}><Icons.Back /></span>
                        Back to Site
                    </Link>
                </nav>

                {/* Profile Section */}
                <div style={{
                    padding: '25px',
                    borderTop: '1px solid #222',
                    background: '#0a0a0a'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <div style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            background: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#888'
                        }}>
                            {user?.email?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 'bold', margin: 0, color: 'white' }}>{user?.email?.split('@')[0] || 'guruwangchuk'}</p>
                            <p style={{ fontSize: '10px', color: '#666', margin: 0 }}>Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ marginLeft: '260px', flex: 1, padding: '50px 60px' }}>
                <div style={{
                    background: '#fff9e6',
                    padding: '12px 25px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: '#8b6e1b',
                    marginBottom: '40px',
                    border: '1px solid #e5d29a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <strong>🔒 Unlocked Dev Mode:</strong> Managing all pages & content dynamically.
                </div>
                {children}
            </main>

            <style jsx global>{`
                h1, h2, h3, h4 { font-family: var(--font-lato), sans-serif; font-weight: 900; }
                .card { background: white; border: 1px solid #eaeaea; border-radius: 8px; transition: transform 0.2s, box-shadow 0.2s; }
                .card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                input, textarea, select { font-family: var(--font-lato), sans-serif; }
            `}</style>
        </div>
    );
}
