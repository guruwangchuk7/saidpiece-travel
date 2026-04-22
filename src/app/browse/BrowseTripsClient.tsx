'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useUI } from '@/contexts/UIContext';

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
    initialTrips = [],
}: {
    initialCollection?: string;
    initialType?: string;
    initialActivity?: string;
    initialTrips?: Trip[];
}) {
    const { setHeaderTheme } = useUI();
    const [allTrips, setAllTrips] = useState<Trip[]>(initialTrips);
    const [isLoading, setIsLoading] = useState(initialTrips.length === 0);
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
        setHeaderTheme('light');
        return () => setHeaderTheme('auto');
    }, [setHeaderTheme]);

    useEffect(() => {
        setIsMounted(true);
        if (allTrips.length === 0) {
            fetchTrips();
        }
    }, []);

    const DEMO_TRIPS: Trip[] = [
        {
            id: 'c1',
            title: "Cultural Immersion",
            slug: "cultural",
            duration_days: 12,
            level: "Moderate",
            starting_price: 3800,
            image_url: "bhutan/main5.webp",
            trip_type: "Cultural",
            destination: "Central Bhutan",
            category: "Heritage",
            is_active: true
        },
        {
            id: 'nr1',
            title: "Nature Retreat",
            slug: "nature",
            duration_days: 10,
            level: "Easy",
            starting_price: 6500,
            image_url: "bhutan/main6.webp",
            trip_type: "Nature",
            destination: "Western Bhutan",
            category: "Wilderness",
            is_active: true
        },
        {
            id: 'bd1',
            title: "Bhutan Discovery",
            slug: "discovery",
            duration_days: 8,
            level: "Easy",
            starting_price: 2400,
            image_url: "bhutan/main4.webp",
            trip_type: "Discovery",
            destination: "Paro",
            category: "Classic",
            is_active: true
        },
        {
            id: 'bd-p',
            title: "Bhutan Discovery (Private Journey)",
            slug: "discovery-private",
            duration_days: 8,
            level: "Easy Active",
            starting_price: 2400,
            image_url: "bhutan/main4.webp",
            trip_type: "Private Journey",
            destination: "Paro",
            is_active: true
        },
        {
            id: 'ci-p',
            title: "Cultural Immersion (Private Journey)",
            slug: "cultural-private",
            duration_days: 12,
            level: "Cultural",
            starting_price: 3600,
            image_url: "bhutan/main5.webp",
            trip_type: "Private Journey",
            destination: "Central Bhutan",
            is_active: true
        },
        {
            id: 'nw-r',
            title: "Nature & Wellness Retreat",
            slug: "wellness",
            duration_days: 10,
            level: "Wellness",
            starting_price: 3000,
            image_url: "bhutan/main6.webp",
            trip_type: "Nature",
            destination: "Phobjikha",
            is_active: true
        },
        {
            id: 'bf-a',
            title: "Bhutan Family Adventure",
            slug: "family",
            duration_days: 10,
            level: "Family Friendly",
            starting_price: 3000,
            image_url: "bhutan/9.webp",
            trip_type: "Family",
            destination: "Western Bhutan",
            is_active: true
        },
        {
            id: 're-l',
            title: "Romantic Escape",
            slug: "romantic",
            duration_days: 10,
            level: "Luxury",
            starting_price: 3800,
            image_url: "bhutan/main4.webp",
            trip_type: "Luxury",
            destination: "Paro",
            is_active: true
        },
        {
            id: 'dp-t',
            title: "Druk Path Trek",
            slug: "druk-path",
            duration_days: 6,
            level: "Moderate",
            starting_price: 1800,
            image_url: "bhutan/main2.webp",
            trip_type: "Trek",
            destination: "Paro",
            is_active: true
        },
        {
            id: 'ft-c',
            title: "Festival Tours",
            slug: "festivals",
            duration_days: 10,
            level: "Cultural",
            starting_price: 3000,
            image_url: "bhutan/main5.webp",
            trip_type: "Cultural",
            destination: "Punakha",
            is_active: true
        }
    ];

    const fetchTrips = async () => {
        if (!supabase) {
            setAllTrips(DEMO_TRIPS);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('is_active', true);

        if (data && data.length > 0) {
            setAllTrips(data);
        } else {
            setAllTrips(DEMO_TRIPS);
        }
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
                                                <Link href={`/trips/${trip.slug}`} className="link-btn-small">View Trip</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
