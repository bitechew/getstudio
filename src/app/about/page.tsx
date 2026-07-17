import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">ABOUT US</h1>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">The Space & The Vision</h2>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
            GET STUDIO is a modern photography studio in Jakarta designed for quick, stylish, and easy bookings for personal portraits, family moments, and group sessions.
          </p>
        </div>

        {/* Banner Image */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900">
          <Image
            src="https://images.unsplash.com/photo-1616448242650-7140735e3648?q=80&w=1600"
            alt="Studio Loft Space"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Narrative & Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">Our Philosophy</h3>
            <p className="text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We believe that a creative space should feel effortless and welcoming. That is why GET STUDIO combines clean backdrops, comfortable setups, and flexible packages for everything from solo portraits to lively group shoots.
            </p>
            <p className="text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Our space is easy to customize for different moods and group sizes. We take care of the setup so you can focus on enjoying the session and getting your best shots.
            </p>
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
            <Image
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800"
              alt="Editorial setup"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Amenities Grid */}
        <div className="bg-neutral-50 dark:bg-neutral-900 p-10 sm:p-12 rounded-3xl space-y-8 transition-colors">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="font-serif text-2xl font-bold">Studio Amenities</h3>
            <p className="text-xs text-neutral-500 mt-2">All bookings include access to the following amenities:</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-1">Fast Wi-Fi</h4>
              <p className="text-[10px] text-neutral-400 font-light">1Gbps Fiber connection</p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-1">Makeup Desk</h4>
              <p className="text-[10px] text-neutral-400 font-light">Lighted mirrors & chairs</p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-1">Private Bath</h4>
              <p className="text-[10px] text-neutral-400 font-light">With shower and changing space</p>
            </div>
            <div className="p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
              <h4 className="text-xs font-semibold tracking-wider uppercase mb-1">Refreshments</h4>
              <p className="text-[10px] text-neutral-400 font-light">Complimentary espresso & water</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <h3 className="font-serif text-xl sm:text-2xl font-bold mb-4">Ready to Create with Us?</h3>
          <Link
            href="/booking"
            className="inline-flex px-8 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-full text-xs font-semibold tracking-widest uppercase shadow transition"
          >
            Book Your Session
          </Link>
        </div>

      </div>
    </div>
  );
}
