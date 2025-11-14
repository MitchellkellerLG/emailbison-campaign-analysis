# Meeting Content Generator - Task Generation

**Version:** 1.0
**Date:** 2025-10-29
**Spec-Kit Phase:** 4 of 5 - Generate Tasks
**Governed By:** [01_Constitution.md](01_Constitution.md) | [02_Specification.md](02_Specification.md) | [03_Technical_Planning.md](03_Technical_Planning.md)

---

## Document Purpose

This document provides a detailed, actionable task checklist for implementing the Meeting Content Generator plugin. Each task includes acceptance criteria, estimated effort, and dependencies.

---

## Implementation Timeline

**Total Estimated Effort:** 2 weeks (80-100 hours)
- **Week 1:** Foundation + Agent Prompts (Private Zone)
- **Week 2:** Anonymization + Editor + Libraries + Testing

---

## Phase 1: Foundation Setup

**Duration:** 2 days (Day 1-2)
**Goal:** Create plugin structure and directories

### Task 1.1: Create Directory Structure
**Estimated Time:** 30 minutes

**Actions:**
```bash
# Create plugin structure
mkdir -p .claude/plugins/meeting-content-generator/.claude-plugin
mkdir -p .claude/plugins/meeting-content-generator/agents
mkdir -p .claude/plugins/meeting-content-generator/skills/transcript-tracker
mkdir -p .claude/plugins/meeting-content-generator/commands

# Create content directories (outside plugin)
mkdir -p content/private/raw-transcripts
mkdir -p content/private/drafts
mkdir -p content/public/shortform/stories
mkdir -p content/public/shortform/shallow-ideas
mkdir -p content/public/shortform/personal-life
mkdir -p content/public/shortform/pain-points
mkdir -p content/public/shortform/how-tos
mkdir -p content/public/shortform/results
mkdir -p content/public/longform/case-studies
mkdir -p content/public/longform/deep-dives
mkdir -p content/public/longform/authority-frameworks
mkdir -p content/public/editorial-reviews
mkdir -p content/libraries
```

**Acceptance Criteria:**
- [ ] All directories created
- [ ] Directory structure matches spec exactly
- [ ] Private/public separation clear

---

### Task 1.2: Write plugin.json Manifest
**Estimated Time:** 20 minutes

**File:** `.claude/plugins/meeting-content-generator/.claude-plugin/plugin.json`

**Content:** (From Phase 2 Specification)
```json
{
  "name": "meeting-content-generator",
  "version": "2.0.0",
  "description": "Transforms Fireflies meeting transcripts into publish-ready social media content with voice fidelity and client anonymization. Context-first architecture preserves quality.",
  "author": "Mitchell Keller / LeadGrow",
  "agents": [
    {
      "name": "transcript-extractor",
      "file": "agents/transcript-extractor.md",
      "description": "Pulls raw transcripts from Fireflies with full context (PRIVATE)"
    },
    {
      "name": "content-ideator",
      "file": "agents/content-ideator.md",
      "description": "Identifies content opportunities using full client context (PRIVATE)"
    },
    {
      "name": "data-enricher",
      "file": "agents/data-enricher.md",
      "description": "Pulls campaign performance data with real client names (PRIVATE)"
    },
    {
      "name": "content-writer",
      "file": "agents/content-writer.md",
      "description": "Drafts posts with Mitchell's voice using full context (PRIVATE)"
    },
    {
      "name": "content-anonymizer",
      "file": "agents/content-anonymizer.md",
      "description": "Sanitizes drafts for publication (PRIVATE → PUBLIC)"
    },
    {
      "name": "content-editor",
      "file": "agents/content-editor.md",
      "description": "Scores, critiques, and publishes anonymized posts (PUBLIC)"
    }
  ],
  "skills": [
    {
      "name": "transcript-tracker",
      "directory": "skills/transcript-tracker",
      "description": "Maintains list of processed transcript IDs to prevent duplicates"
    }
  ],
  "commands": [
    {
      "name": "generate-content",
      "file": "commands/generate-content.md",
      "description": "Orchestrates full content generation pipeline from transcripts to Typefully drafts"
    },
    {
      "name": "analyze-campaigns",
      "file": "commands/analyze-campaigns.md",
      "description": "Quick campaign performance pull for authority statements"
    }
  ],
  "dependencies": {
    "mcpServers": [
      "fireflies",
      "bison_mcp",
      "pipedream-airtable",
      "pipedream-typefully"
    ]
  },
  "configuration": {
    "privateContentPath": "c:\\Users\\mitch\\Desktop\\Claude Code Projects\\content\\private",
    "publicContentPath": "c:\\Users\\mitch\\Desktop\\Claude Code Projects\\content\\public",
    "librariesPath": "c:\\Users\\mitch\\Desktop\\Claude Code Projects\\content\\libraries",
    "modelPreference": "sonnet",
    "weeklyTargets": {
      "shortform": 48,
      "longform": 8,
      "funnelMix": {
        "top": 0.6,
        "mid": 0.3,
        "bottom": 0.1
      }
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Valid JSON (no syntax errors)
- [ ] All 6 agents listed
- [ ] Paths use absolute Windows paths with escaped backslashes
- [ ] All MCP dependencies listed

---

### Task 1.3: Initialize Empty Files
**Estimated Time:** 15 minutes

**Create these empty files (will populate later):**
```bash
# Agent files (empty for now)
touch .claude/plugins/meeting-content-generator/agents/transcript-extractor.md
touch .claude/plugins/meeting-content-generator/agents/content-ideator.md
touch .claude/plugins/meeting-content-generator/agents/data-enricher.md
touch .claude/plugins/meeting-content-generator/agents/content-writer.md
touch .claude/plugins/meeting-content-generator/agents/content-anonymizer.md
touch .claude/plugins/meeting-content-generator/agents/content-editor.md

# Skill files
touch .claude/plugins/meeting-content-generator/skills/transcript-tracker/SKILL.md

# Command files
touch .claude/plugins/meeting-content-generator/commands/generate-content.md
touch .claude/plugins/meeting-content-generator/commands/analyze-campaigns.md

# Library templates
touch content/libraries/brand-voice.md
touch content/libraries/post-type-criteria.md
touch content/libraries/successful-patterns.md
touch content/libraries/service-offering-map.md

# Tracking file
touch content/private/processed-transcript-ids.txt
```

**Acceptance Criteria:**
- [ ] All files created
- [ ] File paths match plugin.json exactly

---

### Task 1.4: Write Plugin README
**Estimated Time:** 20 minutes

**File:** `.claude/plugins/meeting-content-generator/README.md`

**Content:**
```markdown
# Meeting Content Generator Plugin

Transforms Fireflies meeting transcripts into publish-ready social media content.

## Architecture

**Context-First Pipeline:**
1. Extract raw transcripts (full client context)
2. Ideate content opportunities (using real names)
3. Enrich with campaign data
4. Draft posts (with full context for accuracy)
5. Anonymize for publication
6. Editorial review & Typefully publishing

## Usage

### Generate Content from Recent Calls
\`\`\`
/generate-content last-week
\`\`\`

### Analyze Campaign Performance
\`\`\`
/analyze-campaigns all
\`\`\`

## Security

- **Private directory** (`content/private/`): Contains client-identifying information
- **Public directory** (`content/public/`): Fully anonymized, safe for sharing
- One-way flow: Private → Public only

## Agents

1. **transcript-extractor** - Pulls raw Fireflies transcripts
2. **content-ideator** - Identifies content opportunities
3. **data-enricher** - Pulls EmailBison/Airtable campaign data
4. **content-writer** - Drafts posts with Mitchell's voice
5. **content-anonymizer** - Systematically anonymizes for publication
6. **content-editor** - Scores, reviews, publishes to Typefully

## Configuration

See `.claude-plugin/plugin.json` for paths and settings.
```

**Acceptance Criteria:**
- [ ] README clear and accurate
- [ ] Usage examples included
- [ ] Security notes present

---

## Phase 2: Agent Prompts - Private Zone

**Duration:** 2 days (Day 3-4)
**Goal:** Write prompts for agents handling private data

### Task 2.1: transcript-extractor Agent
**Estimated Time:** 2 hours

**File:** `.claude/plugins/meeting-content-generator/agents/transcript-extractor.md`

**Key Requirements:**
- Pull transcripts from Fireflies using date range
- Invoke transcript-tracker skill to prevent duplicates
- Extract full context (NO anonymization)
- Classify call type (Sales/Client Sync/Internal/Partner/Consultant/Training)
- Extract Mitchell's quotes specifically
- Save to `/content/private/raw-transcripts/`

**Prompt Structure:**
```markdown
---
name: transcript-extractor
description: Pulls raw Fireflies transcripts with complete context
tools: [mcp__fireflies__get_transcripts, mcp__fireflies__search, mcp__fireflies__fetch, Read, Write]
model: sonnet
---

<role>
[Define role with context]
</role>

<task>
[Extract transcripts, classify, save with full context]
</task>

<process>
<step_1>
<action>Check for duplicate transcript IDs</action>
<input>Transcript IDs from Fireflies query</input>
<validation>Invoke transcript-tracker skill</validation>
<output>List of new (unprocessed) transcript IDs</output>
</step_1>

[Additional steps...]
</process>

<examples>
[2-3 examples showing Fireflies API response → output file]
</examples>

<verification_checklist>
- [ ] Full transcript captured
- [ ] All participants listed with real names
- [ ] Mitchell's quotes preserved exactly
- [ ] NO anonymization applied
- [ ] File saved to /content/private/raw-transcripts/
- [ ] processed-transcript-ids.txt updated
</verification_checklist>

<constraints>
- NEVER anonymize at this stage
- ONLY extract what Mitchell said (other speakers = context)
- ONLY write to private directory
</constraints>
```

**Acceptance Criteria:**
- [ ] Prompt follows standard structure
- [ ] Tool restrictions enforced (only Fireflies MCPs, Read, Write)
- [ ] Examples included
- [ ] Verification checklist present
- [ ] Constraints clear

---

### Task 2.2: content-ideator Agent
**Estimated Time:** 2.5 hours

**File:** `.claude/plugins/meeting-content-generator/agents/content-ideator.md`

**Key Requirements:**
- Read raw transcripts with full client context
- Map opportunities to post types
- Assign funnel stages and priorities
- Create content briefs with real client names
- Include anonymization instructions for later
- Save to `/content/private/content-ideas-queue.md`

**Special Focus:**
- Only use Mitchell's words as content
- Other speakers provide context/framing
- Briefs must be specific (real names, exact metrics)

**Acceptance Criteria:**
- [ ] Prompt emphasizes Mitchell-only content extraction
- [ ] Priority scoring matrix included
- [ ] Post type mapping logic clear
- [ ] Content brief template exact
- [ ] Anonymization notes field required

---

### Task 2.3: data-enricher Agent
**Estimated Time:** 2 hours

**Key Requirements:**
- Switch between EmailBison workspaces (workspace names = client names)
- Calculate reply rates: (unique_replies / total_leads_contacted) * 100
- Apply performance thresholds (from spec)
- Cross-reference Airtable if needed
- Create authority statements with real client names
- Save to `/content/private/authority-statements.md`

**EmailBison Data Mapping:**
```yaml
Workspace Discovery:
  - List all workspaces via emailbison_list_workspaces
  - Workspace.name = client name (Foundation, TeachAid, etc.)

Campaign Metrics:
  - Switch workspace: emailbison_rotate_workspace(workspace_name)
  - Get campaigns: emailbison_list_campaigns
  - Fields: unique_replies, total_leads_contacted, emails_sent
  - Calculate: reply_rate = (unique_replies / total_leads_contacted) * 100
```

**Acceptance Criteria:**
- [ ] Workspace switching logic implemented
- [ ] Reply rate calculation correct
- [ ] Thresholds from spec applied
- [ ] Authority statement format matches spec

---

### Task 2.4: content-writer Agent
**Estimated Time:** 3 hours (most complex)

**File:** `.claude/plugins/meeting-content-generator/agents/content-writer.md`

**Key Requirements:**
- Read content briefs with real client context
- Load appropriate libraries (brand-voice, post-type-criteria, successful-patterns)
- Draft posts using real names and exact metrics
- Apply Mitchell's voice (conversational, punchy, specific, casual authority, occasionally profane)
- Include frontmatter with client_context and anonymization_notes
- Save to `/content/private/drafts/`

**Voice Calibration:**
- Use Christian Placencia posts as patterns
- Emphasize specificity over vagueness
- Short paragraphs (1-3 sentences)
- Occasional profanity when it adds punch
- Interest references (Kobe, Five Rings) sparingly (1 in 5-7 posts)

**Post Type Examples Required:**
- Story (80-150 words)
- Pain Point (120-180 words)
- How-To (100-200 words)
- Case Study (250-400 words)
- Result (60-120 words)

**Acceptance Criteria:**
- [ ] Voice characteristics detailed with examples
- [ ] All post type structures included
- [ ] Frontmatter template exact
- [ ] Library loading logic clear
- [ ] Verification checklist comprehensive

---

## Phase 3: Anonymization & Editor Agents

**Duration:** 2 days (Day 5-6)
**Goal:** Write anonymization and editorial review prompts

### Task 3.1: content-anonymizer Agent
**Estimated Time:** 2.5 hours

**File:** `.claude/plugins/meeting-content-generator/agents/content-anonymizer.md`

**Key Requirements:**
- Read pre-anonymized drafts from `/content/private/drafts/`
- Apply transformation rules (from spec)
- Verify no client names remain
- Save to `/content/public/shortform/` or `/longform/`
- Update frontmatter with anonymization_log

**Transformation Rules (From Mitchell's Input):**
- Client names → natural industry descriptors
- Personal names → remove or genericize
- Exact revenue → keep (don't over-anonymize per Mitchell)
- Geographic specifics → keep when relevant
- Team names → preserve (Mitchell, Aydan, Eli, Harish, Nikos, Rashi, Ahmer, Jennifer)

**Critical Security Check:**
- Search for known client names (from Airtable workspace list)
- If ANY found after anonymization → HALT, flag error
- Never write back to private directory (one-way flow enforced)

**Acceptance Criteria:**
- [ ] Transformation table complete
- [ ] Before/after examples included (3+)
- [ ] Security halt logic implemented
- [ ] One-way flow enforced (reads private, writes public only)
- [ ] Verification patterns (regex for leaks)

---

### Task 3.2: content-editor Agent
**Estimated Time:** 3 hours

**File:** `.claude/plugins/meeting-content-generator/agents/content-editor.md`

**Key Requirements:**
- Read anonymized posts from `/content/public/`
- Score using rubric (Entertainment 30%, Uniqueness 25%, Criteria 30%, Technical 15%)
- Final anonymization verification
- If 8+: Push to Typefully with proper sequencing
- If <8: Document critique with constructive feedback
- Generate weekly summary report

**Scoring Rubric:**
```yaml
Entertainment (30 points):
  - Hook: 10
  - Feed-Worthiness: 10
  - Memorable: 10

Uniqueness (25 points):
  - Fresh Angle: 10
  - Mitchell-Specific: 10
  - Adds Value: 5

Criteria Alignment (30 points):
  - Type-specific (see post-type-criteria.md)

Technical (15 points):
  - Voice: 5
  - Length: 3
  - Format: 3
  - Anonymization: 2
  - CTA: 2
```

**Typefully Integration:**
- Check recent drafts for sequencing (avoid back-to-back same type)
- Create draft with: schedule_date=null, threadify=auto, no auto-retweet/plug
- Update post frontmatter with typefully_draft_id

**Acceptance Criteria:**
- [ ] Scoring rubric detailed with point breakdowns
- [ ] Critique format template included
- [ ] Sequencing logic implemented
- [ ] Typefully API parameters exact
- [ ] Weekly summary format complete
- [ ] Final anonymization check mandatory

---

## Phase 4: Skills & Commands

**Duration:** 1 day (Day 7)
**Goal:** Implement transcript-tracker skill and orchestration commands

### Task 4.1: transcript-tracker Skill
**Estimated Time:** 1 hour

**File:** `.claude/plugins/meeting-content-generator/skills/transcript-tracker/SKILL.md`

**Requirements:**
- Read `/content/private/processed-transcript-ids.txt`
- Filter out already-processed IDs
- Return only new IDs to process
- After processing, append new IDs to file

**File Format:**
```
# Processed Fireflies Transcript IDs
# Format: [ID] | [Date Processed] | [Call Type] | [Brief Topic]

01K7SNGDYNCEWNAYX1VTFVAYRD | 2025-10-26 | Client Sync | Foundation Ohio Regional
```

**Acceptance Criteria:**
- [ ] Duplicate checking logic implemented
- [ ] File format documented
- [ ] Error handling (file doesn't exist → create)
- [ ] Append logic after processing

---

### Task 4.2: /generate-content Command
**Estimated Time:** 1.5 hours

**File:** `.claude/plugins/meeting-content-generator/commands/generate-content.md`

**Requirements:**
- Parse input (date range or transcript IDs)
- Orchestrate 6-agent pipeline sequentially
- Handle failures (halt immediately, flag error per Mitchell)
- Display summary at end

**Pipeline Flow:**
```
1. transcript-extractor (date range/IDs)
2. content-ideator (raw transcripts)
3. data-enricher (autonomous)
4. content-writer (top briefs)
5. content-anonymizer (all drafts)
6. content-editor (anonymized posts)
7. Display summary
```

**Error Handling:**
- If any stage fails → HALT immediately
- Display stage name and error
- Suggest troubleshooting steps
- Do NOT continue pipeline

**Acceptance Criteria:**
- [ ] All 6 stages invoked in order
- [ ] Input parsing logic (date range vs IDs)
- [ ] Error handling per Mitchell's requirement
- [ ] Summary display format complete

---

### Task 4.3: /analyze-campaigns Command
**Estimated Time:** 30 minutes

**File:** `.claude/plugins/meeting-content-generator/commands/analyze-campaigns.md`

**Requirements:**
- Invoke data-enricher with filter
- Display summary (campaigns analyzed, exceptional count)
- Link to authority-statements.md

**Acceptance Criteria:**
- [ ] Simple pass-through to data-enricher
- [ ] Summary format clear
- [ ] Link to output file

---

## Phase 5: Library Population

**Duration:** 3 days (Day 8-10)
**Goal:** Populate library files with Mitchell's actual voice and patterns

### Task 5.1: brand-voice.md
**Estimated Time:** 3 hours

**File:** `content/libraries/brand-voice.md`

**Sources:**
- Christian Placencia posts (provided earlier in conversation)
- Training session transcripts (Mitchell's speaking patterns)
- Mitchell's input on voice characteristics

**Content Sections:**
1. Core Voice Characteristics (conversational, punchy, specific, casual authority, occasionally profane)
2. Brand Positioning (situation-based messaging, technicians not maintenance men, men not markets)
3. Formatting Preferences (short paragraphs, ALL CAPS, bullets, no emojis in shortform)
4. Interest Bank (Kobe, Five Rings, Art of War, Vagabond, Berserk, Hormozi, lifting, family, history)
5. Conversational Patterns ("Here's how...", "Stop doing X, do Y instead")
6. CTA Construction (DM, Comment, YouTube, Website, None)
7. Rule of Threes (humor pattern)

**Acceptance Criteria:**
- [ ] All sections populated with examples
- [ ] Christian Placencia patterns incorporated
- [ ] Mitchell's voice characteristics captured
- [ ] Good/bad examples for each characteristic

---

### Task 5.2: post-type-criteria.md
**Estimated Time:** 2 hours

**File:** `content/libraries/post-type-criteria.md`

**Content:** Success criteria for each post type

**Post Types to Document:**
1. Stories (Top funnel)
2. Shallow Ideas (Top funnel)
3. Personal Life (Top funnel)
4. Pain Points (Mid funnel)
5. How-Tos (Mid funnel)
6. Results (Mid funnel)
7. Case Studies (Bottom funnel)
8. Giveaways (Bottom funnel)

**For Each Type:**
- Structure (opening, body, close)
- Length (word count range)
- Voice (specific tone for this type)
- Success criteria (what makes it work)
- Examples (good vs. bad)

**Acceptance Criteria:**
- [ ] All 8 post types documented
- [ ] Structure templates clear
- [ ] Success criteria specific (not vague)
- [ ] Examples included

---

### Task 5.3: successful-patterns.md
**Estimated Time:** 1.5 hours

**File:** `content/libraries/successful-patterns.md`

**Sources:**
- Christian Placencia posts (already provided)
- Mitchell's high-performing posts (if available)

**Patterns to Document:**
1. Infrastructure Breakdown (list tools/numbers)
2. Year-Over-Year Comparison (evolution showcase)
3. Gated Lead Magnet (engagement requirement)
4. "Stop X, Do Y Instead" (tactical correction)
5. Simple Template Reveal (best-performing copy)
6. Raw Tactical Breakdown ("Here's how" directness)
7. Personal Milestone (life updates)

**Acceptance Criteria:**
- [ ] All patterns from Christian's posts captured
- [ ] Pattern structure documented
- [ ] Examples included
- [ ] When to use each pattern

---

### Task 5.4: service-offering-map.md
**Estimated Time:** 2 hours

**File:** `content/libraries/service-offering-map.md`

**Content:**
1. What LeadGrow Does (high-level)
2. Full Service Breakdown (8 components from spec)
3. What LeadGrow Doesn't Do
4. Positioning vs Competitors
5. Giveaway-Worthy Components

**Service Breakdown:**
1. Strategic Positioning
2. Target Market Research
3. List Building & Data
4. Copywriting
5. Infrastructure & Deliverability
6. Campaign Execution
7. Meeting Conversion
8. Expansion Services

**Tactical Detail Level:** 80% shareable (per Mitchell)

**Acceptance Criteria:**
- [ ] All 8 service components documented
- [ ] Tactical details appropriate for posts
- [ ] Giveaway-worthy items identified
- [ ] Positioning vs competitors clear

---

### Task 5.5: Initialize processed-transcript-ids.txt
**Estimated Time:** 15 minutes

**File:** `content/private/processed-transcript-ids.txt`

**Content:**
```
# Processed Fireflies Transcript IDs
# Format: [ID] | [Date Processed] | [Call Type] | [Brief Topic]
# DO NOT manually edit unless correcting errors
```

**Acceptance Criteria:**
- [ ] File created with header
- [ ] Format documented
- [ ] Warning against manual editing

---

## Phase 6: Testing & Validation

**Duration:** 2 days (Day 11-12)
**Goal:** Validate end-to-end pipeline and voice quality

### Task 6.1: Unit Test Each Agent
**Estimated Time:** 3 hours

**Test Cases:**

**transcript-extractor:**
- Input: Date range "last-week"
- Expected: Raw transcripts in `/content/private/raw-transcripts/`
- Verify: NO anonymization, full client names present

**content-ideator:**
- Input: Raw transcript with "Foundation" client
- Expected: Brief with real client name, anonymization_notes field
- Verify: Specificity (not "a client"), Mitchell-only extraction

**data-enricher:**
- Input: "all" workspaces
- Expected: Authority statements with real client names
- Verify: Reply rate calculated correctly

**content-writer:**
- Input: Brief with Foundation context
- Expected: Draft in `/content/private/drafts/` with real names
- Verify: Mitchell's voice, client_context in frontmatter

**content-anonymizer:**
- Input: Draft with "Foundation" and "$500K"
- Expected: Anonymized post in `/content/public/`
- Verify: Foundation → industry descriptor, revenue kept (per Mitchell)

**content-editor:**
- Input: Anonymized post
- Expected: Score, editorial review, Typefully draft if 8+
- Verify: Final anonymization check runs

**Acceptance Criteria:**
- [ ] All 6 agents tested independently
- [ ] Each agent produces expected output
- [ ] File locations correct (private vs public)
- [ ] No errors logged

---

### Task 6.2: Integration Test - Full Pipeline
**Estimated Time:** 2 hours

**Test Scenario:**
1. Run `/generate-content last-week`
2. Process 1 transcript (ONE at a time per Mitchell)
3. Verify each stage completes
4. Check Typefully draft created for 8+ posts

**Validation Points:**
- [ ] Raw transcript extracted to private
- [ ] Content brief created with real context
- [ ] Authority statements populated (if campaigns found)
- [ ] Draft created with real names in private
- [ ] Anonymized post in public with no client names
- [ ] Editorial review generated
- [ ] Typefully draft created if 8+
- [ ] Weekly summary accurate

**Error Scenarios to Test:**
- No transcripts found for date range → Should display message, halt
- EmailBison API error → Should retry 3x, then halt if still fails
- Duplicate transcript ID → Should skip silently
- Anonymization detects leak → Should HALT, flag error
- All posts score <8 → Should complete but not push to Typefully

**Acceptance Criteria:**
- [ ] Full pipeline runs without errors
- [ ] All validation points pass
- [ ] Error scenarios handled correctly
- [ ] Output quality acceptable

---

### Task 6.3: Voice Validation with Mitchell
**Estimated Time:** 1 hour (Mitchell's time)

**Process:**
1. Generate 5 posts from real transcripts:
   - 1 Story
   - 1 Pain Point
   - 1 How-To
   - 1 Result
   - 1 Case Study

2. Mitchell reviews each post:
   - Sounds like me: Keep as-is
   - Too formal: Adjust voice (more casual)
   - Too casual: Adjust voice (more authority)
   - Missing pattern: Add to library

3. Iterate until 4/5 posts pass "sounds like me" test

**Acceptance Criteria:**
- [ ] 5 diverse post types generated
- [ ] Mitchell reviews all 5
- [ ] Voice adjustments documented
- [ ] 4/5 posts approved
- [ ] Prompt refinements made based on feedback

---

### Task 6.4: Anonymization Audit
**Estimated Time:** 1 hour

**Manual Security Check:**
1. Generate 10 posts from real transcripts with known clients
2. Search public directory for client names:
   ```bash
   grep -r "Foundation" content/public/
   grep -r "TeachAid" content/public/
   grep -r "Cleanlab" content/public/
   # etc. for all known clients
   ```
3. Verify 0 matches found

**Acceptance Criteria:**
- [ ] No client names found in public directory
- [ ] Content still specific and compelling
- [ ] Revenue figures preserved (per Mitchell's requirement)
- [ ] Geographic details kept when relevant

---

### Task 6.5: Performance Benchmark
**Estimated Time:** 30 minutes

**Test:**
- Run `/generate-content` on 1 transcript
- Measure time per stage
- Measure total pipeline time

**Targets:**
- Full pipeline: < 30 minutes (quality priority per Mitchell, so flexible)
- Per agent: < 5 minutes

**If Slower Than Expected:**
- Identify bottleneck stage
- Optimize (library lazy loading, transcript summarization if needed)
- Re-test

**Acceptance Criteria:**
- [ ] Performance measured
- [ ] Bottlenecks identified (if any)
- [ ] Acceptable based on Mitchell's quality-first priority

---

## Phase 7: Documentation & Handoff

**Duration:** 1 day (Day 13-14)
**Goal:** Document usage and maintenance

### Task 7.1: Update Plugin README
**Estimated Time:** 30 minutes

**Additions:**
- Actual usage examples with screenshots
- Troubleshooting guide
- Configuration notes
- Weekly workflow recommendations

**Acceptance Criteria:**
- [ ] README comprehensive
- [ ] Examples clear
- [ ] Troubleshooting helpful

---

### Task 7.2: Create Usage Guide for Mitchell
**Estimated Time:** 1 hour

**File:** `content/USAGE_GUIDE.md`

**Content:**
1. Weekly Workflow
   - When to run `/generate-content last-week` (suggestion: Monday mornings)
   - How to review Typefully drafts
   - How to provide feedback on voice drift

2. Giveaway Approval Process
   - Check for flagged giveaways in ideator output
   - Review giveaway posts in drafts
   - Approve or provide feedback
   - Editor pushes to Typefully after approval

3. Voice Maintenance
   - Monthly: Review 5 random generated posts
   - Quarterly: Update brand-voice.md based on new posts
   - When to refine agent prompts

4. Troubleshooting
   - Common errors and fixes
   - When to check MCP connections
   - How to handle pipeline failures

**Acceptance Criteria:**
- [ ] Weekly workflow documented
- [ ] Giveaway process clear
- [ ] Maintenance guidelines included
- [ ] Troubleshooting comprehensive

---

### Task 7.3: Create Maintenance Checklist
**Estimated Time:** 30 minutes

**File:** `content/MAINTENANCE.md`

**Checklist:**

**Weekly:**
- [ ] Run `/generate-content last-week`
- [ ] Review Typefully drafts
- [ ] Approve/reject giveaways
- [ ] Check editorial summary for quality trends

**Monthly:**
- [ ] Review 5 random generated posts for voice consistency
- [ ] Update client list (from Airtable workspace changes)
- [ ] Check processed-transcript-ids.txt for bloat

**Quarterly:**
- [ ] Update brand-voice.md (new patterns, voice evolution)
- [ ] Update successful-patterns.md (new high-performing posts)
- [ ] Review service-offering-map.md (service changes)
- [ ] Refine agent prompts based on quality trends

**As Needed:**
- [ ] Add new team members to brand-voice.md
- [ ] Update post-type-criteria.md (new content types)
- [ ] Troubleshoot MCP connection issues

**Acceptance Criteria:**
- [ ] All maintenance tasks documented
- [ ] Frequency clear (weekly/monthly/quarterly)
- [ ] Checkboxes for tracking

---

## Completion Checklist

### Foundation
- [ ] Directory structure created
- [ ] plugin.json written and valid
- [ ] README.md complete
- [ ] All empty files initialized

### Agents (Private Zone)
- [ ] transcript-extractor prompt complete
- [ ] content-ideator prompt complete
- [ ] data-enricher prompt complete
- [ ] content-writer prompt complete

### Agents (Public Zone)
- [ ] content-anonymizer prompt complete
- [ ] content-editor prompt complete

### Skills & Commands
- [ ] transcript-tracker skill implemented
- [ ] /generate-content command complete
- [ ] /analyze-campaigns command complete

### Libraries
- [ ] brand-voice.md populated
- [ ] post-type-criteria.md populated
- [ ] successful-patterns.md populated
- [ ] service-offering-map.md populated
- [ ] processed-transcript-ids.txt initialized

### Testing
- [ ] All 6 agents tested independently
- [ ] Full pipeline integration test passed
- [ ] Mitchell voice validation (4/5 posts approved)
- [ ] Anonymization audit (0 leaks found)
- [ ] Performance benchmarked

### Documentation
- [ ] Plugin README updated
- [ ] Usage guide created
- [ ] Maintenance checklist created

---

## Risk Mitigation

**High-Risk Areas:**

1. **Anonymization Failures**
   - Risk: Client names leak to public posts
   - Mitigation: Multi-layer verification (anonymizer + editor), manual audit
   - Fallback: Halt pipeline if leak detected

2. **Voice Inconsistency**
   - Risk: Generated posts don't sound like Mitchell
   - Mitigation: Voice validation with Mitchell (4/5 approval), iterative refinement
   - Fallback: Monthly voice checks, quarterly library updates

3. **MCP Connection Failures**
   - Risk: Fireflies/EmailBison/Typefully unavailable
   - Mitigation: Retry logic (3x with backoff), clear error messages
   - Fallback: Halt immediately, manual troubleshooting

4. **Pipeline Complexity**
   - Risk: 6-agent sequential pipeline prone to failures
   - Mitigation: Halt immediately on any failure (per Mitchell), clear stage identification
   - Fallback: Run agents independently if orchestration fails

---

## Next Steps

1. **Mitchell Reviews Phase 4** - Approve task breakdown
2. **Begin Implementation** - Start with Phase 1 (Foundation Setup)
3. **Iterative Development** - Test after each phase, adjust as needed
4. **Voice Calibration** - Prioritize Mitchell's voice validation early
5. **Launch** - Weekly content generation cadence

---

**Document Status:** ⏳ Ready for Implementation
**Next Phase:** 05_Implementation_Readiness.md (optional pre-flight check)
**Last Updated:** 2025-10-29
