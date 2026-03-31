import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/lib/Dashboard.svelte');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. imports and exports
code = code.replace(
  "import { createEventDispatcher } from 'svelte';",
  "import { createEventDispatcher, onMount } from 'svelte';"
);
code = code.replace(
  "export let progress: Record<number, number> = {};",
  "export let progress: Record<number, number> = {};\nexport let bookProgress: Record<number, number> = {};"
);

// 2. Add local storage for activeMode
code = code.replace(
  "let activeMode = 'Decks';",
  `let activeMode = 'Decks';

onMount(() => {
  const saved = localStorage.getItem('dashboard-mode');
  if (saved) activeMode = saved;
});

$: { if (typeof window !== 'undefined') localStorage.setItem('dashboard-mode', activeMode); }`
);

// 3. Add pill to HTML
const targetBlock = `          <div class="card-top">
            <div class="top-left">
              <div class="chapter-badge">Chapter {chapter.chapter}</div>
            </div>
          </div>`;
const replaceBlock = `          <div class="card-top">
            <div class="top-left">
              <div class="chapter-badge">Chapter {chapter.chapter}</div>
            </div>
            <div class="completion-pill">{bookProgress[chapter.id] || 0}% complete</div>
          </div>`;
          
code = code.replace(targetBlock, replaceBlock);

fs.writeFileSync(filePath, code);
console.log('Updated Dashboard.svelte');
