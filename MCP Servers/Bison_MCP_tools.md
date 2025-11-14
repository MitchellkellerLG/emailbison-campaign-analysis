# Bison MCP Tools Reference

The Bison MCP provides 54 email automation tools organized into these categories:

## Campaign Management
- `mcp__bison_mcp__emailbison_create_campaign` - Create a new campaign
- `mcp__bison_mcp__emailbison_campaign_details` - Get details of a specific campaign
- `mcp__bison_mcp__emailbison_list_campaigns` - List campaigns for the authenticated user
- `mcp__bison_mcp__emailbison_pause_campaign` - Pause a running campaign
- `mcp__bison_mcp__emailbison_resume_campaign` - Resume a paused campaign
- `mcp__bison_mcp__emailbison_archive_campaign` - Archive a campaign
- `mcp__bison_mcp__emailbison_update_campaign_settings` - Update settings of a campaign
- `mcp__bison_mcp__emailbison_duplicate_campaign` - Duplicate an existing campaign with all sequence steps and settings
- `mcp__bison_mcp__emailbison_create_campaign_workflow` - Create a campaign with optional schedule, sequence steps, settings, tags, and optional launch in one call

## Email Sequences
- `mcp__bison_mcp__emailbison_create_sequence_steps` - Create sequence steps for a campaign from scratch
- `mcp__bison_mcp__emailbison_update_sequence_steps` - Update existing sequence steps for a campaign
- `mcp__bison_mcp__emailbison_view_campaign_sequence_steps` - View the sequence steps of a campaign
- `mcp__bison_mcp__emailbison_delete_sequence_step` - Delete a specific sequence step from a sequence

## Campaign Scheduling
- `mcp__bison_mcp__emailbison_create_campaign_schedule` - Create the schedule for a campaign
- `mcp__bison_mcp__emailbison_get_scheduled_emails` - Get scheduled emails for a campaign

## Conversations & Replies
- `mcp__bison_mcp__emailbison_view_lead_conversations` - View all conversations and replies for a specific lead
- `mcp__bison_mcp__emailbison_get_conversation_thread` - Get complete conversation thread for a specific reply
- `mcp__bison_mcp__emailbison_list_bounced_replies` - List all bounced replies
- `mcp__bison_mcp__emailbison_get_bounced_copy` - Retrieve the copy of a bounced reply

## Lead Management
- `mcp__bison_mcp__emailbison_bulk_create_leads` - Create multiple leads in a single request
- `mcp__bison_mcp__emailbison_list_leads` - Retrieve all leads
- `mcp__bison_mcp__emailbison_update_or_create_multiple_leads` - Update or create multiple leads
- `mcp__bison_mcp__emailbison_attach_tags_to_leads` - Attach tags to leads
- `mcp__bison_mcp__emailbison_remove_tags_from_leads` - Remove tags from leads

## Email Account Management
- `mcp__bison_mcp__emailbison_create_imap_smtp_email_account` - Create a new IMAP/SMTP email account
- `mcp__bison_mcp__emailbison_list_email_accounts` - List sender email accounts
- `mcp__bison_mcp__emailbison_attach_tags_to_sender_emails` - Attach tags to sender email accounts
- `mcp__bison_mcp__emailbison_remove_tags_from_sender_emails` - Remove tags from sender email accounts

## Blacklist & Domain Management
- `mcp__bison_mcp__emailbison_create_blacklisted_email` - Add an email to the blacklist
- `mcp__bison_mcp__emailbison_create_blacklisted_domain` - Add a domain to the blacklist
- `mcp__bison_mcp__emailbison_get_blacklisted_emails` - Retrieve all blacklisted emails
- `mcp__bison_mcp__emailbison_get_blacklisted_domains` - Retrieve all blacklisted domains
- `mcp__bison_mcp__emailbison_remove_blacklisted_email` - Remove an email from the blacklist
- `mcp__bison_mcp__emailbison_remove_blacklisted_domain` - Remove a domain from the blacklist
- `mcp__bison_mcp__emailbison_bulk_blacklist_emails` - Bulk add blacklisted emails from CSV
- `mcp__bison_mcp__emailbison_bulk_blacklist_domains` - Bulk add blacklisted domains from CSV

## Custom Tracking Domains
- `mcp__bison_mcp__emailbison_create_custom_tracking_domain` - Create a custom tracking domain
- `mcp__bison_mcp__emailbison_get_custom_tracking_domain` - Get a custom tracking domain by ID
- `mcp__bison_mcp__emailbison_list_custom_tracking_domains` - List custom tracking domains
- `mcp__bison_mcp__emailbison_remove_custom_tracking_domain` - Remove a custom tracking domain

## Tag Management
- `mcp__bison_mcp__emailbison_create_tag` - Create a new tag
- `mcp__bison_mcp__emailbison_get_tag` - Get details for a single tag
- `mcp__bison_mcp__emailbison_get_all_tags` - Retrieve all tags for the workspace
- `mcp__bison_mcp__emailbison_delete_tag` - Delete a tag
- `mcp__bison_mcp__emailbison_attach_tags_to_campaigns` - Attach tags to campaigns
- `mcp__bison_mcp__emailbison_remove_tags_from_campaigns` - Remove tags from campaigns

## Workspace Management
- `mcp__bison_mcp__emailbison_list_workspaces` - List available workspaces with current workspace context information
- `mcp__bison_mcp__emailbison_list_workspaces_paginated` - List available workspaces with pagination support
- `mcp__bison_mcp__emailbison_get_workspace` - Get details for a workspace
- `mcp__bison_mcp__emailbison_rotate_workspace` - Switch active workspace context for subsequent operations
- `mcp__bison_mcp__emailbison_workspace_context_status` - Get current workspace context status and debugging information

## User Account
- `mcp__bison_mcp__emailbison_account_details` - Retrieve the authenticated user's account details
- `mcp__bison_mcp__emailbison_update_password` - Update the authenticated user's password
- `mcp__bison_mcp__emailbison_update_profile_picture` - Update the authenticated user's profile picture

## Webhooks
- `mcp__bison_mcp__emailbison_create_webhook` - Create a new webhook
- `mcp__bison_mcp__emailbison_get_all_webhooks` - Retrieve all webhooks

## Utilities & Diagnostics
- `mcp__bison_mcp__emailbison_diagnostic` - Diagnostic tool to debug API connection and authentication
- `mcp__bison_mcp__test_file_read` - Test file reading capabilities

## Summary
These tools provide a comprehensive API for managing email campaigns, sequences, leads, and various email automation features through the EmailBison service. The tools cover everything from basic campaign creation to advanced features like custom tracking domains, webhooks, and bulk operations.