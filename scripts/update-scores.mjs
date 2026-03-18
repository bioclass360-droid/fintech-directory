import fs from 'fs';
import path from 'path';

const DATA = JSON.parse(fs.readFileSync('./data-moat.json', 'utf8'));
const BASE_PATH = './src/content/docs';

console.log("🚀 Starting Absolute Overwrite Sync...");

for (const [category, files] of Object.entries(DATA)) {
    const leaderboardPath = path.join(BASE_PATH, `best-${category}.mdx`);
    if (!fs.existsSync(leaderboardPath)) {
        console.log(`❌ Skipped: ${leaderboardPath} not found.`);
        continue;
    }

    let content = fs.readFileSync(leaderboardPath, 'utf8');

    for (const [fileName, scores] of Object.entries(files)) {
        // This regex finds the section starting with ### Name and captures everything 
        // until the next ### or the end of the file.
        const sectionRegex = new RegExp(`### .*?${scores.name}[\\s\\S]*?(?=###|$)`, 'i');
        
        const newTableBlock = `### ${scores.name}

| Metric | Score |
| :--- | :--- |
| <Icon name="rocket" /> **${scores.latLab}** | ${scores.lat}/10 |
| <Icon name="approve-check" /> **${scores.relLab}** | ${scores.rel}/10 |

<LinkButton href="/${category}/${fileName.replace('.mdx', '')}" variant="secondary">Read Technical Audit</LinkButton>

---
`;

        if (content.match(sectionRegex)) {
            content = content.replace(sectionRegex, newTableBlock);
            console.log(`✅ Forced Overwrite: ${scores.name} in ${category}`);
        } else {
            console.log(`⚠️ Could not find section for: ${scores.name}`);
        }
    }

    fs.writeFileSync(leaderboardPath, content, 'utf8');
    console.log(`🏆 File Saved: ${leaderboardPath}`);
}