import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://laande.github.io/',
  base: '/',
  integrations: [icon()]
});