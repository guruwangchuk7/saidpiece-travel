'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Intro() {
    const [settings, setSettings] = useState<any>({});

    useEffect(() => {
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*');
            if (data) {
                const s: any = {};
                data.forEach(item => s[item.key] = item.value);
                setSettings(s);
            }
        };
        fetchSettings();
    }, []);

    return (
        <section className="intro-section">
            <div className="container">
                <div className="intro-block">
                    <div className="intro-image" style={{ position: 'relative' }}>
                        <Image 
                            src={settings.intro_image?.startsWith('http') ? settings.intro_image : (settings.intro_image || "/images/bhutan/main3.webp")} 
                            alt="Bhutan Landscape" 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw" 
                            style={{ objectFit: 'cover', borderRadius: '4px' }} 
                        />
                    </div>
                    <div className="intro-content">
                        <h2>{settings.intro_title || "A Journey Created with Heart"}</h2>
                        <p>{settings.intro_text_1 || "At Saidpiece Travelers, we believe travel to Bhutan should feel personal, meaningful, and unhurried. Every journey we design is crafted to help you experience the real rhythm of the country— its quiet monasteries, mountain valleys, living traditions, and warm hospitality."}</p>
                        <p style={{ marginTop: '1rem' }}>{settings.intro_text_2 || "Rather than rushing through a checklist of sights, we focus on thoughtful travel experiences that allow you to slow down and connect with Bhutan’s culture and landscapes. Our goal is simple: to help you experience Bhutan in a way that stays with you long after the journey ends."}</p>
                        <Link href="/about/our-story" className="link-btn" style={{ marginTop: '1.5rem', display: 'inline-block' }}>{settings.intro_cta_label || "Our Story"}</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
