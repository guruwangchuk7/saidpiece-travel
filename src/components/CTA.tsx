'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function CTA() {
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*');
            if (data) {
                const s: any = {};
                data.forEach(item => s[item.key] = item.value);
                setSettings(s);
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const backgroundImage = settings.cta_bg_image?.startsWith('http') 
        ? settings.cta_bg_image 
        : (settings.cta_bg_image || '/images/bhutan/main2.webp');

    if (loading && Object.keys(settings).length === 0) return null;

    return (
        <section className="cta-section">
            <div className="cta-bg fixed-bg" style={{ 
                backgroundImage: `url('${backgroundImage}')`,
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} />
            </div>
            <div className="container cta-content">
                <h2>{settings.cta_title || "Talk to a Bhutan Expert"}</h2>
                <p>{settings.cta_text || "If you prefer to discuss your trip in person, you can schedule a short video call with our team. We can explain how travel works in Bhutan, walk through your itinerary, and answer any questions."}</p>
                <div className="cta-buttons">
                    <Link href="/contact" className="btn btn-primary">{settings.cta_btn_label || "Enquire Now"}</Link>
                </div>
            </div>
        </section>
    );
}
