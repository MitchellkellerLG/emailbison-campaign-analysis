# EmailBison Campaign Intelligence Analysis

## Instructions
This is a runnable prompt for analyzing EmailBison campaign performance across specified workspaces. To use this prompt:

1. Replace `[WORKSPACE_NAMES]` with a comma-separated list of workspaces you want to analyze (e.g., "TeachAid, Cleanlab, Coherence")
2. Run this entire file as a prompt to Claude
3. Claude will analyze each specified workspace and provide comprehensive intelligence

## Prompt

Please perform a comprehensive EmailBison campaign intelligence analysis for the following workspaces: **[WORKSPACE_NAMES]**

For each specified workspace, please:

### 1. Workspace Overview
- Switch to the workspace using `mcp__bison_mcp__emailbison_rotate_workspace`
- Retrieve workspace details and current context
- List all campaigns with their current status

### 2. Campaign Performance Analysis
For each campaign in the workspace:
- **Campaign Details**: Name, status, creation date, settings
- **Sequence Analysis**: 
  - Number of steps and their content
  - Subject lines and email bodies
  - Wait times between steps
  - Step relationships and flow
- **Lead Engagement**:
  - Total leads in campaign
  - Email open rates and reply rates
  - Bounced emails and unsubscribes
  - Interested leads identification
- **Conversation Intelligence**:
  - Active conversations and their status
  - Reply sentiment and engagement quality
  - Key topics and concerns raised by leads

### 3. Cross-Campaign Insights
- Identify top-performing campaigns by engagement metrics
- Compare sequence strategies across campaigns
- Highlight successful subject lines and email templates
- Analyze optimal timing patterns

### 4. Lead Intelligence
- Total unique leads across all campaigns
- Lead engagement patterns and preferences
- High-value lead identification
- Lead tags and categorization

### 5. Recommendations
Based on the analysis, provide:
- Specific improvements for underperforming campaigns
- Best practices identified from successful campaigns
- Sequence optimization suggestions
- Lead targeting refinements

### 6. Executive Summary
Provide a concise summary including:
- Workspace health score (1-10)
- Top 3 achievements
- Top 3 areas for improvement
- Immediate action items

## Output Format
Please structure the analysis as a comprehensive markdown report with:
- Clear section headers
- Bullet points for easy scanning
- Data tables where appropriate
- Specific metrics and percentages
- Actionable recommendations

## Additional Analysis Options
You may also request these specialized analyses:
- **Competitive Analysis**: Compare performance across multiple workspaces
- **Time-based Trends**: Analyze performance over specific date ranges
- **Template Effectiveness**: Deep dive into email template performance
- **Reply Sentiment Analysis**: Detailed analysis of lead responses
- **A/B Testing Insights**: Compare different sequence variations

---

*Note: This analysis uses the EmailBison MCP tools to access real-time campaign data. Ensure you have proper access to the specified workspaces.*