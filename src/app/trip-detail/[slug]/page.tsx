'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface Trip {
    id: string;
    title: string;
    duration_days: number;
    duration_nights: number;
    starting_price: number;
    level: string;
    image_url: string;
    description: string;
    meta_title?: string;
    meta_description?: string;
}

interface ItineraryItem {
    day_number: number;
    title: string;
    description: string;
    accommodation?: string;
    meals?: string;
}

export default function DynamicTripDetail() {
    const { slug } = useParams();
    const router = useRouter();
    const { user, signInWithGoogle } = useAuth();
    
    const [trip, setTrip] = useState<Trip | null>(null);
    const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [openDay, setOpenDay] = useState<number | null>(1);

    useEffect(() => {
        const fetchTripData = async () => {
            if (!supabase || !slug) return;
            setLoading(true);

            // Fetch main trip
            const { data: tripData, error: tripError } = await supabase
                .from('trips')
                .select('*')
                .eq('slug', slug)
                .single();

            if (tripError || !tripData) {
                console.error('Trip not found:', tripError);
                setLoading(false);
                return;
            }

            setTrip(tripData);

            // Fetch itinerary
            const { data: itinData } = await supabase
                .from('trip_itineraries')
                .select('*')
                .eq('trip_id', tripData.id)
                .order('day_number', { ascending: true });

            setItinerary(itinData || []);
            setLoading(false);
        };

        fetchTripData();
    }, [slug]);

    const handleBookOnline = () => {
        if (!user) {
            const destination = `/confirm-pay?tripId=${trip?.id || ''}&trip=${encodeURIComponent(trip?.title || '')}&amount=${trip?.starting_price || 0}`;
            localStorage.setItem('booking_redirect', destination);
            signInWithGoogle();
        } else {
            router.push(`/confirm-pay?tripId=${trip?.id || ''}&trip=${encodeURIComponent(trip?.title || '')}&amount=${trip?.starting_price || 0}`);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading your adventure...</div>;
    if (!trip) return <div style={{ padding: '100px', textAlign: 'center' }}>Trip not found. <Link href="/browse" style={{ color: '#008080', fontWeight: 'bold' }}>Browse all trips</Link></div>;

    const toggleAccordion = (day: number) => {
        setOpenDay(openDay === day ? null : day);
    };

    return (
        <main className="trip-detail-page">

            <div className="trip-hero">
                <Image src={trip.image_url.startsWith('http') ? trip.image_url : `/images/${trip.image_url}`} alt={trip.title} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
                <div className="trip-hero-overlay"></div>

                <div className="trip-hero-content container">
                    <h1>{trip.title}</h1>
                    <p className="hero-subtitle">{trip.meta_description || "An immersive journey to the heart of Bhutan"}</p>
                </div>

                <div className="quick-info-bar">
                    <div className="container quick-info-grid">
                        <div className="quick-info-items">
                            <div className="quick-info-item">
                                <span className="label">Location</span>
                                <span className="value">Bhutan</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Duration</span>
                                <span className="value">{trip.duration_days} Days / {trip.duration_nights || trip.duration_days - 1} Nights</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Starting From</span>
                                <span className="value">${trip.starting_price}</span>
                            </div>
                            <div className="quick-info-item">
                                <span className="label">Level</span>
                                <span className="value">{trip.level}</span>
                            </div>
                        </div>
                        <div className="quick-info-ctas">
                            <button className="btn btn-primary" style={{ backgroundColor: '#fff', color: '#111' }} onClick={handleBookOnline}>CONFIRM BOOKING</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container trip-content-layout">
                <aside className="trip-sidebar">
                    <nav className="sticky-nav">
                        <ul>
                            <li className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</li>
                            <li className={activeTab === 'itinerary' ? 'active' : ''} onClick={() => setActiveTab('itinerary')}>Itinerary</li>
                            <li className={activeTab === 'dates' ? 'active' : ''} onClick={() => setActiveTab('dates')}>Pricing</li>
                        </ul>
                    </nav>
                </aside>

                <div className="trip-main-content">
                    <section id="overview" className={`content-section ${activeTab === 'overview' ? 'active' : 'hidden'}`}>
                        <h2>Journey Overview</h2>
                        <p className="lead-text">{trip.description}</p>
                        
                        <div className="highlights-box">
                            <h3>Trip Experience</h3>
                            <ul className="highlights-list">
                                <li><strong>Expert</strong> local guiding & storytelling</li>
                                <li><strong>Boutique</strong> accommodation selected for character</li>
                                <li><strong>Seamless</strong> private transfers throughout Bhutan</li>
                                <li><strong>All-inclusive</strong> Sustainable Development Fee (SDF)</li>
                            </ul>
                        </div>
                    </section>

                    <section id="itinerary" className={`content-section ${activeTab === 'itinerary' ? 'active' : 'hidden'}`}>
                        <h2>Detailed Itinerary</h2>
                        
                        <div className="itinerary-accordion">
                            {itinerary.map((item) => (
                                <div key={item.day_number} className={`accordion-item ${openDay === item.day_number ? 'open' : ''}`}>
                                    <button className="accordion-header" onClick={() => toggleAccordion(item.day_number)}>
                                        <div className="day-badge">Day {item.day_number}</div>
                                        <span className="day-title">{item.title}</span>
                                        <svg className={`chevron ${openDay === item.day_number ? 'rotate' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </button>
                                    <div className="accordion-content">
                                        <p>{item.description}</p>
                                        {(item.accommodation || item.meals) && (
                                            <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                                                {item.accommodation && <div><strong>Overnight:</strong> {item.accommodation}</div>}
                                                {item.meals && <div><strong>Meals:</strong> {item.meals}</div>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {itinerary.length === 0 && <p style={{ color: '#999', padding: '20px' }}>Loading itinerary details...</p>}
                        </div>
                    </section>

                    <section id="dates" className={`content-section ${activeTab === 'dates' ? 'active' : 'hidden'}`}>
                        <h2>Pricing Detail</h2>
                        <div style={{ background: '#fcfaf7', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ fontSize: '14px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Rate</span>
                                <div style={{ fontSize: '32px', fontWeight: '900' }}>From ${trip.starting_price}</div>
                            </div>
                            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>Our pricing is transparent and includes the Bhutanese Sustainable Development Fee (SDF), visa processing, full-time private guide, logistics, and boutique stays. 10% of every journey supports local educational initiatives in Bhutan.</p>
                            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={handleBookOnline}>PROCEED TO BOOKING</button>
                        </div>
                    </section>
                </div>
            </div>

        </main>
    );
}

