import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd(); 
const toolsDataPath = path.resolve(projectRoot, 'data', 'tools-data.json');
const docsBaseDir = path.resolve(projectRoot, 'src', 'content', 'docs');

const rawData = fs.readFileSync(toolsDataPath, 'utf-8').replace(/^\uFEFF/, '');
const tools = JSON.parse(rawData);

tools.forEach(tool => {
  const category = (tool.category || 'general').trim().toLowerCase();
  const slug = tool.slug.trim().toLowerCase();
  const pricingDir = path.join(docsBaseDir, category, slug);
  
  if (!fs.existsSync(pricingDir)) fs.mkdirSync(pricingDir, { recursive: true });

  const content = `---
title: "${tool.title} Pricing & Discount Codes (2026)"
description: "How much does ${tool.title} cost? A complete breakdown of monthly vs annual plans and available coupons."
---

import { Badge, Card, LinkButton, Icon } from '@astrojs/starlight/components';

# ${tool.title} Pricing Guide <Badge text="Updated March 2026" variant="note" />

Is **${tool.title}** worth the investment? We break down the current cost structure, hidden fees, and how to get the best deal.

---

## Current Price Points

| Plan Type | Estimated Cost | Best For |
| :--- | :--- | :--- |
| **Standard Entry** | ${tool.pricing} | ${tool.bestFor} |
| **Professional/Annual** | Contact for Quote | Active Professionals |

---

### Is there a Free Trial?
For ${tool.title}, we recommend checking their official site for the latest "First-Look" promotions.

<Card title="Prefrontal Profit Tip" icon="warning">
  Don't over-subscribe. Start with the lowest tier of **${tool.title}** to ensure the UI fits your cognitive workflow before committing to an annual plan.
</Card>

## Value Analysis
**Expert Rating:** ${tool.rating}/5

Compared to alternatives like **${tool.alternatives.join(', ')}**, ${tool.title} is positioned as a **${tool.description}** solution.

---

<LinkButton href="#" variant="primary">Check Latest ${tool.title} Discounts</LinkButton>
<LinkButton href="/${category}/${slug}" variant="secondary">Back to Full Review</LinkButton>
`;

  fs.writeFileSync(path.join(pricingDir, 'pricing.mdx'), content);
});

// FIXED: Now it will show the true number of tools
console.log(`💰 Pricing pages generated for all ${tools.length} tools!`);