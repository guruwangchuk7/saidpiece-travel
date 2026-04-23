'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface Service {
    title: string;
    description: string;
    link_text: string;
    link_url: string;
    image_url: string;
}

export default function Services() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    const hardcodedFallback = [
        { title: 'Care', description: 'Every journey is designed with deep care— from the pacing of the itinerary to the comfort of our boutique stays and the character of our private guides.', link_text: 'Our Approach', link_url: '/about/care', image_url: 'bhutan/18.webp' },
        { title: 'Respect', description: 'Our trips are locally rooted, ensuring every interaction is culturally respectful. We protect Bhutan’s sacred traditions while sharing its living culture with you.', link_text: 'Our Stewardship', link_url: '/about/responsible-travel', image_url: 'bhutan/19.webp' },
        { title: 'Connection', description: 'We bridge the gap between global curiosity and Himalayan wisdom, helping you connect deeply with the people, rituals, and stories of Bhutan.', link_text: 'Our Stories', link_url: '/about/our-story', image_url: 'bhutan/20.webp' }
    ];

    useEffect(() => {
        const fetchServices = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('homepage_services')
                .select('*')
                .order('sort_order', { ascending: true });
                
            if (data && data.length > 0) {
                setServices(data);
            } else {
                setServices(hardcodedFallback);
            }
            setLoading(false);
        };
        fetchServices();
    }, []);

    const normalizeImageUrl = (url: string): string => {
        if (url.startsWith('http') || url.startsWith('/') || url.startsWith('data:')) return url;
        return `/images/${url}`;
    };

    if (loading && services.length === 0) return null;

    return (
        <section className="service-section">
            <div className="container">
                <h2>What Makes Saidpiece Different</h2>
                <div className="service-grid">
                    {services.map((service, i) => (
                        <div className="service-item" key={i}>
                            <div className="image-placeholder" style={{ position: 'relative', background: 'transparent' }}>
                                <Image 
                                    src={normalizeImageUrl(service.image_url)} 
                                    alt={service.title} 
                                    fill 
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                    style={{ objectFit: 'cover', borderRadius: '4px' }} 
                                />
                            </div>
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                            {service.link_text && (
                                <Link href={service.link_url} className="link-btn">{service.link_text}</Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
