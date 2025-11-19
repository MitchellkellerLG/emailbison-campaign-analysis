/**
 * API Route: GET /api/clients/[id]/overview
 *
 * Gets aggregate KPI metrics for a workspace
 * Aggregates data across all campaigns to provide overall performance
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

    // Fetch all campaigns for the workspace
    // Use high per_page to get all campaigns in one request
    const result = await getCampaigns(workspaceId, {
      per_page: 1000,
    });

    // Aggregate metrics across all campaigns
    let total_sends = 0;
    let total_bounced = 0;
    let total_replies = 0;
    let total_interested = 0;

    for (const campaign of result.campaigns) {
      total_sends += campaign.emails_sent;
      total_bounced += campaign.bounced;
      total_replies += campaign.unique_replies;
      total_interested += campaign.interested;
    }

    // Calculate total delivered
    const total_delivered = total_sends - total_bounced;

    // Calculate overall rates using calculation engine
    const overall_reply_rate = calculateReplyRate(
      total_sends,
      total_delivered,
      total_replies
    );

    const overall_bounce_rate = calculateBounceRate(
      total_sends,
      total_bounced
    );

    const overall_interest_rate = calculateInterestRate(
      total_replies,
      total_interested
    );

    const engaged_lead_rate = calculateEngagedLeadRate(
      total_delivered,
      total_interested
    );

    // Build KPI response object
    const kpis = {
      total_campaigns: result.campaigns.length,
      total_sends,
      total_delivered,
      total_replies,
      total_interested,
      total_bounced,
      overall_reply_rate: overall_reply_rate ?? 0,
      overall_bounce_rate: overall_bounce_rate ?? 0,
      overall_interest_rate: overall_interest_rate ?? 0,
      engaged_leads: total_interested,
      engaged_lead_rate: engaged_lead_rate ?? 0,
    };

    // Return KPIs with timestamp
    return NextResponse.json({
      kpis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle EmailBison API errors
    if (error instanceof BisonAPIError) {
      console.error('[API /clients/[id]/overview] BisonAPIError:', error.message);

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
    console.error('[API /clients/[id]/overview] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
