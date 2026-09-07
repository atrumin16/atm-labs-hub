# ATM Software Labs — Central Ecosystem Hub

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://labs.trujillomingorance.com)
[![Status](https://img.shields.io/badge/Status-Operational-107c41?style=flat-square)](#)
[![Theme](https://img.shields.io/badge/Design_System-Mica_Corporate-0078d4?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](#)

> **Production Gateway:** [labs.trujillomingorance.com](https://labs.trujillomingorance.com)  
> Central landing hub, project directory, and edge status gateway for the entire `trujillomingorance.com` domain ecosystem.

---

## 🧭 Subdomain Directory

| Subdomain | Platform / Service | Stack |
| :--- | :--- | :--- |
| **`ai.`** | **Trujillo AI Studio** — Serverless multimodal AI workspace | Groq LPU, Qwen 3.6, Cloudflare Workers |
| **`focusguard.`** | **FocusGuard** — Zero-Trust DNS firewall & ad blocking | DNS-over-HTTPS, Cloudflare D1 & KV |
| **`alberto.`** | **Professional Portfolio** — SysAdmin, Cloud/IAM & DevOps | Vite, Modern CSS, Cloudflare Pages |
| **`guides.`** | **ATM Docs** — Technical runbooks & production architectures | Static HTML5/CSS, Edge Caching |
| **`rocky.`** | **Rocky Setter** — Veterinary & pet identification portal | Touch UI, Glassmorphism, Microchip NFC |
| **`labs.`** | **ATM Labs Hub** — Central orchestration & routing directory | Mica Acrylic UI, Edge Functions |

---

## 🌿 Enterprise Branching Model

| Branch | Purpose | Deployment Trigger |
| :--- | :--- | :--- |
| `main` | **Production** | Live deployment on `labs.trujillomingorance.com` |
| `develop` | **Staging** | Feature validation, visual regression testing, and integration |

---

## 📁 Repository Structure

```
atm-labs-hub/
├── 404.html             # Corporate branded 404 error page
├── index.html           # Central hub dashboard & live search directory
├── styles.css           # Corporate obsidian slate theme with mica acrylic glass
└── wrangler.toml        # Cloudflare Pages deployment configuration
```

---

## 🛠️ Tech Stack & Design System

- **Hosting:** Cloudflare Pages (Global Anycast Edge Network)
- **Palette:** Unified Corporate Obsidian Slate (`#080c14`), Acrylic Mica Glass (`rgba(15, 22, 36, 0.78)`), Microsoft Tech Blue (`#0078d4`) & Cyan (`#38bdf8`)
- **Typography:** Segoe UI / Aptos / Inter + Cascadia Code / JetBrains Mono
- **Features:** Client-side real-time fuzzy search, categorized filters, system operational status indicators, and responsive mobile layout.

---

## 🚀 Deployment

Deployments are pushed directly via Wrangler to Cloudflare Pages:

```bash
npx wrangler pages deploy . --project-name atm-labs-hub --commit-dirty=true
```

---

## 👤 Author & Maintainer

**Alberto Trujillo Mingorance**  
- Portfolio: [alberto.trujillomingorance.com](https://alberto.trujillomingorance.com)  
- GitHub: [@atrumin16](https://github.com/atrumin16)
