<script lang="ts">
  import { onMount } from 'svelte';
  import Dashboard from './lib/Dashboard.svelte';
  import TruthCard from './lib/TruthCard.svelte';
  import FlashcardStage from './lib/FlashcardStage.svelte';
  import { fade } from 'svelte/transition';
  import confetti from 'canvas-confetti';
  // @ts-ignore
  import { decks } from './lib/data/decks';
  import { easypeasyBook } from './lib/data/easypeasy';
  import { themeStore } from './lib/theme';
  
  let currentView: 'dashboard' | 'deck' | 'book' = 'dashboard';
  let activeDeck: any = null;
  let activeBook: any = null;
  
  let deck: any[] = [];
  let currentIndex = 0;
  
  let bgTint = 'var(--bg-primary)';

  // Persist progress across reloads
  let chapterProgress: Record<string | number, number> = {};

  onMount(() => {
    themeStore.init();

    const saved = localStorage.getItem('freedom-progress');
    if (saved) {
      try {
        chapterProgress = JSON.parse(saved);
      } catch (e) {}
    }
  });

  function saveProgress() {
    localStorage.setItem('freedom-progress', JSON.stringify(chapterProgress));
  }

  function handleStartDeck(event: CustomEvent) {
    activeDeck = event.detail;
    deck = [...activeDeck.cards];
    currentIndex = 0;
    bgTint = 'var(--md-surface-variant)';
    currentView = 'deck';
  }

  function handleStartBook(event: CustomEvent) {
    activeBook = event.detail;
    bgTint = 'var(--bg-primary)'; // A nice neutral reading background
    currentView = 'book';
  }

  function handleCommit(event: CustomEvent) {
    const { x, y } = event.detail;
    
    // We update progress to LocalStorage immediately
    if (activeDeck) {
      let percent = Math.min(100, Math.round(((currentIndex + 1) / deck.length) * 100));
      chapterProgress[activeDeck.id] = Math.max(chapterProgress[activeDeck.id] || 0, percent);
      chapterProgress = { ...chapterProgress };
      saveProgress();
    }

    bgTint = 'var(--glow-align)';
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: Math.min(1, Math.max(0, x / window.innerWidth)), y: Math.min(1, Math.max(0, y / window.innerHeight)) },
      colors: ['#2ECC71', '#27AE60', '#F1C40F']
    });

     setTimeout(() => {
      if (activeDeck) {
        bgTint = 'var(--bg-primary)';
      }
    }, 1500); 
  }

  function handleNextCard() {
    if (currentIndex < deck.length) {
      currentIndex++;
      bgTint = 'var(--bg-primary)';
    }
  }

  function prevCard() {
    if (currentIndex > 0) {
      currentIndex--;
      bgTint = 'var(--bg-primary)';
    }
  }

  function returnToDashboard() {
    currentView = 'dashboard';
    activeDeck = null;
    activeBook = null;
    bgTint = 'var(--bg-primary)';
  }

  function handleBookComplete(e: CustomEvent) {
    if (activeBook) {
      chapterProgress[`book_` + activeBook.id] = 100;
      chapterProgress = { ...chapterProgress };
      saveProgress();

      const currentIdx = easypeasyBook.findIndex((b: any) => b.id === activeBook.id);
      if (currentIdx >= 0 && currentIdx < easypeasyBook.length - 1) {
        const nextChapter = easypeasyBook[currentIdx + 1];
        if (confirm(`Chapter Complete!\nStart next chapter: ${nextChapter.title}?`)) {
          activeBook = nextChapter;
          return;
        }
      }
    }
    returnToDashboard();
  }

  $: progressPercent = activeDeck && deck.length > 0 
    ? Math.round((Math.min(currentIndex, deck.length) / deck.length) * 100)
    : 0;

  $: document.body.style.backgroundColor = bgTint;
</script>

<style>
  main {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .deck-area {
    flex: 1;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: clamp(12px, 2vw, 24px);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    gap: 10px;
  }

  .deck-stage {
    position: relative;
    width: clamp(300px, 85vw, 440px);
    height: clamp(480px, 68vh, 600px);
    margin: auto;
  }

  /* Shared header for deck & book modes */
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

  .deck-complete {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .reset-btn {
    margin-top: 24px;
    padding: 12px 24px;
    border-radius: 999px;
    border: none;
    background-color: var(--text-primary);
    color: var(--bg-primary);
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .reset-btn:active {
    transform: scale(0.95);
  }

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
  <Dashboard 
    {chapterProgress} 
    on:selectDeck={handleStartDeck} 
    on:selectBook={handleStartBook} 
  />
{:else if currentView === 'deck'}
  <main in:fade={{duration: 300}}>
    <header>
      <div class="header-top">
        <div class="header-left">
          <button class="back-btn" on:click={returnToDashboard} aria-label="Back">&larr;</button>
          <div class="header-title">{activeDeck?.title || 'Mind Gym'}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="back-btn" style="width: 28px; height: 28px; font-size: 14px; opacity: {currentIndex === 0 ? 0.3 : 1};" on:click={prevCard} disabled={currentIndex === 0}>&lt;</button>
          <div class="progress-container" style="width: clamp(60px, 15vw, 120px);">
            <div class="progress-bar" style="width: {progressPercent}%"></div>
          </div>
          <span style="font-size: 12px; font-weight: 500; color: var(--text-secondary); min-width: 40px; text-align: center;">{Math.min(deck.length > 0 ? currentIndex + 1 : 0, deck.length)}/{deck.length}</span>
          <button class="back-btn" style="width: 28px; height: 28px; font-size: 14px; opacity: {currentIndex >= deck.length ? 0.3 : 1};" on:click={handleNextCard} disabled={currentIndex >= deck.length}>&gt;</button>
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
                />
              </div>
            {/if}
          {/each}
        {/if}
      </div>
    </div>
  </main>
{:else if currentView === 'book'}
  <main in:fade={{duration: 300}}>
    <header>
      <div class="header-top">
        <div class="header-left">
          <button class="back-btn" on:click={returnToDashboard} aria-label="Back">&larr;</button>
          <div class="header-title">{activeBook?.title || 'Book Reading'}</div>
        </div>
      </div>
    </header>

    <div class="deck-area" style="max-width: 100%;">
      <FlashcardStage 
        chapter={activeBook} 
        on:back={returnToDashboard} 
        on:complete={handleBookComplete} 
      />
    </div>
  </main>
{/if}
