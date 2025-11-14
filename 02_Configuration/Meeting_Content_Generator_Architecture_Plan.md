# Meeting Content Generator - Complete Architecture Plan
**Version:** 1.0
**Date:** 2025-10-27
**Status:** Awaiting Approval & Spec-Kit Planning

---

## Executive Summary

Building a comprehensive content generation system that transforms Fireflies meeting transcripts into publish-ready social media content for Mitchell Keller/LeadGrow. The system uses 5 specialized sub-agents, 1 skill, 2 commands, and supporting libraries, all following Anthropic best practices and ultimate prompt engineering principles.

**Goal:** Weekly content generation from calls → Typefully drafts, fully automated with quality control.

---

## Architecture Philosophy

### Applied Best Practices

1. ✅ **Clarity Above All** - Each agent has explicit, unambiguous instructions
2. ✅ **Show, Don't Tell** - Examples embedded in agent prompts and libraries
3. ✅ **Brilliant New Employee Model** - Agents get full context about "why" tasks matter
4. ✅ **80/20 XML Usage** - Only essential tags: `<task>`, `<input>`, `<instructions>`, `<examples>`
5. ✅ **Consistent Tag Referencing** - Always reference content by exact tag names
6. ✅ **Hierarchical Nesting** - Related content grouped logically
7. ✅ **Single Responsibility** - Each agent does ONE thing exceptionally well
8. ✅ **Tool Restriction** - Minimal necessary tools per agent
9. ✅ **Few-Shot Examples** - 2-3 diverse examples per agent
10. ✅ **Verification Checklists** - Explicit quality checks before output
11. ✅ **Role-Playing** - Clear "You are X" framing with context
12. ✅ **Explicit Scoring Rubrics** - Removes subjectivity
13. ✅ **Process Breakdown** - Clear step-by-step with action/input/output
14. ✅ **Constraints Section** - What NOT to do explicitly stated
15. ✅ **Context Provision** - Why tasks matter, not just what to do

---

## System Components

### Plugin Structure

**Name:** `meeting-content-generator`
**Type:** Claude Code Plugin
**Location:** `.claude/plugins/meeting-content-generator/`

**Structure:**
```
.claude/plugins/meeting-content-generator/
  ├── .claude-plugin/
  │   └── plugin.json (manifest)
  ├── agents/
  │   ├── transcript-anonymizer.md
  │   ├── data-enricher.md
  │   ├── content-ideator.md
  │   ├── content-writer.md
  │   └── content-editor.md
  ├── skills/
  │   └── transcript-tracker/
  │       └── SKILL.md
  ├── commands/
  │   ├── generate-content.md
  │   └── analyze-campaigns.md
  └── README.md
```

### Content Repository Structure

**Location:** `/content/` (at project root)

```
/content
  /output
    /shortform
      /stories/
      /shallow-ideas/
      /personal-life/
      /pain-points/
      /how-tos/
      /results/
    /longform
      /case-studies/
      /deep-dives/
      /authority-frameworks/
    /carousels-for-review/
  /source-material
    /transcription-summaries/
    /thought-dumps/
    /authority-statements.md
    /content-ideas-queue.md
    /processed-transcript-ids.txt
  /libraries
    /brand-voice.md
    /post-type-criteria.md
    /successful-patterns.md
    /service-offering-map.md
  /output/editorial-reviews/
```

---

## The 5 Sub-Agents

### 1. transcript-anonymizer

**Purpose:** Extract and sanitize Fireflies transcripts for content generation

**Mental Model:** Data processor who protects sensitive information while preserving content gold

**Tools:** `mcp__fireflies__get_transcripts`, `mcp__fireflies__search`, `mcp__fireflies__fetch`, `Read`, `Write`

**Key Responsibilities:**
- Fetch transcripts (date range or specific IDs)
- Anonymize: client names, team members (non-LeadGrow), emails, revenue numbers
- Preserve: Mitchell's quotes, LeadGrow team, tools/tech, general metrics
- Categorize: Sales/Client Sync/Internal Strategy/Partner/Consultant/Training
- Extract: Quotable moments, objection handling, success stories, how-tos, personal updates
- Prevent duplicates via processed-transcript-ids tracker

**Input:** Date range or transcript IDs
**Output:** `/content/source-material/transcription-summaries/YYYY-MM-DD-[call-type]-[topic].md`

**Anonymization Rules:**
- Client names → "[industry/type] company selling [product] to [audience]"
- Client team → "Client CMO", "Their VP of Sales"
- Client emails → Remove entirely
- Revenue → "significant growth" or ranges
- Preserve: Mitchell, LeadGrow team, tools, metrics

**Example Flow:**
```
Input: Foundation (education nonprofit) call about $500K pipeline
Output: "Education nonprofit" with "significant pipeline growth"
Anonymization Log: Foundation → education nonprofit, $500K → significant growth
```

---

### 2. data-enricher

**Purpose:** Pull campaign performance data and create authority statements

**Mental Model:** Data analyst who finds proof points to back up content

**Tools:** `mcp__bison_mcp__emailbison_*`, `mcp__airtable__*`, `Read`, `Write`

**Key Responsibilities:**
- Query EmailBison for campaign metrics (reply rates, engaged leads, duration)
- Cross-reference Airtable for booking/conversion data
- Identify "exceptionally well" campaigns
- Anonymize client names while preserving campaign details
- Categorize by: industry, offer type, target persona, result type, campaign theme
- Update authority-statements.md library

**Performance Thresholds:**
- **Small Volume (<5K):** 12%+ reply rate, 8%+ booking rate, 50+ engaged leads
- **Large Volume (>5K):** 50+ engaged leads, 8%+ reply rate, 4+ weeks sustained
- **Outliers (any):** 20-30%+ reply rate = immediately showcase

**Input:** Campaign data from EmailBison + Airtable
**Output:** Appends to `/content/source-material/authority-statements.md`

**Categorization:**
1. By Industry (SaaS, E-commerce, Agency, Education, etc.)
2. By Offer Type (Free trial, audit, partnership, discount)
3. By Target Persona (Founders, Marketing leaders, SDRs, Engineers)
4. By Result Type (Reply rate, meetings booked, pipeline)
5. By Campaign Theme (Situation-based, pain-focused, contrast-based)

---

### 3. content-ideator

**Purpose:** Transform summaries into prioritized content ideas

**Mental Model:** Content strategist who extracts maximum value from raw material

**Tools:** `Read`, `Write`

**Key Responsibilities:**
- Read anonymized summaries from transcription-summaries folder
- Map content opportunities to post types (Stories/Shallow Ideas/Personal/Pain Points/How-Tos/Results/Case Studies/Giveaways)
- Assign funnel stage (Top/Mid/Bottom)
- Prioritize: High (timely, unique, strong proof) / Medium (evergreen, solid) / Low (generic, weak)
- Create content briefs with hook, key points, authority proof, CTA strategy
- Organize queue by priority → funnel stage → post type

**Post Type Mapping:**

**Top of Funnel (Awareness/Personality):**
- Personal Updates → "Personal Life" posts
- Relatable moments + business lessons → "Stories"
- Broadly applicable insights → "Shallow Ideas" (with interest lens)

**Mid Funnel (Expertise/Trust):**
- Objection Handling → "Pain Points"
- How-To Moments → "How-Tos/Checklists"
- Campaign wins → "Results/Proof"

**Bottom Funnel (Conversion):**
- Multi-call successes → "Case Studies"
- Complete systems/frameworks → "Giveaways" (requires approval)

**Priority Criteria:**
- **High:** Timely, unique angle, strong proof, aligns with business goals
- **Medium:** Evergreen, good proof, solid but needs stronger hook
- **Low:** Generic, weak proof, nice-to-have

**Input:** Anonymized summaries
**Output:** `/content/source-material/content-ideas-queue.md`

**Content Brief Format:**
```markdown
### [Content Idea Title]

**Post Type:** [Type]
**Funnel Stage:** [Top/Mid/Bottom]
**Priority:** [High/Medium/Low] - [Reasoning]
**Source Transcript:** [Filename]

**Hook/Angle:** [1-2 sentence compelling entry]

**Key Points:**
- [Point 1]
- [Point 2]
- [Point 3]

**Authority Proof:** [Relevant metric/story]

**CTA Strategy:** [DM/Comment/YouTube/Website - what to do]

**Interest/Reference Opportunity:** [Kobe/Five Rings/etc. if relevant]

**Notes:** [Special considerations]
```

**Cadence Guidance:**
- 48 shortform/month (12/week, ~2/day for 6 days)
- 8 longform/month (2/week)
- Funnel mix: 60% top, 30% mid, 10% bottom

---

### 4. content-writer

**Purpose:** Draft posts with Mitchell's voice and personality

**Mental Model:** Mitchell's personal copywriter who's internalized his voice

**Tools:** `Read`, `Write`

**Key Responsibilities:**
- Pull content brief from ideas queue
- Reference: brand-voice.md, post-type-criteria.md, successful-patterns.md
- Write following type-specific criteria
- Apply voice: conversational, punchy, specific, casual authority, occasional profanity
- Inject interests/references organically (Kobe, Five Rings, Berserk, lifting, etc.)
- Craft CTAs (DM/Comment/YouTube/Website) with optional Rule of Threes humor
- Save to appropriate output folder with frontmatter metadata
- Mark idea as "drafted" in queue

**Voice Characteristics:**
- **Conversational:** Write like DMing a friend
- **Punchy:** Short sentences. Fragments work. Cut fluff.
- **Specific:** Numbers, tools, examples - never vague
- **Casual Authority:** Confident without arrogance
- **Occasionally Profane:** "shit", "damn", "f-off" when it adds punch

**Formatting:**
- Short paragraphs (1-3 sentences)
- Blank lines between sections
- ALL CAPS for critical emphasis
- Bullet points with ">" markdown
- Headers for longform structure
- NO emojis in shortform
- Sparingly in longform (✅❌ for lists only)

**Brand Positioning (weave naturally):**
- Situation-based messaging (not generic spray-and-pray)
- Technicians not maintenance men (specialists beat generalists)
- List is the message (targeting creates relevance)
- Men not markets (individual humans, not abstract segments)
- Relevance above all else
- First principles thinking
- Partnership model (proof of concept → expansion)

**Interest Bank (use sparingly, 1 in 5-7 posts):**
- Kobe Bryant: Mamba mentality, preparation meeting opportunity
- Five Rings: Strategic timing, adaptability, mastery
- Art of War: Positioning, indirect approaches, information advantage
- Vagabond: Journey of mastery, internal struggle
- Berserk: Relentless against odds, carrying weight
- Alex Hormozi: Volume negates luck, offers > copy, frontend offers
- Lifting/Running/Climbing: Physical discipline analogies
- Family: Nephews, wife, grounding moments
- History: Egypt, Alexander the Great, Philip II
- Game of Thrones: Strategy/positioning

**CTA Types:**
- **DM:** "DM me" or "Shoot me a message"
- **Comment:** "Comment '[KEYWORD]'" (giveaways only)
- **YouTube:** "Search 'Mitchell Keller [topic]' on YouTube" (NO links)
- **Website:** "Link in bio" or describe value

**Rule of Threes (occasional humor):**
```
Normal statement.
Normal statement.
Unexpected/funny twist.
```

**Input:** Content briefs from queue
**Output:** `/content/output/shortform/[type]/` or `/longform/[type]/` or `/carousels-for-review/`

**Post Type Execution Guidelines:**

**Stories:**
- Open with moment/emotion
- Build tension or challenge
- Realization or outcome
- Business connection (light touch)
- NO hard CTA

**Shallow Ideas:**
- State platitude
- Why it matters (1-2 sentences)
- Fresh angle via interest lens
- Ultra-short (3-7 sentences)

**Personal Life:**
- Just share update
- 1-3 sentences
- NO business tie-in required

**Pain Points:**
- Name problem boldly (hook)
- Why this hurts (empathy)
- What most people miss (insight)
- Authority proof
- CTA for solution

**How-Tos:**
- Hook (what you'll learn)
- Numbered steps or bullets
- Specific without full system
- Authority statement
- Optional CTA

**Results:**
- Lead with metric
- Context (anonymized)
- How (1-2 sentences)
- Soft CTA or none

**Case Studies:**
- Hook (result)
- Situation (anonymized challenge)
- Problem (why standard failed)
- Our Approach (3-5 elements)
- Results (specific metrics)
- CTA

**Giveaways:**
- Describe value
- What's included (bulleted)
- How it helps
- Engagement requirement (comment + follow)

---

### 5. content-editor

**Purpose:** Score, critique, and publish exceptional posts

**Mental Model:** Ruthless editor holding work to Mitchell's high standards

**Tools:** `Read`, `Write`, `mcp__typefully__create_draft`, `mcp__typefully__get_scheduled_drafts`

**Key Responsibilities:**
- Score posts: Entertainment (30%), Uniqueness (25%), Criteria Alignment (30%), Technical (15%)
- Provide constructive critique
- If 8+: push to Typefully as draft with proper sequencing
- If <8: document issues, flag for rewrite
- Track post type distribution (60% top, 30% mid, 10% bottom)
- Generate weekly summary report

**Scoring Rubric (out of 100, converted to 1-10):**

**Entertainment (30 points):**
- Hook immediately? (10 points)
- Would you read in feed? (10 points)
- Memorable moments? (10 points)
- Deductions: Boring hook (-5), no memorable moments (-5)

**Uniqueness (25 points):**
- Fresh angle or rehashed? (10 points)
- Could be anyone, or specifically Mitchell? (10 points)
- Adds to conversation or noise? (5 points)
- Deductions: Generic advice (-10), predictable (-5)

**Criteria Alignment (30 points):**
- References post-type-criteria.md for specifics
- Story: emotional connection? (30 points)
- Pain Point: empathy + authority + CTA? (30 points)
- How-To: actionable value? (30 points)
- Case Study: sophisticated but accessible? (30 points)
- Deductions: Missing required elements (-10 per element)

**Technical (15 points):**
- Voice consistency (sounds like Mitchell?) (5 points)
- Proper length (3 points)
- Formatting clean (3 points)
- Anonymization intact (2 points)
- CTA appropriate (2 points)
- Deductions: Vague claims (-2), forced references (-1), too salesy (-2), poor formatting (-1)

**Score Conversion:**
- 90-100 = 10/10
- 80-89 = 9/10
- 70-79 = 8/10
- 60-69 = 7/10
- 50-59 = 6/10
- etc.

**Typefully Publishing Logic:**

**Sequencing Rules:**
- Avoid back-to-back same type/funnel stage
- Check recent drafts via get_scheduled_drafts
- Bad: Case Study → Results → Pain Point (bottom-heavy)
- Good: Personal → Pain Point → Shallow Idea → How-To → Story → Results

**Funnel Mix Check:**
- Top: 60% volume
- Mid: 30% volume
- Bottom: 10% volume

**Push Settings:**
- `content`: [post text without frontmatter]
- `schedule_date`: null (manual review by Mitchell)
- `threadify`: false for shortform, true for longform >280 chars
- `auto_retweet_enabled`: false
- `auto_plug_enabled`: false

**Input:** Drafted posts from output folders
**Output:**
- `/content/output/editorial-reviews/YYYY-MM-DD-review-log.md`
- Typefully drafts (if 8+)
- Updated post frontmatter with scores

**Weekly Summary:**
```markdown
# Weekly Content Review Summary
**Date Range:** [Start] - [End]
**Posts Reviewed:** X
**Posts Approved:** X (X%)
**Average Score:** X.X/10

**Approved for Publishing:** [List with scores]
**Needs Revision:** [List with issues]
**Scrapped:** [List with reasons]

**Top-Performing Elements This Week:** [Patterns]
**Areas for Improvement:** [Recommendations]
**Sequencing Notes:** [Current mix vs target]
```

---

## Skill: transcript-tracker

**Purpose:** Maintain list of processed transcript IDs to prevent duplicates

**When Invoked:** Automatically when transcript-anonymizer runs

**File:** `/content/source-material/processed-transcript-ids.txt`

**Format:**
```
# Processed Fireflies Transcript IDs
# Format: [ID] | [Date Processed] | [Call Type] | [Brief Topic]

01K7SNGDYNCEWNAYX1VTFVAYRD | 2025-10-26 | Internal Strategy | Platform Migration
01K8BFEDRGVJ8A1VXNQEB7CDC7 | 2025-10-26 | Internal Strategy | Performance Reviews
```

**Functionality:**
1. Before processing: Check file for existing IDs
2. Only process new IDs not in file
3. After processing: Append new IDs with metadata

---

## User Commands

### `/generate-content [date-range|transcript-ids]`

**Purpose:** Orchestrate full content generation pipeline

**Workflow:**
1. transcript-anonymizer → pulls and sanitizes transcripts
2. data-enricher → adds campaign performance data
3. content-ideator → creates content briefs
4. content-writer → drafts posts (top 10-15 high-priority ideas)
5. content-editor → scores and publishes 8+ rated posts

**Examples:**
- `/generate-content last-week`
- `/generate-content 2025-10-19 to 2025-10-26`
- `/generate-content 01K7SNGDYNCEWNAYX1VTFVAYRD,01K8BFEDRGVJ8A1VXNQEB7CDC7`

**Output Locations:**
- Summaries: `/content/source-material/transcription-summaries/`
- Ideas: `/content/source-material/content-ideas-queue.md`
- Posts: `/content/output/shortform/` and `/content/output/longform/`
- Reviews: `/content/output/editorial-reviews/`
- Typefully: Drafts created automatically for 8+ posts

---

### `/analyze-campaigns [filter]`

**Purpose:** Quick campaign performance pull for authority statements

**Workflow:**
1. Calls data-enricher sub-agent
2. Pulls recent EmailBison + Airtable data
3. Identifies exceptional campaigns
4. Updates authority-statements.md
5. Flags outliers for potential posts

**Examples:**
- `/analyze-campaigns all`
- `/analyze-campaigns last-30-days`

**Output:** Updated `/content/source-material/authority-statements.md`

---

## Supporting Library Files

### 1. brand-voice.md

**Purpose:** Voice characteristics, positioning, interests, patterns

**Contents:**
- Core voice characteristics (conversational, punchy, specific, casual authority, occasionally profane)
- Brand positioning (situation-based messaging, technicians not maintenance men, men not markets, relevance above all, first principles, partnership model)
- Service offering essence (what we do, how we position, USP)
- Interest-based references (Kobe, Five Rings, Art of War, Vagabond, Berserk, Hormozi, lifting, family, history)
- Conversational patterns ("Here's how to do it.", "Stop doing X. Do Y instead.", etc.)
- Formatting preferences (short paragraphs, ALL CAPS, bullets, headers, no emojis)
- Rule of Threes humor pattern

---

### 2. post-type-criteria.md

**Purpose:** Success criteria for each post type

**Contents:**

**Top of Funnel:**
- **Stories:** Emotional connection, vulnerability, business lesson, relatable
- **Shallow Ideas:** Platitudes with fresh perspective via interests, reminder-style
- **Personal Life:** Purely humanizing, no business angle required

**Mid Funnel:**
- **Pain Points:** Empathy + understanding, authority proof, CTA for solution
- **How-Tos/Checklists:** Distilled process without full system, showcase expertise, occasional CTA
- **Results/Proof:** Screenshots with brief explanation, not full case study

**Bottom Funnel:**
- **Case Studies:** Full breakdown (situation → approach → results), show sophistication, "you could but shouldn't DIY" positioning
- **Giveaways:** High-value standalone, requires engagement (comment + follow), needs Mitchell approval

---

### 3. successful-patterns.md

**Purpose:** Winning formats from Christian Placencia analysis

**Contents:**

**Pattern 1: Infrastructure Breakdown**
- List 10-46 specific tools with descriptors
- Organized by function/category
- Concrete numbers (inbox counts, domain ratios)
- Ends with bold claim

**Pattern 2: Year-Over-Year Comparison**
- "X in 2021 vs X in 2025"
- Shows evolution and sophistication
- Positions as ahead of curve

**Pattern 3: Gated High-Value Lead Magnet**
- Describe what's inside (specific modules)
- Emphasize results achieved
- Scarcity/exclusivity angle
- CTA: "Comment + Follow"

**Pattern 4: "Stop doing X, do Y instead"**
- Call out common mistake
- Explain why wrong
- Provide better alternative
- Ultra-tactical

**Pattern 5: Simple Template Reveal**
- "Best performing [X] I've ever written"
- Show template
- Explain why it works (usually: great offer)
- Emphasize simplicity

**Pattern 6: Raw Tactical Breakdown**
- "Here's how to do it" directness
- Step-by-step with tools/numbers
- Exact settings, thresholds, workflows
- Soft CTA for partnership

**Pattern 7: Personal Milestone**
- Life update (engagement, family, business win)
- Brief, authentic
- No forced business lesson
- Gratitude angle

**Formatting Patterns:**
- Christian: Bullets with ">", specific numbers, tool names, signature ("Ram 🐏")
- Mitchell: ALL CAPS emphasis, "Here's how", step headers, occasional profanity, soft CTA

---

### 4. authority-statements.md

**Purpose:** Campaign results library (populated by data-enricher)

**Structure:**
```markdown
# Authority Statements Library
**Last Updated:** [Date]

## By Industry
### [Industry Name]
**Campaign:** [Brief description]
**Client Type:** [Anonymized]
**Approach:** [What made it work]
**Results:**
- Reply rate: X%
- Meetings booked: X
- Duration: X weeks
- Contacts: X
**Key Element:** [Success factor]

## By Offer Type
[Same structure]

## By Result Type
[Same structure]

## Quick Content Snippets
"Helped a [industry] company book X meetings..."
```

---

### 5. service-offering-map.md

**Purpose:** What LeadGrow does, how it's positioned

**Contents:**

**What We Do (High-Level):**
Cold email end-to-end. Figure out what to say, who to target, deliver booked meetings into CRM.

**Full Service Breakdown:**
1. Strategic Positioning (situation-based messaging, technician positioning, frontend offers)
2. Target Market Research (ICP validation, TAM mapping, database discovery, enrichment)
3. List Building & Data (Clay workflows, Apollo sourcing, hard-to-find data, catch-all validation)
4. Copywriting (script frameworks, situation-based copy, spintax, multi-step sequences, A/B testing)
5. Infrastructure & Deliverability (account setup, domain strategy, warm-up, monitoring, send optimization)
6. Campaign Execution (EmailBison sequencing, reply monitoring, inbox management, CRM syncing)
7. Meeting Conversion (warm calling, calendar optimization, enrichment, sales assets)
8. Expansion Services (LinkedIn outreach, inbound-led-outbound, nurture/re-engagement, event marketing)

**What We DON'T Do:**
- Manage sales teams
- Close deals
- Build entire marketing stack
- "Do everything" (we're technicians)

**Positioning vs Competitors:**
- NOT: Spray-and-pray, "AI writes emails" button-pushers, generalist agencies
- ARE: Situation-based specialists, infrastructure nerds, partnership-oriented, target top 40% (not just 3%)

**Giveaway-Worthy Components:**
1. Clay workflows
2. Email script frameworks
3. Infrastructure checklists
4. n8n automation workflows
5. Lead scoring system
6. Database discovery process
7. Case study deep-dives

---

## Data Flow

```
Fireflies Transcripts
    ↓
[transcript-anonymizer]
    → Anonymize sensitive data
    → Categorize call type
    → Extract content opportunities
    ↓
Anonymized Summaries (/transcription-summaries/)
    ↓
[data-enricher]
    → Pull EmailBison campaign data
    → Cross-ref Airtable bookings
    → Identify exceptional campaigns
    → Create authority statements
    ↓
Authority Statements Library (authority-statements.md)
    ↓
[content-ideator]
    → Map opportunities to post types
    → Assign funnel stages
    → Prioritize (High/Med/Low)
    → Create content briefs
    ↓
Content Ideas Queue (content-ideas-queue.md)
    ↓
[content-writer]
    → Apply Mitchell's voice
    → Reference libraries (brand-voice, criteria, patterns)
    → Inject personality/interests
    → Craft CTAs
    → Draft posts
    ↓
Drafted Posts (/output/shortform/ & /longform/)
    ↓
[content-editor]
    → Score (Entertainment, Uniqueness, Criteria, Technical)
    → Critique with feedback
    → If 8+: Push to Typefully (proper sequencing)
    → If <8: Flag for revision
    ↓
Typefully Drafts (manual review/scheduling by Mitchell)
```

---

## Tool Access Restriction

| Sub-Agent | Allowed Tools |
|-----------|---------------|
| transcript-anonymizer | fireflies MCPs, Read, Write |
| data-enricher | emailbison MCPs, airtable MCPs, Read, Write |
| content-ideator | Read, Write |
| content-writer | Read, Write |
| content-editor | Read, Write, typefully MCPs |

**Why restricted?**
- Prevents accidental actions (e.g., anonymizer can't publish to Typefully)
- Each agent can ONLY do its specific job
- Security best practice from Anthropic

---

## Model Selection

**All sub-agents use Sonnet** for:
- Consistency across pipeline
- Balance of speed + capability
- Cost efficiency for high-volume generation

---

## Implementation Phases

### Phase 1: Foundation Setup
1. Create plugin directory structure
2. Write all 5 sub-agent markdown files with full prompts
3. Create transcript-tracker skill
4. Create 2 slash commands (generate-content, analyze-campaigns)
5. Create 5 supporting library files
6. Create GitHub content folder structure
7. Write plugin.json manifest
8. Write README.md for plugin

### Phase 2: Anonymization Pass
9. Run transcript-anonymizer on existing training session documents
10. Review anonymization changes with Mitchell for approval
11. Update processed-transcript-ids.txt with existing transcripts

### Phase 3: Library Population
12. Extract brand voice from transcripts (Mitchell's speaking patterns)
13. Populate post-type-criteria.md with full breakdowns
14. Populate successful-patterns.md from Christian Placencia analysis
15. Populate service-offering-map.md from transcript content
16. Create initial authority-statements.md structure (data-enricher will populate)

### Phase 4: Testing
17. Run full workflow on 1-2 recent transcripts end-to-end
18. Review output quality at each sub-agent stage
19. Refine prompts based on test results
20. Test Typefully integration (create draft, verify sequencing)
21. Validate anonymization thoroughness

### Phase 5: Production
22. Add plugin to project `.claude/settings.json`
23. Document usage instructions for Mitchell
24. Create first production batch from recent weekly calls
25. Establish weekly content generation cadence

---

## Key Metrics & Success Criteria

### Execution Metrics
- **Processing Speed:** Full pipeline (5 transcripts → drafts) in <30 minutes
- **Quality Score:** Average editor score 7.5+/10
- **Approval Rate:** 60%+ posts score 8+ (publish-ready)
- **Anonymization Accuracy:** 100% client names removed
- **Duplicate Prevention:** 0 reprocessed transcripts

### Content Metrics (Mitchell to track in Typefully/X)
- **Post Volume:** 48 shortform + 8 longform per month
- **Funnel Distribution:** 60% top, 30% mid, 10% bottom
- **Engagement:** Track high-performing post patterns
- **Voice Consistency:** Posts indistinguishable from Mitchell's manual writing

---

## Dependencies & Requirements

### MCP Servers (Already Connected)
- ✅ fireflies (meeting transcripts)
- ✅ bison_mcp (EmailBison campaign data)
- ✅ pipedream-airtable (booking/conversion data)
- ✅ pipedream-typefully (draft publishing)

### GitHub Repository
- Location: `/content` at project root (confirm with Mitchell)
- Version control: All content changes tracked in git
- Collaboration: Can share plugin with team if needed

### Manual Steps (Mitchell)
- Weekly trigger: `/generate-content last-week` (set recurring reminder)
- Typefully review: Manually schedule approved drafts
- Giveaway approval: Review flagged giveaway posts before creation
- Quarterly refinement: Update libraries based on voice evolution

---

## Future Enhancements (Post-MVP)

### Phase 6: Advanced Features
- Automated weekly scheduling (trigger without manual command)
- Carousel generation via API (visual content creation)
- Video script generation (repurpose high-engagement posts)
- Multi-platform distribution (LinkedIn, newsletter, blog)
- A/B testing framework (track which post types convert best)
- Competitor content analysis (track what's working in outbound content space)

### Phase 7: Intelligence Layer
- Pattern recognition (identify which transcript moments → best posts)
- Voice calibration (continuously refine Mitchell's voice model)
- Content gap analysis (identify underserved topics)
- Automated authority statement discovery (proactive campaign monitoring)

---

## Open Questions for Mitchell

1. **GitHub Repo Confirmation:** Is `/content` at project root okay, or different location?
2. **Weekly Cadence:** Prefer manual trigger or should we explore automation?
3. **Giveaway Approval Flow:** How do you want to review/approve giveaway posts?
4. **Carousel Creation:** Priority for visual content, or focus on text first?
5. **Brand Voice Edge Cases:** Any specific phrases/patterns to always avoid?
6. **Client Name Disclosure:** Process for if/when you decide to un-anonymize (with permission)?
7. **Tool Access:** Any specific MCP tools you want restricted for security?

---

## Next Steps

1. **Mitchell Reviews:** Approve architecture or request changes
2. **Spec-Kit Planning:** Use specify-cli to create detailed execution specs
3. **Build Phase 1:** Create all plugin files and structure
4. **Test Phase 2:** Anonymize existing training docs for validation
5. **Populate Phase 3:** Fill library files with voice/patterns/criteria
6. **Validate Phase 4:** Run test workflow on sample transcripts
7. **Launch Phase 5:** Begin weekly content generation cadence

---

## Appendix: Prompt Engineering Best Practices Applied

### From Ultimate Prompt Engineering Guide

✅ **Essential XML Only** - Using `<task>`, `<input>`, `<instructions>`, `<examples>` primarily
✅ **Consistent Tag Referencing** - Always reference content by exact tag names
✅ **Hierarchical Nesting** - Related content grouped logically
✅ **Few-Shot Examples** - 2-3 diverse examples per agent showing input→output
✅ **Verification Checklists** - Explicit quality checks before output
✅ **Role-Playing** - Clear "You are X" framing with context
✅ **Explicit Scoring Rubrics** - Removes subjectivity (content-editor)
✅ **Process Breakdown** - Clear step-by-step with action/input/output per step
✅ **Constraints Section** - What NOT to do explicitly stated
✅ **Context Provision** - Why tasks matter, not just what to do
✅ **Brilliant New Employee Model** - Agents understand why, not just what
✅ **80/20 Rule** - Focus on essential instructions, avoid over-complication
✅ **Show, Don't Tell** - Examples embedded throughout

### From Anthropic Best Practices

✅ **Single Responsibility** - Each agent does ONE thing exceptionally well
✅ **Tool Restriction** - Minimal necessary tools per agent (security + focus)
✅ **Stateless & Composable** - Sub-agents invokable independently or chained
✅ **Context-Efficient** - Load only relevant libraries per agent
✅ **Model Selection** - Sonnet for all (consistency + balance)
✅ **Clear Descriptions** - Natural language purpose statements
✅ **Version Control** - Project-level agents for team collaboration
✅ **Focused Prompts** - Detailed instructions with specific guidelines
✅ **Skill for Automation** - transcript-tracker as model-invoked capability

---

**Document Status:** Ready for Mitchell's review and Spec-Kit planning

**Last Updated:** 2025-10-27
