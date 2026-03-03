'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* 2.1 Global Header & Navigation */}
            <div className="top-utility-bar">
                <div className="container">
                    <a href="#">1-800-368-2794</a>
                    <a href="#">Catalog</a>
                    <a href="#">Newsletter</a>
                    <a href="#">Contact Us</a>
                </div>
            </div>
            <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container nav-container">
                    <div className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                            src="/images/logo/saidpiecetravellogo.png"
                            alt="Saidpiece Travel Logo"
                            width={180}
                            height={60}
                            style={{ objectFit: 'contain', filter: 'brightness(0)' }}
                            priority
                        />
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li style={{ position: 'relative' }}>
                                <a href="#">Destinations</a>
                                <div className="mega-menu">
                                    <div className="mega-menu-col">
                                        <h5>Africa</h5>
                                        <ul>
                                            <li><a href="#">Botswana</a></li>
                                            <li><a href="#">Egypt</a></li>
                                            <li><a href="#">Kenya</a></li>
                                            <li><a href="#">Morocco</a></li>
                                            <li><a href="#">Namibia</a></li>
                                            <li><a href="#">Tanzania</a></li>
                                        </ul>
                                    </div>
                                    <div className="mega-menu-col">
                                        <h5>Asia & Pacific</h5>
                                        <ul>
                                            <li><a href="#">Bhutan</a></li>
                                            <li><a href="#">India</a></li>
                                            <li><a href="#">Japan</a></li>
                                            <li><a href="#">Nepal</a></li>
                                            <li><a href="#">New Zealand</a></li>
                                            <li><a href="#">Vietnam</a></li>
                                        </ul>
                                    </div>
                                    <div className="mega-menu-col">
                                        <h5>Europe</h5>
                                        <ul>
                                            <li><a href="#">Alps</a></li>
                                            <li><a href="#">France</a></li>
                                            <li><a href="#">Greece</a></li>
                                            <li><a href="#">Iceland</a></li>
                                            <li><a href="#">Italy</a></li>
                                            <li><a href="#">Spain</a></li>
                                        </ul>
                                    </div>
                                    <div className="mega-menu-col">
                                        <h5>Americas</h5>
                                        <ul>
                                            <li><a href="#">Alaska</a></li>
                                            <li><a href="#">American West</a></li>
                                            <li><a href="#">Costa Rica</a></li>
                                            <li><a href="#">Galapagos</a></li>
                                            <li><a href="#">Patagonia</a></li>
                                            <li><a href="#">Peru</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li><a href="#">Browse Trips</a></li>
                            <li><a href="#">Inspiration</a></li>
                            <li><a href="#">About WT</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}
