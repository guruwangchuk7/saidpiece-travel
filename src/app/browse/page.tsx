'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tripsData = [
    { id: 1, title: 'Bhutan Discovery', duration: '8 Days', level: 'Level 2 - Easy Active', price: 'From $2,400', image: '/images/bhutan/main4.JPG', tags: ['Small Group Adventure'], destination: 'Bhutan' },
    { id: 2, title: 'Bhutan Cultural Immersion', duration: '12 Days', level: 'Level 3 - Moderate', price: 'Price on Request', image: '/images/bhutan/main5.JPG', tags: ['Private Journey'], destination: 'Bhutan' },
    { id: 3, title: 'Bhutan Nature Retreat', duration: '10 Days', level: 'Level 1 - Easy', price: 'From $6,500', image: '/images/bhutan/main6.JPG', tags: ['Nature & Wellness'], destination: 'Bhutan' },
    { id: 4, title: 'Bhutan Romantic Escape', duration: '10 Days', level: 'Level 1 - Easy', price: 'From $8,900', image: '/images/bhutan/9.JPG', tags: ['Honeymoon'], destination: 'Bhutan' },
    { id: 5, title: 'Bhutan Family Adventure', duration: '7 Days', level: 'Level 2 - Easy Active', price: 'From $1,900', image: '/images/bhutan/10.JPG', tags: ['Family Adventure'], destination: 'Bhutan' },
    { id: 6, title: 'Paro Festival Safari', duration: '9 Days', level: 'Level 2 - Easy Active', price: 'From $2,700', image: '/images/bhutan/11.JPG', tags: ['Festival Tours'], destination: 'Bhutan' }
];

export default function BrowseTrips() {
    const [isLoading, setIsLoading] = useState(false);

    // In a real app, this would trigger a data fetch
    const handleFilterChange = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <main>
            <Header theme="light" />

            <div className="browse-page-layout">
                {/* Breadcrumbs */}
                <div className="breadcrumbs">
                    <div className="container">
                        <Link href="/">Home</Link> &gt; <span>Browse Trips</span>
                    </div>
                </div>

                <div className="container browse-grid">
                    {/* Left Sidebar Filters */}
                    <aside className="filters-sidebar">
                        <div className="filter-header">
                            <h3>Filters</h3>
                            <button className="clear-filters" onClick={handleFilterChange}>Clear All</button>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Trip Type</h4>
                            <div className="filter-options">
                                <label><input type="checkbox" onChange={handleFilterChange} /> Small Group Adventure</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Private Journey</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Family Trips</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Destination</h4>
                            <div className="filter-options">
                                <label><input type="checkbox" defaultChecked onChange={handleFilterChange} /> Bhutan</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Paro</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Thimphu</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Punakha</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Activity</h4>
                            <div className="filter-options">
                                <label><input type="checkbox" defaultChecked onChange={handleFilterChange} /> Cultural Immersion</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Nature & Wellness</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Trekking & Hiking</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Trip Level</h4>
                            <div className="filter-options">
                                <label><input type="checkbox" onChange={handleFilterChange} /> Level 1 (Easy)</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Level 2 (Easy Active)</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Level 3 (Moderate)</label>
                                <label><input type="checkbox" onChange={handleFilterChange} /> Level 4 (Strenuous)</label>
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4 className="filter-title">Date Range</h4>
                            <div className="date-inputs">
                                <input type="date" className="filter-input-date" onChange={handleFilterChange} />
                                <span>to</span>
                                <input type="date" className="filter-input-date" onChange={handleFilterChange} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Results Area */}
                    <div className="results-area">
                        <div className="results-header">
                            <h2>Showing {tripsData.length} Trip Results for Bhutan</h2>
                            <div className="sort-dropdown">
                                <span style={{ fontSize: '0.875rem', marginRight: '10px', color: '#666' }}>Sort by:</span>
                                <select className="trip-finder-input" style={{ width: 'auto', display: 'inline-block' }} onChange={handleFilterChange}>
                                    <option>Default</option>
                                    <option>Destination</option>
                                    <option>Date</option>
                                    <option>Price (Low to High)</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="loading-spinner-container">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <div className="trip-results-grid">
                                {tripsData.map((trip) => (
                                    <div className="trip-result-card" key={trip.id}>
                                        <div className="trip-image-container" style={{ position: 'relative', height: '220px' }}>
                                            <Image src={trip.image} alt={trip.title} fill style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
                                            {trip.tags.map(tag => (
                                                <span key={tag} className="trip-card-tag">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="trip-card-content">
                                            <h3 className="trip-card-title" style={{ fontSize: '1.25rem', marginBottom: '15px' }}>{trip.title}</h3>

                                            <div className="trip-meta-icons">
                                                <div className="meta-item">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                                    <span>{trip.destination}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                                                    <span>{trip.level}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                    <span>{trip.duration}</span>
                                                </div>
                                            </div>

                                            <div className="trip-card-footer" style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span className="trip-price" style={{ fontWeight: '500', color: 'var(--color-text)' }}>{trip.price}</span>
                                                <Link href="/trip-detail" className="link-btn-small" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 'bold' }}>View Trip</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
