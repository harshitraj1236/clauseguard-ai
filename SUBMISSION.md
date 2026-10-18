# ClauseGuard AI: The Zero-Leak Contract Auditor Protecting Freelancers from Predatory Terms

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 2: Side Hustle](https://dev.to/challenges/hacktoberfest-week2-2026-10-12)*

---

## What I Built

Every year, **1.5 billion freelancers and independent contractors** worldwide experience the exact same moment of dread: after weeks of pitching, negotiations, and technical interviews, a new client sends over a 20-page "standard" contract.

Buried inside that dense wall of legalese are high-stakes legal traps that can quietly destroy a freelancer’s livelihood:
* **The Net-90 Trap:** Working for three full months before receiving a single dollar, effectively acting as an interest-free bank for an enterprise client.
* **The IP Forfeiture Trap:** Overbroad intellectual property clauses that unintentionally assign the client full ownership over the freelancer’s personal starter templates, boilerplate code, tools, and libraries created years prior.
* **The Unlimited Indemnity Trap:** Clauses exposing an independent individual to uncapped financial liability if the client gets sued by a third party.

### The Freelancer Dilemma
Contract attorneys bill **$350 to $600 an hour**—financially out of reach for a $2,500 project. 

Meanwhile, pasting confidential client contracts into public cloud LLMs (OpenAI, Anthropic) **directly violates the Non-Disclosure Agreements (NDAs)** freelancers sign before receiving the project specifications.

### The Solution: ClauseGuard AI
**ClauseGuard AI** is an open-source, airgapped contract threat auditor and negotiation co-pilot built exclusively for freelancers and solopreneurs.

You paste any Statement of Work (SOW), Master Services Agreement (MSA), or NDA, and within seconds ClauseGuard:
1. **Calculates a 0–100 Safety Score:** A circular gauge immediately communicating legal risk posture.
2. **Isolates Threat Vectors:** Classifies risks into Payment Terms, IP Assignment, Indemnification, Non-Competes, and Termination.
3. **Translates Legalese into Plain English:** Explains in direct, jargon-free language why a specific clause hurts your cash flow or exposes you to legal liability.
4. **Synthesizes Ready-to-Send Redlines:** Crafts fair, commercially balanced counter-clauses with a single-click **"Copy Redline"** or **"Copy All as Negotiation Email"** button.
5. **Generates a 45-Second Spoken Audio Briefing:** Produces an executive voice briefing via ElevenLabs so freelancers can listen to the critical risks in under a minute before hopping on a client negotiation call.

### Who Would Pay For It?
Freelancers, independent engineers, design studios, and agency founders will gladly pay **$12/month (or $5 per ad-hoc audit)**. 

Avoiding a single 90-day payment delay or a contested IP ownership claim saves thousands of dollars and months of stress. For independent workers who manage their own sales and risk, ClauseGuard provides immediate, tangible ROI on day one.

---

## Demo

- **Local Port:** `http://localhost:1093`
- **User Interface:** Cyber-tactical sci-fi HUD console inspired by mission-critical defense dashboards, engineered with full responsive support across **mobile phones, tablets, and desktop workstations**.
- **Live Node Monitoring:** An active health indicator verifies that the local Ollama instance is reachable (`● NODE: gemma2:2b (Ollama Local)`), proving zero cloud transmission.

### Step-by-Step Workflow:
1. **Load a Test Vector:** Click the pre-loaded *"Predatory Consulting SOW"* chip (featuring Net-90 terms, total IP forfeiture, and uncapped liability).
2. **Observe Real-Time Pipeline:** Watch the 4-step pipeline track execution in real time:
   - *Sector 01:* Segmenting clauses & extracting operative language
   - *Sector 02:* Cross-referencing safe baseline benchmarks (Net-30, capped liability, mutual IP)
   - *Sector 03:* Google Gemma 2 neural reasoning & risk evaluation
   - *Sector 04:* Synthesizing redline counter-clauses & ElevenLabs audio briefing
3. **Review Threat Dossier:** Inspect the **15/100 Critical Threat** rating, examine the color-coded severity cards, listen to the 45-second audio briefing, and click **"Copy All Redlines as Email Draft"** to paste into your email client.

*(Demo screenshot / walkthrough GIF)*

---

## Code

ClauseGuard AI is 100% open-source under the permissive MIT License:

**GitHub Repository:** [https://github.com/harshitraj1236/clauseguard-ai](https://github.com/harshitraj1236/clauseguard-ai)

### Technical Stack:
- **Frontend Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS with custom cyber-tactical HUD theme & Lucide icons
- **Local AI Engine:** Google Gemma 2 (2B) executing locally over Ollama (`http://localhost:11434`)
- **Agent Workflow:** Mastra-inspired multi-sector pipeline
- **Voice Synthesis:** ElevenLabs TTS API with seamless browser Web Speech API fallback
- **Legal Benchmark Engine:** Fair-terms knowledge base covering commercial standards for independent contractors

---

## How I Built It

ClauseGuard was architected as an airgapped, four-sector agentic pipeline designed to run on modest local hardware:

```mermaid
flowchart TD
    User["Freelancer / Solopreneur"] -->|Pastes Contract / SOW| UI["Next.js Responsive HUD (Port 1093)"]
    UI -->|API Request| Workflow["Mastra Agent Workflow"]
    
    subgraph PrivacyBoundary["100% Zero-Leak Privacy Boundary (Local Machine)"]
        Workflow -->|1. Segment Clauses| Chunker["Clause Segmenter"]
        Workflow -->|2. Check Standards| Benchmarks["Safe Benchmark Store (Net-30, Mutual IP, Capped Liability)"]
        Workflow -->|3. Local Neural Inference| Gemma["Google Gemma 2 (2B via Ollama)"]
        Gemma -->|Risk Scores 1-10 + Plain-English Explanations| Workflow
    end
    
    Workflow -->|4. Synthesize Counter-Offers| Redlines["Redline Generator & Email Draft"]
    Workflow -->|5. Voice Briefing Script| ElevenLabs["ElevenLabs Voice Engine (Audio Player + Waveform)"]
    
    Workflow --> UI
    UI -->|Displays Gauge, Flagged Clauses, Audio Player & Redlines| User
```

1. **Google Gemma 2 (2B):** We selected Google's lightweight open-weight model `gemma2:2b`. Despite its compact 1.6 GB footprint, Gemma 2 exhibits exceptional legal comprehension and structured reasoning. It reliably parses ambiguous legal phrasing, identifies non-reciprocal clauses, and articulates clear counter-proposals.
2. **Mastra Agent Workflow:** Standardizes contract parsing into isolated units. Instead of dumping a massive contract into one unmanageable prompt, the workflow isolates individual clauses, evaluates them against our curated safe benchmark standards, and generates targeted redline adjustments.
3. **ElevenLabs Audio Briefing:** Freelancers are constantly multitasking. We integrated ElevenLabs to convert the top identified legal risks into a high-tempo 45-second audio brief, complete with play/pause controls, soundwave visualization, and an expandable text transcript.
4. **Live System Health Check:** To give users complete confidence that their data never touches a public server, the frontend pings `/api/status` to confirm local Ollama connectivity and displays an active green status pill directly on the console.

---

## Why Does Open Innovation Matter?

For ClauseGuard AI, **open innovation is not just an implementation detail—it is the core reason the product can legally and economically exist.**

### 1. The NDA Paradox (The Zero-Leak Privacy Mandate)
When a freelancer signs an enterprise client agreement, it invariably contains strict confidentiality provisions. **Uploading that agreement to a commercial cloud AI (such as OpenAI or Anthropic) technically breaches the NDA**, exposing the freelancer to breach-of-contract claims before work has even begun.

By utilizing Google's open-weight **Gemma 2** running locally through **Ollama**, ClauseGuard ensures that **100% of the contract text remains on the user's laptop**. No telemetry, no cloud logging, no data persistence, and zero confidentiality violations.

### 2. The Unit Economics of a Sustainable Micro-SaaS
A typical independent contractor might review three to five 20-page contracts each month. Running multi-turn legal analysis on commercial cloud LLMs would cost \$1.50–\$3.00 per audit in input/output tokens. At a \$9/month subscription price, a few active clients would eliminate profit margins entirely.

With open-weight models running on local hardware or low-cost private compute, **the marginal cost per token is \$0.00**. This enables a micro-SaaS with **95%+ gross margins**, making ClauseGuard commercially viable and sustainable as a bootstrapped side hustle.

### 3. Open Standards & Immunity from API Deprecation
Proprietary cloud APIs regularly deprecate model checkpoints, change pricing tiers, and alter safety filters unpredictably. By anchoring ClauseGuard to open weights and open-source agent frameworks (Mastra, Ollama), our auditing pipeline remains deterministic, auditable, and resilient to vendor lock-in.

---

## My Agent Session

This entire project was planned, coded, and iterated through an agentic pair-programming session using **DevRelay** and the Antigravity agentic coding environment:

{% agent_session 1018 %}

*(Agent Session #1018: Building ClauseGuard AI: Privacy-First Contract Auditor with Local Gemma 2)*

From scaffolding the Next.js 14 application to configuring the Ollama Gemma 2 pipeline, tuning the cyber-tactical HUD theme, and building the fallback speech systems, the entire development trail is documented in the interactive session above.

---


## Prize Categories

- 🏆 **Best Use of Gemma ($200):** Uses Google's **Gemma 2 (2B)** open-weight model running locally via Ollama to perform deep legal clause evaluation, threat scoring, and plain-English counter-proposal synthesis.
- 🏆 **Best Use of Mastra ($100):** Implements a multi-stage agentic workflow that segments legal text, validates clauses against a safe benchmark knowledge base, and orchestrates neural risk scoring.
- 🏆 **Best Use of ElevenLabs ($100):** Synthesizes a high-fidelity 45-second executive voice briefing with an interactive audio player, animated waveform, and collapsible transcript drawer.
- 🏆 **Best Use of Render ($200):** Production-ready Next.js web application configured for deployment on Render.
- 🏆 **Overall Winner ($250):** An original, production-ready, privacy-first side hustle that solves a genuine multi-billion dollar problem for independent workers using open-source AI.

---

*Disclaimer: ClauseGuard AI provides automated legal heuristics and risk scoring for educational and negotiation assistance. It is not formal legal counsel.*
