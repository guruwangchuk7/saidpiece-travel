'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Header({ theme = 'auto', children }: { theme?: 'auto' | 'light', children?: React.ReactNode }) {
    const { user, signInWithGoogle, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isLightState = theme === 'light' || isScrolled || openMenu !== null || (isMobileMenuOpen && isMounted);

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

    // Close mobile menu on orientation change or large screen
    useEffect(() => {
        const raf = requestAnimationFrame(() => setIsMounted(true));
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Placeholder image that implies travel
    const placeholderImg = '/images/bhutan/main1.JPG';

    return (
        <>
            {/* Global Menu Overlay */}
            <div className={`menu-overlay ${openMenu && isMounted ? 'is-active' : ''}`} />

            {/* Mobile Nav Drawer */}
            <div className={`mobile-nav-drawer ${isMobileMenuOpen && isMounted ? 'is-open' : ''}`}>
                <nav className="mobile-nav-links">
                    <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)}>Destinations</Link>
                    <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)}>Browse Trips</Link>
                    <Link href="/wizard" onClick={() => setIsMobileMenuOpen(false)}>Trip Wizard</Link>
                    <Link href="/about/our-story" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
                </nav>
                <div className="mobile-nav-bottom">
                    <a href="tel:1-800-368-2794">1-800-368-2794</a>
                    {user ? (
                        <button onClick={() => signOut()} className="nav-button">Logout</button>
                    ) : (
                        <button onClick={() => signInWithGoogle()} className="nav-button">Login</button>
                    )}
                </div>
            </div>

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
                                    className="header-logo-img"
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
                            <button
                                className="mobile-menu-btn"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle Menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? (
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                ) : (
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="3" y1="12" x2="21" y2="12"></line>
                                        <line x1="3" y1="6" x2="21" y2="6"></line>
                                        <line x1="3" y1="18" x2="21" y2="18"></line>
                                    </svg>
                                )}
                            </button>
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
                                <li className="nav-auth-item" style={{ marginLeft: '10px' }}>
                                    {user ? (
                                        <button onClick={() => signOut()} className="nav-button text-xs" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.7 }}>
                                            Logout ({user.email?.split('@')[0]})
                                        </button>
                                    ) : (
                                        <button onClick={() => signInWithGoogle()} className="nav-button" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', opacity: 0.7 }}>
                                            Login
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* A. Destinations Menu */}
                    <div className={`mega-menu-full mega-menu-destinations ${openMenu === 'destinations' && isMounted ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('destinations')} onMouseLeave={handleMouseLeave}>
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
                                    <a href="/browse" className="btn btn-outline" style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>View All</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* B. Browse Trips Menu */}
                    <div className={`mega-menu-full mega-menu-browse ${openMenu === 'browse' && isMounted ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('browse')} onMouseLeave={handleMouseLeave}>
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
                                    <a href="/browse" className="btn btn-outline" style={{ borderColor: 'var(--color-brand)', color: 'var(--color-brand)' }}>View All</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* C. Inspiration Menu */}
                    <div className={`mega-menu-full mega-menu-inspiration ${openMenu === 'inspiration' && isMounted ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('inspiration')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container hybrid-layout">
                            <div className="mega-left-image">
                                <Image src="/images/bhutan/main2.JPG" alt="Striking vertical landscape" fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className="mega-col mega-mid-col">
                                <h5>Explore</h5>
                                <ul className="mega-list">
                                    <li><Link href="/browse?filter=popular">Most Popular</Link></li>
                                    <li><Link href="/browse?filter=offers">Special Offers</Link></li>
                                    <li><Link href="#">Travel Blog</Link></li>
                                    <li><Link href="/browse?filter=new">New Trips</Link></li>
                                </ul>
                            </div>
                            <div className="mega-col mega-right-col">
                                <h5>Top 10 Curated</h5>
                                <ul className="mega-list-curated">
                                    <li><Link href="/trips/bhutan-discovery">Bhutan Discovery</Link></li>
                                    <li><Link href="/trips/cultural-immersion">Cultural Immersion</Link></li>
                                    <li><Link href="/trips/bhutan-family-adventure">Bhutan Family Adventure</Link></li>
                                    <li><Link href="/trips/nature-retreat">Nature Retreat</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* D. About Us Menu */}
                    <div className={`mega-menu-full mega-menu-about ${openMenu === 'about' && isMounted ? 'is-open' : ''}`} onMouseEnter={() => handleMouseEnter('about')} onMouseLeave={handleMouseLeave}>
                        <div className="mega-menu-container about-layout">
                            <div className="mega-about-links">
                                <ul className="mega-list-large">
                                    <li><Link href="/about/our-story">Our Story</Link></li>
                                    <li><Link href="/about/responsible-travel">Responsible Travel</Link></li>
                                    <li><Link href="/about/local-expertise">Local Expertise</Link></li>
                                    <li><Link href="/about/booking-process">Booking Process</Link></li>
                                    <li><Link href="/about/meet-our-team">Meet Our Team</Link></li>
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
