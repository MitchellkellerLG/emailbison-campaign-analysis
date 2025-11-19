/**
 * Bounce Monitoring API Endpoint
 *
 * GET /api/clients/[id]/bounces
 *
 * Returns domain-level and ESP-level bounce rates with alerts.
 * Constitutional Compliance: Article IX (Bounce Tracking and Alerting)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBounceMonitoring } from '@/lib/services/bounce-monitor';

/**
 * GET /api/clients/[id]/bounces
 *
 * Fetches bounce monitoring data for a workspace
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing workspace ID
 * @returns Bounce monitoring data with ESP and domain-level metrics
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse and validate workspace ID
    const workspaceId = parseInt(params.id, 10);

    if (isNaN(workspaceId) || workspaceId <= 0) {
      return NextResponse.json(
        {
          error: 'Invalid workspace ID',
          message: 'Workspace ID must be a positive integer',
        },
        { status: 400 }
      );
    }

    // Fetch bounce monitoring data
    const bounceData = await getBounceMonitoring(workspaceId);

    // Return successful response
    return NextResponse.json(bounceData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    // Log error for debugging
    console.error('[Bounce Monitoring API] Error:', error);

    // Determine error type and status code
    if (error instanceof Error) {
      // Check for specific error types
      if (error.message.includes('Invalid workspace ID')) {
        return NextResponse.json(
          {
            error: 'Invalid Request',
            message: error.message,
          },
          { status: 400 }
        );
      }

      if (error.message.includes('not found') || error.message.includes('No workspace')) {
        return NextResponse.json(
          {
            error: 'Not Found',
            message: `Workspace ${params.id} not found or has no data`,
          },
          { status: 404 }
        );
      }

      // Generic server error
      return NextResponse.json(
        {
          error: 'Internal Server Error',
          message: 'Failed to calculate bounce rates. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
