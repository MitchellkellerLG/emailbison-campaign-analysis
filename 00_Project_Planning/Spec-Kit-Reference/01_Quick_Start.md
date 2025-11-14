# Spec-Kit Quick Start Guide

## What is Spec-Kit?

Spec-Kit is an open-source toolkit that enables **specification-driven development**. Instead of jumping directly to code, you create detailed specifications that guide AI agents through structured, systematic implementation.

**Core Philosophy**: Specifications become executable, directly generating working implementations rather than just guiding them.

## Installation

### Prerequisites

- **uv** package manager: [Install uv](https://docs.astral.sh/uv/)
- **Python 3.11+**
- **Git**
- **AI Coding Agent**: Claude Code, Cursor, GitHub Copilot, or [other supported agents](04_Agent_Integration.md)

### Option 1: Persistent Installation (Recommended)

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Verify installation:
```bash
specify check
```

To upgrade later:
```bash
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

### Option 2: One-Time Usage

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

## Initializing a New Project

### Start a New Project

```bash
specify init my-feature-name
cd my-feature-name
```

This creates:
```
my-feature-name/
├── .specify/
│   ├── memory/
│   │   └── (planning artifacts will go here)
│   └── agents/
│       └── (agent-specific command files)
├── features/
│   └── 001-my-feature-name/
└── README.md
```

### Initialize in Existing Directory

```bash
cd existing-project
specify init . --here
```

Or for specific AI agent:
```bash
specify init my-project --ai claude
```

## The Six-Step Workflow

### Step 1: Establish Principles

```bash
/speckit.constitution
```

**Purpose**: Create governing principles for your project
- Code quality standards
- Testing approach
- UX consistency guidelines
- Performance requirements

**Output**: `.specify/memory/constitution.md`

**Example prompt**:
> "This project prioritizes maintainability and test coverage. All features must include unit tests before implementation. We value simple, readable code over clever optimizations."

### Step 2: Define Requirements

```bash
/speckit.specify
```

**Purpose**: Describe WHAT you're building (not HOW)
- User stories and scenarios
- Business requirements
- Success criteria
- Constraints and limitations

**Output**: `.specify/memory/specification.md`

**Focus on**:
- User needs (not technical details)
- Problem being solved
- Expected outcomes
- Edge cases and error scenarios

**Example prompt**:
> "Users need to extract campaign performance data from EmailBison and generate executive summaries. The system should handle multiple workspaces and aggregate metrics across campaigns."

### Step 3: Clarify Ambiguities (Optional)

```bash
/speckit.clarify
```

**Purpose**: Identify underspecified areas before planning
- Surfaces unclear requirements
- Highlights missing decisions
- Prevents implementation assumptions

**Use when**:
- Specifications feel incomplete
- Multiple technical approaches possible
- Stakeholder alignment needed

### Step 4: Create Technical Plan

```bash
/speckit.plan
```

**Purpose**: Define tech stack and architecture
- Technology choices with rationale
- Data models and APIs
- Implementation approach
- Integration points

**Output**: `.specify/memory/plan.md`

**Example questions answered**:
- Which MCP servers are needed?
- What data structures will be used?
- How will errors be handled?
- What external dependencies exist?

### Step 5: Validate Plan (Optional)

```bash
/speckit.analyze
```

**Purpose**: Cross-artifact consistency validation
- Checks plan matches specification
- Identifies coverage gaps
- Ensures constitutional compliance

**Use before**: Starting implementation

### Step 6: Generate Tasks

```bash
/speckit.tasks
```

**Purpose**: Break plan into actionable tasks
- Identifies discrete work items
- Highlights parallelizable tasks
- Creates clear dependencies

**Output**: `.specify/memory/tasks.md`

### Step 7: Implement

```bash
/speckit.implement
```

**Purpose**: Execute tasks systematically
- Builds feature according to plan
- Generates working code
- Includes tests (per constitution)

## Command Summary

| Command | Purpose | When to Use | Output File |
|---------|---------|-------------|-------------|
| `/speckit.constitution` | Establish principles | Start of project | `constitution.md` |
| `/speckit.specify` | Define requirements | After constitution | `specification.md` |
| `/speckit.clarify` | Resolve ambiguities | Before planning (optional) | N/A |
| `/speckit.plan` | Technical blueprint | After specification | `plan.md` |
| `/speckit.analyze` | Validate consistency | Before implementation (optional) | N/A |
| `/speckit.tasks` | Task breakdown | After planning | `tasks.md` |
| `/speckit.checklist` | Quality validation | Before deployment (optional) | N/A |
| `/speckit.implement` | Execute tasks | Final step | Working code |

## Quick Tips

### 1. Don't Skip Constitution
Establishing principles first prevents scope creep and inconsistencies later.

### 2. Specifications Before Tech Stack
Describe the problem before choosing solutions. Let requirements drive technology choices.

### 3. Use Clarify Liberally
Better to ask questions before planning than discover ambiguities during implementation.

### 4. Keep Specifications Technology-Agnostic
Specifications should be implementable in multiple tech stacks. Plans specify the tech.

### 5. Plans Should Reference Constitution
Every technical decision in the plan should trace back to constitutional principles.

### 6. Tasks Should Be Discrete
If a task takes more than 4 hours, break it down further.

## Example Workflow Session

```bash
# Initialize project
specify init campaign-summary-generator --ai claude

# Step 1: Establish principles
/speckit.constitution
> "This system prioritizes data accuracy over speed. All metrics must be verified against source data. Test coverage required for all calculation logic."

# Step 2: Define requirements
/speckit.specify
> "Generate executive summaries from EmailBison campaign data across multiple workspaces. Include key metrics: open rates, reply rates, interested leads, and conversions."

# Step 3: Clarify (AI identifies ambiguities)
/speckit.clarify
> Questions: "How should we handle campaigns with zero sends? What time range for historical data? Should we compare against benchmarks?"

# Answer clarifications in specification

# Step 4: Plan implementation
/speckit.plan
> Creates technical plan: Use EmailBison MCP, Python for calculations, Markdown output, data validation layer

# Step 5: Generate tasks
/speckit.tasks
> Task 1: Set up EmailBison MCP connection
> Task 2: Implement data extraction functions
> Task 3: Create calculation engine with tests
> Task 4: Build Markdown formatter
> Task 5: Add error handling

# Step 6: Implement
/speckit.implement
> Executes tasks sequentially, generating code
```

## Common Mistakes to Avoid

### ❌ Skipping Steps
Every step builds on previous artifacts. Skipping creates gaps.

### ❌ Technical Details in Specifications
Specifications describe WHAT, not HOW. Save tech choices for planning.

### ❌ Implementation Without Clarification
Unclear requirements lead to wasted implementation time.

### ❌ Ignoring Constitution
Constitutional violations during implementation undermine project principles.

### ❌ Vague Success Criteria
Specifications need measurable outcomes to validate implementations.

## When NOT to Use Spec-Kit

Spec-Kit adds overhead. Skip it for:

- **Bug fixes** (well-defined problems)
- **Trivial changes** (typo corrections, config tweaks)
- **Urgent hotfixes** (time-critical issues)
- **Quick experiments** (throwaway prototypes)

**Rule of thumb**: If the work takes less time than creating a specification, skip Spec-Kit.

## Next Steps

- [Read the Complete Methodology](02_Methodology.md) - Deep dive into specification-driven development
- [Explore Workflow Commands](03_Workflow_Commands.md) - Detailed command reference
- [Review Templates](Templates/) - Use proven templates for consistency
- [Check Agent Integration](04_Agent_Integration.md) - Configure your AI agent

## Resources

- **Official Repository**: [github/spec-kit](https://github.com/github/spec-kit)
- **Video Overview**: [Spec-Kit Introduction](https://www.youtube.com/watch?v=a9eR1xsfvHg)
- **Methodology Guide**: [spec-driven.md](https://github.com/github/spec-kit/blob/main/spec-driven.md)

---

**Questions?** Check [04_Agent_Integration.md](04_Agent_Integration.md) for AI agent setup or [03_Workflow_Commands.md](03_Workflow_Commands.md) for command details.
