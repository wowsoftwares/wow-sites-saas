"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getBaseDomain } from "@/lib/constants";

interface ClientStatus {
  status: string;
  deploymentUrl?: string | null;
  subdomain?: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("clientId");
  const [client, setClient] = useState<ClientStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClientStatus = async () => {
    if (!clientId) return;

    try {
      const response = await fetch(`/api/client-status?clientId=${clientId}`);
      if (response.ok) {
        const data = await response.json();
        setClient(data);
        setLoading(false);

        // If status is active, we can stop refreshing (optional)
        if (data.status === "active") {
          // Could clear interval here if needed
        }
      }
    } catch (error) {
      console.error("Error fetching client status:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!clientId) {
      router.push("/signup");
      return;
    }

    // Fetch initial client status
    fetchClientStatus();

    // Set up auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchClientStatus();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

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

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Client not found
          </h1>
          <Link
            href="/signup"
            className="text-primary-600 hover:text-primary-700"
          >
            Go back to signup
          </Link>
        </div>
      </div>
    );
  }

  const websiteUrl = client.deploymentUrl || `https://${client.subdomain}.${getBaseDomain()}`;
  const isActive = client.status === "active";

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {isActive ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Website is Live! 🎉
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your website has been successfully deployed and is now live.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your website URL:</p>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-lg font-semibold break-all"
                >
                  {websiteUrl}
                </a>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Visit Your Website
                </a>
                {clientId && (
                  <Link
                    href={`/dashboard/${clientId}`}
                    className="inline-block bg-gray-200 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Your Website is Being Created!
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                We&apos;re setting up your website. This usually takes 2-3 minutes.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Your website will be at:</p>
                <p className="text-primary-600 text-lg font-semibold break-all">
                  {client.subdomain && `https://${client.subdomain}.${getBaseDomain()}`}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800">
                  <strong>Status:</strong>{" "}
                  {client.status === "pending"
                    ? "Pending deployment"
                    : client.status === "deploying"
                    ? "Deploying..."
                    : "Processing"}
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                We&apos;ll send you an email confirmation once your website is live.
                This page will automatically update when your site is ready.
              </p>
              {clientId && (
                <Link
                  href={`/dashboard/${clientId}`}
                  className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Go to Dashboard
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
