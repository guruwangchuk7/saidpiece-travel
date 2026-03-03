'use client';

import { useState } from 'react';
import Image from 'next/image';

const destinations = {
    'Tanzania': {
        title: 'Experience Bhutan',
        desc: 'Witness the serene beauty and rich culture of the Land of the Thunder Dragon.',
        image: 'bhutan/13.JPG'
    },
    'Alps': {
        title: 'Trek High Passes',
        desc: 'Discover hidden monasteries and ancient trails in the heart of the Himalayas.',
        image: 'bhutan/14.JPG'
    },
    'Peru': {
        title: 'Spiritual Journeys',
        desc: 'Experience the unique blend of tradition and modernity in Bhutanese life.',
        image: 'bhutan/15.JPG'
    },
    'Egypt': {
        title: 'Valley of Shrines',
        desc: 'Explore the majestic dzongs and sacred temples that dot the landscape.',
        image: 'bhutan/16.JPG'
    },
    'Himalayas': {
        title: 'Peak Adventure',
        desc: 'Challenge yourself with high-altitude trekking and magnificent mountain vistas.',
        image: 'bhutan/17.JPG'
    }
};

export default function Destinations() {
    const [activeTab, setActiveTab] = useState('Tanzania');

    return (
        <section className="dest-section">
            <div className="container dest-grid">
                <div className="dest-controls">
                    <h2>Exploring Top Destinations</h2>
                    <p>From the sweeping savannas of Africa to the snow-capped peaks of the Himalayas, our carefully curated itineraries take you to the most spectacular corners of the globe.</p>
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
