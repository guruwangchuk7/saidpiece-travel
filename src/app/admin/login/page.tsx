'use client';

import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
    const { signInWithGoogle } = useAuth();

    return (
        <main className="admin-login-page page-with-header">
            <div className="container" style={{
                padding: '200px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="login-card" style={{
                    background: '#fdfcf9',
                    padding: '60px',
                    borderRadius: '12px',
                    border: '1px solid #d4c8b0',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}>
                    <h1 className="serif-title" style={{ marginBottom: '20px' }}>Staff Access</h1>
                    <p style={{ color: '#666', marginBottom: '40px' }}>
                        Please sign in with your authorized Gmail account to access the booking management dashboard.
                    </p>

                    <button
                        className="btn btn-primary"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            padding: '18px 40px'
                        }}
                        onClick={() => signInWithGoogle('/admin')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.153-1.859 4.133-1.127 1.126-2.5 2.253-5.981 2.253-5.413 0-9.613-4.387-9.613-9.8 0-5.413 4.2-9.8 9.613-9.8 2.933 0 5.146 1.133 6.946 2.893l2.32-2.32C18.173 2.12 15.546.52 12.48.52c-6.173 0-11.2 5.027-11.2 11.2s5.027 11.2 11.2 11.2c3.28 0 5.76-1.08 7.68-3.08 2-2 2.64-4.813 2.64-7.147 0-.693-.053-1.347-.16-1.973h-10.16z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>
        </main>
    );
}
