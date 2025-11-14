# Airtable MCP Server

## Purpose
Provide read and write access to Airtable databases, enabling AI assistants to inspect schemas, read records, write data, and manage Airtable resources programmatically.

## What It Does
The Airtable MCP server allows you to:
- **Inspect Databases**: List bases, tables, and view detailed schemas
- **Read Data**: Query records with filtering and search capabilities
- **Write Data**: Create, update, and delete records
- **Manage Structure**: Create tables and fields
- **Collaborate**: Add and read comments on records

## Installation Status
✅ **INSTALLED** - Configured in your Claude Code setup with API key

## Available Tools (16 Total)

### Data Operations
1. **list_records** - List records from a table
   - `baseId` (required): Airtable base ID
   - `tableId` (required): Table ID to query
   - `maxRecords` (optional, default 100): Max records to return
   - `filterByFormula` (optional): Airtable formula for filtering

2. **search_records** - Search for records containing specific text
   - `baseId` (required): Base ID
   - `tableId` (required): Table ID
   - `searchTerm` (required): Text to search for
   - `fieldIds` (optional): Specific fields to search in
   - `maxRecords` (optional, default 100): Max results

3. **get_record** - Get a specific record by ID
   - `baseId`, `tableId`, `recordId`: All required

4. **create_record** - Create a new record
   - `baseId`, `tableId` (required)
   - `fields` (required): Object with field values

5. **update_records** - Update one or more records
   - `baseId`, `tableId` (required)
   - `records` (required): Array of {id, fields} objects

6. **delete_records** - Delete records
   - `baseId`, `tableId` (required)
   - `recordIds` (required): Array of record IDs to delete

### Schema & Discovery
7. **list_bases** - List all accessible Airtable bases
   - No parameters required
   - Returns base ID, name, and permission level

8. **list_tables** - List all tables in a base
   - `baseId` (required)
   - `detailLevel` (optional): Level of detail to return

9. **describe_table** - Get detailed information about a table
   - `baseId`, `tableId` (required)
   - `detailLevel` (optional)

### Structure Management
10. **create_table** - Create a new table
    - `baseId` (required)
    - `name` (required): Table name
    - `description` (optional)
    - `fields` (required): Array of field definitions

11. **update_table** - Update table name or description
    - `baseId`, `tableId` (required)
    - `name`, `description` (optional)

12. **create_field** - Create a new field in a table
    - `baseId`, `tableId` (required)
    - `name`, `type` (required)
    - `description`, `options` (optional)

13. **update_field** - Update field name or description
    - `baseId`, `tableId`, `fieldId` (required)
    - `name`, `description` (optional)

### Comments
14. **create_comment** - Add a comment to a record
    - `baseId`, `tableId`, `recordId` (required)
    - `text` (required): Comment content
    - `parentCommentId` (optional): For threaded replies

15. **list_comments** - Get comments on a record
    - `baseId`, `tableId`, `recordId` (required)
    - `pageSize` (optional, max 100)
    - `offset` (optional): Pagination offset

## Setup Instructions

### Creating an Airtable Personal Access Token

1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Configure your token:
   - **Name**: "Claude Code MCP Server"
   - **Scopes** (Required):
     - `schema.bases:read`
     - `data.records:read`
     - `data.records:write`
     - `schema.bases:write`
     - `data.recordComments:read` (optional)
     - `data.recordComments:write` (optional)
   - **Access**: Select "Add all resources" or specific bases
4. Copy the token (looks like `pat123.abc123...`)
5. **IMPORTANT**: Save this token securely - you can't view it again!

### Installation Command
```bash
claude mcp add airtable -e AIRTABLE_API_KEY=YOUR_TOKEN -- npx -y airtable-mcp-server
```

## Common Use Cases

### Example 1: List All Bases
```
List all my Airtable bases
```

### Example 2: Query Records
```
Get the first 50 records from table "tblABC123" in base "appXYZ456" where Status is "Active"
```

### Example 3: Create a Record
```
Create a new record in base "appXYZ456" table "tblABC123" with:
- Name: "New Project"
- Status: "In Progress"
- Due Date: "2025-12-31"
```

### Example 4: Search Across Fields
```
Search for "marketing campaign" in all fields of table "tblProjects" in base "appMain"
```

### Example 5: Add Comment
```
Add a comment "Reviewed and approved" to record "recABC123" in base "appXYZ456" table "tblTasks"
```

## Resources

The server also provides schema information as MCP resources:
- **Format**: `airtable://<baseId>/<tableId>/schema`
- **Contains**: Full table schema with fields, views, and structure

## Finding Base and Table IDs

### Base ID
- Open any Airtable base
- Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
- The `appXXXXXXXXXXXXXX` part is your base ID

### Table ID
- Open a table in Airtable
- Look at the URL: `https://airtable.com/appXXXXXX/tblYYYYYYYY/...`
- The `tblYYYYYYYY` part is your table ID

Or use the `list_tables` tool to get all table IDs programmatically.

## Security Notes

- Your API key has access to all bases/scopes you granted
- Never commit your token to version control
- Rotate tokens periodically for security
- Use minimum required scopes for your use case

## Limitations

- Rate limits apply based on your Airtable plan
- Maximum 100 records per request (use pagination for more)
- Some field types may have specific formatting requirements
- Write operations require appropriate permissions

## Troubleshooting

**"Failed to connect"** in `claude mcp list`:
- This is normal for stdio servers! They connect on-demand.

**Permission errors**:
- Verify your token has the correct scopes
- Check that the base is included in your token's access list

**Record not found**:
- Verify the base ID, table ID, and record ID are correct
- Ensure your API key has access to that base

## Configuration
**Status**: ✅ Installed with environment variable `AIRTABLE_API_KEY`
**Transport**: stdio (runs on-demand via npx)
**Package**: `airtable-mcp-server` from npm

## Links
- GitHub: https://github.com/domdomegg/airtable-mcp-server
- Airtable API Docs: https://airtable.com/developers/web/api/introduction
- Create Tokens: https://airtable.com/create/tokens
