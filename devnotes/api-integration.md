## API Integration – CoSy & Narrative Systems

_Overview of architecture, phases, and guiding principles for AI-driven commentary and branching._

---

### 1. CoSy Commentary: Phased Strategy

**Phase 1: Static Triggers**

- **Pre-written responses** organized by minigame and category.
- **Trigger rules** based on behavioral flags and profile type (e.g. low reliability → more urgent tone).
- **Bias selection**: map profile distance to response index (formal → minimal, erratic → most severe).

**Phase 2: Dynamic GPT Layer**

- **Fallback** to static if API fails.
- **Build prompt** from minimal context: module name, action summary, key metrics, current profile.
- **Guardrails**: bureaucratic tone, minimal encouragement, reference metrics.

**Phase 3: Session-Level Analysis**

- **Summarize multi-game patterns** via a single GPT call.
- **Report structure**: observed trends, confidence levels, recommended follow-ups.
- **Use case**: end-of-day debrief, high-level narrative summary.

---

### 2. Narrative Branching Frameworks

**Core Principle**: Keep logic separate from content.

**Option A: Ink.js Integration**

- **Ink handles branching** and variable-driven narrative flow.
- **Bind behavioral variables** (profile, flags, minigame results) into Ink’s state.
- **Minimal glue code**: load story JSON, set variables, retrieve next passage.

**Option B: Custom Choice Engine**

- **Route-based**: map behavioral state to view components and text snippets.
- **Simple mapping tables** drive which narrative path to present.
- **Manual branching** for key decision points; AI can supply dynamic lines.

---

### 3. Guiding Principles (KISS / DRY / Performance)

- **Phased rollout**: start static → add GPT → expand analysis.
- **Decouple content**: narrative text lives in Ink or JSON, not in code.
- **Minimal payloads**: prompts include only essential metrics.
- **Fallbacks first**: ensure static commentary fully covers all triggers.
- **Centralize prompts**: one helper to build and sanitize GPT prompts.
- **Telemetry-aware**: log API latencies and error rates; tune frequency.

---

### 4. Next Steps & Ownership

1. **Review static library**: author category lists for each minigame.
2. **Define prompt template**: outline tokens and tone guidelines.
3. **Prototype GPT call**: integrate with one static path, test fallback.
4. **Evaluate narrative engine**: choose Ink.js or custom route.
5. **Document branch patterns**: create high-level flowcharts, not code.
6. **Lock down governance**: PR must update static responses, prompt templates, or branching maps, never in-line code.

---

_This document focuses on high-level approach; detailed implementation resides in `src/core/cosy/cosyEngine.js` and narrative files._
