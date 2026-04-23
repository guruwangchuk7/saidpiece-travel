'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Testimonial {
    id: string;
    content: string;
    client_name: string;
    role: string;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const hardcodedFallback = [
        {
            content: "The entire trip was perfectly orchestrated. Our guide was incredibly knowledgeable and passionate, making every day an unforgettable adventure.",
            client_name: "Sarah Mitchell",
            role: "San Francisco, CA"
        },
        {
            content: "Saidpiece Travel exceeded every expectation. The level of detail and care in the itinerary design made for a truly immersive and stress-free journey.",
            client_name: "Robert Chen",
            role: "London, UK"
        }
    ];

    useEffect(() => {
        const fetchTestimonials = async () => {
            if (!supabase) return;
            const { data } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });
                
            if (data && data.length > 0) {
                setTestimonials(data);
            } else {
                setTestimonials(hardcodedFallback as any);
            }
            setLoading(false);
        };
        fetchTestimonials();
    }, []);

    const nextTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1 + testimonials.length) % testimonials.length);
    };

    if (loading || testimonials.length === 0) return null;

    return (
        <section className="testimonials-section">
            <div className="container testimonial-flex-container">
                <button className="testimonial-nav-btn prev" onClick={prevTestimonial} aria-label="Previous testimonial">&lt;</button>

                <div className="testimonial-text-content">
                    <div className="testimonial-quote">&quot;{testimonials[testimonialIndex].content}&quot;</div>
                    <div className="testimonial-author">{testimonials[testimonialIndex].client_name}</div>
                    <div className="testimonial-location">{testimonials[testimonialIndex].role}</div>
                </div>

                <button className="testimonial-nav-btn next" onClick={nextTestimonial} aria-label="Next testimonial">&gt;</button>
            </div>
        </section>
    );
}
