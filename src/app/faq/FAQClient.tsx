'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

export default function FAQClient({ initialFaqs }: { initialFaqs: FAQ[] }) {
    const [activeTab, setActiveTab] = useState('All');

    const categories = ['All', ...Array.from(new Set(initialFaqs.map(f => f.category)))];
    
    const filteredFaqs = activeTab === 'All' 
        ? initialFaqs 
        : initialFaqs.filter(f => f.category === activeTab);

    return (
        <main className="faq-page page-with-header">

            <section className="faq-hero" style={{ background: '#fcfaf7', padding: '120px 20px 80px', textAlign: 'center' }}>
                <div className="container">
                    <h1 style={{ fontSize: '48px', fontFamily: 'var(--font-playfair), serif', marginBottom: '20px' }}>Travel Information</h1>
                    <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>Common questions about planning, logistics, and what to expect during your journey to Bhutan.</p>
                </div>
            </section>

            <div className="container" style={{ paddingBottom: '100px' }}>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '60px', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            style={{
                                padding: '10px 25px',
                                borderRadius: '30px',
                                border: '1px solid #ddd',
                                background: activeTab === cat ? '#008080' : 'white',
                                color: activeTab === cat ? 'white' : '#111',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {filteredFaqs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '100px', color: '#999' }}>No questions found in this category.</div>
                    ) : (
                        <div style={{ display: 'grid', gap: '30px' }}>
                            {filteredFaqs.map((faq) => (
                                <div key={faq.id} style={{ background: 'white', padding: '40px', border: '1px solid #eee', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '20px', color: '#111' }}>{faq.question}</h3>
                                    <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#555' }}>
                                        {faq.answer.split('\n').map((para, i) => (
                                            <p key={i} style={{ marginBottom: '15px' }}>{para}</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <section style={{ marginTop: '100px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '80px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '20px' }}>Still have questions?</h2>
                    <p style={{ color: '#888', marginBottom: '40px' }}>Our travel experts are ready to help you plan your perfect journey.</p>
                    <Link href="/contact" className="btn btn-primary large-btn">Contact Our Team</Link>
                </section>
            </div>

        </main>
    );
}
