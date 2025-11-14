# MCP Servers Setup & Configuration Guide

## Overview
This document explains your Claude Code MCP (Model Context Protocol) server setup, including working servers, failed connections, and the reasons behind stdio server failures on Windows.

## Currently Connected Servers (6/9)

### ✅ Working Servers

1. **bison_mcp** - EmailBison Integration
   - Transport: SSE (Server-Sent Events)
   - URL: https://lgemailbisonmcp25.up.railway.app/sse
   - Purpose: Email campaign management, lead tracking, sender accounts
   - Status: Connected

2. **context7** - Library Documentation
   - Transport: HTTP
   - URL: https://mcp.context7.com/mcp
   - Purpose: Up-to-date documentation and code examples for any library
   - Status: Connected

3. **jina** - Web Search & Content Tools
   - Transport: SSE
   - URL: https://mcp.jina.ai/sse
   - Purpose: Web search, content reading, image search, semantic analysis
   - Status: Connected

4. **fireflies** - Meeting Transcripts
   - Transport: HTTP
   - URL: https://api.fireflies.ai/mcp
   - Purpose: Access meeting transcripts, summaries, and user data
   - Status: Connected

5. **pipedream-google-drive** - Google Drive Integration
   - Transport: SSE
   - URL: https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/google_drive
   - Purpose: Google Drive file operations and management
   - Status: Connected

6. **pipedream-google-docs** - Google Docs Integration
   - Transport: SSE
   - URL: https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/google_docs
   - Purpose: Google Docs creation, editing, and management
   - Status: Connected

### ❌ Failed Servers (Stdio Compatibility Issues)

1. **airtable**
   - Current Command: `wsl npx -y airtable-mcp-server`
   - Environment: AIRTABLE_API_KEY configured
   - Status: Failed to connect

2. **typefully**
   - Current Command: `wsl npx -y typefully-mcp-server`
   - Environment: TYPEFULLY_API_KEY configured
   - Status: Failed to connect

3. **github**
   - Current Command: `wsl docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server`
   - Environment: GITHUB_PERSONAL_ACCESS_TOKEN configured
   - Status: Failed to connect

## Why Stdio Servers Fail on Windows

### The Problem
Stdio-based MCP servers communicate through standard input/output pipes (stdin/stdout). On Windows, this type of communication has several challenges:

1. **Process Spawning Differences**: Windows handles process creation and pipe management differently than Unix-based systems
2. **Interactive Pipe Requirements**: Stdio servers need bidirectional, interactive communication channels
3. **MCP Protocol Handshake**: The initialization handshake via stdio often times out or fails on Windows
4. **Path Resolution**: Commands like `npx` need special wrappers (`cmd /c` or `wsl`) to execute properly

### Attempted Solutions
We tried multiple approaches:

1. **Direct npx execution** ❌
   ```
   npx -y airtable-mcp-server
   ```

2. **Windows cmd wrapper** ❌
   ```
   cmd /c npx -y airtable-mcp-server
   ```

3. **WSL (Windows Subsystem for Linux) wrapper** ❌
   ```
   wsl npx -y airtable-mcp-server
   ```

All approaches failed because Claude Code's stdio MCP implementation on Windows has fundamental compatibility limitations.

### Why SSE/HTTP Servers Work
The working servers (bison_mcp, context7, jina, fireflies, pipedream servers) all use SSE (Server-Sent Events) or HTTP protocols:

- **Network-based communication**: Uses standard HTTP requests/responses
- **Platform-independent**: Works identically on Windows, macOS, and Linux
- **No process management issues**: No need to spawn and manage local processes
- **Reliable connection handling**: Standard HTTP connection management

## Recommendations

### For Immediate Use
Continue using the 6 working MCP servers. They provide:
- Email campaign management (bison_mcp)
- Documentation lookup (context7)
- Web search and content tools (jina)
- Meeting transcripts (fireflies)
- Google Drive/Docs integration (pipedream)

### For Stdio Server Access
If you absolutely need Airtable, Typefully, or GitHub MCP functionality:

1. **Use Claude Desktop** (if available)
   - The standalone Claude Desktop app has better stdio MCP support on Windows
   - Configuration location: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Use WSL2 fully** (advanced)
   - Install Node.js directly inside WSL2 (not using Windows Node)
   - Run Claude Code from within WSL2 environment
   - Configure MCP servers using WSL-native paths

3. **Find HTTP/SSE alternatives**
   - Check if these services offer HTTP-based MCP servers
   - Look for Pipedream integrations (like you did for Google services)
   - Some services provide multiple transport options

4. **Use APIs directly**
   - For Airtable: Use their REST API directly
   - For GitHub: Use GitHub REST/GraphQL APIs
   - For Typefully: Use their API endpoints
   - This bypasses MCP entirely but still provides functionality

## Adding New MCP Servers

### For SSE/HTTP Servers (Recommended)
```bash
# SSE transport
claude mcp add --transport sse <server-name> "<url>" -s local

# HTTP transport
claude mcp add --transport http <server-name> "<url>" -s local
```

### For Stdio Servers (Windows - Limited Success)
```bash
# Try WSL wrapper
claude mcp add <server-name> "wsl npx -y <package-name>" -e KEY=value -s local

# Or cmd wrapper
claude mcp add <server-name> "cmd /c npx -y <package-name>" -e KEY=value -s local
```

## Useful Commands

```bash
# List all MCP servers with status
claude mcp list

# Get details about a specific server
claude mcp get <server-name>

# Remove a server
claude mcp remove <server-name> -s local

# View help
claude mcp --help
```

## Configuration Locations

- **User settings**: `C:\Users\mitch\.claude\settings.local.json`
- **Project config**: `.mcp.json` (if using project-scoped servers)
- **MCP server data**: Stored in Claude Code's internal configuration

## Conclusion

Your MCP setup is functional with 6/9 servers connected. The failed servers are all stdio-based and face Windows compatibility issues that are difficult to resolve within Claude Code. The working servers provide robust functionality through reliable SSE/HTTP transports, which are the recommended approach for Windows environments.

Focus on leveraging the working servers and consider Pipedream integrations or direct API access for services that only offer stdio MCP servers.
