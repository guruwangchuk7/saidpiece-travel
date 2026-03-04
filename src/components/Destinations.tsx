'use client';

import { useState } from 'react';
import Image from 'next/image';

const destinations = {
    'Paro': {
        title: 'Paro Valley',
        desc: 'Begin your journey gently in this historic valley, home to the iconic Tiger’s Nest monastery and quiet riverside paths.',
        image: 'bhutan/13.JPG'
    },
    'Thimphu': {
        title: 'Capital City of Thimphu',
        desc: 'Explore Bhutan’s vibrant capital through local markets, arts schools, and serene monasteries overlooking the valley.',
        image: 'bhutan/14.JPG'
    },
    'Punakha': {
        title: 'Punakha Valley',
        desc: 'Descend into a warmer valley of rice fields and rivers, home to Bhutan’s most beautiful dzong.',
        image: 'bhutan/15.JPG'
    },
    'Bumthang': {
        title: 'The Heartland of Bumthang',
        desc: 'Journey to central Bhutan to discover living spiritual heritage, ancient temples, and deep cultural roots.',
        image: 'bhutan/16.JPG'
    },
    'Gangtey': {
        title: 'Phobjikha Valley',
        desc: 'Find peace in this wide glacial valley, famous for its dramatic landscapes and quiet, relaxing atmosphere.',
        image: 'bhutan/17.JPG'
    }
};

export default function Destinations() {
    const [activeTab, setActiveTab] = useState('Paro');

    return (
        <section className="dest-section">
            <div className="container dest-grid">
                <div className="dest-controls">
                    <h2>Exploring Bhutan&apos;s Valleys</h2>
                    <p>From the pine forests of Paro to the spiritual heartland of Bumthang, our carefully curated itineraries take you to the most spectacular corners of Bhutan.</p>
                    <div className="dest-tabs">
                        {Object.keys(destinations).map((tab) => (
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
                            src={`/images/${destinations[activeTab as keyof typeof destinations].image}`}
                            alt={activeTab}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                        />
                    </div>
                    <div className="dest-info">
                        <h3>{destinations[activeTab as keyof typeof destinations].title}</h3>
                        <p>{destinations[activeTab as keyof typeof destinations].desc}</p>
                        <button className="btn btn-primary">View All {activeTab} Trips</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
