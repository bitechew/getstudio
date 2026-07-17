"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
}

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Dynamically compile categories
  const categories = ["All", ...Array.from(new Set(images.map((img) => img.category).filter(Boolean) as string[]))];

  // Filtered list of images
  const filteredImages = selectedCategory === "All"
    ? images
    : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    // We want to find the index in the filtered list
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredImages.length - 1 : prev! - 1));
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === filteredImages.length - 1 ? 0 : prev! + 1));
  };

  return (
    <div className="space-y-8">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
              selectedCategory === category
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-850"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((image, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={image.id}
              onClick={() => openLightbox(idx)}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-sm hover:shadow-md"
            >
              <Image
                src={image.url}
                alt={image.title || "Studio Setup"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white">
                  <Maximize2 size={18} />
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-neutral-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-[10px] text-neutral-300 font-semibold tracking-widest uppercase mb-1">
                  {image.category || "Studio"}
                </p>
                <h3 className="text-xs font-semibold text-white tracking-wide">
                  {image.title || "Creative Work"}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox PopUp */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition z-50"
            >
              <X size={24} />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={prevImage}
              className="absolute left-4 p-3 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition z-50"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[80vh] aspect-[4/3] w-full overflow-hidden rounded-xl"
            >
              <Image
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].title || "Studio Setup"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </motion.div>

            {/* Right Nav Arrow */}
            <button
              onClick={nextImage}
              className="absolute right-4 p-3 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition z-50"
            >
              <ChevronRight size={24} />
            </button>

            {/* Metadata Text */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-white space-y-1">
              <p className="text-[10px] text-neutral-400 tracking-widest uppercase">
                {filteredImages[lightboxIndex].category}
              </p>
              <h3 className="text-sm font-medium tracking-wide">
                {filteredImages[lightboxIndex].title || "Creative Work"}
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
