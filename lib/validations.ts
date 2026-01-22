import { z } from "zod";

// Subdomain validation: alphanumeric + hyphens, 3-30 chars
export const SubdomainSchema = z
  .string()
  .min(3, "Subdomain must be at least 3 characters")
  .max(30, "Subdomain must be at most 30 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Subdomain can only contain lowercase letters, numbers, and hyphens"
  )
  .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
    message: "Subdomain cannot start or end with a hyphen",
  });

// Email validation
export const EmailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(1, "Email is required");

// Phone validation (flexible format)
export const PhoneSchema = z
  .string()
  .min(10, "Phone number must be at least 10 digits")
  .regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number");

// Business hours schema
export const BusinessHoursSchema = z
  .object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional(),
  })
  .optional();

// Social links schema
export const SocialLinksSchema = z
  .object({
    facebook: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    website: z.string().url().optional().or(z.literal("")),
  })
  .optional();

// Complete client data schema
export const ClientDataSchema = z.object({
  // Step 1: Business Basics
  businessName: z.string().min(1, "Business name is required").max(100),
  subdomain: SubdomainSchema,
  industry: z.enum(["restaurant", "salon", "plumber"], {
    errorMap: () => ({ message: "Please select an industry" }),
  }),

  // Step 2: Contact Information
  email: EmailSchema,
  phone: PhoneSchema,
  address: z.string().max(200).optional(),

  // Step 3: Business Details
  aboutUs: z
    .string()
    .min(10, "About us must be at least 10 characters")
    .max(500, "About us must be at most 500 characters"),
  services: z
    .array(z.string().min(1, "Service name cannot be empty"))
    .min(3, "Please add at least 3 services"),
  hours: BusinessHoursSchema,

  // Step 4: Social Links
  socialLinks: SocialLinksSchema,
});

// Webhook payload schema
export const WebhookPayloadSchema = z.object({
  clientId: z.string(),
  status: z.enum(["pending", "deploying", "active", "failed"]),
  deploymentUrl: z.string().url().optional(),
  error: z.string().optional(),
});

// Type exports
export type ClientData = z.infer<typeof ClientDataSchema>;
export type BusinessHours = z.infer<typeof BusinessHoursSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
