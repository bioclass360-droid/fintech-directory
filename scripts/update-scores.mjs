import fs from 'fs';
import path from 'path';

// 1. Load your Source of Truth
const DATA = JSON.parse(fs.readFileSync('./data-moat.json', 'utf8'));
const BASE_PATH = './src/content/docs';

console.log("🚀 Starting Final Master Sync...");

for (const [category, files] of Object.entries(DATA)) {
  const dirPath = path.join(BASE_PATH, category);
  
  // Target the specific leaderboard files from your config
  const leaderboardPath = path.join(BASE_PATH, `best-${category}.mdx`);

  // --- PART A: Update Individual Pages ---
  for (const [fileName, scores] of Object.entries(files)) {
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Rocket Card
    content = content.replace(/<Card[^>]*icon="rocket"[^>]*>[\s\S]*?<\/Card>/i, 
      `<Card title="${scores.lat} / 10" icon="rocket">\n    **${scores.latLab}** Verified Performance Score.\n  </Card>`);
    
    // Replace Check Card
    content = content.replace(/<Card[^>]*icon="approve-check"[^>]*>[\s\S]*?<\/Card>/i, 
      `<Card title="${scores.rel} / 10" icon="approve-check">\n    **${scores.relLab}** Verified Reliability Score.\n  </Card>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Review Page: ${category}/${fileName}`);
  }

  // --- PART B: Update Master Leaderboard ---
  if (fs.existsSync(leaderboardPath)) {
    let lbContent = fs.readFileSync(leaderboardPath, 'utf8');
    
    for (const [fileName, scores] of Object.entries(files)) {
      // Find the specific section for this firm (from ### Name until the next divider)
      const sectionRegex = new RegExp(`### .*?${scores.name}[\\s\\S]*?(?=---|$|###)`, 'g');
      
      lbContent = lbContent.replace(sectionRegex, (match) => {
        // Replace Latency row based on Icon
        let updated = match.replace(/\|.*Icon name="rocket".*\|.*\|/g, 
          `| <Icon name="rocket" /> **${scores.latLab}** | ${scores.lat}/10 |`);
        
        // Replace Reliability row based on Icon
        updated = updated.replace(/\|.*Icon name="approve-check".*\|.*\|/g, 
          `| <Icon name="approve-check" /> **${scores.relLab}** | ${scores.rel}/10 |`);
        
        return updated;
      });
    }

    fs.writeFileSync(leaderboardPath, lbContent, 'utf8');
    console.log(`🏆 Leaderboard: best-${category}.mdx`);
  } else {
    console.log(`❌ Skipped Leaderboard (Not Found): best-${category}.mdx`);
  }
}

console.log("\nDone!");