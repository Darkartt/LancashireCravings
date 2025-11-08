import { NextResponse } from "next/server";
import { z } from "zod";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * POST endpoint for newsletter subscriptions
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "invalid_request", message: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate email
    const validation = newsletterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "validation_failed",
          message: "Invalid email address",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // In production, integrate with email service (Mailchimp, SendGrid, etc.)
    console.log("Newsletter subscription:", {
      email,
      timestamp: new Date().toISOString(),
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      email,
    });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "server_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// Mark as static for GitHub Pages compatibility
export const dynamic = "force-static";
export const revalidate = false;
