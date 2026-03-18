import fs from 'fs';
import path from 'path';

const DATA = JSON.parse(fs.readFileSync('./data-moat.json', 'utf8'));
const BASE_PATH = './src/content/docs';

console.log("🚀 Starting Final Master Sync...");

for (const [category, files] of Object.entries(DATA)) {
  const dirPath = path.join(BASE_PATH, category);
  
  // FIX: Hardcoded mapping to ensure we hit the right leaderboard file
  let leaderboardName = `best-${category}.mdx`;
  const leaderboardPath = path.join(BASE_PATH, leaderboardName);

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
    console.log(`✅ Updated Review: ${category}/${fileName}`);
  }

  // 2. Update the Master Leaderboard (The List Page)
  if (fs.existsSync(leaderboardPath)) {
    let lbContent = fs.readFileSync(leaderboardPath, 'utf8');
    
    for (const [fileName, scores] of Object.entries(files)) {
      // Find the specific section for this firm (from ### Name until the next ---)
      const sectionRegex = new RegExp(`### .*?${scores.name}[\\s\\S]*?---`, 'g');
      
      lbContent = lbContent.replace(sectionRegex, (match) => {
        // Find the Latency row (rocket icon) and replace the whole line
        let updated = match.replace(/\|.*Icon name="rocket".*\|.*\|/g, 
          `| <Icon name="rocket" /> **${scores.latLab}** | ${scores.lat}/10 |`);
        
        // Find the Reliability row (check icon) and replace the whole line
        updated = updated.replace(/\|.*Icon name="approve-check".*\|.*\|/g, 
          `| <Icon name="approve-check" /> **${scores.relLab}** | ${scores.rel}/10 |`);
        
        return updated;
      });
    }

    fs.writeFileSync(leaderboardPath, lbContent, 'utf8');
    console.log(`🏆 Updated Leaderboard: ${leaderboardName}`);
  } else {
    console.log(`❌ Leaderboard Missing: ${leaderboardPath}`);
  }
}

console.log("\nSync Complete.");