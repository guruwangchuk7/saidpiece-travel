'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Icons = {
    Trips: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20M2 12h20"></path></svg>,
    Insights: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path></svg>,
    Messages: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1-2-0 2-2z"></path></svg>,
    Destinations: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path></svg>,
    FAQ: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path></svg>,
    Import: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33"></path></svg>,
};

export default function PermanentMasterDashboard() {
    const [counts, setCounts] = useState({ trips: 0, blog: 0, dests: 0, msgs: 0, faqs: 0 });

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchRaw = async (table: string) => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        try {
            const res = await fetch(`${url}/rest/v1/${table}?select=id`, {
                headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
            });
            const data = await res.json();
            return Array.isArray(data) ? data.length : 0;
        } catch (e) { return 0; }
    };

    const fetchCounts = async () => {
        const t = await fetchRaw('trips');
        const b = await fetchRaw('blog_posts');
        const d = await fetchRaw('destinations');
        const m = await fetchRaw('enquiries');
        const f = await fetchRaw('faqs');
        setCounts({ trips: t, blog: b, dests: d, msgs: m, faqs: f });
    };

    const mainStats = [
        { label: 'Trips & Packages', count: counts.trips, icon: Icons.Trips, href: '/dev-cms/trips' },
        { label: 'Insights (Blog)', count: counts.blog, icon: Icons.Insights, href: '/dev-cms/blog' },
        { label: 'Destinations', count: counts.dests, icon: Icons.Destinations, href: '/dev-cms/destinations' },
        { label: 'Travel FAQs', count: counts.faqs, icon: Icons.FAQ, href: '/dev-cms/faq' },
        { label: 'Messages', count: counts.msgs, icon: Icons.Messages, href: '/dev-cms/enquiries' },
    ];

    const maintenanceModules = [
        { label: 'Import Content', icon: Icons.Import, href: '/dev-cms/import', sub: 'Recovery Bridge' },
        { label: 'Site Settings', icon: Icons.Settings, href: '/dev-cms/settings', sub: 'Global Meta Info' },
    ];

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Saidpiece Admin</h1>
                <p style={{ fontSize: '18px', color: '#888', fontWeight: '400' }}>Full Architectural CMS Management Hub.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '80px' }}>
                {mainStats.map((stat, i) => (
                    <Link key={i} href={stat.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card" style={{ padding: '30px', background: 'white', border: '1px solid #eaeaea', borderRadius: '12px', cursor: 'pointer' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '4px', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px' }}>
                                <stat.icon />
                            </div>
                            <div style={{ fontSize: '38px', fontWeight: '900', marginBottom: '5px' }}>{stat.count}</div>
                            <div style={{ fontSize: '10px', fontWeight: '800', color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', marginBottom: '30px' }}>Maintenance & Infrastructure</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                    {maintenanceModules.map((item, i) => (
                        <Link key={i} href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="card" style={{ padding: '30px', background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: '12px', cursor: 'pointer', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '5px' }}>
                                    <item.icon />
                                    <div style={{ fontSize: '16px', fontWeight: '900', textTransform: 'uppercase' }}>{item.label}</div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#888', marginLeft: '35px' }}>{item.sub}</div>
                                <div style={{ marginTop: '20px', fontSize: '10px', color: '#00ff00', marginLeft: '35px', fontWeight: '800' }}>● READY</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
