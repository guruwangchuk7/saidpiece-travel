'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useUI } from '@/contexts/UIContext';

export default function OurStory() {
    const [settings, setSettings] = useState<any>({});
    const { setHeaderTheme } = useUI();

    useEffect(() => {
        // We use 'auto' to allow the header to be transparent (state-dark) over our hero image.
        // We will ensure visibility by adding a dark gradient overlay in the CSS.
        setHeaderTheme('auto');
        
        const fetchSettings = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('site_settings').select('*');
            if (data) {
                const s: any = {};
                data.forEach(item => s[item.setting_key] = item.setting_value);
                setSettings(s);
            }
        };
        fetchSettings();
    }, [setHeaderTheme]);

    const siteName = settings.site_name || 'Saidpiece Travel';

    return (
        <main className="our-story-page pt-0">
            {/* Hero Section - Using main2.webp from the project's public/images directory */}
            <section className="story-hero-new">
                <div className="hero-bg-wrapper">
                    <Image
                        src="/images/bhutan/main2.webp"
                        alt="Our Story Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">Our Story</h1>
                </div>
            </section>

            {/* Intro Section */}
            <section className="welcome-section section-padding">
                <div className="container-narrow">
                    <h2 className="section-title-serif text-center">Welcome to Our World of Adventure</h2>
                    <div className="welcome-quote-block">
                        <p className="italic-lead">
                            {settings.story_quote || "There are a handful of adventure travel companies that really define the genre. Saidpiece Travel is among them. The company creates extraordinary itineraries, has legions of repeat travelers and has a knack for discovering or rediscovering lost corners of the earth."}
                        </p>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="story-split-section section-padding-bottom">
                <div className="container grid-two-col align-center">
                    <div className="image-wrapper shadow-lg relative aspect-4-3 overflow-hidden">
                        <Image 
                            src="/images/bhutan/13.webp" 
                            alt="Early Expeditions" 
                            fill
                            className="object-cover" 
                        />
                    </div>
                    <div className="text-wrapper relative">
                        {/* Circular Stamp */}
                        <div className="est-badge">
                            <svg viewBox="0 0 100 100" className="w-full h-full">
                                <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                                <text>
                                    <textPath xlinkHref="#circlePath" className="badge-text" startOffset="0%">
                                        ESTABLISHED 1978 • {siteName.toUpperCase()} • ESTABLISHED 1978 • {siteName.toUpperCase()} • 
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                        <h2 className="split-title">The Story of {siteName}</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                {settings.story_body_1 || `Saidpiece Travel's founder, Pema Nyamdrol, literally grew up a traveler, moving from Thimphu to the valleys of Bumthang at a tender age. Pema would go on to spend his entire childhood living in a variety of Himalayan regions and has been a devoted world traveler ever since.`}
                            </p>
                            <p>
                                In his early 20s, he spent years as a young adventurer, amateur mountaineer, and
                                aspiring photographer trekking completely around the kingdom. He dedicated himself to getting as far off the beaten
                                path as possible by concentrating on Bhutan's most remote mountains
                                and wilderness regions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Early Days Grid */}
            <section className="grid-section section-padding bg-cream">
                <div className="container">
                    <div className="grid-two-images mb-12">
                        <div className="image-wrapper transition-all duration-500 overflow-hidden shadow-md aspect-3-2 relative">
                             <Image src="/images/bhutan/7.webp" alt="Historic Basecamp" fill className="object-cover" />
                        </div>
                        <div className="image-wrapper transition-all duration-500 overflow-hidden shadow-md aspect-3-2 relative">
                             <Image src="/images/bhutan/8.webp" alt="First Expedition" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="container-narrow text-center">
                        <div className="story-text-content">
                            <p className="mb-4">
                                {siteName} opened its doors in 1978 in a tiny office in Thimphu, with a desk made of a
                                spare hollow-core door set across two filing cabinets. The founding vision was to provide travelers the opportunity to enjoy some truly off-the-map expeditions in the company of hand-picked local insiders who knew all the secrets of an undiscovered realm.
                            </p>
                            <p>
                                The first trips were truly expeditionary in spirit, including a "live-off-the-land" expedition traversing
                                the high passes of the Snowman Trek, and the first commercial group to cross the high ridges of the Black Mountains.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expansion Row */}
            <section className="grid-section section-padding">
                <div className="container">
                    <div className="grid-three-images mb-12">
                        <div className="overflow-hidden shadow-sm aspect-square relative">
                            <Image src="/images/bhutan/9.webp" alt="Traditional Culture" fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden shadow-sm aspect-square relative">
                            <Image src="/images/bhutan/10.webp" alt="Local Encounters" fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden shadow-sm aspect-square relative">
                            <Image src="/images/bhutan/11.webp" alt="Mountain Vistas" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="container-narrow text-center">
                        <p className="italic-lead !text-lg !leading-relaxed">
                            As {siteName} has evolved and expanded through the years, we have had the honor of working with some of
                            the world's leading researchers, explorers, and conservationists. Every trip we design is a chapter in an ongoing story of discovery and mutual respect—protecting what is sacred while opening our world to mindful explorers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Today Section */}
            <section className="story-split-section section-padding-bottom">
                <div className="container grid-two-col alternate align-center">
                    <div className="text-wrapper pr-12">
                        <h2 className="split-title">{siteName} Today</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                {settings.story_body_2 || `From this pioneering beginning, our commitment to offering our guests the most innovative and active travel experiences has remained steadfast. Throughout our 45+ year history, we have remained true to concentrating on the quality, design, and unique spirit of the trips themselves.`}
                            </p>
                            <p>
                                Based in Thimphu, we are a Bhutan-based team of specialists who bridge the gap between global curiosity and Himalayan wisdom. We maintain a deep commitment to operate these exotic adventures in an environmentally responsible, low-impact manner, ensuring that the magic of Bhutan is preserved for generations to come.
                            </p>
                        </div>
                    </div>
                    <div className="image-wrapper shadow-lg overflow-hidden relative aspect-4-3">
                        <Image 
                            src="/images/bhutan/main6.webp" 
                            alt="The Saidpiece Team" 
                            fill
                            className="object-cover" 
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
