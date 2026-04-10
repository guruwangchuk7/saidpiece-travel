'use client';

export default function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-content">
                <div className="spinner"></div>
                <p className="loading-text">Saidpiece Travel</p>
                <p className="sub-text">Preparing your Bhutanese experience...</p>
            </div>
            <style jsx>{`
                .loading-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    z-index: 9999;
                }
                .loading-content {
                    text-align: center;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(0, 128, 128, 0.1);
                    border-top-color: #008080;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s ease-in-out infinite;
                }
                .loading-text {
                    font-family: var(--font-playfair), serif;
                    font-size: 24px;
                    color: #111;
                    margin: 0;
                    letter-spacing: 1px;
                    font-weight: 700;
                }
                .sub-text {
                    font-size: 14px;
                    color: #666;
                    margin-top: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
