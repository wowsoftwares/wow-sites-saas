export const INDUSTRIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "salon", label: "Hair Salon" },
  { value: "plumber", label: "Plumber" },
] as const;

export const TEMPLATE_IDS = {
  restaurant: "restaurant",
  salon: "salon",
  plumber: "plumber",
} as const;

export const CLIENT_STATUS = {
  PENDING: "pending",
  DEPLOYING: "deploying",
  ACTIVE: "active",
  FAILED: "failed",
} as const;

export const getBaseDomain = () => {
  return process.env.NEXT_PUBLIC_SAAS_DOMAIN || "saas.wow-sites.com";
};

export const getAppUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || "https://app.saas.wow-sites.com";
};
