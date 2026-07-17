"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        setLoading(false);
        if (session?.user?.role === "ADMIN") {
          router.push("/dashboard");
        } else {
          router.push("/my-bookings");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
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
            Welcome Back
          </h2>
          <p className="text-xs font-light text-neutral-500 dark:text-neutral-400">
            Sign in to manage your studio booking and settings
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start space-x-2 text-xs text-red-700 dark:text-red-400">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error === "CredentialsSignin" ? "Invalid email or password." : error}</span>
          </div>
        )}

        {/* Form */}
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-neutral-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-white hover:bg-neutral-850 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs font-light text-neutral-500 dark:text-neutral-450 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-neutral-900 dark:text-white hover:underline"
          >
            Register here
          </Link>
        </p>

        {/* Demo Credentials hint */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mt-6 text-[10px] text-neutral-400 dark:text-neutral-500 space-y-1 font-light text-center">
          <p className="font-semibold uppercase tracking-wider">Demo Credentials</p>
          <p>Admin: <span className="font-mono select-all">admin@studio.com</span> / <span className="font-mono">Admin123!</span></p>
          <p>Customer: <span className="font-mono select-all">customer@studio.com</span> / <span className="font-mono">Customer123!</span></p>
        </div>

      </div>
    </div>
  );
}
