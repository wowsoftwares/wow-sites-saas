import { getBaseDomain } from "./constants";

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

const CLOUDFLARE_API_URL = "https://api.cloudflare.com/client/v4";

interface DNSRecord {
  type: string;
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}

/**
 * Creates a CNAME DNS record for a subdomain pointing to Cloudflare Pages
 */
export async function createDNSRecord(subdomain: string): Promise<{
  success: boolean;
  recordId?: string;
  error?: string;
}> {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    return {
      success: false,
      error: "Cloudflare credentials not configured",
    };
  }

  try {
    const recordName = `${subdomain}.${getBaseDomain()}`;
    // Point to Cloudflare Pages - adjust this to your actual Pages deployment
    const targetContent = "pages.dev"; // This should be your Cloudflare Pages domain

    const record: DNSRecord = {
      type: "CNAME",
      name: subdomain, // Just the subdomain part
      content: targetContent,
      ttl: 1, // Auto TTL
      proxied: true, // Enable Cloudflare proxy
    };

    const response = await fetch(
      `${CLOUDFLARE_API_URL}/zones/${CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Cloudflare API error:", data);
      return {
        success: false,
        error: data.errors?.[0]?.message || "Failed to create DNS record",
      };
    }

    return {
      success: true,
      recordId: data.result?.id,
    };
  } catch (error) {
    console.error("Error creating DNS record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Deletes a DNS record for a subdomain
 */
export async function deleteDNSRecord(recordId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    return {
      success: false,
      error: "Cloudflare credentials not configured",
    };
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_URL}/zones/${CLOUDFLARE_ZONE_ID}/dns_records/${recordId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error("Cloudflare API error:", data);
      return {
        success: false,
        error: data.errors?.[0]?.message || "Failed to delete DNS record",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting DNS record:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Checks if a DNS record exists for a subdomain
 */
export async function checkDNSRecord(subdomain: string): Promise<{
  exists: boolean;
  recordId?: string;
}> {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    return { exists: false };
  }

  try {
    const response = await fetch(
      `${CLOUDFLARE_API_URL}/zones/${CLOUDFLARE_ZONE_ID}/dns_records?name=${subdomain}.${getBaseDomain()}&type=CNAME`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { exists: false };
    }

    const records = data.result || [];
    return {
      exists: records.length > 0,
      recordId: records[0]?.id,
    };
  } catch (error) {
    console.error("Error checking DNS record:", error);
    return { exists: false };
  }
}
