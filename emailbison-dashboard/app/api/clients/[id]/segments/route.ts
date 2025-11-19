/**
 * Segment Analysis API Endpoint
 *
 * GET /api/clients/[id]/segments?type=industry|company_size|seniority
 *
 * Returns firmographic segment analysis for a workspace's campaigns
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeBySegment, calculateSegmentSummary, isValidSegmentType } from '@/lib/services/segment-analysis';
import type { SegmentType } from '@/lib/services/segment-analysis';

/**
 * GET handler for segment analysis
 *
 * Query Parameters:
 * - type: 'industry' | 'company_size' | 'seniority' (required)
 *
 * Response:
 * {
 *   segments: Segment[];
 *   segment_type: string;
 *   summary: {
 *     total_segments: number;
 *     best_performer?: { segment_value: string; reply_rate: number; };
 *     worst_performer?: { segment_value: string; reply_rate: number; };
 *   };
 *   timestamp: string;
 * }
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

    // Get and validate segment type from query params
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        {
          error: 'Missing required parameter',
          message: 'Query parameter "type" is required. Must be one of: industry, company_size, seniority',
        },
        { status: 400 }
      );
    }

    if (!isValidSegmentType(type)) {
      return NextResponse.json(
        {
          error: 'Invalid segment type',
          message: `Invalid segment type "${type}". Must be one of: industry, company_size, seniority`,
        },
        { status: 400 }
      );
    }

    // Perform segment analysis
    const segments = await analyzeBySegment(workspaceId, type as SegmentType);

    // Calculate summary statistics
    const summary = calculateSegmentSummary(segments);

    // Return response
    return NextResponse.json(
      {
        segments,
        segment_type: type,
        summary,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in segment analysis API:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's a validation error
      if (error.message.includes('Invalid workspace ID') ||
          error.message.includes('Invalid segment type')) {
        return NextResponse.json(
          {
            error: 'Validation error',
            message: error.message,
          },
          { status: 400 }
        );
      }

      // Check if it's a not found error
      if (error.message.includes('not found') ||
          error.message.includes('No workspace')) {
        return NextResponse.json(
          {
            error: 'Not found',
            message: error.message,
          },
          { status: 404 }
        );
      }
    }

    // Generic server error
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while analyzing segments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
