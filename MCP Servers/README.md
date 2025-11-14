# MCP Servers Documentation

Complete reference for all installed Model Context Protocol (MCP) servers in your Claude Code environment.

## Quick Status

| MCP Server | Status | Type | Purpose |
|------------|--------|------|---------|
| [Jina AI](Jina-AI.md) | ✅ Installed | Remote (SSE) | Web scraping, search, content extraction |
| [EmailBison](EmailBison.md) | ✅ Installed | Remote (SSE) | Email campaign automation |
| [Context7](Context7.md) | ✅ Installed | Remote (HTTP) | Up-to-date library documentation |
| [Fireflies](Fireflies.md) | ✅ Installed | Remote (HTTP) | Meeting transcripts and insights |
| [Airtable](Airtable.md) | ✅ Installed | Local (stdio) | Database management |
| [Typefully](Typefully.md) | ✅ Installed | Local (stdio) | Social media draft management |
| [GitHub](GitHub.md) | ✅ Installed | Local (Docker) | Repository and workflow automation |

## What Are MCP Servers?

Model Context Protocol (MCP) servers extend Claude's capabilities by providing:
- **Tools**: Actions Claude can perform (search web, create issues, etc.)
- **Resources**: Data Claude can access (files, databases, APIs)
- **Prompts**: Pre-configured instructions for common tasks

## How to Use

Simply talk to Claude naturally! For example:

```
"Search for articles about MCP servers using Jina AI"
"Create a new issue in my GitHub repository"
"Draft a Twitter thread in Typefully about our product launch"
"List all records in my Airtable base"
```

Claude will automatically use the appropriate MCP server to fulfill your request.

## Server Categories

### Web & Research
- **[Jina AI](Jina-AI.md)**: Web scraping, search (web/academic/images), screenshots
- **[Context7](Context7.md)**: Library documentation lookup

### Communication & Productivity
- **[EmailBison](EmailBison.md)**: Email campaigns, sequences, lead management
- **[Fireflies](Fireflies.md)**: Meeting transcripts and analysis
- **[Typefully](Typefully.md)**: Social media content creation

### Data & Development
- **[Airtable](Airtable.md)**: Database operations (read/write)
- **[GitHub](GitHub.md)**: Repository management, CI/CD, issues, PRs

## Transport Types

### Remote Servers (HTTP/SSE)
- Always connected
- Hosted externally
- Show as "✓ Connected" in `claude mcp list`
- Examples: Jina AI, EmailBison, Context7, Fireflies

### Local Servers (stdio/Docker)
- Connect on-demand when used
- Run locally
- Show as "✗ Failed to connect" (this is normal!)
- Examples: Airtable, Typefully, GitHub

## Checking Server Status

```bash
claude mcp list
```

Note: Local servers showing "Failed to connect" is **normal** - they activate when needed.

## Managing Servers

### View All Servers
```bash
claude mcp list
```

### Remove a Server
```bash
claude mcp remove server-name
```

### Update Environment Variables
Remove and re-add the server with new configuration.

## Common Workflows

### Research Workflow
1. Use **Jina AI** to search and scrape web content
2. Use **Context7** to get up-to-date library docs
3. Use **GitHub** to create issues or update code

### Content Creation Workflow
1. Draft social media content with Claude
2. Use **Typefully** to schedule posts
3. Track campaigns with **EmailBison**

### Project Management Workflow
1. Use **GitHub** to list issues and PRs
2. Use **Airtable** to track in project database
3. Use **Fireflies** to review meeting decisions

### Lead Generation Workflow
1. Use **Jina AI** to research prospects
2. Use **Airtable** to store lead data
3. Use **EmailBison** to run outreach campaigns

## Security Notes

All MCP servers use secure authentication:
- **API Keys**: Stored as environment variables (never in code)
- **OAuth**: For Google services (when set up)
- **PATs**: For GitHub (Personal Access Tokens)

### Best Practices
- ✅ Rotate API keys regularly
- ✅ Use minimum required permissions
- ✅ Never commit credentials to git
- ✅ Monitor server usage
- ❌ Don't share API keys
- ❌ Don't use personal tokens for shared projects

## Cost Summary

| Server | Cost | Notes |
|--------|------|-------|
| Jina AI | **Free** | Basic usage free, paid tiers for high volume |
| EmailBison | **Paid** | Based on subscription plan |
| Context7 | **Free** | With API key = higher limits + private repos |
| Fireflies | **Paid** | Based on subscription plan |
| Airtable | **Freemium** | Free tier available, paid for advanced features |
| Typefully | **Freemium** | Free tier available, API may require paid |
| GitHub | **Free** | With GitHub account (rate limits apply) |

## Troubleshooting

### Server Won't Connect
1. Check if it's a local server (normal to show "Failed")
2. Verify environment variables are set
3. Check API key is valid and not expired
4. Ensure Docker is running (for GitHub)

### Rate Limiting
- Each service has its own rate limits
- Spread out requests when possible
- Consider upgrading to paid tiers for higher limits

### Authentication Errors
- Verify API keys are correct
- Check token hasn't expired
- Ensure proper scopes/permissions are granted

## Getting Help

### Documentation
Each server has detailed documentation:
- Click server name in table above
- Check "Setup" and "Troubleshooting" sections
- Review "Common Use Cases" for examples

### Testing Servers
Try simple commands to verify each server:
- **Jina**: "Search the web for MCP servers"
- **GitHub**: "List my repositories"
- **Airtable**: "List my Airtable bases"
- **Typefully**: "Get my scheduled drafts"

### Support Resources
- Claude Code Docs: https://docs.claude.com/claude-code
- GitHub Issues: Report bugs to individual server repos
- MCP Protocol: https://modelcontextprotocol.io/

## Adding New Servers

To add a new MCP server:

1. Find the server (npm, GitHub, etc.)
2. Get required credentials (API keys, tokens)
3. Install using `claude mcp add`:
   ```bash
   claude mcp add server-name -e API_KEY=value -- command args
   ```
4. Document it in this folder!

## Future Servers

Servers we may add in the future:
- ~~Google Docs~~ (Requires Google Cloud setup)
- ~~Google Drive~~ (Requires Google Cloud setup)
- Notion MCP
- Slack MCP
- Linear MCP

## Documentation Updates

This documentation was last updated: **October 26, 2025**

When adding new servers:
1. Create a new `Server-Name.md` file
2. Update this README with the new server
3. Include setup instructions and use cases
4. Add to the Quick Status table

---

**Happy building with MCP servers! 🚀**

For questions or issues, consult individual server documentation or the official MCP documentation at https://modelcontextprotocol.io/
