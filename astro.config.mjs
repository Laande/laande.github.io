import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://alynva.github.io/lande-template/',
  base: '/lande-template/',
  integrations: [icon()]
});