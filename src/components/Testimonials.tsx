'use client';

import { useState } from 'react';

const testimonials = [
    {
        quote: "The entire trip was perfectly orchestrated. Our guide was incredibly knowledgeable and passionate, making every day an unforgettable adventure.",
        author: "Sarah Mitchell",
        location: "San Francisco, CA"
    },
    {
        quote: "Saidpiece Travel exceeded every expectation. The level of detail and care in the itinerary design made for a truly immersive and stress-free journey.",
        author: "Robert Chen",
        location: "London, UK"
    },
    {
        quote: "An absolute life-changing experience. Being so close to nature while feeling completely supported by expert guides is something I'll never forget.",
        author: "Elena Rodriguez",
        location: "Madrid, Spain"
    }
];

export default function Testimonials() {
    const [testimonialIndex, setTestimonialIndex] = useState(0);

    const nextTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setTestimonialIndex((prev) => (prev + 1 + testimonials.length) % testimonials.length);
    };

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
