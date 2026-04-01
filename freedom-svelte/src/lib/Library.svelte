<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  const chapters = [
    {
      id: 1,
      title: 'What Trauma Actually Is',
      subtitle: 'The Neuroscience of Overwhelm',
      emoji: '🧠',
      file: '01_what_trauma_actually_is.md',
      readTime: '35 min read',
    },
    {
      id: 2,
      title: 'Reality vs. Media',
      subtitle: 'What Is Never Shown',
      emoji: '🎭',
      file: '02_reality_vs_media_what_is_never_shown.md',
      readTime: '40 min read',
    },
    {
      id: 3,
      title: 'Complex PTSD',
      subtitle: 'When Trauma Becomes a Way of Living',
      emoji: '🌀',
      file: '03_complex_ptsd_when_trauma_becomes_a_way_of_living.md',
      readTime: '45 min read',
    },
    {
      id: 4,
      title: 'The Male Empathy Gap',
      subtitle: 'Why We Don\'t Understand Female Trauma',
      emoji: '🪞',
      file: '04_the_male_empathy_gap.md',
      readTime: '40 min read',
    },
    {
      id: 5,
      title: 'How Abuse Systems Are Built',
      subtitle: 'Architecture of Coercive Control',
      emoji: '⛓️',
      file: '05_how_abuse_systems_are_built_and_sustained.md',
      readTime: '45 min read',
    },
    {
      id: 6,
      title: 'Healing Is Real',
      subtitle: 'What Recovery Actually Looks Like',
      emoji: '🌱',
      file: '06_healing_is_real_what_recovery_looks_like.md',
      readTime: '40 min read',
    },
    {
      id: 7,
      title: 'Counter-Conditioning',
      subtitle: 'Breaking Free From Learned Distortions',
      emoji: '🔓',
      file: '07_counter_conditioning_breaking_free_from_distortions.md',
      readTime: '35 min read',
    },
  ];

  let activeChapter: (typeof chapters)[0] | null = null;
  let content = '';
  let loading = false;
  let scrollEl: HTMLElement;
  let readProgress = 0;

  async function openChapter(ch: (typeof chapters)[0]) {
    activeChapter = ch;
    loading = true;
    content = '';
    try {
      const res = await fetch(`/docs/${ch.file}`);
      if (res.ok) {
        content = await res.text();
      } else {
        content = `# ${ch.title}\n\nContent could not be loaded. Make sure the docs folder is served alongside the app.`;
      }
    } catch {
      content = `# ${ch.title}\n\nUnable to fetch document.`;
    }
    loading = false;
    readProgress = 0;
    if (scrollEl) scrollEl.scrollTop = 0;
  }

  function handleScroll() {
    if (!scrollEl) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollEl;
    const max = scrollHeight - clientHeight;
    readProgress = max > 0 ? Math.round((scrollTop / max) * 100) : 100;
  }

  /** Very lightweight markdown → HTML (headings, bold, italic, blockquotes, hr, tables, lists) */
  function mdToHtml(md: string): string {
    let html = md
      // Escape raw HTML first
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Headings
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$2</h2>'.replace('$2','$1'))
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr>')
      // Blockquote
      .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Unordered list items
      .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
      // Ordered list items
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
      // Double newline → paragraph break
      .replace(/\n\n/g, '\n<p>')
      // Single newline
      .replace(/\n/g, '<br>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>[\s\S]*?<\/li>)(\s*<br>)*(\s*(?!<li>))/g, (m, list) => `<ul>${list}</ul>`);

    return html;
  }
</script>

<style>
  .library {
    width: 100%;
    height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }

  /* ── Top bar ── */
  .topbar {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    border-bottom: 1px solid rgba(128,128,128,0.12);
    flex-shrink: 0;
    background: var(--bg-primary);
    z-index: 10;
  }

  .back-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 1px solid rgba(128,128,128,0.15);
    font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: transform 0.15s;
  }
  .back-btn:active { transform: scale(0.9); }

  .topbar-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .progress-strip {
    height: 3px;
    background: rgba(128,128,128,0.1);
    flex-shrink: 0;
  }
  .progress-fill {
    height: 100%;
    background: var(--md-primary);
    transition: width 0.3s;
  }

  /* ── Chapter list ── */
  .chapter-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-header {
    font-size: clamp(26px, 3.5vw, 38px);
    font-weight: 700;
    letter-spacing: -0.5px;
    margin-bottom: 8px;
    line-height: 1.1;
  }
  .list-sub {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 18px;
    line-height: 1.5;
  }

  .chapter-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px;
    border-radius: 18px;
    background: var(--bg-card);
    border: 1px solid rgba(128,128,128,0.1);
    cursor: pointer;
    text-align: left;
    transition: transform 0.18s, box-shadow 0.18s;
    width: 100%;
  }
  .chapter-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }
  .chapter-card:active { transform: scale(0.98); }

  .ch-emoji {
    font-size: 28px;
    flex-shrink: 0;
    width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 14px;
    background: var(--md-primary-container);
  }

  .ch-info { flex: 1; min-width: 0; }
  .ch-number {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.2px; color: var(--md-primary); margin-bottom: 4px;
  }
  .ch-title {
    font-size: 17px; font-weight: 700; line-height: 1.25;
    margin-bottom: 3px;
  }
  .ch-subtitle {
    font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;
  }
  .ch-meta {
    font-size: 11px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; opacity: 0.55;
  }

  /* ── Reader ── */
  .reader-wrap {
    flex: 1;
    overflow-y: auto;
    padding: 24px clamp(16px, 5vw, 60px) 60px;
    max-width: 860px;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .loader {
    display: flex; align-items: center; justify-content: center;
    height: 60vh;
    font-size: 24px;
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Markdown styles ── */
  .md-body :global(h1) {
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 800;
    letter-spacing: -0.6px;
    line-height: 1.1;
    margin: 0 0 20px;
  }
  .md-body :global(h2) {
    font-size: clamp(20px, 2.5vw, 28px);
    font-weight: 700;
    margin: 40px 0 14px;
    border-bottom: 1px solid rgba(128,128,128,0.15);
    padding-bottom: 8px;
  }
  .md-body :global(h3) {
    font-size: clamp(17px, 2vw, 22px);
    font-weight: 700;
    margin: 32px 0 10px;
    color: var(--md-primary);
  }
  .md-body :global(h4) {
    font-size: 16px; font-weight: 700;
    margin: 24px 0 8px; opacity: 0.85;
  }
  .md-body :global(p),
  .md-body :global(br + br) {
    font-size: clamp(15px, 1.8vw, 17px);
    line-height: 1.78;
    margin-bottom: 16px;
    color: var(--text-secondary);
  }
  .md-body :global(blockquote) {
    border-left: 4px solid var(--md-primary);
    padding: 12px 18px;
    margin: 24px 0;
    background: var(--bg-card);
    border-radius: 0 12px 12px 0;
    font-style: italic;
    font-size: 16px;
    color: var(--text-secondary);
  }
  .md-body :global(hr) {
    border: none;
    border-top: 1px solid rgba(128,128,128,0.15);
    margin: 40px 0;
  }
  .md-body :global(ul), .md-body :global(ol) {
    padding-left: 24px;
    margin-bottom: 18px;
  }
  .md-body :global(li) {
    font-size: clamp(15px, 1.8vw, 17px);
    line-height: 1.7;
    margin-bottom: 6px;
    color: var(--text-secondary);
  }
  .md-body :global(strong) { color: var(--text-primary); font-weight: 700; }
  .md-body :global(em) { font-style: italic; }
  .md-body :global(code) {
    background: var(--bg-card);
    border-radius: 6px;
    padding: 2px 7px;
    font-family: monospace;
    font-size: 14px;
  }

  .chapter-done-banner {
    text-align: center;
    padding: 32px 20px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-secondary);
    opacity: 0.7;
  }
</style>

<div class="library">
  <!-- Topbar -->
  <div class="topbar">
    <button class="back-btn" on:click={() => { if (activeChapter) { activeChapter = null; } else { dispatch('back'); } }} aria-label="Back">
      ←
    </button>
    <div class="topbar-title">
      {#if activeChapter}
        {activeChapter.emoji} {activeChapter.title}
      {:else}
        📚 Trauma Awareness Library
      {/if}
    </div>
  </div>

  <!-- Progress strip (only in reader) -->
  {#if activeChapter}
    <div class="progress-strip">
      <div class="progress-fill" style="width: {readProgress}%"></div>
    </div>
  {/if}

  {#if !activeChapter}
    <!-- Chapter list -->
    <div class="chapter-list" in:fade={{ duration: 200 }}>
      <div class="list-header">Truth Library</div>
      <div class="list-sub">Seven in-depth evidence-based chapters on trauma, abuse, media conditioning, and recovery. Read at your own pace.</div>

      {#each chapters as ch (ch.id)}
        <button class="chapter-card" on:click={() => openChapter(ch)} aria-label="Open chapter {ch.id}: {ch.title}">
          <div class="ch-emoji">{ch.emoji}</div>
          <div class="ch-info">
            <div class="ch-number">Chapter {ch.id}</div>
            <div class="ch-title">{ch.title}</div>
            <div class="ch-subtitle">{ch.subtitle}</div>
            <div class="ch-meta">{ch.readTime}</div>
          </div>
        </button>
      {/each}
    </div>

  {:else}
    <!-- Reader -->
    <div class="reader-wrap" bind:this={scrollEl} on:scroll={handleScroll} in:fade={{ duration: 200 }}>
      {#if loading}
        <div class="loader">⟳</div>
      {:else}
        <div class="md-body">
          {@html mdToHtml(content)}
        </div>
        <div class="chapter-done-banner">— End of Chapter {activeChapter.id} —</div>
      {/if}
    </div>
  {/if}
</div>
