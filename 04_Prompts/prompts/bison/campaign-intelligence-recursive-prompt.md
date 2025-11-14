# EmailBison Campaign Intelligence Analysis - Recursive Deep Dive

## Instructions
Replace `[WORKSPACE_NAME]` with your target workspace. This prompt will recursively analyze EVERY campaign in the workspace, focusing on performance metrics, winning copy, and actionable insights.

## Prompt

Perform a recursive campaign intelligence analysis for the EmailBison workspace: **[WORKSPACE_NAME]**

### Initial Setup
1. Switch to workspace: `mcp__bison_mcp__emailbison_rotate_workspace`
2. Get ALL campaigns: `mcp__bison_mcp__emailbison_list_campaigns`
3. For EACH campaign, perform the following recursive analysis:

### For Each Campaign (Recursive Analysis):

#### 1. Campaign Performance Classification
Classify each campaign as:
- **🟢 HIGH PERFORMER** (Reply rate > 2% OR Interested > 3)
- **🟡 MODERATE PERFORMER** (Reply rate 1-2% OR Interested 1-2)
- **🔴 UNDERPERFORMER** (Reply rate < 1% AND Interested = 0)

#### 2. Core Campaign Metrics
- Campaign Name & ID
- Status (Draft/Running/Paused/Completed)
- **Performance Metrics:**
  - Total Leads
  - Emails Sent
  - Unique Opens (%)
  - Unique Replies (%)
  - Interested Leads Count
  - Bounce Rate (%)
  - Completion Rate (%)

#### 3. Winning Copy Extraction
Use `mcp__bison_mcp__emailbison_view_campaign_sequence_steps` to extract:
- **Subject Lines** (all variations)
- **Email Bodies** (complete text for each step)
- **Which sequences generated the most replies**
- **Which sequences generated interested leads**
- **Personalization variables that worked**

#### 4. Reply Intelligence
For campaigns with replies > 0:
- Use `mcp__bison_mcp__emailbison_view_lead_conversations` to analyze:
  - **Positive Reply Examples** (interested or engaged)
  - **Common Objections** in replies
  - **Reply Sentiment Distribution**
  - **Average Time to Reply**
  - **Which email in sequence triggered most replies**

#### 5. Lead Deep Dive
For campaigns with interested > 0:
- Get lead details using `mcp__bison_mcp__emailbison_list_leads`
- Extract:
  - **Job Titles of Interested Leads**
  - **Companies of Interested Leads**
  - **Common characteristics of responders**
  - **Lead quality indicators**

#### 6. Campaign-Specific Next Steps
Based on performance classification:

**For HIGH PERFORMERS:**
- Scale strategy (increase daily limits)
- Clone for similar audiences
- Extract winning templates

**For MODERATE PERFORMERS:**
- A/B test subject lines
- Refine targeting
- Adjust sequence timing

**For UNDERPERFORMERS:**
- Pause and reassess
- Complete copy overhaul
- Audience refinement needed

#### 7. Actionable Recommendations
For each campaign provide:
1. **Immediate Action** (what to do today)
2. **Copy Improvements** (specific line edits)
3. **Targeting Adjustments** (audience refinements)
4. **Sequence Optimization** (timing/step changes)

### Output Format for Each Campaign:

```
==================================================
CAMPAIGN: [Campaign Name]
STATUS: [Performance Classification]
==================================================

METRICS SNAPSHOT:
- Emails Sent: X
- Reply Rate: X%
- Interested Leads: X
- Performance Score: X/10

WINNING COPY:
Subject Line: "[Best performing subject]"
Opening Hook: "[First 2 lines of best email]"

KEY INSIGHTS:
- [Top insight from reply analysis]
- [Lead quality observation]
- [Timing pattern discovered]

IMMEDIATE NEXT STEPS:
1. [Specific action with expected impact]
2. [Copy change with rationale]
3. [Targeting adjustment]

REPLIES ANALYSIS:
Positive: "[Example positive reply]"
Objection: "[Common objection found]"

==================================================
```

### Final Summary Section:

#### Portfolio Overview:
- High Performers: X campaigns (X% of total)
- Moderate Performers: X campaigns (X% of total)
- Underperformers: X campaigns (X% of total)

#### Top 3 Winning Copy Patterns:
1. [Pattern with example]
2. [Pattern with example]
3. [Pattern with example]

#### Top 5 Immediate Actions:
1. [Highest impact action]
2. [Quick win action]
3. [Copy optimization]
4. [Targeting refinement]
5. [Sequence adjustment]

---

**Note**: This analysis will recursively process EVERY campaign, extracting actual copy and reply data to provide actionable intelligence rather than generic recommendations.