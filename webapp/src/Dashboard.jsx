import React, { useState } from 'react';
import PanicIntercept from './PanicIntercept';
import './App.css';

export default function Dashboard() {
    const [inIntercept, setInIntercept] = useState(false);

    if (inIntercept) {
        return <PanicIntercept onComplete={() => setInIntercept(false)} />;
    }

    return (
        <div className="glass-card animate-fade-in" style={{ marginTop: '15vh', textAlign: 'center' }}>
            <h1 className="h1" style={{ marginBottom: '16px' }}>Dashboard</h1>
            <p className="text-secondary" style={{ marginBottom: '40px' }}>
                No streaks. No shame. Just logical defusion.
            </p>

            <div style={{ padding: '32px', background: 'hsla(0,0%,100%,0.02)', borderRadius: '16px', border: '1px solid hsla(0,0%,100%,0.05)' }}>
                <h2 className="h3" style={{ marginBottom: '16px' }}>The "Little Monster" is awake?</h2>
                <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
                    Remember your agreement. Engage the prefrontal cortex intercept before taking any action.
                </p>
                <button
                    className="btn btn-primary"
                    style={{
                        padding: '16px 32px',
                        fontSize: '1.2rem',
                        background: 'linear-gradient(135deg, hsl(350, 80%, 60%), hsl(330, 70%, 55%))',
                        boxShadow: '0 0 20px hsla(350, 80%, 60%, 0.4)'
                    }}
                    onClick={() => setInIntercept(true)}
                >
                    INTERCEPT CRAVING
                </button>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn btn-glass">Review Theory</button>
                <button className="btn btn-glass">My Insights</button>
            </div>
        </div>
    );
}
