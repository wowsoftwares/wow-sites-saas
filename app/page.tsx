import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Websites in{" "}
            <span className="text-primary-600">Minutes</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Sign up, enter your information, and get a beautiful website
            deployed automatically. No coding required.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your account and choose your subdomain
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enter Info</h3>
              <p className="text-gray-600">
                Fill in your business details and choose a template
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Site Goes Live</h3>
              <p className="text-gray-600">
                Your website is automatically deployed in 2-3 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Choose Your Template
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Restaurant</h3>
                <p className="text-gray-600 mb-4">
                  Perfect for restaurants, cafes, and food businesses
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Menu showcase</li>
                  <li>• Location section</li>
                  <li>• Contact form</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Hair Salon</h3>
                <p className="text-gray-600 mb-4">
                  Ideal for salons, spas, and beauty services
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Services grid</li>
                  <li>• Business hours</li>
                  <li>• Gallery section</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-gray-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Plumber</h3>
                <p className="text-gray-600 mb-4">
                  Great for contractors and service businesses
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Service list</li>
                  <li>• Service area</li>
                  <li>• Emergency contact</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Simple Pricing
          </h2>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 border-2 border-primary-200">
            <div className="text-5xl font-bold text-primary-600 mb-4">
              €29<span className="text-2xl text-gray-600">/month</span>
            </div>
            <p className="text-xl text-gray-700 mb-6">
              Everything you need to get online
            </p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Professional website
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom subdomain
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Contact form
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Mobile responsive
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Email support
              </li>
            </ul>
            <Link
              href="/signup"
              className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2024 WOW Sites. All rights reserved.</p>
      </footer>
    </div>
  );
}
