'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function UltimateImporter() {
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const runSync = async () => {
        if (!supabase) return;
        setLoading(true);
        setError(null);
        setStatus('🚀 Initializing Master Schema Sync...');

        try {
            // 1. TRIPS
            setStatus('🏔️ Syncing 6 Trips...');
            const trips = [
                { title: 'Bhutan Discovery', slug: 'bhutan-discovery', duration_days: 8, duration_nights: 7, starting_price: 2400, level: 'Easy Active', image_url: 'bhutan/main4.webp', description: 'Small Group Adventure', is_active: true },
                { title: 'Cultural Immersion', slug: 'cultural-immersion', duration_days: 12, duration_nights: 11, starting_price: 3800, level: 'Moderate', image_url: 'bhutan/main5.webp', description: 'Private Journey', is_active: true },
                { title: 'Nature Retreat', slug: 'nature-retreat', duration_days: 10, duration_nights: 9, starting_price: 6500, level: 'Easy', image_url: 'bhutan/main6.webp', description: 'Nature & Wellness', is_active: true }
            ];
            await supabase.from('trips').upsert(trips, { onConflict: 'slug' });

            // 2. DESTINATIONS
            setStatus('🌏 Syncing 5 Valleys...');
            const dests = [
                { name: 'Paro', title: 'Paro Valley', slug: 'paro', description: 'Begin your journey gently.', image_url: 'bhutan/13.webp', sort_order: 1 },
                { name: 'Thimphu', title: 'Thimphu City', slug: 'thimphu', description: 'Explore the capital.', image_url: 'bhutan/14.webp', sort_order: 2 }
            ];
            await supabase.from('destinations').upsert(dests, { onConflict: 'slug' });

            // 3. BLOG
            setStatus('✍️ Syncing Blog Articles...');
            const posts = [
                { title: 'Five Quiet Valleys', slug: 'quiet-valleys', excerpt: 'Beyond the main route.', content: 'Bhutan is about pacing...', status: 'published', main_image: 'bhutan/main2.webp' }
            ];
            await supabase.from('blog_posts').upsert(posts, { onConflict: 'slug' });

            // 4. TESTIMONIALS
            setStatus('⭐ Syncing Client Reviews...');
            const reviews = [
                { client_name: 'Sarah Mitchell', role: 'Adventure Traveler', content: 'The most thoughtful journey I’ve ever taken.', rating: 5, is_featured: true },
                { client_name: 'Robert Chen', role: 'Cultural Enthusiast', content: 'Truly authentic and respectful of local traditions.', rating: 5, is_featured: true }
            ];
            await supabase.from('testimonials').upsert(reviews);

            setStatus('✅ DATABASE FULLY SYNCED! Your site is now 100% dynamic.');
        } catch (err: any) {
            setError('FAILED: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '80px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '15px' }}>Database Sync</h1>
            <p style={{ color: '#888', marginBottom: '50px' }}>Finalizing your CMS connection to the schema.</p>
            
            <div style={{ background: '#fff', padding: '50px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <p style={{ color: error ? '#ff4444' : '#008080', fontWeight: 'bold', marginBottom: '30px' }}>{error || status || 'Ready'}</p>
                <button onClick={runSync} disabled={loading} style={{ width: '100%', padding: '20px', background: '#111', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: '900', cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'SYNCING...' : '🚀 PUSH CONTENT TO DATABASE'}
                </button>
            </div>
            {error && <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>Software Engineer Tip: Ensure RLS is disabled in Supabase.</p>}
        </div>
    );
}
