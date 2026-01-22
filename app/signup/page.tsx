import SignupForm from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your Website
          </h1>
          <p className="text-xl text-gray-600">
            Fill in your business information and get a professional website in
            minutes
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
