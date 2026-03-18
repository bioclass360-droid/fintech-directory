// scripts/update-leaderboard.mjs

import fs from 'fs';

const LEADERBOARD_FILE = './src/content/docs/best-prop-firms.mdx';

const firmData = [
  { name: 'FTMO', lat: '9.5', rel: '9.9' },
  { name: 'The 5ers', lat: '9.0', rel: '9.6' },
  { name: 'MyFundedFutures', lat: '9.6', rel: '9.4' },
  { name: 'Topstep', lat: '9.7', rel: '9.8' },
  { name: 'E8 Markets', lat: '9.2', rel: '9.3' },
  { name: 'FundedNext', lat: '8.5', rel: '8.8' },
  { name: 'Funding Pips', lat: '8.8', rel: '9.1' },
  { name: 'FunderPro', lat: '8.6', rel: '8.7' },
  { name: 'Blue Guardian', lat: '8.4', rel: '8.9' },
  { name: 'MyFundedFX', lat: '8.3', rel: '9.0' },
  { name: 'Funded Engineer', lat: '8.0', rel: '8.2' },
  { name: 'Apex Trader Funding', lat: '8.5', rel: '8.9' },
  { name: 'Maverick Trading', lat: '9.0', rel: '9.5' },
  { name: 'Goat Funded', lat: '8.0', rel: '8.3' },
  { name: 'Instant Funding', lat: '8.2', rel: '8.5' }
];

try {
  let content = fs.readFileSync(LEADERBOARD_FILE, 'utf8');
  let updatedCount = 0;

  console.log(`\nStarting Hyper-Resilient Leaderboard Overwrite...\n`);

  for (const firm of firmData) {
    // 1. Find where this firm's section starts
    const firmIndex = content.indexOf(`###`);
    const startIndex = content.indexOf(firm.name, firmIndex);

    if (startIndex === -1) {
      console.log(`[SKIP] Could not find section for ${firm.name}`);
      continue;
    }

    // 2. Grab a generous chunk of text right after the firm's name to ensure we catch the table
    const chunkStart = startIndex;
    const chunkEnd = startIndex + 800;
    let chunk = content.substring(chunkStart, chunkEnd);
    const initialChunk = chunk;

    // 3. Absolute minimum-viable regex. Ignores pipes, icons, and spaces.
    chunk = chunk.replace(/\*\*UI Latency\*\*\s*\|\s*[0-9.]+\/10/i, `**UI Latency** | ${firm.lat}/10`);
    chunk = chunk.replace(/\*\*Data Integrity\*\*\s*\|\s*[0-9.]+\/10/i, `**Payout Reliability** | ${firm.rel}/10`);

    // 4. Stitch the updated chunk back into the file
    if (chunk !== initialChunk) {
      content = content.substring(0, chunkStart) + chunk + content.substring(chunkEnd);
      console.log(`[UPDATED] ${firm.name} -> Latency: ${firm.lat}, Reliability: ${firm.rel}`);
      updatedCount++;
    } else {
      console.log(`[NO CHANGE] ${firm.name} (Check if already updated)`);
    }
  }

  // 5. Save the file
  fs.writeFileSync(LEADERBOARD_FILE, content, 'utf8');
  console.log(`\nDone! Successfully updated ${updatedCount} firms on the master leaderboard.\n`);

} catch (error) {
  console.log(`\n[ERROR] Something went wrong: ${error.message}\n`);
}