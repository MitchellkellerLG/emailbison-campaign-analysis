# GitHub MCP Server (Official)

## Purpose
GitHub's official MCP Server connects AI tools directly to GitHub's platform, enabling comprehensive repository management, issue tracking, PR automation, CI/CD monitoring, and code analysis through natural language.

## What It Does
The GitHub MCP server provides:
- **Repository Operations**: Browse code, search files, analyze commits, manage branches
- **Issue & PR Management**: Create, update, triage issues and pull requests
- **CI/CD Intelligence**: Monitor Actions workflows, analyze build failures, manage releases
- **Code Security**: Review security findings, Dependabot alerts, code scanning
- **Team Collaboration**: Access discussions, manage notifications, analyze activity

## Installation Status
✅ **INSTALLED** - Configured with Docker transport and GitHub PAT

## Available Tools (100+)

The GitHub MCP server organizes its 100+ tools into **15 toolsets** that can be enabled/disabled:

### Default Toolsets (Enabled by Default)
1. **context** - Get current user info and GitHub context
2. **repos** - Repository management and operations
3. **issues** - GitHub Issues operations
4. **pull_requests** - Pull request management
5. **users** - User search and information

### Additional Toolsets (Enable as Needed)
6. **actions** - GitHub Actions workflows and CI/CD
7. **code_security** - Code scanning alerts and security
8. **dependabot** - Dependabot alerts and dependency management
9. **discussions** - GitHub Discussions
10. **gists** - Gist management
11. **labels** - Label operations
12. **notifications** - Notification management
13. **orgs** - Organization operations
14. **projects** - GitHub Projects (project boards)
15. **secret_protection** - Secret scanning alerts
16. **security_advisories** - Security advisory management
17. **stargazers** - Repository starring

## Key Tools by Category

### Context (4 tools)
- `get_me` - Get authenticated user profile
- `get_team_members` - List team members
- `get_teams` - Get user's teams

### Repositories (20+ tools)
- `search_repositories` - Search for repos
- `search_code` - Search code across GitHub
- `get_file_contents` - Read files from repos
- `create_or_update_file` - Write files to repos
- `push_files` - Push multiple files at once
- `create_branch` - Create new branches
- `list_commits` - List commit history
- `get_commit` - Get commit details with diffs
- `create_repository` - Create new repos
- `fork_repository` - Fork repositories
- And many more...

### Pipedream GitHub MCP Tools
**Note**: The `pipedream-github` MCP server uses a different tool naming convention. All tools are accessed via:
- `mcp__pipedream-github__github-{action-name}` format
- Each tool takes an `instruction` parameter with detailed natural language instructions
- Tools available include:
  - `github-get-current-user` - Retrieve authenticated user info
  - `github-get-repository` - Get repository information
  - `github-get-repository-content` - Read files from repos
  - `github-create-repository` - Create new repositories
  - `github-create-branch` - Create branches
  - `github-create-issue` - Create GitHub issues
  - `github-create-issue-comment` - Comment on issues
  - `github-update-issue` - Update issues
  - `github-create-pull-request` - Create PRs
  - `github-create-or-update-file-contents` - Create/update files
  - `github-list-commits` - List commit history
  - `github-get-commit` - Get commit details
  - `github-search-issues-and-pull-requests` - Search issues/PRs
  - And more (see Pipedream GitHub documentation)

### Issues (15+ tools)
- `list_issues` - List issues with filters
- `search_issues` - Search issues across repos
- `issue_read` - Get issue details, comments, sub-issues
- `issue_write` - Create or update issues
- `add_issue_comment` - Comment on issues
- `assign_copilot_to_issue` - Let Copilot work on issues
- `sub_issue_write` - Manage sub-issues
- `list_issue_types` - Get available issue types

### Pull Requests (15+ tools)
- `list_pull_requests` - List PRs with filters
- `search_pull_requests` - Search PRs
- `pull_request_read` - Get PR details, diffs, reviews
- `create_pull_request` - Open new PRs
- `update_pull_request` - Edit PRs
- `merge_pull_request` - Merge PRs
- `pull_request_review_write` - Create/submit reviews
- `request_copilot_review` - Request Copilot code review
- `add_comment_to_pending_review` - Add review comments
- `update_pull_request_branch` - Update PR branch

### GitHub Actions (15+ tools)
- `list_workflows` - List repository workflows
- `list_workflow_runs` - List workflow run history
- `get_workflow_run` - Get run details
- `run_workflow` - Trigger workflow runs
- `cancel_workflow_run` - Cancel running workflows
- `rerun_workflow_run` - Rerun workflows
- `rerun_failed_jobs` - Rerun only failed jobs
- `list_workflow_jobs` - List jobs in a run
- `get_job_logs` - Get job logs (with tail support)
- `list_workflow_run_artifacts` - List artifacts
- `download_workflow_run_artifact` - Download artifacts

### Code Security (2 tools)
- `list_code_scanning_alerts` - List code scanning alerts
- `get_code_scanning_alert` - Get alert details

### Notifications (5 tools)
- `list_notifications` - List your notifications
- `dismiss_notification` - Mark notifications as read/done
- `get_notification_details` - Get notification info
- `manage_notification_subscription` - Subscribe/unsubscribe
- `mark_all_notifications_read` - Mark all as read

## Setup Instructions

### Prerequisites
1. **Docker** installed and running
2. **GitHub Personal Access Token (PAT)**

### Creating a GitHub PAT

1. Go to https://github.com/settings/tokens/new
2. Configure your token:
   - **Note**: "Claude Code MCP Server"
   - **Expiration**: Choose duration (90 days recommended)
   - **Scopes** (Required):
     - ✅ `repo` - Full repository access
     - ✅ `read:packages` - Read packages (for Docker)
     - ✅ `read:org` - Read organization data
     - Optional: `workflow`, `gist`, `notifications`, etc.
3. Click "Generate token"
4. **Copy the token immediately** (starts with `ghp_`)
5. Store securely - you can't view it again!

### Installation Commands

**Using Docker (Recommended)**:
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

**With Toolset Configuration**:
```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN -e GITHUB_TOOLSETS="default,actions,code_security" -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN -e GITHUB_TOOLSETS ghcr.io/github/github-mcp-server
```

## Toolset Configuration

Control which features are available by setting toolsets:

### Option 1: Default Toolsets
No configuration needed - gets `context`, `repos`, `issues`, `pull_requests`, `users`

### Option 2: Specific Toolsets
```bash
-e GITHUB_TOOLSETS="context,repos,issues,pull_requests,actions,code_security"
```

### Option 3: All Toolsets
```bash
-e GITHUB_TOOLSETS="all"
```

### Recommended Configurations

**For Development**:
```
default,actions,code_security,notifications
```

**For Project Management**:
```
default,projects,discussions,notifications
```

**For Security Work**:
```
context,repos,code_security,dependabot,secret_protection,security_advisories
```

**For DevOps/CI**:
```
context,repos,actions,dependabot
```

## Common Use Cases

### Repository Management
```
1. "Search for Python repositories related to machine learning with over 1000 stars"
2. "Show me the contents of README.md from microsoft/vscode"
3. "List all branches in my repository user/repo"
4. "Get the latest 10 commits from the main branch"
```

### Issue Management
```
1. "List all open issues in owner/repo labeled 'bug'"
2. "Create an issue in my-repo titled 'Fix login bug' with description..."
3. "Add a comment to issue #42 saying 'Working on this now'"
4. "Search for issues mentioning 'authentication' across all my repos"
```

### Pull Request Workflow
```
1. "List all open pull requests in owner/repo"
2. "Create a PR from feature-branch to main with title 'Add new feature'"
3. "Get the diff for pull request #123"
4. "Add a review comment to PR #123 on file src/app.js at line 45"
5. "Merge pull request #123 using squash merge"
```

### CI/CD Monitoring
```
1. "List the last 10 workflow runs for my repository"
2. "Show me failed workflow runs from the last week"
3. "Get the logs for the failed job in run #456789"
4. "Rerun all failed jobs in workflow run #456789"
5. "Trigger the 'deploy.yml' workflow on the main branch"
```

### Code Search
```
1. "Search for 'API_KEY' in all my repositories"
2. "Find TypeScript files containing 'async function' in owner/repo"
3. "Search for TODO comments in Python files across organization org-name"
```

### Security Monitoring
```
1. "List all open Dependabot alerts for my repository"
2. "Show code scanning alerts with high severity"
3. "Get details for security advisory GHSA-xxxx-xxxx-xxxx"
4. "List secret scanning alerts in my organization"
```

### Project Automation
```
1. "List all projects in my organization"
2. "Get items from project #5"
3. "Add issue #123 to project #5"
4. "Update the Status field of project item #789 to 'In Progress'"
```

## Advanced Features

### Dynamic Toolset Discovery
Enable toolsets on-demand rather than loading all at startup:
```bash
-e GITHUB_DYNAMIC_TOOLSETS=1
```

### Read-Only Mode
Prevent any modifications (great for analysis/reporting):
```bash
-e GITHUB_READ_ONLY=1
```

### GitHub Enterprise
For GitHub Enterprise Server or Enterprise Cloud with data residency:
```bash
-e GITHUB_HOST=https://github.enterprise.com
```

### Pagination
Many list operations support pagination:
```
- page: Page number (starts at 1)
- perPage: Results per page (max 100)
```

Example: `"List issues in repo owner/repo, page 2, 50 per page"`

## Workflow Examples

### Bug Triage Workflow
```
1. List all new issues with label "bug"
2. For each issue:
   - Read issue details
   - Search code for related files
   - Add comment with findings
   - Update labels and assignee
```

### Release Management
```
1. List all merged PRs since last release
2. Generate changelog from PR titles
3. Create release notes
4. Tag and create GitHub release
```

### Code Review Automation
```
1. List open PRs assigned to me
2. For each PR:
   - Get diff and files changed
   - Review code patterns
   - Add review comments
   - Approve or request changes
```

### CI/CD Debugging
```
1. Find failed workflow runs
2. Get job logs for failures
3. Analyze error patterns
4. Create issues for unique failures
5. Rerun transient failures
```

## Security Best Practices

### Token Security
- ✅ Use environment variables, never hardcode
- ✅ Set minimum required scopes
- ✅ Use separate tokens for different projects
- ✅ Rotate tokens regularly (90-day expiration)
- ✅ Revoke tokens when no longer needed
- ❌ Never commit tokens to repositories
- ❌ Don't share tokens via insecure channels

### Access Control
- Use read-only mode when modifications aren't needed
- Enable only required toolsets
- Limit token scopes to necessary permissions
- Monitor token usage in GitHub settings

## Troubleshooting

**"Failed to connect"** in `claude mcp list`:
- Normal for Docker stdio servers - they connect on-demand

**Authentication errors**:
- Verify your PAT is correct and hasn't expired
- Check that required scopes are enabled
- Ensure Docker can pull `ghcr.io` images

**Rate limiting**:
- GitHub has API rate limits (5000/hour authenticated)
- Use pagination to reduce requests
- Cache responses when possible

**Docker issues**:
- Ensure Docker Desktop is running
- Check Docker permissions
- Try `docker logout ghcr.io` if pull fails

**Toolset not found**:
- Verify toolset name spelling
- Check that feature is available (some are remote-only)
- Use `all` to enable everything

## Remote vs Local

### Remote Server (Recommended for most)
- Hosted by GitHub at `https://api.githubcopilot.com/mcp/`
- No Docker needed
- OAuth support
- Always up-to-date
- Additional toolsets (Copilot, GitHub Docs Search)

### Local Server (Alternative Option)
- Runs via Docker locally
- Full control over versions
- Works offline (once image is pulled)
- Good for GitHub Enterprise

## Current Configuration

### ✅ Official Remote GitHub MCP Server (ACTIVE)

**Status**: ✅ Installed and Connected
**Transport**: HTTP
**Endpoint**: `https://api.githubcopilot.com/mcp`
**Authentication**: Bearer token via Authorization header
**Installation Date**: November 5, 2025
**Installation Command**:

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp -H "Authorization: Bearer YOUR_GITHUB_TOKEN"
```

**Advantages**:

- No Docker required
- Always up-to-date with latest features
- Hosted and maintained by GitHub
- Additional Copilot integration features
- OAuth support available

**Toolsets**: Full GitHub API access (all toolsets available remotely)

### Alternative: Local Docker Setup (NOT CURRENTLY INSTALLED)

**Status**: ❌ Not installed (available as alternative)
**Environment Variables**: `GITHUB_PERSONAL_ACCESS_TOKEN`
**Transport**: stdio via Docker
**Image**: `ghcr.io/github/github-mcp-server`
**Installation Command**:

```bash
claude mcp add github -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server
```

## Links
- Official Repo: https://github.com/github/github-mcp-server
- GitHub Docs: https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp
- PAT Creation: https://github.com/settings/tokens/new
- Docker Hub: https://github.com/github/github-mcp-server/pkgs/container/github-mcp-server
