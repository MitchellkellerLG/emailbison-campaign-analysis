# Feature Specification: Firmographic Segment Analysis

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Analytics Dashboard Team

## Overview

Enable performance analysis by firmographic segments (industry, company size, role/seniority) to identify which target personas respond best to campaigns. This allows data-driven targeting decisions and audience optimization.

## User Stories

### Story 1: Industry Performance Analysis
**As a** campaign strategist **I want** to see reply rates by industry **So that** I can focus on the most responsive sectors

**Acceptance Criteria**:
- [ ] View reply rates, interest rates, booking rates by industry (SaaS, Infrastructure, Education, Gaming, Healthcare, Finance)
- [ ] Sort by performance metrics
- [ ] Compare industries side-by-side
- [ ] Filter campaigns by industry

### Story 2: Company Size Segmentation
**As a** targeting specialist **I want** to analyze performance by company size **So that** I can optimize for SMB, Mid-market, or Enterprise

**Acceptance Criteria**:
- [ ] Segment by SMB (<200), Mid-market (200-1K), Enterprise (1K+)
- [ ] See conversion metrics per size category
- [ ] Identify highest-performing size segment
- [ ] Trend analysis over time (future)

### Story 3: Seniority-Based Analysis
**As a** outreach manager **I want** to see response rates by seniority level **So that** I can target the right decision-makers

**Acceptance Criteria**:
- [ ] Segment by C-Level, VP, Director, Manager, IC
- [ ] Show reply rates and booking rates per level
- [ ] Identify which levels are most engaged
- [ ] Filter out unclassified leads (Unknown category)

---

## Functional Requirements

### 1. Segment Classification

**Input**: Lead data (email, title, company, industry)

**Process**: Use `classifyFirmographics()` from firmographics.ts to classify each lead:
- **Seniority**: Extract from job title
  - C-Level: CEO, CTO, CFO, etc.
  - VP: VP, Vice President, SVP
  - Director: Director, Head of
  - Manager: Manager, Lead
  - IC: All others
  - Unknown: No title data
- **Company Size**: From employee count (if available)
  - SMB: 1-200 employees
  - Mid-market: 201-1,000
  - Enterprise: 1,000+
  - Unknown: No data
- **Industry**: Keyword matching from company name/title
  - SaaS, Infrastructure, Education, Gaming, Healthcare, Finance
  - Unknown: No match

**Output**: Each lead enriched with FirmographicData

---

### 2. Segment Performance Calculation

**Function**: `analyzeBySegment(workspaceId, segmentType)`

**Process**:
1. Fetch all campaigns for workspace
2. For each campaign, fetch all leads
3. Classify each lead's firmographics
4. Group leads by selected segment type (industry, company_size, or seniority)
5. For each segment value, aggregate:
   - total_sent (count of leads)
   - total_replies (count where replied = true)
   - total_interested (count where interested = true)
   - total_booked (from Cal.com, if available)
6. Calculate metrics per segment:
   - reply_rate = (total_replies / total_sent) × 100
   - interest_rate = (total_interested / total_replies) × 100
   - booking_rate = (total_booked / total_interested) × 100

**Output**: Array of Segment objects

```typescript
interface Segment {
  segment_type: 'industry' | 'company_size' | 'seniority';
  segment_value: string; // e.g., "SaaS", "Enterprise", "VP"
  total_sent: number;
  total_replies: number;
  total_interested: number;
  total_booked?: number;
  reply_rate: number; // %
  interest_rate: number; // %
  booking_rate?: number; // %
}
```

---

### 3. API Endpoint

**Route**: `GET /api/clients/[id]/segments`

**Query Parameters**:
- `type`: 'industry' | 'company_size' | 'seniority' (required)

**Response**:
```typescript
{
  segments: Segment[];
  segment_type: string;
  summary: {
    total_segments: number;
    best_performer: {
      segment_value: string;
      reply_rate: number;
    };
    worst_performer: {
      segment_value: string;
      reply_rate: number;
    };
  };
  timestamp: string;
}
```

**Example Response**:
```json
{
  "segments": [
    {
      "segment_type": "industry",
      "segment_value": "SaaS",
      "total_sent": 1542,
      "total_replies": 218,
      "total_interested": 108,
      "reply_rate": 14.1,
      "interest_rate": 49.5,
      "booking_rate": 33.3
    },
    {
      "segment_type": "industry",
      "segment_value": "Infrastructure",
      "total_sent": 892,
      "total_replies": 107,
      "total_interested": 54,
      "reply_rate": 12.0,
      "interest_rate": 50.5,
      "booking_rate": 35.2
    }
  ],
  "segment_type": "industry",
  "summary": {
    "total_segments": 6,
    "best_performer": {
      "segment_value": "SaaS",
      "reply_rate": 14.1
    },
    "worst_performer": {
      "segment_value": "Finance",
      "reply_rate": 8.5
    }
  },
  "timestamp": "2025-11-19T19:00:00.000Z"
}
```

---

### 4. UI Component

**Component**: `components/segment-analysis-table.tsx`

**Features**:
- Segment type selector: Radio buttons or tabs (Industry | Company Size | Seniority)
- Sortable table with columns:
  - Segment Value
  - Volume (total_sent)
  - Reply Rate
  - Interest Rate
  - Booking Rate (if available)
- Color coding:
  - Green: Top 33% performers
  - Yellow: Middle 33%
  - Gray: Bottom 33%
- Comparison mode: Select 2-3 segments to compare side-by-side
- Export to CSV option (future)

**Example Visual**:
```
Segment Type: ● Industry  ○ Company Size  ○ Seniority

┌──────────────┬────────┬────────────┬───────────────┬──────────────┐
│ Segment      │ Volume │ Reply Rate │ Interest Rate │ Booking Rate │
├──────────────┼────────┼────────────┼───────────────┼──────────────┤
│ SaaS         │ 1,542  │ 14.1% 🟢   │ 49.5%         │ 33.3%        │
│ Infrastructure│  892  │ 12.0% 🟢   │ 50.5%         │ 35.2%        │
│ Education    │ 1,127  │ 11.2% 🟡   │ 48.0%         │ 30.0%        │
│ Gaming       │  743  │  9.8% 🟡   │ 45.0%         │ 28.0%        │
│ Healthcare   │  456  │  8.9%      │ 42.0%         │ 25.0%        │
│ Finance      │  465  │  8.5%      │ 40.0%         │ 22.0%        │
│ Unknown      │  330  │  7.2%      │ 38.0%         │ 20.0%        │
└──────────────┴────────┴────────────┴───────────────┴──────────────┘
```

---

## Edge Cases & Error Scenarios

### Edge Case 1: All Leads Unclassified
- **Description**: Leads have no title/company data, all categorized as "Unknown"
- **Expected Behavior**: Show "Unknown" segment with all data
- **Handling**: Always include "Unknown" category in results

### Edge Case 2: Single Segment Only
- **Description**: All leads from one industry (e.g., all SaaS)
- **Expected Behavior**: Display single segment, note lack of diversity
- **Handling**: Show 1-row table, add message "All leads in same segment"

### Edge Case 3: Empty Segment
- **Description**: Segment exists in classification but no leads match
- **Expected Behavior**: Don't display empty segments
- **Handling**: Filter out segments with total_sent = 0

### Edge Case 4: Ambiguous Classification
- **Description**: Title like "VP of Engineering and Product" matches multiple patterns
- **Expected Behavior**: Use first match (VP in this case)
- **Handling**: Classification logic already handles precedence

### Error Scenario 1: Classification Failure
- **Trigger**: Firmographic classifier throws error
- **User Experience**: Log error, skip that lead, continue processing
- **Recovery**: Partial results returned, note in response which leads failed

### Error Scenario 2: No Leads Have Titles
- **Description**: Campaign targets only generic emails (no personalization)
- **Expected Behavior**: All leads in "Unknown" seniority
- **Handling**: Display "Unknown" segment, suggest data enrichment

---

## Performance Requirements

**Response Time**:
- < 5 seconds for 10,000 leads
- < 10 seconds for 50,000 leads

**Optimization Strategies**:
1. Classify in parallel (batch processing)
2. Cache classification results per lead (Phase 2)
3. Stream processing (aggregate as classifying)
4. Consider sampling for very large datasets (>100K leads)

**Memory Management**:
- Process leads in batches of 1,000
- Clear classification results after aggregation
- Don't hold full lead dataset in memory

---

## Implementation Details

### File Structure
```
lib/
├── services/
│   ├── segment-analysis.ts          (Analyzer)
│   └── __tests__/
│       └── segment-analysis.test.ts (Unit tests)
app/api/
└── clients/[id]/
    └── segments/
        └── route.ts                 (API endpoint)
components/
└── segment-analysis-table.tsx       (UI component)
```

### analyzeBySegment() Function

```typescript
export async function analyzeBySegment(
  workspaceId: number,
  segmentType: 'industry' | 'company_size' | 'seniority'
): Promise<Segment[]> {
  // 1. Fetch all campaigns
  const { campaigns } = await getCampaigns(workspaceId);

  // 2. Initialize aggregation map
  const segmentMap = new Map<string, {
    total_sent: number;
    total_replies: number;
    total_interested: number;
    total_booked: number;
  }>();

  // 3. Process each campaign
  for (const campaign of campaigns) {
    const { leads } = await getLeads(campaign.id);

    // Classify and aggregate each lead
    for (const lead of leads) {
      // Classify firmographics
      const firmographics = classifyFirmographics({
        title: lead.title,
        company: lead.company,
        industry: lead.industry
      });

      // Get segment value based on type
      let segmentValue: string;
      switch (segmentType) {
        case 'industry':
          segmentValue = firmographics.industry;
          break;
        case 'company_size':
          segmentValue = firmographics.company_size;
          break;
        case 'seniority':
          segmentValue = firmographics.seniority;
          break;
      }

      // Initialize or update segment
      if (!segmentMap.has(segmentValue)) {
        segmentMap.set(segmentValue, {
          total_sent: 0,
          total_replies: 0,
          total_interested: 0,
          total_booked: 0
        });
      }

      const segment = segmentMap.get(segmentValue)!;
      segment.total_sent++;

      // Check lead campaign data
      const leadCampaignData = lead.lead_campaign_data?.find(
        lcd => lcd.campaign_id === campaign.id
      );

      if (leadCampaignData) {
        if (leadCampaignData.replied) segment.total_replies++;
        if (leadCampaignData.interested) segment.total_interested++;
        // TODO: Add booking data from Cal.com
      }
    }
  }

  // 4. Calculate metrics
  const result: Segment[] = [];
  for (const [segmentValue, data] of segmentMap) {
    const replyRate = calculateReplyRate(data.total_sent, data.total_sent, data.total_replies);
    const interestRate = calculateInterestRate(data.total_replies, data.total_interested);
    const bookingRate = calculateBookingRate(data.total_interested, data.total_booked);

    result.push({
      segment_type: segmentType,
      segment_value: segmentValue,
      total_sent: data.total_sent,
      total_replies: data.total_replies,
      total_interested: data.total_interested,
      total_booked: data.total_booked || undefined,
      reply_rate: replyRate || 0,
      interest_rate: interestRate || 0,
      booking_rate: bookingRate || undefined
    });
  }

  // Sort by reply_rate descending
  return result.sort((a, b) => b.reply_rate - a.reply_rate);
}
```

---

## Testing Strategy

### Unit Tests

**Test Cases**:
1. **Basic segmentation**:
   - Mock leads with different industries
   - Verify correct grouping
   - Verify metrics calculated correctly

2. **All segment types**:
   - Test with segmentType = 'industry'
   - Test with segmentType = 'company_size'
   - Test with segmentType = 'seniority'

3. **Edge cases**:
   - All leads Unknown → single segment
   - Empty segments filtered out
   - Mixed classified/unclassified leads

4. **Performance**:
   - 10,000 mock leads
   - Verify completes in < 10 seconds

**Coverage Target**: 85%+

### Integration Tests

**Test Cases**:
1. Valid workspace + type → returns segments
2. Invalid type parameter → returns 400
3. Workspace with no leads → returns empty array
4. Response format matches spec

---

## Constitutional Compliance

### Article V: Segmentation by Firmographics
- ✓ All performance metrics filterable by industry, company size, seniority
- ✓ Classification logic documented and tested
- ✓ Segment performance comparisons available
- ✓ >90% classification accuracy (achieved via firmographics.ts tests)

### Article I: Data Accuracy Over Speed
- ✓ Calculations use tested functions
- ✓ Classification tested with 150 test cases
- ✓ Source data from EmailBison MCP

---

## Success Criteria

**Functional**:
- [ ] `analyzeBySegment()` implemented and tested (85%+ coverage)
- [ ] API route `/api/clients/[id]/segments` working
- [ ] Segment type selector functional in UI
- [ ] Table displays all segment types correctly
- [ ] Sorting works on all metrics

**Performance**:
- [ ] Response time < 5 seconds for 10K leads
- [ ] Handles multiple segment types efficiently
- [ ] No memory issues with large datasets

**Quality**:
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Classification accuracy validated
- [ ] UI matches design spec

---

## Implementation Phases

### Phase 1: Core Logic (3 hours)
1. Implement `analyzeBySegment()` in segment-analysis.ts
2. Write comprehensive unit tests
3. Optimize for performance

### Phase 2: API Endpoint (1 hour)
1. Create `/api/clients/[id]/segments/route.ts`
2. Integrate analyzeBySegment()
3. Add query parameter validation
4. Test with Postman

### Phase 3: UI Component (3 hours)
1. Build segment-analysis-table.tsx
2. Add segment type selector (tabs/radio)
3. Implement sortable table
4. Add color coding logic
5. Test with real data

**Total Time**: 7 hours

---

## Related Documents
- [Constitution](../constitution.md) - Article V (Segmentation by Firmographics)
- [Plan](../plan.md) - Firmographic segmentation architecture
- [Tasks](../tasks.md) - Tasks 11, 12, 15, 17

---

**Status**: Ready for Implementation
**Estimated Complexity**: Medium
**Dependencies**: firmographics.ts (✓), calculations.ts (✓), bison.ts (✓)
