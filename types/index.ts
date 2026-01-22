import { ClientData, BusinessHours, SocialLinks } from "@/lib/validations";

export interface Client {
  id: string;
  businessName: string;
  subdomain: string;
  industry: string;
  email: string;
  phone: string;
  address?: string | null;
  aboutUs: string;
  services: string[];
  hours?: BusinessHours | null;
  socialLinks?: SocialLinks | null;
  templateId: string;
  status: string;
  deploymentUrl?: string | null;
  siteData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateData extends ClientData {
  id: string;
  deploymentUrl?: string;
}
