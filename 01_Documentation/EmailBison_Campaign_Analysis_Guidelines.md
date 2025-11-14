# EmailBison Campaign Analysis Guidelines

**Version:** 2.0
**Last Updated:** November 7, 2025
**Purpose:** Standard methodology for analyzing EmailBison workspace campaigns

---

## Core Metric Definitions

### ⚠️ CRITICAL: Always Use These Formulas

#### 1. Reply Rate
```
Reply Rate = unique_replies / total_leads_contacted
```
- **Measures:** What percentage of unique contacts replied
- **NOT:** unique_replies / emails_sent (emails_sent includes follow-ups to same person)
- **Example:** 64 replies / 893 contacts = 7.17% reply rate

#### 2. Interested Rate (REPLY QUALITY METRIC)
```
Interested Rate = interested / unique_replies
```
- **Measures:** What percentage of replies became interested (reply quality)
- **NOT:** interested / total_leads_contacted (that's contact-to-interested rate)
- **Example:** 6 interested / 64 replies = 9.4% interested rate
- **Purpose:** Shows which campaigns generate genuinely qualified replies vs. just curious responses

#### 3. Contact-to-Interested Rate (OVERALL EFFECTIVENESS)
```
Contact-to-Interested Rate = interested / total_leads_contacted
```
- **Measures:** Overall campaign effectiveness
- **Example:** 6 interested / 893 contacts = 0.67%
- **Purpose:** Shows total funnel performance from cold contact to qualified lead

---

## Key Fields from EmailBison API

### Always Pull These Fields:
- `emails_sent` - Total emails including follow-ups (DO NOT use for reply rate)
- `unique_replies` - Unique contacts who replied (use for reply rate)
- `interested` - Manually qualified high-intent leads
- `total_leads_contacted` - Unique contacts reached (use as denominator)
- `replied` - Total reply events (can include multiple from same person)
- `bounced` - Invalid/bounced emails
- `unsubscribed` - Opt-outs
- `total_leads` - Total list size
- `completion_percentage` - Campaign progress

---

## Analysis Framework

### 1. Campaign Performance Tiers

**Exceptional Reply Rate:** 6%+ reply rate
**Strong Reply Rate:** 4-6% reply rate
**Good Reply Rate:** 2-4% reply rate
**Poor Reply Rate:** <2% reply rate

**Exceptional Interested Rate:** 30%+ (of replies)
**Strong Interested Rate:** 20-30% (of replies)
**Good Interested Rate:** 10-20% (of replies)
**Poor Interested Rate:** <10% (of replies)

### 2. Campaign Type Analysis

Always segment by:
- **Audience Type:** (Teachers, Principals, Agencies, SaaS, etc.)
- **Geography:** (NZ, USA, Canada, South Africa, etc.)
- **Trigger-Based:** (New hires, Product Hunt launches, Funded companies, etc.)
- **Campaign Type:** (Outbound, Reply Followup, etc.)

### 3. What to Look For

**High Volume, Low Quality:**
- High reply rate (5%+) but low interested rate (<10%)
- **Action:** Review qualification criteria, improve followup sequences
- **Example:** Ontario Principals - 53 replies, 1.9% interested rate

**Low Volume, High Quality:**
- Low reply rate (<3%) but high interested rate (30%+)
- **Action:** Scale reach, increase throttle
- **Example:** SA Teachers - 2 replies, 100% interested rate

**High Volume, High Quality (WINNING FORMULA):**
- High reply rate (5%+) AND high interested rate (20%+)
- **Action:** Replicate, scale aggressively
- **Example:** CRM Data - 7% reply rate, 28.6% interested rate

---

## Standard Report Structure

### Executive Summary
- Total campaigns analyzed
- Overall reply rate (correct formula)
- Overall interested rate (correct formula - from replies)
- Overall contact-to-interested rate
- Key findings

### Top Performing Campaigns Table

Always include these columns:
```markdown
| Rank | Campaign | Contacts | Replies | Interested | Reply Rate | Interested Rate | Contact-to-Int |
```

### Individual Campaign Sections

For each top campaign, include:
- Campaign ID and name
- Status and completion %
- Performance metrics (with correct calculations)
- Email sequence (if available via MCP)
- Key success factors
- Why it won analysis

### Geographic Analysis
- Performance by region
- Best/worst performing markets
- Sample size considerations

### Audience Type Analysis
- Performance by audience segment
- Conversion patterns by role/industry
- Strategic recommendations

### Copy Analysis
- Common winning patterns
- Subject line analysis
- Spintax usage
- Plain text vs HTML
- Open tracking settings

---

## Common Mistakes to Avoid

### ❌ Don't Do This:
1. Calculate reply rate from `emails_sent`
2. Calculate interested rate from `total_leads_contacted`
3. Ignore sample size (2 replies = 100% is not statistically significant)
4. Mix "interested rate" and "contact-to-interested rate"
5. Forget to segment by audience/geography
6. Only analyze "interested" without looking at reply volume

### ✅ Do This:
1. Always use `total_leads_contacted` as reply rate denominator
2. Always use `unique_replies` as interested rate denominator
3. Note sample size and statistical confidence
4. Clearly label "interested rate" (reply quality) vs "contact-to-interested" (overall effectiveness)
5. Segment analysis by meaningful categories
6. Analyze both reply volume AND reply quality

---

## EmailBison MCP Tools Usage

### Switching Workspaces
```javascript
mcp__bison_mcp__emailbison_rotate_workspace({
  workspace_name: "Foundation" // or "TeachAid"
})
```

### Listing Campaigns
```javascript
mcp__bison_mcp__emailbison_list_campaigns({
  status: "active" // or "completed", "paused", "archived"
})
```

### Getting Campaign Details
```javascript
mcp__bison_mcp__emailbison_campaign_details({
  id: 254
})
```

### Getting Sequence Steps
```javascript
mcp__bison_mcp__emailbison_view_campaign_sequence_steps({
  campaign_id: 199
})
```

---

## Report Naming Convention

```
[Workspace]_Campaign_Analysis_Report.md
[Workspace]_Client_Update_[Month]_[Year].md
```

Examples:
- `Foundation_Campaign_Analysis_Report.md`
- `TeachAid_Client_Update_November_2025.md`
- `NZ_Principals_Campaign_Copy.md`

---

## Quality Checklist

Before finalizing any campaign analysis, verify:

- [ ] Reply rates calculated from `total_leads_contacted` (NOT `emails_sent`)
- [ ] Interested rates calculated from `unique_replies` (NOT `total_leads_contacted`)
- [ ] Sample sizes noted for statistical significance
- [ ] Both reply volume AND reply quality analyzed
- [ ] Geographic segmentation included
- [ ] Audience type segmentation included
- [ ] Top 5-10 campaigns documented with full details
- [ ] Email sequences pulled for winning campaigns
- [ ] Strategic recommendations included
- [ ] Methodology note included in report header

---

## Version History

**v2.0 (November 7, 2025)**
- CRITICAL FIX: Corrected interested rate calculation (interested/replies not interested/contacts)
- Added reply quality vs overall effectiveness distinction
- Added campaign performance tiers
- Added common mistakes section
- Added quality checklist

**v1.0 (November 4, 2025)**
- Initial methodology
- Basic metric definitions
- Reply rate correction (contacts not emails_sent)

---

**Maintained by:** LaunchClub Campaign Team
**Reference:** CORRECTED_METHODOLOGY.md
