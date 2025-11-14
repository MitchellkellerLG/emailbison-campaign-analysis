# Strategy for Finding 12 Interested Leads from Cleanlab Campaigns

## Target Campaigns and Expected Counts
1. **Campaign 241** - CleanLab Lending and Credit (NA/UK): 1 interested lead
2. **Campaign 193** - Cleanlab Agentic / production AI news 19th August: 2 interested leads  
3. **Campaign 188** - Canada_ai_agents_customer_service_chatbots_last_3_6 months August 13th: 4 interested leads
4. **Campaign 165** - EverGreen Armand Ruiz Engagement July 31: 5 interested leads

**Total Expected**: 12 interested leads

## Search Approach

### 1. Direct API Pagination
The EmailBison list_leads endpoint returns paginated results with:
- Default: 15 leads per page
- Total: 11,588 leads across all campaigns
- Pages: 773 total pages

### 2. Search Filtering
When searching for "Cleanlab", the results are filtered to ~130 pages (1,937 leads) that mention CleanLab in their custom variables.

### 3. Lead Analysis Process
For each lead, check:
- `lead_campaign_data` array
- Look for objects with `campaign_id` in [241, 193, 188, 165]
- Check if `interested: true` in those campaign objects
- Extract job title from either `title` field or `notes` field

### 4. Current Findings
From the initial search results:
- Found leads associated with campaigns 193 and 263
- None showed `interested: true` in the first page of results
- Need to continue pagination to find the 12 interested leads

## Next Steps
1. Continue paginating through the API results
2. Focus on leads that have replies > 0 as they're more likely to be interested
3. Check each lead's campaign data for the interested flag
4. Compile the final list with exact job titles