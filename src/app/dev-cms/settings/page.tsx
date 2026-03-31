'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Setting {
    key: string;
    value: string;
    description?: string;
}

export default function DevSettingsManager() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const defaultSettings = [
        { key: 'site_name', value: 'Saidpiece Travel', desc: 'Main branding name' },
        { key: 'hero_title', value: 'Meaningful Journeys to Bhutan', desc: 'Main headline on Home Page' },
        { key: 'hero_sub_title', value: 'Experience the real rhythm of the country', desc: 'Small text below Home headline' },
        { key: 'intro_title', value: 'A Journey Created with Heart', desc: 'Title for the intro section' },
        { key: 'contact_email', value: 'saidpiece@gmail.com', desc: 'Global contact email' },
        { key: 'footer_address', value: 'Thimphu, Bhutan', desc: 'Physical address in footer' },
        { key: 'story_quote', value: 'The most meaningful journeys are those that lead us not just to new places, but to new ways of seeing the world.', desc: 'Featured quote on Story page' },
        { key: 'story_body_1', value: 'Saidpiece Travel was born from a simple yet profound realization: that travel should be more than just a checklist of sights.', desc: 'First paragraph of Our Story' },
        { key: 'story_body_2', value: 'Since our inception, we have partnered with world-class researchers and local elders to ensure our trips are educationally rich.', desc: 'Second paragraph of Our Story' },
        { key: 'facebook_url', value: '#', desc: 'Social link' },
        { key: 'instagram_url', value: '#', desc: 'Social link' }
    ];

    const fetchSettings = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase.from('site_settings').select('*');
        if (data && data.length > 0) {
            setSettings(data);
        } else {
            // Auto-initialize if empty
            const inserts = defaultSettings.map(s => ({ key: s.key, value: s.value, description: s.desc }));
            await supabase.from('site_settings').insert(inserts);
            const { data: newData } = await supabase.from('site_settings').select('*');
            setSettings(newData || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (key: string, value: string) => {
        if (!supabase) return;
        setUpdating(key);
        try {
            await supabase.from('site_settings').update({ value }).eq('key', key);
        } catch (e) {
            // Silence lock errors in dev
        }
        setUpdating(null);
    };

    if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>Opening Configuration...</div>;

    return (
        <section style={{ maxWidth: '900px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px' }}>Site Settings</h1>
            <p style={{ color: '#888', marginBottom: '50px' }}>Global site variables synced to your `site_settings` table.</p>

            <div style={{ display: 'grid', gap: '30px' }}>
                {settings.map((setting) => (
                    <div key={setting.key} style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eee' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <label style={{ fontWeight: '900', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{setting.key.replace(/_/g, ' ')}</label>
                            {updating === setting.key && <span style={{ fontSize: '10px', color: '#008080', fontWeight: '900' }}>SAVING...</span>}
                        </div>
                        <input 
                            type="text" 
                            defaultValue={setting.value} 
                            onBlur={(e) => handleUpdate(setting.key, e.target.value)}
                            style={{ width: '100%', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                        />
                        {setting.description && <p style={{ fontSize: '11px', color: '#999', marginTop: '12px' }}>{setting.description}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
}
