import Link from "next/link";
import Image from "next/image";
import { galleryService, testimonialService, pricingService } from "@/lib/db-service";
import { Camera, Shield, Zap, Sparkles, ChevronRight, Clock, HelpCircle } from "lucide-react";
import HomeClient from "@/components/home-client";

export const revalidate = 0; // Fetch fresh data on load

export default async function HomePage() {
  // Fetch pricing, gallery, and testimonials in parallel server-side
  const pricingOptions = await pricingService.findMany();
  const galleryItems = await galleryService.findMany();
  const testimonials = await testimonialService.findMany();

  // Get first 3 gallery items for preview
  const galleryPreview = galleryItems.slice(0, 3);
  const featuredPricing = pricingOptions.filter(
    (p: any) => p.duration === "Lite" || p.duration === "Twin" || p.duration === "Squad"
  );
  const formatPackagePrice = (price: number) => `${Math.round(price / 1000)}K`;

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />,
      title: "Stunning Natural Light",
      desc: "Large south and west-facing industrial windows providing soft, diffused daylight all day long.",
    },
    {
      icon: <Camera className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />,
      title: "Premium Lighting Equipment",
      desc: "Equipped with Profoto monolights, modifiers, softboxes, and color backdrops ready for use.",
    },
    {
      icon: <Zap className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />,
      title: "Spacious Open Layout",
      desc: "Over 2,500 sq. ft. of shooting space with 14ft high ceilings, concrete floors, and industrial columns.",
    },
    {
      icon: <Shield className="h-6 w-6 text-neutral-900 dark:text-neutral-50" />,
      title: "Private Styling Area",
      desc: "Includes a dedicated makeup station, lighted mirrors, garment steamer, and private changing room.",
    },
  ];

  const faqs = [
    {
      q: "What is included in the studio rental?",
      a: "All rentals include full access to the main shooting space, the makeup and styling area, high-speed Wi-Fi, garment steamer, and our standard selection of paper backdrops (white, grey, black). Studio lighting and premium modifiers can be added to your booking or selected from our equipment rack.",
    },
    {
      q: "Can I book outside of the standard operating hours?",
      a: "Our online booking system allows reservations strictly between 10:00 AM and 10:00 PM every day. For special production requests requiring after-hours access (night shoots, early setups), please contact us directly via our Contact page.",
    },
    {
      q: "What is your cancellation and rescheduling policy?",
      a: "You can cancel or reschedule your session up to 24 hours before your start time by logging into your account and visiting the 'My Bookings' tab. Cancellations made within 24 hours of the session are non-refundable.",
    },
    {
      q: "Can I bring pets or set up water/smoke elements?",
      a: "Pets are allowed but must be disclosed in the booking notes. Wet shoots, glitter, paint, smoke machines, or other messy concepts must receive prior written approval from the studio manager to avoid a cleaning fee.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1600"
            alt="Photography Studio Loft"
            fill
            priority
            className="object-cover brightness-[0.35] dark:brightness-[0.25]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-300 font-medium">
            CREATIVE SPACE FOR PHOTOGRAPHY & FILM
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
            Book Your Session at <br />GET STUDIO
          </h1>
          <p className="text-neutral-300 text-sm sm:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Enjoy a modern Jakarta photo studio experience with flexible packages, fast booking, and premium photo booth options.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-neutral-900 font-medium text-sm tracking-wider hover:bg-neutral-200 transition-colors uppercase"
            >
              Book Now
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/50 text-white font-medium text-sm tracking-wider hover:bg-white/10 transition-all uppercase"
            >
              View Space
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3">
              THE STUDIO
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              Designed For Every Moment
            </h3>
            <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-2">
              Everything you need for a professional portrait, casual selfie, family moment, or group celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-950 p-8 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm hover:shadow-md transition"
              >
                <div className="inline-flex p-3 rounded-full bg-neutral-50 dark:bg-neutral-900 mb-6">
                  {feat.icon}
                </div>
                <h4 className="text-base font-medium text-neutral-900 dark:text-white mb-2">
                  {feat.title}
                </h4>
                <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16">
            <div>
              <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3">
                THE SPACE
              </h2>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                Gallery Preview
              </h3>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-1 text-sm font-medium text-neutral-900 dark:text-white hover:opacity-75 transition mt-4 sm:mt-0 group"
            >
              <span>View Full Gallery</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryPreview.map((item: any, idx: number) => (
              <div
                key={item.id || idx}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900"
              >
                <Image
                  src={item.url}
                  alt={item.title || "Studio Setup"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-xs text-neutral-300 font-medium tracking-wide uppercase mb-1">
                    {item.category || "Studio"}
                  </p>
                  <h4 className="text-sm font-medium text-white">{item.title || "Creative Session"}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3">
              RATES
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              Simple, Transparent Packages
            </h3>
            <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-2">
              Book the exact package you need. No hidden fees. Includes studio amenities and printed keepsakes where listed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredPricing.map((price: any, idx: number) => (
              <div
                key={price.id || idx}
                className={`bg-white dark:bg-neutral-950 p-8 rounded-2xl border ${
                  price.duration === "Twin"
                    ? "border-neutral-900 dark:border-neutral-200 ring-1 ring-neutral-900 dark:ring-neutral-200 relative"
                    : "border-neutral-100 dark:border-neutral-900"
                } shadow-sm flex flex-col justify-between`}
              >
                {price.duration === "Twin" && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                    {price.label}
                  </h4>
                  <div className="flex items-baseline space-x-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                      {formatPackagePrice(price.price)}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-xs font-light font-sans ml-1">
                      / {price.duration}
                    </span>
                  </div>
                  <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed whitespace-pre-line">
                    {price.description}
                  </p>
                </div>
                <Link
                  href="/booking"
                  className={`w-full py-3 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition-colors ${
                    price.duration === "Twin"
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                      : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  }`}
                >
                  Book Session
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & FAQs Section */}
      <section className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Testimonials */}
            <div className="space-y-12">
              <div>
                <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3">
                  REVIEWS
                </h2>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                  Client Experiences
                </h3>
              </div>

              <div className="space-y-8">
                {testimonials.slice(0, 2).map((t: any, idx: number) => (
                  <div key={t.id || idx} className="border-l-2 border-neutral-300 dark:border-neutral-800 pl-6 space-y-4">
                    <p className="font-serif italic text-neutral-750 dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="flex items-center space-x-3">
                      {t.avatar && (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-neutral-100">
                          <Image
                            src={t.avatar}
                            alt={t.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-900 dark:text-white">{t.name}</h4>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Accordion */}
            <div>
              <div className="mb-12">
                <h2 className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-semibold mb-3">
                  QUESTIONS
                </h2>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
                  Frequently Asked Questions
                </h3>
              </div>

              {/* Accordion Component Client side rendering */}
              <HomeClient faqs={faqs} />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
