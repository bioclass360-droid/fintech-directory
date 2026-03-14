import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
    site: 'https://prefrontalprofit.com', 
    integrations: [
        starlight({
            title: 'Prefrontal Profit | Systems Directory',
            logo: {
                src: './src/assets/logo.png',
                replacesTitle: true,
            },
            customCss: ['./src/styles/custom.css'],
            social: [
                { label: 'YouTube', href: 'https://youtube.com/@prefrontalprofit', icon: 'youtube' },
                { label: 'GitHub', href: 'https://github.com/satish/fintech-directory', icon: 'github' }
            ],
            sidebar: [
                {
                    label: '🚀 Start Here',
                    items: [
                        { label: 'Full Site Directory', link: '/sitemap' },
                        { label: 'Systems Glossary', link: '/glossary' }, 
                    ],
                },
                {
                    label: '🎯 Best-Of Rankings (2026)',
                    items: [
                        { label: 'Best Prop Firms', link: '/best-prop-firms' },
                        { label: 'Best Indian Brokers', link: '/best-brokers-india' },
                        { label: 'Best Trading Journals', link: '/best-journals' },
                        { label: 'Best Crypto Exchanges', link: '/best-exchanges' },
                        { label: 'Best Algo Platforms', link: '/best-algos' },
                    ],
                },
                {
                    label: '⚔️ Versus Battles',
                    autogenerate: { directory: 'comparisons' },
                },
                {
                    label: '📑 Technical Reviews',
                    items: [
                        { label: 'Prop Firms', autogenerate: { directory: 'prop-firms' } },
                        { label: 'Indian Brokers', autogenerate: { directory: 'brokers-india' } },
                        { label: 'Trading Journals', autogenerate: { directory: 'journals' } },
                        { label: 'Crypto Exchanges', autogenerate: { directory: 'exchanges' } },
                        { label: 'Algo Trading', autogenerate: { directory: 'algos' } },
                        { label: 'Portfolio Trackers', autogenerate: { directory: 'portfolio-trackers' } },
                        { label: 'Research Tools', autogenerate: { directory: 'research' } },
                    ],
                },
                {
                    label: 'Support & Legal',
                    items: [
                        { label: 'Contact Us', link: '/contact' },
                        { label: 'Privacy Policy', link: '/privacy' },
                        { label: 'Terms of Service', link: '/terms' },
                    ],
                },
            ],
        }),
        mdx(),
        sitemap(),
    ],
});