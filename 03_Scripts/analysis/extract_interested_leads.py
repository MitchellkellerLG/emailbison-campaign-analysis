import requests
import json
from typing import List, Dict

# EmailBison API configuration
API_BASE_URL = "https://send.leadgrow.ai/api"
API_KEY = "YOUR_API_KEY"  # Replace with actual API key
WORKSPACE_ID = 13  # Cleanlab workspace

def get_leads_page(page: int = 1, per_page: int = 100) -> dict:
    """Fetch a page of leads from the API."""
    url = f"{API_BASE_URL}/leads"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json"
    }
    params = {
        "page": page,
        "per_page": per_page
    }
    
    response = requests.get(url, headers=headers, params=params)
    return response.json()

def extract_interested_leads(campaign_ids: List[int]) -> List[Dict]:
    """Extract all interested leads from specified campaigns."""
    interested_leads = []
    page = 1
    
    while True:
        print(f"Processing page {page}...")
        data = get_leads_page(page, 100)
        
        if 'data' not in data or not data['data']:
            break
            
        for lead in data['data']:
            if 'lead_campaign_data' in lead:
                for campaign_data in lead['lead_campaign_data']:
                    if (campaign_data.get('campaign_id') in campaign_ids and 
                        campaign_data.get('interested', False)):
                        
                        # Extract job title from title field or notes field
                        job_title = lead.get('title')
                        if not job_title:
                            job_title = lead.get('notes', 'No title available')
                        
                        interested_lead = {
                            'name': f"{lead.get('first_name', '')} {lead.get('last_name', '')}".strip(),
                            'email': lead.get('email'),
                            'company': lead.get('company'),
                            'job_title': job_title,
                            'campaign_id': campaign_data.get('campaign_id'),
                            'campaign_name': get_campaign_name(campaign_data.get('campaign_id'))
                        }
                        interested_leads.append(interested_lead)
                        print(f"Found interested lead: {interested_lead['name']} - {interested_lead['job_title']}")
        
        # Check if there are more pages
        if 'links' in data and 'next' in data['links'] and data['links']['next']:
            page += 1
        else:
            break
    
    return interested_leads

def get_campaign_name(campaign_id: int) -> str:
    """Get campaign name by ID."""
    campaign_names = {
        241: "CleanLab Lending and Credit (NA/UK)",
        193: "Cleanlab Agentic / production AI news 19th August",
        188: "Canada_ai_agents_customer_service_chatbots_last_3_6 months August 13th",
        165: "EverGreen Armand Ruiz Engagement July 31"
    }
    return campaign_names.get(campaign_id, f"Campaign {campaign_id}")

def main():
    # Campaign IDs to search for interested leads
    campaign_ids = [241, 193, 188, 165]
    
    print(f"Searching for interested leads in campaigns: {campaign_ids}")
    interested_leads = extract_interested_leads(campaign_ids)
    
    print(f"\nFound {len(interested_leads)} interested leads:")
    print("=" * 80)
    
    for i, lead in enumerate(interested_leads, 1):
        print(f"\n{i}. {lead['name']}")
        print(f"   Email: {lead['email']}")
        print(f"   Company: {lead['company']}")
        print(f"   Job Title: {lead['job_title']}")
        print(f"   Campaign: {lead['campaign_name']}")
    
    # Save to JSON file
    with open('interested_leads_report.json', 'w') as f:
        json.dump(interested_leads, f, indent=2)
    
    print(f"\nResults saved to interested_leads_report.json")

if __name__ == "__main__":
    main()