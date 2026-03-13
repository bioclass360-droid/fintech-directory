import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd(); 
const toolsDataPath = path.resolve(projectRoot, 'data', 'tools-data.json');
const sitemapPath = path.resolve(projectRoot, 'src', 'content', 'docs', 'sitemap.mdx');

const rawData = fs.readFileSync(toolsDataPath, 'utf-8').replace(/^\uFEFF/, '');
const tools = JSON.parse(rawData);

const categories = {};
tools.forEach(tool => {
  const cat = tool.category || 'general';
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(tool);
});

let content = `---
title: "Site Directory & Sitemap"
description: "A complete searchable index of 97+ fintech reviews on Prefrontal Profit."
template: splash
---

import { Card, CardGrid, Badge } from '@astrojs/starlight/components';

# Full Site Directory 🗺️

Use **Ctrl + F** to find any tool instantly, or browse by category below.

---

`;

// We use a simpler List structure. MDX handles 100+ list items much better than 100+ Cards.
Object.entries(categories).forEach(([category, catTools]) => {
  const catName = category.replace('-', ' ').toUpperCase();
  content += `## 📂 ${catName}\n\n`;
  
  catTools.forEach(tool => {
    content += `* **${tool.title}** (${tool.rating}/5) — [Review](/${tool.category}/${tool.slug}) | [Pricing](/${tool.category}/${tool.slug}/pricing)\n`;
  });

  content += `\n---\n\n`;
});

content += `
:::tip[Search Tip]
Since this directory is extensive, we recommend using the **Search Bar** in the top navigation or pressing **Cmd/Ctrl + F** to highlight a specific platform.
:::

---

## ⚔️ Comparison Hub
Looking for head-to-head data? Visit our [Versus Comparison Silo](/comparisons) to see over 200+ detailed battles.
`;

fs.writeFileSync(sitemapPath, content);
console.log(`✅ Stable Sitemap generated with ${tools.length} tools!`);