# Pipedream MCP Servers - Complete Guide

## Overview
This guide documents all your Pipedream-based MCP servers, their capabilities, and how to use them. All servers use SSE (Server-Sent Events) transport, making them fully compatible with Windows and Claude Code.

## 🎉 All Servers Connected (9/9)

### Core MCP Servers

#### 1. **bison_mcp** - EmailBison Integration
- **Transport:** SSE
- **URL:** https://lgemailbisonmcp25.up.railway.app/sse
- **Purpose:** Complete email campaign management platform
- **Capabilities:**
  - Campaign creation, management, and analytics
  - Lead management and tracking
  - Email sequence building
  - Sender account management
  - Workspace management
  - Blacklist management
  - Webhook configuration

#### 2. **context7** - Library Documentation
- **Transport:** HTTP
- **URL:** https://mcp.context7.com/mcp
- **Purpose:** Access up-to-date documentation for any programming library
- **Capabilities:**
  - Library documentation lookup
  - Code examples
  - API references
  - Version-specific documentation

#### 3. **jina** - Web Search & Content Tools
- **Transport:** SSE
- **URL:** https://mcp.jina.ai/sse
- **Purpose:** Comprehensive web interaction and semantic analysis
- **Capabilities:**
  - Web search (Google-like)
  - Academic search (arXiv)
  - Image search
  - URL content reading (web scraping)
  - Screenshot capture
  - Query expansion
  - Document reranking
  - String/image deduplication
  - Semantic similarity

#### 4. **fireflies** - Meeting Transcripts
- **Transport:** HTTP
- **URL:** https://api.fireflies.ai/mcp
- **Purpose:** Access and manage meeting transcripts
- **Capabilities:**
  - Retrieve meeting transcripts
  - Get meeting summaries
  - Search transcripts
  - Filter by participants/organizers
  - User account management

---

## Pipedream MCP Servers (5 Services)

All Pipedream servers share the same base URL pattern:
`https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/{service}`

### 5. **pipedream-google-drive** - Google Drive Integration

**URL:** https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/google_drive

**Available Actions:**
Based on the [Pipedream Google Drive Actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/google_drive/actions), this server provides:

- **File Management:**
  - Upload files to Google Drive
  - Download files from Google Drive
  - Delete files
  - Copy files
  - Move files between folders
  - Rename files

- **Folder Management:**
  - Create folders
  - List folder contents
  - Share folders
  - Get folder metadata

- **Permissions:**
  - Share files with users
  - Update file permissions
  - Remove permissions
  - List file permissions

- **Search & Discovery:**
  - Search for files
  - List recently modified files
  - Find files by query

- **Metadata:**
  - Get file metadata
  - Update file metadata
  - Add custom properties

**Common Use Cases:**
- Automated file backups
- Document generation and storage
- Report distribution
- Collaborative file management
- Content organization

---

### 6. **pipedream-google-docs** - Google Docs Integration

**URL:** https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/google_docs

**Available Actions:**
Based on the [Pipedream Google Docs Actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/google_docs/actions), this server provides:

- **Document Creation:**
  - Create new Google Docs
  - Create from templates

- **Document Editing:**
  - Append text to documents
  - Insert text at specific positions
  - Replace text using find/replace
  - Update document content

- **Document Reading:**
  - Get document content
  - Read document metadata
  - Find documents by title

- **Formatting:**
  - Apply text formatting (bold, italic, etc.)
  - Set paragraph styles
  - Insert tables
  - Add images

- **Collaboration:**
  - Share documents
  - Manage permissions
  - Get document activity

**Common Use Cases:**
- Automated report generation
- Template-based document creation
- Content updates and maintenance
- Meeting notes compilation
- Document archiving

---

### 7. **pipedream-github** - GitHub Integration

**URL:** https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/github

**Available Actions:**
Based on the [Pipedream GitHub Actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/github/actions), this server provides extensive GitHub operations:

- **Repository Management:**
  - Create repositories
  - List repositories
  - Get repository details
  - Update repository settings
  - Archive repositories
  - Fork repositories

- **Issues:**
  - Create issues
  - Update issues
  - Close issues
  - Add comments to issues
  - Add labels to issues
  - Assign users to issues
  - Search issues

- **Pull Requests:**
  - Create pull requests
  - Update pull requests
  - Merge pull requests
  - Review pull requests
  - Add comments to PRs
  - List pull requests
  - Get PR details

- **Branches:**
  - Create branches
  - Delete branches
  - List branches
  - Get branch protection rules

- **Commits:**
  - Get commit details
  - List commits
  - Compare commits
  - Create commit comments

- **Releases:**
  - Create releases
  - Update releases
  - List releases
  - Delete releases

- **Workflow Actions:**
  - Trigger workflow runs
  - Get workflow run status
  - Cancel workflow runs
  - List workflows

- **Gists:**
  - Create gists
  - Update gists
  - List gists

- **Organizations & Teams:**
  - List organization members
  - Manage team membership
  - Get organization details

**Common Use Cases:**
- Automated issue creation from bugs/reports
- PR automation and management
- Release management
- Repository maintenance
- CI/CD integration
- Code review automation

---

### 8. **pipedream-airtable** - Airtable Integration

**URL:** https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/Airtable

**Available Actions:**
Based on the [Pipedream Airtable Actions](https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable_oauth/actions), this server provides:

- **Record Operations:**
  - Create records
  - Update records
  - Delete records
  - Get record details
  - List records with filtering
  - Bulk create records
  - Bulk update records

- **Table Operations:**
  - List tables in a base
  - Get table schema
  - Get table metadata

- **Base Management:**
  - List bases
  - Get base details

- **Search & Filter:**
  - Search records by formula
  - Filter records by field values
  - Sort records
  - Paginate through large datasets

- **Views:**
  - Get records from specific views
  - List available views

- **Attachments:**
  - Upload attachments to records
  - Download attachments
  - Manage attachment fields

**Common Use Cases:**
- CRM data management
- Project tracking
- Content management
- Inventory management
- Form data processing
- Database synchronization
- Automated data entry

**Authentication:**
- Uses OAuth for secure authentication
- Token is pre-configured in your Pipedream connection

---

### 9. **pipedream-typefully** - Typefully Integration

**URL:** https://mcp.pipedream.net/ee48427e-5ca7-4697-8bb4-120083ea90e0/typefully

**Available Actions:**
Based on the [Pipedream Typefully Actions](https://github.com/PipedreamHQ/pipedream/blob/master/components/typefully/actions/schedule-draft/schedule-draft.mjs), this server provides:

- **Draft Management:**
  - Create new drafts
  - Schedule drafts for posting
  - Get scheduled drafts
  - Get published drafts
  - Update drafts
  - Delete drafts

- **Posting Features:**
  - Schedule tweets/threads
  - Set posting time
  - Enable auto-retweet
  - Enable auto-plug
  - Thread creation support

- **Draft Options:**
  - **`content`**: The tweet/thread content (use 4 newlines `\n\n\n\n` to separate tweets in a thread)
  - **`schedule_date`**: ISO date string for scheduling (e.g., "2024-12-25T10:00:00Z")
  - **`threadify`**: Automatically split content into tweets if it exceeds character limits
  - **`auto_retweet_enabled`**: Enable automatic retweet
  - **`auto_plug_enabled`**: Enable automatic plug

- **Content Retrieval:**
  - Get recently scheduled content
  - Get recently published content
  - View draft analytics

**Common Use Cases:**
- Automated tweet scheduling
- Thread management
- Social media content calendar
- Cross-platform posting
- Content planning and organization
- Analytics tracking

**Example Usage:**
```javascript
// Create and schedule a tweet thread
{
  "content": "First tweet in the thread\n\n\n\nSecond tweet\n\n\n\nThird tweet",
  "schedule_date": "2024-12-25T10:00:00Z",
  "threadify": true,
  "auto_retweet_enabled": true
}
```

---

## Authentication Status

All servers are pre-authenticated with your credentials:
- ✅ EmailBison API configured
- ✅ Fireflies API configured
- ✅ Pipedream connections authenticated for all 5 services:
  - Google Drive (OAuth)
  - Google Docs (OAuth)
  - GitHub (OAuth)
  - Airtable (OAuth)
  - Typefully (API Key)

---

## Quick Reference Commands

### List All Servers
```bash
claude mcp list
```

### Get Server Details
```bash
claude mcp get <server-name>
```

### Remove a Server
```bash
claude mcp remove <server-name> -s local
```

### Add New Pipedream Server
```bash
claude mcp add --transport sse <name> "<pipedream-url>" -s local
```

---

## Comparison: Pipedream vs Stdio Servers

### Why Pipedream Servers Work Better on Windows

| Feature | Pipedream (SSE/HTTP) | Stdio Servers |
|---------|---------------------|---------------|
| **Windows Compatibility** | ✅ Perfect | ❌ Poor |
| **Connection Reliability** | ✅ Excellent | ❌ Unreliable |
| **Setup Complexity** | ✅ Simple | ❌ Complex |
| **Process Management** | ✅ None needed | ❌ Must spawn processes |
| **Error Handling** | ✅ Standard HTTP | ❌ Pipe-based, fragile |
| **Authentication** | ✅ OAuth/API Keys | ❌ Environment variables |
| **Updates** | ✅ Automatic | ❌ Manual npm updates |

### Advantages of Pipedream Approach
1. **No Local Dependencies**: No need for Node.js, npx, or package management
2. **Centralized Auth**: OAuth tokens managed in Pipedream, not local env vars
3. **Platform Independent**: Same URL works on Windows, macOS, Linux
4. **Always Updated**: Pipedream maintains the latest API versions
5. **Better Error Messages**: Standard HTTP errors vs stdio failures
6. **No Process Spawning**: Browser-like connection vs managing child processes

---

## Common Workflows

### 1. Automated Report Generation
1. Use **jina** to gather web data
2. Use **pipedream-google-docs** to create a document
3. Use **pipedream-google-drive** to organize and share
4. Use **bison_mcp** to email the report to stakeholders

### 2. GitHub-to-Airtable Sync
1. Use **pipedream-github** to fetch issues/PRs
2. Use **pipedream-airtable** to create/update records
3. Track project status in Airtable
4. Automate issue creation from Airtable

### 3. Social Media Content Pipeline
1. Use **pipedream-google-docs** to draft content
2. Use **pipedream-typefully** to schedule posts
3. Use **fireflies** to gather meeting insights for content
4. Use **jina** to research trending topics

### 4. Meeting-to-Documentation Flow
1. Use **fireflies** to get meeting transcripts
2. Use **pipedream-google-docs** to create meeting notes
3. Use **pipedream-github** to create follow-up issues
4. Use **bison_mcp** to send action item emails

---

## Troubleshooting

### Server Not Connecting
```bash
# Check status
claude mcp list

# Get detailed info
claude mcp get <server-name>

# Remove and re-add
claude mcp remove <server-name> -s local
claude mcp add --transport sse <name> "<url>" -s local
```

### Authentication Issues
- All Pipedream authentications are managed at: https://pipedream.com
- If auth fails, reconnect the app in your Pipedream account
- The MCP endpoint URL contains your workspace ID for auth

### Rate Limits
- Pipedream: 10,000 invocations/month on free tier
- Individual services (Google, GitHub, etc.) have their own limits
- Monitor usage at https://pipedream.com/usage

---

## Resources

### Documentation Links
- **Google Drive Actions**: https://github.com/PipedreamHQ/pipedream/tree/master/components/google_drive/actions
- **Google Docs Actions**: https://github.com/PipedreamHQ/pipedream/tree/master/components/google_docs/actions
- **GitHub Actions**: https://github.com/PipedreamHQ/pipedream/tree/master/components/github/actions
- **Airtable Actions**: https://github.com/PipedreamHQ/pipedream/tree/master/components/airtable_oauth/actions
- **Typefully Actions**: https://github.com/PipedreamHQ/pipedream/blob/master/components/typefully/actions/schedule-draft/schedule-draft.mjs

### MCP Protocol
- Claude Code MCP Docs: https://docs.claude.com/en/docs/claude-code/mcp
- MCP Specification: https://spec.modelcontextprotocol.io

### Support
- Pipedream Community: https://pipedream.com/community
- Claude Code Issues: https://github.com/anthropics/claude-code/issues

---

## Summary

You now have **9 fully functional MCP servers**, all using reliable SSE/HTTP transports:
- 4 specialized services (EmailBison, Context7, Jina, Fireflies)
- 5 Pipedream integrations (Google Drive, Google Docs, GitHub, Airtable, Typefully)

This setup provides comprehensive automation capabilities across:
- 📧 Email marketing (EmailBison)
- 📚 Documentation (Context7)
- 🔍 Web search & content (Jina)
- 🎤 Meeting transcripts (Fireflies)
- 📁 File storage (Google Drive)
- 📝 Document creation (Google Docs)
- 💻 Code management (GitHub)
- 🗄️ Database operations (Airtable)
- 🐦 Social media scheduling (Typefully)

All servers are Windows-compatible, authenticated, and ready to use!
