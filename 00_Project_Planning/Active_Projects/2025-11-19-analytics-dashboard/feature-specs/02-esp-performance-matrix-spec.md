# Feature Specification: ESP Performance Matrix

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Analytics Dashboard Team

## Overview

Build an ESP-to-ESP performance matrix that shows reply rates, bounce rates, and deliverability grades for every combination of sending ESP (Google/Gmail, Custom Domain, Outlook/Microsoft) and receiving domain type (Gmail, Outlook, Custom). This enables data-driven ESP selection and rotation strategies.

## User Stories

### Story 1: View ESP Performance Matrix
**As a** campaign manager **I want** to see ESP-to-ESP performance metrics **So that** I can choose the best sending ESP for different receiving domains

**Acceptance Criteria**:
- [ ] Matrix displays all sending ESP × receiving domain combinations
- [ ] Shows volume, reply rate, bounce rate for each pair
- [ ] Includes performance grade (A+ to F) for each pair
- [ ] Updates when client selection changes
- [ ] Loads in < 5 seconds

### Story 2: Identify Best ESP for Target Domain
**As a** campaign strategist **I want** to identify which sending ESP performs best for Gmail recipients **So that** I can optimize deliverability

**Acceptance Criteria**:
- [ ] Can visually identify highest reply rates per receiving domain
- [ ] Can identify lowest bounce rates per ESP
- [ ] Color coding makes performance tiers obvious
- [ ] Sortable by reply rate or bounce rate

### Story 3: ESP Reputation Monitoring
**As a** deliverability manager **I want** to see ESP grades at a glance **So that** I can quickly identify reputation issues

**Acceptance Criteria**:
- [ ] A+ to F grades visually distinct (color-coded)
- [ ] Any F grade immediately visible (red alert)
- [ ] Grades calculated per constitutional thresholds
- [ ] Historical comparison (if data available)

---

## Functional Requirements

### 1. ESP Matrix Calculation

**Input**:
- All campaigns for workspace
- All leads for each campaign

**Process**:
1. For each campaign:
   - Determine sending ESP using `categorizeESP(workspaceName)`
   - Fetch all leads for campaign
   - For each lead:
     - Determine receiving domain type using `parseReceivingDomain(lead.email)`
     - Count: sent, bounced, replied based on lead_campaign_data
2. Group by (sending_esp, receiving_domain_type) pair
3. Aggregate per pair:
   - total_sent = count of all leads
   - total_bounced = count where bounced = true
   - total_delivered = total_sent - total_bounced
   - total_replies = count where replied = true
4. Calculate metrics per pair:
   - reply_rate = (total_replies / total_delivered) × 100
   - bounce_rate = (total_bounced / total_sent) × 100
   - grade = getESPGrade(reply_rate, bounce_rate)

**Output**: Array of ESPPerformance objects

```typescript
interface ESPPerformance {
  sending_esp: ESPType; // 'Google/Gmail' | 'Custom Domain' | 'Outlook/Microsoft' | 'Unknown'
  receiving_domain_type: 'Gmail' | 'Outlook' | 'Custom' | 'Unknown';
  total_sent: number;
  total_delivered: number;
  total_replies: number;
  total_bounced: number;
  reply_rate: number; // %
  bounce_rate: number; // %
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}
```

---

### 2. ESP Grading System

**Grading Criteria** (from Constitution Article IV):
- **A+**: >3% reply rate AND <0.5% bounce rate
- **A**: 2.5-3% reply rate AND <0.5% bounce rate
- **B**: 2-2.5% reply rate AND 0.5-1% bounce rate
- **C**: <2% reply rate AND 1-2% bounce rate
- **F**: >2% bounce rate (automatic fail)

**Implementation**: Use existing `getESPGrade(replyRate, bounceRate)` from esp-classifier.ts

---

### 3. API Endpoint

**Route**: `GET /api/clients/[id]/esp`

**Response**:
```typescript
{
  esp_matrix: ESPPerformance[];
  summary: {
    total_pairs: number;
    best_performer: {
      sending_esp: string;
      receiving_domain: string;
      reply_rate: number;
      grade: string;
    };
    worst_performer: {
      sending_esp: string;
      receiving_domain: string;
      bounce_rate: number;
      grade: string;
    };
  };
  timestamp: string;
}
```

---

### 4. UI Component

**Component**: `components/esp-performance-table.tsx`

**Features**:
- Sortable table using @tanstack/react-table
- Columns: Sending ESP | Receiving Domain | Volume | Reply Rate | Bounce Rate | Grade
- Color coding:
  - Reply Rate: Green (≥12%), Yellow (8-12%), Gray (<8%)
  - Bounce Rate: Green (≤2%), Yellow (2-4%), Red (>4%)
  - Grade: A+/A (green) → F (red)
- Ranking indicators (#1, #2, #3) for top performers
- Refresh button with timestamp

**Example Visual**:
```
┌────────────────┬──────────────────┬────────┬────────────┬─────────────┬───────┐
│ Sending ESP    │ Receiving Domain │ Volume │ Reply Rate │ Bounce Rate │ Grade │
├────────────────┼──────────────────┼────────┼────────────┼─────────────┼───────┤
│ Google/Gmail   │ Gmail            │ 1,542  │ 14.2% ✓    │ 1.3% ✓      │ A+ 🟢 │
│ Google/Gmail   │ Outlook          │   892  │ 11.8% ✓    │ 2.1% ✓      │ A  🟢 │
│ Custom Domain  │ Gmail            │ 1,127  │ 12.5% ✓    │ 2.8% ⚠      │ A  🟢 │
│ Custom Domain  │ Outlook          │   743  │ 10.2%      │ 3.4% ⚠      │ B  🟡 │
│ Outlook/MS     │ Gmail            │   456  │  9.1%      │ 4.2% ⚠      │ B  🟡 │
│ Outlook/MS     │ Outlook          │   465  │ 13.5% ✓    │ 2.5% ✓      │ A  🟢 │
└────────────────┴──────────────────┴────────┴────────────┴─────────────┴───────┘
```

---

## Edge Cases & Error Scenarios

### Edge Case 1: No Leads for Campaign
- **Description**: Campaign exists but has no leads yet
- **Expected Behavior**: Skip campaign in aggregation
- **Handling**: Check if leads array empty, continue to next campaign

### Edge Case 2: All Leads Bounced
- **Description**: Campaign with 100% bounce rate
- **Expected Behavior**: Reply rate = 0%, Bounce rate = 100%, Grade = F
- **Handling**: Division by zero guard (0 delivered → reply_rate = null or 0%)

### Edge Case 3: Unknown ESP Type
- **Description**: Workspace name doesn't match ESP detection patterns
- **Expected Behavior**: Categorize as "Unknown" ESP
- **Handling**: Already handled by `categorizeESP()`

### Edge Case 4: Invalid Email Domains
- **Description**: Lead email has malformed domain
- **Expected Behavior**: Categorize as "Unknown" receiving domain
- **Handling**: Already handled by `parseReceivingDomain()`

### Edge Case 5: Single ESP Only
- **Description**: Client only uses one ESP type
- **Expected Behavior**: Matrix shows only that ESP's rows
- **Handling**: Display all possible receiving domains for that ESP

### Error Scenario 1: Lead Fetch Failure
- **Trigger**: MCP API fails to return leads for a campaign
- **User Experience**: Log error, skip that campaign, show partial results
- **Recovery**: Retry failed campaigns, note in response which campaigns failed

### Error Scenario 2: Calculation Overflow
- **Trigger**: Workspace with millions of leads
- **User Experience**: Pagination or sampling strategy
- **Recovery**: Process in batches, aggregate incrementally

---

## Performance Requirements

**Response Time**:
- < 5 seconds for 50 campaigns with 10,000 total leads
- < 10 seconds for 200 campaigns with 50,000 total leads

**Optimization Strategies**:
1. Parallel lead fetching (fetch leads for multiple campaigns simultaneously)
2. Stream processing (aggregate as data arrives, don't wait for all campaigns)
3. Early termination for "Unknown" ESP types (skip if not useful)
4. Consider pagination for very large workspaces (Phase 2)

**Memory Management**:
- Process leads in batches if campaign has >10,000 leads
- Don't hold all lead data in memory simultaneously
- Clear processed data after aggregation

---

## Implementation Details

### File Structure
```
lib/
├── services/
│   ├── esp-performance.ts          (Matrix builder)
│   └── __tests__/
│       └── esp-performance.test.ts (Unit tests)
app/api/
└── clients/[id]/
    └── esp/
        └── route.ts                (API endpoint)
components/
└── esp-performance-table.tsx       (UI component)
```

### buildESPMatrix() Function

```typescript
export async function buildESPMatrix(
  workspaceId: number
): Promise<ESPPerformance[]> {
  // 1. Fetch all campaigns
  const { campaigns } = await getCampaigns(workspaceId);

  // 2. Initialize aggregation map
  const matrix = new Map<string, {
    sending_esp: ESPType;
    receiving_domain_type: ReceivingDomainType;
    total_sent: number;
    total_bounced: number;
    total_replies: number;
  }>();

  // 3. Process each campaign
  for (const campaign of campaigns) {
    const sendingESP = categorizeESP(campaign.workspace_name || '');

    // Fetch leads for this campaign
    const { leads } = await getLeads(campaign.id);

    // Process each lead
    for (const lead of leads) {
      const receivingDomain = parseReceivingDomain(lead.email);
      const key = `${sendingESP}:${receivingDomain}`;

      // Get or create matrix entry
      if (!matrix.has(key)) {
        matrix.set(key, {
          sending_esp: sendingESP,
          receiving_domain_type: receivingDomain,
          total_sent: 0,
          total_bounced: 0,
          total_replies: 0
        });
      }

      const entry = matrix.get(key)!;
      entry.total_sent++;

      // Check lead campaign data for this campaign
      const leadCampaignData = lead.lead_campaign_data?.find(
        lcd => lcd.campaign_id === campaign.id
      );

      if (leadCampaignData) {
        if (leadCampaignData.bounced) entry.total_bounced++;
        if (leadCampaignData.replied) entry.total_replies++;
      }
    }
  }

  // 4. Calculate metrics and grades
  const result: ESPPerformance[] = [];
  for (const [_, entry] of matrix) {
    const delivered = entry.total_sent - entry.total_bounced;
    const replyRate = calculateReplyRate(entry.total_sent, delivered, entry.total_replies);
    const bounceRate = calculateBounceRate(entry.total_sent, entry.total_bounced);
    const grade = getESPGrade(replyRate || 0, bounceRate || 0);

    result.push({
      sending_esp: entry.sending_esp,
      receiving_domain_type: entry.receiving_domain_type,
      total_sent: entry.total_sent,
      total_delivered: delivered,
      total_replies: entry.total_replies,
      total_bounced: entry.total_bounced,
      reply_rate: replyRate || 0,
      bounce_rate: bounceRate || 0,
      grade
    });
  }

  return result;
}
```

---

## Testing Strategy

### Unit Tests (lib/services/__tests__/esp-performance.test.ts)

**Test Cases**:
1. **Basic aggregation**:
   - Mock 2 campaigns, 10 leads each
   - Verify correct grouping by ESP × domain
   - Verify totals sum correctly

2. **Multiple ESPs**:
   - Mock campaigns from different ESPs
   - Verify separate matrix rows created

3. **Metrics calculation**:
   - Verify reply_rate calculated correctly
   - Verify bounce_rate calculated correctly
   - Verify grade assigned per thresholds

4. **Edge cases**:
   - Campaign with no leads (skip)
   - All leads bounced (100% bounce, grade F)
   - Unknown ESP type (included as "Unknown")

5. **Performance**:
   - Mock 100 campaigns with 100 leads each
   - Verify completes in < 10 seconds

**Coverage Target**: 90%+

### Integration Tests (API route)

**Test Cases**:
1. Valid workspace ID → returns matrix
2. Invalid workspace ID → returns 404
3. Workspace with no campaigns → returns empty matrix
4. Response format matches spec

---

## Constitutional Compliance

### Article IV: ESP Performance Transparency
- ✓ ESP-to-ESP breakdown implemented
- ✓ Grading system per constitutional thresholds
- ✓ Receiving domain detection functional
- ✓ Comparison views available

### Article I: Data Accuracy Over Speed
- ✓ Calculations use tested functions
- ✓ Source data from EmailBison MCP
- ✓ Metrics verifiable against source

---

## Success Criteria

**Functional**:
- [ ] `buildESPMatrix()` implemented and tested (90%+ coverage)
- [ ] API route `/api/clients/[id]/esp` working
- [ ] UI component displays matrix with color coding
- [ ] Sorting functional on all columns
- [ ] Grades display correctly per thresholds

**Performance**:
- [ ] Response time < 5 seconds for typical workspace
- [ ] Handles 50+ campaigns efficiently
- [ ] No memory issues with large datasets

**Quality**:
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] TypeScript compiles without errors
- [ ] Visual design matches mockups

---

## Implementation Phases

### Phase 1: Core Logic (3 hours)
1. Implement `buildESPMatrix()` in esp-performance.ts
2. Write comprehensive unit tests
3. Optimize for performance

### Phase 2: API Endpoint (1 hour)
1. Create `/api/clients/[id]/esp/route.ts`
2. Integrate buildESPMatrix()
3. Add error handling
4. Test with Postman

### Phase 3: UI Component (2 hours)
1. Build esp-performance-table.tsx
2. Add sortable table with @tanstack/react-table
3. Implement color coding logic
4. Add refresh functionality

**Total Time**: 6 hours

---

## Related Documents
- [Constitution](../constitution.md) - Article IV (ESP Performance Transparency)
- [Plan](../plan.md) - ESP Performance Matrix architecture
- [Tasks](../tasks.md) - Tasks 4, 5, 7, 9

---

**Status**: Ready for Implementation
**Estimated Complexity**: Medium
**Dependencies**: esp-classifier.ts (✓), calculations.ts (✓), bison.ts (✓)
