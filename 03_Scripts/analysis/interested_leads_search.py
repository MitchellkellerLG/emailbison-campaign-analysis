# Script to process lead data and find interested leads
import json

# This will be used to process the API responses to find interested leads
def find_interested_leads(leads_data):
    interested_leads = []
    
    for lead in leads_data:
        if 'lead_campaign_data' in lead:
            for campaign_data in lead['lead_campaign_data']:
                if campaign_data.get('interested', False):
                    # Extract job title from either 'title' field or 'notes' field
                    job_title = lead.get('title') or lead.get('notes', 'No title available')
                    interested_leads.append({
                        'name': f"{lead.get('first_name', '')} {lead.get('last_name', '')}".strip(),
                        'email': lead.get('email'),
                        'company': lead.get('company'),
                        'job_title': job_title,
                        'campaign_id': campaign_data.get('campaign_id')
                    })
    
    return interested_leads