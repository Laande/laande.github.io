# 🌌 My Projects Portfolio

A simple portfolio built with **[Astro](https://astro.build/)** showcasing web development, design, and creative projects.  
This version uses **Content Collections with JSON files** as a data source, no CSS frameworks, just pure HTML + CSS.

---

## 🚀 Features

- Uses **Astro Content Collections** (`src/content/projects/*.json`)
- No dependencies like Tailwind, **pure CSS only**
- Automatically deploys to **GitHub Pages** via **GitHub Actions**
- Clean, responsive grid layout

---

## 📁 Structure

```

src/
├─ content/
│  └─ projects/       # JSON files describing each project
├─ layouts/
│  └─ BaseLayout.astro
└─ pages/
└─ index.astro     # Renders the project cards

```

---

## ⚙️ Setup

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
````

Then open [http://localhost:4321](http://localhost:4321).

---

## 🌍 Deployment

While this is a static site that can be deployed anywhere, this project includes a **GitHub Action** for automatic deployment to GitHub Pages.

First, update your `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://<your-username>.github.io',
  base: '/my-portfolio', // Remove if deploying to a custom domain
})
```

After pushing to your repository's `main` branch:

* The workflow at `.github/workflows/deploy.yml` will run
* The site will be available at `https://<your-username>.github.io/my-portfolio/`

For other deployment options:
- Custom domain: Remove the `base` setting
- Different platforms: Update `site` and `base` according to your hosting URL

---

## 🧱 Content Management

Each project is defined as a JSON file inside `src/content/projects/`, for example:

```json
{
  "title": "Weather Dashboard",
  "description": "Real-time forecasts, interactive maps, and weather alerts.",
  "buttons": [
    {
      "text": "Live Demo",
      "url": "https://example.com/weather",
      "icon": "cloud",
      "variant": "primary"
    },
    {
      "text": "GitHub",
      "url": "https://github.com/user/weather-dashboard",
      "icon": "github",
      "variant": "outline"
    }
  ]
}
```

The `buttons` array supports:
- `text`: Button label
- `url`: Target URL
- `icon`: Simple Icons name (e.g., "github", "react", "vuedotjs", [see more](https://icon-sets.iconify.design/simple-icons/), can use other sets, just need to run `npm i -D @iconify-json/<set name>`)
- `variant`: Style variant ("primary", "secondary", or "outline")

Just add or remove JSON files, Astro updates automatically.

---

## 🪐 License

MIT License, feel free to use and adapt.
