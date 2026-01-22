import { db } from "./db";
import { generateRestaurantTemplate } from "@/templates/restaurant";
import { generateSalonTemplate } from "@/templates/salon";
import { generatePlumberTemplate } from "@/templates/plumber";
import { ClientData } from "./validations";

/**
 * Generates a website HTML from template based on client data
 */
export async function generateSite(
  clientId: string,
  templateId: string
): Promise<{ success: boolean; html?: string; error?: string }> {
  try {
    // Fetch client data from database
    const client = await db.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return {
        success: false,
        error: "Client not found",
      };
    }

    // Prepare client data for template
    const clientData: ClientData = {
      businessName: client.businessName,
      subdomain: client.subdomain,
      industry: client.industry as "restaurant" | "salon" | "plumber",
      email: client.email,
      phone: client.phone,
      address: client.address || undefined,
      aboutUs: client.aboutUs,
      services: Array.isArray(client.services)
        ? (client.services as string[])
        : [],
      hours: client.hours as ClientData["hours"],
      socialLinks: client.socialLinks as ClientData["socialLinks"],
    };

    // Generate HTML based on template
    let html: string;

    switch (templateId) {
      case "restaurant":
        html = generateRestaurantTemplate(clientData);
        break;
      case "salon":
        html = generateSalonTemplate(clientData);
        break;
      case "plumber":
        html = generatePlumberTemplate(clientData);
        break;
      default:
        return {
          success: false,
          error: `Unknown template ID: ${templateId}`,
        };
    }

    // Update client record with generated HTML (optional, for caching)
    await db.client.update({
      where: { id: clientId },
      data: {
        siteData: { html, generatedAt: new Date().toISOString() },
      },
    });

    return {
      success: true,
      html,
    };
  } catch (error) {
    console.error("Error generating site:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Gets the template function for a given template ID
 */
export function getTemplateFunction(templateId: string) {
  switch (templateId) {
    case "restaurant":
      return generateRestaurantTemplate;
    case "salon":
      return generateSalonTemplate;
    case "plumber":
      return generatePlumberTemplate;
    default:
      return null;
  }
}
