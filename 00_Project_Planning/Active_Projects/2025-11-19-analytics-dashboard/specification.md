# Feature Specification: EmailBison Analytics Dashboard

**Created**: 2025-11-19 | **Status**: Active | **Owner**: Mitchell Keller

## Overview

A comprehensive, real-time analytics dashboard for EmailBison campaign performance that provides ESP deliverability metrics, conversion funnel analytics, and lead engagement insights across all clients. The dashboard enables data-driven ESP selection, campaign optimization, and client performance tracking with drill-down capabilities by firmographics (industry, company size, role/seniority).

## User Stories

### Story 1: ESP Performance Analysis
**As a** campaign manager **I want** to see ESP-to-ESP reply rates and bounce rates **So that** I can select the optimal sending ESP for different receiving domains and protect ESP reputation

**Acceptance Criteria**:
- [ ] View reply rates broken down by sending ESP (Google, Outlook, Custom Domain)
- [ ] View reply rates by receiving domain type (Gmail, Outlook, corporate)
- [ ] See ESP-to-ESP performance matrix (e.g., "Google → Gmail: 3.2% reply")
- [ ] View bounce rates per ESP with threshold alerts (<0.5% good, 0.5-2% warning, >2% critical)
- [ ] ESP performance grading (A+ to F) based on deliverability thresholds

### Story 2: Full Conversion Funnel Tracking
**As a** team lead **I want** to track the complete lead funnel from sends to show-ups **So that** I can identify drop-off points and optimize conversion rates

**Acceptance Criteria**:
- [ ] See complete funnel: sends → delivered → replies → interested → booked → showed
- [ ] Calculate and display "interest rate per reply" (interested/replies)
- [ ] Calculate and display "engaged lead rate" (sends per engaged lead)
- [ ] Calculate booking rate (bookings/interested)
- [ ] Calculate show-up rate (attended/booked)
- [ ] Compare funnel metrics across campaigns

### Story 3: Firmographic Segmentation
**As a** strategist **I want** to filter all metrics by industry, company size, and role/seniority **So that** I can understand which segments respond best and optimize targeting

**Acceptance Criteria**:
- [ ] Filter reply rates by industry (SaaS, Infrastructure, Education, etc.)
- [ ] Filter reply rates by company size (SMB, Mid-market, Enterprise)
- [ ] Filter reply rates by role/seniority (IC, Manager, Director, VP, C-Level)
- [ ] Compare segment performance side-by-side
- [ ] See booking rates and engaged lead rates per segment

### Story 4: Client-Specific Dashboards
**As a** client success manager **I want** to view analytics for a specific client in isolation **So that** I can report on their campaign performance without exposing other clients' data

**Acceptance Criteria**:
- [ ] Select client from dropdown/filter to view their isolated dashboard
- [ ] See all metrics scoped to selected client only
- [ ] Client names/identifiers never exposed in logs or cross-client views
- [ ] Option to compare client performance against anonymized benchmarks

### Story 5: Cross-Client Performance Insights
**As a** team lead **I want** to see aggregated analytics across all clients **So that** I can identify patterns, top-performing strategies, and underperforming areas

**Acceptance Criteria**:
- [ ] View anonymized cross-client aggregate metrics
- [ ] Sort clients by engaged lead rate (best to worst)
- [ ] Identify top-performing ESPs across all clients
- [ ] See overall bounce rates and domain-level issues
- [ ] All client identifiers anonymized ("Client A", "Client B")

### Story 6: Bounce Rate Monitoring
**As a** deliverability manager **I want** to track bounce rates per domain and per ESP **So that** I can prevent ESP reputation damage and identify bad lead sources

**Acceptance Criteria**:
- [ ] View bounce rate per domain (e.g., acme.com: 5%)
- [ ] View bounce rate per ESP with alerts when thresholds exceeded
- [ ] See overall bounce rate across all campaigns
- [ ] Historical bounce trends to detect patterns
- [ ] Visual warnings when bounce rates enter danger zones

### Story 7: Sortable Performance Tables
**As a** campaign manager **I want** to sort campaigns, ESPs, and segments by key metrics **So that** I can quickly identify top and bottom performers

**Acceptance Criteria**:
- [ ] Sort campaigns by reply rate, booking rate, engaged lead rate
- [ ] Sort ESPs by reply rate, bounce rate, volume
- [ ] Sort segments by interest rate, show-up rate
- [ ] Visual ranking indicators (#1, #2, #3)
- [ ] Color coding for performance tiers (green/yellow/red)

### Story 8: Cal.com Meeting Integration
**As a** ROI analyst **I want** to see booking and show-up data from Cal.com **So that** I can calculate true campaign ROI beyond just interested leads

**Acceptance Criteria**:
- [ ] Pull booking data from Cal.com API
- [ ] Pull attendance data from Cal.com webhook
- [ ] Display bookings per campaign
- [ ] Display show-up rate per campaign
- [ ] Calculate ROI: (showed up meetings / total sends) × 100

---

## Success Criteria

**Performance**:
- Dashboard loads initial view in < 3 seconds
- ESP performance queries return in < 2 seconds
- Full campaign funnel calculations in < 5 seconds

**Accuracy**:
- All metrics match EmailBison MCP API data exactly (zero discrepancy)
- Calculations auditable and verifiable against source data
- Timestamp accuracy within 1 minute of actual refresh time

**Usability**:
- Client selection/filtering completes in < 1 second
- All tables sortable with instant response
- No more than 2 clicks to reach any metric

**Reliability**:
- EmailBison MCP API connection maintained with retry logic
- Graceful degradation if Cal.com integration unavailable
- Error messages clear and actionable

---

## Functional Requirements

### 1. ESP Performance Analytics

**Input**: Campaign data from EmailBison MCP API (emails_sent, unique_replies, bounced, lead email domains)
**Output**: ESP-to-ESP performance matrix with reply rates, bounce rates, volume distribution

**Calculations**:
- Sending ESP detection: Categorize workspaces as Google/Gmail, Custom Domain, Outlook/Microsoft
- Receiving domain detection: Parse lead email addresses for @gmail, @outlook, custom domains
- Reply rate: (unique_replies / emails_delivered) × 100
- Bounce rate: (bounced / emails_sent) × 100
- ESP grading: A+ (>3% reply, <0.5% bounce), A (2.5-3%, <0.5%), B (2-2.5%, 0.5-1%), C (<2%, 1-2%), F (>2% bounce)

**Validation**:
- Email domains must parse correctly (handle subdomains, country codes)
- Reply/bounce calculations must sum correctly across ESPs
- No data loss when categorizing ESPs

### 2. Conversion Funnel Tracking

**Input**: Campaign data (emails_sent, bounced, unique_replies, interested) + Cal.com data (bookings, attendance)
**Output**: Full funnel metrics with stage-by-stage conversion rates

**Calculations**:
- Delivered = emails_sent - bounced
- Reply rate = (unique_replies / delivered) × 100
- Interest rate = (interested / unique_replies) × 100 [CRITICAL METRIC]
- Engaged lead rate = delivered / interested [sends per engaged lead]
- Booking rate = (booked / interested) × 100
- Show-up rate = (showed / booked) × 100

**Validation**:
- Funnel must be monotonically decreasing (no stage can exceed previous stage)
- Division by zero handling for campaigns with no replies/bookings
- Null handling for Cal.com data if integration not yet available

### 3. Firmographic Segmentation

**Input**: Lead data from EmailBison MCP (title, company, industry fields if available)
**Output**: Performance metrics grouped by industry, company size, seniority

**Classification Logic**:

**Industry Detection**:
- Extract from company field or manual tagging
- Common categories: SaaS, Infrastructure, Education, Gaming, Healthcare, Finance
- Unclassified category for unknowns

**Company Size Detection**:
- Use lead data or external enrichment (if available)
- Categories: SMB (<50 employees), Mid-market (50-500), Enterprise (500+), Unknown
- Fallback: Manual classification per client

**Seniority Detection** (from title field):
- C-Level: CEO, CTO, CFO, CMO, COO, CPO, CISO, etc.
- VP: VP, Vice President, SVP
- Director: Director, Head of
- Manager: Manager, Lead
- IC (Individual Contributor): Engineer, Developer, Designer, Analyst, Specialist

**Validation**:
- Title parsing must handle variations ("VP of Engineering", "Engineering VP")
- Unknown/unclassified segments must be reported separately
- Segment totals must sum to overall totals

### 4. Client Data Isolation

**Input**: Client ID (workspace ID from EmailBison)
**Output**: Client-specific dashboard with no data leakage

**Implementation**:
- All queries must include `workspace_id` filter
- Cross-client views must anonymize identifiers
- No client names in logs, only IDs
- PII scrubbing in error messages

**Validation**:
- Test that selecting Client A never shows Client B data
- Verify logs contain no client names/email addresses
- Confirm cross-client aggregations use anonymized labels

### 5. Real-Time Data Refresh

**Input**: User-triggered refresh or auto-refresh timer
**Output**: Updated metrics with current timestamp

**Implementation**:
- Pull data from EmailBison MCP API on demand (not local database initially)
- Display "Last updated: X minutes ago" on all metrics
- Manual refresh button on all dashboard views
- Optional: Cache with 15-minute TTL for performance

**Validation**:
- Verify timestamp accuracy
- Confirm refresh button triggers new API calls
- Test that cache invalidates correctly

### 6. Bounce Rate Monitoring

**Input**: Campaign bounce data per domain
**Output**: Bounce rates with threshold-based alerts

**Implementation**:
- Parse bounced leads to extract domains
- Calculate bounce rate per domain: (bounced at domain / sent to domain) × 100
- ESP-level bounce rate: (total bounced / total sent) × 100
- Alert thresholds: Green (<0.5%), Yellow (0.5-2%), Red (>2%)

**Validation**:
- Domain parsing must handle edge cases (invalid domains, missing TLDs)
- Alerts trigger at correct thresholds
- Historical bounce trends stored for pattern analysis

### 7. Sortable Tables

**Input**: User click on column header
**Output**: Re-sorted table by selected metric

**Implementation**:
- All metric columns have sort indicators (▲▼)
- Default sort: Most actionable metric (e.g., engaged lead rate)
- Ascending/descending toggle on click
- Visual ranking (#1, #2, #3) for top 3 performers

**Validation**:
- Sort accuracy for numeric and string values
- Tie-breaking logic for equal values
- Performance: Sort must complete in <500ms for 1000 rows

### 8. Cal.com Integration

**Input**: Cal.com API credentials, EmailBison lead data
**Output**: Booking and attendance data linked to campaigns

**Implementation**:
- Cal.com API: Fetch bookings by event type, date range
- Cal.com Webhook: Receive attendance events in real-time
- Link bookings to EmailBison leads by email address
- Track booking → attendance conversion

**Validation**:
- Email matching handles case variations, whitespace
- Webhook events processed reliably (retry on failure)
- Booking/attendance data stored for historical analysis

---

## Edge Cases & Error Scenarios

### Edge Case 1: Zero Sends Campaign
- **Description**: Campaign with 0 emails sent
- **Expected Behavior**: Display "No data" instead of calculating rates
- **Handling**: Division by zero checks, show N/A for metrics

### Edge Case 2: 100% Bounce Rate
- **Description**: All emails bounced (bad lead list)
- **Expected Behavior**: Show critical alert, recommend list review
- **Handling**: Red alert styling, actionable guidance ("Review lead source")

### Edge Case 3: Missing Cal.com Data
- **Description**: Cal.com integration not configured or API down
- **Expected Behavior**: Show booking/attendance as "Integration Required"
- **Handling**: Graceful degradation, rest of dashboard functional

### Edge Case 4: Invalid Email Domains
- **Description**: Lead email addresses with malformed domains
- **Expected Behavior**: Categorize as "Unknown" domain type
- **Handling**: Robust domain parsing with fallback to "Unknown"

### Edge Case 5: Client with No Campaigns
- **Description**: Newly added client with no campaign history
- **Expected Behavior**: Show empty state with helpful guidance
- **Handling**: "No campaigns yet - start by creating a campaign in EmailBison"

### Error Scenario 1: EmailBison MCP API Failure
- **Trigger**: Network error, API rate limit, authentication failure
- **User Experience**: "Unable to load data - Retry" with retry button
- **Recovery**: Exponential backoff retry, show cached data if available

### Error Scenario 2: Data Sync Mismatch
- **Trigger**: Campaign data updated in EmailBison but not reflected in dashboard
- **User Experience**: Stale data warning if timestamp > 30 minutes old
- **Recovery**: Manual refresh available, investigate API sync issues

### Error Scenario 3: Calculation Overflow
- **Trigger**: Extremely large campaign (millions of sends)
- **User Experience**: Use abbreviated numbers (e.g., "1.2M sends")
- **Recovery**: Handle large numbers gracefully, test with max values

---

## Constraints & Limitations

**Technical**:
- EmailBison MCP API rate limits (unknown - need to test)
- Cal.com API rate limits (need documentation)
- Browser performance for large datasets (1000+ campaigns)

**Business**:
- Client consent required for benchmark comparisons
- Cal.com integration optional (some clients may not use it)
- Historical data limited to EmailBison retention policy

**External Dependencies**:
- EmailBison MCP API availability and uptime
- Cal.com API availability
- Claude Code MCP server connectivity

---

## Out of Scope (v1)

- **Predictive Analytics**: ML-based performance predictions (future v2 feature)
- **A/B Testing Framework**: Built-in campaign experimentation (use external tools)
- **Email Content Analysis**: Copy performance analytics (separate project)
- **CRM Integration**: Salesforce, HubSpot sync (Cal.com sufficient for v1)
- **Mobile App**: Web-only for v1
- **White-Label Client Portals**: LaunchClub team use only initially

---

## Uncertainties & Open Questions

**[RESOLVED] Question 1**: What format should ESP categorization use?
- **Impact**: Affects how workspaces map to ESP types
- **Decision**: Use existing ESP deliverability report structure (Google/Gmail, Custom Domain, Outlook/Microsoft)
- **Decision Date**: 2025-11-19

**[UNCLEAR] Question 2**: How should we handle leads with multiple campaign interactions?
- **Impact**: Reply rate calculations if lead contacted in multiple campaigns
- **Current Assumption**: Count reply only once per campaign, not per lead globally
- **Decision Needed By**: Before implementation

**[UNCLEAR] Question 3**: Should cross-client benchmarks be opt-in or opt-out?
- **Impact**: Privacy and competitive concerns
- **Current Assumption**: Opt-in (clients excluded from benchmarks by default)
- **Decision Needed By**: Before v1 launch

**[UNCLEAR] Question 4**: What granularity for historical trends (daily, weekly, monthly)?
- **Impact**: Database storage and query performance
- **Current Assumption**: Weekly aggregations for trends, daily data available on drill-down
- **Decision Needed By**: During technical planning

**[UNCLEAR] Question 5**: Should we detect and handle test campaigns differently?
- **Impact**: Test campaigns with small volumes skew averages
- **Current Assumption**: Include all campaigns, add "exclude test campaigns" filter option
- **Decision Needed By**: Before implementation

---

## Related Documents
- [Constitution](constitution.md) - Governing principles
- [Plan](plan.md) - Technical implementation (to be created)
- [Tasks](tasks.md) - Work breakdown (to be created)
