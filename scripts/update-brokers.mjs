// scripts/update-brokers.mjs
import fs from 'fs';

const LEADERBOARD_FILE = './src/content/docs/best-brokers-india.mdx';

const brokerData = [
  { name: 'Zerodha', lat: '8.0', rel: '7.0' },
  { name: 'Dhan', lat: '10.0', rel: '9.0' },
  { name: 'Angel One', lat: '6.0', rel: '6.0' },
  { name: 'Fyers', lat: '7.0', rel: '9.0' },
  { name: 'Upstox', lat: '9.0', rel: '6.0' },
  { name: 'Groww', lat: '7.0', rel: '6.0' },
  { name: 'Kotak Securities', lat: '9.0', rel: '5.0' },
  { name: 'ICICI Direct', lat: '5.0', rel: '6.0' },
  { name: 'Paytm Money', lat: '5.0', rel: '5.0' },
  { name: '5paisa', lat: '6.0', rel: '5.0' }
];

try {
  let content = fs.readFileSync(LEADERBOARD_FILE, 'utf8');
  let updatedCount = 0;

  console.log(`\nStarting Verified Broker Overwrite...\n`);

  for (const broker of brokerData) {
    const startIndex = content.indexOf(broker.name);
    if (startIndex === -1) {
      console.log(`[SKIP] Could not find section for ${broker.name}`);
      continue;
    }

    const chunkEnd = content.indexOf('---', startIndex);
    const safeEnd = chunkEnd !== -1 ? chunkEnd : startIndex + 800;
    let chunk = content.substring(startIndex, safeEnd);
    const initialChunk = chunk;

    // Targeting the specific Markdown Table rows
    chunk = chunk.replace(/\*\*UI Latency\*\*\s*\|\s*[0-9.]+\/10/i, `**Execution Speed** | ${broker.lat}/10`);
    chunk = chunk.replace(/\*\*Data Integrity\*\*\s*\|\s*[0-9.]+\/10/i, `**System Uptime** | ${broker.rel}/10`);

    if (chunk !== initialChunk) {
      content = content.substring(0, startIndex) + chunk + content.substring(safeEnd);
      console.log(`[UPDATED] ${broker.name} -> Speed: ${broker.lat}, Uptime: ${broker.rel}`);
      updatedCount++;
    }
  }

  fs.writeFileSync(LEADERBOARD_FILE, content, 'utf8');
  console.log(`\nDone! Successfully updated ${updatedCount} brokers.\n`);

} catch (error) {
  console.log(`\n[ERROR]: ${error.message}`);
}