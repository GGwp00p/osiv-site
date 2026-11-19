// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Old .html URLs keep working: GitHub Pages has no server-side redirects,
// so Astro writes a small static redirect page for each of them.
const redirects = {
  '/team.html': '/team/',
  '/research.html': '/research/',
  '/research-technology.html': '/research/technology/',
  '/research-society.html': '/research/society/',
  '/projects.html': '/projects/',
  '/publications.html': '/publications/',
  '/news.html': '/news/',
  '/join.html': '/join/',
  '/contact.html': '/contact/',
  '/project-an-giang-mango.html': '/projects/an-giang-mango/',
  '/project-yellow-apricot.html': '/projects/yellow-apricot/',
  '/project-mui-ne-heritage.html': '/projects/mui-ne-heritage/',
  '/project-blao-rainwater.html': '/projects/blao-rainwater/',
  '/project-ip-map.html': '/projects/ip-map/',
  '/project-dong-thap-mango.html': '/projects/dong-thap-mango/',
  '/project-dong-thap-pineapple.html': '/projects/dong-thap-pineapple/',
};

export default defineConfig({
  site: 'https://osiv.net',
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects,
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
