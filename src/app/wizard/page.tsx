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
        { id: 'paro', name: 'Paro Valley', img: '/images/bhutan/13.JPG' },
        { id: 'thimphu', name: 'Thimphu City', img: '/images/bhutan/14.JPG' },
        { id: 'punakha', name: 'Punakha Valley', img: '/images/bhutan/15.JPG' },
        { id: 'bumthang', name: 'Bumthang Heartland', img: '/images/bhutan/16.JPG' },
        { id: 'phobjikha', name: 'Phobjikha & Gangtey', img: '/images/bhutan/17.JPG' },
    ];

    const styles = [
        { id: 'discovery', name: 'Discovery', img: '/images/bhutan/main4.JPG', desc: 'First-time iconic highlights.' },
        { id: 'culture', name: 'Deep Culture', img: '/images/bhutan/main5.JPG', desc: 'Monasteries & heritage.' },
        { id: 'nature', name: 'Nature Retreat', img: '/images/bhutan/11.JPG', desc: 'Gentle scenic escapes.' },
        { id: 'romance', name: 'Romantic Escape', img: '/images/bhutan/12.JPG', desc: 'Honeymoons & wellness.' },
    ];

    const tags = ['Tiger\'s Nest Hike', 'Archery', 'Hot Stone Bath', 'Monastery Visit', 'River Rafting', 'Birdwatching', 'Festivals (Tshechu)', 'Farmhouse Dinner'];

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
                        <section className="wizard-hero-header">
                            <h2 className="wizard-question">Which Bhutanese valleys are you most interested in?</h2>
                            <p className="wizard-intro-text">Select one or more regions to explore.</p>
                        </section>
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
                            <form className="wizard-form" onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
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
                                    PLAN MY BHUTAN JOURNEY
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
            <Header theme="light">
                {/* Progress Bar under Header */}
                <div className="wizard-progress-track">
                    <div className="wizard-progress-fill" style={{ width: `${((currentStep / steps) * 100).toFixed(1)}%` }}></div>
                </div>
            </Header>

            {/* Main Content Area */}
            <main className="wizard-main" style={{ paddingTop: '120px' }}>
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
