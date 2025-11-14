# EmailBison Workspace Comprehensive Analysis Prompt

## Instructions
This prompt will generate an exhaustive analysis of a single EmailBison workspace and output it as a DOCX file. Replace `[WORKSPACE_NAME]` with your target workspace name.

## Prompt

Please perform an exhaustive analysis of the EmailBison workspace: **[WORKSPACE_NAME]** and generate a comprehensive report in DOCX format.

### 1. Workspace Overview & Context
- Switch to the workspace using `mcp__bison_mcp__emailbison_rotate_workspace`
- Retrieve full workspace details with `mcp__bison_mcp__emailbison_get_workspace`
- Document:
  - Workspace ID, name, and type (personal/main)
  - Creation date and last updated
  - Email verification credits (total/remaining/monthly)
  - Sender email limit and warmup settings
  - Parent workspace relationships

### 2. Complete Campaign Analysis
For EVERY campaign in the workspace:
- Use `mcp__bison_mcp__emailbison_list_campaigns` to get all campaigns
- For each campaign, retrieve:
  - Full campaign details using `mcp__bison_mcp__emailbison_campaign_details`
  - All sequence steps using `mcp__bison_mcp__emailbison_view_campaign_sequence_steps`
  - Campaign schedule details
  - Tag associations

#### Per Campaign Metrics:
- Status (draft/paused/running/completed/archived)
- Completion percentage
- Total leads vs. contacted leads
- Email performance:
  - Sent count
  - Open rate (unique opens)
  - Reply rate (unique replies)
  - Bounce rate
  - Unsubscribe rate
  - **Interested leads count with details**
- Campaign settings:
  - Max emails/day
  - Max new leads/day
  - Plain text vs. HTML
  - Open tracking status
  - Unsubscribe settings

### 3. Sequence Analysis
For each campaign's sequence:
- Step count and structure
- Full email content for each step:
  - Subject lines
  - Email body text
  - Personalization variables used
- Wait times between steps
- Step relationships and branching logic
- A/B testing variations

### 4. Lead Intelligence
- Total unique leads across workspace
- Lead distribution by campaign
- Lead engagement metrics:
  - Overall email stats per lead
  - Campaign-specific engagement
  - Tag associations
- **Interested Leads Deep Dive**:
  - Extract ALL interested leads with:
    - Full name and email
    - Company and job title
    - Which campaigns marked them interested
    - Custom variables/notes
    - Lead source information

### 5. Email Account Analysis
- List all sender email accounts using `mcp__bison_mcp__emailbison_list_email_accounts`
- For each account:
  - Email address and display name
  - IMAP/SMTP configuration
  - Email signature
  - Tag associations
  - Usage statistics

### 6. Conversation & Reply Analysis
- Get all bounced replies using `mcp__bison_mcp__emailbison_list_bounced_replies`
- For campaigns with replies:
  - Analyze conversation threads
  - Reply sentiment and content themes
  - Response time patterns
  - Lead engagement quality

### 7. Domain & Compliance
- Blacklisted domains using `mcp__bison_mcp__emailbison_get_blacklisted_domains`
- Blacklisted emails using `mcp__bison_mcp__emailbison_get_blacklisted_emails`
- Custom tracking domains using `mcp__bison_mcp__emailbison_list_custom_tracking_domains`
- Compliance settings and unsubscribe management

### 8. Tag System Analysis
- All tags using `mcp__bison_mcp__emailbison_get_all_tags`
- Tag usage across:
  - Campaigns
  - Leads
  - Email accounts
- Default tags and custom categorization

### 9. Webhook Configuration
- Active webhooks using `mcp__bison_mcp__emailbison_get_all_webhooks`
- Event types monitored
- Webhook URLs and status

### 10. Performance Analytics
#### Campaign Performance Rankings:
- Top 5 campaigns by:
  - Reply rate
  - Interested lead conversion
  - Completion rate
  - Lead volume
- Underperforming campaigns analysis

#### Time-based Analysis:
- Campaign activity timeline
- Peak sending times
- Optimal engagement windows

### 11. Strategic Recommendations
Based on the complete analysis:
- Top 3 immediate optimizations
- Sequence improvement suggestions
- Lead targeting refinements
- Email copy recommendations
- Technical improvements

### 12. Executive Summary
- Workspace health score (1-10)
- Key achievements
- Critical issues requiring attention
- 30-day action plan

## Output Format
Generate the analysis as a Microsoft Word document (.docx) with:
- Professional formatting with headers and sub-headers
- Table of contents
- Data tables for metrics
- Charts/visualizations where applicable (describe what charts should be created)
- Color coding for performance indicators (describe the color scheme)
- Page numbers and section breaks
- Executive summary at the beginning
- Detailed appendices with raw data

## Special Instructions
1. If any API calls fail, document the error and continue with available data
2. For large datasets, provide summaries with options to expand
3. Include timestamps for when the analysis was performed
4. Mark any data gaps or limitations clearly
5. Use consistent number formatting (percentages, decimals)
6. Include a glossary of EmailBison terms

## Google Docs Integration
After generating the analysis, use the Google Docs MCP tools to:
1. Create a new document: `mcp__pipedream-direct__google_docs-create-document`
2. Format with proper styling and structure
3. Insert tables for data presentation: `mcp__pipedream-direct__google_docs-insert-table`
4. Add page breaks between major sections: `mcp__pipedream-direct__google_docs-insert-page-break`
5. Share the final document link

---

**Note**: This analysis will be comprehensive and may take several minutes to complete due to the extensive API calls required. The final document will provide a complete snapshot of your EmailBison workspace's current state, performance, and opportunities.