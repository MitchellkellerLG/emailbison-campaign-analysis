# Feature Specification: Bounce Rate Monitoring & Alerting

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Analytics Dashboard Team

## Overview

Implement domain-level and ESP-level bounce rate tracking with threshold-based alerts to protect ESP reputation and identify problematic lead sources. High bounce rates damage sender reputation and reduce future deliverability.

## User Stories

### Story 1: Domain-Level Bounce Tracking
**As a** deliverability manager **I want** to see bounce rates per domain **So that** I can identify bad lead sources

**Acceptance Criteria**:
- [ ] View bounce rate for each domain (e.g., acme.com: 5%)
- [ ] Sort domains by bounce rate (highest first)
- [ ] Filter domains by bounce threshold (>2%, >5%, etc.)
- [ ] See volume per domain (total emails sent)

### Story 2: ESP-Level Bounce Monitoring
**As a** campaign manager **I want** to monitor ESP bounce rates **So that** I can prevent reputation damage

**Acceptance Criteria**:
- [ ] View bounce rate per ESP (Google/Gmail, Custom Domain, Outlook)
- [ ] Color-coded alerts: Green (<0.5%), Yellow (0.5-2%), Red (>2%)
- [ ] Historical trend (if data available)
- [ ] Recommendations when thresholds exceeded

### Story 3: Automated Alerts
**As a** team lead **I want** to receive alerts when bounce rates exceed thresholds **So that** I can take immediate action

**Acceptance Criteria**:
- [ ] Visual alert banner when any ESP >2% bounce
- [ ] Alert count badge in navigation
- [ ] Alert details show which ESP/domain is affected
- [ ] Dismissible alerts (with timestamp)

---

## Functional Requirements

### 1. Domain Bounce Calculation

**Input**: All leads for workspace with bounce status

**Process**:
1. For each lead:
   - Extract domain from email (everything after @)
   - Check if lead.bounced = true (or from lead_campaign_data)
2. Group by domain
3. For each domain:
   - Count total_sent_to_domain
   - Count total_bounced_at_domain
   - Calculate: bounce_rate = (bounced / sent) × 100
4. Determine alert_level:
   - Green: <0.5%
   - Yellow: 0.5-2%
   - Red: >2%

**Output**: Array of DomainBounceData

```typescript
interface DomainBounceData {
  domain: string; // e.g., "acme.com"
  total_sent: number;
  total_bounced: number;
  bounce_rate: number; // %
  alert_level: 'green' | 'yellow' | 'red';
}
```

---

### 2. ESP Bounce Rate Calculation

**Input**: All campaigns for workspace

**Process**:
1. Group campaigns by ESP type (using `categorizeESP()`)
2. For each ESP group:
   - Sum total_sent across all campaigns
   - Sum total_bounced across all campaigns
   - Calculate: esp_bounce_rate = (total_bounced / total_sent) × 100
3. Determine alert_level per ESP

**Output**: Array of ESPBounceData

```typescript
interface ESPBounceData {
  esp_type: ESPType;
  total_sent: number;
  total_bounced: number;
  bounce_rate: number; // %
  alert_level: 'green' | 'yellow' | 'red';
  recommendation?: string; // e.g., "Reduce sending volume by 50%"
}
```

---

### 3. Bounce Thresholds (from Constitution Article IX)

**Alert Levels**:
- **Green (<0.5%)**: Excellent deliverability
  - Recommendation: "Increase volume by 30%"
- **Yellow (0.5-2%)**: Acceptable deliverability
  - Recommendation: "Maintain current volume, monitor closely"
- **Red (>2%)**: Critical - reputation at risk
  - Recommendation: "Reduce volume immediately, review lead source quality"

**From Boundless ClickUp Doc**:
- Good: <0.5% bounce → 30% volume increase approved
- Acceptable: 0.5-2% bounce → 15% increase
- Issues: >2% bounce → Hold & investigate

---

### 4. API Endpoint

**Route**: `GET /api/clients/[id]/bounces`

**Response**:
```typescript
{
  esp_bounces: ESPBounceData[];
  domain_bounces: DomainBounceData[];
  alerts: {
    critical_count: number; // # of ESPs/domains >2%
    warning_count: number; // # at 0.5-2%
    critical_esps: string[]; // Names of ESPs in red zone
    critical_domains: string[]; // Domains in red zone
  };
  timestamp: string;
}
```

**Example Response**:
```json
{
  "esp_bounces": [
    {
      "esp_type": "Google/Gmail",
      "total_sent": 2434,
      "total_bounced": 12,
      "bounce_rate": 0.49,
      "alert_level": "green",
      "recommendation": "Increase volume by 30%"
    },
    {
      "esp_type": "Custom Domain",
      "total_sent": 1870,
      "total_bounced": 47,
      "bounce_rate": 2.51,
      "alert_level": "red",
      "recommendation": "Reduce volume immediately"
    }
  ],
  "domain_bounces": [
    {
      "domain": "badleads.com",
      "total_sent": 150,
      "total_bounced": 35,
      "bounce_rate": 23.3,
      "alert_level": "red"
    },
    {
      "domain": "acme.com",
      "total_sent": 280,
      "total_bounced": 8,
      "bounce_rate": 2.86,
      "alert_level": "red"
    }
  ],
  "alerts": {
    "critical_count": 3,
    "warning_count": 1,
    "critical_esps": ["Custom Domain"],
    "critical_domains": ["badleads.com", "acme.com"]
  },
  "timestamp": "2025-11-19T19:30:00.000Z"
}
```

---

### 5. UI Components

#### A. BounceMonitoring.tsx (Main Component)

**Sections**:
1. **Alert Banner** (if critical alerts exist)
   ```
   ⚠️ CRITICAL: 3 ESPs/domains exceeding 2% bounce threshold
   [View Details]
   ```

2. **ESP Bounce Rates Table**
   ```
   ┌────────────────┬────────┬──────────┬─────────────┬────────┬──────────────────┐
   │ ESP Type       │ Volume │ Bounced  │ Bounce Rate │ Status │ Recommendation   │
   ├────────────────┼────────┼──────────┼─────────────┼────────┼──────────────────┤
   │ Google/Gmail   │ 2,434  │ 12       │ 0.49% 🟢    │ Good   │ Increase +30%    │
   │ Custom Domain  │ 1,870  │ 47       │ 2.51% 🔴    │ ALERT  │ Reduce volume    │
   │ Outlook/MS     │   921  │ 8        │ 0.87% 🟡    │ OK     │ Monitor closely  │
   └────────────────┴────────┴──────────┴─────────────┴────────┴──────────────────┘
   ```

3. **Domain Bounce Rates Table** (sortable, paginated if >50 domains)
   ```
   ┌──────────────────┬────────┬──────────┬─────────────┬────────┐
   │ Domain           │ Volume │ Bounced  │ Bounce Rate │ Status │
   ├──────────────────┼────────┼──────────┼─────────────┼────────┤
   │ badleads.com     │   150  │ 35       │ 23.3% 🔴    │ ALERT  │
   │ acme.com         │   280  │  8       │  2.86% 🔴   │ ALERT  │
   │ example.org      │   520  │  3       │  0.58% 🟡   │ OK     │
   │ company.io       │ 1,200  │  2       │  0.17% 🟢   │ Good   │
   └──────────────────┴────────┴──────────┴─────────────┴────────┘
   ```

#### B. AlertBanner.tsx

**Props**:
- `alertCount`: number
- `criticalESPs`: string[]
- `criticalDomains`: string[]
- `onDismiss`: () => void

**Visual**:
- Red background, white text
- Dismissible (X button)
- Sticky at top of dashboard
- Shows count + affected ESPs/domains

---

## Edge Cases & Error Scenarios

### Edge Case 1: Zero Bounces (Perfect Deliverability)
- **Description**: All emails delivered, 0% bounce rate
- **Expected Behavior**: Show 0% with green status, recommend volume increase
- **Handling**: Display "Perfect deliverability" message

### Edge Case 2: 100% Bounce Rate
- **Description**: All emails to a domain bounced
- **Expected Behavior**: Show 100% with red alert, recommend removing domain
- **Handling**: Special "DO NOT USE" label on domain

### Edge Case 3: Low Volume Domain (<10 emails)
- **Description**: Domain has 1 bounce out of 2 sends (50% bounce)
- **Expected Behavior**: Flag as "Insufficient data"
- **Handling**: Show rate but add "(Low sample size)" warning

### Edge Case 4: New ESP with No History
- **Description**: ESP just added, no historical data
- **Expected Behavior**: Show current rate, no trend
- **Handling**: Display "Monitoring - insufficient history"

### Error Scenario 1: Missing Bounce Data
- **Trigger**: Lead records don't include bounce status
- **User Experience**: Show "Bounce data unavailable"
- **Recovery**: Check data source, use alternative field

### Error Scenario 2: Domain Parse Failure
- **Trigger**: Malformed email addresses
- **User Experience**: Categorize as "Invalid/Unknown"
- **Recovery**: Log invalid emails for review

---

## Performance Requirements

**Response Time**:
- < 3 seconds for 50,000 leads
- < 5 seconds for 200,000 leads

**Optimization Strategies**:
1. Stream processing (aggregate as parsing)
2. Domain extraction optimized (regex compilation)
3. Early termination for severely bad domains (>50% bounce)
4. Consider sampling for >500 domains (show top 50 by volume)

---

## Implementation Details

### File Structure
```
lib/
├── services/
│   ├── bounce-monitor.ts            (Calculator)
│   └── __tests__/
│       └── bounce-monitor.test.ts   (Unit tests)
app/api/
└── clients/[id]/
    └── bounces/
        └── route.ts                 (API endpoint)
components/
├── bounce-monitoring.tsx            (Main component)
└── alert-banner.tsx                 (Alert UI)
```

### calculateBouncesByDomain() Function

```typescript
export async function calculateBouncesByDomain(
  workspaceId: number
): Promise<DomainBounceData[]> {
  // Fetch all campaigns
  const { campaigns } = await getCampaigns(workspaceId);

  // Map: domain → { sent, bounced }
  const domainMap = new Map<string, { sent: number; bounced: number }>();

  // Process each campaign
  for (const campaign of campaigns) {
    const { leads } = await getLeads(campaign.id);

    for (const lead of leads) {
      // Extract domain
      const domain = extractDomain(lead.email);

      if (!domainMap.has(domain)) {
        domainMap.set(domain, { sent: 0, bounced: 0 });
      }

      const entry = domainMap.get(domain)!;
      entry.sent++;

      // Check bounce status
      const leadCampaignData = lead.lead_campaign_data?.find(
        lcd => lcd.campaign_id === campaign.id
      );
      if (leadCampaignData?.bounced) {
        entry.bounced++;
      }
    }
  }

  // Calculate rates and alert levels
  const result: DomainBounceData[] = [];
  for (const [domain, data] of domainMap) {
    const bounceRate = calculateBounceRate(data.sent, data.bounced) || 0;
    const alertLevel = getAlertLevel(bounceRate);

    result.push({
      domain,
      total_sent: data.sent,
      total_bounced: data.bounced,
      bounce_rate: bounceRate,
      alert_level: alertLevel
    });
  }

  // Sort by bounce rate descending
  return result.sort((a, b) => b.bounce_rate - a.bounce_rate);
}

function extractDomain(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : 'invalid';
}

function getAlertLevel(bounceRate: number): 'green' | 'yellow' | 'red' {
  if (bounceRate < 0.5) return 'green';
  if (bounceRate <= 2.0) return 'yellow';
  return 'red';
}
```

---

## Testing Strategy

### Unit Tests

**Test Cases**:
1. **Domain extraction**:
   - Valid email → correct domain
   - Multiple @ symbols → handle gracefully
   - No @ symbol → "invalid"

2. **Bounce calculation**:
   - Mix of bounced/delivered → correct %
   - All bounced → 100%
   - Zero bounced → 0%

3. **Alert levels**:
   - 0.3% → green
   - 1.5% → yellow
   - 3.0% → red

4. **ESP aggregation**:
   - Multiple campaigns per ESP
   - Correct totals across campaigns

**Coverage Target**: 90%+

### Integration Tests

**Test Cases**:
1. Valid workspace → returns bounce data
2. Empty workspace → returns empty arrays
3. Alert counts accurate
4. Response format matches spec

---

## Constitutional Compliance

### Article IX: Bounce Tracking and Alerting
- ✓ Bounce rates tracked per domain, per ESP, and overall
- ✓ Thresholds trigger alerts
- ✓ Visual alerts when thresholds exceeded
- ✓ Historical tracking for pattern detection (future)

### Article I: Data Accuracy Over Speed
- ✓ Bounce calculations tested
- ✓ Source data from EmailBison MCP
- ✓ Alert thresholds match constitution

---

## Success Criteria

**Functional**:
- [ ] Domain bounce calculation implemented (90%+ coverage)
- [ ] ESP bounce calculation implemented
- [ ] API route working
- [ ] Alert logic functional
- [ ] UI displays tables and alerts correctly

**Performance**:
- [ ] Response time < 3 seconds for 50K leads
- [ ] Handles 500+ unique domains
- [ ] No memory issues

**Quality**:
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Alert thresholds validated
- [ ] UI visually clear and actionable

---

## Implementation Phases

### Phase 1: Core Logic (3 hours)
1. Implement domain/ESP bounce calculators
2. Write comprehensive unit tests
3. Test alert level logic

### Phase 2: API Endpoint (1 hour)
1. Create `/api/clients/[id]/bounces/route.ts`
2. Integrate bounce calculators
3. Add error handling
4. Test with Postman

### Phase 3: UI Components (3 hours)
1. Build bounce-monitoring.tsx
2. Build alert-banner.tsx
3. Add sortable domain table
4. Implement color coding
5. Test with real data

**Total Time**: 7 hours

---

## Related Documents
- [Constitution](../constitution.md) - Article IX (Bounce Tracking)
- [Plan](../plan.md) - Bounce monitoring architecture
- [Tasks](../tasks.md) - Tasks 21, 24, 25, 27

---

**Status**: Ready for Implementation
**Estimated Complexity**: Medium
**Dependencies**: calculations.ts (✓), bison.ts (✓)
