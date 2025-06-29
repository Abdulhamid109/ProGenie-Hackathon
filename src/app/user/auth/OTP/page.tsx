"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      // Redirect to success page or dashboard
      router.push("/user/pages/homepage");
    } catch (error) {
      setError("Failed to verify OTP: " + error);
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/user/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
        setLoading(false);
        return;
      }
      setError("");
      setLoading(false);
      // Show success message instead of alert
      setError("New OTP sent to your email successfully!");
    } catch (error) {
      console.log('Failed to resend the OTP' + error);
      setError("Failed to resend OTP");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4 shadow-lg shadow-purple-500/25">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Progenie
          </h1>
          <p className="text-gray-400 mt-2">Verify your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8 shadow-purple-500/10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-900/50 rounded-full mb-4 border border-purple-700/50">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify OTP</h2>
            <p className="text-gray-600">
              We&apos;ve sent a 4-digit code to{" "}
              <span className="font-medium text-blue-600">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 text-center text-2xl text-black font-mono tracking-widest border bg-gray-700 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 focus:bg-white"
                placeholder="0000"
                required
                maxLength={4}
                pattern="\d{4}"
              />
            </div>

            {error && (
              <div className={`p-4 rounded-xl border ${
                error.includes("successfully") 
                  ? "bg-green-900/50 border-green-700/50 text-green-300" 
                  : "bg-red-900/50 border-red-700/50 text-red-300"
              }`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    {error.includes("successfully") ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 4}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">Didn&apos;t receive the code?</p>
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline focus:outline-none focus:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Resend OTP
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-300 text-sm font-medium transition-colors duration-200"
            >
              ← Back to signup
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By verifying, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}