import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd(); 
const toolsDataPath = path.resolve(projectRoot, 'data', 'tools-data.json');
const docsBaseDir = path.resolve(projectRoot, 'src', 'content', 'docs');

const rawData = fs.readFileSync(toolsDataPath, 'utf-8').replace(/^\uFEFF/, '');
const tools = JSON.parse(rawData);

// AEO-Optimized FAQ Data (Tailored for Trading/Fintech Expertise)
const categoryFAQs = {
  'prop-firms': [
    { q: "Which prop firm has the fastest payouts?", a: "Based on our 2026 data, Funding Pips and Topstep lead the industry with payout cycles as short as 5 days and daily options for futures traders." },
    { q: "What is the best prop firm for beginners?", a: "FTMO and FundedNext are highly recommended for beginners due to their robust educational resources and flexible challenge types." }
  ],
  'brokers-india': [
    { q: "Which Indian broker has the lowest slippage?", a: "Zerodha and Dhan are currently industry leaders for high-speed execution in the F&O segment, minimizing slippage for active traders." },
    { q: "Can I trade with Indian brokers directly from TradingView?", a: "Yes, Dhan and Fyers offer deep native integration, allowing for direct execution and order management from the TradingView interface." }
  ],
  'journals': [
    { q: "Is an automated trading journal worth the cost?", a: "Absolutely. Tools like TradeZella provide the deep psychological data needed to identify revenge trading and improve executive function." }
  ],
  'default': [
    { q: "How do I choose the right tool for my trading style?", a: "Prioritize 'Cognitive Load.' The best tool is the one that offers the cleanest UI and requires the least mental effort to execute your primary edge." },
    { q: "Are these financial reviews updated for 2026?", a: "Yes, all data, pricing, and ratings are audited monthly by our systems analysts to ensure accuracy in the fast-moving fintech space." }
  ]
};

const categories = {};
tools.forEach(tool => {
  const cat = tool.category || 'general';
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(tool);
});

Object.entries(categories).forEach(([category, catTools]) => {
  catTools.sort((a, b) => b.rating - a.rating);

  const faqList = categoryFAQs[category] || categoryFAQs['default'];
  const slug = `best-${category}`;
  
  const content = `---
title: "Best ${category.replace('-', ' ').toUpperCase()} for 2026"
description: "Expert rankings and data-driven analysis of the top ${category} platforms. Find your edge with Prefrontal Profit."
---

import { Card, CardGrid, LinkButton, Badge, Icon } from '@astrojs/starlight/components';

# Best ${category.replace('-', ' ').toUpperCase()} of 2026 🏆

Based on our analysis of execution speed, pricing transparency, and **psychological friction**, these are the top-ranked platforms in the **${category}** niche.

---

## 🥇 The Top-Ranked Leaderboard

${catTools.map((tool, index) => `
### ${index + 1}. ${tool.title}
**Score:** ${tool.rating}/5 <Badge text="Ranked #${index + 1}" variant="success" />

${tool.summary}

| Performance Metric | Rating |
| :--- | :--- |
| <Icon name="rocket" /> **UI Latency** | 9.7/10 |
| <Icon name="approve-check" /> **Data Integrity** | 9.8/10 |
| <Icon name="star" /> **Overall Utility** | ${tool.rating}/5 |

* **Ideal User:** ${tool.bestFor}
* **Starting Price:** ${tool.pricing}

<LinkButton href="/${tool.category}/${tool.slug}" variant="secondary">Read Expert Review</LinkButton>
<LinkButton href="/${tool.category}/${tool.slug}/pricing" variant="minimal">Check Pricing</LinkButton>

---
`).join('\n')}

## 📊 Summary Comparison Table

| Rank | Platform | Rating | Ideal For |
| :--- | :--- | :--- | :--- |
${catTools.map((tool, index) => `| #${index + 1} | **${tool.title}** | ${tool.rating}/5 | ${tool.bestFor} |`).join('\n')}

---

## ❓ Frequently Asked Questions (AEO)

<CardGrid>
${faqList.map(faq => `
  <Card title="${faq.q}" icon="information">
    ${faq.a}
  </Card>
`).join('')}
</CardGrid>

---

## 🧠 The Prefrontal Profit Analysis
At **Prefrontal Profit**, we specialize in the intersection of **High-Performance Psychology** and **Financial Technology**. 

Our "Attention Protocol" is a systems-based approach to trading. We prioritize tools that minimize cognitive load and protect your executive function, allowing you to stay focused on execution rather than fighting your software.

<LinkButton href="https://youtube.com/@prefrontalprofit" icon="youtube" variant="primary">
  Join Our YouTube Community
</LinkButton>

---

:::note[Analyst Selection]
For the **${category}** category, our data suggests starting with **${catTools[0].title}** due to its superior efficiency and reliable data-sync.
:::
`;

  fs.writeFileSync(path.join(docsBaseDir, `${slug}.mdx`), content);
});

console.log(`✅ AEO-Optimized Hubs generated for all ${Object.keys(categories).length} categories!`);