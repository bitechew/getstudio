import Link from "next/link";
import { pricingService } from "@/lib/db-service";
import { Check } from "lucide-react";

export const revalidate = 0; // Fetch fresh data on load

export default async function PricingPage() {
  const pricingOptions = await pricingService.findMany();

  const formatPackagePrice = (price: number) => `${Math.round(price / 1000)}K`;

  const standardIncludes = [
    "Full access to the 2,500 sq ft main studio space",
    "Dedicated makeup and changing area",
    "Access to styling rack and professional garment steamer",
    "Complimentary high-speed Wi-Fi (1Gbps)",
    "Standard paper backdrops (White, Grey, Black)",
    "Complimentary water, tea, and espresso",
  ];

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">PRICING</h1>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Flexible Booking Packages</h2>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
            Pick the package that fits your moment. Each booking includes studio access and the listed photo booth perks with no surprise fees.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingOptions.map((price: any, idx: number) => {
            const isFeatured = price.duration === "Twin" || price.duration === "Crew";
            return (
              <div
                key={price.id || idx}
                className={`bg-white dark:bg-neutral-950 p-8 rounded-2xl border ${
                  isFeatured
                    ? "border-neutral-900 dark:border-neutral-200 ring-1 ring-neutral-900 dark:ring-neutral-200 relative"
                    : "border-neutral-100 dark:border-neutral-900 shadow-sm"
                } flex flex-col justify-between`}
              >
                {price.duration === "Twin" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                    BEST VALUE
                  </span>
                )}
                {price.duration === "Crew" && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                    PRO CHOICE
                  </span>
                )}
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-neutral-450">{price.label}</h3>
                    <p className="text-3xl font-bold mt-2 font-serif">{formatPackagePrice(price.price)}</p>
                    <p className="text-xs text-neutral-500 font-light mt-1">Package: {price.duration}</p>
                  </div>
                  
                  <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed whitespace-pre-line">
                    {price.description}
                  </p>

                  <div className="border-t border-neutral-100 dark:border-neutral-900 pt-6 mb-8">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-neutral-450 mb-3">Includes:</h4>
                    <ul className="space-y-2 text-xs font-light text-neutral-550 dark:text-neutral-400">
                      {standardIncludes.slice(0, price.duration === "Lite" ? 4 : 6).map((inc, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check size={12} className="text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                      {isFeatured && (
                        <li className="flex items-start space-x-2 font-medium text-neutral-900 dark:text-white">
                          <Check size={12} className="shrink-0 mt-0.5 text-neutral-900 dark:text-white" />
                          <span>Priority support & lighting assistant available</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <Link
                  href="/booking"
                  className={`w-full py-3 rounded-full text-center text-xs font-semibold tracking-widest uppercase transition ${
                    isFeatured
                      ? "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
                      : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-850 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  }`}
                >
                  Book This Session
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
