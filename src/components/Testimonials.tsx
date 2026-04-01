'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Testimonial {
    id: string;
    quote: string;
    author: string;
    location: string;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const hardcodedFallback = [
        {
            quote: "The entire trip was perfectly orchestrated. Our guide was incredibly knowledgeable and passionate, making every day an unforgettable adventure.",
            author: "Sarah Mitchell",
            location: "San Francisco, CA"
        },
        {
            quote: "Saidpiece Travel exceeded every expectation. The level of detail and care in the itinerary design made for a truly immersive and stress-free journey.",
            author: "Robert Chen",
            location: "London, UK"
        }
    ];

    useEffect(() => {
        const fetchTestimonials = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('testimonials').select('*');
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
            <div className="container relative">
                <div style={{ minHeight: '300px' }}>
                    <div className="testimonial-quote">&quot;{testimonials[testimonialIndex].quote}&quot;</div>
                    <div className="testimonial-author">{testimonials[testimonialIndex].author}</div>
                    <div className="testimonial-location">{testimonials[testimonialIndex].location}</div>
                </div>

                <div className="testimonial-controls">
                    <button onClick={prevTestimonial}>&lt;</button>
                    <button onClick={nextTestimonial}>&gt;</button>
                </div>
            </div>
        </section>
    );
}
