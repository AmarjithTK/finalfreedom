import React, { useState } from 'react';

export default function PanicIntercept({ onComplete }) {
    const [step, setStep] = useState(0);
    const [typedInput, setTypedInput] = useState("");

    const steps = [
        {
            title: "Identify the Illusion",
            text: "What is your brain telling you right now?",
            icon: "psychology_alt",
            options: [
                "I want 'one peek' to relieve the stress.",
                "I'm bored and deserve a reward.",
                "I want to see something 'amateur'."
            ]
        },
        {
            title: "The Clinical Reality",
            text: "The craving you feel is NOT because it is enjoyable. It is because your brain is experiencing a dopamine withdrawal from the last session. Viewing it will merely reset the trap.",
            icon: "science",
            action: "Type 'I am not sacrificing anything'",
            validation: "I am not sacrificing anything"
        },
        {
            title: "The Deconstruction",
            text: "The 'Novelty' trick is just your brain moving the goalposts. It will never be satisfied because there is no fundamental truth to the fantasy.",
            icon: "done_all",
            action: "Click to acknowledge and defuse the craving."
        }
    ];

    const current = steps[step];

    return (
        <div className="m3-card-elevated" style={{ marginTop: '10vh' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-rounded" style={{ color: 'var(--md-sys-color-primary)' }}>{current.icon}</span>
                <h2 className="title">{current.title}</h2>
            </div>

            <p className="body-medium">
                {current.text}
            </p>

            {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {current.options.map((opt, idx) => (
                        <button key={idx} className="btn btn-tonal" style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '12px 16px', borderRadius: 'var(--radius-md)' }} onClick={() => setStep(1)}>
                            {opt}
                        </button>
                    ))}
                </div>
            )}

            {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <p className="title" style={{ fontSize: '14px', color: 'var(--md-sys-color-primary)' }}>{current.action}</p>
                    <input
                        type="text"
                        value={typedInput}
                        onChange={(e) => setTypedInput(e.target.value)}
                        className="m3-input"
                        placeholder="Type here..."
                        autoFocus
                    />
                    <button
                        className="btn btn-filled"
                        disabled={typedInput.toLowerCase() !== current.validation.toLowerCase()}
                        onClick={() => setStep(2)}
                    >
                        Verify & Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div style={{ marginTop: '8px' }}>
                    <button className="btn btn-filled" style={{ width: '100%' }} onClick={onComplete}>
                        <span className="material-symbols-rounded">verified</span>
                        Defuse Craving & Return
                    </button>
                </div>
            )}

        </div>
    );
}
