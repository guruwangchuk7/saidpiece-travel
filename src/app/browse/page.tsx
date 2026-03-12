
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const tripsData = [
    { id: 1, title: 'Bhutan Discovery', duration: 8, level: 2, price: 2400, priceDisplay: 'From $2,400', image: '/images/bhutan/main4.JPG', type: 'Small Group Adventure', destination: 'Bhutan', activity: 'Discovery' },
    { id: 2, title: 'Bhutan Cultural Immersion', duration: 12, level: 3, price: 0, priceDisplay: 'Price on Request', image: '/images/bhutan/main5.JPG', type: 'Private Journey', destination: 'Bhutan', activity: 'Cultural Immersion' },
    { id: 3, title: 'Bhutan Nature Retreat', duration: 10, level: 1, price: 6500, priceDisplay: 'From $6,500', image: '/images/bhutan/main6.JPG', type: 'Nature & Wellness', destination: 'Bhutan', activity: 'Nature & Wellness' },
    { id: 4, title: 'Bhutan Romantic Escape', duration: 10, level: 1, price: 8900, priceDisplay: 'From $8,900', image: '/images/bhutan/9.JPG', type: 'Honeymoon', destination: 'Bhutan', activity: 'Nature & Wellness' },
    { id: 5, title: 'Bhutan Family Adventure', duration: 7, level: 2, price: 1900, priceDisplay: 'From $1,900', image: '/images/bhutan/10.JPG', type: 'Family Adventure', destination: 'Bhutan', activity: 'Cultural Immersion' },
    { id: 6, title: 'Paro Festival Safari', duration: 9, level: 2, price: 2700, priceDisplay: 'From $2,700', image: '/images/bhutan/11.JPG', type: 'Festival Tours', destination: 'Paro', activity: 'Festivals & Traditions' }
];

export default function BrowseTrips() {
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        types: [] as string[],
        destinations: [] as string[],
        activities: [] as string[],
        levels: [] as number[],
    });
    const [sortBy, setSortBy] = useState('Default');
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsMounted(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    const handleFilterChange = (category: keyof typeof filters, value: string | number) => {
        setIsLoading(true);
        setFilters(prev => {
            const current = prev[category] as (string | number)[];
            const next = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: next } as typeof filters;
        });
        setTimeout(() => setIsLoading(false), 500);
    };

    const clearFilters = () => {
        setIsLoading(true);
        setFilters({ types: [], destinations: [], activities: [], levels: [] });
        setTimeout(() => setIsLoading(false), 500);
    };

    const filteredTrips = tripsData.filter(trip => {
        if (filters.types.length > 0 && !filters.types.includes(trip.type)) return false;
        if (filters.destinations.length > 0 && !filters.destinations.includes(trip.destination)) return false;
        if (filters.activities.length > 0 && !filters.activities.includes(trip.activity)) return false;
        if (filters.levels.length > 0 && !filters.levels.includes(trip.level)) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'Price (Low to High)') return (a.price || 99999) - (b.price || 99999);
        if (sortBy === 'Duration') return b.duration - a.duration;
        return 0;
    });

    const getLevelLabel = (lvl: number) => {
        if (lvl === 1) return 'Level 1 - Easy';
        if (lvl === 2) return 'Level 2 - Easy Active';
        if (lvl === 3) return 'Level 3 - Moderate';
        return 'Level 4 - Strenuous';
    };

    const removeFilter = (category: keyof typeof filters, value: string | number) => {
        setIsLoading(true);
        setFilters(prev => ({
            ...prev,
            [category]: (prev[category] as (string | number)[]).filter(item => item !== value)
        }));
        setTimeout(() => setIsLoading(false), 500);
    };

    const activeFilterCount = Object.values(filters).flat().length;

    return (
        <main>
            <Header theme="light" />

            <div className="browse-page-layout">
                <div className="breadcrumbs">
                    <div className="container">
                        <Link href="/">Home</Link> &gt; <span>Browse Trips</span>
                    </div>
                </div>

                {/* Mobile Filter Trigger Bar (Compact Search + Filter) */}
                <div className="mobile-filter-trigger-bar">
                    <div className="search-bar-mini">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search trips..." className="mini-search-input" />
                    </div>
                    <button className="mobile-filter-icon-btn" onClick={() => setIsFilterDrawerOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                {/* Backdrop with Blur */}
                <div className={`drawer-backdrop ${isFilterDrawerOpen && isMounted ? 'is-active' : ''}`} onClick={() => setIsFilterDrawerOpen(false)} />

                <div className="container browse-grid">
                    <aside className={`filters-sidebar ${isFilterDrawerOpen && isMounted ? 'is-open' : ''}`}>
                        <div className="drawer-handle" />
                        <div className="filter-drawer-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="drawer-title">Filters</span>
                                <button className="clear-filters-mobile" onClick={clearFilters}>Clear All</button>
                            </div>
                            <button className="close-drawer-btn" onClick={() => setIsFilterDrawerOpen(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        
                        <div className="filter-inner">
                            <div className="filter-header">
                                <h3>Filters</h3>
                                <button className="clear-filters" onClick={clearFilters}>Clear All</button>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Trip Type</h4>
                                <div className="filter-options">
                                    {['Small Group Adventure', 'Private Journey', 'Family Trips', 'Nature & Wellness', 'Honeymoon', 'Festival Tours'].map(type => (
                                        <label key={type}>
                                            <input
                                                type="checkbox"
                                                checked={filters.types.includes(type === 'Family Trips' ? 'Family Adventure' : type)}
                                                onChange={() => handleFilterChange('types', type === 'Family Trips' ? 'Family Adventure' : type)}
                                            /> {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Destination</h4>
                                <div className="filter-options">
                                    {['Bhutan', 'Paro', 'Thimphu', 'Punakha'].map(dest => (
                                        <label key={dest}>
                                            <input
                                                type="checkbox"
                                                checked={filters.destinations.includes(dest)}
                                                onChange={() => handleFilterChange('destinations', dest)}
                                            /> {dest}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Activity</h4>
                                <div className="filter-options">
                                    {['Cultural Immersion', 'Nature & Wellness', 'Trekking & Hiking', 'Festivals & Traditions'].map(act => (
                                        <label key={act}>
                                            <input
                                                type="checkbox"
                                                checked={filters.activities.includes(act)}
                                                onChange={() => handleFilterChange('activities', act)}
                                            /> {act}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Trip Level</h4>
                                <div className="filter-options">
                                    {[1, 2, 3, 4].map(lvl => (
                                        <label key={lvl}>
                                            <input
                                                type="checkbox"
                                                checked={filters.levels.includes(lvl)}
                                                onChange={() => handleFilterChange('levels', lvl)}
                                            /> {getLevelLabel(lvl)}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Date Range</h4>
                                <div className="date-inputs">
                                    <input type="date" className="filter-input-date" onChange={() => handleFilterChange('types', 'dummy')} />
                                    <span>to</span>
                                    <input type="date" className="filter-input-date" onChange={() => handleFilterChange('types', 'dummy')} />
                                </div>
                            </div>
                        </div>

                        <div className="filter-drawer-footer">
                            <button className="btn btn-primary full-width" onClick={() => setIsFilterDrawerOpen(false)}>
                                SHOW {filteredTrips.length} RESULTS
                            </button>
                        </div>
                    </aside>

                    <div className="results-area">
                        <div className="results-header">
                            <h2>Showing {filteredTrips.length} Results</h2>
                            <div className="sort-dropdown">
                                <span style={{ fontSize: '0.875rem', marginRight: '10px', color: '#666' }}>Sort by:</span>
                                <select
                                    className="trip-finder-input"
                                    style={{ width: 'auto', display: 'inline-block' }}
                                    value={sortBy}
                                    onChange={(e) => {
                                        setIsLoading(true);
                                        setSortBy(e.target.value);
                                        setTimeout(() => setIsLoading(false), 500);
                                    }}
                                >
                                    <option>Default</option>
                                    <option>Duration</option>
                                    <option>Price (Low to High)</option>
                                </select>
                            </div>
                        </div>

                        {/* Active Filter Chips */}
                        {Object.entries(filters).some(([_, vals]) => vals.length > 0) && (
                            <div className="active-filters-row">
                                {Object.entries(filters).map(([cat, vals]) => (
                                    (vals as (string | number)[]).map(val => (
                                        <span key={`${cat}-${val}`} className="filter-chip">
                                            {cat === 'levels' ? getLevelLabel(val as number) : val}
                                            <button onClick={() => removeFilter(cat as keyof typeof filters, val)}>
                                                &times;
                                            </button>
                                        </span>
                                    ))
                                ))}
                                <button className="clear-all-chip-btn" onClick={clearFilters}>Clear All</button>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="loading-spinner-container">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : (
                            <div className="trip-results-grid">
                                {filteredTrips.map((trip) => (
                                    <div className="trip-result-card" key={trip.id}>
                                        <div className="trip-image-container" style={{ position: 'relative', height: '220px' }}>
                                            <Image src={trip.image} alt={trip.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{ objectFit: 'cover', borderTopLeftRadius: '4px', borderTopRightRadius: '4px' }} />
                                            <span className="trip-card-tag">{trip.type}</span>
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
                                                    <span>{getLevelLabel(trip.level)}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                    <span>{trip.duration} Days</span>
                                                </div>
                                            </div>

                                            <div className="trip-card-footer" style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span className="trip-price" style={{ fontWeight: '500', color: 'var(--color-text)' }}>{trip.priceDisplay}</span>
                                                <Link href="/trip-detail" className="link-btn-small" style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', fontWeight: 'bold' }}>View Trip</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredTrips.length === 0 && (
                                    <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                                        <p>No trips match your current filters. Try resetting or selecting different options.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
