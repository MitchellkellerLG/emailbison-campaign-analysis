# Implementation Plan: EmailBison Analytics Dashboard

**Created**: 2025-11-19 | **Status**: Active | **Author**: Mitchell Keller

## Technology Stack

### Frontend: Next.js 14 (React 18, TypeScript 5)
**Rationale**:
- Server-side rendering for fast initial loads
- TypeScript for type safety and developer experience
- React ecosystem for rich data visualization (Recharts, Tremor)
- API routes for backend integration without separate server

**Alternatives Considered**:
- ❌ Pure React SPA: Slower initial load, no SSR benefits
- ❌ Python Dash/Streamlit: Less flexible UI, harder to customize
- ❌ Vue.js: Smaller ecosystem for data visualization

### UI Framework: Tailwind CSS + shadcn/ui
**Rationale**:
- Tailwind: Utility-first CSS for rapid development
- shadcn/ui: High-quality, accessible components (tables, charts, dropdowns)
- Tremor: Purpose-built analytics dashboard components

**Alternatives Considered**:
- ❌ Material-UI: Heavier bundle size, harder to customize
- ❌ Custom CSS: Slower development, reinventing the wheel

### Data Visualization: Recharts + Tremor
**Rationale**:
- Recharts: Composable, React-native charts with good documentation
- Tremor: Pre-built dashboard components (KPI cards, performance charts)
- Both integrate seamlessly with React/TypeScript

**Alternatives Considered**:
- ❌ D3.js: Steep learning curve, over-engineered for our needs
- ❌ Chart.js: Less React-friendly, imperative API

### Backend: Next.js API Routes + EmailBison MCP
**Rationale**:
- Next.js API routes eliminate need for separate backend server
- Direct integration with EmailBison MCP tools (already configured)
- TypeScript end-to-end for consistency

**Data Layer**:
- **Phase 1 (v1)**: Direct EmailBison MCP calls (no database)
- **Phase 2 (v2)**: PostgreSQL for caching and historical trends

**Alternatives Considered**:
- ❌ Python FastAPI backend: Adds deployment complexity, language context switching
- ❌ Express.js: Redundant when Next.js API routes sufficient

### Cal.com Integration: REST API + Webhooks
**Rationale**:
- Cal.com API for pulling booking data
- Webhooks for real-time attendance events
- Standard REST integration pattern

### Key Dependencies

**Frontend**:
- `next@14.x`: React framework with SSR
- `react@18.x`, `react-dom@18.x`: UI library
- `typescript@5.x`: Type safety
- `tailwindcss@3.x`: Utility CSS
- `@tremor/react@3.x`: Dashboard components
- `recharts@2.x`: Charts
- `@tanstack/react-table@8.x`: Sortable tables
- `swr@2.x`: Data fetching with caching
- `zod@3.x`: Runtime schema validation

**Backend/MCP**:
- `@modelcontextprotocol/sdk`: MCP client (already available)
- `date-fns@3.x`: Date manipulation
- `node-fetch@3.x`: HTTP requests (Cal.com API)

**Development**:
- `eslint@8.x`: Linting
- `prettier@3.x`: Code formatting
- `jest@29.x`, `@testing-library/react@14.x`: Testing

---

## Architecture

### Component Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Frontend (React Components)                │  │
│  │                                                        │  │
│  │  ├─ ClientSelector (dropdown)                         │  │
│  │  ├─ DashboardLayout                                   │  │
│  │  │   ├─ KPICards (reply rate, bounce rate, etc.)     │  │
│  │  │   ├─ ESPPerformanceMatrix (table + heatmap)       │  │
│  │  │   ├─ ConversionFunnel (chart)                     │  │
│  │  │   ├─ SegmentAnalysis (filterable tables)          │  │
│  │  │   └─ BounceRateAlerts (threshold warnings)        │  │
│  │  ├─ PerformanceTables (sortable)                     │  │
│  │  └─ CrossClientView (anonymized)                     │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                             │                                 │
│                             │ SWR fetch()                     │
│                             ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Next.js API Routes                         │  │
│  │                                                        │  │
│  │  /api/clients                  → List all clients     │  │
│  │  /api/clients/[id]/campaigns   → Client campaigns    │  │
│  │  /api/clients/[id]/esp         → ESP performance     │  │
│  │  /api/clients/[id]/funnel      → Conversion funnel   │  │
│  │  /api/clients/[id]/segments    → Firmographic data   │  │
│  │  /api/clients/[id]/bounces     → Bounce analytics    │  │
│  │  /api/cross-client             → Anonymized view     │  │
│  │  /api/webhooks/calcom          → Cal.com events      │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                             │                                 │
│                             │ MCP calls                       │
│                             ▼                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Data Processing Layer                       │  │
│  │                                                        │  │
│  │  ├─ BisonDataService                                  │  │
│  │  │   ├─ getCampaigns() → EmailBison MCP              │  │
│  │  │   ├─ getLeads() → EmailBison MCP                  │  │
│  │  │   └─ getWorkspaces() → EmailBison MCP             │  │
│  │  │                                                     │  │
│  │  ├─ CalculationEngine                                 │  │
│  │  │   ├─ calculateReplyRates()                         │  │
│  │  │   ├─ calculateBounceRates()                        │  │
│  │  │   ├─ calculateConversionFunnel()                   │  │
│  │  │   ├─ categorizeESP()                               │  │
│  │  │   ├─ parseReceivingDomain()                        │  │
│  │  │   └─ classifyFirmographics()                       │  │
│  │  │                                                     │  │
│  │  ├─ CalComService                                     │  │
│  │  │   ├─ getBookings() → Cal.com API                  │  │
│  │  │   └─ handleAttendanceWebhook()                    │  │
│  │  │                                                     │  │
│  │  └─ DataValidator                                     │  │
│  │      ├─ validateCampaignData()                        │  │
│  │      ├─ sanitizePII()                                 │  │
│  │      └─ auditCalculations()                           │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────────┐
        │      External Services                   │
        │                                          │
        │  ├─ EmailBison MCP Server               │
        │  │   └─ mcp__bison_mcp (54 tools)       │
        │  │                                       │
        │  └─ Cal.com                              │
        │      ├─ REST API (bookings)             │
        │      └─ Webhooks (attendance)           │
        │                                          │
        └─────────────────────────────────────────┘
```

### Data Flow

**Primary User Flow: View Client Dashboard**

1. **User selects client** from dropdown
2. **Frontend** fetches data via SWR: `GET /api/clients/[id]/campaigns`
3. **API route** calls `BisonDataService.getCampaigns(workspaceId)`
4. **BisonDataService** calls EmailBison MCP: `mcp__bison_mcp__get_campaigns`
5. **CalculationEngine** processes raw data:
   - Calculate reply rates per campaign
   - Categorize sending ESPs
   - Parse receiving domains from leads
   - Build ESP-to-ESP performance matrix
6. **DataValidator** audits calculations and sanitizes PII
7. **API route** returns JSON response with timestamp
8. **Frontend** renders dashboard components with real-time data

**Secondary Flow: Cross-Client Analytics**

1. **User navigates** to cross-client view
2. **Frontend** fetches: `GET /api/cross-client`
3. **API route** iterates over all workspace IDs
4. **BisonDataService** fetches data per workspace (parallel requests)
5. **CalculationEngine** aggregates metrics, anonymizes client identifiers
6. **API route** returns sorted, anonymized aggregate data
7. **Frontend** renders comparison tables/charts

**Webhook Flow: Cal.com Attendance**

1. **Cal.com** sends POST to `/api/webhooks/calcom` when meeting completes
2. **Webhook handler** validates signature, extracts attendee email
3. **CalComService** matches email to EmailBison lead
4. **Data update** marks booking as "showed" or "no-show"
5. **Future SWR refetch** pulls updated show-up rate

### Data Models

```typescript
// Core Campaign Data (from EmailBison MCP)
interface Campaign {
  id: number;
  name: string;
  workspace_id: number;
  status: 'running' | 'paused' | 'completed';
  emails_sent: number;
  bounced: number;
  unique_replies: number;
  interested: number;
  unsubscribed: number;
  total_leads_contacted: number;
  created_at: string;
  updated_at: string;
}

// Enriched Campaign with Calculated Metrics
interface CampaignAnalytics extends Campaign {
  delivered: number;               // emails_sent - bounced
  reply_rate: number;              // (unique_replies / delivered) * 100
  bounce_rate: number;             // (bounced / emails_sent) * 100
  interest_rate: number;           // (interested / unique_replies) * 100
  engaged_lead_rate: number;       // delivered / interested
  sending_esp: ESPType;
  bookings?: number;               // from Cal.com
  shows?: number;                  // from Cal.com
  booking_rate?: number;           // (bookings / interested) * 100
  show_rate?: number;              // (shows / bookings) * 100
  last_updated: Date;
}

// ESP Classification
type ESPType = 'Google/Gmail' | 'Custom Domain' | 'Outlook/Microsoft' | 'Unknown';

// ESP Performance Matrix
interface ESPPerformance {
  sending_esp: ESPType;
  receiving_domain_type: 'Gmail' | 'Outlook' | 'Custom' | 'Unknown';
  total_sent: number;
  total_delivered: number;
  total_replies: number;
  total_bounced: number;
  reply_rate: number;
  bounce_rate: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// Firmographic Segment
interface Segment {
  segment_type: 'industry' | 'company_size' | 'seniority';
  segment_value: string;
  total_sent: number;
  total_replies: number;
  total_interested: number;
  total_booked?: number;
  reply_rate: number;
  interest_rate: number;
  booking_rate?: number;
}

// Lead Data (from EmailBison MCP)
interface Lead {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company?: string;
  title?: string;
  industry?: string;
  lead_campaign_data: LeadCampaignData[];
}

interface LeadCampaignData {
  campaign_id: number;
  status: string;
  replied: boolean;
  interested: boolean;
  bounced: boolean;
}

// Firmographic Classification
interface FirmographicData {
  industry: string;        // Extracted/classified
  company_size: 'SMB' | 'Mid-market' | 'Enterprise' | 'Unknown';
  seniority: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'IC' | 'Unknown';
}

// Bounce Analysis
interface DomainBounceData {
  domain: string;
  total_sent: number;
  total_bounced: number;
  bounce_rate: number;
  alert_level: 'green' | 'yellow' | 'red';
}

// Cal.com Models
interface CalComBooking {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees: Array<{
    email: string;
    name: string;
  }>;
  status: 'accepted' | 'cancelled' | 'pending';
}

interface CalComAttendanceEvent {
  booking_id: string;
  attendee_email: string;
  attended: boolean;
  timestamp: string;
}

// Cross-Client Aggregate
interface CrossClientMetrics {
  client_id: string;           // Anonymized: "Client A"
  total_campaigns: number;
  total_sent: number;
  total_replies: number;
  total_interested: number;
  overall_reply_rate: number;
  overall_interest_rate: number;
  engaged_lead_rate: number;
  top_esp: ESPType;
}
```

---

## Implementation Approach

### Phase 1: Core Infrastructure & ESP Analytics
**Duration**: Week 1

**Tasks**:
1. Initialize Next.js project with TypeScript, Tailwind, shadcn/ui
2. Set up project structure: `/app`, `/components`, `/lib`, `/api`
3. Create EmailBison MCP integration service (`lib/services/bison.ts`)
4. Implement calculation engine (`lib/services/calculations.ts`)
5. Build ESP categorization logic
6. Create receiving domain parser
7. Build ESP performance matrix calculations
8. Create API routes: `/api/clients`, `/api/clients/[id]/esp`
9. Build basic dashboard layout with client selector
10. Create ESP performance table component (sortable)
11. Add ESP performance heatmap/matrix view

**Gate**:
- ESP performance matrix displays correctly for test client
- Calculations match EmailBison API data exactly
- Sorting works on all metrics

### Phase 2: Conversion Funnel & Firmographics
**Duration**: Week 1

**Tasks**:
1. Implement full funnel calculations (sends → showed)
2. Build firmographic classification logic (industry, size, seniority)
3. Create API routes: `/api/clients/[id]/funnel`, `/api/clients/[id]/segments`
4. Build conversion funnel visualization component
5. Create segment analysis tables with filters
6. Add segment performance comparison charts
7. Implement interest rate and engaged lead rate metrics
8. Build KPI card components for dashboard

**Gate**:
- Funnel visualization shows correct stage-by-stage conversion
- Segment filters work correctly
- Firmographic classification achieves >90% accuracy on test data

### Phase 3: Bounce Monitoring & Cal.com Integration
**Duration**: Week 1

**Tasks**:
1. Implement domain-level bounce rate calculations
2. Create bounce threshold alert logic
3. Build bounce rate monitoring components
4. Add visual alerts for ESP bounce thresholds
5. Integrate Cal.com API client
6. Create Cal.com webhook endpoint
7. Implement booking data fetching
8. Build attendance tracking logic
9. Link Cal.com data to EmailBison leads
10. Add booking/show metrics to dashboard

**Gate**:
- Bounce alerts trigger at correct thresholds
- Cal.com bookings sync successfully
- Webhook processes attendance events reliably

### Phase 4: Cross-Client Analytics & Polish
**Duration**: Week 1

**Tasks**:
1. Implement client data anonymization
2. Build cross-client aggregation logic
3. Create `/api/cross-client` route
4. Build cross-client dashboard view
5. Add sortable cross-client tables
6. Implement performance ranking system
7. Add color-coded performance tiers
8. Build data refresh UI (timestamps, manual refresh)
9. Implement error handling and loading states
10. Add PII scrubbing and security audit
11. Performance optimization (caching, lazy loading)
12. Write user documentation

**Gate**:
- Cross-client view never exposes client names
- All tables sortable with correct rankings
- Performance meets success criteria (<3s loads)
- Security audit passes (no PII leaks)

---

## Error Handling Strategy

### EmailBison MCP API Errors
- **Network timeout**: Retry with exponential backoff (3 attempts)
- **Authentication failure**: Display "MCP connection error - contact admin"
- **Rate limiting**: Queue requests, show "Loading..." with progress indicator
- **Invalid workspace ID**: Show empty state "Client not found"

### Cal.com Integration Errors
- **API unavailable**: Graceful degradation - show booking metrics as "N/A"
- **Webhook signature invalid**: Log error, reject request (security)
- **Email match failure**: Store unmatched bookings for manual review

### Calculation Errors
- **Division by zero**: Return null, display "N/A" in UI
- **Data inconsistency**: Log warning, use fallback calculation
- **Invalid domain parse**: Categorize as "Unknown" domain type

### Frontend Errors
- **SWR fetch failure**: Show cached data with stale warning + retry button
- **Render error**: Error boundary catches, displays "Something went wrong"
- **Invalid user input**: Form validation with clear error messages

---

## Constitutional Compliance

### Article I: Data Accuracy Over Speed
- **Compliance**: All calculations tested with unit tests (known inputs/outputs)
- **Validation**: Calculation engine includes audit mode that logs all intermediate steps
- **Enforcement**: CI/CD runs calculation tests, blocks merge if accuracy < 100%

### Article II: Client Data Isolation
- **Compliance**: All API routes require `workspace_id` parameter (no global queries)
- **Validation**: Integration tests verify selecting Client A never returns Client B data
- **Enforcement**: Code review checklist includes client isolation verification

### Article III: Real-Time Data Access
- **Compliance**: SWR fetches from EmailBison MCP on every dashboard load (15min cache)
- **Validation**: Timestamps displayed on all metrics, manual refresh available
- **Enforcement**: Automated tests verify cache TTL respected

### Article IV: ESP Performance Transparency
- **Compliance**: ESP-to-ESP matrix built from categorized sending/receiving ESPs
- **Validation**: Grading system implemented per constitutional thresholds
- **Enforcement**: ESP performance tests validate correct categorization

### Article V: Segmentation by Firmographics
- **Compliance**: Firmographic classifier extracts industry, size, seniority from lead data
- **Validation**: Unit tests for classification logic with sample titles/companies
- **Enforcement**: >90% classification accuracy required (measured on test dataset)

### Article VI: Conversion Funnel Completeness
- **Compliance**: All funnel stages calculated (sends → shows)
- **Validation**: Funnel visualization displays all stages with conversion rates
- **Enforcement**: Interest rate and engaged lead rate prominently displayed

### Article VII: Per-Client Dashboards with Cross-Client Insights
- **Compliance**: Client selector filters all data to selected workspace
- **Validation**: Cross-client view uses anonymized identifiers
- **Enforcement**: Manual test confirms no client name leakage

### Article VIII: Sortability and Ranking
- **Compliance**: All tables use @tanstack/react-table with sorting enabled
- **Validation**: Click column headers to sort ascending/descending
- **Enforcement**: UI test suite verifies sorting on all metric columns

### Article IX: Bounce Tracking and Alerting
- **Compliance**: Bounce rates calculated per domain and per ESP
- **Validation**: Alert thresholds implemented (green <0.5%, yellow 0.5-2%, red >2%)
- **Enforcement**: Visual alerts render when thresholds exceeded

### Article X: Cal.com Integration for True ROI
- **Compliance**: Cal.com API + webhook integration implemented
- **Validation**: Booking and attendance data linked to leads by email
- **Enforcement**: Full funnel includes booking → showed conversion

---

## Testing Strategy

### Unit Tests
- **Scope**: All calculation functions, data parsing, classification logic
- **Coverage Target**: 90%+ line coverage
- **Tools**: Jest, @testing-library/react
- **Examples**:
  - `calculateReplyRate()` with known inputs
  - ESP categorization with sample workspace names
  - Domain parser with various email formats
  - Firmographic classifier with sample titles

### Integration Tests
- **Scope**: API routes, EmailBison MCP integration, Cal.com API
- **Approach**: Mock MCP responses, test end-to-end data flow
- **Examples**:
  - `/api/clients/[id]/campaigns` returns correct shape
  - ESP performance matrix aggregates correctly
  - Cross-client route anonymizes identifiers

### End-to-End Tests
- **Scope**: Critical user flows
- **Tools**: Playwright or Cypress
- **Examples**:
  - Select client → dashboard loads → metrics display
  - Sort ESP table → order changes correctly
  - Click refresh → data updates

### Performance Tests
- **Benchmarks**:
  - Dashboard initial load: <3 seconds
  - API route response: <2 seconds
  - ESP matrix calculation: <1 second for 100 campaigns
- **Tools**: Lighthouse, Chrome DevTools Performance tab

### Security Tests
- **Scope**: Client isolation, PII scrubbing, webhook validation
- **Examples**:
  - Verify workspace A data never appears when workspace B selected
  - Check logs contain no email addresses or client names
  - Test webhook rejects requests with invalid signatures

---

## Dependencies

### Required

**Frontend**:
- `next@14.x` - React framework
- `react@18.x`, `react-dom@18.x` - UI library
- `typescript@5.x` - Type safety
- `tailwindcss@3.x` - Styling
- `@tremor/react@3.x` - Dashboard components
- `recharts@2.x` - Charts
- `@tanstack/react-table@8.x` - Sortable tables
- `swr@2.x` - Data fetching/caching
- `zod@3.x` - Schema validation
- `date-fns@3.x` - Date utilities

**Backend**:
- `@modelcontextprotocol/sdk` - MCP client (already available)
- `node-fetch@3.x` - Cal.com API requests

**Development**:
- `eslint@8.x` - Linting
- `prettier@3.x` - Formatting
- `jest@29.x` - Testing
- `@testing-library/react@14.x` - React testing

### Optional (Future Enhancements)

- `pg@8.x` - PostgreSQL client (Phase 2: historical data storage)
- `drizzle-orm@0.x` - Type-safe ORM (Phase 2)
- `@vercel/analytics@1.x` - Usage analytics
- `sentry/nextjs@8.x` - Error tracking
- `next-auth@4.x` - Authentication (if client portals added)

---

## Open Questions

**[RESOLVED] Question 1**: Should we build a separate backend or use Next.js API routes?
- **Decision**: Use Next.js API routes for simplicity
- **Impact**: Faster initial development, easier deployment
- **Resolved**: 2025-11-19

**[PENDING] Question 2**: How should we handle historical data storage?
- **Options**:
  - A) No storage, always fetch from EmailBison MCP (simple, always fresh)
  - B) PostgreSQL cache with daily snapshots (enables trends, faster queries)
- **Impact**: Performance vs complexity tradeoff
- **Current Plan**: Start with A (no DB), add B in Phase 2 if needed
- **Decision Needed By**: End of Phase 1

**[PENDING] Question 3**: Should we implement authentication for the dashboard?
- **Options**:
  - A) No auth initially (internal tool, trust network security)
  - B) Basic auth (simple username/password)
  - C) Next-Auth with OAuth (Google Workspace SSO)
- **Impact**: Security vs development time
- **Current Plan**: Start with A, add C if client portals needed
- **Decision Needed By**: Before any external client access

**[PENDING] Question 4**: How to handle multiple workspaces per client?
- **Context**: Some clients may use multiple EmailBison workspaces
- **Options**:
  - A) One workspace = one client (simple, may not reflect reality)
  - B) Client entity that groups multiple workspaces (complex, more accurate)
- **Impact**: Data model design
- **Current Assumption**: A (one-to-one mapping)
- **Decision Needed By**: Phase 1 testing with real clients

**[PENDING] Question 5**: What's the EmailBison MCP rate limit?
- **Impact**: Affects caching strategy and concurrent request handling
- **Action Required**: Test with production API, document limits
- **Decision Needed By**: Phase 1 implementation

---

## Deployment Plan

### Hosting: Vercel (Recommended)
- **Rationale**: Native Next.js support, edge functions, automatic HTTPS
- **Alternatives**: Netlify, AWS Amplify, self-hosted Docker

### Environment Variables
```bash
BISON_MCP_URL=...
CALCOM_API_KEY=...
CALCOM_WEBHOOK_SECRET=...
NODE_ENV=production
```

### CI/CD
- GitHub Actions or Vercel automatic deployments
- Run tests on every PR
- Block merge if tests fail or coverage < 90%

### Monitoring
- Vercel Analytics for performance
- Console logs for MCP API errors (initially)
- Future: Sentry for error tracking

---

## Related Documents

- [Constitution](constitution.md) - Governing principles
- [Specification](specification.md) - Feature requirements
- [Tasks](tasks.md) - Detailed work breakdown (to be created)

---

**Plan Version**: 1.0
**Status**: Ready for Implementation
**Next Step**: Generate detailed task breakdown
