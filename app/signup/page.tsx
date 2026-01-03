import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import SignupForm from "./_components/signup-form";

export default async function SignupPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 5H3a2 2 0 00-2 2v9a2 2 0 002 2h1a3 3 0 106 0h4a3 3 0 106 0h1a2 2 0 002-2V7a2 2 0 00-2-2zM6 18.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm10 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">School Bus Monitor</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
