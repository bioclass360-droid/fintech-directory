import fs from 'fs';
import path from 'path';

const DATA = JSON.parse(fs.readFileSync('./data-moat.json', 'utf8'));
const BASE_PATH = './src/content/docs';

console.log("🚀 Starting Universal Master Sync...");

// Helper to find the leaderboard file regardless of "indian-brokers" vs "brokers-india"
const findLeaderboard = (category) => {
  const possibleNames = [`best-${category}.mdx`, `best-indian-brokers.mdx`, `${category}.mdx` ];
  for (const name of possibleNames) {
    const fullPath = path.join(BASE_PATH, name);
    if (fs.existsSync(fullPath)) return fullPath;
  }
  return null;
};

for (const [category, files] of Object.entries(DATA)) {
  const dirPath = path.join(BASE_PATH, category);
  const leaderboardPath = findLeaderboard(category);

  // 1. Update Individual Review Pages
  for (const [fileName, scores] of Object.entries(files)) {
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    const rocketRegex = /<Card[^>]*icon="rocket"[^>]*>[\s\S]*?<\/Card>/i;
    const checkRegex = /<Card[^>]*icon="approve-check"[^>]*>[\s\S]*?<\/Card>/i;

    content = content.replace(rocketRegex, `<Card title="${scores.lat} / 10" icon="rocket">\n    **${scores.latLab}** Verified Performance Score.\n  </Card>`);
    content = content.replace(checkRegex, `<Card title="${scores.rel} / 10" icon="approve-check">\n    **${scores.relLab}** Verified Reliability Score.\n  </Card>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Individual: ${category}/${fileName}`);
  }

  // 2. Update the Master Leaderboard
  if (leaderboardPath) {
    let lbContent = fs.readFileSync(leaderboardPath, 'utf8');
    
    for (const [fileName, scores] of Object.entries(files)) {
      // Find section by Name and replace the Table rows inside it
      const sectionRegex = new RegExp(`### .*?${scores.name}[\\s\\S]*?---`, 'g');
      
      lbContent = lbContent.replace(sectionRegex, (match) => {
        let updated = match.replace(/\|.*Icon name="rocket".*\|.*\|/g, 
          `| <Icon name="rocket" /> **${scores.latLab}** | ${scores.lat}/10 |`);
        
        updated = updated.replace(/\|.*Icon name="approve-check".*\|.*\|/g, 
          `| <Icon name="approve-check" /> **${scores.relLab}** | ${scores.rel}/10 |`);
        
        return updated;
      });
    }

    fs.writeFileSync(leaderboardPath, lbContent, 'utf8');
    console.log(`🏆 Leaderboard Updated: ${path.basename(leaderboardPath)}`);
  } else {
    console.log(`❌ No leaderboard file found for category: ${category}`);
  }
}

console.log("\nSync Complete.");