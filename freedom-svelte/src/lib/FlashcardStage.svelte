<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let chapter: any;
  const dispatch = createEventDispatcher();

  let cards = chapter.cards;
  let currentIndex = 0;
  let isFlipped = false;

  $: currentCard = cards[currentIndex];
  $: progressPercent = Math.round(((currentIndex) / cards.length) * 100);

  function handleNext() {
    if (currentIndex < cards.length - 1) {
      isFlipped = false;
      setTimeout(() => {
        currentIndex++;
      }, 150);
    } else {
      isFlipped = false;
      setTimeout(() => {
        currentIndex++;
      }, 150);    
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      isFlipped = false;
      setTimeout(() => {
        currentIndex--;
      }, 150);
    }
  }

  function handleCardTap() {
    if (!isFlipped) {
      isFlipped = true;
    } else {
      handleNext();
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleCardTap();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  function returnToDashboard() {
    dispatch('back');
  }

  function completeChapter() {
    // We could dispatch complete logic here
    dispatch('complete', { chapterId: chapter.id });
  }

</script>

<style>
  .flashcard-stage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-top: 10px;
  }

  .nav-controls {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0 clamp(8px, 2vw, 20px);
    pointer-events: none;
    z-index: 10;
  }

  .nav-btn {
    pointer-events: auto;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid rgba(128,128,128,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    color: var(--text-primary);
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
  }

  .nav-btn:hover {
    background: color-mix(in srgb, var(--bg-card) 90%, var(--text-primary));
  }

  .nav-btn:active {
    transform: scale(0.9);
  }

  .nav-btn:disabled {
    opacity: 0.3;
    pointer-events: none;
  }

  .card-container {
    perspective: 1500px;
    width: clamp(320px, 88vw, 800px);
    height: clamp(400px, 72vh, 650px);
    margin: auto;
    position: relative;
    cursor: pointer;
  }

  .complete-msg {
    margin: auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .complete-msg h2 {
    font-size: clamp(28px, 5vw, 40px);
    color: var(--text-primary);
    margin: 0;
  }

  .complete-msg button {
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    background-color: var(--text-primary);
    color: var(--bg-primary);
    border: none;
    cursor: pointer;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.2);
    border-radius: var(--md-shape-xl);
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .card-inner.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: clamp(24px, 4vw, 40px);
    border-radius: var(--md-shape-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-card);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    border: 1px solid rgba(128, 128, 128, 0.1);
    overflow-y: auto;
  }

  .card-back {
    transform: rotateY(180deg);
    background-color: var(--md-surface-variant);
  }

  :global([data-theme="dark"]) .card-back {
    background-color: var(--md-surface-variant);
  }

  .card-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
  }

  .card-number {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-secondary);
    opacity: 0.6;
    letter-spacing: 1px;
  }

  .tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: flex-end;
    max-width: 60%;
  }

  .tag {
    background: rgba(0,0,0,0.05);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  :global([data-theme="dark"]) .tag {
    background: rgba(255,255,255,0.1);
  }

  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    padding: 20px 0;
  }

  .key-concept {
    font-size: clamp(12px, 1.5vw, 15px);
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #FF8C00;
    font-weight: 700;
    margin-bottom: 24px;
  }

  .content-text {
    font-size: clamp(20px, 3.2vw, 32px);
    line-height: 1.6;
    color: var(--text-primary);
    font-weight: 500;
    text-wrap: balance;
  }
  
  .hint {
    margin-top: auto;
    font-size: 13px;
    color: var(--text-secondary);
    outline: 1px solid rgba(128,128,128,0.2);
    background: rgba(128,128,128,0.05);
    padding: 8px 16px;
    border-radius: 999px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 600;
    flex-shrink: 0;
  }
</style>

<div class="flashcard-stage">
  {#if currentIndex >= cards.length}
    <div class="complete-msg" in:fade={{duration: 400}}>
      <h2>Chapter Complete!</h2>
      <button on:click={completeChapter}>Return to Books</button>
    </div>
  {:else}
    <div class="nav-controls">
      <button 
        class="nav-btn" 
        on:click={handlePrev} 
        disabled={currentIndex === 0}
        aria-label="Previous Card"
      >
        &larr;
      </button>
      <button 
        class="nav-btn" 
        on:click={handleNext}
        aria-label="Next Card"
      >
        &rarr;
      </button>
    </div>

    <div class="card-container" role="button" tabindex="0" on:click={handleCardTap} on:keydown={(e) => e.key === 'Enter' && handleCardTap()}>
      {#key currentIndex}
        <div class="card-inner" class:flipped={isFlipped} in:fade={{duration: 200}}>
          <!-- Front of card -->
          <div class="card-face">
            <div class="card-header">
              <div class="card-number">{currentIndex + 1} / {cards.length}</div>
              {#if currentCard.tags && currentCard.tags.length > 0}
                <div class="tags">
                  {#each currentCard.tags.slice(0, 2) as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>
            
            <div class="card-body">
              {#if currentCard.key_concept}
                <div class="key-concept">{currentCard.key_concept}</div>
              {/if}
              <div class="content-text">
                {currentCard.front}
              </div>
            </div>
            
            <div class="hint">Tap to Show Idea</div>
          </div>
          
          <!-- Back of card -->
          <div class="card-face card-back">
            <div class="card-header">
              <div class="card-number">{currentIndex + 1} / {cards.length}</div>
              {#if currentCard.tags && currentCard.tags.length > 0}
                <div class="tags">
                  {#each currentCard.tags.slice(0, 2) as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </div>

            <div class="card-body">
              <div class="content-text">
                {currentCard.back}
              </div>
            </div>

            <div class="hint">Tap for Next</div>
          </div>
        </div>
      {/key}
    </div>
  {/if}
</div>
