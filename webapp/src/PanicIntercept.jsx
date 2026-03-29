import React, { useState } from 'react';

export default function PanicIntercept({ onComplete }) {
    const [step, setStep] = useState(0);
    const [typedInput, setTypedInput] = useState("");

    const steps = [
        {
            title: "Identify the Illusion",
            text: "What is your brain telling you right now?",
            options: [
                "I just want 'one peek' to relieve the stress.",
                "I'm bored and deserve a reward.",
                "I want to see something 'novel' or 'amateur'."
            ]
        },
        {
            title: "The Clinical Reality",
            text: "Read this truth: The craving you feel is NOT because porn is enjoyable. It is because your brain is experiencing a dopamine withdrawal from the last session. The 'stress' you feel is caused by the drug itself. Viewing it will merely reset the trap.",
            action: "Type 'I am not sacrificing anything' to engage your prefrontal cortex.",
            validation: "I am not sacrificing anything"
        },
        {
            title: "The Deconstruction",
            text: "The 'Novelty' trick is just your brain moving the goalposts. It will never be satisfied because there is no fundamental truth to the fantasy. The void cannot be filled by the thing that created the void.",
            action: "Click to acknowledge and defuse the craving."
        }
    ];

    const current = steps[step];

    return (
        <div className="glass-card animate-fade-in" style={{ marginTop: '10vh' }}>
            <div style={{
                marginBottom: '24px',
                padding: '16px',
                background: 'hsla(350, 80%, 60%, 0.1)',
                border: '1px solid hsla(350, 80%, 60%, 0.2)',
                borderRadius: '12px',
                textAlign: 'center'
            }}>
                <h2 className="h2" style={{ color: 'hsl(350, 80%, 75%)' }}>{current.title}</h2>
            </div>

            <p className="text-secondary" style={{ marginBottom: '32px', fontSize: '1.2rem', textAlign: 'center' }}>
                {current.text}
            </p>

            {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {current.options.map((opt, idx) => (
                        <button key={idx} className="btn btn-glass" style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '16px' }} onClick={() => setStep(1)}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}

            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                    <p style={{ fontWeight: 600, color: 'hsl(220, 80%, 75%)' }}>{current.action}</p>
                    <input
                        type="text"
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '8px',
                            border: '1px solid hsla(255,255,255,0.2)',
                            background: 'hsla(0,0%,0%,0.3)',
                            color: 'white',
                            fontSize: '1.1rem',
                            outline: 'none',
                            fontFamily: 'inherit'
                        }}
                        placeholder="Type the statement here..."
                        autoFocus
                    />
                    <button
                        className="btn btn-primary"
                        disabled={typedInput.toLowerCase() !== current.validation.toLowerCase()}
                        style={{ opacity: typedInput.toLowerCase() !== current.validation.toLowerCase() ? 0.5 : 1, width: '100%', padding: '16px' }}
                        onClick={() => setStep(2)}
                    >
                        Verify & Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-glass" style={{ padding: '16px 32px' }} onClick={onComplete}>
                        Defuse Craving & Return
                    </button>
                </div>
            )}
        </div>
    );
}
