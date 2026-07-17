"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-8 sm:p-10 rounded-3xl border border-neutral-100 dark:border-neutral-850 shadow-sm transition-colors">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="font-serif text-lg font-bold tracking-widest text-neutral-950 dark:text-neutral-50">
            GET<span className="font-sans text-xs font-light text-neutral-500 tracking-normal ml-1">STUDIO</span>
          </span>
          <h2 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white mt-4">
            Reset Password
          </h2>
          <p className="text-xs font-light text-neutral-500 dark:text-neutral-400">
            We will email you link instructions to reset your password
          </p>
        </div>

        {submitted ? (
          <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-2xl text-center space-y-4">
            <div className="inline-flex p-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full">
              <Mail size={20} />
            </div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Check Your Email</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              If <span className="font-mono text-neutral-850 dark:text-neutral-200">{email}</span> matches an account in our system, we've sent password reset instructions.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline mt-2"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-neutral-900 text-white hover:bg-neutral-850 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-205 rounded-xl text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center space-x-2"
            >
              <Send size={12} />
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            </button>
          </form>
        )}

        {/* Back to sign in */}
        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={14} />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
