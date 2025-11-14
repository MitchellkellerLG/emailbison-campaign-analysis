# Typefully MCP Server

## Purpose
Create and manage social media drafts on Typefully, enabling AI-powered content creation, scheduling, and publishing automation for Twitter/X and other social platforms.

## What It Does
The Typefully MCP server allows you to:
- **Create Drafts**: Write tweets and threads programmatically
- **Schedule Content**: Schedule posts for specific times or next free slot
- **Manage Drafts**: View scheduled and published content
- **Auto-Features**: Enable AutoRT and AutoPlug for content automation

## Installation Status
✅ **INSTALLED** - Configured in your Claude Code setup with API key

## Available Tools (3 Total)

### 1. create_draft
Create a new draft in Typefully with full control over scheduling and features.

**Parameters:**
- `content` (required): The draft content
  - Use **4 consecutive newlines** to split into multiple tweets for threads
  - Example: `"First tweet\n\n\n\nSecond tweet\n\n\n\nThird tweet"`
- `threadify` (optional): Auto-split content into multiple tweets
- `share` (optional): If true, response includes a share_url
- `schedule_date` (optional): ISO date (e.g., "2025-10-26T10:30:00Z") or "next-free-slot"
- `auto_retweet_enabled` (optional): Enable AutoRT for this post
- `auto_plug_enabled` (optional): Enable AutoPlug for this post

**Example:**
```
Create a Typefully draft with content "Just discovered an amazing MCP server for social media automation!

It integrates perfectly with Claude Code.

Check it out: https://typefully.com" and schedule it for next free slot
```

### 2. get_scheduled_drafts
Retrieve recently scheduled drafts from Typefully.

**Parameters:**
- `content_filter` (optional): Filter results
  - Options: `"tweets"` or `"threads"`
  - If not provided, returns all scheduled content

**Example:**
```
Show me all my scheduled thread drafts in Typefully
```

### 3. get_published_drafts
Retrieve recently published drafts from Typefully.

**Parameters:**
- `content_filter` (optional): Filter results
  - Options: `"tweets"` or `"threads"`
  - If not provided, returns all published content

**Example:**
```
Get all my published tweets from Typefully
```

## Setup Instructions

### Getting Your Typefully API Key

1. Go to https://typefully.com/
2. Sign in to your account
3. Navigate to **Settings** → **API & Integrations**
4. Generate a new API key
5. Copy the key (format: alphanumeric string)
6. Store it securely - treat it like a password!

### Installation Command
```bash
claude mcp add typefully -e TYPEFULLY_API_KEY=YOUR_API_KEY -- npx -y typefully-mcp-server
```

## Common Use Cases

### Example 1: Simple Tweet Draft
```
Create a Typefully draft: "Just shipped a new feature! 🚀 Our users are going to love this."
```

### Example 2: Thread with Scheduling
```
Create a thread in Typefully:

"Here's why MCP servers are revolutionary for AI workflows:

1. They provide standardized interfaces

2. Enable seamless tool integration

3. Work across multiple AI assistants

This changes everything for developers."

Schedule it for tomorrow at 9am EST
```

### Example 3: Next Free Slot
```
Draft a tweet "New blog post is live!" and schedule it for my next free slot in Typefully
```

### Example 4: With AutoRT
```
Create a Typefully draft "Product launch announcement 🎉" with AutoRT enabled and share URL
```

### Example 5: Check Scheduled Content
```
What tweets do I have scheduled in Typefully?
```

## Features Explained

### Thread Creation
- Use **4 newlines** (`\n\n\n\n`) between tweets to create a thread
- Or use `threadify: true` to let Typefully auto-split long content
- Each part becomes a separate tweet in the thread

### Scheduling Options
1. **Specific Date/Time**: ISO 8601 format
   - `"2025-10-26T14:30:00Z"` (UTC)
   - `"2025-10-26T09:30:00-05:00"` (EST with timezone)

2. **Next Free Slot**: `"next-free-slot"`
   - Typefully finds the next available time in your schedule
   - Respects your posting frequency preferences

### AutoRT (Auto Retweet)
- Automatically retweets your post after a set period
- Helps increase visibility and engagement
- Configure timing in Typefully settings

### AutoPlug
- Automatically adds a promotional tweet to your threads
- Usually links to your product, newsletter, or service
- Set up the plug content in Typefully settings

### Share URLs
- When `share: true`, you get a preview URL for the draft
- Share with team members for review before publishing
- Useful for approval workflows

## Workflow Examples

### Content Planning Workflow
```
1. "Create 5 tweet drafts about our new feature"
2. "Schedule them for next free slots in Typefully"
3. "Show me what's scheduled this week"
```

### Thread Writing Workflow
```
"Write a Twitter thread explaining MCP servers:



Define what they are



Explain the benefits



Show a code example



Call to action

Make it engaging and schedule for tomorrow 10am"
```

### Content Review Workflow
```
1. "Create a draft about our product launch with share URL enabled"
2. "Show me all my scheduled drafts"
3. [Review and edit in Typefully web UI]
```

## API Reference

This MCP server implements a subset of the Typefully API. For full API documentation, visit:
- https://support.typefully.com/en/articles/8718287-typefully-api

## Security Notes

- API key grants full access to your Typefully account
- Never share your API key publicly or commit to git
- Rotate keys periodically for security
- Monitor your scheduled content regularly

## Limitations

- API rate limits apply based on your Typefully plan
- Draft content length follows Twitter/X character limits
- Some features may require Typefully paid plans
- Scheduling respects your Typefully queue settings

## Troubleshooting

**"Failed to connect"** in `claude mcp list`:
- This is normal for stdio servers! They connect on-demand when used.

**API authentication errors**:
- Verify your API key is correct
- Check that your Typefully account is active
- Ensure you have API access (may require paid plan)

**Scheduling not working**:
- Verify date format is ISO 8601
- Check timezone in your date string
- Ensure you have scheduling enabled in Typefully

**Threads not splitting**:
- Use exactly 4 newlines (`\n\n\n\n`) between tweets
- Or enable `threadify: true` parameter
- Verify content length per tweet

## Integration Tips

### With Content Creation
```
1. Generate content with Claude
2. Automatically create Typefully drafts
3. Schedule based on optimal posting times
4. Review in Typefully before publishing
```

### With Analytics
```
1. Check published drafts
2. Analyze what performed well
3. Generate similar content
4. Schedule new drafts
```

### With Content Calendar
```
1. Plan content themes weekly
2. Create multiple drafts
3. Use "next-free-slot" for even distribution
4. Monitor scheduled queue
```

## Configuration
**Status**: ✅ Installed with environment variable `TYPEFULLY_API_KEY`
**Transport**: stdio (runs on-demand via npx)
**Package**: `typefully-mcp-server` from npm

## Links
- Typefully: https://typefully.com/
- API Documentation: https://support.typefully.com/en/articles/8718287-typefully-api
- GitHub: https://github.com/pascalporedda/typefully-mcp-server
