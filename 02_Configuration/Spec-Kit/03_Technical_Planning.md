# Meeting Content Generator - Technical Planning

**Version:** 1.0
**Date:** 2025-10-29
**Spec-Kit Phase:** 3 of 5 - Technical Planning
**Governed By:** [01_Constitution.md](01_Constitution.md) | [02_Specification.md](02_Specification.md)

---

## Document Purpose

This document provides detailed technical implementation guidance for building the Meeting Content Generator plugin. It bridges the gap between high-level specification and actionable tasks, addressing implementation decisions, technical challenges, and integration points.

---

## Implementation Phases

### Phase 1: Foundation Setup (Week 1, Days 1-2)

**Goal:** Create plugin structure and directories

**Tasks:**
1. Create plugin directory structure
2. Write plugin.json manifest
3. Create all directory structures (private/public separation)
4. Initialize library files (empty templates)
5. Create processed-transcript-ids.txt tracker file
6. Write plugin README.md

**Deliverables:**
- Complete directory structure
- Valid plugin.json
- Empty agent files (structure only)
- README with usage instructions

**Technical Decisions Needed:**

⚠️ **DECISION POINT #1: Content Root Path**
- **Question:** Where should `/content/` directory live?
- **Options:**
  1. At project root: `c:\Users\mitch\Desktop\Claude Code Projects\content\`
  2. Inside plugin: `.claude/plugins/meeting-content-generator/content/`
  3. Separate location (specify path)
- **Impact:** All agent file paths depend on this
- **Your Input:** Which location makes most sense for your workflow?

⚠️ **DECISION POINT #2: Git Strategy for Private Directory**
- **Question:** How to handle `/content/private/` with client data?
- **Options:**
  1. Add to `.gitignore` in main project repo
  2. Separate git repo for private content (more secure)
  3. No version control for private (manual backups)
- **Impact:** Security and backup strategy
- **Your Input:** How do you want to handle version control for sensitive data?

---

### Phase 2: Agent Prompts - Private Zone (Week 1, Days 3-4)

**Goal:** Write prompts for agents that handle private data

**Agents:**
1. transcript-extractor
2. content-ideator
3. data-enricher
4. content-writer

**Implementation Approach:**

Each agent file follows this structure:
```markdown
---
name: agent-name
description: One-line purpose
tools: [list]
model: sonnet
---

<role>
You are [specific role with context]
</role>

<task>
[Explicit task description]
</task>

<process>
<step_1>
<action>[What to do]</action>
<input>[What data/files to read]</input>
<validation>[What to check]</validation>
<output>[What to create/update]</output>
</step_1>
...
</process>

<examples>
[2-3 diverse examples showing input → output]
</examples>

<verification_checklist>
[Explicit checks before completing]
</verification_checklist>

<constraints>
[What NOT to do]
</constraints>
```

**Technical Decisions Needed:**

⚠️ **DECISION POINT #3: Fireflies Date Range Default**
- **Question:** When user says `/generate-content last-week`, what's the date range?
- **Options:**
  1. Last 7 days from today
  2. Previous Monday-Sunday
  3. Last 5 business days
- **Impact:** Which transcripts get pulled
- **Your Input:** What makes sense for your weekly workflow?

⚠️ **DECISION POINT #4: Client Name Preservation**
- **Question:** Which client names should transcript-extractor preserve exactly?
- **Known clients from transcripts:**
  - Foundation (education nonprofit)
  - TeachAid (your product)
  - Bitcoin Magazine
  - [Others?]
- **Your Input:** Full list of current client names to recognize?

⚠️ **DECISION POINT #5: LeadGrow Team Members**
- **Question:** Which names should be preserved as LeadGrow team (not anonymized)?
- **Known from transcripts:**
  - Mitchell Keller (you)
  - Aydan, Eli, Harish, Nikos, Rashi, Ahmer, Caelan
  - Chris Booth (consultant/partner?)
  - Ron Rogers (partner?)
  - Sterling Proffer (partner?)
- **Your Input:** Complete current team list? Are Chris/Ron/Sterling partners or team?

---

### Phase 3: Agent Prompts - Anonymization & Public (Week 1, Days 5-6)

**Goal:** Write prompts for content-anonymizer and content-editor

**Agents:**
1. content-anonymizer (critical for security)
2. content-editor

**Implementation Focus:**

**content-anonymizer Prompt Structure:**
```markdown
<anonymization_rules>
[Explicit transformation table from spec]
</anonymization_rules>

<verification_patterns>
[Regex patterns to catch leaks]
- Client company names: [list]
- Personal names: [list]
- Email patterns: [@domain.org, etc.]
- Revenue patterns: [$XX,XXX, etc.]
</verification_patterns>

<examples>
<example_1>
<input>
Foundation went from 3% to 12% reply rate. Sarah Johnson confirmed $487K pipeline.
</input>
<output>
Education nonprofit went from 3% to 12% reply rate. Client confirmed significant six-figure pipeline.
</output>
<log>
- Foundation → Education nonprofit
- Sarah Johnson → Client
- $487K → significant six-figure pipeline
</log>
</example_1>
...
</examples>
```

**Technical Decisions Needed:**

⚠️ **DECISION POINT #6: Geographic Specificity**
- **Question:** When is location too identifying?
- **Rules needed:**
  - State/Province: Keep or remove? (Ohio, British Columbia)
  - City: Keep or remove? (Vancouver, Toronto)
  - Region: Keep or remove? (Metro Vancouver, Lower Mainland)
- **Impact:** Content specificity vs. anonymization
- **Your Input:** What level of geographic detail is safe to keep?

⚠️ **DECISION POINT #7: Revenue Generalization**
- **Question:** How to generalize revenue figures?
- **Options:**
  - Ranges: $400-500K
  - Qualitative: "significant six-figure"
  - Order of magnitude: "nearly $500K"
- **Your Input:** Which approach feels most natural for your voice?

---

### Phase 4: Library Population (Week 1-2, Days 7-10)

**Goal:** Populate library files with your actual voice and patterns

**Libraries to Populate:**
1. brand-voice.md
2. post-type-criteria.md
3. successful-patterns.md
4. service-offering-map.md

**Implementation Approach:**

**brand-voice.md Sources:**
- Analyze your existing X/Twitter posts (need access)
- Extract patterns from training session transcripts
- Document conversational patterns, formatting, CTAs
- Capture interest references (Kobe, Five Rings usage)

**successful-patterns.md Sources:**
- Christian Placencia analysis (already documented in architecture plan)
- Your high-performing posts (if you have engagement data)

**service-offering-map.md Sources:**
- Training session transcripts (what you actually do for clients)
- Your website/marketing materials
- Sales call transcripts

**Technical Decisions Needed:**

⚠️ **DECISION POINT #8: Voice Sample Access**
- **Question:** Where can I access your existing content for voice analysis?
- **Options:**
  1. Your X/Twitter profile (provide handle)
  2. Exported posts (CSV/JSON)
  3. Training transcripts only
- **Your Input:** Best source for analyzing your actual voice?

⚠️ **DECISION POINT #9: Post Engagement Data**
- **Question:** Do you have data on which posts performed best?
- **Options:**
  1. Yes - provide engagement metrics (likes, replies, bookmarks)
  2. No - use subjective "these felt good" examples
  3. Pull from X/Twitter analytics (if available)
- **Your Input:** Can you identify 10-15 top-performing posts?

⚠️ **DECISION POINT #10: Service Offering Detail**
- **Question:** How detailed should service-offering-map.md be?
- **Options:**
  1. High-level overview (what you tell prospects)
  2. Detailed breakdown (internal team knowledge)
  3. Both layers (strategic + tactical)
- **Impact:** Content quality vs. giving away too much
- **Your Input:** How much tactical detail is shareable in posts?

---

### Phase 5: Skills & Commands (Week 2, Days 11-12)

**Goal:** Implement transcript-tracker skill and orchestration commands

**Components:**
1. transcript-tracker skill (duplicate prevention)
2. /generate-content command
3. /analyze-campaigns command

**Implementation Approach:**

**transcript-tracker Skill:**
```markdown
---
name: transcript-tracker
type: skill
trigger: model-invoked
---

<purpose>
Prevent duplicate transcript processing by maintaining processed IDs list
</purpose>

<file_location>
/content/private/processed-transcript-ids.txt
</file_location>

<interface>
Input: array of transcript IDs to check
Output: { new_ids: [], already_processed: [] }
</interface>

<logic>
1. Read processed IDs file
2. Filter out already-processed IDs
3. Return only new IDs
4. After processing, append new IDs to file
</logic>
```

**Commands Structure:**
```markdown
---
name: generate-content
description: Full pipeline orchestration
---

<workflow>
1. Parse user input (date range or IDs)
2. Invoke transcript-extractor
3. Invoke content-ideator
4. Invoke data-enricher
5. Invoke content-writer
6. Invoke content-anonymizer
7. Invoke content-editor
8. Display summary
</workflow>

<error_handling>
- If stage fails, stop pipeline
- Log error with stage name
- Provide troubleshooting guidance
</error_handling>
```

**Technical Decisions Needed:**

⚠️ **DECISION POINT #11: Pipeline Failure Handling**
- **Question:** If Stage 3 (data-enricher) fails, should pipeline continue?
- **Options:**
  1. Halt immediately (safest, fails loudly)
  2. Continue without enriched data (degraded mode)
  3. Ask user whether to continue
- **Impact:** Robustness vs. flexibility
- **Your Input:** How should failures be handled?

⚠️ **DECISION POINT #12: Batch Size**
- **Question:** How many transcripts should /generate-content process in one run?
- **Current spec:** "Top 10-15 high-priority ideas"
- **Options:**
  1. Process all transcripts → generate all ideas → draft top 10-15
  2. Process max 5 transcripts at a time (smaller batches)
  3. User-specified limit
- **Impact:** Execution time vs. completeness
- **Your Input:** What batch size fits your weekly workflow?

---

### Phase 6: MCP Integration & Testing (Week 2, Days 13-14)

**Goal:** Connect to MCPs and validate end-to-end pipeline

**MCP Servers to Integrate:**
1. Fireflies (transcript-extractor)
2. EmailBison (data-enricher)
3. Airtable (data-enricher)
4. Typefully (content-editor)

**Testing Plan:**

**Stage 1: Unit Tests**
- Test each agent independently
- Verify input/output contracts
- Check file creation in correct directories

**Stage 2: Integration Tests**
- Run full pipeline on 1-2 test transcripts
- Verify anonymization (manual review)
- Check Typefully draft creation

**Stage 3: Voice Validation**
- Generate 5 posts from real transcripts
- Mitchell reviews: "Does this sound like me?"
- Iterate prompts based on feedback

**Technical Decisions Needed:**

⚠️ **DECISION POINT #13: EmailBison Data Structure**
- **Question:** What fields are available in EmailBison campaign data?
- **Needed for data-enricher:**
  - Campaign name
  - Reply rate (%)
  - Engaged leads (count)
  - Send date / duration
  - [Other fields?]
- **Your Input:** Can you share sample EmailBison campaign object (anonymized)?

⚠️ **DECISION POINT #14: Airtable Base/Table Structure**
- **Question:** Which Airtable base and table contain lead/booking data?
- **Needed for data-enricher:**
  - Base ID
  - Table name
  - Field names: Campaign Name, Status, Booking Date, etc.
- **Your Input:** Can you share Airtable structure or provide access?

⚠️ **DECISION POINT #15: Typefully Account**
- **Question:** Which Typefully account should receive drafts?
- **Options:**
  1. Personal X account (Mitchell Keller)
  2. LeadGrow company account
  3. Multiple accounts (personal + company)
- **Your Input:** Which account(s) are connected to Typefully MCP?

---

## Technical Architecture Decisions

### Directory Structure Implementation

**Final Structure (Pending Decision Point #1):**
```
[CONTENT_ROOT_PATH]/
  private/  (CLIENT DATA - .gitignore)
    raw-transcripts/
      2025-10-29-Client-Sync-Foundation-Ohio.md
      2025-10-30-Sales-Call-SaaS-Company.md
    drafts/
      2025-10-29-foundation-regional-strategy.md
      2025-10-30-saas-targeting-framework.md
    content-ideas-queue.md
    authority-statements.md
    processed-transcript-ids.txt

  public/  (ANONYMIZED - safe for git)
    shortform/
      stories/
        2025-10-29-regional-targeting-insight.md
      pain-points/
        2025-10-30-list-quality-matters.md
      how-tos/
      results/
      shallow-ideas/
      personal-life/
    longform/
      case-studies/
        2025-10-29-education-nonprofit-transformation.md
      deep-dives/
      authority-frameworks/
    editorial-reviews/
      2025-10-29-review-log.md

  libraries/  (safe for git)
    brand-voice.md
    post-type-criteria.md
    successful-patterns.md
    service-offering-map.md
```

**Security Implementation:**

`.gitignore` entries:
```
# Client-identifying information
content/private/
content/private/**/*

# Sensitive tracking
processed-transcript-ids.txt

# Backup copies
*.bak
*_OLD.md
```

---

### Agent Tool Restrictions (Security)

**Strict Tool Access Per Agent:**

```yaml
transcript-extractor:
  allowed:
    - mcp__fireflies__get_transcripts
    - mcp__fireflies__search
    - mcp__fireflies__fetch
    - Read
    - Write
  restricted:
    - NO typefully tools
    - NO edit tools
    - ONLY writes to /content/private/raw-transcripts/

content-ideator:
  allowed:
    - Read (private files only)
    - Write (private files only)
  restricted:
    - NO MCP tools
    - ONLY reads from /content/private/raw-transcripts/
    - ONLY writes to /content/private/content-ideas-queue.md

data-enricher:
  allowed:
    - mcp__bison_mcp__emailbison_*
    - mcp__airtable__* (if configured)
    - Read
    - Write
  restricted:
    - ONLY writes to /content/private/authority-statements.md

content-writer:
  allowed:
    - Read (private files + libraries)
    - Write (private files only)
  restricted:
    - NO MCP tools
    - ONLY writes to /content/private/drafts/

content-anonymizer:
  allowed:
    - Read (private files)
    - Write (public files)
  restricted:
    - NO MCP tools
    - Reads ONLY from /content/private/drafts/
    - Writes ONLY to /content/public/shortform/ or /longform/
    - CANNOT write back to private (one-way flow)

content-editor:
  allowed:
    - Read (public files + libraries)
    - Write (public files)
    - mcp__typefully__create_draft
    - mcp__typefully__get_scheduled_drafts
  restricted:
    - CANNOT read from /content/private/ (enforces anonymization boundary)
```

**Why Tool Restrictions Matter:**
- Prevents transcript-extractor from accidentally publishing to Typefully
- Ensures content-editor can't see client names (forces anonymization first)
- Creates clear security boundaries
- Makes debugging easier (smaller scope per agent)

---

### Prompt Engineering Standards

**Every Agent Prompt Must Include:**

1. **Role Definition** (`<role>`)
   - Specific persona with context
   - Why this role matters

2. **Task Description** (`<task>`)
   - Explicit goal
   - Success criteria

3. **Process Breakdown** (`<process>`)
   - Step-by-step with `<step_N>` tags
   - Each step: action, input, validation, output

4. **Examples** (`<examples>`)
   - Minimum 2, ideally 3
   - Diverse scenarios
   - Show input → process → output

5. **Verification Checklist** (`<verification_checklist>`)
   - Explicit pre-output checks
   - Formatted as checklist

6. **Constraints** (`<constraints>`)
   - What NOT to do
   - Common failure modes to avoid

**Example Prompt Structure:**

```markdown
---
name: content-writer
tools: [Read, Write]
model: sonnet
---

<role>
You are Mitchell Keller's personal copywriter who has internalized his voice through hundreds of conversations. You write with the same conversational punch, specific details, and casual authority he brings to every post.
</role>

<task>
Draft social media posts using FULL client context (real names, exact metrics) from content briefs. Your drafts will be anonymized later by content-anonymizer agent, so accuracy and specificity are more important than anonymization at this stage.
</task>

<process>
<step_1>
<action>Read content brief from queue</action>
<input>/content/private/content-ideas-queue.md (specific idea marked for drafting)</input>
<validation>
- Verify brief includes real client context
- Verify anonymization_notes field present
- Verify post_type clearly specified
</validation>
<output>Understanding of what to write and how to anonymize later</output>
</step_1>

<step_2>
<action>Load relevant libraries</action>
<input>
- /content/libraries/brand-voice.md (always)
- /content/libraries/post-type-criteria.md (for specific type)
- /content/libraries/successful-patterns.md (if relevant pattern identified)
</input>
<validation>Verify libraries loaded successfully</validation>
<output>Voice guidelines and structural templates</output>
</step_2>

<step_3>
<action>Draft post using real client context</action>
<input>Content brief with real names, exact metrics</input>
<validation>
- Hook uses specific details (not "a client" - say "Foundation")
- Metrics are exact (not "several" - say "20 meetings")
- Voice matches Mitchell's patterns
- Formatting follows guidelines
- Post type criteria met
</validation>
<output>Pre-anonymized draft saved to /content/private/drafts/</output>
</step_3>
</process>

<examples>
<example_1>
<brief>
Title: Foundation Ohio Regional Strategy
Client: Foundation (education nonprofit)
Hook: 3% to 12% reply rate transformation using regional targeting
Key Points:
- Ohio regional SST directors (not generic education leaders)
- $487K pipeline from 20 meetings
- Sarah Johnson confirmed results on 10/23 call
Anonymization Notes:
- Foundation → Education nonprofit
- Sarah Johnson → remove
- $487K → significant pipeline
</brief>

<draft>
---
title: Foundation Regional Strategy Success
client_context: Foundation (Sarah Johnson, Regional Director)
anonymization_notes: |
  Foundation → Education nonprofit
  Sarah Johnson → remove
  $487K → significant six-figure pipeline
---

Foundation went from 3% to 12% reply rate in 3 weeks.

Same offer. Different list.

Generic 'education leaders' → Ohio regional SST directors specifically.

Sarah confirmed $487K pipeline from 20 meetings yesterday.

That's the difference between markets and men.
</draft>
</example_1>

[Additional examples...]
</examples>

<verification_checklist>
Before saving draft:
- [ ] Used real client name in content (Foundation, not "a client")
- [ ] Exact metrics preserved ($487K, not "significant")
- [ ] Voice sounds like Mitchell (conversational, punchy, specific)
- [ ] Frontmatter includes client_context field
- [ ] Frontmatter includes anonymization_notes
- [ ] File saved to /content/private/drafts/
- [ ] Post type criteria met
</verification_checklist>

<constraints>
DO NOT:
- Anonymize at this stage (that's content-anonymizer's job)
- Write vague content ("a company" instead of "Foundation")
- Save to public directories (only private/drafts/)
- Skip frontmatter metadata
- Use generic examples when real context available
</constraints>
```

---

## Integration Points

### Fireflies MCP Integration

**Connection Test:**
```bash
# Verify Fireflies MCP is working
claude mcp list | grep fireflies
# Should show: fireflies (connected)
```

**API Calls Needed:**

```yaml
get_transcripts:
  purpose: Pull recent transcripts by date range
  parameters:
    fromDate: "2025-10-19"
    toDate: "2025-10-26"
    limit: 50
  returns: Array of transcript metadata

fetch:
  purpose: Get full transcript content
  parameters:
    id: "01K7SNGDYNCEWNAYX1VTFVAYRD"
  returns: Full transcript with sentences, speakers, timestamps
```

**Technical Decisions Needed:**

⚠️ **DECISION POINT #16: Fireflies Filter Strategy**
- **Question:** Should transcript-extractor filter transcripts by participant?
- **Use case:** Only pull calls where Mitchell is present
- **Options:**
  1. Pull all transcripts, filter manually
  2. Use Fireflies search with participant filter
  3. No filter (trust date range is sufficient)
- **Your Input:** Are there calls in your Fireflies you DON'T want processed?

---

### EmailBison MCP Integration

**Connection Test:**
```bash
# Verify EmailBison MCP is working
claude mcp list | grep bison
# Should show: bison_mcp (connected)
```

**API Calls Needed:**

```yaml
list_campaigns:
  purpose: Get all campaigns for analysis
  returns: Array of campaign summaries

campaign_details:
  purpose: Get full metrics for specific campaign
  parameters:
    id: campaign_id
  returns:
    - reply_rate: float
    - engaged_leads: int
    - send_count: int
    - campaign_name: string
    - duration: int (days)
```

**Data Mapping Challenge:**

Need to match EmailBison campaigns → Client names from transcripts.

**Approach Options:**
1. Manual mapping in agent prompt (list of campaign names → clients)
2. Fuzzy matching on campaign names
3. Airtable cross-reference (if campaign name in both systems)

⚠️ **DECISION POINT #17: Campaign-to-Client Mapping**
- **Question:** How should data-enricher match campaigns to clients?
- **Example:** EmailBison campaign "Foundation OH Regional" → Foundation client
- **Options:**
  1. Keyword matching (search campaign name for "Foundation")
  2. Manual lookup table in agent prompt
  3. Airtable as source of truth (campaign + client fields)
- **Your Input:** What's the relationship between EmailBison campaign names and client names?

---

### Airtable MCP Integration (Optional but Recommended)

**Connection Test:**
```bash
# Verify Airtable MCP is working
claude mcp list | grep airtable
# Should show: pipedream-airtable (connected)
```

**API Calls Needed:**

```yaml
list_records:
  purpose: Get all lead records
  parameters:
    baseId: "[Your Base ID]"
    tableId: "Leads"
  returns: Array of lead records

search_records:
  purpose: Find leads for specific campaign
  parameters:
    baseId: "[Your Base ID]"
    tableId: "Leads"
    searchTerm: "Foundation"
  returns: Matching records
```

**Data Structure Needed:**

⚠️ **DECISION POINT #18: Airtable Schema**
- **Question:** What fields exist in your Airtable Leads table?
- **Needed fields:**
  - Campaign Name (to match EmailBison)
  - Status (to identify "Meeting Booked")
  - Client Name
  - [Others?]
- **Your Input:** Can you share Airtable field names or screenshot?

---

### Typefully MCP Integration

**Connection Test:**
```bash
# Verify Typefully MCP is working
claude mcp list | grep typefully
# Should show: pipedream-typefully (connected)
```

**API Calls Needed:**

```yaml
create_draft:
  purpose: Push post to Typefully for manual scheduling
  parameters:
    content: string (post text)
    schedule_date: null (always manual)
    threadify: boolean (false for short, true for long)
    auto_retweet_enabled: false
    auto_plug_enabled: false
  returns: draft_id

get_scheduled_drafts:
  purpose: Check recent drafts for sequencing
  returns: Array of recent drafts with metadata
```

**Sequencing Logic:**

content-editor needs to check recent drafts to avoid:
- Back-to-back same post type
- Back-to-back same funnel stage
- Three+ Pain Points in a row

**Implementation:**
1. Call `get_scheduled_drafts` (get last 10)
2. Extract post_type and funnel_stage from each
3. Check new post against pattern rules
4. Adjust placement if needed

⚠️ **DECISION POINT #19: Sequencing Override**
- **Question:** Should content-editor auto-adjust sequencing or ask Mitchell?
- **Scenario:** Post is 9/10 but creates back-to-back case studies
- **Options:**
  1. Push to Typefully anyway (Mitchell decides)
  2. Hold post and suggest different one first
  3. Add note to editorial review
- **Your Input:** How much sequencing control do you want automated?

---

## Voice Calibration Process

**Goal:** Ensure content-writer produces posts indistinguishable from your manual writing.

**Process:**

### Step 1: Voice Sample Collection (Your Action Required)

⚠️ **DECISION POINT #20: Voice Sample Size**
- **Question:** How many existing posts should I analyze for voice patterns?
- **Recommendation:** 20-30 posts minimum (mix of types)
- **Sources:**
  - Your X/Twitter feed
  - LinkedIn posts
  - Email campaign copy (if representative)
- **Your Input:** Can you provide access or export?

### Step 2: Pattern Extraction

Analyze samples for:
- Sentence length distribution
- Paragraph structure
- Opening patterns ("Here's what...", "Stop doing...", etc.)
- Closing patterns (CTA styles)
- Profanity frequency and context
- Interest reference frequency (Kobe, Five Rings)
- Specific vs. vague language ratio
- Numbers/metrics usage

### Step 3: Test Generation

Generate 5 posts from real transcripts, show you:
1. Story post
2. Pain Point post
3. How-To post
4. Result post
5. Case Study post

### Step 4: Feedback Loop

You review each post:
- **Sounds like me:** Keep prompt as-is
- **Too formal:** Adjust voice guidelines (more casual)
- **Too casual:** Adjust voice guidelines (more authority)
- **Missing [X] pattern:** Add pattern to library

Iterate until 4/5 posts pass "sounds like me" test.

⚠️ **DECISION POINT #21: Voice Drift Monitoring**
- **Question:** How should we detect voice drift over time?
- **Options:**
  1. Monthly manual review (Mitchell checks 5 random posts)
  2. content-editor flags "voice consistency" issues
  3. Quarterly library updates based on new posts
- **Your Input:** How hands-on do you want to be with voice quality?

---

## Performance Optimization

### Token Budget Management

**Current Architecture:**

6 agents running sequentially = potential token bloat.

**Optimization Strategies:**

1. **Library Lazy Loading**
   - content-writer loads only relevant libraries per post type
   - Don't load all 4 libraries for every post

2. **Transcript Summarization** (If Needed)
   - If transcripts are very long (>10K tokens), content-ideator can summarize
   - Keep full transcript in private, work from summary

3. **Batch Processing**
   - Process 3-5 transcripts at a time (not 20+)
   - Prevents context overflow

4. **Agent Response Limits**
   - Each agent outputs concise summaries (not full transcripts)
   - Content briefs are compact (not essays)

**Target Performance:**

- Full pipeline (5 transcripts): < 30 minutes
- Per agent: < 5 minutes
- Total token usage: < 150K tokens per run

⚠️ **DECISION POINT #22: Performance vs. Quality Trade-off**
- **Question:** If pipeline is slow (>30 min for 5 transcripts), which to prioritize?
- **Options:**
  1. Speed (smaller batches, less context)
  2. Quality (full context, slower)
  3. Balanced (optimize libraries, keep full transcripts)
- **Your Input:** Is 30 minutes acceptable, or must it be faster?

---

## Error Handling & Resilience

### Common Failure Scenarios

**Scenario 1: Fireflies Returns No Transcripts**

```yaml
Cause: Date range has no calls
Handling:
  - transcript-extractor returns empty array
  - Pipeline displays: "No transcripts found for [date range]"
  - Suggests: Check date range or Fireflies connection
  - Does NOT continue to other stages
```

**Scenario 2: EmailBison API Error**

```yaml
Cause: Rate limit, auth failure, network issue
Handling:
  - data-enricher logs error
  - Pipeline asks: "Continue without campaign data?"
  - If yes: Skip data-enricher, continue to content-writer
  - If no: Halt and retry
```

**Scenario 3: Anonymization Detects Leak**

```yaml
Cause: Client name found in anonymized post
Handling:
  - content-anonymizer HALTS
  - Logs specific leak detected
  - Does NOT save to public directory
  - Requires manual intervention
```

**Scenario 4: All Posts Score <8**

```yaml
Cause: Content quality issues, prompt drift
Handling:
  - content-editor completes normally
  - Editorial review flags: "0 posts met 8+ threshold"
  - Suggests: Review content-writer prompt
  - Does NOT push to Typefully
```

⚠️ **DECISION POINT #23: Retry Strategy**
- **Question:** Should agents auto-retry on transient failures?
- **Options:**
  1. Retry once with exponential backoff
  2. Fail immediately, let user retry
  3. Retry N times, then fail
- **Your Input:** How should API failures be handled?

---

## Quality Assurance Checklist

Before launch, verify:

### Security Checks
- [ ] Private directory added to .gitignore
- [ ] No client names in public directory (manual search)
- [ ] content-editor cannot read private files (test tool restrictions)
- [ ] content-anonymizer enforces one-way flow (private → public only)

### Voice Checks
- [ ] Generated 5 test posts from real transcripts
- [ ] Mitchell approved 4/5 as "sounds like me"
- [ ] Profanity frequency matches natural usage
- [ ] Interest references feel organic (not forced)

### Functional Checks
- [ ] /generate-content runs end-to-end without errors
- [ ] Duplicate prevention works (reprocess same transcript IDs)
- [ ] Typefully drafts created successfully
- [ ] Weekly summary generated correctly

### Data Checks
- [ ] EmailBison data pulls correctly
- [ ] Airtable cross-reference works (if configured)
- [ ] Campaign-to-client matching accurate
- [ ] Metrics preserved correctly through anonymization

---

## Open Questions Summary

Here are all decision points that need your input:

### Critical (Block Implementation)
1. **Content Root Path** - Where should `/content/` live?
2. **Git Strategy** - How to handle private directory version control?
3. **EmailBison Data Structure** - What fields are available?
4. **Airtable Schema** - Base ID, table name, field names?
5. **Typefully Account** - Which account receives drafts?

### High Priority (Affect Quality)
6. **Voice Sample Access** - Can you provide existing posts for analysis?
7. **Client Name List** - Complete list of current clients to recognize?
8. **Team Member List** - Complete LeadGrow team to preserve?
9. **Geographic Specificity** - What location detail is safe to keep?
10. **Service Offering Detail** - How much tactical detail is shareable?

### Medium Priority (Affect UX)
11. **Date Range Default** - What does "last-week" mean?
12. **Batch Size** - How many transcripts per run?
13. **Pipeline Failure Handling** - Continue or halt on error?
14. **Campaign-to-Client Mapping** - How to match EmailBison → clients?
15. **Sequencing Override** - Auto-adjust or ask Mitchell?

### Lower Priority (Fine-Tuning)
16. **Fireflies Filter Strategy** - Filter by participant?
17. **Revenue Generalization** - Ranges vs. qualitative?
18. **Voice Drift Monitoring** - How hands-on with quality checks?
19. **Performance vs. Quality** - Acceptable if slower than 30 min?
20. **Retry Strategy** - Auto-retry API failures?

---

## Next Steps

1. **Mitchell answers decision points** (prioritize Critical and High Priority)
2. **Proceed to Phase 4:** Task Generation (detailed implementation tasks)
3. **Begin implementation:** Phase 1 foundation setup

---

**Document Status:** ⏳ Awaiting Mitchell's Input on Decision Points
**Next Phase:** 04_Task_Generation.md (once decisions made)
**Last Updated:** 2025-10-29
