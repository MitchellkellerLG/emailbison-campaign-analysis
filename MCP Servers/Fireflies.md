# Fireflies.ai MCP Server

## Purpose
Access and analyze meeting transcripts and insights through Fireflies.ai's meeting intelligence platform.

## What It Does
Fireflies.ai MCP provides tools for:
- **Meeting Transcripts**: Access transcribed meetings from various platforms
- **Meeting Insights**: Extract key insights, action items, and summaries
- **Search & Analysis**: Search across meeting content and conversations
- **Meeting Intelligence**: Analyze meeting patterns and participant engagement
- **Integration Access**: Connect with meetings from Zoom, Google Meet, Microsoft Teams, and more

## Key Features
- Automatic meeting transcription
- AI-powered meeting summaries
- Action item extraction
- Speaker identification and tracking
- Searchable meeting database
- Multi-platform integration support
- Meeting analytics and insights

## Common Use Cases
- Reviewing meeting transcripts and summaries
- Extracting action items from meetings
- Searching for specific topics across meetings
- Analyzing meeting patterns and engagement
- Generating meeting reports
- Following up on discussions and decisions
- Knowledge management from meetings

## Setup

### MCP Configuration
Add to your Claude Code MCP settings:

```json
{
  "mcpServers": {
    "fireflies": {
      "transport": "http",
      "url": "https://api.fireflies.ai/mcp"
    }
  }
}
```

### API Key
API Key: `1c1c9fdd-ab54-4f59-ac2a-bbf614aa7299`

Store this in your environment variables or Claude Code MCP configuration as required.

## Integration
Fireflies.ai integrates with:
- Zoom
- Google Meet
- Microsoft Teams
- Webex
- Slack
- And other meeting platforms

## Cost
Paid service - pricing based on Fireflies.ai subscription plan. Check [fireflies.ai](https://fireflies.ai) for current pricing.

## Documentation
For more information, visit [Fireflies.ai Documentation](https://fireflies.ai/blog)
