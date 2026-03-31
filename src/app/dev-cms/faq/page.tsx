'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order_index: number;
}

export default function DevFAQManager() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({
        question: '',
        answer: '',
        category: 'General',
        order_index: 0
    });

    useEffect(() => {
        fetchData();
        // FORCE UNLOCK: No hangs allowed
        const unlock = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(unlock);
    }, []);

    const fetchData = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) console.error('Error fetching FAQs:', error);
            else setFaqs(data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;
        let result;
        if (currentFaq.id) {
            result = await supabase.from('faqs').update(currentFaq).eq('id', currentFaq.id);
        } else {
            result = await supabase.from('faqs').insert([currentFaq]);
        }
        if (result.error) alert('Error: ' + result.error.message);
        else { setIsEditing(false); fetchData(); }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Delete this question?')) {
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else fetchData();
        }
    };

    if (loading) return <div>Loading FAQs...</div>;

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', alignItems: 'center' }}>
                <h1 style={{ fontSize: '32px' }}>FAQ Manager</h1>
                {!isEditing && (
                    <button 
                        onClick={() => { setCurrentFaq({ question: '', answer: '', category: 'General', order_index: faqs.length }); setIsEditing(true); }}
                        style={{ padding: '12px 25px', background: '#111', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        + Add Question
                    </button>
                )}
            </div>

            {!isEditing ? (
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee' }}>
                    {faqs.map(faq => (
                        <div key={faq.id} style={{ padding: '25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>{faq.question}</h3>
                                <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{faq.answer}</p>
                                <span style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '15px', display: 'inline-block' }}>Category: {faq.category}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={() => { setCurrentFaq(faq); setIsEditing(true); }} style={{ color: '#008080', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Edit</button>
                                <button onClick={() => handleDelete(faq.id)} style={{ color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No FAQs yet.</p>}
                </div>
            ) : (
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid #eee', maxWidth: '800px' }}>
                    <form onSubmit={handleSave} style={{ display: 'grid', gap: '25px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Question</label>
                            <input type="text" value={currentFaq.question} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentFaq({...currentFaq, question: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Detailed Answer</label>
                            <textarea value={currentFaq.answer} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '150px' }} onChange={e => setCurrentFaq({...currentFaq, answer: e.target.value})} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                            <select value={currentFaq.category} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setCurrentFaq({...currentFaq, category: e.target.value})}>
                                <option value="General">General Info</option>
                                <option value="Booking">Booking & Payment</option>
                                <option value="Visas">Visa & Entry</option>
                                <option value="Health">Health & Safety</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                            <button type="submit" style={{ padding: '15px 40px', background: '#111', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Update FAQ</button>
                            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '15px 40px', background: 'transparent', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}
