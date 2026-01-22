"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClientDataSchema, type ClientData } from "@/lib/validations";
import { INDUSTRIES } from "@/lib/constants";
import { getBaseDomain } from "@/lib/constants";
import { toast } from "sonner";

const STORAGE_KEY = "wowsites_signup_data";

export default function SignupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientData>>({
    services: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(
    null
  );

  // Load form data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
      } catch (e) {
        console.error("Error loading saved form data:", e);
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Check subdomain availability (debounced)
  useEffect(() => {
    if (!formData.subdomain || formData.subdomain.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      checkSubdomainAvailability(formData.subdomain!);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.subdomain]);

  const checkSubdomainAvailability = async (subdomain: string) => {
    if (!subdomain || subdomain.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setSubdomainChecking(true);
    try {
      const response = await fetch(
        `/api/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`
      );
      const data = await response.json();
      setSubdomainAvailable(data.available);
      if (!data.available) {
        setErrors((prev) => ({
          ...prev,
          subdomain: data.message || "Subdomain is not available",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.subdomain;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Error checking subdomain:", error);
      toast.error("Error checking subdomain availability");
    } finally {
      setSubdomainChecking(false);
    }
  };

  const updateFormData = (field: keyof ClientData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...(prev.services || []), ""],
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateService = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services?.map((s, i) => (i === index ? value : s)) || [],
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.businessName) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.subdomain) {
        newErrors.subdomain = "Subdomain is required";
      } else if (subdomainAvailable === false) {
        newErrors.subdomain = "Subdomain is not available";
      }
      if (!formData.industry) {
        newErrors.industry = "Please select an industry";
      }
    } else if (step === 2) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone) {
        newErrors.phone = "Phone is required";
      }
    } else if (step === 3) {
      if (!formData.aboutUs || formData.aboutUs.length < 10) {
        newErrors.aboutUs = "About us must be at least 10 characters";
      }
      if (!formData.services || formData.services.length < 3) {
        newErrors.services = "Please add at least 3 services";
      }
      if (
        formData.services &&
        formData.services.some((s) => !s || s.trim() === "")
      ) {
        newErrors.services = "All services must have a name";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Final validation with Zod
      const validationResult = ClientDataSchema.safeParse(formData);
      if (!validationResult.success) {
        const zodErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            zodErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(zodErrors);
        toast.error("Please fix the errors in the form");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("/api/create-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to create site");
      }

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to success page
      router.push(`/success?clientId=${data.clientId}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create site"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    "Business Basics",
    "Contact Info",
    "Business Details",
    "Social Links",
    "Preview",
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 flex items-center ${
                index < steps.length - 1 ? "mr-2" : ""
              }`}
            >
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep > index + 1
                      ? "bg-green-500 text-white"
                      : currentStep === index + 1
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > index + 1 ? "✓" : index + 1}
                </div>
                <span
                  className={`mt-2 text-sm text-center ${
                    currentStep === index + 1
                      ? "font-semibold text-primary-600"
                      : "text-gray-600"
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > index + 1 ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Step 1: Business Basics */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Business Basics</h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName || ""}
                onChange={(e) => updateFormData("businessName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Joe's Pizza"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Subdomain *
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.subdomain || ""}
                  onChange={(e) =>
                    updateFormData(
                      "subdomain",
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                    )
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="joes-pizza"
                />
                <span className="ml-2 text-gray-600">
                  .{getBaseDomain()}
                </span>
              </div>
              {subdomainChecking && (
                <p className="text-gray-500 text-sm mt-1">Checking...</p>
              )}
              {!subdomainChecking && subdomainAvailable === true && (
                <p className="text-green-500 text-sm mt-1">✓ Available</p>
              )}
              {errors.subdomain && (
                <p className="text-red-500 text-sm mt-1">{errors.subdomain}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Industry *
              </label>
              <select
                value={formData.industry || ""}
                onChange={(e) => updateFormData("industry", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-red-500 text-sm mt-1">{errors.industry}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => updateFormData("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+1 234 567 8900"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Address (Optional)
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="123 Main St, City, State"
              />
            </div>
          </div>
        )}

        {/* Step 3: Business Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Business Details</h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                About Us *
              </label>
              <textarea
                value={formData.aboutUs || ""}
                onChange={(e) => updateFormData("aboutUs", e.target.value)}
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about your business..."
              />
              <p className="text-gray-500 text-sm mt-1">
                {(formData.aboutUs?.length || 0)} / 500 characters
              </p>
              {errors.aboutUs && (
                <p className="text-red-500 text-sm mt-1">{errors.aboutUs}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Services * (Minimum 3)
              </label>
              {(formData.services || []).map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => updateService(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={`Service ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                + Add Service
              </button>
              {errors.services && (
                <p className="text-red-500 text-sm mt-1">{errors.services}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Social Links */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Social Links (Optional)</h2>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.facebook || ""}
                onChange={(e) =>
                  updateFormData("socialLinks", {
                    ...formData.socialLinks,
                    facebook: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.instagram || ""}
                onChange={(e) =>
                  updateFormData("socialLinks", {
                    ...formData.socialLinks,
                    instagram: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://instagram.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.website || ""}
                onChange={(e) =>
                  updateFormData("socialLinks", {
                    ...formData.socialLinks,
                    website: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        )}

        {/* Step 5: Preview */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Preview Your Website</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {formData.businessName}
              </h3>
              <p className="text-gray-600 mb-4">
                <strong>Website URL:</strong>{" "}
                {formData.subdomain && (
                  <span className="text-primary-600">
                    https://{formData.subdomain}.{getBaseDomain()}
                  </span>
                )}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Industry:</strong> {formData.industry}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> {formData.email}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Services:</strong> {(formData.services || []).join(", ")}
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> Your website will be deployed automatically
                in 2-3 minutes after submission.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Site..." : "Launch My Website"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
