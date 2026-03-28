# 🐟 Forgetful Fish (Dandân)

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Forgetful Fish** is a high-fidelity simulator for the Magic: The Gathering (MTG) "Dandân" format. It functions as both a playable web application and an AI research laboratory, exploring complex decision-making in a shared-resource environment.

---

## 🌊 The Format: Dandân

Dandân is a unique MTG format where both players share a single library and a single graveyard. The gameplay centers on managing information, manipulating the top of the deck, and fighting over the titular creature, **Dandân**.

### Core Rules
- **Shared Library & Graveyard:** Every draw and every mill affects both players.
- **The Fish Rule:** Dandân can only attack players who control an Island. If as its controller you own no Islands, you must sacrifice it.
- **20 Life / 80 Cards:** A focused, high-interaction experience where every land is combat text.

---

## ✨ Key Features

### 🧠 Advanced AI Engine
- **10+ Personalities:** Play against unique AI characters like **Tortoise** (Denial), **Shark** (Tempo), **Archivist** (Library control), and the legendary **Leviathan** (Final Boss).
- **MCTS-based Decision Making:** Employs Monte Carlo Tree Search and a variety of heuristic biases (aggression, control, draw bias) to simulate expert human play.
- **Self-Play Training:** Includes a robust system for AI training via large-scale self-play simulations.

### 🎨 Premium Web Interface
- **Dynamic Aesthetic:** Featuring a custom water ripple engine (jQuery Ripples) and glassmorphic UI.
- **Advanced Audio Engine:** Custom-built synthesized audio using the Web Audio API for immersive gameplay feedback (splashes, bubbles, spells).
- **Interactive Visuals:** Detailed card overlays, phase trackers, and a custom D20 rolling system for determination of the starting player.

### 🌐 Connectivity & Multiplayer
- **Peer-to-peer Play:** Built-in support for multiplayer sessions using PeerJS.
- **Shared View State:** Real-time synchronization of game state between peers with custom view projection logic.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React (Icons).
- **Logic:** TypeScript (Strict), custom MTG rule engine and state reducer.
- **Networking:** PeerJS (P2P Connectivity).
- **Audio:** Web Audio API (Tone/Sfx Synthesis).
- **Visuals:** HTML5 Canvas, jQuery Ripples, CSS3 Transitions/Animations.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation
```bash
npm install
```

### Running Locally
```bash
# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🧪 AI Research & Training

The project includes specialized scripts for training and evaluating AI models.

- **Self-Play Training:**
  ```bash
  # Standard 30-minute training session
  npm run selfplay
  
  # Fast 3-minute session for testing
  npm run selfplay:fast
  
  # 2-hour "Boss" training for high-level performance
  npm run selfplay:boss
  ```

- **Character Leagues:**
  Evaluate and rank different AI personalities by running a simulated league.
  ```bash
  npm run league
  ```

- **Rules Check:**
  Run regression tests to ensure game mechanics remain consistent.
  ```bash
  npm run rules:check
  ```

---

## 📁 Project Structure

- `dandan.ts`: Main React application component and UI logic.
- `src/game/`: Core engine, MTG rules, and PeerJS integration.
- `scripts/`: Node.js utilities for AI training, leagues, and testing.
- `img/`: High-quality assets, including character portraits and backgrounds.
- `training-output/`: Data generated from AI self-play sessions.

---

## 📜 Privacy & Storage

The app stores functional data in your browser's local storage (saved games, preferences, adventure progress). It does not use external tracking cookies. Official card art is fetched from [Scryfall](https://scryfall.com/).

---

Developed with ❤️ for the MTG community.
