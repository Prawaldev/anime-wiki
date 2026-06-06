# 📚 Anime Wiki

A modern, Wikipedia-style anime character encyclopedia built with React, Vite, and TypeScript.  
Search and explore anime characters with a dark, aesthetic UI inspired by Wikipedia but redesigned for anime fans.

---

## ✨ Features

- 🔎 Fast character search
- 📄 Wikipedia-style layout (infobox + article structure)
- 🌙 Dark mode anime aesthetic
- ⚡ Blazing fast Vite + React frontend
- 📱 Responsive design (mobile + desktop)
- 🧠 Dynamic data fetched from Jikan API (MyAnimeList)
- 🎨 Clean typography using "Ubuntu Sans Mono"

---

## 🖼️ Preview

> Add a screenshot here later  
Example:

<img src="site-preview.png">


---

## 🚀 Live Demo

👉 https://prawaldev.github.io/anime-wiki/

---

## 🛠️ Tech Stack

- React
- Vite
- TypeScript
- React Router
- CSS Modules
- Tailwind CSS (utility styling)
- Axios
- Jikan API (MyAnimeList data)

---

## 📦 Installation & Setup

Clone the repo:

```bash
git clone https://github.com/Prawaldev/anime-wiki.git
cd anime-wiki

Install dependencies:

npm install

Run development server:

npm run dev

Build for production:

npm run build

Preview build:

npm run preview

🚀 Deployment

This project is deployed using **GitHub Actions + GitHub Pages**.

### ⚙️ How it works

- Push changes to `main`
- GitHub Actions automatically installs dependencies
- Builds the project using Vite (`npm run build`)
- Deploys the `dist/` folder to GitHub Pages

### 🔁 Deployment Flow


main branch → GitHub Actions → build → GitHub Pages → live site


---

### 🌐 Live Site

👉 https://prawaldev.github.io/anime-wiki/

---

### 🛠️ GitHub Actions Workflow

The workflow file is located at:


.github/workflows/deploy.yml


It automatically handles:

- Node setup
- Dependency installation
- Build process
- Deployment to GitHub Pages

---

### ❌ No manual deployment needed

You do NOT need to run:

```bash
npm run deploy

or use gh-pages anymore.

---

This project uses the Jikan API:

https://jikan.moe/

Used for:

Character details
Anime metadata
Images
Stats
🎯 Future Improvements
🔍 Advanced filtering (by anime, popularity, etc.)
⭐ Favorites system
🧾 More detailed character pages
🎬 Anime pages (not just characters)
🌐 Multi-language support
🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

👨‍💻 Author

Built by Prawal Khadka