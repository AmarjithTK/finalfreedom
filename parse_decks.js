const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'design/easypeasy_cards');
let allCards = [];

try {
    const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.json'));
    // Sort files to ensure chronological order 
    files.sort();

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        try {
            const parsed = JSON.parse(fileContent);
            if (parsed.cards && Array.isArray(parsed.cards)) {
                allCards = allCards.concat(parsed.cards);
            }
        } catch (e) {
            console.error('Error parsing JSON from', file, e);
        }
    });

    const finalOutput = {
        deckTitle: "EasyPeasy Complete Master Deck",
        description: "The complete collection of deep-dive flashcards extracted from the EasyPeasy Method.",
        totalCards: allCards.length,
        cards: allCards
    };

    fs.writeFileSync(path.join(__dirname, 'design/easypeasy_cards_final.json'), JSON.stringify(finalOutput, null, 2));
    console.log(`Successfully merged ${files.length} chapters into design/easypeasy_cards_final.json! Total cards: ${allCards.length}`);
} catch (err) {
    console.error('Error processing directory:', err);
}
