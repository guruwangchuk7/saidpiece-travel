'use client';


export default function BlogLoading() {
    return (
        <main className="our-story-page page-with-header bg-white">

            <section className="story-hero-refined" style={{ opacity: 0.5 }}>
                <div className="story-hero-bg">
                    <div className="skeleton" style={{ height: '100%', width: '100%' }}></div>
                    <div className="story-hero-overlay-refined"></div>
                </div>
                <div className="container story-hero-content-refined text-center">
                    <h1 className="serif-title">Travel Blog</h1>
                </div>
            </section>

            <div className="narrative-grid container">
                <section>
                    <div className="section-header text-center" style={{ marginBottom: '60px' }}>
                        <div className="skeleton" style={{ height: '30px', width: '200px', margin: '0 auto' }}></div>
                    </div>

                    <div className="connect-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="connect-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                                <div className="skeleton" style={{ height: '260px', width: '100%' }}></div>
                                <div style={{ padding: '28px' }}>
                                    <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '15px' }}></div>
                                    <div className="skeleton" style={{ height: '14px', width: '100%', marginBottom: '10px' }}></div>
                                    <div className="skeleton" style={{ height: '14px', width: '60%' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <style jsx>{`
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                    border-radius: 4px;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </main>
    );
}
