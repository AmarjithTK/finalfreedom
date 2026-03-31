<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { decks } from './data/decks';
  import { easypeasyBook } from './data/easypeasy';

  export let chapterProgress: Record<number, number> = {};
  
  const dispatch = createEventDispatcher();
  
  const modes = ['Decks', 'EasyPeasy Book'];
  let activeMode = 'Decks';

  const orderedDecks = [...decks].sort((a, b) => a.id - b.id);
  const orderedBooks = [...easypeasyBook].sort((a, b) => a.id - b.id);

  function progressFor(deckId: number) {
    return chapterProgress[deckId] ?? 0;
  }

  function isLocked(deck: any) {
    if (deck.id === 1) return false;
    return progressFor(deck.id - 1) < 100;
  }

  function handleDeckSelect(deck: any) {
    if (isLocked(deck)) return;
    if (deck.cards && deck.cards.length > 0) {
      dispatch('selectDeck', deck);
    } else {
      alert("This deck is coming soon!");
    }
  }

  function handleBookSelect(chapter: any) {
    if (chapter.cards && chapter.cards.length > 0) {
      dispatch('selectBook', chapter);
    } else {
      alert("This chapter is coming soon!");
    }
  }
</script>

<style>
  .dashboard {
    width: 100%;
    height: 100dvh;
    padding: clamp(12px, 2.2vw, 24px);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-color: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    margin-top: 8px;
    gap: 14px;
    flex-shrink: 0;
  }

  h1 {
    font-size: clamp(30px, 3.4vw, 46px);
    font-weight: 600;
    margin: 0;
    line-height: 1.08;
    letter-spacing: -0.7px;
    max-width: 100%;
    flex-shrink: 0;
  }

  .filters {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 4px 2px 14px;
    margin-bottom: 10px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    flex-shrink: 0;
  }
  .filters::-webkit-scrollbar {
    display: none;
  }

  .filter-btn {
    padding: 10px 16px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    background-color: var(--bg-card);
    color: var(--text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(128,128,128,0.1);
    flex-shrink: 0;
  }

  .filter-btn.active {
    background-color: var(--text-primary);
    color: var(--bg-primary);
  }

  .section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    opacity: 0.75;
    flex-shrink: 0;
  }

  .deck-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 24px;
  }

  .deck-card {
    border-radius: 20px;
    padding: clamp(14px, 1.6vw, 20px);
    display: flex;
    flex-direction: column;
    text-align: left;
    transition: transform 0.2s;
    min-height: 132px;
    cursor: pointer;
    border: 1px solid rgba(128, 128, 128, 0.13);
    gap: 8px;
  }

  .deck-card.book-card {
    background-color: #f1f3f5;
    color: #1a1a1a;
    border: 1px solid rgba(0,0,0,0.08);
  }

  .deck-card:active {
    transform: scale(0.98);
  }

  .deck-card.locked {
    opacity: 0.58;
    cursor: not-allowed;
    filter: grayscale(0.08);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    margin-bottom: 2px;
  }

  .top-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .chapter-badge,
  .category-pill {
    background-color: rgba(255, 255, 255, 0.45);
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2px;
    white-space: nowrap;
  }

  .book-card .chapter-badge {
    background-color: rgba(0, 0, 0, 0.08);
  }

  .chapter-badge {
    background-color: rgba(31, 31, 31, 0.08);
    color: inherit;
  }

  .completion-pill {
    background-color: rgba(255, 255, 255, 0.6);
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .card-content h3 {
    font-size: clamp(22px, 2.4vw, 34px);
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.4px;
    max-width: 95%;
    text-wrap: balance;
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 4px;
  }

  .card-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .progress-wrap {
    width: min(320px, 52%);
    min-width: 140px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .progress-track {
    width: 100%;
    height: 7px;
    border-radius: 999px;
    background: rgba(31, 31, 31, 0.12);
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: inherit;
    background: color-mix(in srgb, var(--text-primary) 68%, white);
    transition: width 240ms ease;
  }

  .progress-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    opacity: 0.85;
  }

  .lock-note {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    opacity: 0.85;
  }

  @media (max-width: 760px) {
    .dashboard {
      padding: 12px;
    }

    h1 {
      max-width: 100%;
    }

    .deck-card {
      min-height: 156px;
    }

    .card-content h3 {
      font-size: clamp(24px, 7vw, 34px);
      max-width: 100%;
    }

    .meta-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .progress-wrap {
      width: 100%;
      align-items: flex-start;
      min-width: 0;
    }
  }
</style>

<div class="dashboard">
  <div class="header">
    <h1>Final Freedom</h1>
  </div>

  <div class="filters">
    {#each modes as mode}
      <button 
        class="filter-btn" 
        class:active={activeMode === mode}
        on:click={() => activeMode = mode}
      >
        {mode}
      </button>
    {/each}
  </div>

  <div class="section-title">{activeMode}</div>

  <div class="deck-grid">
    {#if activeMode === 'Decks'}
      {#each orderedDecks as deck (deck.id)}
        {@const completion = progressFor(deck.id)}
        {@const locked = isLocked(deck)}
        <button 
          class="deck-card"
          class:locked={locked}
          style="background-color: {deck.theme.bg}; color: {deck.theme.text};"
          on:click={() => handleDeckSelect(deck)}
          aria-label="Chapter {deck.id}: {deck.title}"
        >
          <div class="card-top">
            <div class="top-left">
              <div class="chapter-badge">Chapter {deck.id}</div>
              <div class="category-pill">{deck.category}</div>
            </div>
            <div class="completion-pill">{completion}% complete</div>
          </div>
          
          <div class="card-content">
            <h3>{deck.title}</h3>
          </div>

          <div class="meta-row">
            <div class="card-footer">
              {deck.cardCount} cards
            </div>
            <div class="progress-wrap">
              <div class="progress-track">
                <div class="progress-fill" style="width: {completion}%"></div>
              </div>
              {#if locked}
                <div class="lock-note">Complete Chapter {deck.id - 1} to unlock</div>
              {:else}
                <div class="progress-label">Learning Progress</div>
              {/if}
            </div>
          </div>
        </button>
      {/each}
    {:else}
      {#each orderedBooks as chapter (chapter.id)}
        <button 
          class="deck-card book-card"
          on:click={() => handleBookSelect(chapter)}
          aria-label="Book Chapter {chapter.chapter}: {chapter.title}"
        >
          <div class="card-top">
            <div class="top-left">
              <div class="chapter-badge">Chapter {chapter.chapter}</div>
            </div>
          </div>
          
          <div class="card-content">
            <h3>{chapter.title}</h3>
          </div>

          <div class="meta-row">
            <div class="card-footer">
              {chapter.cards.length} cards
            </div>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>
