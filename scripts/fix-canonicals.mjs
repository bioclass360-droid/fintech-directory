// scripts/fix-canonicals.mjs

import fs from 'fs';
import path from 'path';

const COMPARISONS_DIR = './src/content/docs/comparisons';
const BASE_URL = 'https://www.prefrontalprofit.com/comparisons'; 

const files = fs.readdirSync(COMPARISONS_DIR).filter(f => f.endsWith('.mdx'));
let fixed = 0;

console.log(`\nStarting SEO Canonical Fix (Windows Edition)...\n`);

for (const file of files) {
  const slug = file.replace('.mdx', '');
  const parts = slug.split('-vs-');
  
  if (parts.length !== 2) continue;

  const [a, b] = parts;
  const reverseSlug = `${b}-vs-${a}`;
  const canonicalSlug = [slug, reverseSlug].sort()[0]; 

  if (slug === canonicalSlug) continue; 

  const filePath = path.join(COMPARISONS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Skip if canonical is already set
  if (content.includes('rel: canonical')) continue;

  const canonicalUrl = `${BASE_URL}/${canonicalSlug}/`;
  const canonicalBlock = `  - tag: link\n    attrs:\n      rel: canonical\n      href: ${canonicalUrl}`;

  let newContent;
  
  // The Fix: Using \r?\n to catch Windows invisible line breaks
  if (content.match(/\r?\nhead:\r?\n/)) {
    newContent = content.replace(/\r?\nhead:\r?\n/, `\nhead:\n${canonicalBlock}\n`);
  } else {
    newContent = content.replace(/^---\r?\n([\s\S]*?)\r?\n---/, (match, inner) => {
      return `---\n${inner}\nhead:\n${canonicalBlock}\n---`;
    });
  }

  // Double check that the file ACTUALLY changed before saving
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`[REAL PATCH] ${file}`);
    fixed++;
  } else {
    console.log(`[FAILED] ${file} - Could not find frontmatter format.`);
  }
}

console.log(`\nSuccessfully applied canonical tags to ${fixed} files.\n`);