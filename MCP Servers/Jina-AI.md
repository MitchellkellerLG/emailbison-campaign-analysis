# Jina AI MCP Server

## Purpose
Access and extract information from public web pages using Jina AI's powerful web scraping and content extraction tools.

## What It Does
Jina AI MCP provides tools for:
- **Web Scraping**: Extract clean, readable markdown from any webpage
- **Web Search**: Search the entire web for current information and news
- **Academic Search**: Search arXiv for research papers and scientific studies
- **Image Search**: Find images across the web (Google Images-style)
- **Screenshots**: Capture high-quality screenshots of web pages
- **Content Analysis**: Analyze and process web content with AI
- **Query Expansion**: Expand search queries for better research results
- **Deduplication**: Remove duplicate content from lists of strings or images
- **Relevance Ranking**: Sort documents by relevance to a query

## Key Features
- Free for basic usage
- Converts HTML to clean markdown format
- GDPR-compliant data handling
- Supports multiple search types (web, academic, images)
- Parallel processing for multiple URLs
- No authentication required for basic features

## Common Use Cases
- Scraping website content for analysis
- Research and information gathering
- Competitive analysis
- Content extraction for documentation
- Academic paper research
- Finding and analyzing images
- Web monitoring and screenshots

## How to Interact with Jina AI

Jina AI MCP provides several tools you can use directly:

### Available Tools

#### 1. `read_url` - Extract Web Content
Converts web pages to clean markdown format.

**Parameters:**
- `url` (required): The webpage URL or array of URLs
- `withAllImages` (optional): Extract all images as structured data
- `withAllLinks` (optional): Extract all hyperlinks as structured data

**Example:**
```
Use mcp__jina__read_url to extract content from https://example.com
```

#### 2. `search_web` - Search the Internet
Search for current information, news, and websites.

**Parameters:**
- `query` (required): Search terms or array of queries
- `num` (optional, default 30): Max results to return (1-100)
- `location` (optional): Location for results (e.g., "London", "New York")
- `gl` (optional): Country code (e.g., "us", "uk")
- `hl` (optional): Language code (e.g., "en", "zh-cn")
- `tbs` (optional): Time-based filter (e.g., "qdr:h" for past hour, "qdr:d" for past day)

**Example:**
```
Use mcp__jina__search_web with query "AI coding assistants 2025"
```

#### 3. `search_arxiv` - Academic Paper Search
Search arXiv for research papers and scientific studies.

**Parameters:**
- `query` (required): Academic search terms or array of queries
- `num` (optional, default 30): Max papers to return (1-100)
- `tbs` (optional): Time-based filter

**Example:**
```
Use mcp__jina__search_arxiv with query "transformer neural networks"
```

#### 4. `search_images` - Image Search
Search for images across the web.

**Parameters:**
- `query` (required): Image search terms
- `return_url` (optional, default false): If true, returns URLs; if false, returns base64 images
- `location`, `gl`, `hl`, `tbs`: Same as search_web

**Example:**
```
Use mcp__jina__search_images with query "vintage car illustration"
```

#### 5. `capture_screenshot_url` - Take Screenshots
Capture high-quality screenshots of web pages.

**Parameters:**
- `url` (required): The webpage URL to screenshot
- `firstScreenOnly` (optional, default false): If true, captures only visible area; if false, captures full page
- `return_url` (optional, default false): If true, returns URL; if false, returns base64 image

**Example:**
```
Use mcp__jina__capture_screenshot_url for https://example.com
```

#### 6. `expand_query` - Query Expansion
Generate multiple expanded search queries for deeper research.

**Parameters:**
- `query` (required): The search query to expand

**Example:**
```
Use mcp__jina__expand_query with query "machine learning"
```

#### 7. `sort_by_relevance` - Rerank Documents
Sort documents by relevance to a query using Jina Reranker API.

**Parameters:**
- `query` (required): The query to rank documents against
- `documents` (required): Array of document texts
- `top_n` (optional): Max number of top results to return

**Example:**
```
Use mcp__jina__sort_by_relevance to rank these documents by relevance to "email automation"
```

#### 8. `deduplicate_strings` - Remove Duplicate Text
Get semantically unique strings from a list.

**Parameters:**
- `strings` (required): Array of strings to deduplicate
- `k` (optional): Number of unique strings to return (auto-detects if not provided)

**Example:**
```
Use mcp__jina__deduplicate_strings to find unique items in this list
```

#### 9. `deduplicate_images` - Remove Duplicate Images
Get semantically unique images from a list.

**Parameters:**
- `images` (required): Array of image URLs or base64 strings
- `k` (optional): Number of unique images to return

### Parallel Processing Tools

For efficiency, Jina AI offers parallel processing:

- `parallel_search_web`: Run multiple web searches simultaneously (max 5)
- `parallel_search_arxiv`: Run multiple arXiv searches simultaneously (max 5)
- `parallel_read_url`: Read multiple URLs simultaneously (max 5)

**Example:**
```
Use mcp__jina__parallel_search_web with multiple search queries about cold email strategies
```

## Workflow Example

When scraping a website like Leadgrow.ai:

1. **You ask**: "Scrape Leadgrow.ai for me"
2. **AI calls**: `mcp__jina__read_url` with url: "https://leadgrow.ai"
3. **Jina AI returns**: Clean markdown content with title, headings, and text
4. **AI responds**: With extracted content and summary

## Pro Tips

### 1. Use Parallel Tools for Efficiency
When researching multiple sources, use parallel tools:
```
Use parallel_search_web to search for:
1. "cold email best practices 2025"
2. "B2B lead generation strategies"
3. "email deliverability tips"
```

### 2. Combine Tools for Research
Chain tools together for comprehensive research:
1. Use `expand_query` to generate diverse search angles
2. Use `parallel_search_web` with expanded queries
3. Use `parallel_read_url` to extract content from top results
4. Use `deduplicate_strings` to remove redundant information
5. Use `sort_by_relevance` to rank findings

### 3. Extract Structured Data
Use optional parameters to get structured data:
```
Use read_url with withAllImages=true and withAllLinks=true to extract all images and links
```

## Setup
Jina AI MCP is typically available through the standard MCP configuration. No API key required for basic usage.

## Cost
**Free** for reasonable usage levels. Paid tiers available for high-volume usage.
