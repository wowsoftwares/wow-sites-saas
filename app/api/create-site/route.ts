import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ClientDataSchema } from "@/lib/validations";
import { getBaseDomain } from "@/lib/constants";

// Force dynamic rendering and prevent static analysis
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validationResult = ClientDataSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const clientData = validationResult.data;
    const subdomain = clientData.subdomain.toLowerCase();

    // Check subdomain availability again (double-check)
    const existingClient = await db.client.findUnique({
      where: { subdomain },
    });

    if (existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: "Subdomain is already taken",
        },
        { status: 409 }
      );
    }

    // Create client record in database
    const client = await db.client.create({
      data: {
        businessName: clientData.businessName,
        subdomain,
        industry: clientData.industry,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address || null,
        aboutUs: clientData.aboutUs,
        services: clientData.services,
        hours: clientData.hours ? (clientData.hours as any) : null,
        socialLinks: clientData.socialLinks ? (clientData.socialLinks as any) : null,
        templateId: clientData.industry, // Use industry as templateId
        status: "pending",
      },
    });

    // Trigger n8n webhook
    if (N8N_WEBHOOK_URL) {
      try {
        const webhookPayload = {
          clientId: client.id,
          subdomain,
          templateId: clientData.industry,
          data: {
            businessName: clientData.businessName,
            email: clientData.email,
            phone: clientData.phone,
            address: clientData.address,
            aboutUs: clientData.aboutUs,
            services: clientData.services,
            hours: clientData.hours,
            socialLinks: clientData.socialLinks,
          },
          secret: N8N_WEBHOOK_SECRET, // Include secret for verification
        };

        // Fire and forget - don't wait for response
        fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookPayload),
        }).catch((error) => {
          console.error("Error triggering n8n webhook:", error);
          // Don't fail the request if webhook fails
        });
      } catch (error) {
        console.error("Error sending webhook:", error);
        // Continue even if webhook fails
      }
    } else {
      console.warn("N8N_WEBHOOK_URL not configured, skipping webhook trigger");
    }

    return NextResponse.json({
      success: true,
      clientId: client.id,
      subdomain,
      websiteUrl: `https://${subdomain}.${getBaseDomain()}`,
      message: "Site creation initiated successfully",
    });
  } catch (error) {
    console.error("Error creating site:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while creating your site",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
