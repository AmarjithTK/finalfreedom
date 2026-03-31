import fs from 'fs';
import path from 'path';

const inputDir = path.join(process.cwd(), '..', 'design', 'easypeasy_cards');
const outputFile = path.join(process.cwd(), 'src', 'lib', 'data', 'easypeasy.ts');

const chapterMap = {
  1: "The Core Philosophy",
  2: "Understanding the Brain",
  3: "The Illusion of Needs",
  4: "Reframing Failure",
  5: "Daily Routines",
  6: "Building Momentum",
  7: "Navigating Triggers",
  8: "Social Situations",
  9: "Mindfulness and Presence",
  10: "Identity Shift",
  11: "Breaking the Cycle",
  12: "The Fear Trap",
  13: "Urge Surfing",
  14: "Emotional Agility",
  15: "Long-term Maintenance",
  16: "Self-Compassion",
  17: "Rewiring Beliefs",
  18: "Cultivating Joy",
  19: "Advanced Mindfulness",
  20: "Relapse Prevention",
  21: "Finding Purpose",
  22: "Building Community",
  23: "Healthy Boundaries",
  24: "Overcoming Shame",
  25: "Sustaining Motivation",
  26: "Living Authentically",
  27: "Embracing Vulnerability",
  28: "Nurturing Relationships",
  29: "Lifelong Growth",
  30: "Sharing Your Journey",
  31: "The Power of Patience",
  32: "Overcoming Plateaus",
  33: "Final Freedom",
};

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
  let chapterNum = data.chapter || bookId;
  let title = chapterMap[chapterNum] || data.deckTitle || `Chapter ${chapterNum}`;

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
