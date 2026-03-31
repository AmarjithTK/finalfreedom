<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import confetti from 'canvas-confetti';
  import TruthCard from './lib/TruthCard.svelte';
  import Dashboard from './lib/Dashboard.svelte';
  
  let currentView: 'dashboard' | 'deck' = 'dashboard';
  let activeDeck: any = null;
  let activeDeckTitle = '';
  let chapterProgress: Record<number, number> = {};
  
  let deck: any[] = [];

  let currentIndex = 0;
  $: progressPercent = deck.length ? (currentIndex / deck.length) * 100 : 0;
  
  let bgTint = 'var(--bg-primary)';

  onMount(() => {
    try {
      const saved = localStorage.getItem('chapterProgress');
      if (saved) {
        chapterProgress = JSON.parse(saved);
      }
    } catch {
      chapterProgress = {};
    }
  });

  $: {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chapterProgress', JSON.stringify(chapterProgress));
    }
  }

  function handleStartDeck(e: CustomEvent<any>) {
    const selectedDeck = e.detail;
    activeDeck = selectedDeck;
    deck = selectedDeck.cards;
    activeDeckTitle = selectedDeck.title;
    currentIndex = 0;
    currentView = 'deck';
    bgTint = 'var(--bg-primary)';
  }

  function returnToDashboard() {
    currentView = 'dashboard';
    bgTint = 'var(--bg-primary)';
  }
  
  function handleCommit(e: CustomEvent<{ swipedRight: boolean; isCorrect: boolean; card: any }>) {
    const { isCorrect } = e.detail;
    if (isCorrect) {
      bgTint = 'var(--glow-align)'; // #10241A
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#4CAF50', '#81C784', '#A5D6A7']
      });
    } else {
      bgTint = 'var(--glow-illusion)'; // #2A1115
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#F44336', '#E57373', '#FFCDD2'],
        shapes: ['circle']
      });
    }
  }
  
  function handleNextCard() {
    const nextIndex = currentIndex + 1;
    if (activeDeck?.id && deck.length) {
      chapterProgress = {
        ...chapterProgress,
        [activeDeck.id]: Math.min(100, Math.round((nextIndex / deck.length) * 100))
      };
    }
    currentIndex = nextIndex;
    bgTint = 'var(--bg-primary)';
  }

  function handleInteractionStart() {
    // "A decision is armed"
  }

  function handleInteractionCancel() {
    // Reset background if needed
    bgTint = 'var(--bg-primary)';
  }

  $: {
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = bgTint;
    }
  }
</script>

<style>
  main {
    width: min(1080px, 100vw);
    height: 100dvh;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 24px);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    gap: 10px;
  }

  header {
    width: 100%;
    padding: clamp(10px, 2vw, 18px);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 20;
    gap: 10px;
  }

  .header-top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 14px;
    padding: 10px 12px;
    border-radius: 14px;
    background: color-mix(in srgb, var(--bg-card) 85%, transparent);
    border: 1px solid rgba(128, 128, 128, 0.14);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    overflow: hidden;
    max-width: 70%;
  }

  .header-title {
    font-size: clamp(11px, 1.6vw, 13px);
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 1.6px;
    text-transform: uppercase;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* max-width is handled by header-left */
  }

  .progress-container {
    width: clamp(120px, 24vw, 180px);
    height: 6px;
    background-color: var(--text-secondary);
    opacity: 0.2;
    border-radius: 3px;
    overflow: hidden;
    flex-shrink: 0;
  }

  .progress-bar {
    height: 100%;
    background-color: var(--text-primary);
    transition: width 0.3s ease;
  }

  .deck-area {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: stretch;
    position: relative;
    overflow: hidden;
  }

  .deck-stage {
    width: 100%;
    max-width: 460px;
    height: 100%;
    min-height: 560px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  
  .deck-complete {
    text-align: center;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  .deck-complete h2 {
    font-size: 26px;
    font-weight: 600;
    margin: 0;
    letter-spacing: 0.5px;
  }

  .deck-complete p {
    color: var(--text-secondary);
    font-size: 16px;
    margin: 0;
  }

  .reset-btn {
    padding: 16px 32px;
    border-radius: 30px;
    background-color: var(--text-primary);
    color: var(--bg-primary);
    font-weight: 600;
    font-size: 14px;
    transition: transform 0.2s, opacity 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
  }

  .reset-btn:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
  
  /* Use global for body bg to keep it clean */
  :global(body) {
    transition: background-color 0.4s ease-out !important;
  }

  .back-btn {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background-color: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 1px solid rgba(128,128,128,0.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s;
    flex-shrink: 0;
  }

  .back-btn:active {
    transform: scale(0.9);
  }

  @media (max-width: 680px) {
    .deck-stage {
      min-height: 480px;
      max-width: 100%;
    }

    .header-left {
      max-width: 65%;
    }
  }
</style>

{#if currentView === 'dashboard'}
  <Dashboard {chapterProgress} on:selectDeck={handleStartDeck} />
{:else}
  <main in:fade={{duration: 300}}>
    <header>
      <div class="header-top">
        <div class="header-left">
          <button class="back-btn" on:click={returnToDashboard} aria-label="Back">&larr;</button>
          <div class="header-title">{activeDeckTitle || 'Mind Gym'}</div>
        </div>
        <div class="progress-container">
          <div class="progress-bar" style="width: {progressPercent}%"></div>
        </div>
      </div>
    </header>

    <div class="deck-area">
      <div class="deck-stage">
        {#if currentIndex >= deck.length && deck.length > 0}
          <div class="deck-complete" in:fade={{duration: 800}}>
            <h2>Illusion Dismantled</h2>
            <p>Deck Complete</p>
            <button class="reset-btn" on:click={() => { currentIndex = 0; bgTint = 'var(--bg-primary)'; }}>Restart Deck</button>
            <button class="reset-btn" style="margin-top: 12px; background-color: var(--bg-card); color: var(--text-primary); border: 1px solid rgba(128,128,128,0.2);" on:click={returnToDashboard}>Back to Dashboard</button>
          </div>
        {:else}
          <!-- Render up to 3 cards for the stack effect -->
          {#each deck as card, i (card.id)}
            {#if i >= currentIndex && i < currentIndex + 3}
              <div transition:fade={{duration: 200}} style="position: absolute; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; pointer-events: none;">
                <TruthCard 
                  {card} 
                  active={i === currentIndex} 
                  stackIndex={i - currentIndex}
                  theme={activeDeck?.theme}
                  on:commit={handleCommit}
                  on:nextCard={handleNextCard}
                  on:interactionStart={handleInteractionStart}
                  on:interactionCancel={handleInteractionCancel}
                />
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    </div>
</main>
{/if}
