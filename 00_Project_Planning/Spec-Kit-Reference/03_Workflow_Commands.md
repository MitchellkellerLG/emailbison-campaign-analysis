# Spec-Kit Workflow Commands Reference

## Overview

Spec-Kit provides eight slash commands that guide AI agents through structured, specification-driven development. Each command produces specific artifacts and builds upon previous phases.

## Command Dependency Chain

```
/speckit.constitution (Foundation)
         ↓
/speckit.specify (Requirements)
         ↓
/speckit.clarify (Optional - Resolve ambiguities)
         ↓
/speckit.plan (Technical Blueprint)
         ↓
/speckit.analyze (Optional - Validate consistency)
         ↓
/speckit.tasks (Work Breakdown)
         ↓
/speckit.checklist (Optional - Quality gates)
         ↓
/speckit.implement (Execution)
```

---

## 1. /speckit.constitution

### Purpose
Establish immutable governing principles for the project.

### When to Use
**First command** in any new project or feature. Run before writing any specifications.

### What It Creates
- `.specify/memory/constitution.md`
- Project-wide principles that guide all subsequent decisions

### Key Focus Areas

**Code Quality Standards**:
- Naming conventions
- Code organization patterns
- Documentation requirements
- Complexity limits

**Testing Approach**:
- Test coverage requirements
- Testing strategy (unit, integration, e2e)
- Mock vs real service preferences
- Test-first vs test-after

**UX Consistency**:
- Interface patterns
- Error message standards
- Accessibility requirements
- Performance expectations

**Performance Requirements**:
- Response time limits
- Resource usage constraints
- Scalability targets
- Optimization priorities

### Example Invocation

```
/speckit.constitution

Prompt: "This project prioritizes maintainability and team collaboration.
Principles:
- All code must have >= 80% test coverage
- Prefer integration tests with real services over mocks
- Maximum function complexity: 10 cyclomatic complexity
- All public APIs require documentation with examples
- Performance: API responses < 500ms at p95
- Accessibility: WCAG 2.1 AA compliance for all UI"
```

### Output Example

```markdown
# Project Constitution

## Article I: Test Coverage
All production code must achieve minimum 80% test coverage.
No pull requests merge without meeting this threshold.

## Article II: Integration Testing Preference
Tests shall use real database and API instances in test environments.
Mocks permitted only when external service unavailable in test environment.

## Article III: Complexity Limits
Functions exceeding cyclomatic complexity of 10 must be refactored.
Complex logic requires decomposition into smaller, testable units.

## Article IV: API Documentation
All public APIs require:
- Purpose description
- Parameter documentation
- Return value specification
- At least 2 usage examples
- Error scenarios

## Article V: Performance Standards
API endpoints must respond within 500ms at 95th percentile under normal load.
Performance regressions block deployment.

## Article VI: Accessibility Compliance
All user interfaces must meet WCAG 2.1 AA standards.
Automated accessibility testing required in CI pipeline.
```

### Best Practices

✅ **Keep it focused**: 5-10 articles maximum
✅ **Make it measurable**: Use quantifiable thresholds
✅ **Ensure enforceability**: Include validation mechanisms
✅ **Avoid technology lock-in**: Principles should survive tech stack changes

❌ **Don't include implementation details**: No specific libraries or frameworks
❌ **Don't make it aspirational**: Only include principles you'll actually enforce
❌ **Don't contradict industry standards**: Unless you have strong rationale

---

## 2. /speckit.specify

### Purpose
Transform feature ideas into comprehensive, technology-agnostic specifications.

### When to Use
After establishing constitution. Run before making any technical decisions.

### What It Creates
- `.specify/memory/specification.md`
- Feature branch (if using Git)
- Numbered feature directory (e.g., `features/001-feature-name/`)

### Key Focus Areas

**User Stories**:
- Who needs this feature
- What problem it solves
- Expected user experience
- Success criteria

**Business Requirements**:
- Why this feature matters
- Business value delivered
- Metrics for success
- Constraints and limitations

**Edge Cases**:
- Error scenarios
- Boundary conditions
- Invalid input handling
- System failure modes

**Uncertainties**:
- Ambiguous requirements (marked with `[UNCLEAR]`)
- Missing information
- Open questions for stakeholders

### Example Invocation

```
/speckit.specify

Prompt: "Build a campaign performance dashboard that aggregates metrics
from multiple EmailBison workspaces. Users need to see:
- Total campaigns across all workspaces
- Aggregate open rates, reply rates, conversion rates
- Top 5 performing campaigns this month
- Workspaces with reply rates < 10% (requiring attention)

Users: Marketing executives who don't access individual workspace dashboards.
Success: Report generates in < 30 seconds, metrics accurate within 0.1%."
```

### Output Structure

```markdown
# Feature Specification: Multi-Workspace Campaign Dashboard

## Overview
Aggregates campaign performance metrics across multiple EmailBison workspaces
into a single executive summary report.

## User Stories

### Story 1: Executive Performance Review
**As a** marketing executive
**I want** to see aggregate campaign performance across all workspaces
**So that** I can assess overall marketing effectiveness without accessing
individual workspace dashboards

**Acceptance Criteria**:
- Report includes all active workspaces
- Metrics match individual workspace dashboards
- Report generates in < 30 seconds
- Data updates reflect current state (not cached > 1 hour)

### Story 2: Identify Underperforming Workspaces
**As a** marketing manager
**I want** to see which workspaces have low reply rates
**So that** I can prioritize optimization efforts

**Acceptance Criteria**:
- Workspaces with < 10% reply rates flagged
- Flag appears within 24 hours of crossing threshold
- Flag clears when reply rate improves above 10%

## Success Criteria

**Performance**:
- Report generation: < 30 seconds for up to 50 campaigns
- Metric accuracy: Within 0.1% of source data
- Data freshness: < 1 hour lag from EmailBison API

**Usability**:
- Non-technical stakeholders can interpret report
- Report accessible without EmailBison login
- Report exportable to PDF for presentations

**Reliability**:
- Handles EmailBison API unavailability gracefully
- Continues with partial data if some workspaces unreachable
- Logs errors for debugging

## Edge Cases

**Scenario 1: Zero-Send Campaigns**
[UNCLEAR] Should campaigns with zero sends be included in aggregate metrics?
Current assumption: Exclude from calculations but note in report footer.

**Scenario 2: Paused Campaigns**
[UNCLEAR] How should paused campaigns be categorized?
Current assumption: Include in total count but mark status separately.

**Scenario 3: API Rate Limiting**
If EmailBison API rate-limits requests, system should:
- Respect rate limits (no retries overwhelming API)
- Report partial data with clear indication of missing workspaces
- Log issue for manual review

## Out of Scope (v1)

- Historical trend analysis (mentioned but not required for MVP)
- Real-time dashboard (batch report sufficient)
- Email notifications (manual report viewing acceptable)
- Customizable metric calculations (fixed formula for v1)

## Uncertainties

[UNCLEAR] Should historical campaigns (> 6 months old) be included?
[UNCLEAR] What time zone for "this month" calculations?
[UNCLEAR] Should archived workspaces be included or excluded?
```

### Best Practices

✅ **Focus on "what" not "how"**: Describe user needs, not technical implementation
✅ **Use uncertainty markers**: Explicitly mark ambiguities with `[UNCLEAR]`
✅ **Include measurable success criteria**: Quantify performance, accuracy, usability
✅ **Document out-of-scope**: Prevents scope creep, captures future ideas

❌ **Don't specify technology**: No mention of Python, databases, frameworks
❌ **Don't include architectural decisions**: Those belong in plans
❌ **Don't guess at unclear requirements**: Mark them as `[UNCLEAR]` instead

---

## 3. /speckit.clarify

### Purpose
Identify underspecified areas in specifications before planning phase.

### When to Use
**Optional**. Use after `/speckit.specify` if specifications feel incomplete or ambiguous.

### What It Creates
No artifact. Outputs questions and ambiguities to resolve in specification.

### How It Works
AI analyzes specification and surfaces:
- Missing information
- Ambiguous requirements
- Contradictory statements
- Assumptions that need validation

### Example Invocation

```
/speckit.clarify

(AI reads .specify/memory/specification.md and identifies issues)
```

### Example Output

```
## Clarification Questions

### High Priority (Blocks Planning)

1. **Time Zone for "This Month" Calculations**
   Specification mentions "Top 5 performing campaigns this month" but doesn't
   specify time zone. Without this:
   - Users in different time zones see different "current month"
   - Historical comparisons become inconsistent

   **Recommendation**: Specify UTC or user's workspace time zone

2. **Handling Zero-Send Campaigns**
   Marked as [UNCLEAR]. This affects:
   - Aggregate metric calculations (divide-by-zero)
   - "Total campaigns" count
   - UI display (show zero-send campaigns or hide?)

   **Recommendation**: Decide inclusion/exclusion policy before planning

### Medium Priority (Affects Implementation Approach)

3. **Archived Workspace Handling**
   Not addressed in specification. Questions:
   - Should archived workspaces appear in report?
   - Should "total workspaces" count include archived?
   - What if only active campaigns but workspace archived?

4. **Partial Data Acceptable?**
   Specification says "Continues with partial data if some workspaces unreachable"
   but doesn't specify:
   - Minimum threshold (50%? 80%? Any data?)
   - How to visually indicate partial data
   - Whether to block report generation if threshold not met

### Low Priority (Nice to Have Clarity)

5. **"Requiring Attention" Definition**
   Specification uses "< 10% reply rate" for flagging.
   Clarify:
   - Is this configurable or hardcoded?
   - Does it apply to all campaign types or specific types?
   - Should there be a minimum send volume threshold (e.g., ignore campaigns < 100 sends)?
```

### Best Practices

✅ **Run before planning**: Cheaper to resolve ambiguities now than during implementation
✅ **Prioritize questions**: Focus on blockers first
✅ **Update specification**: Incorporate answers back into specification.md

❌ **Don't skip high-priority questions**: They'll cause implementation delays
❌ **Don't guess answers**: Confirm with stakeholders

---

## 4. /speckit.plan

### Purpose
Create technical implementation blueprint mapping specifications to technology choices.

### When to Use
After specification is complete and clarified. Before task generation.

### What It Creates
- `.specify/memory/plan.md`
- Technical architecture
- Technology stack decisions with rationale
- Implementation approach

### Key Focus Areas

**Technology Choices**:
- Languages and frameworks
- Libraries and dependencies
- Data storage solutions
- Integration patterns

**Architecture Decisions**:
- System components
- Data flow
- API design
- Error handling strategy

**Constitutional Compliance**:
- How plan adheres to constitution
- Trade-offs and rationale
- Phase gates for validation

### Example Invocation

```
/speckit.plan

(AI reads specification.md and constitution.md, generates technical plan)
```

### Output Structure

```markdown
# Implementation Plan: Multi-Workspace Campaign Dashboard

## Technology Stack

### Language: Python 3.11+
**Rationale**:
- Native JSON handling (EmailBison API returns JSON)
- Rich data analysis libraries (pandas for aggregation)
- Team familiarity (reduces onboarding, per Constitution Article on maintainability)
- Excellent MCP support (EmailBison MCP available)

**Alternatives Considered**:
- TypeScript: Better type safety but less mature data analysis ecosystem
- Go: Better performance but team unfamiliar (violates maintainability principle)

### MCP Integration: EmailBison MCP
**Rationale**:
- Direct API access without manual authentication
- Built-in rate limiting handling
- Error handling abstractions

### Data Processing: Pandas
**Rationale**:
- Efficient aggregation for 50+ campaigns
- Well-tested for statistical calculations (0.1% accuracy requirement)
- In-memory processing meets < 30 second performance requirement

### Output Format: Markdown
**Rationale**:
- Human-readable (non-technical stakeholders requirement)
- Version-controllable
- Easy conversion to PDF via pandoc

## Architecture

### Component Design

```
┌─────────────────────────────────────────────┐
│           Campaign Dashboard                 │
│                                              │
│  ┌────────────────┐    ┌──────────────────┐│
│  │ WorkspaceFetcher│───▶│ MetricsAggregator││
│  └────────────────┘    └──────────────────┘│
│          │                      │           │
│          ▼                      ▼           │
│  ┌────────────────┐    ┌──────────────────┐│
│  │  EmailBison MCP│    │ ReportGenerator   ││
│  └────────────────┘    └──────────────────┘│
│                                │            │
│                                ▼            │
│                        dashboard-report.md  │
└─────────────────────────────────────────────┘
```

### Data Flow

1. **WorkspaceFetcher**
   - Authenticates with EmailBison MCP
   - Fetches list of active workspaces
   - Retrieves campaigns per workspace
   - Handles API errors gracefully (per specification)

2. **MetricsAggregator**
   - Receives campaign data from all workspaces
   - Calculates aggregate metrics (open rate, reply rate, conversion rate)
   - Identifies top 5 performing campaigns
   - Flags workspaces with < 10% reply rates

3. **ReportGenerator**
   - Formats aggregated data as Markdown
   - Includes timestamp and data freshness indicator
   - Notes any partial data situations
   - Outputs to file

### Data Models

```python
from dataclasses import dataclass
from decimal import Decimal
from datetime import datetime
from enum import Enum

class CampaignStatus(Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"

@dataclass
class Campaign:
    """Represents a single EmailBison campaign"""
    id: int
    workspace_id: int
    name: str
    status: CampaignStatus
    total_sends: int
    opens: int
    replies: int
    conversions: int

    @property
    def open_rate(self) -> Decimal:
        """Open rate with 0.1% precision (per spec)"""
        if self.total_sends == 0:
            return Decimal('0.0')
        return Decimal(self.opens) / Decimal(self.total_sends) * 100

    @property
    def reply_rate(self) -> Decimal:
        """Reply rate with 0.1% precision (per spec)"""
        if self.total_sends == 0:
            return Decimal('0.0')
        return Decimal(self.replies) / Decimal(self.total_sends) * 100

@dataclass
class WorkspaceMetrics:
    """Aggregated metrics for a single workspace"""
    workspace_id: int
    workspace_name: str
    total_campaigns: int
    aggregate_open_rate: Decimal
    aggregate_reply_rate: Decimal
    aggregate_conversion_rate: Decimal
    requires_attention: bool  # True if reply_rate < 10%

@dataclass
class DashboardReport:
    """Complete dashboard data"""
    generated_at: datetime
    total_workspaces: int
    total_campaigns: int
    overall_open_rate: Decimal
    overall_reply_rate: Decimal
    overall_conversion_rate: Decimal
    top_campaigns: list[Campaign]  # Top 5
    attention_workspaces: list[WorkspaceMetrics]
    partial_data: bool  # True if some workspaces failed to fetch
    missing_workspaces: list[str]  # Names of unreachable workspaces
```

## Implementation Approach

### Phase 1: Core Data Fetching (Constitutional Gate 1)
**Tasks**:
1. Implement WorkspaceFetcher with EmailBison MCP
2. Write tests for successful fetch
3. Write tests for API error scenarios
4. Implement retry logic with exponential backoff

**Gate**: All tests passing, no code without tests (Article III)

### Phase 2: Metrics Calculation (Constitutional Gate 2)
**Tasks**:
1. Implement MetricsAggregator
2. Write tests for aggregate calculations
3. Validate 0.1% accuracy requirement
4. Handle zero-send campaigns (exclude from calculations per specification clarification)

**Gate**: Accuracy validated against known dataset, performance < 30 seconds

### Phase 3: Report Generation (Constitutional Gate 3)
**Tasks**:
1. Implement ReportGenerator (Markdown output)
2. Write tests for report formatting
3. Validate readability (non-technical stakeholder review)
4. Add partial data indicators

**Gate**: Stakeholder approval on report format

## Error Handling Strategy

### EmailBison API Errors
- **Rate Limiting**: Respect retry-after headers, exponential backoff
- **Timeout**: 10 second timeout per workspace fetch, continue with partial data
- **Authentication**: Fail immediately (can't generate report without auth)
- **Partial Failure**: Continue with available workspaces, note missing in report

### Data Quality Issues
- **Missing Metrics**: Skip campaign from calculations, log warning
- **Invalid Data**: Validate ranges (e.g., reply_rate <= 100%), log error, exclude from calculations

### Performance Degradation
- **> 30 Second Generation**: Log warning, complete report anyway
- **> 60 Second Generation**: Add "performance degraded" warning to report

## Constitutional Compliance

### Article I: Test Coverage (80% minimum)
- Unit tests for all calculation functions
- Integration tests with EmailBison MCP test environment
- Accuracy validation tests

### Article II: Integration Testing Preference
- Tests use real EmailBison MCP (test workspaces with known data)
- Mocks only for rate-limiting scenarios (can't trigger in test environment)

### Article III: Complexity Limits (< 10 cyclomatic complexity)
- WorkspaceFetcher.fetch_all_workspaces: complexity 4
- MetricsAggregator.calculate_aggregates: complexity 6
- ReportGenerator.generate: complexity 3

### Article IV: API Documentation
- All public methods documented with docstrings
- README.md includes usage examples
- Error scenarios documented

### Article V: Performance Standards (< 500ms API responses)
- Not applicable (this is batch report, not API)
- Report generation < 30 seconds requirement met via in-memory processing

## Testing Strategy

### Unit Tests
- MetricsAggregator calculation accuracy
- ReportGenerator formatting
- Edge cases (zero sends, missing data)

### Integration Tests
- End-to-end report generation with test workspaces
- API error handling (timeout, rate limiting)
- Partial data scenarios

### Performance Tests
- 50 campaign benchmark (must complete < 30 seconds)
- Accuracy validation (0.1% tolerance)

## Dependencies

```
# requirements.txt
pandas==2.1.0           # Data aggregation
python-decimal==0.1.0   # High-precision calculations
emailbison-mcp==1.0.0   # EmailBison API access (via MCP)
pytest==7.4.0           # Testing framework
pytest-timeout==2.1.0   # Test timeouts
```

## Open Questions

[RESOLVED] Time zone for "this month": Use UTC
[RESOLVED] Zero-send campaigns: Exclude from calculations
[PENDING] Archived workspaces: Awaiting stakeholder decision
```

### Best Practices

✅ **Trace decisions to requirements**: Link tech choices to specification needs
✅ **Document alternatives considered**: Show you evaluated trade-offs
✅ **Validate constitutional compliance**: Every article must be addressed
✅ **Include architectural diagrams**: Visual aids clarify system design

❌ **Don't include implementation code**: Plans describe approach, not implementation
❌ **Don't make unjustified choices**: Every decision needs rationale
❌ **Don't violate constitution**: Plans failing compliance should be rejected

---

## 5. /speckit.analyze

### Purpose
Cross-artifact validation ensuring plan aligns with specification and constitution.

### When to Use
**Optional**. Use after `/speckit.plan` before task generation to catch inconsistencies.

### What It Creates
No artifact. Outputs validation report highlighting mismatches.

### How It Works
AI analyzes:
- Specification requirements coverage in plan
- Constitutional principle adherence
- Internal plan inconsistencies
- Missing architectural decisions

### Example Invocation

```
/speckit.analyze

(AI reads constitution.md, specification.md, plan.md and performs cross-validation)
```

### Example Output

```
## Validation Report

### ✅ Specification Coverage: 95%

**Covered Requirements**:
- ✅ Aggregate metrics across workspaces
- ✅ Top 5 performing campaigns
- ✅ Flag workspaces < 10% reply rate
- ✅ < 30 second generation time
- ✅ 0.1% accuracy requirement
- ✅ Partial data handling

**Missing Requirements**:
- ⚠️  Specification mentions "Data freshness: < 1 hour lag" but plan doesn't
     address caching or data staleness validation

**Recommendation**: Add freshness timestamp validation to WorkspaceFetcher

### ✅ Constitutional Compliance: 100%

**Article I (Test Coverage >= 80%)**:
- ✅ Plan includes unit tests, integration tests, performance tests
- ✅ Explicit gate: "All tests passing before proceeding"

**Article II (Integration Testing Preference)**:
- ✅ Plan specifies "Tests use real EmailBison MCP"
- ✅ Mocks only for scenarios untestable in real environment

**Article III (Complexity < 10)**:
- ✅ Complexity estimates provided for each component
- ✅ All components below threshold

**Articles IV-VI**:
- ✅ All articles addressed in compliance section

### ⚠️  Internal Consistency: 2 Issues Found

**Issue 1: Dependency Version Conflict**
Plan specifies `pandas==2.1.0` but EmailBison MCP requires `pandas>=2.2.0`.

**Impact**: Installation will fail
**Recommendation**: Update to `pandas==2.2.0`

**Issue 2: Performance Assumption Unvalidated**
Plan assumes "In-memory processing meets < 30 second requirement" but provides
no supporting benchmark or calculation.

**Impact**: Risk of missing performance target
**Recommendation**: Add performance estimate or require benchmark in Phase 1

### 📊 Architectural Review

**Strengths**:
- Clear component separation
- Explicit error handling strategy
- Data models well-defined

**Concerns**:
- No discussion of concurrent workspace fetching (sequential may be slow)
- Missing logging strategy (debugging production issues)
- No observability metrics (how to measure "< 1 hour freshness" in production)

**Recommendations**:
1. Consider parallel workspace fetching (async or threading)
2. Add structured logging to plan
3. Include metrics collection (execution time, fetch success rate)
```

### Best Practices

✅ **Fix issues before proceeding**: Don't generate tasks from inconsistent plans
✅ **Prioritize specification gaps**: Uncovered requirements are highest priority
✅ **Validate assumptions**: Challenge unproven performance claims

❌ **Don't ignore warnings**: Address or explicitly accept risks
❌ **Don't proceed with constitutional violations**: Fix or revise constitution

---

## 6. /speckit.tasks

### Purpose
Generate actionable task breakdown from implementation plan.

### When to Use
After plan is validated. Before implementation begins.

### What It Creates
- `.specify/memory/tasks.md`
- Discrete work items with dependencies
- Parallelizable task identification
- Estimated effort

### Key Focus Areas

**Task Decomposition**:
- Break plan into 2-4 hour chunks
- Identify discrete deliverables
- Explicit dependencies between tasks

**Test-First Ordering**:
- Tests created before implementation
- Validation steps after each implementation

**Parallel Opportunities**:
- Tasks with no dependencies can run concurrently
- Enables team distribution

### Example Invocation

```
/speckit.tasks

(AI reads plan.md and generates task breakdown)
```

### Output Structure

```markdown
# Implementation Tasks: Multi-Workspace Campaign Dashboard

## Task Overview

**Total Tasks**: 15
**Estimated Duration**: 3-4 days (assuming 1 developer)
**Parallelizable Tasks**: Tasks 2-4, Tasks 8-10

## Phase 1: Core Data Fetching (Day 1)

### Task 1: Project Setup [2 hours]
**Dependencies**: None
**Deliverable**: Project structure with dependencies installed

**Steps**:
1. Create project directory structure
2. Initialize virtual environment
3. Install dependencies from requirements.txt
4. Configure EmailBison MCP connection
5. Write README.md with setup instructions

**Validation**:
- [ ] All dependencies install without errors
- [ ] EmailBison MCP connection successful
- [ ] pytest runs (no tests yet, should pass with 0 tests)

---

### Task 2: Write WorkspaceFetcher Tests [3 hours]
**Dependencies**: Task 1
**Deliverable**: Comprehensive test suite for WorkspaceFetcher (FAILING)

**Steps**:
1. Write test: `test_fetch_all_workspaces_success()`
   - Mock successful EmailBison API response
   - Validate workspace data parsed correctly

2. Write test: `test_fetch_all_workspaces_api_timeout()`
   - Simulate API timeout
   - Validate partial data handling

3. Write test: `test_fetch_all_workspaces_rate_limit()`
   - Simulate rate limiting response
   - Validate retry logic with exponential backoff

4. Write test: `test_fetch_all_workspaces_authentication_failure()`
   - Simulate auth error
   - Validate immediate failure (no retry)

**Validation**:
- [ ] All tests run (expect failures - implementation doesn't exist yet)
- [ ] Test coverage tool configured
- [ ] Tests follow naming conventions (per constitution)

**Note**: Per Article III (Test-First), these tests MUST be written and failing
before implementing WorkspaceFetcher.

---

### Task 3: Implement WorkspaceFetcher [4 hours]
**Dependencies**: Task 2 (tests must exist first)
**Deliverable**: Working WorkspaceFetcher passing all tests

**Steps**:
1. Implement `WorkspaceFetcher.__init__(mcp_client)`
2. Implement `WorkspaceFetcher.fetch_all_workspaces()`
   - Handle successful responses
   - Implement timeout handling (10 second per workspace)
   - Implement rate limit retry with exponential backoff
   - Fail fast on authentication errors

3. Run tests iteratively until all pass
4. Validate 80% coverage threshold (per Article I)

**Validation**:
- [ ] All tests from Task 2 passing
- [ ] Code coverage >= 80%
- [ ] Cyclomatic complexity < 10 (per Article III)
- [ ] Docstrings present for all public methods (per Article IV)

---

### Task 4: Integration Test - Real EmailBison MCP [2 hours]
**Dependencies**: Task 3
**Deliverable**: Integration test with real test workspace

**Steps**:
1. Create test workspace in EmailBison (or use dedicated test workspace)
2. Populate with known test data (3 campaigns, predictable metrics)
3. Write integration test: `test_fetch_real_workspace()`
   - Fetches test workspace
   - Validates data matches expected values
   - Confirms < 10 second fetch time

4. Document test workspace setup in README.md

**Validation**:
- [ ] Integration test passes
- [ ] Test workspace documented (so others can run tests)
- [ ] Per Article II (Integration Testing Preference), using real MCP

---

## Phase 2: Metrics Calculation (Day 2)

### Task 5: Write MetricsAggregator Tests [3 hours]
**Dependencies**: Task 1
**Deliverable**: Test suite for MetricsAggregator (FAILING)

**Parallelizable**: Can run in parallel with Task 2-4 (different team member)

**Steps**:
1. Write test: `test_calculate_aggregate_metrics_basic()`
   - Input: 10 campaigns with known metrics
   - Validate: Aggregate rates correct within 0.1%

2. Write test: `test_calculate_aggregate_metrics_zero_sends()`
   - Input: Mix of normal and zero-send campaigns
   - Validate: Zero-send campaigns excluded from calculations

3. Write test: `test_identify_top_campaigns()`
   - Input: 20 campaigns
   - Validate: Returns top 5 by reply rate

4. Write test: `test_flag_attention_workspaces()`
   - Input: Workspaces with < 10% and >= 10% reply rates
   - Validate: Correct flagging

**Validation**:
- [ ] All tests failing (no implementation yet)
- [ ] Test data documented (for reproducibility)

---

### Task 6: Implement MetricsAggregator [4 hours]
**Dependencies**: Task 5
**Deliverable**: Working MetricsAggregator passing all tests

**Steps**:
1. Implement Campaign dataclass (with open_rate, reply_rate properties)
2. Implement WorkspaceMetrics dataclass
3. Implement DashboardReport dataclass
4. Implement `MetricsAggregator.calculate_aggregates(campaigns)`
   - Use pandas for efficient aggregation
   - Ensure Decimal precision (0.1% accuracy requirement)
5. Implement `MetricsAggregator.identify_top_campaigns(campaigns, n=5)`
6. Implement `MetricsAggregator.flag_attention_workspaces(workspaces)`

**Validation**:
- [ ] All tests passing
- [ ] Accuracy validated: 0.1% tolerance
- [ ] Coverage >= 80%
- [ ] Complexity < 10

---

### Task 7: Accuracy Validation Test [2 hours]
**Dependencies**: Task 6
**Deliverable**: Benchmark test with known-correct dataset

**Steps**:
1. Create reference dataset (50 campaigns, manually calculated metrics)
2. Write test: `test_accuracy_benchmark()`
   - Run MetricsAggregator on reference dataset
   - Validate all metrics within 0.1% of manual calculations
3. Document reference dataset (CSV file committed to repo)

**Validation**:
- [ ] Accuracy test passes
- [ ] Reference dataset documented
- [ ] Per specification: "Metrics accurate within 0.1%"

---

## Phase 3: Report Generation (Day 3)

### Task 8: Write ReportGenerator Tests [2 hours]
**Dependencies**: Task 1
**Deliverable**: Test suite for ReportGenerator (FAILING)

**Parallelizable**: Can run in parallel with Task 5-7

**Steps**:
1. Write test: `test_generate_report_complete_data()`
   - Input: Full DashboardReport with all data
   - Validate: Markdown output includes all sections

2. Write test: `test_generate_report_partial_data()`
   - Input: DashboardReport with partial_data=True
   - Validate: Warning appears in output

3. Write test: `test_report_readability()`
   - Input: Sample DashboardReport
   - Validate: Non-technical stakeholder can interpret (manual review)

**Validation**:
- [ ] Tests failing (no implementation)
- [ ] Sample report output reviewed by non-technical stakeholder (Mitchell)

---

### Task 9: Implement ReportGenerator [3 hours]
**Dependencies**: Task 8
**Deliverable**: Working ReportGenerator passing all tests

**Steps**:
1. Implement `ReportGenerator.generate(report: DashboardReport) -> str`
   - Format as Markdown
   - Include timestamp, data freshness indicator
   - Note partial data if applicable
   - Format metrics as tables

2. Implement `ReportGenerator.save_to_file(report_md: str, filepath: str)`
3. Create report template (Markdown structure)

**Validation**:
- [ ] All tests passing
- [ ] Stakeholder approval on format (Mitchell reviews sample output)
- [ ] Coverage >= 80%

---

### Task 10: End-to-End Integration Test [2 hours]
**Dependencies**: Tasks 4, 7, 9
**Deliverable**: Full pipeline test (fetch → aggregate → generate)

**Steps**:
1. Write test: `test_full_dashboard_generation()`
   - Fetch data from test workspace (Task 4 setup)
   - Calculate aggregates
   - Generate report
   - Validate report completeness

2. Measure performance: Report generation time
3. Validate: < 30 second requirement

**Validation**:
- [ ] End-to-end test passes
- [ ] Performance < 30 seconds for test workspace (10 campaigns)
- [ ] Report output matches expected format

---

## Phase 4: Error Handling & Polish (Day 4)

### Task 11: Implement Error Handling [3 hours]
**Dependencies**: Task 10
**Deliverable**: Robust error handling per plan

**Steps**:
1. Add structured logging (Python logging module)
   - Log API calls, errors, warnings
   - Include timestamps, workspace IDs

2. Implement partial data indicators in report
3. Add timeout handling validation
4. Test error scenarios from plan:
   - Rate limiting
   - API timeout
   - Authentication failure

**Validation**:
- [ ] All error scenarios tested
- [ ] Logs contain sufficient debugging information
- [ ] Partial data reports clearly indicate missing workspaces

---

### Task 12: Performance Benchmarking [2 hours]
**Dependencies**: Task 11
**Deliverable**: Performance validation for 50 campaigns

**Steps**:
1. Create or identify test workspace with 50 campaigns
2. Run dashboard generation, measure time
3. Validate: < 30 seconds (per specification)
4. If > 30 seconds, profile and optimize:
   - Consider parallel workspace fetching
   - Optimize pandas aggregations

**Validation**:
- [ ] Performance requirement met (< 30 seconds for 50 campaigns)
- [ ] Benchmark documented in README.md

---

### Task 13: Documentation [2 hours]
**Dependencies**: Task 12
**Deliverable**: Comprehensive documentation

**Steps**:
1. Update README.md:
   - Installation instructions
   - Usage examples (per Article IV)
   - Error scenarios
   - Performance characteristics

2. Add docstrings to all public methods (if missing)
3. Create ARCHITECTURE.md documenting design decisions
4. Document test workspace setup for new team members

**Validation**:
- [ ] Documentation reviewed by stakeholder (Mitchell)
- [ ] New team member can set up and run (dry run with Aydan or Eli)
- [ ] Per Article IV: All public APIs documented with examples

---

### Task 14: Final Integration Testing [2 hours]
**Dependencies**: Task 13
**Deliverable**: Production-ready validation

**Steps**:
1. Run full test suite
2. Generate report against all production workspaces (manually review)
3. Validate accuracy against EmailBison dashboards (spot check 5 campaigns)
4. Confirm constitutional compliance:
   - [ ] Test coverage >= 80%
   - [ ] Integration tests using real MCP
   - [ ] Complexity < 10 all components
   - [ ] API documentation present

**Validation**:
- [ ] All tests passing
- [ ] Production report generated successfully
- [ ] Accuracy spot-check passed (within 0.1%)
- [ ] Constitutional compliance verified

---

### Task 15: Deployment & Handoff [1 hour]
**Dependencies**: Task 14
**Deliverable**: Feature deployed and documented

**Steps**:
1. Deploy to production environment
2. Schedule first automated report run
3. Document handoff:
   - How to run dashboard generation
   - Where reports are stored
   - How to troubleshoot errors

4. Training session with stakeholders (Mitchell, Aydan)

**Validation**:
- [ ] Feature deployed successfully
- [ ] First production report generated
- [ ] Stakeholders trained on usage

---

## Task Summary by Phase

| Phase | Tasks | Est. Time | Dependencies |
|-------|-------|-----------|--------------|
| 1: Data Fetching | 1-4 | 11 hours | Sequential |
| 2: Metrics Calculation | 5-7 | 9 hours | Can parallelize with Phase 1 (Tasks 5-7) |
| 3: Report Generation | 8-10 | 7 hours | Can parallelize with Phase 2 (Tasks 8-9) |
| 4: Polish | 11-15 | 10 hours | Sequential after Phase 3 |

**Total Estimated Time**: 37 hours (~ 5 days for 1 developer, ~3 days with 2 developers leveraging parallelization)

## Parallelization Opportunities

**Developer 1** (Critical Path):
- Tasks 1, 2, 3, 4 (Data fetching foundation)
- Tasks 10, 11, 12 (Integration and performance)
- Tasks 14, 15 (Final validation and deployment)

**Developer 2** (Parallel Work):
- Tasks 5, 6, 7 (Metrics calculation - can start after Task 1)
- Tasks 8, 9 (Report generation - can start after Task 1)
- Task 13 (Documentation - can start anytime after Task 9)

This parallelization reduces wall-clock time from ~5 days to ~3 days.
```

### Best Practices

✅ **Size tasks appropriately**: 2-4 hours each (completable in one sitting)
✅ **Test-first ordering**: Tests always precede implementation
✅ **Explicit dependencies**: No ambiguity about what blocks what
✅ **Validation criteria**: Clear definition of "done"

❌ **Don't create tasks > 8 hours**: Too large to track progress effectively
❌ **Don't skip validation steps**: Each task needs completion criteria
❌ **Don't guess at effort**: If uncertain, break task down further

---

## 7. /speckit.checklist

### Purpose
Generate quality validation checklists before deployment.

### When to Use
**Optional**. Use after implementation, before production deployment.

### What It Creates
No artifact. Outputs checklist validating:
- Specification requirements met
- Constitutional compliance
- Production readiness

### Example Invocation

```
/speckit.checklist

(AI generates deployment checklist from constitution, specification, plan, tasks)
```

### Example Output

```
## Production Deployment Checklist

### Specification Compliance

- [ ] All user stories implemented and tested
- [ ] Performance requirements met (< 30 seconds for 50 campaigns)
- [ ] Accuracy validated (within 0.1% of EmailBison dashboards)
- [ ] Edge cases handled (zero-send campaigns, paused campaigns, API errors)
- [ ] Success criteria achieved (report readable by non-technical stakeholders)

### Constitutional Compliance

- [ ] Test coverage >= 80% (Article I)
- [ ] Integration tests using real EmailBison MCP (Article II)
- [ ] Cyclomatic complexity < 10 for all components (Article III)
- [ ] All public APIs documented with examples (Article IV)
- [ ] Performance standards met where applicable (Article V)

### Code Quality

- [ ] All tests passing in CI/CD pipeline
- [ ] No linting errors
- [ ] Code reviewed by at least 1 other team member
- [ ] Documentation up to date (README, ARCHITECTURE)
- [ ] Dependency versions pinned in requirements.txt

### Production Readiness

- [ ] Error handling tested (API failures, timeouts, partial data)
- [ ] Logging configured (structured logs for debugging)
- [ ] Monitoring set up (dashboard generation success rate, execution time)
- [ ] Runbook created (how to troubleshoot common issues)
- [ ] Rollback plan documented (how to revert if issues arise)

### Stakeholder Validation

- [ ] Report format approved by marketing executives
- [ ] Accuracy spot-checked against EmailBison dashboards
- [ ] Training session completed with stakeholders
- [ ] Feedback incorporated from pilot run

### Security & Privacy

- [ ] No sensitive data logged (API keys, credentials)
- [ ] EmailBison MCP authentication secured
- [ ] Report storage access controlled

### Documentation

- [ ] Installation instructions tested by new team member
- [ ] Usage examples validated
- [ ] Troubleshooting guide created
- [ ] Architecture documented for future maintenance
```

### Best Practices

✅ **Use before production deployment**: Catches missed requirements
✅ **Involve stakeholders**: Have them validate checklist items
✅ **Document exceptions**: If any items skipped, document why

❌ **Don't skip items**: Every checkbox matters for production readiness
❌ **Don't deploy with failing items**: Fix or explicitly accept risk

---

## 8. /speckit.implement

### Purpose
Execute implementation tasks systematically.

### When to Use
Final command after tasks generated. Begins actual code implementation.

### What It Creates
- Working code matching specifications
- Tests validating functionality
- Documentation

### How It Works
AI processes tasks from `tasks.md` sequentially:
1. Reads task description and validation criteria
2. Implements solution
3. Runs tests
4. Validates completion criteria
5. Moves to next task

### Example Invocation

```
/speckit.implement

(AI reads tasks.md and implements each task sequentially)
```

### Implementation Process

```
For each task in tasks.md:
    1. Read task description and dependencies
    2. Verify dependencies completed
    3. Implement solution following plan
    4. Run validation checks
    5. Mark task complete if all checks pass
    6. If checks fail, iterate until passing
    7. Move to next task
```

### Best Practices

✅ **Let AI work systematically**: Trust the task breakdown
✅ **Review outputs after each phase**: Catch issues early
✅ **Intervene if stuck**: If AI struggles with task, clarify or break down further

❌ **Don't skip ahead**: Dependency violations cause integration issues
❌ **Don't change specification mid-implementation**: Update spec, regenerate plan/tasks
❌ **Don't bypass validation**: Each task's completion criteria must pass

---

## Command Comparison Table

| Command | Artifact Created | Optional? | Dependencies | Duration |
|---------|------------------|-----------|--------------|----------|
| `/speckit.constitution` | `constitution.md` | No | None | 15-30 min |
| `/speckit.specify` | `specification.md` | No | Constitution | 30-60 min |
| `/speckit.clarify` | None (questions) | Yes | Specification | 10-15 min |
| `/speckit.plan` | `plan.md` | No | Specification | 30-45 min |
| `/speckit.analyze` | None (validation) | Yes | Plan | 10-15 min |
| `/speckit.tasks` | `tasks.md` | No | Plan | 15-30 min |
| `/speckit.checklist` | None (checklist) | Yes | Implementation | 10-15 min |
| `/speckit.implement` | Working code | No | Tasks | Hours-Days |

---

## Workflow Tips

### For Small Features (< 1 day implementation)
```
/speckit.constitution (if new project)
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```
Skip: clarify, analyze, checklist (overhead > benefit)

### For Medium Features (1-3 days implementation)
```
/speckit.constitution
/speckit.specify
/speckit.clarify (if ambiguities exist)
/speckit.plan
/speckit.tasks
/speckit.implement
/speckit.checklist (before deployment)
```

### For Large Features (> 3 days implementation)
```
/speckit.constitution
/speckit.specify
/speckit.clarify
/speckit.plan
/speckit.analyze
/speckit.tasks
/speckit.implement
/speckit.checklist
```
Use all commands - the overhead pays off for complex work

---

## Next Steps

- [Review Methodology](02_Methodology.md) - Understand SDD principles
- [Check Agent Integration](04_Agent_Integration.md) - Configure your AI agent
- [Explore Templates](Templates/) - Use proven templates for consistency
- [Read Quick Start](01_Quick_Start.md) - Hands-on tutorial

## Resources

- **Official Repository**: [github/spec-kit](https://github.com/github/spec-kit)
- **Command Documentation**: [GitHub Spec-Kit README](https://github.com/github/spec-kit/blob/main/README.md)
