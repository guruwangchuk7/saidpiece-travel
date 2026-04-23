'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface TravelStyle {
    name: string;
    image_url: string;
}

export default function TravelStyles() {
    const [styles, setStyles] = useState<TravelStyle[]>([]);
    const [loading, setLoading] = useState(true);
    const carouselRef = useRef<HTMLDivElement>(null);

    const hardcodedFallback = [
        { name: 'Discovery', image_url: 'bhutan/7.webp' },
        { name: 'Romantic Escape', image_url: 'bhutan/12.webp' },
        { name: 'Cultural Immersion', image_url: 'bhutan/8.webp' },
        { name: 'Nature Retreat', image_url: 'bhutan/11.webp' },
        { name: 'Family Adventure', image_url: 'bhutan/9.webp' },
        { name: 'Festival Tours', image_url: 'bhutan/10.webp' },
        { name: 'Trekking & Hiking', image_url: 'bhutan/13.webp' }
    ];

    useEffect(() => {
        const fetchStyles = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('travel_styles')
                .select('*')
                .order('sort_order', { ascending: true });
                
            if (data && data.length > 0) {
                setStyles(data);
            } else {
                setStyles(hardcodedFallback);
            }
            setLoading(false);
        };
        fetchStyles();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            const scrollAmount = direction === 'left' ? -400 : 400;

            if (direction === 'left' && scrollLeft <= 0) {
                carouselRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
            } else if (direction === 'right' && Math.ceil(scrollLeft + clientWidth) >= scrollWidth) {
                carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const normalizeImageUrl = (url: string): string => {
        if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
        return `/images/${url}`;
    };

    if (loading && styles.length === 0) return null;

    return (
        <section className="styles-section" style={{ position: 'relative', overflow: 'hidden', paddingBottom: '60px' }}>
            <div className="container">
                <div className="section-header-row">
                    <h2>Crafting Trips for Every Travel Style</h2>
                    <Link href="/browse" className="link-btn">Browse All Trips</Link>
                </div>
            </div>

            <div className="carousel-full-width-wrapper" style={{ position: 'relative' }}>
                <button
                    className="carousel-nav-btn prev"
                    onClick={() => scroll('left')}
                    aria-label="Previous trips"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                <div className="styles-carousel" ref={carouselRef}>
                    {[...styles, ...styles].map((style, i) => (
                        <Link href={`/browse?type=${style.name.toLowerCase().replace(/ /g, '-')}`} className="style-card" key={i} aria-label={`Browse ${style.name} trips`}>
                            <div className="image-placeholder">
                                <Image src={normalizeImageUrl(style.image_url)} alt={style.name} fill sizes="(max-width: 768px) 80vw, 320px" style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="style-overlay">
                                <h3 className="style-title">{style.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                <button
                    className="carousel-nav-btn next"
                    onClick={() => scroll('right')}
                    aria-label="Next trips"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>
        </section>
    );
}
