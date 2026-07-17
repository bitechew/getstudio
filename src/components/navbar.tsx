"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/app/providers";
import { Sun, Moon, Menu, X, User, LogOut, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Gallery", href: "/gallery" },
    { name: "Book Now", href: "/booking" },
    { name: "Contact", href: "/contact" },
  ];

  const userRole = (session?.user as any)?.role;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/75 backdrop-blur-md dark:border-neutral-800/50 dark:bg-neutral-950/75 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="font-serif text-xl font-bold tracking-widest text-neutral-900 dark:text-neutral-50">
                GET<span className="font-sans text-xs font-light text-neutral-500 tracking-normal ml-1">STUDIO</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? "text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white pb-1 pt-1"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-850 transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Session links */}
            {session ? (
              <div className="flex items-center space-x-3">
                {userRole === "ADMIN" ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-neutral-900 text-neutral-50 hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-medium tracking-wider transition"
                  >
                    <span>DASHBOARD</span>
                  </Link>
                ) : (
                  <Link
                    href="/my-bookings"
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 text-xs font-medium tracking-wider transition"
                  >
                    <Calendar size={12} />
                    <span>MY BOOKINGS</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-full text-red-500 hover:text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1 px-4 py-2 rounded-full border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white dark:border-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-200 dark:hover:text-neutral-950 text-xs font-medium tracking-widest transition"
              >
                <User size={12} />
                <span>SIGN IN</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white focus:outline-none"
              aria-label="Main menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-white"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-neutral-200 dark:border-neutral-800 my-2 pt-2">
                {session ? (
                  <>
                    {userRole === "ADMIN" ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900"
                      >
                        Dashboard (Admin)
                      </Link>
                    ) : (
                      <Link
                        href="/my-bookings"
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-900"
                      >
                        My Bookings
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    Sign In / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
