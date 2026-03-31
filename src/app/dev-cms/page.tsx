'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// Professional SVG Icons for the full suite
const CardIcons = {
    Trips: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
    Destinations: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Insights: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
    Messages: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    FAQ: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
    Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Settings: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
};

export default function DevCMSDashboard() {
    const [stats, setStats] = useState([
        { label: 'Trips', count: 0, icon: CardIcons.Trips, href: '/dev-cms/trips' },
        { label: 'Insights', count: 0, icon: CardIcons.Insights, href: '/dev-cms/blog' },
        { label: 'FAQs', count: 0, icon: CardIcons.FAQ, href: '/dev-cms/faq' },
        { label: 'Messages', count: 0, icon: CardIcons.Messages, href: '/dev-cms/enquiries' },
    ]);

    const quickActions = [
        { label: 'New Trip Package', sub: 'Showcase Bhutan', icon: CardIcons.Plus, href: '/dev-cms/trips' },
        { label: 'New FAQ', sub: 'Help your travelers', icon: CardIcons.Plus, href: '/dev-cms/faq' },
        { label: 'Insights Post', sub: 'Write a story', icon: CardIcons.Plus, href: '/dev-cms/blog' },
        { label: 'Site Settings', sub: 'Global Meta & Info', icon: CardIcons.Settings, href: '/dev-cms/settings' },
    ];

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        if (!supabase) return;
        try {
            const tr = await supabase.from('trips').select('*', { count: 'exact', head: true });
            const bl = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
            const fq = await supabase.from('faqs').select('*', { count: 'exact', head: true });
            const en = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
            
            setStats([
                { label: 'Trips', count: tr.count || 0, icon: CardIcons.Trips, href: '/dev-cms/trips' },
                { label: 'Insights', count: bl.count || 0, icon: CardIcons.Insights, href: '/dev-cms/blog' },
                { label: 'FAQs', count: fq.count || 0, icon: CardIcons.FAQ, href: '/dev-cms/faq' },
                { label: 'Messages', count: en.count || 0, icon: CardIcons.Messages, href: '/dev-cms/enquiries' },
            ]);
        } catch (e) {
            console.error('Error fetching stat counts:', e);
        }
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.5px', marginBottom: '10px', textTransform: 'uppercase' }}>Dashboard</h1>
                <p style={{ fontSize: '18px', color: '#888', fontWeight: '400' }}>Full Architectural CMS Migration Terminal.</p>
            </div>

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
                <h3 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#333', marginBottom: '30px' }}>Content Modules</h3>
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
        </div>
    );
}
