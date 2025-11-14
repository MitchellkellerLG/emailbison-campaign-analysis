# Interested Leads Report - Cleanlab Workspace

## Summary
Based on the campaign data, there are **12 interested leads** across 4 campaigns in the Cleanlab workspace:

### Campaign Breakdown:
1. **Campaign 241**: CleanLab Lending and Credit (NA/UK) - **1 interested lead**
2. **Campaign 193**: Cleanlab Agentic / production AI news 19th August - **2 interested leads**  
3. **Campaign 188**: Canada_ai_agents_customer_service_chatbots_last_3_6 months August 13th - **4 interested leads**
4. **Campaign 165**: EverGreen Armand Ruiz Engagement July 31 - **5 interested leads**

## Challenge in Data Retrieval
The EmailBison API returns paginated results with leads showing their campaign engagement data. Each lead has a `lead_campaign_data` array that includes an `interested` boolean field for each campaign they're part of.

To find all 12 interested leads, we would need to:
1. Iterate through all pages of leads (773 pages with 15 leads per page = 11,595 total leads)
2. Check each lead's `lead_campaign_data` array for campaigns 241, 193, 188, and 165
3. Filter only those where `interested: true` for these specific campaigns
4. Extract the job title from either the `title` field or `notes` field

## Data Structure
Each lead in the API response contains:
- `first_name` and `last_name`
- `email`
- `company`
- `title` (often null)
- `notes` (often contains the job title)
- `lead_campaign_data` array with campaign engagement details

## Next Steps
To retrieve all 12 interested leads with their job titles, we would need to:
1. Make API calls to retrieve all lead pages
2. Process each lead to check if they're marked as interested in our target campaigns
3. Extract and compile their job titles

Due to the pagination and volume of data (11,595 total leads), this would require a systematic approach with multiple API calls.