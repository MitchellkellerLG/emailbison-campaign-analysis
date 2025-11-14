# Meeting Content Generator - Technical Specification

**Version:** 2.0 (Corrected Architecture)
**Date:** 2025-10-29
**Spec-Kit Phase:** 2 of 5 - Create Specifications
**Governed By:** [01_Constitution.md](01_Constitution.md)

---

## Document Purpose

This specification provides comprehensive technical details for implementing the Meeting Content Generator plugin with the corrected context-first architecture. Every component, data structure, interface, and behavior is explicitly defined to enable implementation without ambiguity.

**Key Architectural Change:** Content ideation happens with full client context BEFORE anonymization. This preserves specificity and enables higher quality content. Anonymization occurs as a dedicated step before publication.

---

## System Architecture

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER TRIGGER                                  │
│             /generate-content [date-range]                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: TRANSCRIPT EXTRACTION (PRIVATE)                        │
│  Agent: transcript-extractor                                     │
│  Input: Date range or transcript IDs                             │
│  Tools: Fireflies MCPs, Read, Write                              │
│  Output: /content/private/raw-transcripts/*.md                   │
│  Contains: Full client names, exact metrics, complete context    │
│  Skill: transcript-tracker (prevent duplicates)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: CONTENT IDEATION (PRIVATE, FULL CONTEXT)              │
│  Agent: content-ideator                                          │
│  Input: Raw transcripts with real client names                  │
│  Tools: Read, Write                                              │
│  Output: /content/private/content-ideas-queue.md                 │
│  Contains: Briefs with real client context for accuracy          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: CAMPAIGN DATA ENRICHMENT (PRIVATE)                    │
│  Agent: data-enricher                                            │
│  Input: None (autonomous pull from EmailBison/Airtable)         │
│  Tools: EmailBison MCPs, Airtable MCPs, Read, Write             │
│  Output: /content/private/authority-statements.md                │
│  Contains: Campaign data with real client names                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: CONTENT DRAFTING (PRIVATE, FULL CONTEXT)              │
│  Agent: content-writer                                           │
│  Input: Content briefs with real client context                 │
│  Tools: Read, Write                                              │
│  Libraries: brand-voice, post-type-criteria, successful-patterns│
│  Output: /content/private/drafts/*.md                            │
│  Contains: Posts with real client names (pre-anonymization)      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: ANONYMIZATION (PUBLIC-READY)                          │
│  Agent: content-anonymizer                                       │
│  Input: Pre-anonymized drafts from private/drafts/              │
│  Tools: Read, Write                                              │
│  Transforms: Client names → industry descriptors                 │
│              Exact revenue → ranges/qualitative                  │
│              Removes all identifying details                     │
│  Output: /content/public/shortform/* & /longform/*               │
│  Contains: Anonymized, publication-ready posts                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: EDITORIAL REVIEW & PUBLISHING                          │
│  Agent: content-editor                                           │
│  Input: Anonymized posts from public directories                │
│  Tools: Read, Write, Typefully MCPs                              │
│  Actions:                                                        │
│    - Score posts (Entertainment 30%, Uniqueness 25%,             │
│                   Criteria 30%, Technical 15%)                   │
│    - Verify anonymization completeness                           │
│    - If 8+: Push to Typefully as draft                           │
│    - If <8: Document critique, flag for rewrite                  │
│  Output: Editorial reviews + Typefully drafts                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               MANUAL REVIEW (Mitchell)                           │
│        Review Typefully drafts → Schedule manually               │
└─────────────────────────────────────────────────────────────────┘
```

**Security Architecture:**
- **Private Zone** (`/content/private/`): Contains client-identifying information. Never committed to public repos.
- **Public Zone** (`/content/public/`): Fully anonymized, safe for sharing/version control.
- **One-Way Flow**: Data moves private → public, never reverse.
- **Verification**: Each agent validates it's reading from correct directory.

---

## Component Specifications

### 1. Plugin Manifest

**File:** `.claude/plugins/meeting-content-generator/.claude-plugin/plugin.json`

**Structure:**
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
    "privateContentPath": "/content/private",
    "publicContentPath": "/content/public",
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

---

### 2. Sub-Agent: transcript-extractor

**File:** `agents/transcript-extractor.md`

**Purpose:** Pull raw transcripts from Fireflies with complete context. NO anonymization.

**Interface:**
```yaml
Input:
  - date_range: string (format: "YYYY-MM-DD to YYYY-MM-DD" or "last-week")
  - transcript_ids: array<string> (optional, specific IDs to process)

Output:
  - files: array<RawTranscript>
    - path: /content/private/raw-transcripts/YYYY-MM-DD-[call-type]-[topic].md
    - metadata: { original_id, call_type, participants, duration, extraction_timestamp }
  - updated: /content/private/processed-transcript-ids.txt

Dependencies:
  - MCPs: fireflies (get_transcripts, search, fetch)
  - Skill: transcript-tracker
  - Tools: Read, Write
```

**Call Type Classification:**

```yaml
Sales:
  - Indicators: "discovery call", "strategy call", "pricing discussion", new prospect
  - Topic extraction: Industry + pain point + offer discussed

Client Sync:
  - Indicators: existing client names (Foundation, TeachAid, Bitcoin Magazine, etc.)
  - Topic extraction: Campaign name + performance + next steps

Internal Strategy:
  - Indicators: only LeadGrow team members present
  - Topic extraction: Topic discussed (Platform Migration, AI Workflows, etc.)

Partner:
  - Indicators: Chris Booth, Ron Rogers, Sterling Proffer, external collaborators
  - Topic extraction: Partnership name + topic

Consultant:
  - Indicators: Chris Booth giving advice, strategy sessions
  - Topic extraction: Topic area (CRM Strategy, Sales Funnel, etc.)

Training:
  - Indicators: Harish, Nikos, Rashi, Ahmer team calls
  - Topic extraction: Primary focus (Team Alignment, Performance Reviews, etc.)
```

**Output File Format:**

```markdown
---
original_transcript_id: 01K7SNGDYNCEWNAYX1VTFVAYRD
date: 2025-10-23
call_type: Client Sync
duration_minutes: 38
participants:
  - Mitchell Keller (LeadGrow)
  - Sarah Johnson (Foundation, Regional Director)
  - Tom Williams (Foundation, Technology Coordinator)
extraction_timestamp: 2025-10-29T14:32:00Z
---

# [Call Type]: [Topic]

## Full Transcript

[Complete transcript with all speakers, timestamps, exact quotes]

## Key Moments

### Strategic Insights
- [Timestamp] Mitchell: "List is the message. Foundation's targeting Ohio regional directors specifically, not just 'education leaders.'"
- [Timestamp] Sarah: "We're seeing 12% reply rate now, up from 3% with the generic approach."

### Client Details
- Company: Foundation (education nonprofit)
- Contact: Sarah Johnson, Regional Director, Ohio
- Pipeline: $500,000 in qualified opportunities
- Campaign: Ohio Regional Champions program

### Tactical Details
- Targeting: Regional SST directors in Ohio K-12 districts
- Messaging: Situation-based (Ohio-specific pain points around SST tracking compliance)
- Infrastructure: 5 inboxes, 25 domains, warm-up complete
- Results: 20 meetings booked in 3 weeks, 12% reply rate

### Personal/Cultural Moments
- Mitchell mentioned nephew's graduation
- Discussion of Kobe mindset in campaign planning
- Sarah's team struggles with CRM adoption

---

**NOTES:**
- This file contains client-identifying information
- Storage: /content/private/ ONLY
- Never commit to public repos
- Used by content-ideator for full context
```

**Verification Checklist (Embedded in Prompt):**
```markdown
Before saving output, verify:
- [ ] Full transcript captured with exact quotes
- [ ] All participants listed with real names and titles
- [ ] Client company name preserved exactly
- [ ] Exact metrics/revenue included
- [ ] Key moments extracted for content ideation
- [ ] File saved to /content/private/raw-transcripts/
- [ ] processed-transcript-ids.txt updated
- [ ] NO anonymization applied (that comes later)
```

---

### 3. Sub-Agent: content-ideator

**File:** `agents/content-ideator.md`

**Purpose:** Identify content opportunities using FULL client context (real names, exact metrics).

**Interface:**
```yaml
Input:
  - source: /content/private/raw-transcripts/ (all .md files with full context)
  - reference: /content/private/authority-statements.md (optional, if enricher ran)

Output:
  - file: /content/private/content-ideas-queue.md
  - summary: { ideas_generated, high_priority_count, post_type_distribution }

Dependencies:
  - Tools: Read, Write
```

**Priority Scoring Matrix:**

```yaml
High Priority (Immediate drafting):
  criteria:
    - Timely (relates to recent event, trend, or business milestone)
    - Unique angle (not generic advice, has fresh perspective)
    - Strong proof (specific metric, clear result, or compelling story)
    - Aligns with business goals (drives DM conversations, showcases expertise, positions LeadGrow)
    - Rich context available (real client name enables specific storytelling)

  examples:
    - "Foundation (education nonprofit) 12% reply rate, Ohio regional strategy" (timely + proof + specific)
    - "Mitchell's response to 'cold email is dead' objection in TeachAid call using Kobe mindset" (unique + alignment)
    - "Bitcoin Magazine went 0 to $40K pilot by targeting event attendees specifically" (proof + specific)

Medium Priority (Queue for later):
  criteria:
    - Evergreen (always relevant, not time-sensitive)
    - Good proof (solid but not exceptional metrics)
    - Solid angle (valuable but needs stronger hook)

  examples:
    - "How to validate your ICP before spending on data" (evergreen how-to)
    - "8% booking rate on generic SaaS campaign" (good but not outlier)
    - "Mitchell's daily routine for managing multiple clients" (solid personal content)

Low Priority (Nice-to-have):
  criteria:
    - Generic (advice available elsewhere)
    - Weak proof (no metrics or vague results)
    - Unclear angle (needs significant rework to be compelling)

  examples:
    - "Consistency is important in outreach" (platitude without unique lens)
    - "Client campaign went well" (vague, no specifics)
    - "Use AI tools for research" (generic, no differentiator)
```

**Post Type Mapping Logic:**

```yaml
Top of Funnel (Awareness / Personality):

  Stories:
    triggers:
      - Personal challenge with emotional arc
      - Relatable moment + business lesson
      - Vulnerable admission + growth
    examples:
      - "Mitchell's nephew asked about his job, made him realize simplicity matters"
      - "Failed Foundation campaign first attempt taught more than TeachAid success"
      - "Climbing route analogy to Bitcoin Magazine's event strategy"

  Shallow Ideas:
    triggers:
      - Platitude or common saying mentioned in call
      - Broadly applicable insight
      - Opportunity for interest-based lens (Kobe, Five Rings, etc.)
    examples:
      - "'Just be yourself' is terrible advice. Here's why via Vagabond."
      - "Everyone says 'know your ICP.' Nobody says how. Foundation example shows Art of War approach."

  Personal Life:
    triggers:
      - Family update (nephews, wife)
      - Fitness milestone (lifting, running, climbing)
      - Life event (no business tie-in needed)
    examples:
      - "Hit new deadlift PR. That's it."
      - "Nephew graduated today. Proud uncle moment."

Mid Funnel (Expertise / Trust):

  Pain Points:
    triggers:
      - Objection raised in sales call (captured in transcript)
      - Common misconception corrected
      - Problem Mitchell sees repeatedly across clients
    examples:
      - "Foundation's reply rate sucked because their list was too broad (superintendents, principals, directors)"
      - "Stop blaming 'email fatigue.' TeachAid fixed relevance, replies came."
      - "You don't have a copywriting problem. Bitcoin Magazine had targeting problem."

  How-Tos / Checklists:
    triggers:
      - Tactical advice given in call (specific steps)
      - Process explained step-by-step
      - Framework mentioned multiple times
    examples:
      - "Here's how Foundation validated catch-all emails before launch"
      - "3-step process for finding SST director contacts (Foundation example)"
      - "Our domain warm-up protocol (exact settings from TeachAid setup)"

  Results / Proof:
    triggers:
      - Strong campaign metrics (8%+ reply, 50+ engaged)
      - Quick wins (fast turnaround)
      - Unexpected success (outlier performance)
    examples:
      - "Foundation: 12% reply rate, Ohio regional targeting"
      - "Bitcoin Magazine: 53 meetings booked from event attendee list"
      - "TeachAid: 0 to 20 meetings in 3 weeks (regional champions approach)"

Bottom Funnel (Conversion):

  Case Studies:
    triggers:
      - Multi-call client journey visible in transcripts
      - Complex problem solved with sophisticated approach
      - Clear transformation with metrics (before → after)
    examples:
      - "How Foundation went from 3% to 12% reply rate (Ohio regional strategy)"
      - "Bitcoin Magazine pilot: Event targeting to $40K contract"
      - "TeachAid regional champion strategy: SST directors in Ohio"

  Giveaways:
    triggers:
      - Complete system/framework mentioned (Clay workflow, scoring system)
      - High-value asset Mitchell offers to share
      - Requires approval before drafting
    examples:
      - "Our complete lead scoring system (Foundation uses this for SST directors)"
      - "Clay workflow for database discovery (used in Bitcoin Magazine event targeting)"
```

**Content Brief Template:**

```markdown
### [Content Idea Title - Specific with Real Context]

**Post Type:** [Stories / Shallow Ideas / Personal Life / Pain Points / How-Tos / Results / Case Studies / Giveaways]
**Funnel Stage:** [Top / Mid / Bottom]
**Priority:** [High / Medium / Low] - [Reasoning with specific context]
**Source Transcript:** [Filename]
**Client Context:** [Real client name for writer's understanding]
**Extraction Date:** [YYYY-MM-DD]

**Hook / Angle:**
[1-2 sentences with SPECIFIC details - use real client name, exact metrics]
Example: "Foundation went from 3% to 12% reply rate in 3 weeks. Same offer. Different list."

**Key Points:**
- [Specific point 1 with real context: "Ohio regional SST directors, not generic 'education leaders'"]
- [Specific point 2 with exact metric: "$500K pipeline from 20 meetings"]
- [Specific point 3 with tactical detail: "5 inboxes, 25 domains, situation-based messaging"]

**Authority Proof:**
[Real metrics from transcript]
Example: "Foundation: 12% reply rate, 20 meetings booked, $500K pipeline. Client: Sarah Johnson confirmed these numbers on 10/23 call."

**CTA Strategy:**
[DM / Comment '[KEYWORD]' / YouTube search 'Mitchell Keller [topic]' / Link in bio / None]
[Include reasoning for CTA choice]

**Interest / Reference Opportunity:**
[If applicable: specific moment from transcript]
Example: "Mitchell referenced Kobe's preparation mindset when explaining Foundation's research phase"

**Anonymization Notes:**
[Instructions for content-anonymizer agent]
Example:
- Foundation → "Education nonprofit selling student success tools to K-12 districts"
- Sarah Johnson → "Client Regional Director"
- $500K → "significant six-figure pipeline"
- Ohio → keep (not identifying, adds specificity)

**Notes / Special Considerations:**
[Any edge cases, approval needed, etc.]

---
```

**Cadence Balancing Logic:**

```python
# Pseudocode for maintaining funnel mix
def prioritize_queue(all_ideas):
    # Target: 60% top, 30% mid, 10% bottom
    # 48 shortform + 8 longform per month = 56 total
    # Top: ~34 posts, Mid: ~17 posts, Bottom: ~5 posts

    target_distribution = {
        "top": 34,
        "mid": 17,
        "bottom": 5
    }

    # Sort by priority within each funnel stage
    high_priority = [idea for idea in all_ideas if idea.priority == "High"]

    # Balance across funnel stages
    selected = {
        "top": select_top_n(high_priority, stage="top", limit=target_distribution["top"]),
        "mid": select_top_n(high_priority, stage="mid", limit=target_distribution["mid"]),
        "bottom": select_top_n(high_priority, stage="bottom", limit=target_distribution["bottom"])
    }

    return selected
```

**Verification Checklist:**
```markdown
Before saving content ideas queue:
- [ ] All ideas include REAL client context (names, exact metrics)
- [ ] Hooks are specific (not "a client" - say "Foundation")
- [ ] Key points include tactical details from transcript
- [ ] Authority proof cites exact metrics from calls
- [ ] Anonymization notes provided for writer
- [ ] Funnel stages assigned correctly
- [ ] Priority justified with specific reasoning
- [ ] Queue organized: High priority → Medium → Low
- [ ] File saved to /content/private/content-ideas-queue.md
```

---

### 4. Sub-Agent: data-enricher

**File:** `agents/data-enricher.md`

**Purpose:** Pull campaign performance data and create authority statements (with REAL client names for context).

**Interface:**
```yaml
Input:
  - filter: string (optional, "all" or "last-30-days")

Output:
  - appended_to: /content/private/authority-statements.md
  - summary: { campaigns_analyzed, exceptional_count, outliers_flagged }

Dependencies:
  - MCPs: emailbison (list_campaigns, campaign_details, get_scheduled_emails, list_leads)
  - MCPs: airtable (list_records, search_records)
  - Tools: Read, Write
```

**Performance Thresholds (Explicit):**

```yaml
Small Volume Campaigns (<5,000 contacts):
  exceptional_criteria:
    - reply_rate >= 12% AND engaged_leads >= 50
    - OR booking_rate >= 8%
    - OR meetings_booked >= 20

  outlier_criteria:
    - reply_rate >= 20%  # Immediate showcase
    - OR booking_rate >= 12%

Large Volume Campaigns (>=5,000 contacts):
  exceptional_criteria:
    - engaged_leads >= 50 AND reply_rate >= 8%
    - AND campaign_duration >= 4 weeks

  outlier_criteria:
    - reply_rate >= 15%
    - OR engaged_leads >= 200

Universal Outliers (Any Volume):
  - reply_rate >= 25%  # Showcase immediately regardless of volume
  - booking_rate >= 15%
  - pipeline_value >= $500K (if data available)
```

**Authority Statement Format (with Real Client Names):**

```markdown
### [Industry] - [Offer Type] Campaign

**Client:** [Real Company Name]
**Contact:** [Real Name, Title]
**Target Persona:** [Role/title]
**Campaign Theme:** [Primary approach]
**Volume:** [Exact contact count]

**Approach:**
[2-3 sentences with SPECIFIC tactical details - use real context for accuracy]
Example: "Foundation targeted Ohio regional SST directors specifically (not generic education leaders). Situation-based messaging around SST tracking compliance pain points. Mitchell's team built 273 targeted contacts from LinkedIn + Clay enrichment."

**Results:**
- Reply Rate: 12.3%
- Engaged Leads: 67
- Meetings Booked: 20
- Pipeline: $487,000
- Duration: 3 weeks
- Unique Element: Regional champion strategy (Ohio-specific credibility)

**Content Snippet (for anonymization later):**
"Helped an education nonprofit selling student success tools to K-12 districts book 20 meetings by targeting regional directors in Ohio instead of casting wide net to all education leaders."

**Categorization:**
- Industry: Education (K-12, Nonprofit)
- Offer: Assessment / Trial
- Persona: Regional Directors / District Admins
- Result Type: High Reply Rate + Quick Wins
- Theme: Situation-Based Messaging

**Anonymization Instructions:**
- Foundation → "Education nonprofit"
- Sarah Johnson → "Client Regional Director"
- $487,000 → "significant six-figure pipeline"
- Ohio → keep (adds specificity, not identifying)

---
```

**Verification Checklist:**
```markdown
Before appending authority statement:
- [ ] Real client name included (for writer's context)
- [ ] Exact metrics from EmailBison
- [ ] Airtable cross-reference attempted for booking data
- [ ] All 5 categorization tags assigned
- [ ] Content snippet pre-written (anonymization template)
- [ ] Anonymization instructions explicit
- [ ] File saved to /content/private/authority-statements.md
```

---

### 5. Sub-Agent: content-writer

**File:** `agents/content-writer.md`

**Purpose:** Draft posts with Mitchell's voice using FULL client context for accuracy and specificity.

**Interface:**
```yaml
Input:
  - ideas: /content/private/content-ideas-queue.md (briefs with real client context)
  - libraries:
      - /content/libraries/brand-voice.md
      - /content/libraries/post-type-criteria.md
      - /content/libraries/successful-patterns.md

Output:
  - files: array<PreAnonymizedDraft>
    - path: /content/private/drafts/YYYY-MM-DD-[title-slug].md
    - contains: Posts with real client names (pre-anonymization)
  - summary: { posts_drafted, post_type_breakdown }

Dependencies:
  - Tools: Read, Write
```

**Key Instruction:**

> **IMPORTANT:** You are writing with FULL client context. Use real client names, exact metrics, and specific details. This draft will be anonymized by content-anonymizer agent before publication. Your job is to write the BEST possible post using all available context. Accuracy and specificity matter more than anonymization at this stage.

**Voice Characteristics with Examples:**

```yaml
Conversational:
  definition: "Write like DMing a friend who's smart about business"
  examples:
    - bad: "Organizations frequently encounter challenges with lead generation efficacy."
    - good: "Foundation's reply rate sucked. 3%. Their targeting was too broad."

Punchy:
  definition: "Short sentences. Fragments work. Cut ALL fluff."
  examples:
    - bad: "I think it's important to mention that we should probably consider the fact that Foundation's list might need some work."
    - good: "Foundation's list was garbage. Fixed it. 12% reply rate now."

Specific:
  definition: "Real names, exact numbers, tactical details"
  examples:
    - bad: "We got good results for a client recently."
    - good: "Foundation: 12% reply rate, 20 meetings, $487K pipeline. Ohio regional strategy."

Casual Authority:
  definition: "Confident without arrogance. You've done this 1000x."
  examples:
    - bad (arrogant): "I'm the only one who understands targeting properly."
    - bad (timid): "In my humble opinion, this might work..."
    - good: "Here's what actually works. Tried it on Foundation, TeachAid, Bitcoin Magazine."

Occasionally Profane:
  definition: "Shit, damn - when it adds punch. Not every post."
  examples:
    - good use: "Foundation's targeting was shit. Superintendents, principals, directors - that's 3 different pain points. Pick one."
    - bad use: Profanity in case studies or giveaways (unprofessional)
```

**Post Type Execution (Stories Example):**

```yaml
Stories:
  structure:
    1. Hook: Start with specific moment (use real context)
    2. Build: Context, tension (real client name adds authenticity)
    3. Realization: Turning point
    4. Business Tie-In: Light touch connection
    5. No Hard CTA

  length: 80-150 words

  example_with_full_context:
    "Sarah from Foundation asked me a great question yesterday.

    'Why does Ohio regional targeting work better than going national?'

    Simple.

    Regional SST directors in Ohio share pain points. State compliance rules. Budget cycles. Peer networks.

    National 'education leaders' share nothing except industry.

    That's the difference between 3% and 12% reply rate.

    Men, not markets."

  anonymization_notes:
    - "Sarah from Foundation" → "A client" or "Education nonprofit founder"
    - "Ohio" → keep (adds specificity, not identifying)
    - Keep metrics exact

  verification:
    - [ ] Opens with specific moment using real context
    - [ ] Emotion or tension present
    - [ ] Business connection clear
    - [ ] No hard CTA
    - [ ] Sounds like Mitchell having real conversation
    - [ ] File saved to /content/private/drafts/
```

**Frontmatter Metadata (Pre-Anonymized Drafts):**

```yaml
format:
  ---
  title: Foundation Ohio Regional Strategy Success
  post_type: Story
  funnel_stage: Top
  priority: High
  source_idea_id: content-ideas-queue.md#idea-47
  client_context: Foundation (Sarah Johnson, Regional Director)
  draft_date: 2025-10-29
  drafted_by: content-writer
  word_count: 127
  libraries_referenced:
    - brand-voice.md
    - post-type-criteria.md
  status: pending_anonymization
  anonymization_required: true
  anonymization_notes: |
    - Foundation → "Education nonprofit"
    - Sarah Johnson → "Client" or remove
    - $487K → "significant pipeline"
    - Ohio → keep (not identifying)
  ---

  [Post content with real client names follows...]
```

**Master Verification Checklist:**

```markdown
Before saving draft:
Voice & Style:
- [ ] Conversational (sounds like Mitchell talking)
- [ ] Punchy (short sentences, no fluff)
- [ ] Specific (real names, exact metrics used)
- [ ] Casual authority (confident, not arrogant)
- [ ] Profanity appropriate if used

Content Quality:
- [ ] Hook uses real context (client name adds authenticity)
- [ ] Details are accurate (exact metrics from transcripts)
- [ ] Story is specific (not "a client" - say "Foundation")
- [ ] Meets post-type criteria

Technical:
- [ ] Frontmatter includes client_context field
- [ ] anonymization_notes field populated
- [ ] File saved to /content/private/drafts/
- [ ] Real client names preserved (anonymization comes next)
```

---

### 6. Sub-Agent: content-anonymizer

**File:** `agents/content-anonymizer.md`

**Purpose:** Systematically anonymize pre-written drafts for publication.

**Interface:**
```yaml
Input:
  - source: /content/private/drafts/*.md (posts with real client names)

Output:
  - files: array<AnonymizedPost>
    - shortform: /content/public/shortform/[type]/YYYY-MM-DD-[title-slug].md
    - longform: /content/public/longform/[type]/YYYY-MM-DD-[title-slug].md
  - summary: { posts_anonymized, transformations_made }

Dependencies:
  - Tools: Read, Write
```

**Anonymization Rules (Explicit Transformations):**

| Data Type | Transformation | Example |
|-----------|---------------|---------|
| Client Company Names | "[industry/type] company/nonprofit selling [product] to [audience]" | Foundation → "Education nonprofit selling student success tools to K-12 districts" |
| Client Personal Names | Remove or genericize | Sarah Johnson → "Client Regional Director" or just remove |
| Specific Revenue | Ranges or qualitative | $487,000 → "significant six-figure pipeline" |
| Small Meeting Counts | Ranges | 3 meetings → "several meetings" |
| Large Meeting Counts | Keep exact if >10 | 20 meetings → "20 meetings" (not identifying) |
| Email Addresses | Remove entirely | sarah@foundation.org → [removed] |
| Domains/URLs | Remove or genericize | foundation.org → remove |
| Geographic Specifics | Keep if not identifying | Ohio → keep (state is fine, city might be identifying) |
| Tool Names (Client's) | Generic categories | Foundation's HubSpot → "their CRM" |
| Tool Names (LeadGrow's) | Keep exact | EmailBison, Clay, Apollo → keep |
| Metrics (%) | Keep exact | 12.3% reply rate → "12% reply rate" (round if needed) |
| Mitchell's Quotes | Keep verbatim | "List is the message" → "List is the message" |
| LeadGrow Team | Keep names | Harish, Nikos, Rashi → keep |

**Transformation Process:**

```yaml
Step 1: Read Pre-Anonymized Draft
  - Load from /content/private/drafts/
  - Read frontmatter anonymization_notes
  - Identify all client-identifying information

Step 2: Apply Systematic Transformations
  - Client company name → industry descriptor
  - Personal names → roles or remove
  - Exact revenue → ranges
  - Email addresses → remove
  - Follow rules table above

Step 3: Verify Anonymization
  - Search for client company name (should be 0 matches)
  - Search for personal names (should be 0 matches)
  - Search for email addresses (should be 0 matches)
  - Check revenue figures (should be ranges)
  - Verify content still compelling after anonymization

Step 4: Update Frontmatter
  - Remove client_context field
  - Remove anonymization_notes field
  - Add anonymization_log field (what was transformed)
  - Update status: pending_anonymization → anonymized

Step 5: Save to Public Directory
  - Determine post type from frontmatter
  - Save to /content/public/shortform/[type]/ or /longform/[type]/
  - Never save to /content/private/ (one-way flow)
```

**Example Transformation:**

**Before (Private Draft):**
```markdown
---
title: Foundation Ohio Regional Strategy Success
client_context: Foundation (Sarah Johnson)
anonymization_notes: |
  - Foundation → "Education nonprofit"
  - Sarah Johnson → remove
  - $487K → "significant pipeline"
---

Sarah from Foundation asked me a great question yesterday.

"Why does Ohio regional targeting work better than going national?"

Simple.

Regional SST directors in Ohio share pain points. State compliance. Budget cycles.

National 'education leaders' share nothing except industry.

Foundation went from 3% to 12% reply rate. $487K pipeline. 20 meetings.

That's the difference.

Men, not markets.
```

**After (Public, Anonymized):**
```markdown
---
title: Regional Targeting Strategy Success
post_type: Story
status: anonymized
anonymization_log:
  - "Foundation → Education nonprofit"
  - "Sarah Johnson → removed (client privacy)"
  - "$487K → significant six-figure pipeline"
---

A client asked me a great question yesterday.

"Why does regional targeting work better than going national?"

Simple.

Regional directors in Ohio share pain points. State compliance. Budget cycles.

National 'industry leaders' share nothing except industry.

Education nonprofit went from 3% to 12% reply rate. Significant six-figure pipeline. 20 meetings.

That's the difference.

Men, not markets.
```

**Verification Checklist:**

```markdown
Before saving anonymized post:
- [ ] Client company name removed (search returns 0)
- [ ] Personal names removed or genericized (search returns 0)
- [ ] Email addresses removed (search returns 0)
- [ ] Revenue figures generalized (no exact $ amounts)
- [ ] Geographic specifics appropriate (state OK, city/address NO)
- [ ] Content still specific and compelling after anonymization
- [ ] Mitchell's voice preserved
- [ ] LeadGrow tools/team names preserved
- [ ] anonymization_log field populated in frontmatter
- [ ] File saved to /content/public/shortform/ or /longform/
- [ ] client_context field removed from frontmatter
```

**Error Handling:**

```yaml
If Anonymization Pattern Not Found:
  - Log warning: "No anonymization notes found in frontmatter"
  - Apply conservative defaults (remove all proper nouns)
  - Flag post for manual review

If Content Becomes Generic After Anonymization:
  - Log warning: "Anonymization removed too much context"
  - Suggest keeping more specifics (state names, industry details)
  - Flag for Mitchell's review

If Identifying Information Detected After Anonymization:
  - HALT: Do not save to public directory
  - Log error with specific identifying information found
  - Require manual intervention before proceeding
```

---

### 7. Sub-Agent: content-editor

**File:** `agents/content-editor.md`

**Purpose:** Score anonymized posts, verify no leaks, publish 8+ to Typefully.

**Interface:**
```yaml
Input:
  - drafted_posts: /content/public/shortform/*/* and /content/public/longform/*/*
  - criteria: /content/libraries/post-type-criteria.md

Output:
  - reviews: /content/public/editorial-reviews/YYYY-MM-DD-review-log.md
  - typefully_drafts: Created via MCP for posts scoring 8+
  - updated_frontmatter: Posts updated with scores and editor notes

Dependencies:
  - MCPs: typefully (create_draft, get_scheduled_drafts)
  - Tools: Read, Write
```

**Scoring Rubric (100 points → 1-10 scale):**

```yaml
Entertainment (30 points):
  Hook Effectiveness (10 points):
    - 10: Stopped me immediately
    - 7-9: Strong hook
    - 4-6: Decent
    - 1-3: Weak
    - 0: No hook

  Feed-Worthiness (10 points):
    - 10: Would read scrolling casually
    - 7-9: Interesting enough to pause
    - 4-6: Might read if slow day
    - 1-3: Probably skip
    - 0: Definitely skip

  Memorable Moments (10 points):
    - 10: Will remember tomorrow, quotable
    - 7-9: Has standout line
    - 4-6: Solid but not memorable
    - 1-3: Forgettable
    - 0: Generic

  Deductions:
    - Boring hook: -5
    - No memorable moments: -5

Uniqueness (25 points):
  Fresh Angle (10 points):
    - 10: Never seen this take
    - 7-9: Familiar topic, fresh perspective
    - 4-6: Decent but common
    - 1-3: Heard this 100 times
    - 0: Pure platitude

  Mitchell-Specific (10 points):
    - 10: Only Mitchell could write this
    - 7-9: Clearly Mitchell's perspective
    - 4-6: Could be Mitchell or similar
    - 1-3: Could be any cold email person
    - 0: Could be anyone

  Adds Value (5 points):
    - 5: Contributes new insight
    - 3-4: Solid contribution
    - 1-2: Adds little
    - 0: Pure noise

  Deductions:
    - Generic advice: -10
    - Predictable: -5

Criteria Alignment (30 points):
  (Type-specific - see post-type-criteria.md)

  Stories: Emotional connection + relatable + light business tie
  Pain Points: Bold hook + empathy + authority + CTA
  How-Tos: Actionable + specific + doesn't give full system
  Case Studies: Situation → Approach → Results, sophisticated
  Results: Metric leads + brief explanation + undersells

  Deductions:
    - Missing required element: -10 per element
    - Wrong structure: -10

Technical (15 points):
  Voice Consistency (5 points):
    - 5: Perfect Mitchell voice
    - 3-4: Mostly Mitchell
    - 1-2: Some issues
    - 0: Off-voice

  Proper Length (3 points):
    - 3: Within range
    - 1-2: Slightly off
    - 0: Way off

  Formatting Clean (3 points):
    - 3: Perfect
    - 1-2: Minor issues
    - 0: Mess

  Anonymization Verified (2 points):
    - 2: No leaks found
    - 0: Identifying information present

  CTA Appropriate (2 points):
    - 2: Fits funnel stage
    - 1: Slightly off
    - 0: Wrong or missing

  Deductions:
    - Vague claims: -2
    - Too salesy: -2
```

**Anonymization Verification (Critical):**

```markdown
Before scoring, perform final anonymization check:

Search for Common Leaks:
- [ ] Search for client company names from recent transcripts
- [ ] Search for personal names (Sarah, Tom, etc.)
- [ ] Search for email patterns (@foundation.org, etc.)
- [ ] Search for exact revenue ($487,000, $40K, etc.)
- [ ] Search for URLs/domains (foundation.org, etc.)

If ANY identifying information found:
- REJECT post (score 0/10)
- Document leak in review
- Return to content-anonymizer for fix
- Do NOT push to Typefully
```

**Typefully Publishing Logic:**

```yaml
Threshold: Score must be 8+ (80 points or higher)

Pre-Publish Actions:
  1. Verify score 8+
  2. Run final anonymization check (MUST PASS)
  3. Check recent drafts for sequencing conflicts
  4. Verify funnel mix balanced

Push to Typefully:
  mcp__typefully__create_draft(
    content: [post text without frontmatter],
    schedule_date: null,  # Always null - Mitchell schedules manually
    threadify: false for shortform, true for longform,
    auto_retweet_enabled: false,
    auto_plug_enabled: false
  )

Post-Publish Actions:
  - Update post frontmatter with typefully_draft_id
  - Log in weekly summary
  - Update funnel mix tracker
```

**Weekly Summary Report Format:**

```markdown
# Weekly Content Review Summary

**Date Range:** [YYYY-MM-DD] - [YYYY-MM-DD]
**Review Date:** [YYYY-MM-DD]

## Overview
- Posts Reviewed: X
- Posts Approved (8+): X (XX%)
- Posts Flagged (<8): X
- Average Score: X.X/10

## Security Audit
- Anonymization Checks Performed: X
- Leaks Detected: X
- Posts Rejected for Privacy: X

## Approved for Publishing
[Table of 8+ posts with scores]

## Needs Revision
[Table of <8 posts with issues]

## Top Patterns
[What worked this week]

## Recommendations
[Actionable improvements for next week]

---
**Prepared by:** content-editor
**Date:** [YYYY-MM-DD]
```

---

### 8. Skill: transcript-tracker

**File:** `skills/transcript-tracker/SKILL.md`

**Purpose:** Prevent duplicate transcript processing

**File Location:** `/content/private/processed-transcript-ids.txt`

**Format:**
```
# Processed Fireflies Transcript IDs
# Format: [ID] | [Date Processed] | [Call Type] | [Brief Topic]

01K7SNGDYNCEWNAYX1VTFVAYRD | 2025-10-26 | Client Sync | Foundation Ohio Regional
01K8BFEDRGVJ8A1VXNQEB7CDC7 | 2025-10-26 | Internal Strategy | Performance Reviews
```

**Logic:**
```python
def check_duplicates(transcript_ids_to_process):
    processed_file = read_file("/content/private/processed-transcript-ids.txt")

    existing_ids = [line.split("|")[0].strip() for line in processed_file.split("\n")
                    if line.strip() and not line.startswith("#")]

    new_ids = [id for id in transcript_ids_to_process if id not in existing_ids]
    already_processed = [id for id in transcript_ids_to_process if id in existing_ids]

    return {"new_ids": new_ids, "already_processed": already_processed}
```

---

### 9. Command: /generate-content

**File:** `commands/generate-content.md`

**Purpose:** Orchestrate full 6-agent pipeline

**Syntax:**
```bash
/generate-content [date-range|transcript-ids]

Examples:
  /generate-content last-week
  /generate-content 2025-10-19 to 2025-10-26
  /generate-content 01K7SNGDYNCEWNAYX1VTFVAYRD
```

**Execution Workflow:**

```yaml
Step 1: Invoke transcript-extractor
  - Pass date range or IDs
  - Output: Raw transcripts in /content/private/raw-transcripts/

Step 2: Invoke content-ideator
  - Input: Raw transcripts (full context)
  - Output: Content briefs in /content/private/content-ideas-queue.md

Step 3: Invoke data-enricher
  - Autonomous pull from EmailBison/Airtable
  - Output: Authority statements in /content/private/authority-statements.md

Step 4: Invoke content-writer
  - Input: Top 10-15 high-priority briefs
  - Output: Pre-anonymized drafts in /content/private/drafts/

Step 5: Invoke content-anonymizer
  - Input: All drafts from private/drafts/
  - Output: Anonymized posts in /content/public/shortform/ & /longform/

Step 6: Invoke content-editor
  - Input: Anonymized posts from public directories
  - Actions: Score, verify anonymization, push 8+ to Typefully
  - Output: Editorial reviews + Typefully drafts

Step 7: Display Summary
  - Transcripts processed
  - Ideas generated
  - Posts drafted
  - Posts anonymized
  - Posts approved (8+)
  - Typefully drafts created
```

---

### 10. Command: /analyze-campaigns

**File:** `commands/analyze-campaigns.md`

**Purpose:** Quick campaign performance pull

**Syntax:**
```bash
/analyze-campaigns [filter]

Examples:
  /analyze-campaigns all
  /analyze-campaigns last-30-days
```

**Workflow:**
```yaml
Step 1: Invoke data-enricher
  - Pass filter
  - Output: Authority statements

Step 2: Display Summary
  - Campaigns analyzed
  - Exceptional campaigns found
  - Link to /content/private/authority-statements.md
```

---

## Directory Structure

```
c:\Users\mitch\Desktop\Claude Code Projects\
  .claude/
    plugins/
      meeting-content-generator/
        .claude-plugin/
          plugin.json
        agents/
          transcript-extractor.md
          content-ideator.md
          data-enricher.md
          content-writer.md
          content-anonymizer.md
          content-editor.md
        skills/
          transcript-tracker/
            SKILL.md
        commands/
          generate-content.md
          analyze-campaigns.md
        README.md

  content/
    private/  (NEVER commit to public repos)
      raw-transcripts/
        YYYY-MM-DD-[call-type]-[topic].md
      drafts/
        YYYY-MM-DD-[title-slug].md
      content-ideas-queue.md
      authority-statements.md
      processed-transcript-ids.txt

    public/  (Safe for version control)
      shortform/
        stories/
        shallow-ideas/
        personal-life/
        pain-points/
        how-tos/
        results/
      longform/
        case-studies/
        deep-dives/
        authority-frameworks/
      editorial-reviews/
        YYYY-MM-DD-review-log.md

    libraries/  (Safe for version control)
      brand-voice.md
      post-type-criteria.md
      successful-patterns.md
      service-offering-map.md
```

---

## Data Structure Specifications

### Raw Transcript File (Private)

```yaml
filename: YYYY-MM-DD-[call-type]-[topic].md
location: /content/private/raw-transcripts/

frontmatter:
  original_transcript_id: string
  date: YYYY-MM-DD
  call_type: enum
  duration_minutes: integer
  participants: array<object> (real names, titles, companies)
  extraction_timestamp: ISO 8601

body:
  - Full transcript with exact quotes
  - Key moments with real context
  - Client details (company, contacts, metrics)
  - Tactical details (specific strategies)
```

### Content Brief (Private)

```yaml
location: /content/private/content-ideas-queue.md

fields:
  post_type: enum
  funnel_stage: enum
  priority: enum + reasoning
  source_transcript: filename
  client_context: string (real company/person names)
  hook_angle: string (with specific details)
  key_points: array<string> (with real context)
  authority_proof: string (exact metrics)
  cta_strategy: string
  anonymization_notes: string (transformation instructions)
```

### Pre-Anonymized Draft (Private)

```yaml
filename: YYYY-MM-DD-[title-slug].md
location: /content/private/drafts/

frontmatter:
  title: string (with real client context)
  post_type: enum
  client_context: string (real names)
  anonymization_notes: string (transformation instructions)
  status: pending_anonymization
  [other metadata]

body: Post content with real client names
```

### Anonymized Post (Public)

```yaml
filename: YYYY-MM-DD-[title-slug].md
location: /content/public/shortform/[type]/ or /longform/[type]/

frontmatter:
  title: string (anonymized)
  post_type: enum
  status: anonymized
  anonymization_log: array<string> (what was transformed)
  editor_score: float (after review)
  [other metadata]
  # NO client_context field
  # NO anonymization_notes field

body: Post content fully anonymized
```

---

## Security & Privacy

### Private Directory Protection

```yaml
Git Configuration (.gitignore):
  /content/private/
  /content/private/**/*
  processed-transcript-ids.txt

File Permissions:
  - Private directories: Read/write by Mitchell only
  - Public directories: Safe for team sharing

Agent Validation:
  - Each agent checks it's reading from correct directory
  - content-anonymizer verifies input from private/, output to public/
  - content-editor only reads from public/
```

### Anonymization Audit Trail

```yaml
Every Anonymization Includes:
  - anonymization_log in frontmatter (what was changed)
  - Timestamp of transformation
  - Agent that performed anonymization

Example Log:
  anonymization_log:
    - "Foundation → Education nonprofit (2025-10-29T15:42:00Z)"
    - "Sarah Johnson → removed (2025-10-29T15:42:00Z)"
    - "$487,000 → significant six-figure pipeline (2025-10-29T15:42:00Z)"
```

---

## Performance Targets

```yaml
Execution Speed:
  - Full pipeline (5 transcripts): < 30 minutes
  - Single agent: < 5 minutes

Quality Metrics:
  - Average editor score: >= 7.5/10
  - Approval rate: >= 60%
  - Anonymization accuracy: 100%

Content Output:
  - Weekly drafts: 12-15 posts
  - Monthly: 48 shortform + 8 longform
  - Funnel: 60% top, 30% mid, 10% bottom
```

---

## Testing & Validation

### Phase 4 Testing Plan

```yaml
Unit Tests:

  transcript-extractor:
    - Verify raw transcript includes all details
    - Verify NO anonymization applied
    - Verify saved to private directory

  content-ideator:
    - Verify briefs include real client names
    - Verify specificity (not "a client")
    - Verify anonymization_notes field present

  content-writer:
    - Verify drafts use real context
    - Verify client_context in frontmatter
    - Verify saved to private/drafts/

  content-anonymizer:
    - Test transformation rules (Foundation → education nonprofit)
    - Verify all client names removed
    - Verify output saved to public directory
    - Verify content still compelling after anonymization

  content-editor:
    - Verify final anonymization check runs
    - Verify identifying information blocks publishing
    - Verify 8+ posts pushed to Typefully

Integration Tests:
  - Run full pipeline on 2-3 real transcripts
  - Verify no client names in public directory
  - Verify content quality maintained through anonymization
  - Mitchell voice validation (8/10 sound like him)
```

---

## Open Questions for Mitchell

1. **Content Root Path:** Confirm `/content/private/` and `/content/public/` structure OK?
2. **Airtable Base/Table:** Which base and table contain lead/booking data for data-enricher?
3. **Git Strategy:** Should private directory be in separate repo, or just .gitignore?
4. **Client Name Disclosure:** Process if you later decide to un-anonymize (with permission)?

---

## Next Steps

1. Mitchell reviews Phase 2 specification
2. Proceed to Phase 3: Technical Planning
3. Generate Phase 4: Task breakdown
4. Begin Phase 5: Implementation

---

**Document Status:** ✅ Approved (Version 2.0 - Corrected Architecture)
**Governed By:** [01_Constitution.md](01_Constitution.md)
**Last Updated:** 2025-10-29
**Version:** 2.0

**Changelog:**
- **v2.0 (2025-10-29):** Complete rewrite with context-first architecture. 6 agents (added content-anonymizer). Private/public directory separation. Ideation and writing use full client context, anonymization happens before publication.
- **v1.0 (2025-10-29):** Initial spec (incorrect anonymization-first approach)
