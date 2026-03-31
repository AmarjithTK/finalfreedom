<script lang="ts">
  import { spring } from 'svelte/motion';
  import { createEventDispatcher } from 'svelte';

  export let card: {
    id: number;
    illusionFront: string;
    realityCheckBack: string;
    isValidationCard: boolean; // RIGHT is align/correct, LEFT is illusion/wrong
  };
  export let active = false;
  export let stackIndex = 0;
  export let theme = { bg: '#FFFFFF', text: '#1F1F1F' };
  
  const dispatch = createEventDispatcher();
  
  let xOffset = spring(0, { stiffness: 0.08, damping: 0.6 });
  let yOffset = spring(0, { stiffness: 0.08, damping: 0.6 });
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startClientX = 0;
  let startClientY = 0;
  let lastTapTime = 0;
  let flipped = false;
  let resultStatus: 'correct' | 'incorrect' | null = null;
  
  const SWIPE_THRESHOLD = 120; // PX to trigger
  const MAX_ROTATION_DEG = 8; // Physics limit degrees

  $: rotateZ = active ? Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, ($xOffset / SWIPE_THRESHOLD) * MAX_ROTATION_DEG)) : 0;
  
  $: swipeProgress = active ? Math.min(1, Math.abs($xOffset) / (SWIPE_THRESHOLD * 0.8)) : 0;
  $: isSwipingRight = $xOffset > 0;
  
  $: scale = active ? 1 : Math.max(0.85, 1 - (stackIndex * 0.06));
  $: stackY = active ? 0 : stackIndex * 24;
  $: zIdx = 10 - stackIndex;
  $: opac = active ? 1 : Math.max(0, 1 - (stackIndex * 0.3));

  function commitSwipe(swipedRight: boolean) {
    const isCorrect = (card.isValidationCard && swipedRight) || (!card.isValidationCard && !swipedRight);
    resultStatus = isCorrect ? 'correct' : 'incorrect';
    flipped = true;
    xOffset.set(0);
    yOffset.set(0);
    dispatch('commit', { swipedRight, isCorrect, card });
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!active || flipped) return;
    if (e.key === 'ArrowRight') {
      commitSwipe(true);
    }
    if (e.key === 'ArrowLeft') {
      commitSwipe(false);
    }
  }

  function handlePointerDown(e: PointerEvent) {
    if (!active) return;
    
    (e.target as Element).setPointerCapture(e.pointerId);
    isDragging = true;
    startX = e.clientX - $xOffset;
    startY = e.clientY - $yOffset;
    startClientX = e.clientX;
    startClientY = e.clientY;
  }
  
  function handlePointerMove(e: PointerEvent) {
    if (!isDragging) return;
    xOffset.set(e.clientX - startX);
    yOffset.set(e.clientY - startY);
  }
  
  function handlePointerUp(e: PointerEvent) {
    if (!active) return;
    isDragging = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
    
    const dx = Math.abs(e.clientX - startClientX);
    const dy = Math.abs(e.clientY - startClientY);
    
    if (dx < 10 && dy < 10) {
      // It's a tap
      const now = Date.now();
      if (now - lastTapTime < 300) {
        // Double tap
        if (flipped) {
          resultStatus = null;
          flipped = false;
          dispatch('nextCard');
        } else {
          flipped = true;
        }
        lastTapTime = 0;
      } else {
        lastTapTime = now;
        if (!flipped) {
          flipped = true;
        } else if (flipped && resultStatus !== null) {
          resultStatus = null;
          flipped = false;
          dispatch('nextCard');
        }
      }
      xOffset.set(0);
      yOffset.set(0);
      return;
    }

    if (flipped) {
      xOffset.set(0);
      yOffset.set(0);
      return;
    }

    if ($xOffset > SWIPE_THRESHOLD) {
      commitSwipe(true);
    } else if ($xOffset < -SWIPE_THRESHOLD) {
      commitSwipe(false);
    } else {
      xOffset.set(0);
      yOffset.set(0);
    }
  }

  function handleNext() {
    dispatch('nextCard');
  }
</script>

<style>
  .card-container {
    position: absolute;
    width: min(92vw, 370px);
    height: min(70vh, 560px);
    min-height: 470px;
    perspective: 2000px;
    touch-action: none;
    user-select: none;
    will-change: transform;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-origin: bottom center;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease;
    transform-style: preserve-3d;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.05);
    border-radius: 28px;
  }
  
  .card-inner.flipped {
    transform: rotateY(180deg);
    box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  }
  
  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background-color: var(--card-bg, #FFFFFF);
    color: var(--card-text, #1F1F1F);
    border-radius: 28px;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(128,128,128,0.15);
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .card-front {
    justify-content: center;
    align-items: center;
  }

  .illusion-text {
    font-size: clamp(20px, 2.8vw, 26px);
    font-weight: 700;
    line-height: 1.4;
    text-align: center;
    letter-spacing: -0.5px;
    z-index: 2;
    padding-bottom: 24px;
  }
  
  .card-back {
    transform: rotateY(180deg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  .swipe-indicator {
    position: absolute;
    top: 40px;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: clamp(16px, 2.4vw, 24px);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0;
    z-index: 1;
    transform: rotate(-15deg);
  }

  .swipe-yes {
    right: 32px;
    color: #4CAF50;
    border: 4px solid #4CAF50;
    transform: rotate(15deg);
  }

  .swipe-no {
    left: 32px;
    color: #F44336;
    border: 4px solid #F44336;
    transform: rotate(-15deg);
  }

  .swipe-hint {
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    opacity: 0.4;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .swipe-hint span {
    margin: 0 16px;
    opacity: 0.5;
  }
  
  .result-banner {
    width: 100%;
    padding: 14px 0;
    margin-bottom: 12px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    border-radius: 16px;
    background: rgba(0,0,0,0.04);
    flex-shrink: 0;
  }
  
  .result-banner.correct {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
  }
  
  .result-banner.incorrect {
    color: #F44336;
    background: rgba(244, 67, 54, 0.1);
  }

  .reality-text-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    overflow-y: auto;
  }

  .reality-text {
    text-align: center;
    font-size: clamp(15px, 2.1vw, 18px);
    font-weight: 500;
    line-height: 1.5;
    color: var(--card-text);
    text-wrap: pretty;
  }

  .next-btn {
    margin-top: 12px;
    width: 100%;
    padding: 18px 0;
    border-radius: 20px;
    background-color: var(--card-text);
    color: var(--card-bg);
    font-weight: 700;
    font-size: clamp(15px, 1.8vw, 16px);
    letter-spacing: 0.5px;
    border: none;
    transition: opacity 0.2s, transform 0.2s;
    cursor: pointer;
    flex-shrink: 0;
  }

  .next-btn:active {
    opacity: 0.8;
    transform: scale(0.96);
  }

  @media (max-width: 430px) {
    .card-container {
      min-height: 450px;
      height: min(68vh, 520px);
    }

    .card-face {
      padding: 24px 18px;
      border-radius: 24px;
    }

    .swipe-hint {
      font-size: 11px;
      letter-spacing: 1.4px;
      bottom: 18px;
    }

    .next-btn {
      margin-top: 10px;
      padding: 16px 0;
      border-radius: 16px;
    }
  }
</style>

<div class="card-container" 
  style="
    transform: translateX({active ? $xOffset : 0}px) 
               translateY({active ? $yOffset : stackY}px) 
               rotateZ({rotateZ}deg) 
               scale({scale}); 
    z-index: {zIdx}; 
    opacity: {opac};
    transition: {active && !isDragging ? 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : (!active ? 'all 0.4s ease' : 'none')}; 
    --card-bg: {theme.bg}; 
    --card-text: {theme.text};
    pointer-events: {active ? 'auto' : 'none'};
  "
  role="button"
  tabindex={active ? 0 : -1}
  aria-label="Swipe card left for false or right for true"
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointercancel={handlePointerUp}
  on:keydown={handleKeyDown}
>
  <div class="card-inner" class:flipped>
    <div class="card-face card-front">
      {#if active && !flipped}
        <div class="swipe-indicator swipe-yes" style="opacity: {isSwipingRight ? swipeProgress : 0}">TRUE</div>
        <div class="swipe-indicator swipe-no" style="opacity: {!isSwipingRight ? swipeProgress : 0}">FALSE</div>
      {/if}
      
      <div class="illusion-text">{card.illusionFront}</div>
      
      <div class="swipe-hint">
        &larr; False <span>|</span> True &rarr;
      </div>
    </div>
    
    <div class="card-face card-back">
      {#if flipped && resultStatus}
        <div class="result-banner {resultStatus}">
          {resultStatus === 'correct' ? 'Perception Aligned' : 'Illusion Detected'}
        </div>
      {/if}
      <div class="reality-text-container">
        <div class="reality-text">
          {card.realityCheckBack}
        </div>
      </div>
      <button class="next-btn" on:click|stopPropagation={handleNext}>Next Illusion</button>
    </div>
  </div>
</div>
