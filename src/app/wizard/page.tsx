'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';

const steps = 6;

export default function TripWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [duration, setDuration] = useState('10');

    // User Form state
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');

    const regions = [
        { id: 'africa', name: 'Africa', img: '/images/bhutan/main1.JPG' },
        { id: 'asia', name: 'Asia', img: '/images/bhutan/main2.JPG' },
        { id: 'europe', name: 'Europe', img: '/images/bhutan/main1.JPG' },
        { id: 'latam', name: 'Latin America', img: '/images/bhutan/main2.JPG' },
    ];

    const styles = [
        { id: 'classic', name: 'Classic Sites', img: '/images/bhutan/main1.JPG', desc: 'The iconic must-sees.' },
        { id: 'active', name: 'Active Explorer', img: '/images/bhutan/main2.JPG', desc: 'Hiking, biking, moving.' },
        { id: 'culture', name: 'Deep Culture', img: '/images/bhutan/main1.JPG', desc: 'Off the beaten path.' },
    ];

    const tags = ['Safari', 'Beach', 'Hiking', 'Honeymoon', 'Family', 'Food & Wine', 'History', 'Wellness'];

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const handleSkip = () => handleNext();

    const toggleRegion = (id: string) => {
        setSelectedRegions(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="wizard-step-content animation-slide-in">
                        <h2 className="wizard-question">Do you know where you want to go?</h2>
                        <div className="wizard-grid-cards">
                            {regions.map(region => (
                                <div
                                    key={region.id}
                                    className={`wizard-card ${selectedRegions.includes(region.id) ? 'selected' : ''}`}
                                    onClick={() => toggleRegion(region.id)}
                                >
                                    <Image src={region.img} alt={region.name} fill style={{ objectFit: 'cover' }} />
                                    <div className="wizard-card-overlay"></div>
                                    <span className="wizard-card-title">{region.name}</span>
                                    {selectedRegions.includes(region.id) && (
                                        <div className="wizard-card-check">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="wizard-step-content animation-slide-in">
                        <h2 className="wizard-question">What is your travel style?</h2>
                        <div className="wizard-grid-cards cols-3">
                            {styles.map(style => (
                                <div
                                    key={style.id}
                                    className={`wizard-card tall ${selectedStyle === style.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedStyle(style.id)}
                                >
                                    <Image src={style.img} alt={style.name} fill style={{ objectFit: 'cover' }} />
                                    <div className="wizard-card-overlay split"></div>
                                    <div className="wizard-card-bottom-text">
                                        <span className="wizard-card-title block">{style.name}</span>
                                        <span className="wizard-card-desc">{style.desc}</span>
                                    </div>
                                    {selectedStyle === style.id && (
                                        <div className="wizard-card-check">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="wizard-step-content animation-slide-in">
                        <h2 className="wizard-question">When do you want to travel?</h2>

                        <div className="wizard-timeline-group">
                            <h4 className="wizard-sub-label">Select Month</h4>
                            <div className="wizard-month-grid">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                                    <button
                                        key={month}
                                        className={`wizard-month-btn ${selectedMonth === month ? 'selected' : ''}`}
                                        onClick={() => setSelectedMonth(month)}
                                    >
                                        {month}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="wizard-timeline-group" style={{ marginTop: '50px' }}>
                            <h4 className="wizard-sub-label">How long do you want to travel for?</h4>
                            <div className="wizard-duration-slider">
                                <input
                                    type="range"
                                    min="3"
                                    max="30"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="slider"
                                />
                                <div className="duration-display">
                                    <span className="duration-num">{duration}</span>
                                    <span className="duration-text">Days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="wizard-step-content animation-slide-in">
                        <h2 className="wizard-question">Any specific experiences you are looking for?</h2>
                        <div className="wizard-tag-grid">
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    className={`wizard-tag-tile ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    onClick={() => toggleTag(tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="wizard-step-content animation-slide-in">
                        <h2 className="wizard-question">Who are you traveling with?</h2>
                        <div className="wizard-grid-cards cols-4">
                            {['Solo', 'Partner', 'Family', 'Friends'].map(group => (
                                <div
                                    key={group}
                                    className="wizard-card square"
                                    onClick={() => handleNext()}
                                >
                                    <div className="wizard-card-solid-bg">
                                        <span className="wizard-card-title centered">{group}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="wizard-step-content animation-slide-in lead-capture-step">
                        <h2 className="wizard-question">Let&apos;s start planning your dream trip!</h2>
                        <div className="wizard-lead-container">
                            <div className="wizard-expert-panel">
                                <div className="expert-avatar"></div>
                                <div className="expert-info">
                                    <h4>Talk to a Travel Expert</h4>
                                    <div className="expert-rating">
                                        <span className="stars">★★★★★</span>
                                        <span className="reviews">4.9/5 based on 1073 reviews</span>
                                    </div>
                                </div>
                            </div>
                            <form className="wizard-form" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="wizard-input"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="wizard-input"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <button className="btn btn-primary wizard-submit-btn" type="submit">
                                    SEE MY TRIP IDEAS
                                </button>
                            </form>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const isNextDisabled = () => {
        if (currentStep === 1 && selectedRegions.length === 0) return true;
        if (currentStep === 2 && !selectedStyle) return true;
        if (currentStep === 3 && !selectedMonth) return true;
        // Step 4 skipped/optional allowed
        // Step 5 auto-forwards
        return false;
    };

    return (
        <div className="wizard-framework">
            {/* Header Navigation fixed to Top */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000 }}>
                <Header theme="light" />
                {/* Progress Bar under Header */}
                <div className="wizard-progress-track">
                    <div className="wizard-progress-fill" style={{ width: `${(currentStep / steps) * 100}%` }}></div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="wizard-main" style={{ paddingTop: '150px' }}>
                {renderStepContent()}
            </main>

            {/* Footer Navigation (Next/Skip) */}
            {currentStep < 6 && (
                <footer className="wizard-footer">
                    <div className="wizard-footer-container">
                        {currentStep > 1 && (
                            <button className="wizard-back-btn" onClick={handleBack} style={{ marginRight: 'auto' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="19" y1="12" x2="5" y2="12"></line>
                                    <polyline points="12 19 5 12 12 5"></polyline>
                                </svg>
                                Back
                            </button>
                        )}
                        <button className="wizard-skip-btn" onClick={handleSkip}>
                            Not sure? Skip
                        </button>
                        <button
                            className="btn btn-primary wizard-next-btn"
                            onClick={handleNext}
                            disabled={isNextDisabled()}
                        >
                            Next Step
                        </button>
                    </div>
                </footer>
            )}
        </div>
    );
}
