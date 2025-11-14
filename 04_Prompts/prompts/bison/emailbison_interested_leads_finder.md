# EmailBison Interested Leads Finder - Cleanlab Workspace

## Overview
This document outlines the approach to retrieve all 12 interested leads from the Cleanlab workspace campaigns.

## Target Campaigns with Interested Leads

| Campaign ID | Campaign Name | Interested Leads Count |
|-------------|---------------|------------------------|
| 241 | CleanLab Lending and Credit (NA/UK) | 1 |
| 193 | Cleanlab Agentic / production AI news 19th August | 2 |
| 188 | Canada_ai_agents_customer_service_chatbots_last_3_6 months August 13th | 4 |
| 165 | EverGreen Armand Ruiz Engagement July 31 | 5 |
| **Total** | | **12** |

## API Challenge
The EmailBison API doesn't provide a direct way to filter leads by their "interested" status. The current approach requires:

1. **Paginated Search**: The API returns leads in pages of 15 items each
2. **Total Leads**: 11,588 leads across 773 pages
3. **Manual Filtering**: Each lead must be checked for `interested: true` in their `lead_campaign_data` array

## Lead Data Structure
```json
{
  "id": 12345,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "company": "Example Corp",
  "title": null,  // Often null
  "notes": "Chief Technology Officer",  // Often contains job title
  "lead_campaign_data": [
    {
      "campaign_id": 241,
      "status": "sending_paused",
      "emails_sent": 1,
      "replies": 1,
      "opens": 0,
      "interested": true  // This is what we're looking for
    }
  ]
}
```

## Job Title Extraction Logic
1. **Primary Source**: Check the `title` field first
2. **Fallback**: If `title` is null, use the `notes` field which often contains the job title
3. **Default**: If both are empty, return "No title available"

## Recommended Approach
To efficiently find all 12 interested leads:

1. **Batch Processing**: Request larger page sizes (up to 100 per page) to reduce API calls
2. **Parallel Search**: Check multiple campaigns simultaneously
3. **Early Exit**: Stop searching once all 12 interested leads are found
4. **Caching**: Store results to avoid re-processing the same data

## Implementation Pseudocode
```python
interested_leads = []
target_campaigns = [241, 193, 188, 165]
expected_total = 12
page = 1

while len(interested_leads) < expected_total:
    # Get page of leads
    response = get_leads(page=page, per_page=100)
    
    # Process each lead
    for lead in response['data']:
        if 'lead_campaign_data' in lead:
            for campaign_data in lead['lead_campaign_data']:
                if (campaign_data['campaign_id'] in target_campaigns and 
                    campaign_data['interested'] == True):
                    
                    # Extract job title
                    job_title = lead.get('title') or lead.get('notes', 'No title available')
                    
                    # Add to results
                    interested_leads.append({
                        'name': f"{lead['first_name']} {lead['last_name']}",
                        'email': lead['email'],
                        'company': lead['company'],
                        'job_title': job_title,
                        'campaign_id': campaign_data['campaign_id']
                    })
    
    page += 1
    
    # Break if no more pages
    if not response.get('links', {}).get('next'):
        break
```

## Expected Output Format
Each interested lead should include:
- Full name
- Email address
- Company name
- **Job title** (extracted from title or notes field)
- Associated campaign ID and name

## Note
Due to the API's pagination limitations and the need to search through potentially thousands of leads, retrieving all 12 interested leads requires a systematic search through the database. The job titles will be extracted from either the `title` field (if available) or the `notes` field (which commonly contains job title information).