'use client';

import Link from 'next/link';

// Professional SVG Icons - Reverted to White strokes for the black boxes
const CardIcons = {
    Trips: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Destinations: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Insights: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.256 1.181-3.125.355-.393.528-.54.319-1.238-.388-1.296-1.26-1.28-1.5-1.137C8.5 10.5 8 11.5 8 13.5c0 1 .5 1.5.5 1.5z"></path></svg>,
    Messages: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
    Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Settings: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
    Import: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6" y2="6"></line><line x1="6" y1="18" x2="6" y2="18"></line></svg>
};

export default function DevCMSDashboard() {
    const stats = [
        { label: 'Trips', count: 6, icon: CardIcons.Trips, href: '/dev-cms/trips' },
        { label: 'Destinations', count: 10, icon: CardIcons.Destinations, href: '/dev-cms/destinations' },
        { label: 'Insights', count: 6, icon: CardIcons.Insights, href: '/dev-cms/blog' },
        { label: 'Enquiries', count: 0, icon: CardIcons.Messages, href: '/dev-cms/enquiries' },
    ];

    const quickActions = [
        { label: 'New Insights Post', sub: 'Write an article', icon: CardIcons.Plus, href: '/dev-cms/blog' },
        { label: 'Add Trip Package', sub: 'Showcase adventure', icon: CardIcons.Plus, href: '/dev-cms/trips' },
        { label: 'Add Destination', sub: 'Manage Valleys', icon: CardIcons.Plus, href: '/dev-cms/destinations' },
        { label: 'Site Settings', sub: 'Manage site text & media', icon: CardIcons.Settings, href: '/dev-cms/settings' },
    ];

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Dashboard</h1>
                <p style={{ fontSize: '18px', color: '#888', fontWeight: '400' }}>Manage your content and site data.</p>
            </div>

            {/* Stats Cards Row - Reverting to the black background squares */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px', marginBottom: '80px' }}>
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card" style={{ padding: '30px', background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
                                {stat.icon()}
                            </div>
                            <span style={{ position: 'absolute', top: '35px', right: '30px', fontSize: '18px', color: '#ccc' }}>→</span>
                            <div style={{ fontSize: '38px', fontWeight: '900', marginBottom: '5px' }}>{stat.count}</div>
                            <div style={{ fontSize: '10px', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', marginBottom: '30px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '25px' }}>
                    {quickActions.map((action, i) => (
                        <Link key={i} href={action.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ padding: '30px', background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', cursor: 'pointer' }}>
                                <div style={{ fontSize: '14px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>{action.icon()}</span> {action.label}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', fontWeight: '400' }}>{action.sub}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '25px' }}>
                <div className="card" style={{ padding: '30px', background: 'white', border: '1px solid #eaeaea', borderRadius: '8px', width: '25%', minWidth: '280px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '14px', fontWeight: '900', color: '#111', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <span style={{ display: 'flex', alignItems: 'center' }}><CardIcons.Import /></span> Import Data
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', fontWeight: '400' }}>Manage static imports</div>
                </div>
            </div>
        </div>
    );
}
