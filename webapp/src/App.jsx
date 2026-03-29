import React, { useState, useEffect } from 'react';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    return localStorage.getItem('hasCompletedOnboarding') === 'true' ? 'dashboard' : 'welcome';
  });

  const finishOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setCurrentScreen('dashboard');
  };

  return (
    <main className="container">

      {currentScreen === 'welcome' && (
        <div className="m3-card" style={{ marginTop: '10vh' }}>
          <h1 className="headline">You aren't broken.</h1>
          <p className="body-medium">
            We don’t track "streaks" here. We don't use words like "relapse". You are simply a biological machine caught in an engineered chemical loop. This app is your laboratory to study and dismantle that loop.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-filled" onClick={() => setCurrentScreen('brainwashing')}>
              Begin Audit
              <span className="material-symbols-rounded">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'brainwashing' && (
        <div className="m3-card" style={{ marginTop: '10vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--md-sys-color-primary)' }}>psychology</span>
            <h2 className="title">The "Giving Up" Illusion</h2>
          </div>
          <p className="body-medium">
            Most people fail because they think they are "giving up" something valuable. Willpower creates stress, and stress drives you to seek dopamine.
          </p>
          <p className="body-medium">
            The truth is, you are giving up nothing. Adult content is just a boring biological trick. Once you see the trick, there is nothing to miss.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outlined" onClick={() => setCurrentScreen('welcome')}>Back</button>
            <button className="btn btn-filled" onClick={() => setCurrentScreen('littlemonster')}>Next</button>
          </div>
        </div>
      )}

      {currentScreen === 'littlemonster' && (
        <div className="m3-card" style={{ marginTop: '10vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-rounded" style={{ color: 'var(--md-sys-color-error)' }}>bug_report</span>
            <h2 className="title">Meeting the "Little Monster"</h2>
          </div>
          <p className="body-medium">
            You will still feel cravings. A craving isn't a sign that you are failing; it is just the faint death throes of the chemical loop leaving your body.
          </p>
          <div className="m3-card-elevated" style={{ backgroundColor: 'var(--md-sys-color-error-container)' }}>
            <p className="body-medium" style={{ color: 'var(--md-sys-color-on-error-container)' }}>
              <strong>The Agreement:</strong> When a craving hits, your only job is to open this app and hit the Intercept button. We will guide your prefrontal cortex back online.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button className="btn btn-outlined" onClick={() => setCurrentScreen('brainwashing')}>Back</button>
            <button className="btn btn-filled" onClick={finishOnboarding}>Enter Dashboard</button>
          </div>
        </div>
      )}

      {currentScreen === 'dashboard' && <Dashboard resetOnboarding={() => {
        localStorage.removeItem('hasCompletedOnboarding');
        setCurrentScreen('welcome');
      }} />}

    </main>
  );
}

export default App;
