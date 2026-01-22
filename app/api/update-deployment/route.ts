import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WebhookPayloadSchema } from "@/lib/validations";
import { sendWelcomeEmail, sendErrorEmail } from "@/lib/email";
import { CLIENT_STATUS } from "@/lib/constants";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook secret
    if (N8N_WEBHOOK_SECRET && body.secret !== N8N_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Validate payload
    const validationResult = WebhookPayloadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { clientId, status, deploymentUrl, error } = validationResult.data;

    // Find client
    const client = await db.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    // Update client record
    const updatedClient = await db.client.update({
      where: { id: clientId },
      data: {
        status,
        deploymentUrl: deploymentUrl || null,
      },
    });

    // Send appropriate email based on status
    if (status === CLIENT_STATUS.ACTIVE && deploymentUrl) {
      // Send welcome email
      await sendWelcomeEmail(
        client.email,
        client.subdomain,
        client.businessName
      );
    } else if (status === CLIENT_STATUS.FAILED) {
      // Send error email
      await sendErrorEmail(
        client.email,
        client.businessName,
        error || "Unknown deployment error"
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deployment status updated successfully",
      client: {
        id: updatedClient.id,
        status: updatedClient.status,
        deploymentUrl: updatedClient.deploymentUrl,
      },
    });
  } catch (error) {
    console.error("Error updating deployment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while updating deployment status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
