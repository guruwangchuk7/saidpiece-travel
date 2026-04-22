'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useUI } from '@/contexts/UIContext';
import Link from 'next/link';

export default function BookingProcess() {
    const [settings, setSettings] = useState<any>({});
    const { setHeaderTheme } = useUI();

    useEffect(() => {
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
        <main className="booking-process-page pt-0">
            {/* 1. Hero Section */}
            <section className="story-hero-new">
                <div className="hero-bg-wrapper">
                    <Image
                        src="/images/bhutan/main2.webp"
                        alt="Seemless Planning"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="hero-overlay-subtle"></div>
                </div>
                <div className="container hero-content-center">
                    <h1 className="hero-title">Booking Process</h1>
                </div>
            </section>

            {/* 2. Intro Section - Refined Editorial Layout */}
            <section className="booking-intro-section section-padding">
                <div className="container">
                    <div className="max-w-4xl mx-auto border-y border-gray-100 py-16 text-center">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase mb-8 block">THE SAIDPIECE WAY</span>
                        <h2 className="section-title-serif !text-4xl md:!text-5xl mb-10 px-4">Seamless Planning, Tailored Results</h2>
                        <div className="relative inline-block px-12 md:px-20">
                            <p className="text-xl md:text-2xl font-serif italic text-black/80 leading-relaxed">
                                &quot;Ease is the hallmark of professional planning. We handle the complexity, so you can focus on the experience.&quot;
                            </p>
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <div className="h-[1px] w-8 bg-gray-200"></div>
                                <span className="text-[11px] font-bold tracking-widest text-black uppercase">Our Service Promise</span>
                                <div className="h-[1px] w-8 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Steps Section - Premium Alternating Layout */}

            {/* STEP 01 */}
            <section className="story-split-section section-padding-bottom">
                <div className="container grid-two-col align-center">
                    <div className="image-wrapper shadow-lg relative aspect-4-3 overflow-hidden">
                        <Image
                            src="/images/bhutan/13.webp"
                            alt="Personal Consultation"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="text-wrapper relative">
                        <span className="date-marker">STEP 01</span>
                        <h2 className="split-title">Personal Consultation</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                Every journey with {siteName} begins with a conversation. We don&apos;t believe in one-size-fits-all itineraries. Whether you start by browsing our curated trips or using our Trip Wizard, our experts reach out to understand your passions, pace, and purpose.
                            </p>
                            <p>
                                We discuss everything from seasonal nuances to physical comfort levels, ensuring that the draft itinerary is a true reflection of your vision for Bhutan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 02 */}
            <section className="grid-section section-padding bg-cream">
                <div className="container">
                    <div className="grid-two-images mb-12">
                        <div className="image-wrapper overflow-hidden shadow-md aspect-3-2 relative">
                            <Image src="/images/bhutan/14.webp" alt="Planning Details" fill className="object-cover" />
                        </div>
                        <div className="image-wrapper overflow-hidden shadow-md aspect-3-2 relative">
                            <Image src="/images/bhutan/15.webp" alt="Document Prep" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="container-narrow text-center">
                        <span className="date-marker !text-black/50">STEP 02</span>
                        <h2 className="section-title-serif !mt-2">Tailoring the Itinerary</h2>
                        <div className="story-text-content">
                            <p className="mb-4">
                                Once we have a foundation, the refinement begins. We hand-select accommodations—from luxury mountain lodges to authentic village farmstays—and choose the specific guides whose expertise best matches your interests.
                            </p>
                            <p>
                                This is also where we integrate special requests: private monastic blessings, helicopter transfers to remote valleys, or specialized photography permits. Your final itinerary is a bespoke document of discovery.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STEP 03 */}
            <section className="story-split-section section-padding">
                <div className="container grid-two-col alternate align-center">
                    <div className="text-wrapper pr-12">
                        <span className="date-marker">STEP 03</span>
                        <h2 className="split-title">Seamless Logistics</h2>
                        <div className="story-text-content">
                            <p className="mb-6">
                                Bhutan&apos;s visa process and flight logistics can be intricate. We handle everything. From your visa application and Sustainable Development Fee processing to booking Drukair or Bhutan Airlines flights, our team ensures every bureaucratic detail is perfect.
                            </p>
                            <p>
                                You receive a comprehensive pre-departure kit with everything from packing lists to cultural etiquette guides, so you can step off the plane in Paro feeling fully prepared and completely at ease.
                            </p>
                        </div>
                    </div>
                    <div className="image-wrapper shadow-lg overflow-hidden relative aspect-4-3">
                        <Image
                            src="/images/bhutan/16.webp"
                            alt="Arriving in Bhutan"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-banner-section section-padding-bottom">
                <div className="container-narrow text-center">
                    <div className="welcome-quote-block">
                        <h2 className="section-title-serif">Start Your Journey Today</h2>
                        <p className="italic-lead mb-10">
                            Ready to begin the process? Use our interactive Trip Wizard or browse our flagship itineraries to find your starting point. Our experts are standing by to guide you through every step.
                        </p>
                        <div className="flex justify-center gap-6">
                            <Link href="/wizard" className="btn btn-primary" style={{ padding: '18px 35px', fontSize: '11px', letterSpacing: '2px' }}>
                                START TRIP WIZARD
                            </Link>
                            <Link href="/browse" className="btn btn-outline-dark" style={{ padding: '18px 35px', fontSize: '11px', letterSpacing: '2px' }}>
                                BROWSE ITINERARIES
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
