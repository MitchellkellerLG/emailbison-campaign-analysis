# Meeting Content Generator - Technical Specification

**Version:** 1.0
**Date:** 2025-10-29
**Spec-Kit Phase:** 2 of 5 - Create Specifications
**Governed By:** [01_Constitution.md](01_Constitution.md)

---

## Document Purpose

This specification provides comprehensive technical details for implementing the Meeting Content Generator plugin. Every component, data structure, interface, and behavior is explicitly defined to enable implementation without ambiguity.

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
│  STAGE 1: TRANSCRIPT EXTRACTION & ANONYMIZATION                  │
│  Agent: transcript-anonymizer                                    │
│  Input: Date range or transcript IDs                             │
│  Tools: Fireflies MCPs, Read, Write                              │
│  Output: /content/source-material/transcription-summaries/*.md   │
│  Skill: transcript-tracker (prevent duplicates)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: CAMPAIGN DATA ENRICHMENT                               │
│  Agent: data-enricher                                            │
│  Input: None (autonomous pull)                                   │
│  Tools: EmailBison MCPs, Airtable MCPs, Read, Write              │
│  Output: /content/source-material/authority-statements.md         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: CONTENT IDEATION                                       │
│  Agent: content-ideator                                          │
│  Input: Anonymized summaries + authority statements              │
│  Tools: Read, Write                                              │
│  Output: /content/source-material/content-ideas-queue.md          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: CONTENT DRAFTING                                       │
│  Agent: content-writer                                           │
│  Input: Top 10-15 high-priority ideas from queue                 │
│  Tools: Read, Write                                              │
│  Libraries: brand-voice, post-type-criteria, successful-patterns │
│  Output: /content/output/shortform/* & /longform/*               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: EDITORIAL REVIEW & PUBLISHING                          │
│  Agent: content-editor                                           │
│  Input: All drafted posts                                        │
│  Tools: Read, Write, Typefully MCPs                              │
│  Actions:                                                        │
│    - Score posts (Entertainment 30%, Uniqueness 25%,             │
│                   Criteria 30%, Technical 15%)                   │
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

---

## Component Specifications

### 1. Plugin Manifest

**File:** `.claude/plugins/meeting-content-generator/.claude-plugin/plugin.json`

**Structure:**
```json
{
  "name": "meeting-content-generator",
  "version": "1.0.0",
  "description": "Transforms Fireflies meeting transcripts into publish-ready social media content with voice fidelity and client anonymization.",
  "author": "Mitchell Keller / LeadGrow",
  "agents": [
    {
      "name": "transcript-anonymizer",
      "file": "agents/transcript-anonymizer.md",
      "description": "Extracts and sanitizes Fireflies transcripts for content generation"
    },
    {
      "name": "data-enricher",
      "file": "agents/data-enricher.md",
      "description": "Pulls campaign performance data and creates authority statements"
    },
    {
      "name": "content-ideator",
      "file": "agents/content-ideator.md",
      "description": "Transforms summaries into prioritized content briefs"
    },
    {
      "name": "content-writer",
      "file": "agents/content-writer.md",
      "description": "Drafts posts with Mitchell's voice and personality"
    },
    {
      "name": "content-editor",
      "file": "agents/content-editor.md",
      "description": "Scores, critiques, and publishes exceptional posts"
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
    "contentRootPath": "/content",
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

### 2. Sub-Agent: transcript-anonymizer

**File:** `agents/transcript-anonymizer.md`

**Interface:**
```yaml
Input:
  - date_range: string (format: "YYYY-MM-DD to YYYY-MM-DD" or "last-week")
  - transcript_ids: array<string> (optional, specific IDs to process)

Output:
  - files: array<AnonymizedSummary>
    - path: /content/source-material/transcription-summaries/YYYY-MM-DD-[call-type]-[topic].md
    - metadata: { original_id, call_type, participants, duration, extraction_timestamp }
  - updated: /content/source-material/processed-transcript-ids.txt

Dependencies:
  - MCPs: fireflies (get_transcripts, search, fetch)
  - Skill: transcript-tracker
  - Tools: Read, Write
```

**Anonymization Rules (Explicit):**

| Data Type | Transformation | Example |
|-----------|---------------|---------|
| Client Company Names | "[industry/type] company selling [product] to [audience]" | Foundation → "Education nonprofit selling student success tools to K-12 districts" |
| Client Team Members | "Client [role]" or "Their [role]" | Sarah Johnson → "Client CMO" |
| Client Email Addresses | Remove entirely | sarah@foundation.org → [removed] |
| Specific Revenue Numbers | Ranges or qualitative | $500K pipeline → "significant six-figure pipeline" |
| Contract Values | Ranges or relative | $40K/month → "$XX,XXX monthly retainer" |
| Meeting Booked Counts | Ranges if small, exact if large | 3 meetings → "several meetings", 53 meetings → "53 meetings" |
| Tool Names (Client's) | Generic categories | HubSpot → "their CRM", Salesforce → "their CRM" |
| PRESERVE: Mitchell's Name | Keep as-is | Mitchell Keller → Mitchell Keller |
| PRESERVE: LeadGrow Team | Keep as-is | Aydan, Eli, Harish, Nikos, Rashi, Ahmer, Caelan |
| PRESERVE: LeadGrow Tools | Keep as-is | EmailBison, Clay, Apollo, n8n |
| PRESERVE: General Metrics | Keep as-is | 12% reply rate, 8% booking rate |
| PRESERVE: Mitchell's Quotes | Keep verbatim | "List is the message" → "List is the message" |

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
participants: Mitchell Keller, [Client Champion], [Client Stakeholder]
anonymization_log:
  - "Foundation → Education nonprofit"
  - "$500K → significant six-figure pipeline"
  - "Sarah Johnson → Client Champion"
extraction_timestamp: 2025-10-29T14:32:00Z
---

# [Call Type]: [Topic]

## Participants (Anonymized)
- Mitchell Keller (LeadGrow)
- Client Champion (education sector, regional director role)
- Client Stakeholder (technology coordinator)

## Call Summary
[2-3 paragraph summary with anonymized details]

## Content Opportunities

### Quotable Moments
- "[Direct quote from Mitchell that could become a post]"
- "[Another strong quote or insight]"

### Success Stories (Anonymizable)
- **Situation:** [What the anonymized client was facing]
- **Approach:** [What LeadGrow did, specific enough to be valuable]
- **Result:** [Outcome, with anonymized metrics]
- **Content Angle:** [Suggested post type]

### Objection Handling
- **Objection Raised:** "[Prospect/client concern]"
- **Mitchell's Response:** [How he handled it]
- **Content Angle:** Pain Point post addressing this objection

### How-To Moments
- **Topic:** [Specific tactical advice Mitchell gave]
- **Process:** [Step-by-step if detailed enough]
- **Content Angle:** How-To or Checklist post

### Personal Updates
- **Life Event:** [Family, fitness, milestone]
- **Context:** [Brief detail]
- **Content Angle:** Personal Life post (humanizing)

## Anonymization Audit
✅ All client names anonymized
✅ Revenue figures generalized
✅ Email addresses removed
✅ Mitchell's quotes preserved
✅ LeadGrow team names preserved
✅ Tool names preserved
```

**Verification Checklist (Embedded in Prompt):**
```markdown
Before saving output, verify:
- [ ] No client company names in raw form
- [ ] No client team member names
- [ ] No email addresses present
- [ ] Revenue/metrics appropriately generalized
- [ ] Mitchell's quotes preserved exactly
- [ ] LeadGrow team names intact
- [ ] Call type correctly classified
- [ ] Content opportunities identified (minimum 3)
- [ ] File saved to correct path with proper naming
- [ ] processed-transcript-ids.txt updated
```

---

### 3. Sub-Agent: data-enricher

**File:** `agents/data-enricher.md`

**Interface:**
```yaml
Input:
  - filter: string (optional, "all" or "last-30-days")

Output:
  - appended_to: /content/source-material/authority-statements.md
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

**Categorization Taxonomy:**

```yaml
By Industry:
  - SaaS (further split: B2B, B2C, PLG, Enterprise)
  - E-commerce (D2C, Marketplace, B2B)
  - Agency (Marketing, Development, Design, Consulting)
  - Education (K-12, Higher Ed, EdTech, Nonprofits)
  - Financial Services (Fintech, Banking, Insurance, Crypto)
  - Healthcare (Providers, Tech, Services)
  - Manufacturing & Industrial
  - Professional Services
  - Other

By Offer Type:
  - Free Trial / Demo
  - Audit / Assessment / Review
  - Partnership / Collaboration
  - Discount / Promotion
  - Consultation / Strategy Call
  - Event / Webinar
  - Resource / Giveaway
  - Direct Meeting (no specific offer)

By Target Persona:
  - Founders / CEOs
  - Marketing Leaders (CMO, VP Marketing, Director)
  - Sales Leaders (CRO, VP Sales, Director)
  - SDRs / BDRs
  - Engineers / Technical Leads
  - Operations / RevOps
  - Product Managers
  - Other C-Suite

By Result Type:
  - High Reply Rate (primary metric)
  - High Booking Rate (conversion focus)
  - Large Pipeline Generated (revenue focus)
  - Sustained Engagement (long-term relationship)
  - Quick Wins (speed to result)

By Campaign Theme:
  - Situation-Based Messaging (specific pain point targeting)
  - Pain-Focused (problem-aware audience)
  - Contrast-Based (us vs them, old way vs new way)
  - Authority Positioning (thought leadership angle)
  - Partnership Framing (collaboration over sales)
  - Frontend Offer (low-commitment entry)
```

**Authority Statement Format:**

```markdown
### [Industry] - [Offer Type] Campaign

**Client Profile:** [Anonymized descriptor]
**Target Persona:** [Role/title]
**Campaign Theme:** [Primary approach]
**Volume:** [Contact count range]

**Approach:**
[2-3 sentences describing what made this work - specific enough to be valuable, anonymized enough to protect client]

**Results:**
- Reply Rate: X%
- Engaged Leads: X
- Meetings Booked: X (if available)
- Duration: X weeks
- Unique Element: [What made this exceptional]

**Content Snippet:**
"Helped a [industry] company [selling X to Y] book [Z meetings / generate $X pipeline] by [key strategic element]..."

**Categorization:**
- Industry: [Tag]
- Offer: [Tag]
- Persona: [Tag]
- Result Type: [Tag]
- Theme: [Tag]

---
```

**Cross-Reference Logic:**

```python
# Pseudocode for matching EmailBison → Airtable
def enrich_campaign_data(campaign):
    # Step 1: Get EmailBison metrics
    emailbison_data = get_campaign_details(campaign.id)
    reply_rate = emailbison_data.reply_rate
    engaged_leads = emailbison_data.engaged_count

    # Step 2: Search Airtable for matching records
    # Assumption: Airtable base contains lead records with "Campaign Name" field
    airtable_base_id = "[Mitchell's Base ID]"
    airtable_table_id = "Leads"  # Or appropriate table name

    airtable_matches = search_airtable(
        base_id=airtable_base_id,
        table_id=airtable_table_id,
        filter=f"{{Campaign Name}} = '{campaign.name}'"
    )

    # Step 3: Calculate booking rate
    booked_leads = [lead for lead in airtable_matches if lead.status == "Meeting Booked"]
    booking_rate = (len(booked_leads) / engaged_leads) * 100 if engaged_leads > 0 else 0

    # Step 4: Apply thresholds
    is_exceptional = check_thresholds(campaign, reply_rate, engaged_leads, booking_rate)

    return {
        "reply_rate": reply_rate,
        "engaged_leads": engaged_leads,
        "booking_rate": booking_rate,
        "is_exceptional": is_exceptional
    }
```

**Verification Checklist:**
```markdown
Before appending authority statement:
- [ ] Client name fully anonymized
- [ ] Industry/descriptor natural (not "Client A")
- [ ] Metrics accurate from EmailBison
- [ ] Airtable cross-reference attempted (if available)
- [ ] All 5 categorization tags assigned
- [ ] Content snippet formatted for easy copy-paste
- [ ] "Unique Element" identifies what made this work
- [ ] No identifying details (domain, URLs, contact names)
```

---

### 4. Sub-Agent: content-ideator

**File:** `agents/content-ideator.md`

**Interface:**
```yaml
Input:
  - source: /content/source-material/transcription-summaries/ (all .md files)
  - reference: /content/source-material/authority-statements.md

Output:
  - file: /content/source-material/content-ideas-queue.md
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

  examples:
    - "12% reply rate on education campaign launched last week" (timely + proof)
    - "Mitchell's response to 'cold email is dead' objection using Kobe mindset" (unique + alignment)
    - "Client went from 0 to 20 meetings in 3 weeks after fixing their list strategy" (proof + alignment)

Medium Priority (Queue for later):
  criteria:
    - Evergreen (always relevant, not time-sensitive)
    - Good proof (solid but not exceptional metrics)
    - Solid angle (valuable but needs stronger hook)

  examples:
    - "How to validate your ICP before spending on data" (evergreen how-to)
    - "8% booking rate on SaaS campaign" (good but not outlier)
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
      - "Mitchell's nephew asked about his job, made him realize..."
      - "Failed campaign taught me more than successful one"
      - "Climbing route analogy to campaign strategy"

  Shallow Ideas:
    triggers:
      - Platitude or common saying mentioned
      - Broadly applicable insight
      - Opportunity for interest-based lens (Kobe, Five Rings, etc.)
    examples:
      - "'Just be yourself' is terrible advice. Here's why via Vagabond."
      - "Everyone says 'know your ICP.' Nobody says how. Art of War approach:"

  Personal Life:
    triggers:
      - Family update (nephews, wife)
      - Fitness milestone (lifting, running, climbing)
      - Life event (no business tie-in needed)
    examples:
      - "Hit new deadlift PR. That's it. That's the post."
      - "Nephew graduated today. Proud uncle moment."

Mid Funnel (Expertise / Trust):

  Pain Points:
    triggers:
      - Objection raised in sales call
      - Common misconception corrected
      - Problem Mitchell sees repeatedly
    examples:
      - "Your reply rate sucks because your list is garbage"
      - "Stop blaming 'email fatigue.' Fix your relevance."
      - "You don't have a copywriting problem. You have a targeting problem."

  How-Tos / Checklists:
    triggers:
      - Tactical advice given in call
      - Process explained step-by-step
      - Framework mentioned multiple times
    examples:
      - "Here's how to validate catch-all emails before sending"
      - "3-step process for finding hard-to-find data"
      - "Our domain warm-up protocol (exact settings)"

  Results / Proof:
    triggers:
      - Strong campaign metrics (8%+ reply, 50+ engaged)
      - Quick wins (fast turnaround)
      - Unexpected success (outlier performance)
    examples:
      - "12% reply rate for education nonprofit. No tricks, just relevance."
      - "53 meetings booked this month. Here's what's working."

Bottom Funnel (Conversion):

  Case Studies:
    triggers:
      - Multi-call client journey (before → approach → after)
      - Complex problem solved with sophisticated approach
      - Clear transformation with metrics
    examples:
      - "How [industry client] went from 2% to 12% reply rate"
      - "Education nonprofit case study: regional champion strategy"

  Giveaways:
    triggers:
      - Complete system/framework mentioned (Clay workflow, scoring system)
      - High-value asset Mitchell offers to share
      - Requires approval before drafting
    examples:
      - "Our complete lead scoring system (30-50 points, decay logic)"
      - "Clay workflow for database discovery (exact setup)"
```

**Content Brief Template (Explicit Format):**

```markdown
### [Content Idea Title - Clear and Specific]

**Post Type:** [Stories / Shallow Ideas / Personal Life / Pain Points / How-Tos / Results / Case Studies / Giveaways]
**Funnel Stage:** [Top / Mid / Bottom]
**Priority:** [High / Medium / Low] - [1-2 sentence reasoning referencing criteria]
**Source Transcript:** [Filename of anonymized summary]
**Extraction Date:** [YYYY-MM-DD]

**Hook / Angle:**
[1-2 sentences describing the compelling entry point. What makes someone stop scrolling?]

**Key Points:**
- [Specific point 1 with detail]
- [Specific point 2 with detail]
- [Specific point 3 with detail]
[3-5 points total, enough to guide writer without writing full post]

**Authority Proof:**
[Relevant metric, campaign result, or story from authority-statements.md if applicable]
[If no proof needed (personal/story posts), write "N/A - personality content"]

**CTA Strategy:**
[DM / Comment '[KEYWORD]' / YouTube search 'Mitchell Keller [topic]' / Link in bio / None]
[Include reasoning for CTA choice]

**Interest / Reference Opportunity:**
[If applicable: Kobe / Five Rings / Art of War / Vagabond / Berserk / Hormozi / Lifting / Family / History]
[If not applicable: "None - direct approach"]
[Suggestion for how to weave in naturally]

**Notes / Special Considerations:**
[Any edge cases, anonymization reminders, approval needed, etc.]

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
- [ ] All ideas mapped to specific post types
- [ ] Funnel stages assigned correctly
- [ ] Priority justified with specific reasoning
- [ ] Hooks are compelling (would YOU stop scrolling?)
- [ ] Key points specific (not vague advice)
- [ ] Authority proof referenced when appropriate
- [ ] CTA strategy aligns with funnel stage
- [ ] Interest references relevant (not forced)
- [ ] Queue organized: High priority → Medium → Low
- [ ] Funnel mix roughly 60/30/10 for high-priority items
```

---

### 5. Sub-Agent: content-writer

**File:** `agents/content-writer.md`

**Interface:**
```yaml
Input:
  - ideas: /content/source-material/content-ideas-queue.md (top 10-15 high-priority)
  - libraries:
      - /content/libraries/brand-voice.md
      - /content/libraries/post-type-criteria.md
      - /content/libraries/successful-patterns.md

Output:
  - files: array<DraftedPost>
    - shortform: /content/output/shortform/[type]/YYYY-MM-DD-[title-slug].md
    - longform: /content/output/longform/[type]/YYYY-MM-DD-[title-slug].md
    - carousels: /content/output/carousels-for-review/YYYY-MM-DD-[title-slug].md
  - summary: { posts_drafted, post_type_breakdown }

Dependencies:
  - Tools: Read, Write
```

**Voice Characteristics (Explicit with Examples):**

```yaml
Conversational:
  definition: "Write like DMing a friend who's smart about business"
  examples:
    - bad: "Organizations frequently encounter challenges with lead generation efficacy."
    - good: "Your lead gen sucks because you're targeting markets, not men."

  patterns:
    - Use contractions (you're, don't, here's)
    - Start sentences with "And" or "But" when it flows
    - Ask rhetorical questions
    - Use "you" not "one" or "organizations"

Punchy:
  definition: "Short sentences. Fragments work. Cut ALL fluff."
  examples:
    - bad: "I think it's important to mention that we should probably consider the fact that your list might need some work."
    - good: "Your list is shit. Fix it."

  patterns:
    - Average sentence: 10-15 words
    - Mix short (3-5 word) fragments for impact
    - One idea per sentence
    - Cut qualifiers (probably, maybe, might, somewhat)

Specific:
  definition: "Numbers, tools, examples - never vague"
  examples:
    - bad: "We got good results for a client recently."
    - good: "Education nonprofit: 12% reply rate, 20 meetings in 3 weeks."

  patterns:
    - Always include metrics when claiming results
    - Name tools (Clay, Apollo, EmailBison, not "a tool")
    - Give exact numbers (not "several" - say "7")
    - Specific industries (not "B2B" - say "SaaS selling to marketing teams")

Casual Authority:
  definition: "Confident without arrogance. You've done this 1000x."
  examples:
    - bad (arrogant): "I'm the only one who understands this properly."
    - bad (timid): "In my humble opinion, this might work..."
    - good: "Here's what actually works. Tried it on 40+ campaigns."

  patterns:
    - State facts directly (no hedging)
    - Back claims with experience ("I've seen...")
    - Acknowledge what you don't know when relevant
    - Use "Here's how" not "You might want to consider"

Occasionally Profane:
  definition: "Shit, damn, hell - when it adds punch. Not every post."
  examples:
    - good use: "Your targeting is shit. Fix the list, watch replies skyrocket."
    - good use: "Stop overthinking the damn copy. Your problem is relevance."
    - bad use: "F* this, f* that" (try-hard, excessive)
    - bad use: Profanity in case studies or giveaways (unprofessional)

  patterns:
    - 1 in 4-5 posts maximum
    - Use for emphasis on frustration / strong point
    - Never in bottom-funnel content
    - Never directed at audience ("you're an idiot") - directed at problems
```

**Formatting Rules (Explicit):**

```yaml
Paragraph Structure:
  - 1-3 sentences per paragraph maximum
  - Blank line between paragraphs (readability)
  - Longform: Use headers for sections

  example:
    "12% reply rate for an education nonprofit.

    No tricks. No AI-generated garbage. Just relevance.

    Here's what actually worked:"

Line Breaks:
  - Shortform: Paragraphs only (no manual line breaks mid-paragraph)
  - Longform: Acceptable for emphasis or lists

Emphasis:
  - ALL CAPS for critical points (sparingly - 1-2 per post max)
  - Bold (**text**) for headers in longform
  - Italics (*text*) rarely (prefer caps or plain text)

  examples:
    - "This is THE most important part."
    - "Your list is the message. Not the subject line."

Lists:
  - Shortform bullets: Use ">" prefix (not "-" or "*")
    > Benefit one
    > Benefit two
    > Benefit three

  - Longform bullets: Standard markdown "-"
    - Step one: Do this
    - Step two: Do that

  - Numbered lists: When order matters
    1. First action
    2. Second action
    3. Third action

Headers (Longform Only):
  - Use ## for main sections
  - Use ### for subsections if needed
  - Never use # (reserved for title)
  - Keep headers short and active

  examples:
    - bad: "The Importance of List Quality in Email Marketing"
    - good: "Why Your List Matters More Than Copy"

Emojis:
  - Shortform: NEVER (Mitchell's rule)
  - Longform: Sparingly - only ✅❌ for checklists/comparisons
  - Carousels: User discretion (Mitchell reviews)

  example (longform):
    "❌ Generic spray-and-pray
    ✅ Situation-based messaging

    ❌ Targeting markets
    ✅ Targeting men"

CTAs:
  - Shortform: End with CTA or standalone line
  - Longform: After value delivery, before sign-off
  - Never all caps
  - Never desperate ("PLEASE DM ME")

  examples:
    - "DM me if you want the full breakdown."
    - "Shoot me a message. I'll show you what we'd do different."
    - "Search 'Mitchell Keller database discovery' on YouTube."
    - "Link in bio for the full framework."
```

**Post Type Execution (Detailed):**

**STORIES**

```yaml
Structure:
  1. Hook: Start with moment or emotion (1-2 sentences)
  2. Build: Context, tension, or challenge (2-3 sentences)
  3. Realization: Turning point or outcome (1-2 sentences)
  4. Business Tie-In: Light touch connection (optional, 1 sentence)
  5. No Hard CTA: Let story breathe

Length: 80-150 words

Voice: Vulnerable, relatable, human

Example:
  "My nephew asked what I do for work.

  'I help people send better emails.'

  He looked confused. Fair.

  'Uncle Mitch, that's it? Just emails?'

  Made me realize how simple this actually is.

  Not AI magic. Not growth hacking. Not some secret framework.

  Just understanding who you're talking to.

  Then saying something they actually care about.

  That's the whole game."

Verification:
  - [ ] Opens with specific moment (not generic "one time")
  - [ ] Emotion or tension present
  - [ ] Outcome or realization clear
  - [ ] Business connection light (if present)
  - [ ] No hard CTA
  - [ ] Sounds like a real conversation
```

**SHALLOW IDEAS**

```yaml
Structure:
  1. State Platitude: Common saying or advice (1 sentence)
  2. Why It Matters: Context on why people say this (1-2 sentences)
  3. Fresh Angle: Unique lens via interest (Kobe, Five Rings, etc.) (2-4 sentences)
  4. No CTA: Pure thought

Length: 50-100 words (ultra-short)

Voice: Casual, confident, fresh perspective

Example:
  "'Focus on what you can control.'

  Everyone says this. Usually when shit's going wrong.

  Kobe took it further.

  He didn't just ignore what he couldn't control.
  He obsessed over what he COULD.

  Every detail. Every rep. Every meal.

  That's the difference between advice and philosophy."

Verification:
  - [ ] Platitude stated clearly
  - [ ] Fresh angle via interest lens (not generic restatement)
  - [ ] Ultra-short (under 100 words)
  - [ ] No business pitch
  - [ ] No CTA
  - [ ] Memorable / shareable
```

**PERSONAL LIFE**

```yaml
Structure:
  1. Share Update: Life event or milestone (1-3 sentences)
  2. That's It: No business tie-in required

Length: 20-60 words (very short)

Voice: Authentic, casual, human

Examples:
  "Hit a new deadlift PR today. 405 lbs. Felt good."

  "Watching my nephews discover Berserk. This is how you build taste."

  "Wife and I are expecting. First kid. Wild."

Verification:
  - [ ] Genuinely personal (not business disguised as personal)
  - [ ] Short (under 60 words)
  - [ ] No forced business lesson
  - [ ] Sounds like a real update Mitchell would share
```

**PAIN POINTS**

```yaml
Structure:
  1. Hook: Name problem boldly, get attention (1-2 sentences)
  2. Empathy: Why this hurts, show understanding (2-3 sentences)
  3. Insight: What most people miss (2-3 sentences)
  4. Authority Proof: Relevant metric or story (1-2 sentences)
  5. CTA: Offer solution path (1 sentence)

Length: 120-180 words

Voice: Direct, empathetic, authoritative

Example:
  "Your reply rate sucks because your list is garbage.

  Not slightly off. Not 'needs optimization.'

  GARBAGE.

  You're targeting VP of Marketing at SaaS companies.

  Cool. So are 10,000 other people.

  Your targeting is a market, not men.

  We helped an education nonprofit go from 3% to 12% reply rate.

  Same copy. Same subject lines.

  Different list.

  Situation-based targeting. Regional directors in Ohio specifically.

  Not 'education decision makers.'

  MEN, not markets.

  DM me. I'll show you how to fix your list."

Verification:
  - [ ] Hook is bold / attention-grabbing
  - [ ] Problem clearly named
  - [ ] Empathy present (not just criticism)
  - [ ] Insight specific (what they're missing)
  - [ ] Authority proof included (metric or story)
  - [ ] CTA clear and relevant
  - [ ] Voice is direct but not condescending
```

**HOW-TOS / CHECKLISTS**

```yaml
Structure:
  1. Hook: What they'll learn (1 sentence)
  2. Steps: Numbered or bulleted process (3-7 items)
  3. Detail: Specific without giving full system (tools, thresholds, settings)
  4. Authority Statement: Results from using this (1 sentence)
  5. Optional CTA: Soft offer for more

Length: 100-200 words

Voice: Tactical, specific, generous

Example:
  "Here's how to validate catch-all emails before you send.

  1. Pull list from Apollo or Clay
  2. Run through Zerobounce (flags catch-alls)
  3. Separate catch-alls into test batch
  4. Send low-volume warm-up sequence first (20-30/day max)
  5. Monitor bounce rate - under 2% = safe to scale
  6. If bounces spike, pull domain from rotation

  We do this for every client.

  Saves domains. Protects deliverability.

  8%+ reply rates on campaigns others would've killed.

  DM me if you want our full warm-up protocol."

Verification:
  - [ ] Hook promises specific value
  - [ ] Steps clear and actionable
  - [ ] Tools/thresholds named specifically
  - [ ] Doesn't give away full system (leaves room for consultation)
  - [ ] Authority proof present
  - [ ] CTA optional and soft
  - [ ] Actually useful (not just high-level fluff)
```

**RESULTS / PROOF**

```yaml
Structure:
  1. Lead With Metric: Result first (1 sentence)
  2. Context: Anonymized situation (1-2 sentences)
  3. How: Brief explanation (1-2 sentences, not full breakdown)
  4. Soft CTA or None: Let results speak

Length: 60-120 words

Voice: Confident, factual, understated

Examples:
  "12% reply rate for an education nonprofit.

  Regional targeting in Ohio. Specific pain point around student success tracking.

  Situation-based messaging. Not generic outreach.

  List was the message."

  ---

  "53 meetings booked this month across 3 clients.

  Nothing fancy.

  Good targeting. Relevant offers. Proper infrastructure.

  This is what happens when you stop overthinking copy and start fixing the list."

Verification:
  - [ ] Metric leads (no burying the lede)
  - [ ] Context anonymized properly
  - [ ] Explanation brief (not full case study)
  - [ ] Undersells rather than oversells
  - [ ] CTA absent or very soft
  - [ ] Specific enough to be credible
```

**CASE STUDIES**

```yaml
Structure:
  1. Hook: Lead with result (1 sentence)
  2. Situation: Anonymized client challenge (2-3 sentences)
  3. Problem: Why standard approaches fail (2-3 sentences)
  4. Our Approach: 3-5 specific elements (bulleted)
  5. Results: Specific metrics (2-3 sentences)
  6. CTA: Invitation to discuss

Length: 250-400 words

Voice: Sophisticated, detailed, consultative

Example:
  "How we helped an education nonprofit go from 3% to 12% reply rate in 3 weeks.

  ## The Situation

  Education nonprofit selling student success tools to K-12 districts.

  They'd been doing generic outreach. 'We help schools improve outcomes.'

  True, but meaningless.

  3% reply rate. Mostly automated 'not interested.'

  ## The Problem

  Their list was too broad. Superintendents, principals, curriculum directors.

  Different pain points. Different priorities. Different languages.

  One message can't serve all of them.

  ## Our Approach

  > Regional champion strategy (leveraged local credibility in Ohio)
  > Situation-based targeting (SST directors specifically - one pain point)
  > Problem-aware messaging (not 'improve outcomes' - 'streamline SST tracking')
  > Multi-channel follow-up (email → phone → webinar)
  > Infrastructure warm-up (new sender, proper domain setup)

  ## The Results

  12% reply rate in week one.

  20 meetings booked in 3 weeks.

  Significant six-figure pipeline.

  Same company. Same offer. Different targeting.

  The list was the message.

  ---

  DM me if you're stuck with broad targeting and generic messaging. I'll show you what situation-based looks like for your business."

Verification:
  - [ ] Hook leads with compelling result
  - [ ] Situation anonymized properly (industry, not company name)
  - [ ] Problem section shows sophistication (why obvious approaches fail)
  - [ ] Approach specific (3-5 tactical elements)
  - [ ] Results quantified with metrics
  - [ ] Shows complexity without overwhelming
  - [ ] CTA invites conversation
  - [ ] Demonstrates "you could DIY, but shouldn't" positioning
```

**GIVEAWAYS**

```yaml
Structure:
  1. Value Description: What they're getting (2-3 sentences)
  2. What's Included: Bulleted list of components (3-7 items)
  3. How It Helps: Specific benefits (2-3 sentences)
  4. Engagement Requirement: Comment + follow (1-2 sentences)

Length: 150-250 words

Voice: Generous, valuable, clear

Example:
  "Giving away our complete lead scoring system.

  30-50 point framework with weekly decay logic.

  This is what we use to prioritize high-engagement prospects across all client campaigns.

  ## What's Included:

  > Scoring criteria (email opens, replies, link clicks, meeting requests)
  > Point values per action (weighted by intent signal)
  > Weekly decay formula (prevents stale leads staying 'hot')
  > Integration instructions (Clay, Apollo, CRM sync)
  > Automation triggers (when to call vs nurture vs pause)
  > Example scoring sheet (real anonymized data)

  ## Why This Helps:

  Stop wasting time on cold leads.

  Your SDRs call the right people at the right time.

  Engagement-based prioritization beats alphabetical every time.

  ## How to Get It:

  1. Comment 'SCORING' below
  2. Follow this account
  3. I'll DM you the full framework

  Giving this to the first 50 people only."

Verification:
  - [ ] Value clear upfront
  - [ ] Included items specific (not vague)
  - [ ] Benefits concrete
  - [ ] Engagement requirement explicit
  - [ ] Mitchell approved giveaway BEFORE drafting
  - [ ] Asset actually exists / deliverable
  - [ ] Scarcity angle optional but effective
```

**Brand Positioning Weave (Subtle Integration):**

```yaml
Core Concepts to Reinforce (Don't State - Demonstrate):

  "Situation-Based Messaging":
    - bad: "We do situation-based messaging, not generic."
    - good: "Regional directors in Ohio facing SST tracking issues. Not 'education leaders.'"

  "Technicians Not Maintenance Men":
    - bad: "We're technicians, not maintenance men."
    - good: "We don't just 'manage' campaigns. We diagnose deliverability, fix infrastructure, rebuild targeting."

  "List is the Message":
    - bad: "The list is more important than copy."
    - good: "Same copy. Same subject lines. Different list. 3% → 12% reply rate."

  "Men Not Markets":
    - bad: "Target individuals, not segments."
    - good: "VP of Marketing at SaaS companies? That's 10,000 people. That's a market, not a man."

  "Relevance Above All":
    - bad: "Relevance matters most."
    - good: "Your copy is fine. Your list is wrong. Fix relevance, watch replies come."
```

**Interest Bank Integration (Use Sparingly):**

```yaml
Usage Frequency: 1 in 5-7 posts maximum

Kobe Bryant:
  themes: Preparation meets opportunity, mamba mentality, obsession with details
  example: "Kobe didn't just practice. He studied angles, timing, defender tendencies. Cold email works the same. Study the buyer, not the subject line."

Five Rings (Miyamoto Musashi):
  themes: Strategic timing, adaptability, mastery through fundamentals
  example: "Five Rings teaches timing over force. Cold email too. Right message, wrong quarter = no reply. Same message, right timing = meetings."

Art of War (Sun Tzu):
  themes: Positioning, indirect approaches, information advantage
  example: "Sun Tzu: 'All warfare is based on deception.' Cold email opposite. Radical honesty wins. 'I want 15 minutes' beats 'I have insights for you.'"

Vagabond:
  themes: Journey of mastery, internal struggle, growth through discipline
  example: "Vagabond shows mastery isn't a destination. Every campaign teaches something. The best cold emailers I know still test, still fail, still learn."

Berserk:
  themes: Relentless against odds, carrying weight, refusing to quit
  example: "Guts carries a sword most men can't lift. Your cold email program is that sword. Most quit. The ones who don't? They win."

Alex Hormozi:
  themes: Volume negates luck, offers > copy, frontend offers
  example: "Hormozi: 'Make so many offers rejection doesn't matter.' Cold email too. 1,000 sends beats perfect copy to 100."

Lifting / Running / Climbing:
  themes: Physical discipline, progressive overload, measurable progress
  example: "Lifting teaches you can't rush strength. Add 5 lbs every week. Cold email same. Add 100 sends weekly. Scale sustainably."

Family:
  themes: Grounding, perspective, humanizing
  example: "My nephew asked why I work so much. Realized I couldn't explain it simply. If you can't explain your offer to a 12-year-old, it's too complicated."

History (Egypt, Alexander, Philip II):
  themes: Strategy, empire building, long-term thinking
  example: "Philip II built the army. Alexander conquered the world. Cold email similar. Infrastructure first (Philip), then scale (Alexander)."

Game of Thrones:
  themes: Strategy, positioning, alliances
  example: "Tyrion: 'I drink and I know things.' Cold email positioning. Know your ICP better than they know themselves."

Verification:
  - [ ] Interest reference relevant to point (not forced)
  - [ ] Enhances message (doesn't distract)
  - [ ] Used sparingly (not every post)
  - [ ] Analogy clear (doesn't require deep knowledge)
```

**CTA Construction:**

```yaml
DM CTAs:
  appropriate_for: Pain points, case studies, how-tos (when offering more)
  examples:
    - "DM me. I'll show you what we'd do different."
    - "Shoot me a message if you want the full breakdown."
    - "DM me 'LIST' and I'll send you our targeting framework."

  avoid:
    - "PLEASE DM ME NOW" (desperate)
    - "Click link in bio to schedule" (too direct for top/mid funnel)
    - "DM for pricing" (premature)

Comment CTAs:
  appropriate_for: Giveaways ONLY
  format: "Comment '[KEYWORD]' below"
  examples:
    - "Comment 'SCORING' and I'll DM you the framework."
    - "Comment 'CLAY' for the workflow."

  avoid:
    - Using for non-giveaway posts
    - Multiple keywords per post
    - Vague keywords ("INTERESTED", "YES")

YouTube CTAs:
  appropriate_for: How-tos, tactical content where Mitchell has video
  format: "Search 'Mitchell Keller [topic]' on YouTube" (NO LINKS)
  examples:
    - "Search 'Mitchell Keller database discovery' on YouTube for the full walkthrough."
    - "I broke this down in a video. Search 'Mitchell Keller list targeting' on YouTube."

  avoid:
    - Direct links (often removed by platforms)
    - "Watch my YouTube" (vague)
    - Promising video that doesn't exist

Website CTAs:
  appropriate_for: Bottom-funnel, case studies, when offering resources
  format: "Link in bio" or describe value
  examples:
    - "Full case study in the link in bio."
    - "Website has our complete service breakdown. Link in bio."

  avoid:
    - "Visit my website" (too generic)
    - Overusing (cheapens)

No CTA:
  appropriate_for: Stories, personal life, some results posts
  reasoning: Let content breathe, build relationship without ask
  examples:
    - Stories (no CTA needed - just connection)
    - Personal updates (no business angle)
    - Results posts (let metrics speak)
```

**Rule of Threes Humor (Occasional Pattern):**

```yaml
Pattern:
  line_1: Normal statement / setup
  line_2: Normal statement / continuation
  line_3: Unexpected twist / punchline

Example 1:
  "Cold email isn't dead.
  Your targeting is.
  Along with your subject lines."

Example 2:
  "I love coffee.
  I love lifting.
  I love when clients actually send the homework."

Example 3:
  "Three things I learned this week:
  1. Good copy can't save bad targeting
  2. Bad copy can kill good targeting
  3. My nephews think I'm a professional email sender (accurate)"

Verification:
  - [ ] Used sparingly (not every post)
  - [ ] Third line genuinely unexpected
  - [ ] Lands humor without forcing
  - [ ] Sounds like Mitchell (not try-hard)
```

**Frontmatter Metadata (All Drafted Posts):**

```yaml
format:
  ---
  title: [Post title / topic]
  post_type: [Type]
  funnel_stage: [Top/Mid/Bottom]
  priority: [High/Medium/Low]
  source_idea_id: [Reference to content-ideas-queue.md line]
  draft_date: [YYYY-MM-DD]
  drafted_by: content-writer
  word_count: [X]
  libraries_referenced:
    - brand-voice.md
    - post-type-criteria.md
    - successful-patterns.md
  status: pending_review
  ---

  [Post content here]

example:
  ---
  title: Education nonprofit reply rate transformation
  post_type: Case Study
  funnel_stage: Bottom
  priority: High
  source_idea_id: content-ideas-queue.md#idea-47
  draft_date: 2025-10-29
  drafted_by: content-writer
  word_count: 287
  libraries_referenced:
    - brand-voice.md
    - post-type-criteria.md
    - successful-patterns.md
  status: pending_review
  ---

  [Case study content follows...]
```

**Master Verification Checklist (Before Saving Any Draft):**

```markdown
Voice & Style:
- [ ] Conversational (sounds like DMing a friend)
- [ ] Punchy (short sentences, fragments work, no fluff)
- [ ] Specific (numbers, tools, examples - not vague)
- [ ] Casual authority (confident, not arrogant)
- [ ] Profanity appropriate if used (adds punch, not excessive)

Formatting:
- [ ] Short paragraphs (1-3 sentences)
- [ ] Blank lines between paragraphs
- [ ] ALL CAPS for emphasis (sparingly)
- [ ] Proper bullet/list formatting
- [ ] No emojis (shortform) / ✅❌ only (longform)
- [ ] Headers for longform structure

Content Quality:
- [ ] Hook immediately engaging
- [ ] Meets post-type criteria from library
- [ ] Appropriate length for type
- [ ] Value delivered (not just fluff)
- [ ] Authenticity (sounds like Mitchell)
- [ ] Interest references natural (if used)

Brand Positioning:
- [ ] Demonstrates positioning (doesn't state it)
- [ ] Reinforces core concepts subtly
- [ ] Aligns with business goals

CTA & Funnel:
- [ ] CTA appropriate for funnel stage
- [ ] CTA not desperate or salesy
- [ ] CTA clear if present
- [ ] No CTA appropriate if story/personal

Anonymization:
- [ ] No client names in raw form
- [ ] Industry descriptors natural
- [ ] Metrics preserved but not identifying
- [ ] Authority proof anonymized properly

Technical:
- [ ] Frontmatter metadata complete
- [ ] Saved to correct folder path
- [ ] Filename follows convention (YYYY-MM-DD-title-slug.md)
- [ ] Source idea marked as "drafted" in queue
```

---

### 6. Sub-Agent: content-editor

**File:** `agents/content-editor.md`

**Interface:**
```yaml
Input:
  - drafted_posts: /content/output/shortform/*/* and /content/output/longform/*/*
  - criteria: /content/libraries/post-type-criteria.md

Output:
  - reviews: /content/output/editorial-reviews/YYYY-MM-DD-review-log.md
  - typefully_drafts: Created via MCP for posts scoring 8+
  - updated_frontmatter: Posts updated with scores and editor notes

Dependencies:
  - MCPs: typefully (create_draft, get_scheduled_drafts)
  - Tools: Read, Write
```

**Scoring Rubric (Explicit Breakdown):**

```yaml
Total: 100 points → Converted to 1-10 scale

ENTERTAINMENT (30 points):

  Hook Effectiveness (10 points):
    - 10: Stopped me immediately, had to keep reading
    - 7-9: Strong hook, engaging
    - 4-6: Decent hook, could be stronger
    - 1-3: Weak hook, easy to scroll past
    - 0: No hook, starts with context dump

  Feed-Worthiness (10 points):
    - 10: Would read this scrolling casually
    - 7-9: Interesting enough to pause
    - 4-6: Might read if slow day
    - 1-3: Probably skip
    - 0: Definitely skip

  Memorable Moments (10 points):
    - 10: Will remember this tomorrow, quotable
    - 7-9: Has a standout line or idea
    - 4-6: Solid but not memorable
    - 1-3: Forgettable
    - 0: Generic, no impact

  Deductions:
    - Boring hook: -5
    - No memorable moments: -5
    - Reads like everyone else: -3

UNIQUENESS (25 points):

  Fresh Angle vs. Rehashed (10 points):
    - 10: Never seen this exact take before
    - 7-9: Familiar topic, fresh perspective
    - 4-6: Decent but somewhat common
    - 1-3: Heard this 100 times
    - 0: Platitude with no new spin

  Mitchell-Specific vs. Generic (10 points):
    - 10: Only Mitchell could write this (voice, experience, examples)
    - 7-9: Clearly Mitchell's perspective
    - 4-6: Could be Mitchell or similar voices
    - 1-3: Could be any cold email person
    - 0: Could be anyone

  Adds to Conversation vs. Noise (5 points):
    - 5: Contributes new value to discourse
    - 3-4: Solid contribution
    - 1-2: Adds little
    - 0: Pure noise

  Deductions:
    - Generic advice anyone gives: -10
    - Predictable ending: -5
    - Sounds like AI wrote it: -10

CRITERIA ALIGNMENT (30 points):

  (Scoring depends on post type - refer to post-type-criteria.md)

  Stories:
    - Emotional connection present? (10 points)
    - Relatable moment? (10 points)
    - Business lesson light touch? (5 points)
    - No hard CTA? (5 points)

  Pain Points:
    - Bold problem statement? (10 points)
    - Empathy shown? (7 points)
    - Authority proof included? (8 points)
    - CTA present? (5 points)

  How-Tos:
    - Actionable value? (10 points)
    - Specific tools/steps? (10 points)
    - Doesn't give away full system? (5 points)
    - Authority statement? (5 points)

  Case Studies:
    - Situation → Approach → Results? (10 points)
    - Sophisticated but accessible? (10 points)
    - Anonymized properly? (5 points)
    - Clear CTA? (5 points)

  Results:
    - Metric leads? (10 points)
    - Brief explanation present? (10 points)
    - Undersells (not oversells)? (10 points)

  [Other post types have type-specific criteria]

  Deductions:
    - Missing required element: -10 per element
    - Wrong structure for type: -10
    - Criteria confused with another type: -15

TECHNICAL (15 points):

  Voice Consistency (5 points):
    - 5: Perfect Mitchell voice
    - 4: Mostly Mitchell, minor issues
    - 3: Some voice inconsistencies
    - 1-2: Doesn't sound like Mitchell
    - 0: Completely off-voice

  Proper Length (3 points):
    - 3: Within range for post type
    - 2: Slightly over/under
    - 1: Significantly wrong length
    - 0: Completely wrong

  Formatting Clean (3 points):
    - 3: Perfect formatting per guidelines
    - 2: Minor issues (extra emoji, slight formatting error)
    - 1: Multiple formatting issues
    - 0: Formatting mess

  Anonymization Intact (2 points):
    - 2: All client data anonymized
    - 1: Minor slip (not identifying)
    - 0: Client identifying information present

  CTA Appropriate (2 points):
    - 2: CTA fits funnel stage and post type
    - 1: CTA present but slightly off
    - 0: Wrong CTA or missing when required

  Deductions:
    - Vague claims without proof: -2
    - Forced interest references: -1
    - Too salesy for funnel stage: -2
    - Poor paragraph breaks: -1
    - Emojis in shortform: -2
```

**Score Conversion Formula:**

```python
def convert_score(total_points):
    # Total out of 100
    if total_points >= 90:
        return 10
    elif total_points >= 80:
        return 9
    elif total_points >= 70:
        return 8
    elif total_points >= 60:
        return 7
    elif total_points >= 50:
        return 6
    elif total_points >= 40:
        return 5
    elif total_points >= 30:
        return 4
    elif total_points >= 20:
        return 3
    elif total_points >= 10:
        return 2
    else:
        return 1
```

**Critique Format (for posts <8):**

```markdown
## [Post Title] - Score: X/10 (XX points)

### Scores Breakdown:
- **Entertainment:** XX/30 (Hook: X/10, Feed-Worthy: X/10, Memorable: X/10)
- **Uniqueness:** XX/25 (Angle: X/10, Mitchell-Specific: X/10, Contribution: X/5)
- **Criteria:** XX/30 ([Type-specific breakdown])
- **Technical:** XX/15 (Voice: X/5, Length: X/3, Format: X/3, Anon: X/2, CTA: X/2)

### What Works:
- [Specific positive element 1]
- [Specific positive element 2]

### What Needs Work:
- **[Issue 1]:** [Specific explanation with example]
  - Fix: [Concrete suggestion]

- **[Issue 2]:** [Specific explanation with example]
  - Fix: [Concrete suggestion]

### Revision Priority:
[High / Medium / Low] - [Reasoning]

### Suggested Rewrite Approach:
[1-2 sentences guiding the revision]

---
```

**Example Critique:**

```markdown
## Education Nonprofit Campaign Results - Score: 6/10 (63 points)

### Scores Breakdown:
- **Entertainment:** 18/30 (Hook: 7/10, Feed-Worthy: 6/10, Memorable: 5/10)
- **Uniqueness:** 18/25 (Angle: 7/10, Mitchell-Specific: 8/10, Contribution: 3/5)
- **Criteria:** 20/30 (Metric leads: 10/10, Explanation: 7/10, Undersells: 3/10)
- **Technical:** 7/15 (Voice: 3/5, Length: 2/3, Format: 2/3, Anon: 2/2, CTA: 0/2)

### What Works:
- Metric is strong (12% reply rate)
- Anonymization solid
- Voice mostly on-point

### What Needs Work:
- **Overselling:** "Incredible results" and "massive transformation" sound salesy, not Mitchell.
  - Fix: "12% reply rate. Not incredible. Just relevant." (undersell)

- **Missing CTA:** Results posts can end without CTA, but this one feels incomplete.
  - Fix: Add soft CTA or remove setup that implies more coming

- **Paragraph structure:** One 6-sentence paragraph hurts readability
  - Fix: Break into 2-3 short paragraphs with blank lines

### Revision Priority:
Medium - Core content good, needs voice and structure fixes

### Suggested Rewrite Approach:
Tone down the hype language. Let the metric speak. Break into shorter paragraphs. Add soft CTA or remove expectation of one.

---
```

**Typefully Publishing Logic:**

```yaml
Threshold: Score must be 8+ (80 points or higher)

Pre-Publish Checklist:
  - [ ] Score verified 8+
  - [ ] Recent drafts checked for sequencing conflicts
  - [ ] Funnel mix balanced (60% top, 30% mid, 10% bottom)
  - [ ] Post type diversity (avoid 3+ same type in a row)
  - [ ] Voice spot-check passed
  - [ ] Anonymization verified
  - [ ] Frontmatter updated with score

Sequencing Rules:

  Avoid:
    - Back-to-back same post type (e.g., Case Study → Case Study)
    - Back-to-back same funnel stage (e.g., Bottom → Bottom → Bottom)
    - Three+ Pain Points in a row (too aggressive)
    - Stories/Personal clustered (spread personality content)

  Good Patterns:
    - Personal → Pain Point → Shallow Idea → How-To → Story → Results
    - Story → How-To → Personal → Case Study → Shallow Idea → Pain Point
    - Alternate funnel stages: Top → Mid → Top → Top → Mid → Bottom

  Check Recent Drafts:
    - Use get_scheduled_drafts to see last 10 queued posts
    - Identify post types and funnel stages
    - Place new post to balance distribution

Create Draft Parameters:

  content:
    - Strip frontmatter (Typefully doesn't need it)
    - Remove markdown headers if shortform (Typefully auto-formats)
    - Keep formatting (blank lines, bullets, emphasis)

  schedule_date: null
    - Always null (Mitchell manually schedules)
    - Never auto-schedule

  threadify:
    - false for shortform (under 280 characters stays single tweet)
    - true for longform (over 280 characters auto-threads)

  auto_retweet_enabled: false
  auto_plug_enabled: false
    - Mitchell controls these manually

  Example API call:
    mcp__typefully__create_draft(
      content="12% reply rate for an education nonprofit...",
      schedule_date=null,
      threadify=false,
      auto_retweet_enabled=false,
      auto_plug_enabled=false
    )
```

**Funnel Mix Tracking:**

```yaml
Target Distribution (per month):
  - Top: 60% (~34 posts)
  - Mid: 30% (~17 posts)
  - Bottom: 10% (~5 posts)

Tracking Method:
  - Count posts by funnel stage in current weekly batch
  - If skewed (e.g., 80% top), prioritize mid/bottom posts next
  - Weekly summary includes cumulative distribution

  Example:
    Week 1: 8 top, 3 mid, 1 bottom (67% / 25% / 8%) ✅ On target
    Week 2: 10 top, 2 mid, 0 bottom (83% / 17% / 0%) ⚠️ Need more mid/bottom
    Week 3: Prioritize mid/bottom posts to rebalance
```

**Weekly Summary Report Format:**

```markdown
# Weekly Content Review Summary

**Date Range:** [YYYY-MM-DD] - [YYYY-MM-DD]
**Review Date:** [YYYY-MM-DD]

---

## Overview

**Posts Reviewed:** X
**Posts Approved (8+):** X (XX%)
**Posts Flagged (<8):** X (XX%)
**Posts Scrapped:** X
**Average Score:** X.X/10

---

## Approved for Publishing (Pushed to Typefully)

| Title | Post Type | Funnel | Score | Notes |
|-------|-----------|--------|-------|-------|
| [Title] | Story | Top | 9/10 | Strong emotional arc |
| [Title] | Pain Point | Mid | 8/10 | Good empathy, solid proof |
| [Title] | Case Study | Bottom | 10/10 | Exceptional detail, perfect voice |
[... continue for all approved]

---

## Needs Revision

| Title | Post Type | Score | Primary Issue | Revision Priority |
|-------|-----------|-------|---------------|-------------------|
| [Title] | How-To | 7/10 | Too generic, lacks Mitchell's voice | Medium |
| [Title] | Results | 6/10 | Oversells, poor structure | High |
[... continue for flagged posts]

---

## Scrapped (Not Worth Revision)

| Title | Post Type | Score | Reason |
|-------|-----------|-------|--------|
| [Title] | Shallow Idea | 4/10 | Generic platitude, no unique angle |
[... continue for scrapped]

---

## Top-Performing Elements This Week

**What Worked:**
- [Pattern 1: e.g., "Stories with specific family moments resonated (avg 9/10)"]
- [Pattern 2: e.g., "Pain points with bold hooks scored higher than soft leads"]
- [Pattern 3: e.g., "Case studies with 3-5 approach bullets performed best"]

**What Underperformed:**
- [Pattern 1: e.g., "Generic how-tos without tool names scored poorly"]
- [Pattern 2: e.g., "Forced Kobe references felt inauthentic"]

---

## Areas for Improvement

**Voice Consistency:**
[Observations about voice drift, if any]

**Criteria Alignment:**
[Patterns of criteria misses]

**Structural Issues:**
[Formatting, length, or organization problems]

---

## Funnel Distribution

**This Week:**
- Top: X posts (XX%)
- Mid: X posts (XX%)
- Bottom: X posts (XX%)

**Month-to-Date:**
- Top: X posts (XX%) [Target: 60%]
- Mid: X posts (XX%) [Target: 30%]
- Bottom: X posts (XX%) [Target: 10%]

**Status:** [✅ On Target / ⚠️ Needs Rebalancing / ❌ Significantly Off]

**Recommendation:** [Guidance for next week's content focus]

---

## Sequencing Notes

**Typefully Draft Order (Most Recent):**
1. [Post type] - [Funnel]
2. [Post type] - [Funnel]
3. [Post type] - [Funnel]
[... last 10 posts]

**Observations:**
[Any clustering or imbalance to address]

---

## Recommendations for Next Week

1. [Action item 1, e.g., "Focus on mid-funnel how-tos (underrepresented)"]
2. [Action item 2, e.g., "Revise [X post] before next batch"]
3. [Action item 3, e.g., "Refine content-writer prompt for voice drift on pain points"]

---

**Prepared by:** content-editor
**Date:** [YYYY-MM-DD]
```

**Editor Verification Checklist:**

```markdown
Before finalizing review:
- [ ] All posts scored with rubric
- [ ] Scores converted to 1-10 scale correctly
- [ ] Critique provided for all posts <8
- [ ] Posts 8+ pushed to Typefully with proper settings
- [ ] Sequencing checked against recent drafts
- [ ] Funnel mix tracked and summarized
- [ ] Frontmatter updated with scores on all posts
- [ ] Weekly summary generated
- [ ] Recommendations actionable and specific
- [ ] Top patterns identified (what to replicate)
- [ ] Problem patterns identified (what to fix)
```

---

### 7. Skill: transcript-tracker

**File:** `skills/transcript-tracker/SKILL.md`

**Purpose:** Prevent duplicate transcript processing

**Interface:**
```yaml
Trigger: Automatically invoked when transcript-anonymizer runs

Input:
  - transcript_ids: array<string> (IDs about to be processed)

Output:
  - new_ids: array<string> (IDs not yet processed)
  - already_processed: array<string> (IDs to skip)

File: /content/source-material/processed-transcript-ids.txt
```

**File Format:**

```
# Processed Fireflies Transcript IDs
# Format: [ID] | [Date Processed] | [Call Type] | [Brief Topic]
# DO NOT manually edit unless correcting errors

01K7SNGDYNCEWNAYX1VTFVAYRD | 2025-10-26 | Internal Strategy | Platform Migration
01K8BFEDRGVJ8A1VXNQEB7CDC7 | 2025-10-26 | Internal Strategy | Performance Reviews
01K9FJASKLDJFKLSDJFKL34KL | 2025-10-27 | Client Sync | TeachAid Regional Campaign
[... continue chronologically]
```

**Logic:**

```python
def check_duplicates(transcript_ids_to_process):
    # Read processed IDs file
    processed_file = read_file("/content/source-material/processed-transcript-ids.txt")

    # Extract existing IDs
    existing_ids = []
    for line in processed_file.split("\n"):
        if line.strip() and not line.startswith("#"):
            transcript_id = line.split("|")[0].strip()
            existing_ids.append(transcript_id)

    # Filter out already-processed IDs
    new_ids = [id for id in transcript_ids_to_process if id not in existing_ids]
    already_processed = [id for id in transcript_ids_to_process if id in existing_ids]

    return {
        "new_ids": new_ids,
        "already_processed": already_processed
    }

def update_processed_ids(new_processed_ids, call_types, topics):
    # Append new IDs to file
    timestamp = get_current_date()  # YYYY-MM-DD

    new_lines = []
    for i, id in enumerate(new_processed_ids):
        line = f"{id} | {timestamp} | {call_types[i]} | {topics[i]}"
        new_lines.append(line)

    append_to_file("/content/source-material/processed-transcript-ids.txt", "\n".join(new_lines))
```

**Error Handling:**

```yaml
If file doesn't exist:
  - Create new file with header
  - Continue processing all IDs as new

If file corrupted:
  - Log error
  - Create backup of corrupted file
  - Create fresh file
  - Warn user to check for duplicates manually

If write fails:
  - Log error
  - Return list of processed IDs to user
  - Suggest manual update
```

---

### 8. Command: /generate-content

**File:** `commands/generate-content.md`

**Purpose:** Orchestrate full content generation pipeline

**Syntax:**
```bash
/generate-content [date-range|transcript-ids]

Examples:
  /generate-content last-week
  /generate-content 2025-10-19 to 2025-10-26
  /generate-content 01K7SNGDYNCEWNAYX1VTFVAYRD,01K8BFEDRGVJ8A1VXNQEB7CDC7
```

**Execution Workflow:**

```yaml
Step 1: Parse Input
  - Determine if date range or specific IDs
  - Validate format
  - If "last-week", calculate date range

Step 2: Invoke transcript-anonymizer
  - Pass date range or IDs
  - Wait for completion
  - Capture output: anonymized summaries

Step 3: Invoke data-enricher
  - No input required (pulls recent campaigns)
  - Wait for completion
  - Capture output: authority statements

Step 4: Invoke content-ideator
  - Input: Anonymized summaries + authority statements
  - Wait for completion
  - Capture output: Content ideas queue

Step 5: Invoke content-writer
  - Input: Top 10-15 high-priority ideas from queue
  - Wait for completion
  - Capture output: Drafted posts

Step 6: Invoke content-editor
  - Input: All drafted posts
  - Wait for completion
  - Capture output: Editorial reviews + Typefully drafts

Step 7: Summary Report
  - Display summary to user:
    - Transcripts processed
    - Ideas generated
    - Posts drafted
    - Posts approved (8+)
    - Posts flagged for revision
    - Typefully drafts created
    - Link to weekly summary report
```

**Output Summary Format:**

```markdown
# Content Generation Complete

## Pipeline Summary

**Transcripts Processed:** X
**Authority Statements Added:** X
**Content Ideas Generated:** X (High: X, Med: X, Low: X)
**Posts Drafted:** X
**Posts Approved:** X (pushed to Typefully)
**Posts Flagged:** X (need revision)

---

## Output Locations

**Anonymized Summaries:**
/content/source-material/transcription-summaries/

**Content Ideas Queue:**
/content/source-material/content-ideas-queue.md

**Drafted Posts:**
- Shortform: /content/output/shortform/
- Longform: /content/output/longform/

**Editorial Review:**
/content/output/editorial-reviews/[date]-review-log.md

**Typefully:**
X drafts created (manual scheduling required)

---

## Next Steps

1. Review Typefully drafts and schedule manually
2. Review flagged posts in editorial review
3. Revise posts scoring <8 if desired
4. Check weekly summary for patterns and recommendations

---

**Generated:** [timestamp]
**Pipeline Duration:** [X minutes]
```

**Error Handling:**

```yaml
If Stage Fails:
  - Log error with stage name
  - Display error message to user
  - Provide troubleshooting steps
  - Offer to retry failed stage
  - Do NOT continue to next stage (fail-safe)

If No Transcripts Found:
  - Message: "No new transcripts found for [date range]"
  - Suggest checking date range or Fireflies connection
  - Exit gracefully

If All Posts Score <8:
  - Complete pipeline normally
  - Flag in summary: "No posts met 8+ threshold this batch"
  - Recommend reviewing content-writer prompt or raising voice concerns
```

---

### 9. Command: /analyze-campaigns

**File:** `commands/analyze-campaigns.md`

**Purpose:** Quick campaign performance pull for authority statements

**Syntax:**
```bash
/analyze-campaigns [filter]

Examples:
  /analyze-campaigns all
  /analyze-campaigns last-30-days
```

**Execution Workflow:**

```yaml
Step 1: Invoke data-enricher
  - Pass filter parameter
  - Wait for completion
  - Capture output: Authority statements

Step 2: Display Summary
  - Campaigns analyzed
  - Exceptional campaigns found
  - Outliers flagged
  - Link to authority-statements.md
```

**Output Format:**

```markdown
# Campaign Analysis Complete

**Campaigns Analyzed:** X
**Exceptional Campaigns:** X (met thresholds)
**Outliers Flagged:** X (20%+ reply rate or other standout metric)

---

## Top Performers

1. **[Industry] Campaign:** [Brief anonymized description]
   - Reply Rate: X%
   - Engaged Leads: X
   - Key Element: [What made it work]

2. **[Industry] Campaign:** [Brief anonymized description]
   - Reply Rate: X%
   - Meetings Booked: X
   - Key Element: [What made it work]

[... top 5]

---

## Updated File

/content/source-material/authority-statements.md

**New Statements Added:** X
**Total Statements:** X

---

**Generated:** [timestamp]
```

---

## Directory Structure (Complete)

```
c:\Users\mitch\Desktop\Claude Code Projects\
  .claude/
    plugins/
      meeting-content-generator/
        .claude-plugin/
          plugin.json
        agents/
          transcript-anonymizer.md
          data-enricher.md
          content-ideator.md
          content-writer.md
          content-editor.md
        skills/
          transcript-tracker/
            SKILL.md
        commands/
          generate-content.md
          analyze-campaigns.md
        README.md

  content/
    output/
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
      carousels-for-review/
      editorial-reviews/
    source-material/
      transcription-summaries/
      thought-dumps/
      authority-statements.md
      content-ideas-queue.md
      processed-transcript-ids.txt
    libraries/
      brand-voice.md
      post-type-criteria.md
      successful-patterns.md
      authority-statements.md
      service-offering-map.md
```

---

## Data Structure Specifications

### Anonymized Summary File

```yaml
filename: YYYY-MM-DD-[call-type]-[topic-slug].md

frontmatter:
  original_transcript_id: string
  date: YYYY-MM-DD
  call_type: enum [Sales, Client Sync, Internal Strategy, Partner, Consultant, Training]
  duration_minutes: integer
  participants: array<string> (anonymized)
  anonymization_log: array<string> (transformation records)
  extraction_timestamp: ISO 8601

body:
  - Heading: "[Call Type]: [Topic]"
  - Section: Participants (Anonymized)
  - Section: Call Summary
  - Section: Content Opportunities
    - Subsection: Quotable Moments
    - Subsection: Success Stories
    - Subsection: Objection Handling
    - Subsection: How-To Moments
    - Subsection: Personal Updates
  - Section: Anonymization Audit (checklist)
```

### Authority Statement Entry

```yaml
heading: "### [Industry] - [Offer Type] Campaign"

fields:
  client_profile: string (anonymized descriptor)
  target_persona: string (role/title)
  campaign_theme: string (primary approach)
  volume: string (contact count range)
  approach: string (2-3 sentences)
  results:
    reply_rate: percentage
    engaged_leads: integer
    meetings_booked: integer (optional)
    duration: string (X weeks)
    unique_element: string
  content_snippet: string (ready to paste)
  categorization:
    industry: string
    offer: string
    persona: string
    result_type: string
    theme: string
```

### Content Brief

```yaml
heading: "### [Content Idea Title]"

fields:
  post_type: enum [Stories, Shallow Ideas, Personal Life, Pain Points, How-Tos, Results, Case Studies, Giveaways]
  funnel_stage: enum [Top, Mid, Bottom]
  priority: enum [High, Medium, Low] + reasoning
  source_transcript: filename
  extraction_date: YYYY-MM-DD
  hook_angle: string (1-2 sentences)
  key_points: array<string> (3-5 items)
  authority_proof: string (or "N/A")
  cta_strategy: string (type + reasoning)
  interest_opportunity: string (or "None")
  notes: string (special considerations)
```

### Drafted Post

```yaml
filename: YYYY-MM-DD-[title-slug].md

frontmatter:
  title: string
  post_type: enum [Types]
  funnel_stage: enum [Top, Mid, Bottom]
  priority: enum [High, Medium, Low]
  source_idea_id: string (reference)
  draft_date: YYYY-MM-DD
  drafted_by: "content-writer"
  word_count: integer
  libraries_referenced: array<string>
  status: enum [pending_review, approved, flagged, scrapped]
  editor_score: float (after review)
  editor_notes: string (after review)

body: [Post content]
```

---

## API Integration Specifications

### Fireflies MCP

```yaml
Functions Used:
  - mcp__fireflies__get_transcripts
  - mcp__fireflies__search
  - mcp__fireflies__fetch

transcript-anonymizer Usage:
  get_transcripts:
    parameters:
      fromDate: YYYY-MM-DD
      toDate: YYYY-MM-DD
      limit: 50 (max per call)
    returns: Array of transcript metadata

  fetch:
    parameters:
      id: transcript_id
    returns: Full transcript with sentences, speakers, metadata
```

### EmailBison MCP

```yaml
Functions Used:
  - mcp__bison_mcp__emailbison_list_campaigns
  - mcp__bison_mcp__emailbison_campaign_details
  - mcp__bison_mcp__emailbison_get_scheduled_emails
  - mcp__bison_mcp__emailbison_list_leads

data-enricher Usage:
  list_campaigns:
    parameters: None (gets all accessible campaigns)
    returns: Array of campaign summaries

  campaign_details:
    parameters:
      id: campaign_id
    returns: Full campaign metrics (reply rate, engaged count, duration)

  list_leads:
    parameters:
      search: optional filter
    returns: Lead records (for cross-referencing)
```

### Airtable MCP

```yaml
Functions Used:
  - mcp__airtable__list_records
  - mcp__airtable__search_records

data-enricher Usage:
  search_records:
    parameters:
      baseId: Mitchell's base ID
      tableId: "Leads" (or appropriate table)
      searchTerm: campaign name
    returns: Matching lead records with booking status
```

### Typefully MCP

```yaml
Functions Used:
  - mcp__typefully__create_draft
  - mcp__typefully__get_scheduled_drafts

content-editor Usage:
  create_draft:
    parameters:
      content: string (post text, no frontmatter)
      schedule_date: null (always null for manual review)
      threadify: boolean (false for shortform, true for longform)
      auto_retweet_enabled: false
      auto_plug_enabled: false
    returns: Draft ID and status

  get_scheduled_drafts:
    parameters: None
    returns: Recent drafts for sequencing check
```

---

## Configuration & Settings

### Plugin Configuration (plugin.json)

```json
{
  "configuration": {
    "contentRootPath": "/content",
    "modelPreference": "sonnet",
    "weeklyTargets": {
      "shortform": 48,
      "longform": 8,
      "funnelMix": {
        "top": 0.6,
        "mid": 0.3,
        "bottom": 0.1
      }
    },
    "thresholds": {
      "smallVolume": 5000,
      "exceptionalReplyRate": 12,
      "exceptionalBookingRate": 8,
      "outlierReplyRate": 20,
      "minEngagedLeads": 50
    },
    "scoring": {
      "publishThreshold": 8,
      "targetApprovalRate": 0.6,
      "targetAverageScore": 8.5
    }
  }
}
```

### Environment Requirements

```yaml
Required MCP Servers:
  - fireflies (connected, working)
  - bison_mcp (connected, working)
  - pipedream-airtable (connected, working)
  - pipedream-typefully (connected, working)

Required Directories:
  - /content/output/shortform/* (6 subdirectories)
  - /content/output/longform/* (3 subdirectories)
  - /content/output/carousels-for-review/
  - /content/output/editorial-reviews/
  - /content/source-material/transcription-summaries/
  - /content/source-material/
  - /content/libraries/

Required Files (Created During Setup):
  - /content/source-material/processed-transcript-ids.txt
  - /content/source-material/content-ideas-queue.md
  - /content/source-material/authority-statements.md
  - /content/libraries/brand-voice.md
  - /content/libraries/post-type-criteria.md
  - /content/libraries/successful-patterns.md
  - /content/libraries/service-offering-map.md
```

---

## Performance Targets

```yaml
Execution Speed:
  - Full pipeline (5 transcripts): < 30 minutes
  - Single agent execution: < 5 minutes
  - Command response time: < 2 seconds

Quality Metrics:
  - Average editor score: >= 7.5/10
  - Approval rate (8+ posts): >= 60%
  - Anonymization accuracy: 100%
  - Duplicate prevention: 0 reprocessed transcripts

Content Output:
  - Weekly drafts: 12-15 posts
  - Monthly volume: 48 shortform + 8 longform
  - Funnel distribution: 60% top, 30% mid, 10% bottom
  - Voice fidelity: Indistinguishable from Mitchell's manual writing
```

---

## Testing & Validation

### Unit Testing (Phase 4)

```yaml
transcript-anonymizer:
  test_cases:
    - Input: Transcript with client name "Foundation"
      Expected: Anonymized to "Education nonprofit selling..."
      Verify: No "Foundation" appears in output

    - Input: Transcript with "$500,000 pipeline"
      Expected: Generalized to "significant six-figure pipeline"
      Verify: No exact revenue number in output

    - Input: Processed transcript ID
      Expected: Skipped (duplicate prevention)
      Verify: Not reprocessed, logged as already handled

data-enricher:
  test_cases:
    - Input: Campaign with 15% reply rate, 3K contacts
      Expected: Flagged as exceptional (outlier)
      Verify: Appears in authority-statements.md

    - Input: Campaign with 8% reply rate, 10K contacts, 60 engaged
      Expected: Flagged as exceptional (large volume criteria)
      Verify: Properly categorized by industry/offer/persona

content-ideator:
  test_cases:
    - Input: Summary with client success story + strong metrics
      Expected: Case Study brief, Bottom funnel, High priority
      Verify: All required brief fields populated

    - Input: Summary with Mitchell's objection handling
      Expected: Pain Point brief, Mid funnel, High/Medium priority
      Verify: Hook captures objection boldly

content-writer:
  test_cases:
    - Input: Story brief (personal moment)
      Expected: 80-150 words, emotional arc, no hard CTA
      Verify: Voice sounds like Mitchell, relatable

    - Input: Case Study brief
      Expected: 250-400 words, Situation → Approach → Results
      Verify: Anonymization intact, sophisticated but accessible

content-editor:
  test_cases:
    - Input: High-quality post (expected 9/10)
      Expected: Score 85-89, pushed to Typefully
      Verify: Draft created with proper settings

    - Input: Mediocre post (expected 6/10)
      Expected: Score 60-69, flagged with critique
      Verify: Constructive feedback provided
```

### Integration Testing

```yaml
End-to-End Pipeline:
  - Run /generate-content on 2-3 recent transcripts
  - Verify each stage completes successfully
  - Check output files created in correct locations
  - Verify Typefully drafts for approved posts
  - Review weekly summary for accuracy

Voice Validation:
  - Generate 10 posts from real transcripts
  - Mitchell reviews: "Does this sound like me?"
  - Target: 8/10 posts approved for voice
  - Refine prompts based on feedback

Anonymization Audit:
  - Process transcripts with known client names
  - Search output for any identifying information
  - Target: 0 leaks
  - Fix any anonymization gaps in prompt
```

---

## Maintenance & Updates

### Quarterly Reviews

```yaml
Library Updates:
  - brand-voice.md: Capture voice evolution, new patterns
  - successful-patterns.md: Add high-performing post formats
  - post-type-criteria.md: Refine success criteria based on data

Prompt Refinement:
  - Review weekly summaries for recurring issues
  - Adjust sub-agent prompts to address pattern failures
  - A/B test prompt variations for quality improvement

Threshold Calibration:
  - Review campaign performance data
  - Adjust "exceptional" thresholds if needed
  - Update scoring rubric weights based on what predicts engagement
```

### Version Control

```yaml
Plugin Versioning:
  - Semantic versioning (Major.Minor.Patch)
  - Document changes in CHANGELOG.md
  - Tag releases in git

Prompt Versioning:
  - Date-stamp major prompt changes in sub-agent files
  - Keep changelog section at top of each agent file
  - Track performance before/after changes
```

---

## Security & Privacy

```yaml
Anonymization Protocol:
  - All client data processed through anonymizer FIRST
  - No raw transcripts stored in content directories
  - Original transcripts remain in Fireflies (separate system)
  - Anonymization log maintained for audit trail

Access Control:
  - Plugin files readable by Mitchell only (or trusted team)
  - Typefully drafts visible to Mitchell's account only
  - Authority statements library contains no identifying information

Data Retention:
  - Anonymized summaries: Retain indefinitely (safe)
  - Drafted posts: Retain indefinitely (safe)
  - Original transcripts: Managed in Fireflies per retention policy
  - processed-transcript-ids.txt: Retain indefinitely (necessary for duplicate prevention)
```

---

## Troubleshooting Guide

### Common Issues

```yaml
"No transcripts found for date range":
  causes:
    - Date range has no calls
    - Fireflies MCP connection issue
    - Date format incorrect
  fixes:
    - Verify calls exist in Fireflies for that range
    - Check MCP connection: Try manual Fireflies query
    - Ensure date format: YYYY-MM-DD

"All posts scored below 8":
  causes:
    - Content-writer prompt drift
    - Low-quality source material
    - Scoring rubric too strict
  fixes:
    - Review flagged posts for patterns
    - Refine content-writer prompt
    - Check if transcripts had sufficient content opportunities
    - Consider adjusting rubric if consistently harsh

"Anonymization missed client name":
  causes:
    - Unusual name format
    - Acronym not caught
    - Client mentioned in unexpected context
  fixes:
    - Add to anonymization rules in transcript-anonymizer prompt
    - Update verification checklist
    - Re-process transcript if caught before publishing

"Typefully draft creation failed":
  causes:
    - MCP connection issue
    - Content formatting error
    - API rate limit
  fixes:
    - Verify Typefully MCP connection
    - Check post content for special characters
    - Wait and retry if rate limited

"Duplicate transcript processed":
  causes:
    - transcript-tracker skill malfunction
    - processed-transcript-ids.txt corrupted or missing
  fixes:
    - Verify processed-transcript-ids.txt exists and readable
    - Check skill logic in SKILL.md
    - Manually add ID to file to prevent future duplication
```

---

## Open Questions & Decisions Needed

```yaml
1. Content Root Path:
   question: "Is /content at project root okay, or different location?"
   default: "/content"
   impact: All sub-agents reference this path

2. Airtable Base/Table IDs:
   question: "Which Airtable base and table contain lead/booking data?"
   needed_for: data-enricher cross-referencing
   impact: Campaign booking rate calculations

3. Giveaway Approval Flow:
   question: "How should Mitchell review/approve giveaway posts before drafting?"
   options:
     - Flag in content-ideas-queue, Mitchell marks approved before writer runs
     - Draft anyway, Mitchell reviews in Typefully
     - Separate /giveaway-approvals/ review step
   default: Flag in queue, manual approval before drafting

4. Weekly Trigger Automation:
   question: "Prefer manual /generate-content trigger or explore automation?"
   default: Manual trigger (Mitchell runs weekly)
   future: Consider cron job or scheduled task in Phase 6

5. Carousel Creation Priority:
   question: "Priority for visual content, or focus on text first?"
   default: Text-first MVP, carousels Phase 6
   impact: content-writer scope

6. Tool Access Restrictions:
   question: "Any specific MCP tools to restrict for security?"
   default: Only listed tools per sub-agent
   impact: Security posture
```

---

## Next Steps (After Specification Approval)

1. Mitchell reviews and approves this specification
2. Proceed to Spec-Kit Phase 3: Technical Planning
3. Generate detailed implementation tasks
4. Begin Phase 1: Foundation Setup

---

**Document Status:** ⏳ Awaiting Mitchell's Approval
**Governed By:** [01_Constitution.md](01_Constitution.md)
**Last Updated:** 2025-10-29
**Version:** 1.0
