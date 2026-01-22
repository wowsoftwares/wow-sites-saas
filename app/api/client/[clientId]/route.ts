import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const client = await db.client.findUnique({
      where: { id: params.clientId },
      select: {
        id: true,
        businessName: true,
        subdomain: true,
        industry: true,
        email: true,
        phone: true,
        address: true,
        aboutUs: true,
        services: true,
        status: true,
        deploymentUrl: true,
        createdAt: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Client not found" },
        { status: 404 }
      );
    }

    // Convert services from JSON to array if needed
    const services = Array.isArray(client.services)
      ? client.services
      : typeof client.services === "string"
      ? JSON.parse(client.services)
      : [];

    return NextResponse.json({
      ...client,
      services,
      createdAt: client.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    );
  }
}
