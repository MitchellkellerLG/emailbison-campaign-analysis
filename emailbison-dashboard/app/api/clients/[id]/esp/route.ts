/**
 * API Route: GET /api/clients/[id]/esp
 *
 * Gets ESP performance matrix for a workspace
 * Shows reply rates, bounce rates, and deliverability grades for every combination
 * of sending ESP and receiving domain type.
 *
 * Constitutional Compliance: Article IV (ESP Performance Transparency)
 */

import { NextResponse } from 'next/server';
import { BisonAPIError } from '@/lib/services/bison';
import { buildESPMatrix, calculateMatrixSummary } from '@/lib/services/esp-performance';

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

    // Build ESP performance matrix
    const espMatrix = await buildESPMatrix(workspaceId);

    // Calculate summary statistics
    const summary = calculateMatrixSummary(espMatrix);

    // Return matrix with summary and timestamp
    return NextResponse.json({
      esp_matrix: espMatrix,
      summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle EmailBison API errors
    if (error instanceof BisonAPIError) {
      console.error('[API /clients/[id]/esp] BisonAPIError:', error.message);

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
    console.error('[API /clients/[id]/esp] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
