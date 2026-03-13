import fs from 'fs';
import path from 'path';

const projectRoot = process.cwd(); 
const glossaryPath = path.resolve(projectRoot, 'src', 'content', 'docs', 'glossary.mdx');

const glossaryTerms = [
  {
    term: "Attention Protocol",
    definition: "The proprietary Prefrontal Profit methodology for identifying and minimizing cognitive friction during high-stakes financial execution. It prioritizes systems that reduce 'decision fatigue'."
  },
  {
    term: "UI Latency",
    definition: "The measured delay between a user's physical input and the visual update of the platform interface. In professional trading, sub-100ms latency is the benchmark for 'System Integrity'."
  },
  {
    term: "Prefrontal Profit",
    definition: "A philosophy of wealth building that leverages the executive functions of the brain (the prefrontal cortex) to override impulsive 'reptilian' trading behaviors."
  },
  {
    term: "Institutional Sync",
    definition: "The speed and accuracy at which a retail trading platform synchronizes its order book and price feed with top-tier institutional liquidity providers."
  },
  {
    term: "Cognitive Friction",
    definition: "Unnecessary complexity in a software's UI that forces the brain to waste energy on navigation rather than execution. High-performance systems minimize this at all costs."
  },
  {
    term: "Data Integrity",
    definition: "The verification that a platform's historical and real-time data is free from manipulation, 'ghost candles,' or missing timestamps."
  },
  {
    term: "Execution Slippage",
    definition: "The difference between the expected price of a trade and the price at which the trade is actually executed. Our audits penalize systems with inconsistent slippage."
  },
  {
    term: "Systems Architecture",
    definition: "The holistic structural design of a trader's stack, including their hardware, internet backbone, software interface, and psychological state."
  }
];

let content = `---
title: "Systems Glossary"
description: "The authoritative dictionary of fintech performance metrics and the Prefrontal Profit philosophy."
---

import { Card, CardGrid } from '@astrojs/starlight/components';

# Systems Glossary 📖

Welcome to the **Prefrontal Profit** dictionary. To understand our audits and stress tests, you must understand the language of high-performance systems.

---

<CardGrid>
`;

glossaryTerms.forEach(item => {
  content += `  <Card title="${item.term}">
    ${item.definition}
  </Card>\n`;
});

content += `</CardGrid>

---

:::note[Contribute to the Glossary]
Is there a technical term you encounter in our reviews that isn't defined here? Use our [Inquiry Form](/sitemap) to request a definition update.
:::
`;

fs.writeFileSync(glossaryPath, content);
console.log('✅ Glossary page generated with 2026 Systems Terminology!');