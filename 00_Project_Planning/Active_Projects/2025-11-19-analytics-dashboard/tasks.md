# Implementation Tasks: EmailBison Analytics Dashboard

**Created**: 2025-11-19 | **Total Tasks**: 45 | **Estimated Duration**: 4 weeks (1 developer) / 2 weeks (parallel agents)

## Task Overview

**Parallelizable Tasks**: 1-5, 11-15, 21-25, 31-35 (infrastructure, calculations, API routes, components can be built concurrently)
**Critical Path**: 1 → 6 → 16 → 26 → 36 → 41 → 45

**Agent Deployment Strategy**: Deploy 10+ specialized agents working in parallel across these task groups

---

## Phase 1: Core Infrastructure & ESP Analytics (Week 1)

### Task 1: Initialize Next.js Project [2 hours]
**Dependencies**: None
**Deliverable**: Next.js 14 project with TypeScript, Tailwind, shadcn/ui

**Steps**:
1. Run `npx create-next-app@latest emailbison-dashboard --typescript --tailwind --app`
2. Install dependencies: `@tremor/react`, `recharts`, `@tanstack/react-table`, `swr`, `zod`, `date-fns`
3. Configure tailwind.config.ts for Tremor integration
4. Set up project structure: `/app`, `/components`, `/lib/services`, `/lib/utils`
5. Initialize shadcn/ui: `npx shadcn-ui@latest init`

**Validation**:
- [ ] `npm run dev` starts successfully
- [ ] Tailwind styles apply correctly
- [ ] TypeScript compiles without errors
- [ ] All dependencies installed

---

### Task 2: Create EmailBison MCP Service [3 hours]
**Dependencies**: Task 1
**Deliverable**: `lib/services/bison.ts` with MCP integration

**Steps**:
1. Create `lib/services/bison.ts`
2. Import MCP client from `@modelcontextprotocol/sdk`
3. Implement `getWorkspaces()` function wrapping `mcp__bison_mcp__list_workspaces`
4. Implement `getCampaigns(workspaceId)` wrapping `mcp__bison_mcp__get_campaigns`
5. Implement `getLeads(campaignId)` wrapping `mcp__bison_mcp__get_leads`
6. Add error handling with retry logic (3 attempts, exponential backoff)
7. Add TypeScript types for Campaign and Lead models

**Validation**:
- [ ] MCP connection successful
- [ ] `getWorkspaces()` returns array of workspaces
- [ ] `getCampaigns(7)` returns Foundation workspace campaigns
- [ ] Error handling triggers on network failure
- [ ] Types match EmailBison API response

---

### Task 3: Build Calculation Engine [4 hours]
**Dependencies**: Task 2
**Deliverable**: `lib/services/calculations.ts` with all metric calculations

**Steps**:
1. Create `lib/services/calculations.ts`
2. Implement `calculateReplyRate(sent, delivered, replies)` → number
3. Implement `calculateBounceRate(sent, bounced)` → number
4. Implement `calculateInterestRate(replies, interested)` → number
5. Implement `calculateEngagedLeadRate(delivered, interested)` → number
6. Implement `calculateBookingRate(interested, booked)` → number
7. Implement `calculateShowRate(booked, showed)` → number
8. Add division-by-zero guards (return null if denominator === 0)
9. Write unit tests for all functions with known inputs/outputs

**Validation**:
- [ ] All unit tests passing (10+ test cases)
- [ ] Division by zero returns null
- [ ] Percentages calculated correctly (0-100 range)
- [ ] Test coverage >= 95%

---

### Task 4: Implement ESP Categorization [3 hours]
**Dependencies**: Task 2
**Deliverable**: `lib/services/esp-classifier.ts` with ESP detection logic

**Steps**:
1. Create `lib/services/esp-classifier.ts`
2. Define `ESPType` enum: `Google/Gmail`, `Custom Domain`, `Outlook/Microsoft`, `Unknown`
3. Implement `categorizeESP(workspaceName: string)` → ESPType
   - Detect "Google", "Gmail", "@gmail" → `Google/Gmail`
   - Detect "Outlook", "Microsoft", "@outlook", "@hotmail" → `Outlook/Microsoft`
   - Detect custom domains → `Custom Domain`
4. Implement `parseReceivingDomain(email: string)` → `Gmail` | `Outlook` | `Custom` | `Unknown`
   - Extract domain from email address
   - Categorize based on @gmail.com, @outlook.com, @hotmail.com, etc.
5. Write unit tests with sample workspace names and email addresses

**Validation**:
- [ ] Categorizes Google Workspace correctly
- [ ] Categorizes Outlook correctly
- [ ] Categorizes custom domains correctly
- [ ] Email parser handles edge cases (@domain.co.uk, subdomains)
- [ ] Test coverage >= 90%

---

### Task 5: Build ESP Performance Matrix Logic [4 hours]
**Dependencies**: Task 3, Task 4
**Deliverable**: `lib/services/esp-performance.ts` with matrix calculations

**Steps**:
1. Create `lib/services/esp-performance.ts`
2. Define `ESPPerformance` TypeScript interface
3. Implement `buildESPMatrix(campaigns, leads)`:
   - Group campaigns by sending ESP
   - For each campaign, get leads and categorize receiving domains
   - Aggregate: total_sent, total_delivered, total_replies, total_bounced per ESP-to-ESP pair
   - Calculate reply_rate and bounce_rate per pair
4. Implement `gradeESP(replyRate, bounceRate)` → Grade (A+ to F)
   - A+: >3% reply, <0.5% bounce
   - A: 2.5-3% reply, <0.5% bounce
   - B: 2-2.5% reply, 0.5-1% bounce
   - C: <2% reply, 1-2% bounce
   - F: >2% bounce
5. Write unit tests with mock campaign/lead data

**Validation**:
- [ ] Matrix aggregates correctly across all ESP pairs
- [ ] Grading matches constitutional thresholds
- [ ] Handles campaigns with no leads
- [ ] Test coverage >= 90%

---

### Task 6: Create API Route - List Clients [2 hours]
**Dependencies**: Task 2
**Deliverable**: `/app/api/clients/route.ts`

**Steps**:
1. Create `app/api/clients/route.ts`
2. Implement GET handler:
   - Call `BisonDataService.getWorkspaces()`
   - Transform to `{id, name}[]` format
   - Return JSON response
3. Add error handling (500 on MCP failure)
4. Add CORS headers if needed

**Validation**:
- [ ] `GET /api/clients` returns array of workspaces
- [ ] Response includes all active workspaces
- [ ] Error handling returns 500 with message on failure

---

### Task 7: Create API Route - ESP Performance [3 hours]
**Dependencies**: Task 5, Task 6
**Deliverable**: `/app/api/clients/[id]/esp/route.ts`

**Steps**:
1. Create `app/api/clients/[id]/esp/route.ts`
2. Implement GET handler:
   - Extract `id` from params
   - Call `BisonDataService.getCampaigns(id)`
   - For each campaign, fetch leads
   - Call `buildESPMatrix(campaigns, leads)`
   - Return ESP performance matrix with grades
3. Add timestamp: `last_updated: new Date().toISOString()`
4. Add validation for invalid workspace IDs (404)

**Validation**:
- [ ] `GET /api/clients/7/esp` returns ESP matrix for Foundation
- [ ] Grades calculated correctly
- [ ] Returns 404 for invalid workspace ID
- [ ] Timestamp included in response

---

### Task 8: Build Client Selector Component [2 hours]
**Dependencies**: Task 6
**Deliverable**: `components/client-selector.tsx`

**Steps**:
1. Create `components/client-selector.tsx`
2. Use shadcn/ui Select component
3. Fetch clients via SWR: `useSWR('/api/clients')`
4. Render dropdown with client names
5. Emit `onClientChange(clientId)` callback on selection
6. Add loading state while fetching clients

**Validation**:
- [ ] Dropdown displays all clients
- [ ] Selection triggers callback with correct clientId
- [ ] Loading state displays during fetch
- [ ] Error state displays if API fails

---

### Task 9: Build ESP Performance Table Component [4 hours]
**Dependencies**: Task 7
**Deliverable**: `components/esp-performance-table.tsx`

**Steps**:
1. Create `components/esp-performance-table.tsx`
2. Use `@tanstack/react-table` for sortable table
3. Define columns: Sending ESP, Receiving Domain, Volume, Reply Rate, Bounce Rate, Grade
4. Fetch data via SWR: `useSWR(\`/api/clients/\${clientId}/esp\`)`
5. Implement column sorting (all columns sortable)
6. Add color coding: Green (A/A+), Yellow (B/C), Red (F)
7. Add ranking indicators (#1, #2, #3) for top performers
8. Add refresh button with timestamp

**Validation**:
- [ ] Table displays ESP matrix correctly
- [ ] Sorting works on all columns (ascending/descending)
- [ ] Color coding applies based on grade
- [ ] Refresh button re-fetches data
- [ ] Timestamp displays "Last updated: X mins ago"

---

### Task 10: Build Dashboard Layout [3 hours]
**Dependencies**: Task 8, Task 9
**Deliverable**: `app/dashboard/page.tsx` with layout

**Steps**:
1. Create `app/dashboard/page.tsx`
2. Add ClientSelector at top
3. Store selected clientId in React state
4. Render ESPPerformanceTable when client selected
5. Add Tremor Card components for layout
6. Add loading skeleton while data fetches
7. Add empty state: "Select a client to view dashboard"

**Validation**:
- [ ] Client selection updates dashboard
- [ ] ESP table displays when client selected
- [ ] Loading states display correctly
- [ ] Empty state shows when no client selected

---

## Phase 2: Conversion Funnel & Firmographics (Week 2)

### Task 11: Implement Firmographic Classifier [4 hours]
**Dependencies**: Task 2
**Deliverable**: `lib/services/firmographics.ts`

**Steps**:
1. Create `lib/services/firmographics.ts`
2. Define `FirmographicData` TypeScript interface
3. Implement `classifySeniority(title: string)`:
   - C-Level: regex match `/(CEO|CTO|CFO|CMO|COO|CPO|CISO|Chief)/i`
   - VP: regex match `/(VP|Vice President|SVP)/i`
   - Director: regex match `/(Director|Head of)/i`
   - Manager: regex match `/(Manager|Lead)/i`
   - IC: fallback if none match
4. Implement `classifyCompanySize(companyData)`:
   - Extract from lead data or default to "Unknown"
   - Categories: SMB, Mid-market, Enterprise, Unknown
5. Implement `extractIndustry(company, title)`:
   - Use keyword matching or manual tagging
   - Common industries: SaaS, Infrastructure, Education, etc.
6. Write unit tests with sample titles ("VP of Engineering", "Software Engineer", etc.)

**Validation**:
- [ ] Seniority classifier handles title variations
- [ ] Company size classifier works (or returns Unknown)
- [ ] Industry extraction functional
- [ ] Test coverage >= 85%

---

### Task 12: Build Segment Analytics Logic [4 hours]
**Dependencies**: Task 11, Task 3
**Deliverable**: `lib/services/segments.ts`

**Steps**:
1. Create `lib/services/segments.ts`
2. Define `Segment` TypeScript interface
3. Implement `analyzeBySegment(campaigns, leads, segmentType)`:
   - Group leads by segment_value (industry, company_size, or seniority)
   - For each segment:
     - Count total_sent, total_replies, total_interested
     - Calculate reply_rate, interest_rate
   - Return array of Segment objects
4. Implement filtering: `filterBySegment(segments, segmentValue)`
5. Write unit tests with mock data

**Validation**:
- [ ] Segments calculated correctly per type
- [ ] Metrics sum to overall totals
- [ ] Unknown segments reported separately
- [ ] Test coverage >= 90%

---

### Task 13: Build Conversion Funnel Calculator [3 hours]
**Dependencies**: Task 3
**Deliverable**: `lib/services/funnel.ts`

**Steps**:
1. Create `lib/services/funnel.ts`
2. Define `ConversionFunnel` interface with all stages
3. Implement `calculateFunnel(campaign, calComData?)`:
   - Stage 1: emails_sent
   - Stage 2: delivered (sent - bounced)
   - Stage 3: unique_replies
   - Stage 4: interested
   - Stage 5: booked (from Cal.com, optional)
   - Stage 6: showed (from Cal.com, optional)
   - Calculate conversion rates between each stage
4. Handle null Cal.com data gracefully
5. Write unit tests

**Validation**:
- [ ] Funnel stages calculated correctly
- [ ] Conversion rates accurate (stage N / stage N-1)
- [ ] Handles missing Cal.com data
- [ ] Test coverage >= 90%

---

### Task 14: Create API Route - Conversion Funnel [2 hours]
**Dependencies**: Task 13
**Deliverable**: `/app/api/clients/[id]/funnel/route.ts`

**Steps**:
1. Create `app/api/clients/[id]/funnel/route.ts`
2. Implement GET handler:
   - Fetch campaigns for workspace
   - Calculate funnel for each campaign
   - Optionally fetch Cal.com data
   - Return array of campaign funnels
3. Add timestamp and error handling

**Validation**:
- [ ] `GET /api/clients/7/funnel` returns funnel data
- [ ] All campaigns included
- [ ] Cal.com data included if available

---

### Task 15: Create API Route - Segment Analytics [2 hours]
**Dependencies**: Task 12
**Deliverable**: `/app/api/clients/[id]/segments/route.ts`

**Steps**:
1. Create `app/api/clients/[id]/segments/route.ts`
2. Implement GET handler with query param `?type=industry|company_size|seniority`
3. Fetch campaigns and leads
4. Call `analyzeBySegment(campaigns, leads, type)`
5. Return segment performance data

**Validation**:
- [ ] `GET /api/clients/7/segments?type=industry` returns industry breakdown
- [ ] All segment types work (industry, company_size, seniority)
- [ ] Metrics accurate

---

### Task 16: Build Conversion Funnel Component [4 hours]
**Dependencies**: Task 14
**Deliverable**: `components/conversion-funnel.tsx`

**Steps**:
1. Create `components/conversion-funnel.tsx`
2. Use Recharts Funnel Chart or custom SVG funnel
3. Fetch data: `useSWR(\`/api/clients/\${clientId}/funnel\`)`
4. Display stages: Sends → Delivered → Replies → Interested → Booked → Showed
5. Show conversion rate between each stage
6. Highlight "interest rate" (interested/replies) prominently
7. Add tooltips with exact numbers

**Validation**:
- [ ] Funnel visualizes all stages correctly
- [ ] Conversion rates displayed
- [ ] Interest rate highlighted
- [ ] Tooltips show exact numbers

---

### Task 17: Build Segment Analysis Table [4 hours]
**Dependencies**: Task 15
**Deliverable**: `components/segment-analysis-table.tsx`

**Steps**:
1. Create `components/segment-analysis-table.tsx`
2. Add segment type selector: Industry | Company Size | Seniority
3. Fetch data based on selected type: `useSWR(\`/api/clients/\${clientId}/segments?type=\${type}\`)`
4. Use @tanstack/react-table for sortable table
5. Columns: Segment, Volume, Reply Rate, Interest Rate, Booking Rate
6. Add color coding for performance tiers
7. Add comparison view (side-by-side segment comparison)

**Validation**:
- [ ] Segment type selector works
- [ ] Table displays correct data per type
- [ ] Sorting works on all metrics
- [ ] Color coding applies

---

### Task 18: Build KPI Cards Component [3 hours]
**Dependencies**: Task 14
**Deliverable**: `components/kpi-cards.tsx`

**Steps**:
1. Create `components/kpi-cards.tsx`
2. Use Tremor Card and Metric components
3. Display key metrics:
   - Overall Reply Rate
   - Overall Interest Rate
   - Engaged Lead Rate (sends per engaged lead)
   - Total Campaigns
   - Total Sends
4. Add trend indicators (up/down arrows) if historical data available
5. Fetch data from funnel API

**Validation**:
- [ ] KPI cards display correct metrics
- [ ] Styling consistent with Tremor design
- [ ] Updates when client changes

---

### Task 19: Add Funnel & Segments to Dashboard [2 hours]
**Dependencies**: Task 16, Task 17, Task 18
**Deliverable**: Updated `app/dashboard/page.tsx`

**Steps**:
1. Update `app/dashboard/page.tsx`
2. Add KPICards component at top
3. Add ConversionFunnel component in middle section
4. Add SegmentAnalysisTable below funnel
5. Arrange in responsive grid layout

**Validation**:
- [ ] All components render on dashboard
- [ ] Layout responsive on mobile/tablet/desktop
- [ ] All components use same clientId from selector

---

### Task 20: Write Tests for Phase 2 Components [3 hours]
**Dependencies**: Task 16, Task 17, Task 18
**Deliverable**: Unit tests for all Phase 2 components

**Steps**:
1. Write tests for `conversion-funnel.tsx`
2. Write tests for `segment-analysis-table.tsx`
3. Write tests for `kpi-cards.tsx`
4. Mock SWR responses with test data
5. Test user interactions (segment type selector, sorting)

**Validation**:
- [ ] All component tests passing
- [ ] Coverage >= 85%
- [ ] User interactions tested

---

## Phase 3: Bounce Monitoring & Cal.com Integration (Week 3)

### Task 21: Build Bounce Rate Calculator [3 hours]
**Dependencies**: Task 3
**Deliverable**: `lib/services/bounces.ts`

**Steps**:
1. Create `lib/services/bounces.ts`
2. Define `DomainBounceData` interface
3. Implement `calculateBouncesByDomain(campaigns, leads)`:
   - Extract domains from bounced lead emails
   - Group by domain (e.g., acme.com)
   - Calculate: (bounced at domain / sent to domain) * 100
4. Implement `calculateESPBounceRate(campaigns, espType)`:
   - Filter campaigns by ESP type
   - Calculate overall bounce rate for ESP
5. Implement `getAlertLevel(bounceRate)`:
   - Green: <0.5%
   - Yellow: 0.5-2%
   - Red: >2%
6. Write unit tests

**Validation**:
- [ ] Domain-level bounce rates calculated correctly
- [ ] ESP-level bounce rates accurate
- [ ] Alert levels match thresholds
- [ ] Test coverage >= 90%

---

### Task 22: Implement Cal.com API Client [4 hours]
**Dependencies**: Task 2
**Deliverable**: `lib/services/calcom.ts`

**Steps**:
1. Create `lib/services/calcom.ts`
2. Research Cal.com API documentation (bookings endpoint)
3. Implement `getBookings(dateRange)`:
   - Make authenticated request to Cal.com API
   - Parse response to extract bookings with attendee emails
   - Return array of CalComBooking objects
4. Implement email matching: `matchBookingToLead(booking, leads)`:
   - Match booking.attendees[].email to lead.email (case-insensitive)
   - Return linked booking with lead_id
5. Add error handling (API down, rate limits)
6. Write integration tests (mock Cal.com API)

**Validation**:
- [ ] Cal.com API connection successful
- [ ] Bookings fetched correctly
- [ ] Email matching works (handles case variations)
- [ ] Error handling triggers on API failure

---

### Task 23: Implement Cal.com Webhook Handler [3 hours]
**Dependencies**: Task 22
**Deliverable**: `/app/api/webhooks/calcom/route.ts`

**Steps**:
1. Create `app/api/webhooks/calcom/route.ts`
2. Implement POST handler:
   - Validate webhook signature (CALCOM_WEBHOOK_SECRET)
   - Parse event payload (booking_id, attendee_email, attended: boolean)
   - Match attendee_email to EmailBison lead
   - Store attendance data (in-memory for v1, DB in v2)
3. Return 200 OK on success, 401 on invalid signature
4. Add logging for debugging

**Validation**:
- [ ] Webhook accepts valid signed requests
- [ ] Rejects requests with invalid signatures (401)
- [ ] Attendance data stored correctly
- [ ] Logging captures all events

---

### Task 24: Create API Route - Bounce Analytics [2 hours]
**Dependencies**: Task 21
**Deliverable**: `/app/api/clients/[id]/bounces/route.ts`

**Steps**:
1. Create `app/api/clients/[id]/bounces/route.ts`
2. Implement GET handler:
   - Fetch campaigns and leads for workspace
   - Call `calculateBouncesByDomain(campaigns, leads)`
   - Call `calculateESPBounceRate(campaigns, espType)` for each ESP
   - Return domain bounce data and ESP bounce data with alert levels
3. Add timestamp

**Validation**:
- [ ] `GET /api/clients/7/bounces` returns bounce analytics
- [ ] Domain-level and ESP-level data included
- [ ] Alert levels correct

---

### Task 25: Build Bounce Rate Monitoring Component [4 hours]
**Dependencies**: Task 24
**Deliverable**: `components/bounce-monitoring.tsx`

**Steps**:
1. Create `components/bounce-monitoring.tsx`
2. Fetch data: `useSWR(\`/api/clients/\${clientId}/bounces\`)`
3. Build two sections:
   - **ESP Bounce Rates**: Table with ESP name, bounce rate, alert level
   - **Domain Bounce Rates**: Sortable table with domain, volume, bounce rate
4. Add visual alerts (colored badges/icons) for yellow/red thresholds
5. Add tooltip explanations ("Green: <0.5% - Excellent deliverability")
6. Highlight domains/ESPs exceeding thresholds

**Validation**:
- [ ] Both tables display correctly
- [ ] Alert colors apply (green/yellow/red)
- [ ] Sorting works on domain table
- [ ] Tooltips explain thresholds

---

### Task 26: Update Funnel with Cal.com Data [3 hours]
**Dependencies**: Task 22, Task 23, Task 16
**Deliverable**: Updated funnel component with booking/show data

**Steps**:
1. Update `lib/services/funnel.ts` to integrate Cal.com data
2. Update `/app/api/clients/[id]/funnel/route.ts`:
   - Fetch Cal.com bookings
   - Match bookings to campaign leads
   - Add booking and show counts to funnel
3. Update `components/conversion-funnel.tsx`:
   - Add "Booked" and "Showed" stages to visualization
   - Display booking rate and show rate
4. Handle gracefully if Cal.com data unavailable (show "N/A")

**Validation**:
- [ ] Funnel includes booking and show stages
- [ ] Booking/show rates calculated correctly
- [ ] Graceful degradation if Cal.com unavailable

---

### Task 27: Add Bounce Monitoring to Dashboard [2 hours]
**Dependencies**: Task 25
**Deliverable**: Updated dashboard with bounce monitoring

**Steps**:
1. Update `app/dashboard/page.tsx`
2. Add BounceMonitoring component in dedicated section
3. Add alert summary at top: "⚠️ 2 ESPs exceeding bounce threshold"
4. Arrange in responsive layout

**Validation**:
- [ ] Bounce monitoring displays on dashboard
- [ ] Alert summary shows when thresholds exceeded
- [ ] Layout responsive

---

### Task 28: Write Tests for Phase 3 [3 hours]
**Dependencies**: Task 25, Task 26
**Deliverable**: Unit/integration tests

**Steps**:
1. Write tests for bounce calculations
2. Write tests for Cal.com integration
3. Write tests for webhook handler (valid/invalid signatures)
4. Write component tests for bounce monitoring

**Validation**:
- [ ] All tests passing
- [ ] Coverage >= 85%
- [ ] Webhook security validated

---

## Phase 4: Cross-Client Analytics & Polish (Week 4)

### Task 31: Implement Client Anonymization [2 hours]
**Dependencies**: Task 2
**Deliverable**: `lib/services/anonymize.ts`

**Steps**:
1. Create `lib/services/anonymize.ts`
2. Implement `anonymizeClientId(workspaceId, allWorkspaceIds)`:
   - Sort workspace IDs for consistency
   - Map to "Client A", "Client B", "Client C" based on sort order
3. Implement `sanitizePII(data)`:
   - Remove client names, email addresses from objects
   - Replace with IDs or anonymized labels
4. Write unit tests

**Validation**:
- [ ] Anonymization consistent across calls
- [ ] No PII in anonymized output
- [ ] Test coverage >= 90%

---

### Task 32: Build Cross-Client Aggregation [4 hours]
**Dependencies**: Task 31, Task 5
**Deliverable**: `lib/services/cross-client.ts`

**Steps**:
1. Create `lib/services/cross-client.ts`
2. Implement `aggregateCrossClient(allWorkspaces)`:
   - Fetch campaigns for all workspaces (parallel requests)
   - For each workspace:
     - Calculate overall reply rate, interest rate, engaged lead rate
     - Identify top-performing ESP
   - Anonymize client identifiers
   - Return array of CrossClientMetrics
3. Implement sorting: `sortByMetric(metrics, metricName)`
4. Write unit tests

**Validation**:
- [ ] Aggregation includes all workspaces
- [ ] Client IDs anonymized
- [ ] Sorting works correctly
- [ ] Test coverage >= 85%

---

### Task 33: Create API Route - Cross-Client [3 hours]
**Dependencies**: Task 32
**Deliverable**: `/app/api/cross-client/route.ts`

**Steps**:
1. Create `app/api/cross-client/route.ts`
2. Implement GET handler:
   - Fetch all workspaces
   - Call `aggregateCrossClient(allWorkspaces)`
   - Add optional query param `?sortBy=engaged_lead_rate`
   - Return anonymized aggregate data
3. Add authentication check (future: restrict to admin users)
4. Add timestamp

**Validation**:
- [ ] `GET /api/cross-client` returns anonymized data
- [ ] Sorting query param works
- [ ] No client names exposed

---

### Task 34: Build Cross-Client View Component [4 hours]
**Dependencies**: Task 33
**Deliverable**: `components/cross-client-view.tsx`

**Steps**:
1. Create `components/cross-client-view.tsx`
2. Fetch data: `useSWR('/api/cross-client?sortBy=engaged_lead_rate')`
3. Build sortable table with columns:
   - Client ID (anonymized)
   - Total Campaigns
   - Total Sends
   - Reply Rate
   - Interest Rate
   - Engaged Lead Rate
   - Top ESP
4. Default sort: Engaged Lead Rate (best to worst)
5. Add ranking indicators (#1, #2, #3)
6. Add color coding (green/yellow/red performance tiers)

**Validation**:
- [ ] Table displays all clients anonymized
- [ ] Sorting works on all metrics
- [ ] Rankings correct
- [ ] Color coding applies

---

### Task 35: Add Cross-Client Page [2 hours]
**Dependencies**: Task 34
**Deliverable**: `app/cross-client/page.tsx`

**Steps**:
1. Create `app/cross-client/page.tsx`
2. Add CrossClientView component
3. Add page title: "Cross-Client Performance Overview"
4. Add disclaimer: "Client identities anonymized for privacy"
5. Add link in navigation to cross-client page

**Validation**:
- [ ] Page renders correctly
- [ ] Navigation link works
- [ ] Disclaimer visible

---

### Task 36: Implement Data Refresh UI [3 hours]
**Dependencies**: Task 10
**Deliverable**: Refresh functionality across all views

**Steps**:
1. Update all components to display "Last updated: X mins ago" timestamp
2. Add manual refresh button using SWR's `mutate()` function
3. Add auto-refresh option (every 15 minutes)
4. Display loading spinner during refresh
5. Show stale data warning if > 30 minutes old

**Validation**:
- [ ] Timestamps display correctly across all views
- [ ] Refresh button re-fetches data
- [ ] Auto-refresh works (if enabled)
- [ ] Stale warning appears when old data

---

### Task 37: Implement Performance Ranking System [2 hours]
**Dependencies**: Task 9, Task 17, Task 34
**Deliverable**: Ranking logic across all tables

**Steps**:
1. Create `lib/utils/ranking.ts`
2. Implement `addRankings(items, metricKey)`:
   - Sort items by metric (descending)
   - Add `rank` field (1, 2, 3, ...)
3. Update all table components to display rank
4. Add visual indicators (#1 🥇, #2 🥈, #3 🥉) or numbers

**Validation**:
- [ ] Rankings display in ESP table
- [ ] Rankings display in segment table
- [ ] Rankings display in cross-client table
- [ ] Correct ranking after sorting

---

### Task 38: Add Color-Coded Performance Tiers [2 hours]
**Dependencies**: Task 37
**Deliverable**: Color coding across all tables

**Steps**:
1. Create `lib/utils/performance-tiers.ts`
2. Define tier logic:
   - Green: Top 33% performers
   - Yellow: Middle 33%
   - Red: Bottom 33%
3. Implement `getPerformanceTier(value, allValues)` → color
4. Update all table components to apply background/border colors
5. Use Tailwind classes: `bg-green-100`, `bg-yellow-100`, `bg-red-100`

**Validation**:
- [ ] Color coding applies correctly
- [ ] Tiers calculated accurately (33/33/33 split)
- [ ] Accessible colors (WCAG compliant)

---

### Task 39: Add PII Scrubbing and Security Audit [3 hours]
**Dependencies**: Task 31
**Deliverable**: PII sanitization across codebase

**Steps**:
1. Create `lib/utils/security.ts`
2. Implement `scubPII(logMessage)`:
   - Remove email addresses (regex)
   - Remove client names (replace with IDs)
   - Remove phone numbers, addresses
3. Update all logging statements to use `scubPII()`
4. Audit all API routes for client isolation (verify workspace_id filters)
5. Test: Attempt to fetch Client A data while selecting Client B (should fail)
6. Review error messages for PII leaks

**Validation**:
- [ ] No emails in console logs
- [ ] No client names in error messages
- [ ] Client isolation verified (A cannot see B's data)
- [ ] Security checklist passed

---

### Task 40: Performance Optimization [4 hours]
**Dependencies**: All prior tasks
**Deliverable**: Optimized dashboard performance

**Steps**:
1. Implement SWR caching with 15-minute TTL:
   ```ts
   useSWR('/api/...', fetcher, { refreshInterval: 900000 })
   ```
2. Add lazy loading for heavy components (Code splitting)
3. Optimize ESP matrix calculation (memoization)
4. Add loading skeletons for better perceived performance
5. Run Lighthouse audit, target score >= 90
6. Optimize bundle size (tree shaking, dynamic imports)

**Validation**:
- [ ] Dashboard loads in <3 seconds
- [ ] API routes respond in <2 seconds
- [ ] Lighthouse performance score >= 90
- [ ] Bundle size optimized (<500KB)

---

### Task 41: Write User Documentation [3 hours]
**Dependencies**: All prior tasks
**Deliverable**: `docs/USER_GUIDE.md`

**Steps**:
1. Create `docs/USER_GUIDE.md`
2. Document:
   - How to select a client
   - How to interpret ESP performance matrix
   - How to use conversion funnel
   - How to analyze segments
   - How to interpret bounce alerts
   - How to refresh data
   - How to access cross-client view
3. Add screenshots (optional for v1)
4. Add FAQ section

**Validation**:
- [ ] Documentation covers all features
- [ ] Clear, concise explanations
- [ ] Markdown formatted correctly

---

### Task 42: Write Developer Documentation [2 hours]
**Dependencies**: All prior tasks
**Deliverable**: `docs/DEVELOPER_GUIDE.md`

**Steps**:
1. Create `docs/DEVELOPER_GUIDE.md`
2. Document:
   - Project structure
   - How to run locally
   - How to add new metrics
   - How to extend firmographic classifier
   - API route patterns
   - Testing approach
3. Add architecture diagram (reference plan.md)

**Validation**:
- [ ] Documentation complete
- [ ] Onboarding guide clear
- [ ] Examples provided

---

### Task 43: End-to-End Testing [4 hours]
**Dependencies**: All prior tasks
**Deliverable**: E2E test suite

**Steps**:
1. Set up Playwright or Cypress
2. Write E2E tests:
   - Select client → dashboard loads → metrics display
   - Sort ESP table → order changes
   - Change segment type → table updates
   - Click refresh → data re-fetches
   - Navigate to cross-client view → anonymized data displays
3. Run tests in CI pipeline

**Validation**:
- [ ] All critical flows tested
- [ ] Tests passing
- [ ] CI integration working

---

### Task 44: Deployment Setup [3 hours]
**Dependencies**: Task 43
**Deliverable**: Deployed dashboard on Vercel

**Steps**:
1. Create Vercel account (or use existing)
2. Connect GitHub repository
3. Configure environment variables in Vercel:
   - BISON_MCP_URL
   - CALCOM_API_KEY
   - CALCOM_WEBHOOK_SECRET
   - NODE_ENV=production
4. Deploy to production
5. Configure custom domain (optional)
6. Set up Vercel Analytics
7. Test production deployment

**Validation**:
- [ ] Dashboard accessible at production URL
- [ ] MCP integration works in production
- [ ] No environment variable errors
- [ ] Analytics tracking

---

### Task 45: Final QA and Launch [2 hours]
**Dependencies**: Task 44
**Deliverable**: Production-ready dashboard

**Steps**:
1. Run full QA checklist (constitutional compliance)
2. Test with real EmailBison data across multiple clients
3. Verify calculations match source data
4. Test Cal.com integration end-to-end
5. Load test with large datasets (1000+ campaigns)
6. Fix any discovered bugs
7. Announce launch to team

**Validation**:
- [ ] All constitutional articles validated (see checklist in constitution.md)
- [ ] Calculations 100% accurate
- [ ] Performance meets targets
- [ ] Team trained on usage

---

## Task Summary by Phase

| Phase | Tasks | Est. Time | Can Parallelize |
|-------|-------|-----------|-----------------|
| 1: Infrastructure & ESP | 1-10 | 30 hours | Tasks 2-5 (calculations), 8-9 (components) |
| 2: Funnel & Firmographics | 11-20 | 32 hours | Tasks 11-15 (services/APIs), 16-18 (components) |
| 3: Bounce & Cal.com | 21-28 | 27 hours | Tasks 21-24 (services/APIs), 25-26 (components) |
| 4: Cross-Client & Polish | 31-45 | 43 hours | Tasks 31-35 (cross-client), 36-39 (polish) |

**Total**: 132 hours (~ 4 weeks for 1 developer, ~2 weeks with parallel agents)

---

## Parallelization Strategy for Agent Deployment

### Agent Group 1: Backend Services (Tasks 2-5, 11-13, 21-22)
**Focus**: Data services, calculations, classifiers
**Deliverable**: Complete backend logic layer
**Estimated Time**: 25 hours → 8 hours with 3 agents in parallel

### Agent Group 2: API Routes (Tasks 6-7, 14-15, 24, 33)
**Focus**: Next.js API endpoints
**Deliverable**: All API routes functional
**Estimated Time**: 15 hours → 5 hours with 3 agents in parallel

### Agent Group 3: React Components (Tasks 8-9, 16-18, 25, 34)
**Focus**: UI components
**Deliverable**: All dashboard components built
**Estimated Time**: 21 hours → 7 hours with 3 agents in parallel

### Agent Group 4: Integration & Features (Tasks 23, 26, 27, 31-32)
**Focus**: Cal.com integration, anonymization, cross-client
**Deliverable**: Advanced features complete
**Estimated Time**: 17 hours → 6 hours with 3 agents in parallel

### Agent Group 5: Testing & Polish (Tasks 20, 28, 36-39, 43)
**Focus**: Tests, performance, security
**Deliverable**: Production-ready quality
**Estimated Time**: 21 hours → 7 hours with 3 agents in parallel

### Agent Group 6: Documentation & Deployment (Tasks 41-42, 44-45)
**Focus**: Docs and deployment
**Deliverable**: Launched product
**Estimated Time**: 14 hours → 5 hours with 3 agents in parallel

**With 10-15 agents deployed in parallel**: Wall-clock time reduces from 4 weeks to approximately **1-2 weeks**.

---

## Critical Path

**Sequential Dependencies** (cannot parallelize):
1. Task 1: Initialize project (prerequisite for all)
2. Task 2: MCP service (prerequisite for all data tasks)
3. Task 10: Dashboard layout (integrates Phase 1 components)
4. Task 19: Add funnel to dashboard (integrates Phase 2)
5. Task 27: Add bounce monitoring (integrates Phase 3)
6. Task 35: Cross-client page (integrates Phase 4)
7. Task 40: Performance optimization (requires complete app)
8. Task 44: Deployment (final step)
9. Task 45: QA and launch

**Minimum Timeline** (critical path): ~1.5 weeks with perfect execution

---

## Next Steps

1. **Deploy agents** to work on parallelizable task groups
2. **Monitor progress** using todo tracking
3. **Integrate components** as agents complete tasks
4. **Run continuous testing** as features are built
5. **Launch** when all constitutional compliance validated

---

**Tasks Version**: 1.0
**Ready for**: Agent deployment and parallel execution
