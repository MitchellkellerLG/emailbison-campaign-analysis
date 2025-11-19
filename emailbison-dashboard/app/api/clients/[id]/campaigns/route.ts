/**
 * API Route: GET /api/clients/[id]/campaigns
 *
 * Gets all campaigns for a workspace with calculated analytics metrics
 * Returns campaign data enriched with reply rates, bounce rates, etc.
 */

import { NextResponse } from 'next/server';
import { getCampaigns, BisonAPIError } from '@/lib/services/bison';
import {
  calculateReplyRate,
  calculateBounceRate,
  calculateInterestRate,
  calculateEngagedLeadRate,
} from '@/lib/services/calculations';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // Parse workspace ID from path parameter
    const workspaceId = parseInt(params.id, 10);

    // Validate workspace ID
    if (isNaN(workspaceId) || workspaceId <= 0) {
      return NextResponse.json(
        { error: 'Invalid workspace ID' },
        { status: 400 }
      );
    }

    // Parse query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const per_page = searchParams.get('per_page')
      ? parseInt(searchParams.get('per_page')!, 10)
      : 100;

    // Fetch campaigns from EmailBison MCP
    const result = await getCampaigns(workspaceId, {
      status,
      per_page,
    });

    // Enrich campaigns with calculated metrics
    const campaignsWithMetrics = result.campaigns.map(campaign => {
      // Calculate delivered emails
      const delivered = campaign.emails_sent - campaign.bounced;

      // Calculate all metrics using calculation engine
      const reply_rate = calculateReplyRate(
        campaign.emails_sent,
        delivered,
        campaign.unique_replies
      );

      const bounce_rate = calculateBounceRate(
        campaign.emails_sent,
        campaign.bounced
      );

      const interest_rate = calculateInterestRate(
        campaign.unique_replies,
        campaign.interested
      );

      const engaged_lead_rate = calculateEngagedLeadRate(
        delivered,
        campaign.interested
      );

      // Return campaign with calculated metrics
      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        emails_sent: campaign.emails_sent,
        bounced: campaign.bounced,
        delivered,
        unique_replies: campaign.unique_replies,
        interested: campaign.interested,
        reply_rate: reply_rate ?? 0,
        bounce_rate: bounce_rate ?? 0,
        interest_rate: interest_rate ?? 0,
        engaged_lead_rate: engaged_lead_rate ?? 0,
      };
    });

    // Build response with metrics and pagination
    const response: {
      campaigns: typeof campaignsWithMetrics;
      pagination?: typeof result.pagination;
      timestamp: string;
    } = {
      campaigns: campaignsWithMetrics,
      timestamp: new Date().toISOString(),
    };

    // Include pagination if present
    if (result.pagination) {
      response.pagination = result.pagination;
    }

    return NextResponse.json(response);
  } catch (error) {
    // Handle EmailBison API errors
    if (error instanceof BisonAPIError) {
      console.error('[API /clients/[id]/campaigns] BisonAPIError:', error.message);

      // Return 404 if workspace not found
      if (error.message.includes('workspace') && error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Workspace not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    // Handle unexpected errors
    console.error('[API /clients/[id]/campaigns] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
