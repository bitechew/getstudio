"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to send your message right now.");
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setSubmitted(false);
      alert(error instanceof Error ? error.message : "Unable to send your message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">CONTACT</h1>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Get In Touch</h2>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
            Have questions about gear, setups, or custom booking hours? Send us a message and we'll reply shortly.
          </p>
        </div>

        {/* Contact Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Info Column */}
          <div className="space-y-8">
            <h3 className="font-serif text-2xl font-bold">Studio Coordinates</h3>
            <p className="text-sm font-light text-neutral-550 dark:text-neutral-400 leading-relaxed">
              GET STUDIO is based in Jakarta and welcomes guests for quick photo booth sessions, portraits, family moments, and group bookings.
            </p>

            <div className="space-y-6 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="text-neutral-450 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Studio Address</h4>
                  <p className="text-neutral-500 dark:text-neutral-450 font-light mt-0.5">
                    JL. Ismail Marzuki No.28, Pontianak 78121
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="text-neutral-450 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Phone & WhatsApp</h4>
                  <p className="text-neutral-500 dark:text-neutral-450 font-light mt-0.5">
                    +62 857-1257-2427 (Call/Text)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="text-neutral-450 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Email Inquiries</h4>
                  <p className="text-neutral-500 dark:text-neutral-450 font-light mt-0.5">
                    @getstudioproject
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="text-neutral-450 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-medium">Business Hours</h4>
                  <p className="text-neutral-500 dark:text-neutral-455 font-light mt-0.5">
                    Every day: 10:00 AM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map Frame (Google Maps placeholder look with luxury borders) */}
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-900 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7610057077426!2d109.33979857501933!3d-0.038575935570220264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d58525b5976b7%3A0x78e1c6670e303441!2sGet%20Coffee!5e0!3m2!1sen!2sid!4v1689254000000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="transition-all"
              ></iframe>
            </div>
          </div>

          {/* Form Column */}
          <div className="bg-neutral-50 dark:bg-neutral-900 p-8 sm:p-10 rounded-3xl border border-neutral-100 dark:border-neutral-900/50 space-y-6 transition-colors">
            <h3 className="font-serif text-2xl font-bold">Send Message</h3>

            {submitted ? (
              <div className="p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl space-y-3">
                <h4 className="text-sm font-semibold text-green-800 dark:text-green-400">Thank you!</h4>
                <p className="text-xs text-green-700 dark:text-green-300 font-light leading-relaxed">
                  Your inquiry has been successfully sent. A studio manager will reach out to you via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 hover:underline pt-2 block"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:border-neutral-850 dark:bg-neutral-950 dark:focus:ring-white transition resize-none"
                    placeholder="Describe your session requests, equipment needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-neutral-900 text-white hover:bg-neutral-850 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-xl text-xs font-semibold tracking-widest uppercase transition flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
