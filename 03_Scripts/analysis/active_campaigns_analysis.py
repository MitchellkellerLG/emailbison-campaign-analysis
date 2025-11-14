"""
Active Campaigns Recursive Intelligence Analysis
Analyzes ONLY active/running campaigns across all workspaces
Includes send volume remaining and days of sending calculations
"""

import json
from datetime import datetime, timedelta

# This will be populated with actual data from MCP calls
workspace_data = {}

def calculate_send_volume_remaining(campaign):
    """Calculate remaining send volume and estimated days"""
    total_leads = campaign.get('total_leads', 0)
    total_leads_contacted = campaign.get('total_leads_contacted', 0)
    max_new_leads_per_day = campaign.get('max_new_leads_per_day', 1000)
    max_emails_per_day = campaign.get('max_emails_per_day', 1000)
    completion_percentage = campaign.get('completion_percentage', 0)

    # Calculate remaining leads
    remaining_leads = total_leads - total_leads_contacted

    # Calculate estimated days remaining based on max_new_leads_per_day
    if max_new_leads_per_day > 0 and remaining_leads > 0:
        days_remaining = remaining_leads / max_new_leads_per_day
    else:
        days_remaining = 0

    # Estimate total emails to be sent (assuming 3 emails per sequence on average)
    avg_emails_per_lead = 3  # This is an estimate
    remaining_emails = remaining_leads * avg_emails_per_lead

    return {
        'remaining_leads': remaining_leads,
        'remaining_emails_estimated': remaining_emails,
        'days_remaining_estimated': round(days_remaining, 2),
        'max_new_leads_per_day': max_new_leads_per_day,
        'max_emails_per_day': max_emails_per_day,
        'leads_completion_pct': completion_percentage
    }

def classify_campaign_performance(campaign):
    """Classify campaign as HIGH/MODERATE/UNDERPERFORMER"""
    emails_sent = campaign.get('emails_sent', 0)
    unique_replies = campaign.get('unique_replies', 0)
    interested = campaign.get('interested', 0)

    # Calculate reply rate
    reply_rate = (unique_replies / emails_sent * 100) if emails_sent > 0 else 0

    if reply_rate > 2 or interested > 3:
        return '🟢 HIGH PERFORMER', reply_rate
    elif reply_rate >= 1 or interested >= 1:
        return '🟡 MODERATE PERFORMER', reply_rate
    else:
        return '🔴 UNDERPERFORMER', reply_rate

def format_campaign_report(campaign, workspace_name, sequence_data=None):
    """Format individual campaign report"""
    performance, reply_rate = classify_campaign_performance(campaign)
    send_volume = calculate_send_volume_remaining(campaign)

    report = f"""
{'='*70}
WORKSPACE: {workspace_name}
CAMPAIGN: {campaign.get('name', 'N/A')}
STATUS: {performance}
CAMPAIGN ID: {campaign.get('id', 'N/A')}
{'='*70}

📊 METRICS SNAPSHOT:
- Total Leads: {campaign.get('total_leads', 0)}
- Leads Contacted: {campaign.get('total_leads_contacted', 0)}
- Completion: {campaign.get('completion_percentage', 0)}%
- Emails Sent: {campaign.get('emails_sent', 0)}
- Reply Rate: {reply_rate:.2f}%
- Unique Replies: {campaign.get('unique_replies', 0)}
- Interested Leads: {campaign.get('interested', 0)}
- Bounce Rate: {(campaign.get('bounced', 0) / campaign.get('emails_sent', 1) * 100) if campaign.get('emails_sent', 0) > 0 else 0:.2f}%

📧 SEND VOLUME REMAINING:
- Remaining Leads to Contact: {send_volume['remaining_leads']}
- Estimated Emails Remaining: {send_volume['remaining_emails_estimated']}
- Days of Sending Remaining: {send_volume['days_remaining_estimated']} days
- Max New Leads/Day: {send_volume['max_new_leads_per_day']}
- Max Emails/Day Limit: {send_volume['max_emails_per_day']}

⚙️ CAMPAIGN SETTINGS:
- Plain Text: {campaign.get('plain_text', False)}
- Open Tracking: {campaign.get('open_tracking', False)}
- Can Unsubscribe: {campaign.get('can_unsubscribe', False)}

"""

    if sequence_data:
        report += f"""
📝 SEQUENCE OVERVIEW:
- Total Steps: {len(sequence_data.get('data', []))}
"""
        for idx, step in enumerate(sequence_data.get('data', [])[:3], 1):
            report += f"""
  Step {idx}:
  - Subject: {step.get('subject', 'N/A')[:80]}...
  - Wait Time: {step.get('wait_time_number', 0)} {step.get('wait_time_unit', 'days')}
"""

    return report

# Main execution would go here - we'll populate this with actual MCP call results
if __name__ == "__main__":
    print("This script will be executed by Claude with actual MCP data")
