/**
 * API Route: GET /api/clients
 *
 * Lists all EmailBison workspaces as "clients"
 * Returns workspace ID and name for client selection
 */

import { NextResponse } from 'next/server';
import { getWorkspaces, BisonAPIError } from '@/lib/services/bison';

export async function GET() {
  try {
    // Fetch all workspaces from EmailBison MCP
    const result = await getWorkspaces();

    // Transform workspaces to clients format
    const clients = result.workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
    }));

    // Return success response with timestamp
    return NextResponse.json({
      clients,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Handle EmailBison API errors
    if (error instanceof BisonAPIError) {
      console.error('[API /clients] BisonAPIError:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    // Handle unexpected errors
    console.error('[API /clients] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
