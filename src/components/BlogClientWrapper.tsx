'use client';

import { useState, useEffect } from 'react';
import HeaderThemeHandler from '@/components/HeaderThemeHandler';

export default function BlogClientWrapper({ children }: { children: React.ReactNode }) {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (windowHeight > 0) {
                const scroll = `${totalScroll / windowHeight}`;
                setScrollProgress(parseFloat(scroll) * 100);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <HeaderThemeHandler theme="light" />
            
            {/* Scroll Progress Bar */}
            <div className="scroll-progress-container" style={{
                position: 'fixed', top: '90px', left: 0, width: '100%', height: '3px', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.05)'
            }}>
                <div className="scroll-progress-bar" style={{
                    height: '100%', backgroundColor: 'var(--color-brand)', width: `${scrollProgress}%`, transition: 'width 0.1s ease-out'
                }} />
            </div>

            {children}
        </>
    );
}
