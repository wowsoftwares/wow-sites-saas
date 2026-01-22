"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBaseDomain } from "@/lib/constants";

interface Client {
  id: string;
  businessName: string;
  subdomain: string;
  industry: string;
  email: string;
  phone: string;
  address?: string | null;
  aboutUs: string;
  services: string[];
  status: string;
  deploymentUrl?: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await fetch(`/api/client/${clientId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch client data");
      }
      const data = await response.json();
      setClient(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Client not found"}
          </h1>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const websiteUrl =
    client.deploymentUrl || `https://${client.subdomain}.${getBaseDomain()}`;
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    deploying: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your website</p>
        </div>

        {/* Website Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Your Website
              </h2>
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-lg break-all"
              >
                {websiteUrl}
              </a>
              <div className="mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[client.status as keyof typeof statusColors] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </div>
            </div>
            {client.status === "active" && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Business Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Business Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Business Name</p>
              <p className="font-semibold text-gray-900">{client.businessName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Industry</p>
              <p className="font-semibold text-gray-900 capitalize">
                {client.industry}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <p className="font-semibold text-gray-900">{client.phone}</p>
            </div>
            {client.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Address</p>
                <p className="font-semibold text-gray-900">{client.address}</p>
              </div>
            )}
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">About Us</p>
              <p className="text-gray-900">{client.aboutUs}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Services</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(client.services) &&
                  client.services.map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Editing Coming Soon
          </h3>
          <p className="text-blue-800">
            We're working on adding the ability to edit your website content
            directly from this dashboard. For now, if you need to make changes,
            please contact our support team.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Created on{" "}
            {new Date(client.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
