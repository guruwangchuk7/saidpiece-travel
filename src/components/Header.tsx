'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsDestinationsOpen(true);
        }, 150);
    };

    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setIsDestinationsOpen(false);
        }, 150);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`global-header ${isScrolled ? 'state-light' : 'state-dark'}`}>
            {/* 2.1 Global Header & Navigation */}
            <div className="top-utility-bar">
                <div className="container">
                    <a href="#">1-800-368-2794</a>
                    <a href="#">Catalog</a>
                    <a href="#">Newsletter</a>
                    <a href="#">Contact Us</a>
                </div>
            </div>
            <div className="main-nav-bar">
                <div className="container nav-container-inner">
                    <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            src="/images/logo/saidpiecetravellogo.png"
                            alt="Saidpiece Travel Logo"
                            width={240}
                            height={80}
                            style={{ objectFit: 'contain', filter: isScrolled ? 'brightness(0)' : 'brightness(0) invert(1)', transition: 'filter 0.3s ease' }}
                            priority
                        />
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li className="nav-item" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
                                <button className="nav-button" aria-expanded={isDestinationsOpen} aria-controls="mega-menu-destinations">
                                    Destinations
                                    <svg className={`chevron ${isDestinationsOpen ? 'rotate' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                                <div id="mega-menu-destinations" className={`mega-menu-panel ${isDestinationsOpen ? 'is-open' : ''}`}>
                                    <div className="mega-menu-col">
                                        <ul>
                                            <li><a href="#">Western Bhutan</a></li>
                                            <li><a href="#">Eastern Bhutan</a></li>
                                            <li><a href="#">Central Bhutan</a></li>
                                            <li><a href="#">North Bhutan</a></li>
                                            <li><a href="#">South Bhutan</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li><a href="#">Browse Trips</a></li>
                            <li><a href="#">Trip Wizard</a></li>
                            <li><a href="#">Inspiration</a></li>
                            <li><a href="#">About WT</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}
