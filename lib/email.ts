// Brevo email integration
// Note: Adjust imports based on actual @getbrevo/brevo package version
// If the package structure differs, update these imports accordingly

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@wow-sites.com";
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || "WOW Sites";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.saas.wow-sites.com";
const BASE_DOMAIN = process.env.NEXT_PUBLIC_SAAS_DOMAIN || "saas.wow-sites.com";

// Helper function to send email via Brevo API
async function sendBrevoEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent: string
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    return { success: false, error: "Brevo API key not configured" };
  }

  try {
    // Using Brevo REST API directly
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_SENDER_NAME,
          email: BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sends welcome email when site is deployed successfully
 */
export async function sendWelcomeEmail(
  clientEmail: string,
  subdomain: string,
  businessName: string
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API key not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const websiteUrl = `https://${subdomain}.${BASE_DOMAIN}`;
    const dashboardUrl = `${APP_URL}/dashboard`;

    const subject = `Your website is live! 🎉`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Your Website is Live!</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Great news! Your website for <strong>${businessName}</strong> has been successfully deployed and is now live!</p>
              <p><strong>Your website URL:</strong><br>
              <a href="${websiteUrl}" style="color: #ef4444; font-size: 18px;">${websiteUrl}</a></p>
              <p style="text-align: center;">
                <a href="${websiteUrl}" class="button">Visit Your Website</a>
              </p>
              <p>You can also manage your website from your dashboard:</p>
              <p style="text-align: center;">
                <a href="${dashboardUrl}" class="button" style="background: #6b7280;">Go to Dashboard</a>
              </p>
              <p>If you have any questions or need help, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The WOW Sites Team</p>
            </div>
            <div class="footer">
              <p>© 2024 WOW Sites. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const textContent = `
Your Website is Live! 🎉

Hi there,

Great news! Your website for ${businessName} has been successfully deployed and is now live!

Your website URL: ${websiteUrl}

Visit your website: ${websiteUrl}
Manage your site: ${dashboardUrl}

If you have any questions or need help, feel free to reach out to our support team.

Best regards,
The WOW Sites Team
    `;
    // Send email using Brevo API
    const result = await sendBrevoEmail(
      clientEmail,
      subject,
      htmlContent,
      textContent
    );

    if (result.success) {
      console.log(`Welcome email sent to ${clientEmail}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Sends error email if deployment fails
 */
export async function sendErrorEmail(
  clientEmail: string,
  businessName: string,
  error: string
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    console.warn("Brevo API key not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const supportEmail = "support@wow-sites.com";
    const dashboardUrl = `${APP_URL}/dashboard`;

    const subject = `Issue with your website deployment`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .error-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Deployment Issue</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>We encountered an issue while deploying your website for <strong>${businessName}</strong>.</p>
              <div class="error-box">
                <strong>Error details:</strong><br>
                ${error}
              </div>
              <p>Our team has been notified and is working to resolve this issue. We'll keep you updated.</p>
              <p>If you have any questions, please contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
              <p style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              </p>
              <p>We apologize for any inconvenience.</p>
              <p>Best regards,<br>The WOW Sites Team</p>
            </div>
            <div class="footer">
              <p>© 2024 WOW Sites. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    const textContent = `
Deployment Issue

Hi there,

We encountered an issue while deploying your website for ${businessName}.

Error details: ${error}

Our team has been notified and is working to resolve this issue. We'll keep you updated.

If you have any questions, please contact our support team at ${supportEmail}.

We apologize for any inconvenience.

Best regards,
The WOW Sites Team
    `;
    // Send email using Brevo API
    const result = await sendBrevoEmail(
      clientEmail,
      subject,
      htmlContent,
      textContent
    );

    if (result.success) {
      console.log(`Error email sent to ${clientEmail}`);
    }

    return result;
  } catch (error) {
    console.error("Error sending error email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
