# Context7 MCP Server

## Purpose
Provide up-to-date, version-specific documentation and code examples for popular libraries and frameworks directly into LLM prompts.

## What It Does
Context7 MCP pulls documentation and code examples straight from the source (GitHub) and places them directly into your AI assistant's context. This eliminates:
- ❌ Outdated code examples based on old training data
- ❌ Hallucinated APIs that don't exist
- ❌ Generic answers for old package versions

## Key Features
- **Version-Specific Documentation**: Get docs for exact library versions
- **Real Code Examples**: Pulls actual working code from repositories
- **Zero Setup**: Works immediately with optional API key for higher limits
- **Community-Driven**: 1000+ libraries available, community-contributed
- **Auto-Updates**: Documentation synced directly with GitHub
- **Multi-Platform**: Works with Cursor, Claude Code, VS Code, Windsurf, and 20+ other editors

## How to Use

### Basic Usage in Prompts
Simply add `use context7` to your prompt:

```
Create a Next.js middleware that checks for a valid JWT in cookies. use context7
```

```
Configure a Cloudflare Worker script to cache JSON API responses. use context7
```

### Using Specific Libraries
If you know the exact library ID, include it in your prompt:

```
Implement basic authentication with Supabase. use library /supabase/supabase for API and docs.
```

### Available MCP Tools

Context7 provides two main tools that you can interact with:

#### 1. `resolve-library-id`
Resolves a general library name into a Context7-compatible library ID.

**Parameters:**
- `libraryName` (required): The name of the library to search for

**Example:**
```
Use the resolve-library-id tool to find "next.js"
```

**Returns:**
A Context7-compatible library ID like `/vercel/next.js` or `/vercel/next.js/v14.3.0-canary.87`

#### 2. `get-library-docs`
Fetches documentation for a library using a Context7-compatible library ID.

**Parameters:**
- `context7CompatibleLibraryID` (required): Exact library ID (e.g., `/mongodb/docs`, `/vercel/next.js`)
- `topic` (optional): Focus docs on a specific topic (e.g., "routing", "hooks", "authentication")
- `tokens` (optional, default 5000): Max tokens to return (minimum 1000)

**Example:**
```
Use get-library-docs with library ID /vercel/next.js and topic "routing"
```

## Workflow Example

When you ask an AI assistant to help with a library:

1. **You ask**: "How do I set up authentication with Supabase?"
2. **AI calls**: `resolve-library-id` with libraryName: "supabase"
3. **Context7 returns**: Library ID `/supabase/supabase`
4. **AI calls**: `get-library-docs` with context7CompatibleLibraryID: `/supabase/supabase` and topic: "authentication"
5. **Context7 returns**: Up-to-date authentication docs and code examples
6. **AI responds**: With accurate, current implementation guidance

## Setup for Claude Code

### Remote Server Connection (Recommended)
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: YOUR_API_KEY"
```

### Local Server Connection
```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

### Without API Key (Basic Usage)
```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

## API Key

- **Free Tier**: Works without API key (lower rate limits)
- **With API Key**: Higher rate limits + access to private repositories
- **Get Your Key**: Create a free account at [context7.com/dashboard](https://context7.com/dashboard)

## Pro Tips

### 1. Add a Rule to Auto-Use Context7
Instead of typing `use context7` every time, add this rule to your AI assistant:

```
Always use context7 when I need code generation, setup or configuration steps,
or library/API documentation. This means you should automatically use the Context7
MCP tools to resolve library id and get library docs without me having to explicitly ask.
```

**Where to add:**
- **Cursor**: Cursor Settings > Rules
- **Windsurf**: `.windsurfrules` file
- **Claude Code**: `CLAUDE.md` file

### 2. Use Specific Library IDs When Known
Skip the resolution step by providing the exact library ID:

```
Show me how to use React hooks. use library /facebook/react
```

### 3. Focus on Specific Topics
Get more relevant docs by specifying a topic:

```
Use get-library-docs with /vercel/next.js and topic "server components"
```

## Common Library IDs

Here are some popular libraries and their Context7 IDs:

- **Next.js**: `/vercel/next.js`
- **React**: `/facebook/react`
- **Supabase**: `/supabase/supabase`
- **MongoDB**: `/mongodb/docs`
- **Nuxt**: `/nuxt/nuxt`
- **Vue**: `/vuejs/core`
- **Tailwind CSS**: `/tailwindlabs/tailwindcss`

To find a library ID, use the `resolve-library-id` tool with the library name.

## Adding Libraries to Context7

If your favorite library isn't available, you can contribute it! See the [Context7 GitHub guide](https://github.com/upstash/context7) for instructions on adding libraries.

## How It Works Behind the Scenes

1. **Crawling**: Context7 crawls GitHub repositories for documentation
2. **Parsing**: Extracts code examples, API references, and guides
3. **Ranking**: Uses algorithms to rank and prioritize the most relevant content
4. **Serving**: Delivers docs through MCP protocol to your AI assistant
5. **Updating**: Continuously syncs with source repositories for latest changes

## Troubleshooting

### "Module Not Found" Errors
Try using `bunx` instead of `npx`:
```bash
claude mcp add context7 -- bunx -y @upstash/context7-mcp --api-key YOUR_API_KEY
```

### Rate Limiting
If you hit rate limits, get a free API key from [context7.com/dashboard](https://context7.com/dashboard)

### Behind a Proxy
Context7 respects `https_proxy` / `HTTPS_PROXY` environment variables.

## Supported Platforms

Context7 works with 20+ AI coding assistants including:
- Claude Code
- Cursor
- VS Code
- Windsurf
- Cline
- GitHub Copilot
- JetBrains AI Assistant
- And many more

## Cost

**Free** - Both with and without API key
- No API key: Basic rate limits
- With API key: Higher rate limits + private repo access

## Links

- **GitHub**: [github.com/upstash/context7](https://github.com/upstash/context7)
- **Website**: [context7.com](https://context7.com)
- **Dashboard**: [context7.com/dashboard](https://context7.com/dashboard)
- **Discord**: Join the Upstash community

## Disclaimer

Context7 projects are community-contributed. While maintaining high quality standards, Context7 cannot guarantee the accuracy, completeness, or security of all library documentation. If you encounter suspicious or harmful content, use the "Report" button on the project page.
