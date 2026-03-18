import fs from 'fs';
import path from 'path';

// Load our Source of Truth
const DATA = JSON.parse(fs.readFileSync('./data-moat.json', 'utf8'));
const BASE_PATH = './src/content/docs';

console.log("🚀 Starting Indestructible Master Sync...");

for (const [category, files] of Object.entries(DATA)) {
  const dirPath = path.join(BASE_PATH, category);

  for (const [fileName, scores] of Object.entries(files)) {
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) {
        console.log(`[MISSING FILE] ${filePath}`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // HIGHLY AGGRESSIVE REGEX
    // This finds ANY <Card> that contains the rocket icon and replaces the whole thing
    const rocketRegex = /<Card[^>]*icon="rocket"[^>]*>[\s\S]*?<\/Card>/i;
    const checkRegex = /<Card[^>]*icon="approve-check"[^>]*>[\s\S]*?<\/Card>/i;

    if (content.match(rocketRegex)) {
      content = content.replace(rocketRegex, 
        `<Card title="${scores.lat} / 10" icon="rocket">\n    **${scores.latLab}** Verified Performance Score.\n  </Card>`);
    }

    if (content.match(checkRegex)) {
      content = content.replace(checkRegex, 
        `<Card title="${scores.rel} / 10" icon="approve-check">\n    **${scores.relLab}** Verified Reliability Score.\n  </Card>`);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ [UPDATED] ${category}/${fileName}`);
    } else {
      console.log(`❌ [FAILED MATCH] ${category}/${fileName} - Check icon names in file.`);
    }
  }
}
console.log("\nSync Complete.");