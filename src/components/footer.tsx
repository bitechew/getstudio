import Link from "next/link";
import { Camera, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white text-neutral-600 dark:border-neutral-900 dark:bg-neutral-950 dark:text-neutral-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-serif text-lg font-bold tracking-widest text-neutral-950 dark:text-neutral-50">
              GET<span className="font-sans text-xs font-light text-neutral-500 tracking-normal ml-1">STUDIO</span>
            </span>
            <p className="text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
              Minimalist luxury creative space designed for photographers, filmmakers, and brands.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-950 dark:hover:text-white transition">
                <Camera size={18} />
              </a>
              <a href="mailto:hello@getstudio.id" className="hover:text-neutral-950 dark:hover:text-white transition">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 dark:text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-neutral-950 dark:hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-neutral-950 dark:hover:text-white transition">About</Link></li>
              <li><Link href="/pricing" className="hover:text-neutral-950 dark:hover:text-white transition">Pricing</Link></li>
              <li><Link href="/gallery" className="hover:text-neutral-950 dark:hover:text-white transition">Gallery</Link></li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 dark:text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/booking" className="hover:text-neutral-950 dark:hover:text-white transition">Book a Session</Link></li>
              <li><Link href="/contact" className="hover:text-neutral-950 dark:hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/login" className="hover:text-neutral-950 dark:hover:text-white transition">Sign In</Link></li>
              <li><Link href="/dashboard" className="hover:text-neutral-950 dark:hover:text-white text-neutral-500 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 dark:text-white mb-4">Location</h3>
            <p className="flex items-start space-x-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-neutral-400" />
              <span>JL. Ismail Marzuki No.28, Pontianak 78121</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone size={16} className="shrink-0 text-neutral-400" />
              <span>+62 857-1257-2427</span>
            </p>
            <p className="flex items-center space-x-2">
              <Mail size={16} className="shrink-0 text-neutral-400" />
              <span>@getstudioproject</span>
            </p>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 border-t border-neutral-250 dark:border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-neutral-400 dark:text-neutral-500">
            &copy; {currentYear} GET STUDIO. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-neutral-400 dark:text-neutral-500">
            <span className="font-light">Hours: Every day 10:00 AM - 10:00 PM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
