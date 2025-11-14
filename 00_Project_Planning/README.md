# Project Planning Documentation

## Overview

This directory contains comprehensive project planning resources and methodologies for the LeadGrow team. It serves as the central knowledge base for structured, specification-driven development across all projects.

## Purpose

The Project Planning system enables:
- **Structured Development**: Follow proven methodologies for building features from specification to implementation
- **Knowledge Persistence**: Maintain specifications, plans, and decisions across projects
- **Team Alignment**: Ensure all team members follow consistent planning approaches
- **AI-Assisted Development**: Leverage Spec-Kit for systematic AI agent collaboration

## Directory Structure

```
00_Project_Planning/
├── README.md (this file)
├── Spec-Kit-Reference/ (Complete GitHub Spec-Kit documentation)
│   ├── 01_Quick_Start.md
│   ├── 02_Methodology.md
│   ├── 03_Workflow_Commands.md
│   ├── 04_Agent_Integration.md
│   ├── 05_Code_Of_Conduct.md
│   └── Templates/
│       ├── constitution-template.md
│       ├── specification-template.md
│       ├── plan-template.md
│       ├── tasks-template.md
│       └── checklist-template.md
└── Active_Projects/ (Current project planning artifacts)
```

## When to Use Spec-Kit

### ✅ Use Spec-Kit For:

1. **New Feature Development** (0-to-1)
   - Building new campaign automation workflows
   - Creating new MCP integrations
   - Developing client-facing tools

2. **Major Refactors**
   - Restructuring report generation systems
   - Modernizing legacy Python scripts
   - Architectural changes to .claude/ plugins

3. **Complex Features with Ambiguity**
   - Multi-step workflows requiring clarification
   - Features with multiple stakeholder requirements
   - Projects with unclear technical approaches

4. **Team Collaboration Projects**
   - Projects involving multiple team members
   - Features requiring code review and iteration
   - Systems that need documentation for handoff

### ❌ Don't Use Spec-Kit For:

1. **Quick Fixes** - Bug fixes, typos, minor tweaks
2. **Well-Understood Tasks** - Routine work with clear implementation
3. **Urgent Hotfixes** - Critical issues requiring immediate resolution
4. **Exploratory Prototypes** - Initial experiments and proof-of-concepts

## Quick Start

### For New Projects:

1. Navigate to [Spec-Kit-Reference/01_Quick_Start.md](Spec-Kit-Reference/01_Quick_Start.md)
2. Run `/speckit.constitution` to establish project principles
3. Run `/speckit.specify` to create specifications
4. Follow the six-step workflow

### For Existing Projects:

1. Create a folder in `Active_Projects/` named: `YYYY-MM-DD-project-name`
2. Copy templates from `Spec-Kit-Reference/Templates/`
3. Begin with constitution, then specification

## Spec-Kit Workflow (Quick Reference)

```
1. /speckit.constitution → Establish principles
2. /speckit.specify     → Define requirements
3. /speckit.clarify     → (Optional) Resolve ambiguities
4. /speckit.plan        → Create technical blueprint
5. /speckit.analyze     → (Optional) Validate consistency
6. /speckit.tasks       → Generate task breakdown
7. /speckit.implement   → Execute implementation
```

## Best Practices

### 1. Start with Constitution
Every significant project should begin by establishing governing principles. This prevents scope creep and ensures consistency.

### 2. Focus on "What" Not "How"
Specifications should describe user needs and business requirements, not technical implementation details.

### 3. Use Templates Consistently
The templates in `Spec-Kit-Reference/Templates/` provide proven structure. Don't skip sections.

### 4. Document Decisions
Use the planning artifacts to record WHY decisions were made, not just WHAT was decided.

### 5. Iterate Specifications
Specifications aren't written once. Refine them as you learn more during planning and implementation.

## Integration with Our Workflow

### Relationship to Other Directories

- **01_Documentation/**: High-level project documentation (separate from planning)
- **02_Configuration/**: Technical configurations (implementations of plans)
- **03_Scripts/**: Code artifacts (generated from specs)
- **04_Prompts/**: AI prompts (can reference specifications)
- **00_Project_Planning/**: Planning artifacts (specifications, plans, constitutions)

### When Planning Becomes Implementation

Once planning is complete:
1. Specifications live in `00_Project_Planning/Active_Projects/`
2. Implementations live in their respective directories (scripts, configs, etc.)
3. The specification remains the source of truth

## Team Usage

### For Engineers (Read Access)
- Reference Spec-Kit methodology for understanding project structure
- Review specifications before implementing features
- Follow established patterns in constitution documents

### For Project Leads (Write Access)
- Create new project folders in `Active_Projects/`
- Write and refine specifications
- Maintain constitutional principles

### For Stakeholders
- Review specifications for accuracy and completeness
- Provide feedback during clarification phase
- Validate that implementations match specifications

## Learn More

- [Spec-Kit Methodology](Spec-Kit-Reference/02_Methodology.md) - Deep dive into specification-driven development
- [Workflow Commands](Spec-Kit-Reference/03_Workflow_Commands.md) - Complete command reference
- [GitHub Spec-Kit Repository](https://github.com/github/spec-kit) - Official source

## Questions?

For questions about:
- **Spec-Kit usage**: See [Quick Start Guide](Spec-Kit-Reference/01_Quick_Start.md)
- **Our implementation**: Check 01_Documentation/ or ask Mitchell
- **Contributing**: See CONTRIBUTING.md (when GitHub repo is live)

---

**Last Updated**: 2025-11-09
**Maintained By**: Mitchell Keller
**Status**: Active Development
