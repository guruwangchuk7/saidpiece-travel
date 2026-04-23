'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Catalog() {
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

    if (loading && Object.keys(settings).length === 0) return null;

    return (
        <section className="catalog-section">
            <div className="catalog-pattern"></div>
            <div className="container catalog-container">
                <div className="catalog-image" style={{ position: 'relative' }}>
                    <Image 
                        src={settings.catalog_image?.startsWith('http') ? settings.catalog_image : (settings.catalog_image || "/images/bhutan/21.webp")} 
                        alt="Physical Catalogs" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 50vw" 
                        style={{ objectFit: 'cover', borderRadius: '4px' }} 
                    />
                </div>
                <div className="catalog-content">
                    <h2>{settings.catalog_title || "Plan Your Bhutan Journey"}</h2>
                    <p>{settings.catalog_text || "Travel to Bhutan is carefully organised to ensure every journey is smooth, meaningful, and well supported. Tell us your travel dates, interests, and preferences, and we will prepare a personalised itinerary including hotel options and a transparent cost summary."}</p>
                    <div className="catalog-buttons">
                        <Link href="/wizard" className="btn btn-primary">{settings.catalog_wizard_label || "Plan Your Trip"}</Link>
                        <Link href="/catalog" className="btn btn-outline">{settings.catalog_btn_label || "Request Catalog"}</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
