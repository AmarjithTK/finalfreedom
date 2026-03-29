import React, { useState } from 'react';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // welcome -> brainwashing -> littlemonster -> dashboard

  return (
    <div className="ambient-glow">
      <main className="container">

        {currentScreen === 'welcome' && (
          <div className="glass-card animate-fade-in" style={{ marginTop: '20vh', textAlign: 'center' }}>
            <h1 className="h1" style={{ marginBottom: '16px' }}>
              Welcome. <span className="text-gradient">You aren't broken.</span>
            </h1>
            <p className="text-secondary" style={{ marginBottom: '32px', fontSize: '1.1rem' }}>
              We don’t track "streaks" here. We don't use words like "relapse" or "sin." You are not an addict fighting a losing battle; you are simply a biological machine caught in a highly engineered chemical loop. This app is your laboratory to study and dismantle that loop.
            </p>
            <button className="btn btn-primary delay-200 animate-fade-in" onClick={() => setCurrentScreen('brainwashing')}>
              Begin the Audit
            </button>
          </div>
        )}

        {currentScreen === 'brainwashing' && (
          <div className="glass-card animate-fade-in" style={{ marginTop: '15vh' }}>
            <div style={{
              marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'hsla(0,0%,100%,0.05)', borderRadius: '12px', padding: '16px'
            }}>
              <h2 className="h2 text-gradient">The "Giving Up" Illusion</h2>
            </div>
            <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
              Most people fail because they think they are "giving up" something valuable and have to fight the urge with willpower.
              <strong> Willpower creates stress, and stress drives you to seek dopamine.</strong>
            </p>
            <p className="text-secondary" style={{ marginBottom: '32px', fontSize: '1.1rem' }}>
              The truth is, you are giving up nothing. Adult content is just a boring biological trick. Once you see the trick, there is nothing to miss, and willpower becomes unnecessary.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
              <button className="btn btn-glass" onClick={() => setCurrentScreen('welcome')}>Back</button>
              <button className="btn btn-primary" onClick={() => setCurrentScreen('littlemonster')}>I Understand</button>
            </div>
          </div>
        )}

        {currentScreen === 'littlemonster' && (
          <div className="glass-card animate-fade-in" style={{ marginTop: '15vh' }}>
            <div style={{
              marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'hsla(220,80%,60%,0.1)', border: '1px solid hsla(220,80%,60%,0.2)', borderRadius: '12px', padding: '16px'
            }}>
              <h2 className="h2" style={{ color: 'hsl(220,80%,75%)' }}>Meeting the "Little Monster"</h2>
            </div>
            <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '1.1rem' }}>
              You will still feel cravings. That is completely normal. A craving isn't a sign that you are failing; it is just the faint death throes of the chemical loop leaving your body.
            </p>
            <p style={{ marginBottom: '32px', fontSize: '1.1rem', padding: '16px', background: 'hsla(0,0%,0%,0.3)', borderRadius: '8px', borderLeft: '4px solid hsl(220,80%,60%)' }}>
              <strong>The Agreement:</strong> When you feel a craving, your only job is to open this app and hit the Intercept button. Do not fight it with pure strength. We will guide your prefrontal cortex back online.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
              <button className="btn btn-glass" onClick={() => setCurrentScreen('brainwashing')}>Back</button>
              <button className="btn btn-primary" onClick={() => setCurrentScreen('dashboard')}>Enter Dashboard</button>
            </div>
          </div>
        )}

        {currentScreen === 'dashboard' && <Dashboard />}

      </main>
    </div>
  );
}

export default App;
