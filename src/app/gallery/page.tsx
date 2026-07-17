import { galleryService } from "@/lib/db-service";
import GalleryClient from "@/components/gallery-client";

export const revalidate = 0; // Fetch fresh data on load

export default async function GalleryPage() {
  const images = await galleryService.findMany();

  return (
    <div className="py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-semibold mb-3">GALLERY</h1>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Our Work & Creative Space</h2>
          <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
            Browse through some of the professional works, editorial campaigns, and custom setups created in our studio.
          </p>
        </div>

        {/* Gallery Client with Category Filter and Lightbox */}
        <GalleryClient images={images} />
      </div>
    </div>
  );
}
