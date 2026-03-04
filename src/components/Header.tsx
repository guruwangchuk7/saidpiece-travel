'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header({ theme = 'auto', children }: { theme?: 'auto' | 'light', children?: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isLightState = theme === 'light' || isScrolled || openMenu !== null;

    const handleMouseEnter = (menuId: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenMenu(menuId);
        }, 150);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
        }, 150);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Placeholder image that implies travel
    const placeholderImg = '/images/bhutan/main1.JPG';

    return (
        <>
            {/* Global Menu Overlay */}
            <div className={`menu-overlay ${openMenu ? 'is-active' : ''}`} />

            {/* Sticky Contact Button */}
            <Link href="/contact" className="sticky-contact-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Us
            </Link>

            <header className={`global-header ${isLightState ? 'state-light' : 'state-dark'}`}>
                {/* Global Header & Navigation */}
                <div className="top-utility-bar">
                    <div className="container">
                        <a href="#">1-800-368-2794</a>
                        <a href="#">Catalog</a>
                        <a href="#">Newsletter</a>
                        <Link href="/contact">Contact Us</Link>
                    </div>
                </div>
                <div className="main-nav-bar" style={{ position: 'relative' }}>
                    <div className="container nav-container-inner">
                        <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
                            <Link href="/">
                                <Image
                                    src="/images/logo/saidpiecetravellogo.png"
                                    alt="Saidpiece Travel Logo"
                                    width={240}
                                    height={80}
                                    style={{
                                        objectFit: 'contain',
                                        filter: isLightState ? 'brightness(0)' : 'brightness(0) invert(1)',
                                        transition: 'filter 0.3s ease'
                                    }}
                                    priority
                                />
                            </Link>
                        </div>
                        <nav>
                            <ul className="nav-links">
                                <li className="nav-item static-nav-item" onMouseEnter={() => handleMouseEnter('destinations')} onMouseLeave={handleMouseLeave}>
                                    <button className={`nav-button ${openMenu === 'destinations' ? 'is-open' : ''}`} aria-expanded={openMenu === 'destinations'}>
                                        Destinations
                                        <svg className={`chevron ${openMenu === 'destinations' ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </li>
                                <li className="nav-item static-nav-item" onMouseEnter={() => handleMouseEnter('browse')} onMouseLeave={handleMouseLeave}>
                                    <button className={`nav-button ${openMenu === 'browse' ? 'is-open' : ''}`} aria-expanded={openMenu === 'browse'}>
                                        Browse Trips
                                        <svg className={`chevron ${openMenu === 'browse' ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </li>
                                <li><a href="/wizard">Trip Wizard</a></li>
                                <li className="nav-item static-nav-item" onMouseEnter={() => handleMouseEnter('inspiration')} onMouseLeave={handleMouseLeave}>
                                    <button className={`nav-button ${openMenu === 'inspiration' ? 'is-open' : ''}`} aria-expanded={openMenu === 'inspiration'}>
                                        Inspiration
                                        <svg className={`chevron ${openMenu === 'inspiration' ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </li>
                                <li className="nav-item static-nav-item" onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                                    <button className={`nav-button ${openMenu === 'about' ? 'is-open' : ''}`} aria-expanded={openMenu === 'about'}>
                                        About Us
                                        <svg className={`chevron ${openMenu === 'about' ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </li>
                                <li className="nav-search-icon">
                                    <button aria-label="Search" className="nav-button">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* A. Destinations Menu */}
                    <div className={`mega-menu-full mega-menu-destinations ${openMenu === 'destinations' ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('destinations')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container">
                            <div className="destinations-left">
                                <ul className="mega-list">
                                    <li><a href="#">Paro Valley</a></li>
                                    <li><a href="#">Thimphu</a></li>
                                    <li><a href="#">Punakha</a></li>
                                    <li><a href="#">Bumthang</a></li>
                                    <li><a href="#">Gangtey & Phobjikha</a></li>
                                    <li><a href="#">Haa Valley</a></li>
                                    <li><a href="#">Eastern Bhutan</a></li>
                                </ul>
                            </div>
                            <div className="destinations-right">
                                <div className="feature-content">
                                    <h3>Explore All Destinations</h3>
                                    <a href="#" className="btn btn-outline" style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>View All</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. Browse Trips Menu */}
                    <div className={`mega-menu-full mega-menu-browse ${openMenu === 'browse' ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('browse')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container">
                            <div className="browse-left three-col">
                                <div className="mega-col">
                                    <h5>By Trip Type</h5>
                                    <ul className="mega-list">
                                        <li><a href="#">Private Journeys</a></li>
                                        <li><a href="#">Family Adventures</a></li>
                                        <li><a href="#">Festival Tours</a></li>
                                        <li><a href="#">Romantic Escapes</a></li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h5>By Activity</h5>
                                    <ul className="mega-list">
                                        <li><a href="#">Cultural</a></li>
                                        <li><a href="#">Hiking & Trekking</a></li>
                                        <li><a href="#">Wildlife Safaris</a></li>
                                        <li><a href="#">Photography</a></li>
                                    </ul>
                                </div>
                                <div className="mega-col mega-col-months">
                                    <h5>By Month</h5>
                                    <div className="month-grid">
                                        <a href="#">January</a> <a href="#">February</a>
                                        <a href="#">March</a> <a href="#">April</a>
                                        <a href="#">May</a> <a href="#">June</a>
                                        <a href="#">July</a> <a href="#">August</a>
                                        <a href="#">September</a> <a href="#">October</a>
                                        <a href="#">November</a> <a href="#">December</a>
                                    </div>
                                </div>
                            </div>
                            <div className="destinations-right" style={{ background: `url(${placeholderImg}) center/cover no-repeat`, marginLeft: '50px' }}>
                                <div className="feature-content" style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '40px', borderRadius: '4px' }}>
                                    <h3>Find Your Perfect Trip</h3>
                                    <a href="#" className="btn btn-outline" style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>View All</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* C. Inspiration Menu */}
                    <div className={`mega-menu-full mega-menu-inspiration ${openMenu === 'inspiration' ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('inspiration')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container hybrid-layout">
                            <div className="mega-left-image">
                                <Image src="/images/bhutan/main2.JPG" alt="Striking vertical landscape" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="mega-col mega-mid-col">
                                <h5>Explore</h5>
                                <ul className="mega-list">
                                    <li><a href="#">Most Popular</a></li>
                                    <li><a href="#">Special Offers</a></li>
                                    <li><a href="#">Travel Blog</a></li>
                                    <li><a href="#">New Trips</a></li>
                                </ul>
                            </div>
                            <div className="mega-col mega-right-col">
                                <h5>Top 10 Curated</h5>
                                <ul className="mega-list-curated">
                                    <li><a href="#">Bhutan Discovery</a></li>
                                    <li><a href="#">Cultural Immersion</a></li>
                                    <li><a href="#">Bhutan Family Adventure</a></li>
                                    <li><a href="#">Nature Retreat</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* D. About Us Menu */}
                    <div className={`mega-menu-full mega-menu-about ${openMenu === 'about' ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container about-layout">
                            <div className="mega-about-links">
                                <ul className="mega-list-large">
                                    <li><Link href="/about/our-story">Our Story</Link></li>
                                    <li><Link href="/about/responsible-travel">Responsible Travel</Link></li>
                                    <li><Link href="/about/local-expertise">Local Expertise</Link></li>
                                    <li><Link href="/about/booking-process">Booking Process</Link></li>
                                </ul>
                            </div>
                            <div className="mega-about-bg">
                                <Image src={placeholderImg} alt="Hiker on ridge" fill style={{ objectFit: 'cover' }} />
                            </div>
                        </div>
                    </div>
                </div>
                {children}
            </header>
        </>
    );
}
