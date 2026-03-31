'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabaseClient';

interface Trip {
    id: string;
    title: string;
    slug: string;
    duration_days: number;
    level: string;
    starting_price: number;
    image_url: string;
    trip_type: string;
    destination: string;
    category?: string;
    is_active: boolean;
}

export default function BrowseTripsClient({
    initialCollection = 'all',
    initialType,
    initialActivity,
}: {
    initialCollection?: string;
    initialType?: string;
    initialActivity?: string;
}) {
    const [allTrips, setAllTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        types: initialType ? [initialType] : [] as string[],
        destinations: [] as string[],
        activities: initialActivity ? [initialActivity] : [] as string[],
        levels: [] as string[],
    });
    const [sortBy, setSortBy] = useState('Default');
    const [isMounted, setIsMounted] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        if (!supabase) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('is_active', true);

        if (data) setAllTrips(data);
        setIsLoading(false);
    };

    const handleFilterChange = (category: keyof typeof filters, value: string) => {
        setFilters(prev => {
            const current = prev[category] as string[];
            const next = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: next } as typeof filters;
        });
    };

    const clearFilters = () => {
        setFilters({ types: [], destinations: [], activities: [], levels: [] });
    };

    const filteredTrips = allTrips.filter(trip => {
        if (filters.types.length > 0 && !filters.types.includes(trip.trip_type)) return false;
        if (filters.destinations.length > 0 && !filters.destinations.includes(trip.destination)) return false;
        if (filters.activities.length > 0 && !filters.activities.includes(trip.category || '')) return false;
        if (filters.levels.length > 0 && !filters.levels.includes(trip.level)) return false;
        return true;
    }).sort((a, b) => {
        if (sortBy === 'Price (Low to High)') return (a.starting_price || 0) - (b.starting_price || 0);
        if (sortBy === 'Duration') return b.duration_days - a.duration_days;
        return 0;
    });

    const activeFilterCount = Object.values(filters).flat().length;

    // Dynamically derive filter options from data
    const typeOptions = Array.from(new Set(allTrips.map(t => t.trip_type))).filter(Boolean) as string[];
    const destOptions = Array.from(new Set(allTrips.map(t => t.destination))).filter(Boolean) as string[];
    const activityOptions = Array.from(new Set(allTrips.map(t => t.category))).filter(Boolean) as string[];
    const levelOptions = Array.from(new Set(allTrips.map(t => t.level))).filter(Boolean) as string[];

    return (
        <main>
            <Header theme="light" />

            <div className="browse-page-layout">
                <div className="breadcrumbs">
                    <div className="container">
                        <Link href="/">Home</Link> &gt; <span>Browse Trips</span>
                    </div>
                </div>

                <div className="mobile-filter-trigger-bar">
                    <div className="search-bar-mini">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="text" placeholder="Search trips..." className="mini-search-input" />
                    </div>
                    <button className="mobile-filter-icon-btn" onClick={() => setIsFilterDrawerOpen(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
                    </button>
                </div>

                <div className={`drawer-backdrop ${isFilterDrawerOpen && isMounted ? 'is-active' : ''}`} onClick={() => setIsFilterDrawerOpen(false)} />

                <div className="container browse-grid">
                    <aside className={`filters-sidebar ${isFilterDrawerOpen && isMounted ? 'is-open' : ''}`}>
                        <div className="filter-inner">
                            <div className="filter-header">
                                <h3>Filters</h3>
                                <button className="clear-filters" onClick={clearFilters}>Clear All</button>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Trip Style</h4>
                                <div className="filter-options">
                                    {typeOptions.map(type => (
                                        <label key={type}>
                                            <input type="checkbox" checked={filters.types.includes(type)} onChange={() => handleFilterChange('types', type)} /> {type}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Destination</h4>
                                <div className="filter-options">
                                    {destOptions.map(dest => (
                                        <label key={dest}>
                                            <input type="checkbox" checked={filters.destinations.includes(dest)} onChange={() => handleFilterChange('destinations', dest)} /> {dest}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-group">
                                <h4 className="filter-title">Experience</h4>
                                <div className="filter-options">
                                    {activityOptions.map(act => (
                                        <label key={act}>
                                            <input type="checkbox" checked={filters.activities.includes(act)} onChange={() => handleFilterChange('activities', act)} /> {act}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="results-area">
                        <div className="results-header">
                            <div>
                                <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-playfair), serif' }}>Explore Bhutan Journeys</h2>
                                <p style={{ margin: '8px 0 0', color: '#666' }}>Find the perfect pace and style for your journey.</p>
                            </div>
                            <div className="sort-dropdown">
                                <select className="trip-finder-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option>Default</option>
                                    <option>Duration</option>
                                    <option>Price (Low to High)</option>
                                </select>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="loading-spinner-container"><div className="loading-spinner"></div></div>
                        ) : (
                            <div className="trip-results-grid">
                                {filteredTrips.map((trip) => (
                                    <div className="trip-result-card" key={trip.id}>
                                        <div className="trip-image-container" style={{ position: 'relative', height: '220px' }}>
                                            <Image src={trip.image_url.startsWith('http') ? trip.image_url : `/images/${trip.image_url}`} alt={trip.title} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                                            <span className="trip-card-tag">{trip.trip_type}</span>
                                        </div>
                                        <div className="trip-card-content">
                                            <h3 className="trip-card-title">{trip.title}</h3>
                                            <div className="trip-meta-icons">
                                                <div className="meta-item"><span>{trip.destination}</span></div>
                                                <div className="meta-item"><span>{trip.level}</span></div>
                                                <div className="meta-item"><span>{trip.duration_days} Days</span></div>
                                            </div>
                                            <div className="trip-card-footer" style={{ borderTop: '1px solid #eee', marginTop: '20px', paddingTop: '15px' }}>
                                                <span className="trip-price">From ${trip.starting_price}</span>
                                                <Link href={`/trip-detail/${trip.slug}`} className="link-btn-small">View Trip</Link>
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
