# Feature Specification: Cal.com Integration for Booking & Attendance Tracking

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Analytics Dashboard Team

## Overview

Integrate with Cal.com to track meeting bookings and attendance, completing the full conversion funnel from email send to meeting completion. This enables true ROI calculation and validates lead quality beyond just "interested" status.

## User Stories

### Story 1: Track Meeting Bookings
**As a** sales ops manager **I want** to see how many interested leads book meetings **So that** I can measure campaign effectiveness beyond replies

**Acceptance Criteria**:
- [ ] Fetch bookings from Cal.com API
- [ ] Match bookings to EmailBison leads by email address
- [ ] Display booking count per campaign
- [ ] Calculate booking rate (bookings / interested leads)

### Story 2: Monitor Meeting Attendance
**As a** team lead **I want** to track show-up rates **So that** I can identify lead quality issues

**Acceptance Criteria**:
- [ ] Receive attendance webhooks from Cal.com
- [ ] Update lead status when meeting occurs/no-shows
- [ ] Display show-up rate per campaign
- [ ] Calculate ROI: (showed up / total sends) × 100

### Story 3: Complete Funnel Visualization
**As a** dashboard user **I want** to see the complete funnel including bookings and shows **So that** I understand the full lead journey

**Acceptance Criteria**:
- [ ] Funnel includes "Booked" and "Showed" stages
- [ ] Conversion rates displayed between all stages
- [ ] Data updates in real-time as meetings occur
- [ ] Graceful degradation if Cal.com unavailable

---

## Functional Requirements

### 1. Cal.com API Integration

**API Endpoint**: `https://api.cal.com/v1/bookings`

**Authentication**: API Key (Bearer token)

**Request**:
```
GET https://api.cal.com/v1/bookings?eventTypeId={eventTypeId}&dateFrom={start}&dateTo={end}
Headers:
  Authorization: Bearer {CALCOM_API_KEY}
```

**Response**:
```json
{
  "bookings": [
    {
      "id": 12345,
      "title": "Discovery Call",
      "startTime": "2025-11-20T15:00:00Z",
      "endTime": "2025-11-20T15:30:00Z",
      "status": "accepted" | "cancelled" | "pending",
      "attendees": [
        {
          "email": "lead@acme.com",
          "name": "John Doe",
          "timeZone": "America/New_York"
        }
      ]
    }
  ]
}
```

**Frequency**: Poll every 15 minutes OR use webhooks (preferred)

---

### 2. Lead Matching Logic

**Challenge**: Match Cal.com booking attendee to EmailBison lead

**Matching Strategy**:
1. **Primary**: Email address (case-insensitive)
2. **Fallback**: Fuzzy match on name + company (if email varies)

**Implementation**:
```typescript
function matchBookingToLead(
  booking: CalComBooking,
  leads: Lead[]
): Lead | null {
  const attendeeEmail = booking.attendees[0]?.email?.toLowerCase();

  // Exact email match
  const exactMatch = leads.find(
    lead => lead.email.toLowerCase() === attendeeEmail
  );
  if (exactMatch) return exactMatch;

  // Fuzzy match (future enhancement)
  // Check if booking.attendees[0].name matches lead.first_name + last_name

  return null; // No match found
}
```

**Handling Unmatched Bookings**:
- Log for manual review
- Store in separate table: `unmatched_bookings`
- Admin interface to manually link (Phase 2)

---

### 3. Webhook Integration

**Webhook URL**: `https://yourdomain.com/api/webhooks/calcom`

**Event Types**:
- `booking.created` - New booking made
- `booking.rescheduled` - Booking time changed
- `booking.cancelled` - Booking cancelled
- `meeting.ended` - Meeting completed (use for attendance tracking)

**Webhook Payload**:
```json
{
  "triggerEvent": "meeting.ended",
  "createdAt": "2025-11-20T15:30:00Z",
  "payload": {
    "bookingId": 12345,
    "eventTypeId": 678,
    "attendees": [
      {
        "email": "lead@acme.com",
        "attended": true
      }
    ],
    "metadata": {
      "duration": 28 // minutes
    }
  }
}
```

**Security**: Verify webhook signature using CALCOM_WEBHOOK_SECRET

---

### 4. Data Storage (Phase 1: In-Memory)

**For v1**, store booking/attendance data in-memory (no database):

```typescript
// Global in-memory store (reset on server restart)
const bookingStore = new Map<number, {
  campaign_id: number;
  lead_id: number;
  booked_at: Date;
  showed_up: boolean | null; // null = pending, true/false = after meeting
  show_time: Date | null;
}>();
```

**Phase 2**: Migrate to PostgreSQL table:
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  campaign_id INT,
  lead_id INT,
  booking_id VARCHAR(255), -- Cal.com booking ID
  booked_at TIMESTAMP,
  scheduled_time TIMESTAMP,
  showed_up BOOLEAN,
  show_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 5. API Endpoints

#### A. GET /api/clients/[id]/bookings

**Purpose**: Fetch all bookings for a workspace

**Response**:
```typescript
{
  bookings: Array<{
    campaign_id: number;
    campaign_name: string;
    lead_email: string;
    booked_at: string;
    scheduled_time: string;
    showed_up: boolean | null;
  }>;
  summary: {
    total_bookings: number;
    total_shows: number;
    total_no_shows: number;
    pending_meetings: number;
    show_rate: number; // %
  };
  timestamp: string;
}
```

#### B. POST /api/webhooks/calcom

**Purpose**: Receive Cal.com webhook events

**Request Body**: Cal.com webhook payload

**Response**:
- 200 OK: Event processed
- 401 Unauthorized: Invalid signature
- 400 Bad Request: Invalid payload

**Processing Logic**:
1. Verify webhook signature
2. Parse event type
3. If `meeting.ended`:
   - Extract attendee email and attendance status
   - Find matching lead in EmailBison
   - Update booking record with show/no-show
4. Return 200 OK

---

### 6. Updated Funnel Calculation

**Extend `calculateFunnel()` to include Cal.com data**:

```typescript
interface ConversionFunnel {
  sent: number;
  delivered: number;
  replied: number;
  interested: number;
  booked: number; // NEW
  showed: number; // NEW

  delivery_rate: number; // %
  reply_rate: number; // %
  interest_rate: number; // %
  booking_rate: number; // % NEW
  show_rate: number; // % NEW
}
```

**Calculation**:
- `booked` = count of matched bookings for campaign
- `showed` = count of bookings where `showed_up = true`
- `booking_rate` = (booked / interested) × 100
- `show_rate` = (showed / booked) × 100

---

## Edge Cases & Error Scenarios

### Edge Case 1: Multiple Bookings per Lead
- **Description**: Lead books, cancels, rebooks
- **Expected Behavior**: Count latest booking only
- **Handling**: Track booking status, use most recent `accepted` booking

### Edge Case 2: Attendee Email Different from Lead Email
- **Description**: Lead uses personal email for booking, work email in campaign
- **Expected Behavior**: Fail to match automatically
- **Handling**: Store as unmatched, require manual review (Phase 2)

### Edge Case 3: Group Bookings
- **Description**: Cal.com booking has 2+ attendees
- **Expected Behavior**: Match each attendee independently
- **Handling**: Loop through attendees array, try to match each

### Edge Case 4: Booking Before Lead Exists
- **Description**: Someone books before being added to EmailBison
- **Expected Behavior**: Store booking, match later if lead added
- **Handling**: Periodic reconciliation job (Phase 2)

### Error Scenario 1: Cal.com API Down
- **Trigger**: Cal.com service outage
- **User Experience**: Show "Cal.com data unavailable" in funnel
- **Recovery**: Retry with exponential backoff, cache last known data

### Error Scenario 2: Webhook Delivery Failure
- **Trigger**: Our server unreachable when Cal.com sends webhook
- **User Experience**: Missing attendance data
- **Recovery**: Poll API periodically to backfill missing events

### Error Scenario 3: Invalid Webhook Signature
- **Trigger**: Malicious webhook request
- **User Experience**: No impact (rejected)
- **Recovery**: Log attempt, return 401, alert if repeated

---

## Performance Requirements

**API Response Times**:
- Booking fetch: < 2 seconds
- Webhook processing: < 500ms

**Webhook Reliability**:
- 99%+ successful processing
- Retry failed events (exponential backoff)

**Data Freshness**:
- Booking data: Within 15 minutes (if polling) or real-time (if webhooks)
- Attendance data: Real-time via webhooks

---

## Implementation Details

### File Structure
```
lib/
├── services/
│   ├── calcom.ts                    (API client)
│   └── __tests__/
│       └── calcom.test.ts           (Unit tests)
app/api/
├── clients/[id]/
│   └── bookings/
│       └── route.ts                 (Booking API)
└── webhooks/
    └── calcom/
        └── route.ts                 (Webhook handler)
```

### calcom.ts Service

```typescript
export class CalComService {
  private apiKey: string;
  private baseUrl = 'https://api.cal.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getBookings(params: {
    eventTypeId?: number;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<CalComBooking[]> {
    const url = new URL(`${this.baseUrl}/bookings`);
    if (params.eventTypeId) url.searchParams.set('eventTypeId', params.eventTypeId.toString());
    if (params.dateFrom) url.searchParams.set('dateFrom', params.dateFrom.toISOString());
    if (params.dateTo) url.searchParams.set('dateTo', params.dateTo.toISOString());

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Cal.com API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.bookings;
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    // Implement HMAC verification using CALCOM_WEBHOOK_SECRET
    const crypto = require('crypto');
    const secret = process.env.CALCOM_WEBHOOK_SECRET!;
    const hash = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    return hash === signature;
  }

  matchBookingToLeads(booking: CalComBooking, leads: Lead[]): Lead[] {
    const matches: Lead[] = [];

    for (const attendee of booking.attendees) {
      const match = leads.find(
        lead => lead.email.toLowerCase() === attendee.email.toLowerCase()
      );
      if (match) matches.push(match);
    }

    return matches;
  }
}
```

---

## Testing Strategy

### Unit Tests

**Test Cases**:
1. **API client**:
   - Successful booking fetch
   - API error handling
   - Query parameter construction

2. **Webhook signature verification**:
   - Valid signature → returns true
   - Invalid signature → returns false

3. **Lead matching**:
   - Exact email match → found
   - Case-insensitive match → found
   - No match → returns null

**Coverage Target**: 85%+

### Integration Tests

**Test Cases**:
1. Mock Cal.com API responses
2. Test webhook endpoint with valid/invalid signatures
3. Test full flow: booking → match → update funnel

---

## Constitutional Compliance

### Article X: Cal.com Integration for True ROI
- ✓ Booking data integrated from Cal.com API
- ✓ Attendance tracking via webhooks
- ✓ Full funnel includes booking → showed conversion
- ✓ Meeting outcomes tracked

### Article III: Real-Time Data Access
- ✓ Webhooks provide real-time attendance updates
- ✓ Booking data refreshed regularly
- ✓ Timestamps on all responses

---

## Success Criteria

**Functional**:
- [ ] Cal.com API integration working
- [ ] Webhook endpoint functional
- [ ] Lead matching accurate (>95%)
- [ ] Funnel displays booking/show data
- [ ] Graceful degradation if Cal.com unavailable

**Performance**:
- [ ] Booking fetch < 2 seconds
- [ ] Webhook processing < 500ms
- [ ] 99%+ webhook success rate

**Quality**:
- [ ] Unit tests passing (85%+ coverage)
- [ ] Webhook security validated
- [ ] No unhandled errors

---

## Implementation Phases

### Phase 1: API Integration (3 hours)
1. Create CalComService class
2. Implement getBookings()
3. Implement lead matching logic
4. Write unit tests

### Phase 2: Webhook Endpoint (2 hours)
1. Create `/api/webhooks/calcom/route.ts`
2. Implement signature verification
3. Process meeting.ended events
4. Update booking store

### Phase 3: Funnel Integration (2 hours)
1. Update ConversionFunnel interface
2. Extend calculateFunnel() to include Cal.com data
3. Update funnel UI component
4. Test end-to-end

**Total Time**: 7 hours

---

## Future Enhancements (Phase 2)

1. **Database Storage**: Persist bookings in PostgreSQL
2. **Unmatched Booking UI**: Admin interface to manually link bookings
3. **Meeting Notes**: Store notes from Cal.com
4. **Reschedule Tracking**: Track how often leads reschedule
5. **No-Show Analysis**: Identify patterns in no-shows
6. **Multi-Calendar Support**: Handle multiple Cal.com accounts

---

## Related Documents
- [Constitution](../constitution.md) - Article X (Cal.com Integration)
- [Plan](../plan.md) - Cal.com integration architecture
- [Tasks](../tasks.md) - Tasks 22, 23, 26

---

**Status**: Ready for Implementation
**Estimated Complexity**: Medium-High
**Dependencies**: bison.ts (✓), calculations.ts (✓)
**External Dependency**: Cal.com API access, webhook configuration
