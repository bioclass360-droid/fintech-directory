import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd();
const toolsDataPath = path.resolve(projectRoot, 'data', 'tools-data.json');
const docsBaseDir = path.resolve(projectRoot, 'src', 'content', 'docs', 'comparisons');

if (!fs.existsSync(docsBaseDir)) fs.mkdirSync(docsBaseDir, { recursive: true });

const rawData = fs.readFileSync(toolsDataPath, 'utf-8').replace(/^\uFEFF/, '');
const tools = JSON.parse(rawData);

console.log('⚔️  Generating "Versus" Comparison Pages...');

tools.forEach(tool1 => {
  if (!tool1.alternatives) return;

  tool1.alternatives.forEach(altSlug => {
    const tool2 = tools.find(t => t.slug === altSlug);

    if (tool2) {
      const slug = `${tool1.slug}-vs-${tool2.slug}`;
      const content = `---
title: "${tool1.title} vs ${tool2.title} Comparison"
description: "Which is better in 2026: ${tool1.title} or ${tool2.title}? Detailed breakdown inside."
---

import { Card, CardGrid, LinkButton, Badge } from '@astrojs/starlight/components';

# ${tool1.title} vs ${tool2.title} ⚔️

Deciding between **${tool1.title}** and **${tool2.title}** is critical for your trading edge. Here is the direct breakdown for 2026.

<CardGrid>
  <Card title="${tool1.title}" icon="star">
    **Rating:** ${tool1.rating}/5  
    **Best For:** ${tool1.bestFor}  
    [View Full Review](/${tool1.category}/${tool1.slug})
  </Card>
  <Card title="${tool2.title}" icon="approve-check">
    **Rating:** ${tool2.rating}/5  
    **Best For:** ${tool2.bestFor}  
    [View Full Review](/${tool2.category}/${tool2.slug})
  </Card>
</CardGrid>

---

## At a Glance Comparison

| Feature | ${tool1.title} | ${tool2.title} |
| :--- | :--- | :--- |
| **Pricing** | ${tool1.pricing} | ${tool2.pricing} |
| **Primary Use** | ${tool1.bestFor} | ${tool2.bestFor} |
| **Verdict** | <Badge text="Recommended" variant="success" /> | <Badge text="Alternative" variant="note" /> |

---

### Why Choose ${tool1.title}?
${tool1.summary}

### Why Choose ${tool2.title}?
${tool2.summary}

<LinkButton href="/comparisons" variant="secondary" icon="left-arrow">Back to All Battles</LinkButton>
`;

      fs.writeFileSync(path.join(docsBaseDir, `${slug}.mdx`), content);
      console.log(`✅ Battle Created: ${tool1.title} vs ${tool2.title}`);
    } else {
      console.warn(`⚠️  Skipping: ${altSlug} (Data not found in JSON)`);
    }
  });
});

console.log('\n✨ Comparison silo built! Visit /comparisons/ in your browser.');