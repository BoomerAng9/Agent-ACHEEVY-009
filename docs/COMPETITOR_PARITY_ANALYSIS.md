# A.I.M.S. — Competitor Parity Analysis (P2.7)

> **Purpose:** Map AIMS capabilities against Manus AI and GenSpark to identify gaps, parity, and advantages. Drive roadmap for feature parity.
> **Compiled:** 2026-02-19 | **Status:** Active | **Requirement:** P2.7 COMPETITOR_PARITY

---

## Executive Summary

AIMS competes in the **Agentic Workspaces** category alongside Manus ($2-3B Meta acquisition), GenSpark ($1.25B valuation), Devin, CrewAI, and Lindy. Both competitors reached ~$100M ARR within 9 months. AIMS has architectural advantages (UEF Gateway, PMO routing, evidence-based execution) but lags in sandbox isolation, transparent agent visualization, and parallel agent execution.

**AIMS can win on:** pricing transparency, vertical specialization (Per|Form, House of Ang), evidence-based quality gates, and enterprise control.
**AIMS must close gaps in:** sandbox execution, real-time agent viewport, wide/parallel research, file deliverables, and integrations.

---

## Table of Contents

1. [Competitor Profiles](#1-competitor-profiles)
2. [Feature Parity Matrix](#2-feature-parity-matrix)
3. [Pricing Comparison](#3-pricing-comparison)
4. [Architecture Comparison](#4-architecture-comparison)
5. [UX/UI Comparison](#5-uxui-comparison)
6. [Integration Comparison](#6-integration-comparison)
7. [Gap Analysis — What AIMS Must Build](#7-gap-analysis)
8. [AIMS Advantages — What We Already Have](#8-aims-advantages)
9. [Roadmap Recommendations](#9-roadmap-recommendations)

---

## 1. Competitor Profiles

### Manus AI (manus.im)

- **Founded:** 2025 by Butterfly Effect Pte Ltd (ex-Monica.im team, Beijing → Singapore)
- **Acquired:** Meta, December 2025, ~$2-3B
- **ARR:** ~$100M in 8 months
- **Users:** Millions (exact undisclosed)
- **Scale:** 80M+ virtual computers created, 147T+ tokens processed
- **Primary LLMs:** Claude 3.5/3.7 Sonnet, fine-tuned Qwen, multi-model routing
- **Benchmark:** #1 on GAIA (all three difficulty levels), outperforming OpenAI Deep Research
- **Key Innovation:** Full VM per task (Firecracker microVMs), real-time viewport ("Manus's Computer"), Wide Research (100+ parallel agents), context engineering (KV-cache optimization, todo.md attention mechanism)

### GenSpark AI (genspark.ai)

- **Founded:** 2024 by Eric Jing (ex-Baidu VP)
- **Valuation:** $1.25B (Series B, $300M raised)
- **ARR:** ~$100M in 9 months
- **Users:** 2M+, 1,000+ business organizations
- **Primary LLMs:** Mixture-of-Agents (MoA) — 9 specialized LLMs with Claude as master coordinator
- **Benchmark:** 87.8% on GAIA
- **Key Innovation:** Sparkpages (rich structured output), "Call For Me" voice agent, AI Workspace 2.0 (Developer, Designer, Slides, Sheets, Docs), 80+ tools, API-first execution (not browser simulation)

---

## 2. Feature Parity Matrix

| Capability | Manus | GenSpark | AIMS | AIMS Status |
|---|:---:|:---:|:---:|---|
| **Chat with AI** | Yes | Yes | Yes | DONE — AcheevyChat + ChatInterface |
| **Multi-model routing** | Yes (Claude/Qwen/Gemini) | Yes (9 LLMs, MoA) | Yes (OpenRouter, 7+ models) | DONE — gateway model catalog |
| **Voice input (STT)** | No | Yes (Speakly app) | Yes (ElevenLabs Scribe + Deepgram) | PARTIAL — keys cemented, needs e2e |
| **Voice output (TTS)** | No | No | Yes (ElevenLabs + Deepgram) | PARTIAL — auto-play wired |
| **Voice calling agent** | No | Yes ("Call For Me") | No | MISSING |
| **Sandboxed code execution** | Yes (full VM, Firecracker) | Yes (API-first) | Partial (E2B sandbox route exists) | GAP — E2B route stubbed, no VM |
| **Real-time agent viewport** | Yes ("Manus's Computer") | Partial (reasoning viz) | No | GAP — collaboration feed spec exists |
| **Web browsing agent** | Yes (full Chromium) | Yes (AI Browser, 700+ tools) | No | GAP |
| **File creation & download** | Yes (.doc, .xlsx, .zip) | Yes (Sparkpages, exports) | No | GAP |
| **Deploy to live URL** | Yes | Yes (Cloudflare Pages) | Yes (Deploy Dock) | PARTIAL — UI exists, no CDN push |
| **Parallel agent execution** | Yes (Wide Research, 100+) | Yes (multi-agent MoA) | Partial (Boomer_Ang squad model) | GAP — squad model defined, not wired |
| **Scheduled/recurring tasks** | Yes | No | Partial (n8n cron triggers) | PARTIAL — n8n wired but not exposed |
| **Research & analysis** | Yes (Deep + Wide Research) | Yes (Deep Research) | Partial (Research_Ang defined) | GAP — Research_Ang not deployed |
| **Data visualization** | Yes (interactive dashboards) | Yes (AI Sheets, charts) | Partial (Circuit Metrics) | PARTIAL — dashboard exists, mock data |
| **Image generation** | Yes (creative suite) | Yes (AI Image) | No | MISSING |
| **Video generation** | Partial | Yes (AI Video) | Partial (Kling AI integration) | PARTIAL — Kling bypasses gateway |
| **Slide/presentation builder** | Yes | Yes (AI Slides) | No | MISSING |
| **Document builder** | Yes | Yes (AI Docs) | No | MISSING |
| **Code generation** | Yes (Python, Node.js) | Yes (AI Developer) | Partial (Chicken Hawk vertical) | PARTIAL — vertical defined, not wired |
| **Mobile app** | Yes (iOS) | No | No | MISSING |
| **Long-term memory** | Yes (cross-session) | Partial | Partial (Redis sessions) | PARTIAL — session state, no long-term |
| **100+ file uploads** | Yes | Partial | Partial (file upload route) | PARTIAL — single file upload works |
| **Task interruption/pause** | Yes | Partial | Yes (Change Order system) | PARTIAL — types defined, not wired |
| **OAuth integrations** | Yes (MCP: Gmail, Drive, etc.) | Yes (Gmail, Drive, Calendar) | Partial (Google OAuth, Discord) | PARTIAL — auth exists, limited connectors |
| **API for embedding** | Yes (Manus API) | No (not public yet) | Yes (UEF Gateway API) | DONE — gateway is the API |
| **PMO/workflow routing** | No | No | Yes (8 PMO offices) | ADVANTAGE — unique to AIMS |
| **Evidence-based execution** | No | No | Yes (7 quality gates) | ADVANTAGE — ORACLE framework |
| **Vertical specialization** | No (general purpose) | No (general purpose) | Yes (12 verticals) | ADVANTAGE — Per\|Form, House of Ang, etc. |
| **White-label/multi-tenant** | No | Partial | Partial (Make It Mine) | PARTIAL — DIY vertical defined |
| **CRM integration** | Yes (HubSpot) | Partial | Yes (CRM dashboard) | PARTIAL — UI exists |
| **Billing/usage metering** | Credits (opaque) | Credits (opaque) | Yes (LUC system) | ADVANTAGE — transparent unit-cost |

---

## 3. Pricing Comparison

### Manus

| Plan | $/mo | Credits | Concurrent | Notes |
|---|---|---|---|---|
| Free | $0 | 300/day + 1,000 starter | 1 | Chat mode only |
| Basic | $19 | 1,900 | 2 | Agent mode |
| Plus | $39 | 3,900 | 3 | ~4-8 complex tasks/mo |
| Pro | $199 | 19,900 | 10 | Wide Research Max |
| Enterprise | Custom | Custom | Custom | Shared pools |

**Pain points:** No cost preview, no rollover, mid-task credit depletion kills task with no partial results.

### GenSpark

| Plan | $/mo | Credits | Notes |
|---|---|---|---|
| Free | $0 | 100/day | Basic search + chat |
| Plus | $24.99 | "Unlimited" chat/image | Expires Dec 2026 |
| Pro | $249.99 | Full suite | All tools unlocked |
| Team | $30/seat | 12K credits | Multi-seat |
| Enterprise | Custom | Custom | Compliance, SSO |

**Pain points:** Unclear credit consumption, no rollover, billing disputes reported.

### AIMS (Current / Planned)

| Plan | $/mo | Unit | Notes |
|---|---|---|---|
| Starter | Free | LUC-based | Chat with ACHEEVY |
| Professional | $29 | LUC-based | Full Boomer_Ang access |
| Business | $99 | LUC-based | All verticals + priority |
| Enterprise | Custom | LUC-based | Dedicated support |

**AIMS advantage:** LUC (Logical Unit of Compute) provides transparent, predictable billing. Users see cost BEFORE execution. No surprise credit burns.

---

## 4. Architecture Comparison

| Component | Manus | GenSpark | AIMS |
|---|---|---|---|
| **Execution env** | Firecracker microVM per task | API-first (server-side) | Docker containers on VPS |
| **Isolation** | Full OS-level (zero trust) | Process-level | Container-level |
| **LLM strategy** | Multi-model routing (Claude primary) | MoA — 9 LLMs coordinated | OpenRouter multi-model + Vertex AI |
| **Context mgmt** | KV-cache optimization, todo.md, file-as-memory | Standard context windows | Standard context + Redis sessions |
| **Agent model** | Executor → Planner → Knowledge agents | 9 specialized Sparkle agents | ACHEEVY → PMO → Boomer_Ang squad |
| **Tool count** | 27 tools | 80+ tools | ~15 tools (via UEF Gateway) |
| **Gateway** | Direct agent ↔ LLM | Internal routing | UEF Gateway (Port Authority) |
| **Quality gates** | None (best-effort) | None | ORACLE 8-gate framework |
| **Evidence system** | Screenshots timeline | Sparkpages | Evidence Locker (proof-or-no-done) |

### Key Architecture Gaps for AIMS

1. **No VM-per-task isolation** — Docker is less isolated than Firecracker microVMs. For code execution tasks, AIMS needs E2B or similar sandboxing.
2. **No browser agent** — Manus has full Chromium; GenSpark has AI Browser with 700+ tools. AIMS agents cannot browse the web autonomously.
3. **Context engineering** — Manus's KV-cache optimization and todo.md mechanism for long-running tasks are not replicated in AIMS. Consider adopting.
4. **Tool count** — AIMS has ~15 tools vs Manus 27 / GenSpark 80+. Expand via MCP connectors.

---

## 5. UX/UI Comparison

| Feature | Manus | GenSpark | AIMS |
|---|---|---|---|
| **Design language** | Minimalist, white, clean | Dashboard-heavy, colorful | Dark luxury industrial, gold accent |
| **Chat interface** | ChatGPT-like + viewport | Dashboard with 15+ entry points | AcheevyChat with voice waveform |
| **Agent transparency** | Live VM viewport (screenshot timeline) | Reasoning visualization | Collaboration feed (spec only) |
| **Voice UX** | None | Speakly app + "Call For Me" | Inline mic + VoiceVisualizer + TTS |
| **Output format** | Downloadable files + deployed sites | Sparkpages (rich structured) | Chat messages (text only) |
| **Mobile** | iOS app | No | No (responsive web) |
| **Onboarding** | Simple prompt → go | Email/Google SSO → dashboard | 3-step sign-up wizard |
| **Branding** | Generic AI | Search-engine feel | Strong identity (ACHEEVY, Boomer_Angs) |

### AIMS UX Advantages
- **Voice-first design** — neither Manus nor GenSpark has inline voice with real-time waveform visualization
- **Strong brand identity** — ACHEEVY personality, PMO offices, Boomer_Ang agents create memorable UX
- **Dark luxury aesthetic** — distinctive vs generic white/light AI tools

### AIMS UX Gaps
- **No agent viewport** — users can't watch agents work in real-time
- **Text-only output** — no file generation, no deployed artifacts, no rich structured output like Sparkpages
- **No mobile app**

---

## 6. Integration Comparison

| Integration | Manus | GenSpark | AIMS |
|---|---|---|---|
| Gmail | Yes (MCP) | Yes | No |
| Google Calendar | Yes (MCP) | Yes | No |
| Google Drive | Yes (MCP) | Yes | No |
| Notion | Yes (MCP) | Yes | No |
| Slack | Yes (MCP) | Yes | No |
| GitHub | Yes (MCP) | Yes | No |
| Stripe | Yes (MCP) | No | Partial (keys cemented) |
| HubSpot | Yes (MCP) | No | No |
| Discord | No | Yes | Partial (webhook, unverified) |
| Telegram | No | No | Partial (webhook, unverified) |
| n8n | No | No | Yes (AIMS-native) |
| Zapier | Yes (MCP) | No | No |
| WhatsApp | No | No | Partial (webhook route) |
| Custom MCP | Yes | Yes | No |

**Gap:** AIMS has 0 MCP connectors. Both competitors use MCP for OAuth-based integrations. AIMS should implement MCP server support in the UEF Gateway.

---

## 7. Gap Analysis — What AIMS Must Build

### Critical Gaps (Must-Have for Parity)

| # | Gap | Manus Has | GenSpark Has | Effort | Priority |
|---|---|:---:|:---:|---|---|
| G1 | **Sandboxed code execution** | Full VM | API-first | High — integrate E2B or Firecracker | P1 |
| G2 | **Real-time agent viewport** | Live VM screen | Reasoning viz | High — build collaboration feed UI | P1 |
| G3 | **Web browsing agent** | Full Chromium | AI Browser | High — headless browser + agent | P1 |
| G4 | **File generation & download** | .doc/.xlsx/.zip | Sparkpages | Medium — add file export pipeline | P1 |
| G5 | **Parallel agent execution** | 100+ agents | MoA system | High — wire Boomer_Ang squad | P2 |
| G6 | **MCP connector framework** | 8+ connectors | 5+ connectors | Medium — MCP server in UEF | P2 |
| G7 | **Deep Research agent** | Yes | Yes | Medium — wire Research_Ang | P2 |

### Important Gaps (Competitive Advantage)

| # | Gap | Notes | Effort | Priority |
|---|---|---|---|---|
| G8 | Voice calling agent ("Call For Me") | GenSpark-only feature | Medium | P3 |
| G9 | Image/video generation suite | Both competitors have | Medium | P3 |
| G10 | Slide/document builder | Both competitors have | Medium | P3 |
| G11 | Mobile app (iOS/Android) | Manus has iOS | High | P4 |
| G12 | Long-term memory (cross-session) | Manus has | Medium | P3 |
| G13 | 100+ file upload support | Manus has | Low | P2 |

---

## 8. AIMS Advantages — What We Already Have

These are capabilities that **neither Manus nor GenSpark offers**:

| # | Advantage | Description | Competitive Moat |
|---|---|---|---|
| A1 | **PMO Routing (8 offices)** | Automatic intent classification → domain-specific routing. No competitor has structured PMO orchestration. | High — org-level AI workflow management |
| A2 | **ORACLE Quality Gates** | 7-gate quality framework with evidence requirements. Competitors are "best effort" with no structured QA. | High — enterprise trust |
| A3 | **Evidence Locker** | "No proof, no done" — every task requires verifiable evidence. Unique in the market. | High — accountability |
| A4 | **LUC Transparent Billing** | Users see cost BEFORE execution. Both competitors have opaque, burn-and-pray credit systems. | High — #1 user complaint for both competitors |
| A5 | **Voice-First Chat** | Inline mic with real-time waveform + auto-TTS playback. Neither competitor has voice in their primary chat. | Medium — UX differentiator |
| A6 | **Vertical Specialization** | 12 domain-specific verticals (Per\|Form sports, House of Ang entertainment, etc.). Competitors are general-purpose only. | High — niche dominance |
| A7 | **UEF Gateway (Port Authority)** | All traffic routed through a single governed gateway with rate limiting, auth, and audit. Manus routes direct; GenSpark is internal. | Medium — security/compliance |
| A8 | **Chain of Command** | ACHEEVY → PMO Director → Boomer_Ang hierarchy. Structured delegation vs flat agent execution. | Medium — enterprise governance |
| A9 | **n8n Native Automation** | Self-hosted n8n for workflow automation. Competitors rely on external Zapier/Make. | Low — but cost advantage |
| A10 | **Branded Agent Identity** | ACHEEVY, Boomer_Angs, named agents (Research_Ang, Router_Ang). Creates user loyalty. Competitors have generic "AI assistant." | Medium — brand stickiness |

---

## 9. Roadmap Recommendations

### Phase 1: Foundation Parity (Weeks 1-4)

1. **Wire E2B sandbox execution** — The `/api/test/e2b` route exists. Productionize it: user prompt → ACHEEVY → Boomer_Ang code execution in E2B sandbox → result + evidence back to chat.
2. **Build collaboration feed UI** — The `backend/uef-gateway/src/collaboration/` types and renderer exist. Build a real-time panel (right sidebar) showing agent actions as they happen. Start with text events, add screenshots later.
3. **Wire Research_Ang** — The agent is defined with a `:3010` endpoint. Deploy it and connect to ACHEEVY's research intent classification.
4. **Add file download to chat** — When agents produce files (code, docs, data), generate downloadable links in the chat response.

### Phase 2: Competitive Differentiation (Weeks 5-8)

5. **MCP connector framework** — Implement MCP server support in UEF Gateway. Start with Gmail + Google Drive + Notion (the top 3 most-requested integrations).
6. **Parallel Boomer_Ang execution** — Wire the squad model so ACHEEVY can dispatch multiple Boomer_Angs simultaneously for research/analysis tasks.
7. **Headless browser agent** — Add Puppeteer/Playwright-based browsing to Boomer_Ang capabilities. Route through UEF Gateway for security.
8. **Sparkpages equivalent** — Rich structured output format for research results, analysis, and reports (not just chat text).

### Phase 3: Leapfrog (Weeks 9-12)

9. **Cost preview before execution** — "This task will cost ~15 LUCs. Proceed?" Neither competitor offers this. Major trust differentiator.
10. **Voice calling agent** — Extend ElevenLabs integration to make outbound calls on behalf of users (GenSpark's "Call For Me" equivalent).
11. **Wide Research equivalent** — Leverage parallel Boomer_Ang execution for "research 50 competitors simultaneously" type tasks.
12. **Cross-session memory** — Persistent user preferences and task history beyond Redis TTL. Use Prisma/SQLite.

### Pricing Strategy

Position AIMS at the **value sweet spot** between GenSpark ($25-250/mo) and Manus ($19-199/mo):

| AIMS Plan | Price | Positioning |
|---|---|---|
| **Starter** | Free | Match Manus Free (300 credits) |
| **Professional** | $29/mo | Beat Manus Plus ($39) with transparent billing |
| **Business** | $99/mo | Undercut GenSpark Pro ($250) with vertical specialization |
| **Enterprise** | Custom | ORACLE gates + evidence = enterprise-grade governance |

**Key pricing differentiator:** Publish per-task LUC costs upfront. "A research task costs 5 LUCs. A code deploy costs 12 LUCs. You always know before you start."

---

## Competitive Positioning Statement

> **AIMS is the governed AI workspace.** While Manus and GenSpark let agents run wild with opaque billing, AIMS puts you in command: transparent costs, evidence-based quality gates, and structured PMO routing. Same agent power. Your rules.

---

*This document satisfies P2.7 COMPETITOR_PARITY. Update AIMS_PLAN.md accordingly.*
