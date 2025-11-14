# Meeting Content Generator - Project Constitution

**Version:** 2.0 (Corrected Architecture)
**Date:** 2025-10-29
**Spec-Kit Phase:** 1 of 5 - Establish Principles

---

## Purpose of This Document

This constitution establishes the governing principles for the Meeting Content Generator project. All specifications, plans, tasks, and implementations must align with these core principles. This document serves as the North Star for decision-making throughout the project lifecycle.

---

## Project Mission Statement

Transform Fireflies meeting transcripts into publish-ready social media content that authentically captures Mitchell Keller's voice, protects client confidentiality, and maintains LeadGrow's brand positioning—all while operating at a sustainable weekly cadence with minimal manual intervention.

---

## Architectural Philosophy

### Content Quality First, Anonymization Last

**Core Insight:** You cannot create excellent content from pre-anonymized summaries. Context matters.

**Pipeline Design:**
1. Extract full, rich transcripts (private storage)
2. Ideate with complete context (real client names, exact metrics)
3. Draft with full understanding (better storytelling, accurate proof)
4. Anonymize before publication (systematic transformation)
5. Review and publish (quality control)

**Why This Matters:** "Education nonprofit got several meetings" is weaker content than knowing it was Foundation, 20 meetings, Ohio regional strategy. The writer needs context to craft compelling posts. Anonymization is a publishing concern, not a creation concern.

---

## Core Principles

### 1. Context Enables Excellence

**Principle:** Keep full context throughout creation, anonymize only at publication.

**Why It Matters:** Generic summaries produce generic content. Real names, exact numbers, and specific situations enable authentic storytelling. Mitchell's posts are compelling because they're specific—you can't be specific without context.

**Implementation Requirements:**
- Raw transcripts stored privately (never public)
- Content briefs include real client names (internal use only)
- Writer sees full context when drafting
- Anonymization happens as dedicated step before publication
- Clear separation: private working files vs. public-ready output

**Success Criteria:** Content quality measurably better than pre-anonymized approach, zero leaks to public

---

### 2. Single Responsibility Architecture

**Principle:** Each sub-agent does ONE job exceptionally well.

**Why It Matters:** Complexity kills systems. Multi-responsibility agents become black boxes that fail unpredictably. Debugging becomes impossible. Changes break unexpected things.

**Implementation Requirements:**
- 6 discrete sub-agents, each with focused purpose:
  1. transcript-extractor: Pull raw transcripts
  2. content-ideator: Identify opportunities (full context)
  3. data-enricher: Pull campaign performance data
  4. content-writer: Draft posts (full context)
  5. content-anonymizer: Sanitize for publication
  6. content-editor: Score, critique, publish
- Tool access restricted to minimum necessary
- No "helper" or "utility" agents that do vague tasks
- Clear input/output contracts per agent
- Agents composable but stateless

**Success Criteria:** Can replace/improve any single agent without touching others

---

### 3. Absolute Client Confidentiality

**Principle:** Zero tolerance for sensitive data leakage in public content.

**Why It Matters:** Client trust is non-negotiable. A single confidentiality breach destroys relationships and reputation. Legal liability and moral responsibility demand perfect execution.

**Implementation Requirements:**
- Private storage for raw transcripts, briefs, pre-anonymized drafts
- Public storage only for anonymized, reviewed content
- content-anonymizer does systematic transformations:
  - Client names → natural industry descriptors (never "Client A")
  - Revenue/metrics → ranges or qualitative descriptions
  - Email addresses, domains, identifying details removed
- content-editor performs final anonymization verification
- Mitchell manual review checkpoint before scheduling

**Success Criteria:** 100% anonymization accuracy, 0 client identification incidents, clear audit trail

---

### 4. Voice Authenticity Above All Else

**Principle:** Content must be indistinguishable from Mitchell's manual writing.

**Why It Matters:** Mitchell's personal brand IS LeadGrow. If content sounds robotic, generic, or unlike him, it erodes trust and credibility built over months of authentic posting.

**Implementation Requirements:**
- Every sub-agent must reference brand-voice.md
- content-writer must demonstrate voice consistency through examples
- content-editor must score voice fidelity as part of Technical criteria
- Library files must capture specific patterns, not just general guidelines
- Full context enables authentic voice (specific stories vs. generic advice)

**Success Criteria:** 80%+ of published posts should receive "this sounds exactly like you" feedback

---

### 5. Quality Over Quantity

**Principle:** Only publish content scoring 8+/10. No exceptions for hitting volume targets.

**Why It Matters:** Reputation damage from one bad post exceeds value of ten mediocre ones. Mitchell's brand equity depends on consistent excellence.

**Implementation Requirements:**
- Explicit scoring rubric with objective criteria
- content-editor must document why posts fail threshold
- Failed posts get constructive critique for rewrite
- Weekly summary tracks approval rates (target 60%+)
- If production quality drops, pause and diagnose prompt issues

**Success Criteria:** Average published post score 8.5+/10, no posts below 8 reach Typefully

---

### 6. Show, Don't Tell

**Principle:** Use examples to define expectations, not abstract descriptions.

**Why It Matters:** AI models learn from examples, not philosophical explanations. "Write conversationally" is vague. Showing 3 conversational examples is precise.

**Implementation Requirements:**
- Every sub-agent includes 2-3 diverse examples
- Libraries contain real samples (Christian Placencia posts, Mitchell's voice patterns)
- Post-type-criteria.md shows good/bad examples per type
- content-writer prompt includes before/after transformations
- Scoring rubric shows example scores with justifications

**Success Criteria:** No prompt section longer than 3 paragraphs without an example

---

### 7. Fail-Safe by Design

**Principle:** System defaults to manual review, not auto-publish.

**Why It Matters:** Automation amplifies mistakes. A bug could publish 50 bad posts before Mitchell notices. Manual checkpoints preserve control while scaling effort.

**Implementation Requirements:**
- Typefully receives DRAFTS, never published posts
- Mitchell manually reviews and schedules all content
- content-editor flags edge cases for human judgment
- Giveaways ALWAYS require approval before drafting
- Weekly summaries surface patterns for quality monitoring
- Private/public file separation prevents accidental exposure

**Success Criteria:** Zero auto-published posts, 100% human-in-loop for final decision, no private files in public directories

---

### 8. Data-Driven Iteration

**Principle:** Track metrics, identify patterns, refine prompts continuously.

**Why It Matters:** Initial prompts won't be perfect. Without feedback loops, system quality degrades over time. Pattern recognition enables systematic improvement.

**Implementation Requirements:**
- content-editor generates weekly summary reports
- Track: approval rate, average score, post type distribution, common failure modes
- Quarterly library updates based on voice evolution
- A/B test prompt variations when quality dips
- Document what works (successful-patterns.md updates)

**Success Criteria:** Measurable quality improvement quarter-over-quarter

---

### 9. Context Efficiency

**Principle:** Load only what agents need, when they need it.

**Why It Matters:** Token budgets are finite. Loading entire libraries into every agent wastes context and slows execution. Surgical tool access prevents accidents.

**Implementation Requirements:**
- Sub-agents reference libraries explicitly, don't bundle them
- Tool restrictions prevent scope creep
- Transcript-tracker skill prevents reprocessing duplicates
- content-ideator creates briefs (not full posts) to minimize downstream context
- content-writer loads only relevant libraries per post type
- Private files separate from public (security + organization)

**Success Criteria:** Full pipeline (5 transcripts → drafts) completes in <30 minutes

---

### 10. Clarity Above Cleverness

**Principle:** Explicit instructions beat elegant abstractions.

**Why It Matters:** AI models follow what you say, not what you mean. Ambiguity creates variance. Variance breaks automation. "Be creative" produces chaos. "Use Pattern 3 from successful-patterns.md" produces consistency.

**Implementation Requirements:**
- Step-by-step processes with action/input/output per step
- Verification checklists before output
- Constraints section (what NOT to do)
- Explicit thresholds (not "good performance" - "12%+ reply rate")
- Tag-based referencing ("Reference <examples> section" not "see examples")

**Success Criteria:** Prompts executable by literal interpretation, no inference required

---

### 11. Progressive Enhancement

**Principle:** Build MVP first, add sophistication later.

**Why It Matters:** Perfect is the enemy of done. Complex systems fail during development. Simple systems ship, get feedback, improve.

**Implementation Requirements:**
- Phase 1-5 implementation plan with clear milestones
- Phase 1 delivers working end-to-end pipeline
- Advanced features (automation, carousels, video scripts) deferred to Phase 6-7
- Test on small batches before scaling
- Each phase delivers usable value, not just scaffolding

**Success Criteria:** Working content generation within 2 weeks, not 2 months

---

## Non-Negotiable Constraints

### What This System MUST DO
1. ✅ Keep raw transcripts and working files private
2. ✅ Provide full context to content creators (ideator, writer)
3. ✅ Anonymize systematically before publication
4. ✅ Maintain Mitchell's authentic voice
5. ✅ Generate content across all funnel stages (top/mid/bottom)
6. ✅ Score posts objectively before publishing
7. ✅ Create Typefully drafts for manual review
8. ✅ Track processed transcripts to prevent duplicates
9. ✅ Provide weekly quality summaries
10. ✅ Support weekly generation cadence without burnout

### What This System MUST NOT DO
1. ❌ Store client-identifying information in public directories
2. ❌ Anonymize transcripts before content ideation (loses context)
3. ❌ Auto-publish content without Mitchell's approval
4. ❌ Publish posts scoring below 8/10
5. ❌ Generate content in voices other than Mitchell's
6. ❌ Create giveaways without explicit approval
7. ❌ Reprocess already-handled transcripts
8. ❌ Operate without clear audit trails
9. ❌ Replace Mitchell's creative judgment
10. ❌ Mix agent responsibilities (each does ONE thing)

---

## Decision Framework

When facing implementation decisions, apply this hierarchy:

### Priority 1: Safety
- Does this protect client confidentiality?
- Does this prevent accidental publishing?
- Is private data clearly separated from public?

### Priority 2: Quality
- Does this improve content excellence?
- Does this preserve context for creators?
- Does this surface better creative opportunities?
- Does this provide better feedback for iteration?

### Priority 3: Simplicity
- Is each agent doing ONE thing?
- Is this the simplest approach that could work?
- Can we trace what happened if something goes wrong?

### Priority 4: Efficiency
- Does this reduce manual work?
- Does this speed up the pipeline?
- Does this prevent duplicate effort?

### Priority 5: Sophistication
- Does this enable new content types?
- Does this provide better analytics?
- Does this unlock future capabilities?

**If efficiency conflicts with safety, quality, or simplicity, choose safety/quality/simplicity.**

---

## Success Metrics

### Must-Have (Launch Criteria)
- [ ] 100% anonymization accuracy in public output
- [ ] 0 client-identifying information in public directories
- [ ] 60%+ posts score 8+ (publish-ready)
- [ ] Mitchell confirms "sounds like me" on 5/5 test posts
- [ ] Zero duplicate transcript processing
- [ ] Full pipeline completes in <30 minutes
- [ ] Weekly summaries provide actionable insights
- [ ] Clear private/public file separation maintained

### Nice-to-Have (Iteration Goals)
- [ ] 70%+ approval rate after 1 month of refinement
- [ ] Average score 8.5+/10
- [ ] 48 shortform + 8 longform per month sustained
- [ ] Funnel distribution: 60% top, 30% mid, 10% bottom
- [ ] Pattern recognition identifies high-performing content types
- [ ] Content quality measurably better than pre-anonymized approach

---

## Pipeline Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│ STAGE 1: TRANSCRIPT EXTRACTION (Private)            │
│ Agent: transcript-extractor                         │
│ Output: /content/private/raw-transcripts/*.md       │
│ Contains: Full client names, exact metrics          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 2: CONTENT IDEATION (Private, Full Context)   │
│ Agent: content-ideator                              │
│ Reads: Raw transcripts with real names/metrics      │
│ Output: /content/private/content-ideas-queue.md     │
│ Contains: Content briefs with real client context   │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 3: CAMPAIGN DATA ENRICHMENT (Private)         │
│ Agent: data-enricher                                │
│ Output: /content/private/authority-statements.md    │
│ Contains: Campaign data with real client names      │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 4: CONTENT DRAFTING (Private, Full Context)   │
│ Agent: content-writer                               │
│ Reads: Briefs with real context for accuracy        │
│ Output: /content/private/drafts/*.md                │
│ Contains: Posts with real names (pre-anonymization) │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 5: ANONYMIZATION (Public-Ready)               │
│ Agent: content-anonymizer                           │
│ Transforms: Client names → industry descriptors     │
│             Exact revenue → ranges/qualitative      │
│             Removes identifying details             │
│ Output: /content/public/shortform/* & /longform/*   │
│ Contains: Anonymized, publication-ready posts       │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ STAGE 6: EDITORIAL REVIEW & PUBLISHING              │
│ Agent: content-editor                               │
│ Actions: Score, verify anonymization, push to       │
│          Typefully (8+ only)                        │
│ Output: Editorial reviews + Typefully drafts        │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ MANUAL REVIEW: Mitchell                             │
│ Review Typefully drafts → Schedule manually         │
└─────────────────────────────────────────────────────┘
```

**Key Security Points:**
- `/content/private/` - Never committed to public repos, client names present
- `/content/public/` - Safe for sharing, fully anonymized
- Pipeline moves data private → public, never reverse
- Each agent validates inputs from appropriate directory

---

## Evolution Guidelines

### When to Update This Constitution
- Discovering a principle violation caused significant harm
- New constraint emerges from real-world usage
- Success criteria prove inadequate for quality measurement
- Decision framework fails to resolve implementation conflicts
- Architecture change required (like this ideation-before-anonymization fix)

### Who Can Update
- Mitchell (project owner, final authority)
- Implementation team (with Mitchell approval)

### What Requires Constitutional Amendment
- Changing safety principles (anonymization, publishing)
- Altering quality thresholds (8+ score requirement)
- Modifying architecture philosophy (single responsibility, context-first)
- Adding/removing non-negotiable constraints
- Changing pipeline order or agent count

### What Doesn't Require Amendment
- Prompt refinements within sub-agents
- Library content updates
- New post types or formatting patterns
- Tool/MCP integrations
- Phase 6-7 feature additions
- Performance threshold adjustments

---

## Alignment Check Questions

Before implementing ANY component, ask:

1. **Context:** Does this preserve full context for content creators?
2. **Safety:** Is private data clearly separated from public output?
3. **Responsibility:** Is this agent doing ONE thing, or multiple things?
4. **Voice:** Will this help or hurt content sounding like Mitchell?
5. **Quality:** Does this raise or lower the bar for publishable content?
6. **Simplicity:** Is this the simplest approach that could work?
7. **Auditability:** Can we trace what happened if something goes wrong?
8. **Sustainability:** Can Mitchell maintain this weekly without burnout?

If the answer to #1, #2, or #3 is uncertain, stop and revisit the design.
If the answer to #4, #5, or #6 is uncertain, consider alternatives.
If the answer to #7 or #8 introduces risk, redesign with safeguards.

---

## Constitution Status

**Approval Status:** ✅ Approved (Version 2.0 - Corrected Architecture)
**Implementation Status:** 🚧 Not Started
**Next Step:** Proceed to Spec-Kit Phase 2 (Specification)

**Changelog:**
- **v2.0 (2025-10-29):** Fixed critical architecture flaw - moved ideation BEFORE anonymization to preserve context for content quality. Added 6th agent (content-anonymizer). Separated private/public directories.
- **v1.0 (2025-10-29):** Initial constitution (incorrect anonymization-first approach)

---

## Appendix: Inspiration & Context

### Why This Project Exists
Mitchell records 5-10 strategic calls per week. These conversations contain gold:
- Client success stories (anonymizable case studies)
- Objection handling (pain point content)
- Strategic frameworks (authority positioning)
- Personal updates (humanizing content)

Currently, this value is locked in Fireflies. Manually extracting takes hours. This system unlocks weekly content generation at scale while preserving quality and safety.

### Why Context-First Matters
Early architecture anonymized transcripts first. This created generic summaries that produced generic content. "Education nonprofit got several meetings" lacks punch. "Foundation got 20 meetings using Ohio regional strategy" is specific, compelling, and provides full context for the writer. Anonymization is a publishing concern, not a creation concern.

### Design Philosophy Influences
- **Anthropic Best Practices:** Single-responsibility agents, tool restrictions, context efficiency
- **Ultimate Prompt Engineering Guide:** Show don't tell, explicit rubrics, verification checklists
- **Mitchell's Voice:** Christian Placencia pattern analysis, actual speech patterns from transcripts
- **Fail-Safe Engineering:** Manual review checkpoints, audit trails, zero-trust automation
- **Security by Design:** Private/public separation, anonymization at publication boundary

---

**Document Owner:** Mitchell Keller
**Last Updated:** 2025-10-29
**Version Control:** Track changes to principles in git commit messages
