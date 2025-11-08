import { NextResponse } from "next/server";
import { processCommission } from "./commission-logic";

/**
 * POST endpoint for commission form submissions
 */
export async function POST(req: Request) {
  try {
    // Extract client IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Parse request body
    const jsonBody = await req.json().catch(() => null);

    // Process the commission request
    const result = processCommission(jsonBody, ip);

    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("Commission API error:", error);
    return NextResponse.json(
      { error: "server_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// In static export environments (e.g., GitHub Pages) dynamic routes are not supported.
// Mark this route as static so the exporter doesn't fail the build.
export const dynamic = "force-static";
export const revalidate = false;
