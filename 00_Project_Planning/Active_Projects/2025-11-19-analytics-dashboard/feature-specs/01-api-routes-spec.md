# Feature Specification: API Routes for Live Data Integration

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Analytics Dashboard Team

## Overview

Create Next.js API routes that serve live EmailBison campaign data, replacing mock data with real-time information from the EmailBison MCP server. These routes form the backend data layer for the entire analytics dashboard.

## User Stories

### Story 1: List All Workspaces
**As a** dashboard user **I want** to see a list of all EmailBison workspaces **So that** I can select which client to analyze

**Acceptance Criteria**:
- [ ] API returns all active workspaces
- [ ] Response includes workspace ID and name
- [ ] Response time < 2 seconds
- [ ] Handles MCP connection failures gracefully

### Story 2: Get Campaign Data
**As a** dashboard user **I want** to retrieve all campaigns for a workspace **So that** I can analyze performance metrics

**Acceptance Criteria**:
- [ ] API returns all campaigns for specified workspace
- [ ] Response includes calculated metrics (reply rate, bounce rate, etc.)
- [ ] Returns 404 for invalid workspace IDs
- [ ] Response time < 3 seconds for 100+ campaigns

### Story 3: Get Overview KPIs
**As a** dashboard user **I want** to see aggregate KPIs for a client **So that** I can understand overall performance at a glance

**Acceptance Criteria**:
- [ ] API calculates and returns: total campaigns, overall reply rate, bounce rate, engaged leads
- [ ] Aggregates data across all campaigns in workspace
- [ ] Calculations match specification formulas exactly
- [ ] Includes timestamp for data freshness

---

## API Endpoints

### 1. GET /api/clients

**Purpose**: List all EmailBison workspaces

**Request**: None (no parameters)

**Response**:
```typescript
{
  clients: Array<{
    id: number;
    name: string;
  }>;
  timestamp: string; // ISO 8601
}
```

**Example Response**:
```json
{
  "clients": [
    { "id": 7, "name": "Foundation" },
    { "id": 17, "name": "TeachAid" },
    { "id": 22, "name": "Coherence" }
  ],
  "timestamp": "2025-11-19T18:30:00.000Z"
}
```

**Error Responses**:
- 500: MCP connection failure

---

### 2. GET /api/clients/[id]/campaigns

**Purpose**: Get all campaigns for a workspace with calculated metrics

**Request**:
- Path parameter: `id` (workspace ID)
- Query parameters (optional):
  - `status`: 'running' | 'paused' | 'completed'
  - `per_page`: number (default: 100)

**Response**:
```typescript
{
  campaigns: Array<{
    id: number;
    name: string;
    status: string;
    emails_sent: number;
    bounced: number;
    delivered: number; // calculated
    unique_replies: number;
    interested: number;
    reply_rate: number; // calculated %
    bounce_rate: number; // calculated %
    interest_rate: number; // calculated %
    engaged_lead_rate: number; // calculated
  }>;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
  timestamp: string;
}
```

**Error Responses**:
- 404: Workspace ID not found
- 500: MCP connection failure or calculation error

---

### 3. GET /api/clients/[id]/overview

**Purpose**: Get aggregate KPI metrics for a workspace

**Request**:
- Path parameter: `id` (workspace ID)

**Response**:
```typescript
{
  kpis: {
    total_campaigns: number;
    total_sends: number;
    total_delivered: number;
    total_replies: number;
    total_interested: number;
    total_bounced: number;
    overall_reply_rate: number; // %
    overall_bounce_rate: number; // %
    overall_interest_rate: number; // %
    engaged_leads: number;
    engaged_lead_rate: number;
  };
  timestamp: string;
}
```

**Calculation Logic**:
- Aggregate all campaigns in workspace
- Sum: emails_sent, bounced, unique_replies, interested
- Calculate delivered: total_sends - total_bounced
- Calculate overall_reply_rate: (total_replies / total_delivered) × 100
- Calculate overall_bounce_rate: (total_bounced / total_sends) × 100
- Calculate overall_interest_rate: (total_interested / total_replies) × 100
- Engaged_leads = total_interested
- Engaged_lead_rate = total_delivered / total_interested

**Error Responses**:
- 404: Workspace ID not found
- 500: Calculation error or MCP failure

---

## Implementation Details

### File Structure
```
app/api/
├── clients/
│   ├── route.ts                    (GET /api/clients)
│   └── [id]/
│       ├── campaigns/
│       │   └── route.ts            (GET /api/clients/[id]/campaigns)
│       └── overview/
│           └── route.ts            (GET /api/clients/[id]/overview)
```

### Dependencies
- `@/lib/services/bison` - EmailBison MCP integration
- `@/lib/services/calculations` - Metric calculations
- `@/lib/types/bison` - TypeScript types

### Error Handling Pattern
```typescript
export async function GET(req: Request) {
  try {
    // Call MCP service
    const data = await bisonService.getData();

    // Calculate metrics
    const metrics = calculateMetrics(data);

    // Return success
    return Response.json({
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (error instanceof BisonAPIError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }
    console.error('Unexpected error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Edge Cases & Error Scenarios

### Edge Case 1: Workspace with No Campaigns
- **Description**: Workspace exists but has no campaigns yet
- **Expected Behavior**: Return empty campaigns array, KPIs all zero
- **Handling**: `campaigns: [], kpis: { total_campaigns: 0, ... }`

### Edge Case 2: Campaigns with Zero Sends
- **Description**: Campaign created but not started
- **Expected Behavior**: Include in list, metrics return null or 0
- **Handling**: Rate calculations return null, display as "N/A" in UI

### Edge Case 3: All Campaigns Paused
- **Description**: No active campaigns, only paused ones
- **Expected Behavior**: Return paused campaigns if no status filter
- **Handling**: Include paused campaigns in aggregations

### Error Scenario 1: MCP Server Timeout
- **Trigger**: EmailBison MCP server unresponsive
- **User Experience**: "Unable to load data - Retry" with retry button
- **Recovery**: Retry with exponential backoff (already in bison.ts)

### Error Scenario 2: Invalid Calculation
- **Trigger**: Division by zero in metric calculation
- **User Experience**: Return null for that metric
- **Recovery**: Calculation functions already handle division by zero

### Error Scenario 3: Workspace ID Doesn't Exist
- **Trigger**: User requests workspace that was deleted
- **User Experience**: 404 error with message "Workspace not found"
- **Recovery**: UI shows error state, user can select different workspace

---

## Performance Requirements

**Response Times**:
- `/api/clients`: < 2 seconds (typically <500ms)
- `/api/clients/[id]/campaigns`: < 3 seconds for 100 campaigns
- `/api/clients/[id]/overview`: < 2 seconds (single aggregation)

**Optimization Strategies**:
- Use MCP pagination for large campaign lists
- Parallel requests where possible
- Calculate metrics in single pass (no multiple loops)

---

## Testing Strategy

### Unit Tests
- Test error handling for each route
- Test response format validation
- Test calculation integration
- Mock MCP responses

### Integration Tests
- Test with real MCP connection (if available in test env)
- Test full request/response cycle
- Test error propagation

### Load Tests
- Test with workspace containing 500+ campaigns
- Measure response times under load
- Verify no memory leaks

---

## Constitutional Compliance

### Article I: Data Accuracy Over Speed
- ✓ All calculations use tested calculation engine
- ✓ Source data from EmailBison MCP (no caching initially)
- ✓ Timestamps included for auditability

### Article II: Client Data Isolation
- ✓ All routes require workspace ID parameter
- ✓ No cross-workspace data leakage possible
- ✓ Validation of workspace access

### Article III: Real-Time Data Access
- ✓ Direct MCP queries (no stale cache)
- ✓ Timestamps on all responses
- ✓ Fresh data on every request

---

## Success Criteria

**Functional**:
- [ ] All 3 API routes implemented and working
- [ ] Response formats match specification exactly
- [ ] Error handling covers all scenarios
- [ ] TypeScript compiles with no errors

**Performance**:
- [ ] Response times meet requirements
- [ ] Handles 100+ campaigns efficiently
- [ ] No timeout errors under normal load

**Quality**:
- [ ] Unit tests for all routes (>80% coverage)
- [ ] Integration tests passing
- [ ] Error messages clear and actionable

---

## Implementation Phases

### Phase 1: Basic Routes (2 hours)
1. Create route files with TypeScript types
2. Implement GET handlers with MCP calls
3. Add basic error handling
4. Test with Postman/curl

### Phase 2: Calculations Integration (1 hour)
1. Import calculation engine
2. Add metric calculations to campaign route
3. Build aggregation logic for overview route
4. Validate calculation accuracy

### Phase 3: Error Handling & Polish (1 hour)
1. Add comprehensive try/catch blocks
2. Implement error response formatting
3. Add input validation
4. Test edge cases

**Total Time**: 4 hours

---

## Related Documents
- [Constitution](../constitution.md) - Governing principles
- [Plan](../plan.md) - Overall technical architecture
- [Tasks](../tasks.md) - Implementation tasks

---

**Status**: Ready for Implementation
**Estimated Complexity**: Low-Medium
**Dependencies**: Requires bison.ts and calculations.ts (✓ Complete)
