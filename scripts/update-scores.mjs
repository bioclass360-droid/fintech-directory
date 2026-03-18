// scripts/update-scores.mjs
// Run with: node scripts/update-scores.mjs --dry-run

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const PROP_FIRMS_DIR = './src/content/docs/prop-firms';

// The "Prefrontal Profit" Data Moat
const firmData = {
  'ftmo.mdx': { latency: '9.5', reliability: '9.9' },
  'the-5ers.mdx': { latency: '9.0', reliability: '9.6' },
  'myfundedfutures.mdx': { latency: '9.6', reliability: '9.4' },
  'topstep.mdx': { latency: '9.7', reliability: '9.8' }, // Stays the same
  'e8-markets.mdx': { latency: '9.2', reliability: '9.3' },
  'funding-pips.mdx': { latency: '8.8', reliability: '9.1' },
  'fundednext.mdx': { latency: '8.5', reliability: '8.8' },
  'funderpro.mdx': { latency: '8.6', reliability: '8.7' },
  'blue-guardian.mdx': { latency: '8.4', reliability: '8.9' },
  'myfundedfx.mdx': { latency: '8.3', reliability: '9.0' },
  'funded-engineer.mdx': { latency: '8.0', reliability: '8.2' },
  'apex-trader-funding.mdx': { latency: '8.5', reliability: '8.9' },
  'maverick-trading.mdx': { latency: '9.0', reliability: '9.5' },
  'goat-funded.mdx': { latency: '8.0', reliability: '8.3' },
  'instant-funding.mdx': { latency: '8.2', reliability: '8.5' }
};

const files = fs.readdirSync(PROP_FIRMS_DIR).filter(f => f.endsWith('.mdx'));
let updatedCount = 0;

console.log(`\nStarting Prop Firm Data Injection...`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (No files will be changed)' : 'LIVE UPDATE'}\n`);

for (const file of files) {
  if (firmData[file]) {
    const filePath = path.join(PROP_FIRMS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simple, safe string replacement targeting the exact placeholder numbers
    // Note: If a file already has the new data, it won't find the old '9.7'/'9.8' to replace.
    const { latency, reliability } = firmData[file];
    
    // We only replace the FIRST instance of 9.7 and 9.8 to protect other potential text
    let newContent = content.replace('9.7', latency).replace('9.8', reliability);

    if (content !== newContent) {
      if (DRY_RUN) {
        console.log(`[DRY RUN] Would update ${file}: Latency -> ${latency}, Reliability -> ${reliability}`);
      } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`[UPDATED] ${file} injected with new data.`);
        updatedCount++;
      }
    } else {
      console.log(`[SKIP] ${file} (Placeholders 9.7/9.8 not found or already updated)`);
    }
  }
}

console.log(`\nDone. ${DRY_RUN ? 'Run without --dry-run to apply changes.' : `Successfully updated ${updatedCount} files.`}\n`);