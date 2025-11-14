# AI Agent Integration Guide

## Overview

Spec-Kit supports 13+ AI coding assistants through a unified command system. Each agent integrates via agent-specific configuration files generated during project initialization.

## Supported AI Agents

### ✅ Fully Supported

| Agent | Installation Type | Configuration Directory | Format |
|-------|------------------|-------------------------|--------|
| **Claude Code** | CLI | `.claude/commands/` | Markdown |
| **GitHub Copilot** | IDE | `.github/prompts/` | Markdown |
| **Gemini CLI** | CLI | `.gemini/commands/` | TOML |
| **Cursor** | IDE | `.cursor/commands/` | Markdown |
| **Qwen Code** | CLI | `.qwen/commands/` | TOML |
| **OpenCode** | CLI | `.opencode/command/` | Markdown |
| **Windsurf** | IDE | `.windsurf/workflows/` | Markdown |
| **Kilo Code** | IDE | `.kilocode/rules/` | Markdown |
| **Roo Code** | IDE | `.roo/rules/` | Markdown |
| **Codex CLI** | CLI | `.codex/commands/` | Markdown |
| **CodeBuddy CLI** | CLI | `.codebuddy/commands/` | Markdown |
| **Auggie CLI** | CLI | `.auggie/commands/` | Markdown |
| **Amp** | IDE | `.agents/commands/` | Markdown |

### ⚠️ Limited Support

**Amazon Q Developer CLI**: Doesn't fully support custom slash commands. Basic functionality available but workflow integration limited.

---

## Installation & Setup

### Step 1: Install Spec-Kit CLI

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Verify installation:
```bash
specify check
```

### Step 2: Initialize Project with Your Agent

#### For Claude Code (Our Primary Agent)

```bash
specify init my-project --ai claude
cd my-project
```

This creates:
```
my-project/
├── .claude/
│   └── commands/
│       ├── speckit-constitution.md
│       ├── speckit-specify.md
│       ├── speckit-clarify.md
│       ├── speckit-plan.md
│       ├── speckit-analyze.md
│       ├── speckit-tasks.md
│       ├── speckit-checklist.md
│       └── speckit-implement.md
├── .specify/
│   └── memory/
└── README.md
```

#### For Other Agents

```bash
# GitHub Copilot
specify init my-project --ai copilot

# Cursor
specify init my-project --ai cursor-agent

# Gemini
specify init my-project --ai gemini

# See full list
specify init --help
```

### Step 3: Verify Agent Integration

Open your AI agent (Claude Code, Cursor, etc.) and verify slash commands are available:

```
/speckit.constitution
/speckit.specify
/speckit.plan
/speckit.tasks
/speckit.implement
```

---

## Configuration Details

### Claude Code Configuration

**Directory**: `.claude/commands/`
**Format**: Markdown with embedded prompts
**Command Pattern**: `speckit-<action>.md`

**Example Command File** (`.claude/commands/speckit-constitution.md`):

```markdown
---
description: Establish governing principles for the project
---

# Establish Project Constitution

You are establishing the constitutional principles for this project using the Spec-Kit methodology.

## Your Task

Create a project constitution document that establishes immutable governing principles.
Save it to: `.specify/memory/constitution.md`

## Constitution Structure

The constitution should include 5-10 articles covering:

1. **Code Quality Standards**
   - Naming conventions
   - Code organization patterns
   - Documentation requirements
   - Complexity limits

2. **Testing Approach**
   - Test coverage requirements
   - Testing strategy (unit, integration, e2e)
   - Mock vs real service preferences

3. **UX Consistency**
   - Interface patterns
   - Error message standards
   - Performance expectations

4. **Performance Requirements**
   - Response time limits
   - Resource usage constraints

## Format

Each article should follow this structure:

```markdown
## Article I: [Principle Name]

[Clear statement of principle]

**Rationale**: [Why this principle matters]
**Enforcement**: [How compliance is validated]
```

## Examples

<examples>
[Example articles provided...]
</examples>

## Instructions

1. Ask the user about their project priorities
2. Draft 5-10 constitutional articles
3. Show the draft to the user for feedback
4. Refine based on feedback
5. Save final version to `.specify/memory/constitution.md`
6. Confirm completion with user

Begin by asking: "What are the most important principles for this project?"
```

### GitHub Copilot Configuration

**Directory**: `.github/prompts/`
**Format**: Markdown
**Usage**: Accessible via GitHub Copilot's prompt system

### Gemini CLI Configuration

**Directory**: `.gemini/commands/`
**Format**: TOML
**Command Pattern**: `speckit-<action>.toml`

**Example Command File**:

```toml
[command]
name = "speckit.constitution"
description = "Establish governing principles for the project"
script = """
{SCRIPT}
"""
arguments = "{{args}}"
```

### Cursor Configuration

**Directory**: `.cursor/commands/`
**Format**: Markdown
**Integration**: Works with Cursor's command palette

---

## Agent-Specific Features

### Claude Code Advantages

- **Plugin System**: Can extend with custom agents and skills
- **MCP Integration**: Native support for Model Context Protocol servers
- **Persistent Context**: `.claude/` directory maintains session context
- **Command Chaining**: Commands can invoke other commands

**Best For**: Complex workflows, MCP-heavy projects (like our EmailBison integrations)

### GitHub Copilot Advantages

- **IDE Integration**: Seamless integration with VS Code, Visual Studio, JetBrains
- **Inline Suggestions**: Real-time code completion
- **Chat Interface**: Conversational workflow

**Best For**: IDE-first development, rapid prototyping

### Cursor Advantages

- **AI-First IDE**: Built around AI assistance
- **Multi-File Editing**: AI can edit multiple files simultaneously
- **Built-in Terminal**: Integrated command execution

**Best For**: Full-stack development, rapid iteration

---

## Command Invocation Patterns

### CLI-Based Agents (Claude Code, Gemini, etc.)

Commands invoked via slash notation in agent interface:

```
/speckit.constitution
/speckit.specify
/speckit.plan
```

### IDE-Based Agents (Copilot, Cursor, etc.)

Commands accessed via:
- Command palette (Ctrl+Shift+P / Cmd+Shift+P)
- Chat interface with `@spec` mentions
- Slash commands in editor

---

## Customizing Commands

### Modifying Command Prompts

Edit command files directly in your agent's configuration directory.

**Example**: Customize constitution prompt for your team's standards

```bash
# Edit Claude Code command
code .claude/commands/speckit-constitution.md

# Add custom requirements:
## Team-Specific Requirements

- All code must follow PEP 8 (Python) or ESLint (JavaScript)
- Functions must not exceed 50 lines
- All database queries must use prepared statements (SQL injection prevention)
```

### Adding Custom Commands

Create new command files following agent-specific format:

**Claude Code Example** (`.claude/commands/custom-workflow.md`):

```markdown
---
description: Run custom workflow for campaign analysis
---

# Custom Campaign Analysis Workflow

This command orchestrates a multi-step campaign analysis workflow.

## Steps

1. Fetch campaign data via EmailBison MCP
2. Run statistical analysis using pandas
3. Generate Markdown report
4. Save to `05_Reports/[date]-campaign-analysis.md`

## Instructions

[Detailed instructions here...]
```

---

## Multi-Agent Workflows

### Using Multiple Agents Simultaneously

Spec-Kit projects can be accessed by multiple agents concurrently. Common pattern:

**Claude Code** (Backend, Data Processing):
- Implement Python scripts
- MCP server integration
- Data pipeline development

**Cursor** (Frontend, UI):
- React component development
- CSS styling
- Interactive features

**Shared Artifacts**:
- `.specify/memory/` (specifications, plans, tasks)
- Source code repositories
- Test suites

### Best Practices for Multi-Agent Projects

✅ **Single Source of Truth**: `.specify/memory/` contains the canonical specification
✅ **Agent Specialization**: Assign agents to their strength areas
✅ **Synchronization Points**: Review specifications together before implementation
✅ **Consistent Formatting**: Use shared linters and formatters

---

## Troubleshooting

### Commands Not Appearing

**Issue**: Slash commands not available in agent

**Solutions**:
1. Verify correct agent specified during `specify init`
2. Check command files exist in agent's directory:
   ```bash
   ls .claude/commands/  # For Claude Code
   ls .github/prompts/   # For GitHub Copilot
   ```
3. Restart AI agent to reload configuration
4. Verify agent supports custom commands (check [Supported Agents](#supported-ai-agents))

### Command Files Not Loading

**Issue**: Command files present but not loading

**Solutions**:
1. Check file format matches agent requirements (Markdown vs TOML)
2. Validate YAML frontmatter (for Markdown commands):
   ```markdown
   ---
   description: Command description
   ---
   ```
3. Check for syntax errors in command files
4. Review agent-specific documentation for configuration requirements

### Memory Directory Not Found

**Issue**: Commands can't find `.specify/memory/` directory

**Solutions**:
1. Verify project initialized with `specify init`
2. Check working directory is project root
3. Create directory manually if missing:
   ```bash
   mkdir -p .specify/memory
   ```

### Agent-Specific Issues

**Claude Code**:
- Ensure `.claude/` directory has correct permissions
- Verify MCP servers configured if commands use them

**GitHub Copilot**:
- Check Copilot subscription active
- Verify repository access permissions

**Cursor**:
- Ensure project folder opened in Cursor (not individual files)
- Check Cursor version supports custom commands

---

## Advanced Configuration

### Environment Variables

Set environment variables for Spec-Kit behavior:

```bash
# Override feature detection (for non-Git repos)
export SPECIFY_FEATURE="001-my-feature-name"

# GitHub authentication (for GitHub API access)
export GH_TOKEN="your_github_token"
export GITHUB_TOKEN="your_github_token"
```

### Agent-Specific Settings

#### Claude Code

**Configuration File**: `.claude/plugin.json` (if using Claude Code plugins)

```json
{
  "agents": [
    {
      "name": "speckit-constitution",
      "path": "commands/speckit-constitution.md",
      "description": "Establish project principles"
    }
  ]
}
```

#### Cursor

**Configuration File**: `.cursor/settings.json`

```json
{
  "cursor.commands.enabled": true,
  "cursor.commands.directory": ".cursor/commands"
}
```

---

## Integration Checklist

Use this checklist when setting up Spec-Kit with a new agent:

- [ ] Spec-Kit CLI installed (`specify check` passes)
- [ ] Project initialized with correct agent (`specify init --ai <agent>`)
- [ ] Command files present in agent's directory
- [ ] Agent can access slash commands
- [ ] `.specify/memory/` directory exists
- [ ] Test command: `/speckit.constitution` works
- [ ] Documentation reviewed for agent-specific features
- [ ] Team members have access to agent (licenses, etc.)

---

## Recommended Agent for LeadGrow

**Primary**: **Claude Code**

**Rationale**:
- ✅ MCP integration (EmailBison, Google Docs, Fireflies)
- ✅ Plugin system (we already have `.claude/` infrastructure)
- ✅ Persistent context management
- ✅ Command chaining for workflows
- ✅ Best for our Python-heavy automation scripts

**Secondary**: **Cursor** (for frontend/UI work if needed)

---

## Adding a New Agent to Spec-Kit

If your preferred agent isn't supported, you can add it:

### 1. Determine Agent's Command System

- CLI-based or IDE-based?
- What directory does it read commands from?
- What file format (Markdown, TOML, JSON)?
- How are commands invoked?

### 2. Create Command Files

Follow the pattern of existing agents:

```bash
mkdir -p .your-agent/commands/
# Copy and adapt from .claude/commands/ or .gemini/commands/
```

### 3. Test Command Invocation

Verify commands accessible in your agent.

### 4. Contribute Back

Consider submitting a PR to [github/spec-kit](https://github.com/github/spec-kit) to add official support!

---

## Next Steps

- [Try Quick Start](01_Quick_Start.md) - Hands-on tutorial with your agent
- [Review Workflow Commands](03_Workflow_Commands.md) - Detailed command reference
- [Explore Methodology](02_Methodology.md) - Understand SDD principles

## Resources

- **Official Repository**: [github/spec-kit](https://github.com/github/spec-kit)
- **Agent Documentation**: [AGENTS.md](https://github.com/github/spec-kit/blob/main/AGENTS.md)
- **Claude Code Documentation**: [Claude Code Docs](https://docs.claude.com/claude-code)
