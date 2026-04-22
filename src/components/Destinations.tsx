'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Destination {
    name: string;
    title: string;
    description: string;
    image_url: string;
}

export default function Destinations() {
    const [activeTab, setActiveTab] = useState('');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('destinations')
                .select('*')
                .order('sort_order', { ascending: true });

            if (data && data.length > 0) {
                setDestinations(data);
                setActiveTab(data[0].name);
            }
            setLoading(false);
        };
        fetchDestinations();
    }, []);

    const activeDest = destinations.find(d => d.name === activeTab) || destinations[0];

    if (loading || destinations.length === 0) return null;

    return (
        <section className="dest-section">
            <div className="container dest-grid">
                <div className="dest-controls">
                    <h2>Exploring Bhutan&apos;s Valleys</h2>
                    <p>From the pine forests of Paro to the spiritual heartland of Bumthang, our itineraries reveal the most spectacular corners of the kingdom.</p>
                    <div className="dest-tabs">
                        {destinations.map((dest) => (
                            <div
                                key={dest.name}
                                className={`dest-tab ${activeTab === dest.name ? 'active' : ''}`}
                                onClick={() => setActiveTab(dest.name)}
                            >
                                {dest.name}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dest-content" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                        <Image
                            src={activeDest.image_url.startsWith('http') ? activeDest.image_url : `/images/${activeDest.image_url}`}
                            alt={activeDest.name}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="dest-info">
                        <h3>{activeDest.title}</h3>
                        <p>{activeDest.description}</p>
                        <Link href={`/destinations/${activeDest.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="btn btn-primary">
                            View {activeDest.name} Region
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
