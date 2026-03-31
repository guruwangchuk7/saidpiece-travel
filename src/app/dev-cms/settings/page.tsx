'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Setting {
    id: string;
    setting_key: string;
    setting_value: string;
    description?: string;
}

export default function DevSettingsManager() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        if (!supabase) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .order('setting_key', { ascending: true });

        if (error) console.error('Error fetching settings:', error);
        else setSettings(data || []);
        setLoading(false);
    };

    const handleUpdate = async (id: string, value: string) => {
        if (!supabase) return;
        setUpdating(id);
        const { error } = await supabase
            .from('site_settings')
            .update({ setting_value: value })
            .eq('id', id);

        if (error) alert('Error: ' + error.message);
        setUpdating(null);
    };

    if (loading) return <div>Loading site configuration...</div>;

    return (
        <section style={{ maxWidth: '900px' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Site Settings</h1>
            <p style={{ color: '#888', marginBottom: '40px' }}>Configure your website's public information and content.</p>

            <div style={{ display: 'grid', gap: '30px' }}>
                {settings.map((setting) => (
                    <div key={setting.id} style={{ background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #eee', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                            <label style={{ fontWeight: '900', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#111' }}>
                                {setting.setting_key.replace(/_/g, ' ')}
                            </label>
                            {updating === setting.id ? <span style={{ fontSize: '10px', color: '#008080' }}>Saving...</span> : null}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <input 
                                type="text"
                                defaultValue={setting.setting_value}
                                onBlur={(e) => handleUpdate(setting.id, e.target.value)}
                                style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' }}
                                placeholder={`Enter value for ${setting.setting_key}`}
                            />
                        </div>
                        {setting.description && <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>{setting.description}</p>}
                    </div>
                ))}
            </div>

            {settings.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: 'white', border: '2px dashed #eee', borderRadius: '12px', color: '#999' }}>
                    No settings found in the database.
                </div>
            )}
        </section>
    );
}
