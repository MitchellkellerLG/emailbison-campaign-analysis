#!/usr/bin/env python3
"""
Script to analyze leads data and find interested leads from specific campaigns
"""

import json

# Target campaigns
TARGET_CAMPAIGNS = [241, 193, 188, 165]

def extract_job_title(lead):
    """Extract job title from title field or notes field"""
    if lead.get('title'):
        return lead['title']
    elif lead.get('notes'):
        return lead['notes']
    else:
        return "No title found"

def find_interested_leads(leads_data):
    """Find leads that are marked as interested in target campaigns"""
    interested_leads = []
    
    for lead in leads_data:
        lead_campaign_data = lead.get('lead_campaign_data', [])
        
        for campaign in lead_campaign_data:
            campaign_id = campaign.get('campaign_id')
            if campaign_id in TARGET_CAMPAIGNS and campaign.get('interested', False):
                interested_leads.append({
                    'lead_id': lead.get('id'),
                    'first_name': lead.get('first_name'),
                    'last_name': lead.get('last_name'),
                    'email': lead.get('email'),
                    'company': lead.get('company'),
                    'job_title': extract_job_title(lead),
                    'campaign_id': campaign_id,
                    'campaign_name': get_campaign_name(campaign_id)
                })
    
    return interested_leads

def get_campaign_name(campaign_id):
    """Get campaign name by ID"""
    campaign_names = {
        241: "CleanLab Lending and Credit",
        193: "Cleanlab Agentic / production AI news",
        188: "Canada AI agents customer service",
        165: "EverGreen Armand Ruiz Engagement"
    }
    return campaign_names.get(campaign_id, f"Campaign {campaign_id}")

def group_by_campaign(interested_leads):
    """Group interested leads by campaign"""
    grouped = {}
    for lead in interested_leads:
        campaign_id = lead['campaign_id']
        if campaign_id not in grouped:
            grouped[campaign_id] = []
        grouped[campaign_id].append(lead)
    return grouped

def display_results(interested_leads):
    """Display the results in a formatted way"""
    if not interested_leads:
        print("No interested leads found in the provided data.")
        return
    
    print(f"\nFound {len(interested_leads)} interested leads:")
    print("=" * 80)
    
    grouped = group_by_campaign(interested_leads)
    
    for campaign_id in sorted(grouped.keys()):
        leads = grouped[campaign_id]
        print(f"\nCampaign {campaign_id}: {get_campaign_name(campaign_id)}")
        print(f"Found {len(leads)} interested leads:")
        print("-" * 60)
        
        for i, lead in enumerate(leads, 1):
            print(f"{i}. {lead['first_name']} {lead['last_name']}")
            print(f"   Email: {lead['email']}")
            print(f"   Company: {lead['company']}")
            print(f"   Job Title: {lead['job_title']}")
            print()

# Example usage:
# To use this script, save the leads data from API responses and pass it to find_interested_leads()
if __name__ == "__main__":
    print("Lead Analysis Script")
    print("=" * 40)
    print("This script helps analyze EmailBison leads data to find interested leads.")
    print("\nTarget campaigns:")
    for cid in TARGET_CAMPAIGNS:
        print(f"  - Campaign {cid}: {get_campaign_name(cid)}")
    print("\nTo use this script, call find_interested_leads() with your leads data.")