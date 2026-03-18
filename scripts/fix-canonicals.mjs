// scripts/fix-canonicals.mjs
// Run with: node scripts/fix-canonicals.mjs --dry-run

import fs from 'fs';
import path from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const COMPARISONS_DIR = './src/content/docs/comparisons';
// NOTE: Make sure this is your actual live domain!
const BASE_URL = 'https://www.prefrontalprofit.com/comparisons'; 

try {
  const files = fs.readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
  let fixed = 0;

  console.log(`\nStarting SEO Canonical Fix...`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (No files changed)' : 'LIVE UPDATE'}\n`);

  for (const file of files) {
    const slug = file.replace('.mdx', '');
    const parts = slug.split('-vs-');
    
    // If it's not a versus page, skip it
    if (parts.length !== 2) continue;

    const [a, b] = parts;
    const reverseSlug = `${b}-vs-${a}`;
    const canonicalSlug = [slug, reverseSlug].sort()[0]; // Alphabetical winner

    // If this IS the alphabetical winner, it doesn't need a canonical tag to itself
    if (slug === canonicalSlug) continue; 

    const filePath = path.join(COMPARISONS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if canonical is already set
    if (content.includes('rel: canonical')) {
      console.log(`[SKIP] ${file} — canonical already present`);
      continue;
    }

    const canonicalUrl = `${BASE_URL}/${canonicalSlug}/`;
    const canonicalBlock = `  - tag: link\n    attrs:\n      rel: canonical\n      href: ${canonicalUrl}`;

    let newContent;
    // Inject safely into Starlight's frontmatter
    if (content.includes('\nhead:\n')) {
      newContent = content.replace('\nhead:\n', `\nhead:\n${canonicalBlock}\n`);
    } else {
      newContent = content.replace(/^---\n([\s\S]*?)---/, (match, inner) => {
        return `---\n${inner}head:\n${canonicalBlock}\n---`;
      });
    }

    if (DRY_RUN) {
      console.log(`[DRY RUN] Would patch: ${file}\n          Points to -> ${canonicalUrl}`);
    } else {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`[PATCHED] ${file} -> ${canonicalUrl}`);
      fixed++;
    }
  }

  console.log(`\nDone. ${DRY_RUN ? 'Run without --dry-run to apply.' : `Fixed ${fixed} files.`}\n`);
} catch (error) {
  console.log(`\nError: Could not find the comparisons folder at ${COMPARISONS_DIR}`);
  console.log(`Please make sure the folder exists and is spelled correctly!\n`);
}