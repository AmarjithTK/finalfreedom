import React, { useState } from 'react';
import PanicIntercept from './PanicIntercept';

export default function Dashboard({ resetOnboarding }) {
    const [inIntercept, setInIntercept] = useState(false);

    if (inIntercept) {
        return <PanicIntercept onComplete={() => setInIntercept(false)} />;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-2) 0' }}>
                <h1 className="headline">Dashboard</h1>
                <button onClick={resetOnboarding} style={{ background: 'none', border: 'none', cursor: 'pointer' }} title="Reset Onboarding">
                    <span className="material-symbols-rounded" style={{ color: 'var(--md-sys-color-primary)', fontSize: '28px' }}>shield</span>
                </button>
            </div>

            <div className="m3-card-elevated" style={{ backgroundColor: 'var(--md-sys-color-error-container)' }}>
                <h2 className="title" style={{ color: 'var(--md-sys-color-on-error-container)' }}>The "Little Monster" is awake?</h2>
                <p className="body-medium" style={{ color: 'var(--md-sys-color-on-error-container)' }}>
                    Engage the prefrontal cortex intercept before taking any action.
                </p>
                <button
                    className="btn btn-filled"
                    style={{ width: '100%', marginTop: '8px', backgroundColor: 'var(--md-sys-color-error)', color: '#fff' }}
                    onClick={() => setInIntercept(true)}
                >
                    <span className="material-symbols-rounded">warning</span>
                    INTERCEPT CRAVING
                </button>
            </div>

            <div className="m3-card">
                <h2 className="title">Knowledge Base</h2>
                <p className="body-medium">Review fallacies and clinical logic to stay grounded.</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button className="btn btn-tonal" style={{ flex: 1 }}>Modules</button>
                    <button className="btn btn-tonal" style={{ flex: 1 }}>Insights</button>
                </div>
            </div>
        </>
    );
}
