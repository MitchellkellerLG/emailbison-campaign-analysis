# Project Constitution: EmailBison Analytics Dashboard

**Created**: 2025-11-19
**Last Updated**: 2025-11-19
**Status**: Active

---

## Preamble

This constitution establishes the governing principles for the EmailBison Analytics Dashboard. All technical decisions, architectural choices, and implementation approaches must align with these principles.

**Project Overview**: A comprehensive analytics dashboard that provides ESP performance metrics, reply rates, booking rates, and lead engagement analytics across all EmailBison clients, with drill-down capabilities by industry, company size, and role/seniority.

**Target Outcomes**: Enable data-driven decision making for ESP selection, campaign optimization, and client performance tracking through real-time, accurate analytics with client-specific and cross-client insights.

---

## Article I: Data Accuracy Over Speed

All metrics displayed in the dashboard must be verifiable against source data from EmailBison API. Calculations must be transparent and auditable. Performance is secondary to correctness.

**Rationale**:
Incorrect analytics lead to poor business decisions. Client billing, ESP reputation, and campaign strategies depend on accurate data. Users must trust the dashboard completely.

**Enforcement**:
- All calculation functions must include unit tests with known inputs/outputs
- Source data queries must be logged for audit trails
- Metrics must match EmailBison MCP API responses exactly
- Data validation layer required before display

**Examples**:
✅ **Acceptable**: Query takes 3 seconds but validates all calculations against source
❌ **Unacceptable**: Cached data shown instantly but out of sync with EmailBison API

---

## Article II: Client Data Isolation

Each client's analytics must be completely isolated. No data leakage between clients. PII must never appear in logs, error messages, or cross-client aggregations.

**Rationale**:
EmailBison manages sensitive client data including company names, contact information, and campaign performance. Data breaches or accidental exposure would violate trust and potentially contracts.

**Enforcement**:
- Client ID required for all data queries (no default/global queries)
- PII scrubbing in all logging and error handling
- Cross-client analytics must only show anonymized/aggregated data
- Code review must verify client isolation in all new features

**Examples**:
✅ **Acceptable**: "Client #7 has 2.5% reply rate across 15 campaigns"
❌ **Unacceptable**: "Foundation workspace shows 2.5% reply rate" (exposes client name in logs)

---

## Article III: Real-Time Data Access

The dashboard must pull live data from EmailBison MCP API, not rely solely on cached/stale data. Users should see current state, with clear timestamps on all metrics.

**Rationale**:
Campaign performance changes hourly. Stale data leads to incorrect decisions about ESP rotation, lead limits, or campaign pausing. Real-time visibility is critical for active campaign management.

**Enforcement**:
- All data queries use EmailBison MCP tools (not local database unless explicitly cached)
- Timestamps displayed on every metric showing last refresh time
- Cache TTL maximum of 15 minutes for performance metrics
- Manual refresh button available on all dashboards

**Examples**:
✅ **Acceptable**: "Reply Rate: 2.5% (Last updated: 2 minutes ago) [Refresh]"
❌ **Unacceptable**: Static report showing yesterday's data with no timestamp

---

## Article IV: ESP Performance Transparency

ESP-to-ESP metrics must break down performance by both sending ESP and receiving ESP domain. Bounce rates, reply rates, and deliverability must be tracked per domain.

**Rationale**:
Different ESPs have different deliverability to different receiving domains (Gmail vs Outlook vs corporate domains). Understanding these patterns enables better ESP selection and rotation strategies.

**Enforcement**:
- All reply/bounce metrics must be filterable by sending ESP type
- Receiving domain detection from email addresses (Gmail, Outlook, custom)
- ESP performance grading system (A+ to F) based on established thresholds
- Comparison views showing ESP-to-ESP matrix

**Examples**:
✅ **Acceptable**: "Google Workspace → Gmail recipients: 3.2% reply, 0.1% bounce"
❌ **Unacceptable**: "Overall reply rate: 2.5%" (no ESP breakdown)

---

## Article V: Segmentation by Firmographics

All performance metrics must be filterable by industry, company size, and role/seniority. These segments are critical for understanding campaign effectiveness.

**Rationale**:
Different segments respond differently to campaigns. A strong overall reply rate might hide poor performance in target segments. Granular segmentation enables optimization.

**Enforcement**:
- Extract industry, company size, seniority from lead data (title, company fields)
- Classification logic must be documented and tested
- All dashboard views must offer segment filters
- Segment performance comparisons must be available

**Examples**:
✅ **Acceptable**: "SaaS industry: 3.5% reply | Enterprise size: 2.8% reply | VP+ level: 4.1% reply"
❌ **Unacceptable**: Campaign metrics with no ability to filter by segment

---

## Article VI: Conversion Funnel Completeness

Track the full funnel: sends → delivered → opens (if tracked) → replies → interested → booked → showed up. Each stage must be measurable and comparable.

**Rationale**:
Reply rate alone doesn't tell the full story. A campaign with high replies but low interest rate wastes resources. Show-up rate validates booking quality. Complete funnel visibility enables optimization.

**Enforcement**:
- All funnel stages calculated for every campaign
- Interest rate per reply (interested/replies) must be prominent
- Booking data integrated from Cal.com API
- Show-up data from Cal.com webhook events
- Engaged lead rate (sends per engaged lead) calculated

**Examples**:
✅ **Acceptable**: "100 sends → 95 delivered → 3 replies → 2 interested → 1 booked → 1 showed"
❌ **Unacceptable**: Only showing reply rate without downstream conversion metrics

---

## Article VII: Per-Client Dashboards with Cross-Client Insights

Each client must have a dedicated dashboard view. Cross-client analytics must be available but anonymized. Benchmarking must be opt-in per client.

**Rationale**:
Clients need to see their own performance in isolation. LaunchClub team needs cross-client insights for strategy. Benchmarking helps clients understand relative performance without exposing competitors.

**Enforcement**:
- Client selector/filter as primary navigation
- Cross-client views require authentication/authorization
- Anonymized labels in cross-client comparisons ("Client A", "Client B")
- Benchmarking opt-in tracked per client (default: excluded from benchmarks)

**Examples**:
✅ **Acceptable**: Client-specific view + separate "All Clients Overview" with anonymized data
❌ **Unacceptable**: Single dashboard mixing all client data without isolation

---

## Article VIII: Sortability and Ranking

All tables and lists must be sortable by key metrics: engaged lead rate, reply rate, interest rate, booking rate, bounce rate. Enable performance-based ranking.

**Rationale**:
Users need to identify top-performing and underperforming campaigns, ESPs, and segments quickly. Sorting enables prioritization and resource allocation.

**Enforcement**:
- All metric columns must be sortable (ascending/descending)
- Default sort by most actionable metric per view
- Ranking indicators (1st, 2nd, 3rd) for top performers
- Color coding for performance tiers (green/yellow/red)

**Examples**:
✅ **Acceptable**: ESP table sortable by reply rate, bounce rate, volume - shows #1 ranked ESP highlighted
❌ **Unacceptable**: Fixed-order table with no sorting capability

---

## Article IX: Bounce Tracking and Alerting

Bounce rates must be tracked per domain, per ESP, and overall. Thresholds must trigger alerts for ESP reputation protection.

**Rationale**:
High bounce rates damage ESP reputation and reduce future deliverability. Early detection prevents escalation. Per-domain tracking identifies bad lead sources.

**Enforcement**:
- Bounce rate calculated at domain level (e.g., acme.com: 5% bounce)
- ESP-level bounce rate monitored against thresholds (<0.5% good, 0.5-2% warning, >2% critical)
- Visual alerts when thresholds exceeded
- Historical bounce trends tracked for pattern detection

**Examples**:
✅ **Acceptable**: "ESP #3: 2.5% bounce rate ⚠️ - Exceeds threshold, reduce volume"
❌ **Unacceptable**: Bounce data visible but no threshold enforcement or alerts

---

## Article X: Cal.com Integration for True ROI

Booking and show-up data must be integrated from Cal.com to track true campaign ROI. Meeting outcomes close the loop on lead quality.

**Rationale**:
Interested leads don't always convert to meetings. Show-up rate validates lead quality and campaign effectiveness. Without meeting data, ROI calculations are incomplete.

**Enforcement**:
- Cal.com API integration for booking data
- Cal.com webhook integration for attendance tracking
- Booking rate calculated (bookings/interested leads)
- Show-up rate calculated (attended/booked)
- Full funnel: sends → replies → interested → booked → showed

**Examples**:
✅ **Acceptable**: "Campaign X: 10 interested → 7 booked → 5 showed (71% show rate)"
❌ **Unacceptable**: Dashboard ends at "interested leads" without booking/attendance data

---

## Amendment Process

This constitution can be amended through the following process:

1. **Proposal**: Any team member can propose amendments via GitHub issue
2. **Review**: Mitchell Keller and stakeholders review within 48 hours
3. **Approval**: Mitchell Keller must approve constitutional changes
4. **Implementation**: Amendments take effect immediately upon approval

**Amendment History**:
| Date | Article | Change | Rationale | Approved By |
|------|---------|--------|-----------|-------------|
| - | - | - | - | - |

---

## Constitutional Compliance Checklist

Use this checklist to validate compliance before deployment:

### Data Quality
- [ ] All calculations tested with known inputs/outputs (Article I)
- [ ] Data validation layer implemented (Article I)
- [ ] Client data isolation verified in all queries (Article II)
- [ ] PII scrubbing confirmed in logs and errors (Article II)

### Real-Time Performance
- [ ] EmailBison MCP API integration functional (Article III)
- [ ] Timestamps displayed on all metrics (Article III)
- [ ] Manual refresh available (Article III)

### Analytics Completeness
- [ ] ESP-to-ESP performance matrix implemented (Article IV)
- [ ] Industry/size/seniority segmentation working (Article V)
- [ ] Full conversion funnel tracked (Article VI)
- [ ] Cal.com integration complete (Article X)

### User Experience
- [ ] Per-client dashboard views implemented (Article VII)
- [ ] Cross-client anonymized views functional (Article VII)
- [ ] All tables sortable by key metrics (Article VIII)
- [ ] Bounce rate alerts configured (Article IX)

---

## Related Documents

- [Specification](specification.md) - Feature requirements
- [Plan](plan.md) - Technical implementation blueprint
- [Tasks](tasks.md) - Work breakdown structure

---

**Template Version**: 1.0
**Owner**: Mitchell Keller
