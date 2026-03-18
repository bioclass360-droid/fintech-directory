// scripts/update-scores.mjs

import fs from 'fs';
import path from 'path';

const PROP_FIRMS_DIR = './src/content/docs/prop-firms';

// The full Data Moat: Scores + Custom Descriptions
const firmData = {
  'ftmo.mdx': { lat: '9.5', latTxt: 'Servers hold up flawlessly during CPI/NFP news spikes.', rel: '9.9', relTxt: 'The absolute gold standard. Flawless payout record.' },
  'the-5ers.mdx': { lat: '9.0', latTxt: 'Excellent execution on MT5, low latency.', rel: '9.6', relTxt: 'Highly transparent management and reliable payouts.' },
  'myfundedfutures.mdx': { lat: '9.6', latTxt: 'Strong Rithmic integration. Great for DOM scalpers.', rel: '9.4', relTxt: 'Consistent and fast payout processing.' },
  'topstep.mdx': { lat: '9.7', latTxt: 'Ultra-low latency with deep futures liquidity.', rel: '9.8', relTxt: 'A+ payout reliability, though rules are strict.' },
  'e8-markets.mdx': { lat: '9.2', latTxt: 'Custom dashboard reduces visual clutter. Solid execution.', rel: '9.3', relTxt: 'Dependable payouts with minimal friction.' },
  'funding-pips.mdx': { lat: '8.8', latTxt: 'Occasional slippage during high-impact news events.', rel: '9.1', relTxt: 'Good payout history despite minor tech hiccups.' },
  'fundednext.mdx': { lat: '8.5', latTxt: 'History of server lag during high-volume sessions.', rel: '8.8', relTxt: 'Payouts are honored, but processing can take time.' },
  'funderpro.mdx': { lat: '8.6', latTxt: 'TradeLocker integration causes occasional execution delays.', rel: '8.7', relTxt: 'Standard payout reliability for mid-tier firms.' },
  'blue-guardian.mdx': { lat: '8.4', latTxt: 'Standard white-label latency. Stable but average.', rel: '8.9', relTxt: 'Solid mid-tier firm with reliable payouts.' },
  'myfundedfx.mdx': { lat: '8.3', latTxt: 'Frequent broker migrations cause temporary platform lag.', rel: '9.0', relTxt: 'Strong track record of paying out successful traders.' },
  'funded-engineer.mdx': { lat: '8.0', latTxt: 'Recovering from past tech migrations. Average speed.', rel: '8.2', relTxt: 'Payouts are stabilizing after infrastructure changes.' },
  'apex-trader-funding.mdx': { lat: '8.5', latTxt: 'Massive user base causes occasional Rithmic server crashes.', rel: '8.9', relTxt: 'Consistent payouts, but trailing drawdown rules are tough.' },
  'maverick-trading.mdx': { lat: '9.0', latTxt: 'Institutional-grade tech, specifically for equities/options.', rel: '9.5', relTxt: 'Extremely professional and reliable capital backing.' },
  'goat-funded.mdx': { lat: '8.0', latTxt: 'Newer infrastructure. Not yet fully battle-tested.', rel: '8.3', relTxt: 'Honoring payouts, but establishing long-term trust.' },
  'instant-funding.mdx': { lat: '8.2', latTxt: 'Wider spreads create artificial friction for tight stops.', rel: '8.5', relTxt: 'Convenient model with decent payout speed.' }
};

const files = fs.readdirSync(PROP_FIRMS_DIR).filter(f => f.endsWith('.mdx'));
let fixed = 0;

console.log(`\nStarting Full Card Overwrite...`);

for (const file of files) {
  if (!firmData[file]) continue;
  
  const filePath = path.join(PROP_FIRMS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = firmData[file];

  // Safely target the exact cards by their unique icons, ignoring the text inside them
  const regex1 = /<Card title="[^"]+" icon="rocket">[\s\S]*?<\/Card>/;
  const regex2 = /<Card title="[^"]+" icon="approve-check">[\s\S]*?<\/Card>/;

  let newContent = content;
  
  if (newContent.match(regex1) && newContent.match(regex2)) {
    newContent = newContent.replace(regex1, `<Card title="${data.lat} / 10" icon="rocket">\n    **UI Latency** ${data.latTxt}\n  </Card>`);
    newContent = newContent.replace(regex2, `<Card title="${data.rel} / 10" icon="approve-check">\n    **Payout Reliability** ${data.relTxt}\n  </Card>`);
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`[OVERWRITTEN] ${file}`);
      fixed++;
    }
  } else {
     console.log(`[SKIP] ${file} - Could not find card structure.`);
  }
}

console.log(`\nDone! Custom Data Moat injected into ${fixed} files.\n`);