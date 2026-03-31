'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

const hardcodedDestinations = {
    'Paro': {
        title: 'Paro Valley',
        desc: 'Begin your journey gently in this historic valley, home to the iconic Tiger’s Nest monastery and quiet riverside paths.',
        image: 'bhutan/13.webp'
    },
    'Thimphu': {
        title: 'Capital City of Thimphu',
        desc: 'Explore Bhutan’s vibrant capital through local markets, arts schools, and serene monasteries overlooking the valley.',
        image: 'bhutan/14.webp'
    },
    'Punakha': {
        title: 'Punakha Valley',
        desc: 'Descend into a warmer valley of rice fields and rivers, home to Bhutan’s most beautiful dzong.',
        image: 'bhutan/15.webp'
    },
    'Bumthang': {
        title: 'The Heartland of Bumthang',
        desc: 'Journey to central Bhutan to discover living spiritual heritage, ancient temples, and deep cultural roots.',
        image: 'bhutan/16.webp'
    },
    'Gangtey': {
        title: 'Phobjikha Valley',
        desc: 'Find peace in this wide glacial valley, famous for its dramatic landscapes and quiet, relaxing atmosphere.',
        image: 'bhutan/17.webp'
    }
};

export default function Destinations() {
    const [activeTab, setActiveTab] = useState('Paro');
    const [cmsDestinations, setCmsDestinations] = useState<any[]>([]);
    const [isUsingCms, setIsUsingCms] = useState(false);

    useEffect(() => {
        const fetchDestinations = async () => {
            if (!supabase) return;
            const { data, error } = await supabase
                .from('destinations')
                .select('*')
                .order('sort_order', { ascending: true });

            if (!error && data && data.length > 0) {
                setCmsDestinations(data);
                setIsUsingCms(true);
                setActiveTab(data[0].name);
            }
        };

        fetchDestinations();
    }, []);

    const getData = () => {
        if (isUsingCms) {
            const active = cmsDestinations.find(d => d.name === activeTab) || cmsDestinations[0];
            return {
                title: active.title,
                desc: active.description,
                image: active.image_url || 'bhutan/13.webp', // Default fallback
                tabs: cmsDestinations.map(d => d.name)
            };
        }
        
        const active = hardcodedDestinations[activeTab as keyof typeof hardcodedDestinations];
        return {
            title: active.title,
            desc: active.desc,
            image: active.image,
            tabs: Object.keys(hardcodedDestinations)
        };
    };

    const displayData = getData();

    return (
        <section className="dest-section">
            <div className="container dest-grid">
                <div className="dest-controls">
                    <h2>Exploring Bhutan&apos;s Valleys</h2>
                    <p>From the pine forests of Paro to the spiritual heartland of Bumthang, our carefully curated itineraries take you to the most spectacular corners of Bhutan.</p>
                    <div className="dest-tabs">
                        {displayData.tabs.map((tab) => (
                            <div
                                key={tab}
                                className={`dest-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="dest-content" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                        <Image
                            src={displayData.image.startsWith('http') ? displayData.image : `/images/${displayData.image}`}
                            alt={activeTab}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="dest-info">
                        <h3>{displayData.title}</h3>
                        <p>{displayData.desc}</p>
                        <a href="/browse" className="btn btn-primary">View All {activeTab} Trips</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
