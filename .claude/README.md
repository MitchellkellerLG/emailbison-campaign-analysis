# Meeting Content Generator Plugin

**Version:** 2.0.0
**Status:** Phase 1 Complete - Foundation Established
**Architecture:** Context-First, Anonymization-Last

---

## Overview

Transforms Fireflies meeting transcripts into publish-ready social media content that authentically captures Mitchell Keller's voice, protects client confidentiality, and maintains LeadGrow's brand positioning.

**Key Innovation:** This system preserves full client context throughout content creation, anonymizing only at the publication boundary. This produces higher quality, more specific content than pre-anonymized approaches.

---

## Architecture Philosophy

### Context Quality First, Anonymization Last

1. **Extract** raw transcripts with full client context (private storage)
2. **Ideate** content opportunities using real names and exact metrics
3. **Enrich** with campaign performance data (real client names)
4. **Draft** posts with complete context for accuracy and voice fidelity
5. **Anonymize** systematically before publication
6. **Review** and publish to Typefully (8+ score threshold)

**Security Model:** One-way flow from `/content/private/` (client names) → `/content/public/` (anonymized)

---

## Project Structure

```
c:\Users\mitch\Desktop\Claude Code Projects\
├── .claude\
│   ├── plugin.json                    # Plugin manifest
│   ├── README.md                      # This file
│   ├── agents\
│   │   ├── transcript-extractor.md    # Stage 1: Pull raw transcripts
│   │   ├── content-ideator.md         # Stage 2: Identify opportunities
│   │   ├── data-enricher.md           # Stage 3: Campaign data
│   │   ├── content-writer.md          # Stage 4: Draft posts
│   │   ├── content-anonymizer.md      # Stage 5: Sanitize for publication
│   │   └── content-editor.md          # Stage 6: Score & publish
│   ├── skills\
│   │   └── transcript-tracker.md      # Prevent duplicate processing
│   └── commands\
│       ├── generate-content.md        # Full pipeline orchestration
│       └── analyze-campaigns.md       # Campaign data standalone
├── content\
│   ├── private\                       # ⚠️ NEVER COMMIT TO PUBLIC REPOS
│   │   ├── raw-transcripts\          # Full context transcripts
│   │   ├── drafts\                    # Pre-anonymized posts
│   │   ├── content-ideas-queue.md     # Briefs with real client names
│   │   ├── authority-statements.md    # Campaign data with real names
│   │   └── transcript-tracker-state.json
│   ├── public\                        # ✅ Safe for sharing
│   │   ├── shortform\
│   │   │   ├── tactical-guide\
│   │   │   ├── client-success\
│   │   │   ├── objection-handling\
│   │   │   ├── personal-update\
│   │   │   └── question-answer\
│   │   ├── longform\
│   │   │   ├── strategy-guide\
│   │   │   ├── case-study\
│   │   │   └── product-launch\
│   │   └── editorial-reviews\
│   └── libraries\
│       ├── brand-voice.md             # Mitchell's voice patterns
│       ├── post-type-criteria.md      # Success criteria per type
│       ├── successful-patterns.md     # Christian Placencia patterns
│       └── service-offering-map.md    # LeadGrow services (80% tactical)
└── 02_Configuration\
    └── Spec-Kit\
        ├── 01_Constitution.md         # Governing principles
        ├── 02_Specification.md        # Technical blueprint
        ├── 03_Technical_Planning.md   # Decision points
        └── 04_Task_Generation.md      # Implementation roadmap
```

---

## Usage

### Primary Workflow

```bash
/generate-content 2025-10-23:2025-10-30
```

This command orchestrates the full pipeline:
1. Extracts transcripts from specified date range
2. Identifies content opportunities
3. Enriches with campaign data
4. Drafts posts with full context
5. Anonymizes for publication
6. Scores and publishes 8+ posts to Typefully

### Standalone Campaign Analysis

```bash
/analyze-campaigns Foundation
```

Pulls campaign performance data for specific client workspace.

---

## Core Principles

### 1. Context Enables Excellence
Keep full context throughout creation, anonymize only at publication.

### 2. Single Responsibility Architecture
Each agent does ONE job exceptionally well.

### 3. Absolute Client Confidentiality
Zero tolerance for sensitive data leakage. Private/public separation enforced.

### 4. Voice Authenticity Above All
Content must be indistinguishable from Mitchell's manual writing.

### 5. Quality Over Quantity
Only publish content scoring 8+/10. No exceptions.

### 6. Fail-Safe by Design
Typefully receives DRAFTS only. Mitchell manually schedules all content.

**Full principles:** See [`02_Configuration/Spec-Kit/01_Constitution.md`](../../02_Configuration/Spec-Kit/01_Constitution.md)

---

## Implementation Status

### ✅ Phase 1: Foundation Setup (Complete)
- [x] Directory structure created
- [x] plugin.json manifest written
- [x] Agent template files initialized
- [x] Skill and command templates created
- [x] README documented

### 🚧 Phase 2: Agent Prompts - Private Zone (Next)
- [ ] transcript-extractor agent (Task 2.1)
- [ ] content-ideator agent (Task 2.2)
- [ ] data-enricher agent (Task 2.3)
- [ ] content-writer agent (Task 2.4)

### 🔜 Phase 3: Anonymization & Editor
- [ ] content-anonymizer agent (Task 3.1)
- [ ] content-editor agent (Task 3.2)

### 🔜 Phase 4: Skills & Commands
- [ ] transcript-tracker skill (Task 4.1)
- [ ] /generate-content command (Task 4.2)
- [ ] /analyze-campaigns command (Task 4.3)

### 🔜 Phase 5: Library Population
- [ ] brand-voice.md (Task 5.1)
- [ ] post-type-criteria.md (Task 5.2)
- [ ] successful-patterns.md (Task 5.3)
- [ ] service-offering-map.md (Task 5.4)

### 🔜 Phase 6: Testing & Validation
- [ ] Unit tests per agent (Task 6.1)
- [ ] Integration test (Task 6.2)
- [ ] Voice validation with Mitchell (Task 6.3)
- [ ] Anonymization audit (Task 6.4)

### 🔜 Phase 7: Documentation & Handoff
- [ ] Usage guide (Task 7.1)
- [ ] Maintenance checklist (Task 7.2)

---

## Success Metrics

### Must-Have (Launch Criteria)
- [ ] 100% anonymization accuracy in public output
- [ ] 0 client-identifying information in public directories
- [ ] 60%+ posts score 8+ (publish-ready)
- [ ] Mitchell confirms "sounds like me" on 5/5 test posts
- [ ] Zero duplicate transcript processing
- [ ] Full pipeline completes in <30 minutes
- [ ] Clear private/public file separation maintained

### Nice-to-Have (Iteration Goals)
- [ ] 70%+ approval rate after 1 month
- [ ] Average score 8.5+/10
- [ ] 48 shortform + 8 longform per month sustained
- [ ] Pattern recognition identifies high-performing content types

---

## MCP Integrations

### Required
- **Fireflies** (`mcp__fireflies`): Transcript extraction
- **EmailBison** (`mcp__bison_mcp`): Campaign performance data
- **Typefully** (`mcp__pipedream-typefully`): Draft publishing

### Optional (Future)
- **Airtable**: Booking data cross-reference
- **Google Docs**: Alternative publishing workflow

---

## Security Protocols

### Private Directory (`/content/private/`)
- ⚠️ Contains real client names, exact metrics, identifying details
- 🔒 Never commit to public repositories
- 🔒 Never reference in public posts
- ✅ Safe for internal content creation

### Public Directory (`/content/public/`)
- ✅ Fully anonymized, publication-ready
- ✅ Safe for sharing, committing to repos
- ✅ Client names transformed to industry descriptors
- ✅ Identifying details removed

### Anonymization Rules
| Data Type | Transformation |
|-----------|---------------|
| Client Company Names | "[industry/type] company selling [product] to [audience]" |
| Client Personal Names | Remove or genericize |
| Revenue | **Keep exact numbers** (per Mitchell's guidance) |
| Team Names | Preserve (Mitchell, Aydan, Eli, Harish, Nikos, Rashi, Ahmer, Jennifer) |
| Geographic | Keep when relevant to campaigns |

---

## Content Extraction Rule

**Critical:** Extract ONLY what Mitchell said.

Other speakers' words provide context/framing but are NOT the content. Mitchell's voice must dominate all published posts.

---

## Development Timeline

**Total Estimate:** 14 days (2 weeks)
- **Week 1:** Phases 1-4 (Foundation + Agents + Skills/Commands)
- **Week 2:** Phases 5-7 (Libraries + Testing + Documentation)

**Current Progress:** Phase 1 complete (Day 1-2)

---

## Next Steps

1. **Phase 2.1:** Implement transcript-extractor agent prompt
2. **Phase 2.2:** Implement content-ideator agent prompt
3. **Phase 2.3:** Implement data-enricher agent prompt
4. **Phase 2.4:** Implement content-writer agent prompt

See [`02_Configuration/Spec-Kit/04_Task_Generation.md`](../../02_Configuration/Spec-Kit/04_Task_Generation.md) for detailed task breakdown.

---

## Resources

- **Constitution:** [`02_Configuration/Spec-Kit/01_Constitution.md`](../../02_Configuration/Spec-Kit/01_Constitution.md)
- **Specification:** [`02_Configuration/Spec-Kit/02_Specification.md`](../../02_Configuration/Spec-Kit/02_Specification.md)
- **Technical Planning:** [`02_Configuration/Spec-Kit/03_Technical_Planning.md`](../../02_Configuration/Spec-Kit/03_Technical_Planning.md)
- **Task Generation:** [`02_Configuration/Spec-Kit/04_Task_Generation.md`](../../02_Configuration/Spec-Kit/04_Task_Generation.md)

---

**Document Owner:** Mitchell Keller
**Last Updated:** 2025-10-30
**Phase:** 1 of 7 Complete
