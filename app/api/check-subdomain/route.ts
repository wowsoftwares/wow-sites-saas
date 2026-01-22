import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { SubdomainSchema } from "@/lib/validations";

// Simple rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 10; // 10 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { available: false, message: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    // Get subdomain from query params
    const searchParams = request.nextUrl.searchParams;
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { available: false, message: "Subdomain parameter is required" },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const validationResult = SubdomainSchema.safeParse(subdomain);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          available: false,
          message: validationResult.error.errors[0]?.message || "Invalid subdomain format",
        },
        { status: 400 }
      );
    }

    // Check if subdomain exists in database
    const existingClient = await db.client.findUnique({
      where: { subdomain: subdomain.toLowerCase() },
    });

    if (existingClient) {
      return NextResponse.json({
        available: false,
        message: "This subdomain is already taken",
      });
    }

    return NextResponse.json({
      available: true,
      message: "Subdomain is available",
    });
  } catch (error) {
    console.error("Error checking subdomain:", error);
    return NextResponse.json(
      { available: false, message: "An error occurred while checking subdomain" },
      { status: 500 }
    );
  }
}
