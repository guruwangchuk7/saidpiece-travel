'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const travelStyles = [
    { name: 'Discovery', image: 'bhutan/7.webp' },
    { name: 'Cultural Immersion', image: 'bhutan/8.webp' },
    { name: 'Family Adventure', image: 'bhutan/9.webp' },
    { name: 'Festival Tours', image: 'bhutan/10.webp' },
    { name: 'Nature Retreat', image: 'bhutan/11.webp' },
    { name: 'Romantic Escape', image: 'bhutan/12.webp' }
];

export default function TravelStyles() {
    const carouselRef = useRef<HTMLDivElement>(null);

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
                    {[...travelStyles, ...travelStyles].map((style, i) => (
                        <Link href={`/browse?type=${style.name.toLowerCase().replace(/ /g, '-')}`} className="style-card" key={i} aria-label={`Browse ${style.name} trips`}>
                            <div className="image-placeholder">
                                <Image src={`/images/${style.image}`} alt={style.name} fill sizes="(max-width: 768px) 80vw, 320px" style={{ objectFit: 'cover' }} />
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
