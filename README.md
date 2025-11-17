# 🧠 MindDump

**Your Personal Memory Vault**

A distraction-free, minimalist writing space designed for capturing life's moments, thoughts, conversations, and ideas without structure or judgment. Just write, save, and remember.

![MindDump Banner](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css) ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📖 About

**MindDump** is a pure writing application that serves as your personal memory vault. It's designed for capturing anything and everything from your daily life—people you meet, conversations, random events, ideas, thoughts, and moments—without the constraints of traditional note-taking apps.

### Philosophy

- **No structure** — No categories, folders, or tags
- **No prompts** — No suggestions or guidance  
- **No analysis** — No emotional tracking or productivity metrics
- **No distractions** — Just a clean, blank space
- **Pure preservation** — Your words, exactly as written

---

## ✨ Features

### 🖊️ **Distraction-Free Writing**
- Clean, minimal textarea with zero clutter
- Beautiful serif typography (Crimson Pro) for a notebook-like experience
- Auto-saves your draft every 500ms to prevent losing work
- Write freely without worrying about saving

### ⏱️ **Automatic Timestamping**
- Every entry is automatically saved with date and time
- Smart date formatting:
  - "Today at 2:30 PM"
  - "Yesterday at 9:15 AM"
  - "Jan 15, 2025 at 3:45 PM"

### 📚 **Simple Entry History**
- Chronological list of all past entries
- Click any entry to view full content
- Delete entries you no longer need
- Entry count displayed in navigation

### 🎨 **Elegant Design**
- Warm, cream/beige color palette for a calming experience
- Sophisticated typography mixing Crimson Pro (serif) and Inter (sans-serif)
- Full dark mode support
- Smooth fade transitions
- Fully responsive (mobile, tablet, desktop)

### 🔒 **Privacy First**
- All data stored locally in your browser (localStorage)
- No backend, no servers, no cloud sync
- Your thoughts stay on your device
- Works completely offline

---

## 📸 Screenshots

> **Note:** Add screenshots of your MindDump interface here before publishing to GitHub.

**Writing Mode:**
```
[Screenshot placeholder: Clean writing interface with textarea]
```

**Entries View:**
```
[Screenshot placeholder: Chronological list of saved entries]
```

**Dark Mode:**
```
[Screenshot placeholder: Dark mode interface]
```

---

## 🌐 Live Demo

> **Note:** Add your live demo URL here if you deploy the project.

```
https://your-minddump-demo.vercel.app
```

Or run locally (see instructions below) ↓

---

## 🗂️ Project Structure

```
minddump/
├── public/               # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css   # Global styles with Tailwind CSS v4
│   │   ├── layout.tsx    # Root layout with metadata
│   │   ├── page.tsx      # Home page (renders MindDump component)
│   │   └── favicon.ico   # App icon
│   ├── components/
│   │   ├── MindDump.tsx  # Main application component
│   │   ├── ui/           # shadcn/ui components (Button, etc.)
│   │   └── ErrorReporter.tsx
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── visual-edits/     # Visual editing utilities
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🛠️ Technologies Used

- **[Next.js 15](https://nextjs.org/)** — React framework with App Router
- **[React 19](https://react.dev/)** — UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Re-usable component library
- **[Lucide React](https://lucide.dev/)** — Icon library
- **[Google Fonts](https://fonts.google.com/)** — Crimson Pro & Inter typography
- **localStorage API** — Client-side data persistence

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** runtime
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/minddump.git
cd minddump
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

---

## 📝 Usage Instructions

### Writing Your First Entry

1. **Start typing** in the textarea — your draft auto-saves every 500ms
2. **Click "Save Entry"** when you're ready to preserve it permanently
3. Your entry is saved with a timestamp to localStorage

### Viewing Past Entries

1. **Click "Entries"** in the header navigation
2. See all your entries listed chronologically
3. **Click any entry** to read the full content
4. **Click the trash icon** to delete entries you no longer need

### Clearing Your Draft

- Click **"Clear"** button to empty the current draft
- Start fresh without saving

### Dark Mode

MindDump automatically detects your system's dark mode preference and adjusts the interface accordingly.

---

## 💾 How Auto-Save Works

MindDump uses a **debounced auto-save mechanism**:

1. As you type, a 500ms timer starts
2. If you keep typing, the timer resets
3. When you pause for 500ms, your draft saves to localStorage
4. Your work is preserved even if you close the tab or browser crashes
5. When you return, your unsaved draft is restored automatically

**Draft Storage:** `localStorage.mindDumpDraft`  
**Saved Entries:** `localStorage.mindDumpEntries`

---

## 🔐 Privacy & Data Storage

### Local-Only Storage

- **100% client-side** — No backend server or database
- **No analytics** — No tracking or telemetry
- **No cloud sync** — Your data never leaves your device
- **Browser localStorage** — Data persists across sessions

### Data Locations

All data is stored in your browser's localStorage:

```javascript
localStorage.mindDumpDraft     // Current unsaved draft
localStorage.mindDumpEntries   // Array of saved entries
```

### Data Portability

Your data is stored as JSON in localStorage. To export:

1. Open browser DevTools (F12)
2. Go to **Application > Local Storage**
3. Copy `mindDumpEntries` value
4. Save as JSON file for backup

### Privacy Considerations

- Data is **not encrypted** in localStorage
- Clearing browser data will **delete all entries**
- Shared devices: Others with access can read your entries
- **Recommendation:** Use browser profiles or private/incognito mode on shared devices

---

## 🗺️ Roadmap

Future features being considered (not yet implemented):

- [ ] **Export to Markdown** — Download entries as `.md` files
- [ ] **Export to JSON** — Backup all data
- [ ] **Search & Filter** — Find entries by keyword or date range
- [ ] **Tagging System** (optional) — Add lightweight tags without losing simplicity
- [ ] **Encryption** — Optional password protection for entries
- [ ] **Print Styling** — Beautiful printing for physical notebooks
- [ ] **Word Count** (toggle) — Optional writing statistics
- [ ] **Import Data** — Restore from JSON backup
- [ ] **PWA Support** — Install as standalone desktop/mobile app
- [ ] **Keyboard Shortcuts** — Quick navigation (e.g., Cmd+S to save)

**Note:** These features are ideas only. MindDump is designed to stay minimal and distraction-free.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- How to submit pull requests

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for personal or commercial purposes.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** team for the amazing framework
- **[shadcn](https://twitter.com/shadcn)** for the beautiful UI components
- **[Vercel](https://vercel.com/)** for seamless deployment
- **Google Fonts** for Crimson Pro and Inter typefaces

---

## 📬 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/minddump/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/minddump/discussions)

---

<div align="center">

**Made with 🧠 for capturing life's moments**

⭐ Star this repo if you find it useful!

</div>