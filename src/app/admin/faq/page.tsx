'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    created_at: string;
}

export default function FAQManager() {
    const router = useRouter();
    const { isStaff } = useAuth();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({
        question: '',
        answer: '',
        category: 'General'
    });

    useEffect(() => {
        if (isStaff) {
            fetchFaqs();
        } else if (isStaff === false) {
            setLoading(false);
        }
    }, [isStaff]);

    const fetchFaqs = async () => {
        setLoading(true);
        if (!supabase) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFaqs(data || []);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const faqData = {
            ...currentFaq,
        };

        if (!supabase) return;
        let result;
        if (currentFaq.id) {
            result = await supabase
                .from('faqs')
                .update(faqData)
                .eq('id', currentFaq.id);
        } else {
            result = await supabase
                .from('faqs')
                .insert([faqData]);
        }

        if (result.error) {
            alert('Error saving FAQ: ' + result.error.message);
        } else {
            setIsEditing(false);
            await fetchFaqs();
            router.refresh();
        }
    };

    const handleDelete = async (id: string) => {
        if (!supabase) return;
        if (confirm('Permanently remove this FAQ?')) {
            const { error } = await supabase.from('faqs').delete().eq('id', id);
            if (error) alert('Error: ' + error.message);
            else {
                await fetchFaqs();
                router.refresh();
            }
        }
    };

    if (loading && !isEditing) {
        return (
            <div className="admin-loader">
                <div className="spinner"></div>
                <p>Retrieving Knowledge Base...</p>
            </div>
        );
    }

    return (
        <div className="faq-admin-container">
            <header className="admin-page-header">
                <div className="header-titles">
                    <h1 className="serif-title">Travel FAQs</h1>
                    <p className="subtitle">Curate the knowledge base for Bhutanese travel inquiries.</p>
                </div>
                {!isEditing && (
                    <button className="btn-add-faq" onClick={() => {
                        setCurrentFaq({ question: '', answer: '', category: 'General' });
                        setIsEditing(true);
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Add New Question
                    </button>
                )}
            </header>

            {!isEditing ? (
                <div className="faq-list-grid">
                    {faqs.map(faq => (
                        <div key={faq.id} className="faq-card">
                            <div className="card-header">
                                <span className="category-tag">{faq.category || 'General'}</span>
                            </div>
                            <div className="card-body">
                                <h3 className="card-question">{faq.question}</h3>
                                <p className="card-preview">{faq.answer.substring(0, 120)}...</p>
                            </div>
                            <div className="card-actions">
                                <button className="btn-edit" onClick={() => { setCurrentFaq(faq); setIsEditing(true); }}>Edit Response</button>
                                <button className="btn-delete" onClick={() => handleDelete(faq.id)} title="Delete FAQ">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && <p className="empty-msg">No FAQs found. Start building your knowledge base.</p>}
                </div>
            ) : (
                <div className="editor-overlay">
                    <form className="faq-editor-form" onSubmit={handleSave}>
                        <div className="editor-sidebar">
                            <div className="editor-aside-group">
                                <label>FAQ Classification</label>
                                <select value={currentFaq.category} onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}>
                                    <option>General</option>
                                    <option>Visa & Logistics</option>
                                    <option>Trekking & Outdoor</option>
                                    <option>Cultural Etiquette</option>
                                    <option>Safety & Health</option>
                                    <option>Sustainable Travel</option>
                                </select>
                            </div>
                            <div className="editor-tip">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4c8b0" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                <p>Provide clear, concise answers to help travelers prepare for their journey.</p>
                            </div>
                        </div>

                        <div className="editor-main">
                            <div className="editor-header">
                                <h2 className="serif-title">Topic Architect</h2>
                                <div className="editor-controls">
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                                    <button type="submit" className="btn-save">Publish FAQ</button>
                                </div>
                            </div>

                            <div className="form-sections">
                                <div className="section">
                                    <div className="form-item">
                                        <label>Traveler's Question</label>
                                        <textarea 
                                            rows={2} 
                                            className="question-input"
                                            value={currentFaq.question} 
                                            onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })} 
                                            placeholder="e.g., What is the best time to visit Bhutan?" 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="section">
                                    <div className="form-item">
                                        <label>Expert Response</label>
                                        <textarea 
                                            rows={12} 
                                            value={currentFaq.answer} 
                                            onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })} 
                                            placeholder="Provide a detailed and helpful answer here..."
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <style jsx>{`
                .faq-admin-container {
                    padding: 40px 0;
                }
                .admin-page-header h1 {
                    font-size: 32px;
                    margin: 0;
                    line-height: 1.2;
                }
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 50px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                        margin-bottom: 30px;
                    }
                    .btn-add-faq {
                        width: 100%;
                        justify-content: center;
                    }
                }
                .subtitle {
                    color: #888;
                    font-size: 15px;
                    margin-top: 5px;
                }
                .btn-add-faq {
                    background: #111;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }

                .faq-list-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 25px;
                }
                @media (max-width: 400px) {
                    .faq-list-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .faq-card {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.2s;
                }
                .faq-card:hover {
                    border-color: #d4c8b0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.02);
                }
                .card-header {
                    padding: 15px 20px 0;
                }
                .category-tag {
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    background: #f9f9f9;
                    color: #999;
                    padding: 3px 8px;
                    border-radius: 4px;
                }
                .card-body {
                    padding: 15px 20px 25px;
                    flex-grow: 1;
                }
                .card-question {
                    font-family: var(--font-playfair), serif;
                    font-size: 18px;
                    line-height: 1.4;
                    margin-bottom: 12px;
                    height: 50px;
                    overflow: hidden;
                }
                .card-preview {
                    font-size: 13px;
                    color: #777;
                    line-height: 1.6;
                }
                .card-actions {
                    padding: 15px 20px;
                    border-top: 1px solid #f9f9f9;
                    display: flex;
                    gap: 10px;
                }
                .btn-edit {
                    flex: 1;
                    padding: 8px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    background: white;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-delete {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #ffebeb;
                    color: #d32f2f;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .editor-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 2500;
                    overflow-y: auto;
                    padding: 60px;
                }
                @media (max-width: 1024px) {
                    .editor-overlay {
                        padding: 40px;
                    }
                }
                @media (max-width: 768px) {
                    .editor-overlay {
                        padding: 100px 20px 40px;
                    }
                }
                .faq-editor-form {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 80px;
                }
                @media (max-width: 1100px) {
                    .faq-editor-form {
                        gap: 40px;
                        grid-template-columns: 280px 1fr;
                    }
                }
                @media (max-width: 900px) {
                    .faq-editor-form {
                        display: flex;
                        flex-direction: column;
                        gap: 40px;
                    }
                }
                .editor-aside-group label {
                    display: block;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #999;
                    margin-bottom: 12px;
                }
                .editor-aside-group select {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    font-weight: 700;
                }
                .editor-tip {
                    margin-top: 40px;
                    padding: 20px;
                    background: #fdfcf9;
                    border-radius: 12px;
                    display: flex;
                    gap: 15px;
                    align-items: flex-start;
                }
                .editor-tip p { font-size: 12px; color: #888; line-height: 1.6; margin: 0; }

                .editor-header h2 { font-size: 28px; margin: 0 0 40px; }
                .editor-controls { display: flex; gap: 12px; position: fixed; top: 40px; right: 60px; }
                @media (max-width: 768px) {
                    .editor-header h2 { font-size: 24px; margin-bottom: 20px; }
                    .editor-controls {
                        position: static;
                        width: 100%;
                        justify-content: flex-end;
                        margin-bottom: 30px;
                    }
                    .btn-cancel, .btn-save {
                        padding: 10px 15px;
                        font-size: 13px;
                    }
                }
                .btn-cancel {
                    padding: 10px 25px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .btn-save {
                    padding: 10px 35px;
                    background: #111;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .form-sections { display: grid; gap: 40px; }
                .section label {
                    display: block;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #aaa;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }
                .question-input {
                    font-family: var(--font-playfair), serif;
                    font-size: 24px !important;
                    font-weight: 700;
                    border: none !important;
                    background: none !important;
                    padding: 0 !important;
                    width: 100%;
                    resize: none;
                }
                @media (max-width: 640px) {
                    .question-input {
                        font-size: 20px !important;
                    }
                }
                .form-item textarea {
                    width: 100%;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #eee;
                    background: #fafafa;
                    font-family: inherit;
                    line-height: 1.6;
                    font-size: 15px;
                }
                .form-item textarea:focus {
                    outline: none;
                    border-color: #d4c8b0;
                    background: white;
                }

                .admin-loader {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 100px;
                    color: #888;
                }
                .spinner {
                    width: 32px;
                    height: 32px;
                    border: 2px solid rgba(0,0,0,0.05);
                    border-top-color: #d4c8b0;
                    border-radius: 50%;
                    animation: spin 1s infinite linear;
                    margin-bottom: 20px;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                .empty-msg { padding: 40px; color: #ccc; }
            `}</style>
        </div>
    );
}
