import fs from 'fs';
import path from 'path';

const inputDir = path.join(process.cwd(), 'design', 'easypeasy_cards');
const outputFile = path.join(process.cwd(), 'freedom-svelte', 'src', 'lib', 'data', 'easypeasy.ts');

const files = fs.readdirSync(inputDir).filter(f => f.startsWith('chapter_') && f.endsWith('.json'));

files.sort((a, b) => {
  const matchA = a.match(/\d+/);
  const matchB = b.match(/\d+/);
  const numA = matchA ? parseInt(matchA[0], 10) : 0;
  const numB = matchB ? parseInt(matchB[0], 10) : 0;
  return numA - numB;
});

const allChapters = [];
let bookId = 1;

for (const file of files) {
  const filePath = path.join(inputDir, file);
  const rawData = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(rawData);
  } catch (e) {
    console.error(`Error parsing ${file}:`, e);
    continue;
  }

  let cards = data.cards || (Array.isArray(data) ? data : []);
  let title = data.deckTitle || `Chapter ${data.chapter || bookId}`;
  let chapterNum = data.chapter || bookId;

  allChapters.push({
    id: bookId,
    title: title,
    chapter: chapterNum,
    cards: cards.map(c => ({
      id: c.id,
      front: c.front,
      back: c.back,
      key_concept: c.key_concept || "",
      tags: c.tags || []
    }))
  });

  bookId++;
}

const tsContent = `// Auto-generated file from easypeasy_cards JSONs
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  key_concept?: string;
  tags?: string[];
}

export interface BookChapter {
  id: number;
  title: string;
  chapter: number;
  cards: Flashcard[];
}

export const easypeasyBook: BookChapter[] = ` + JSON.stringify(allChapters, null, 2) + `;`;

fs.writeFileSync(outputFile, tsContent, 'utf8');
console.log('Successfully compiled chapters into ' + outputFile);
