'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Trip {
    id: string;
    title: string;
    duration_days: number;
    starting_price: number;
    image_url: string;
    slug: string;
}

export default function FeaturedTrips() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('trips')
                .select('*')
                .eq('is_active', true)
                .limit(4);

            if (!error && data) {
                setTrips(data);
            }
            setLoading(false);
        };

        fetchFeatured();
    }, []);

    if (loading) return null; // Or a skeleton loader if needed

    return (
        <section className="featured-section">
            <div className="container">
                <div className="section-header-row">
                    <h2>Featured Trips</h2>
                    <Link href="/browse" className="link-btn">View All Trips</Link>
                </div>

                <div className="featured-grid">
                    {trips.map((trip) => (
                        <div className="trip-card" key={trip.id}>
                            <div className="image-placeholder" style={{ position: 'relative', background: '#f5f5f5' }}>
                                <Image 
                                    src={trip.image_url.startsWith('http') ? trip.image_url : `/images/${trip.image_url}`} 
                                    alt={trip.title} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                                    style={{ objectFit: 'cover' }} 
                                />
                            </div>
                            <div className="trip-card-content">
                                <h3 className="trip-card-title">{trip.title}</h3>
                                <div className="trip-card-details">
                                    <span>{trip.duration_days} Days</span>
                                    <span>From ${trip.starting_price}</span>
                                </div>
                                <div className="trip-card-footer">
                                    <Link href={`/trip-detail/${trip.slug}`} className="link-btn-small">View Trip</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trips.length === 0 && <p style={{ gridColumn: 'span 4', textAlign: 'center', color: '#999', padding: '40px' }}>Loading live trip packages...</p>}
                </div>
            </div>
        </section>
    );
}
