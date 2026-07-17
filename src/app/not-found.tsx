import Link from "next/link";
import { ArrowRight, Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center py-32 px-4 text-center bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-md space-y-6">
        
        {/* Decorative Icon */}
        <div className="inline-flex p-4 rounded-full bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 mb-2">
          <Film size={36} strokeWidth={1.2} />
        </div>

        {/* Text */}
        <h1 className="font-serif text-8xl font-bold tracking-tight text-neutral-900 dark:text-white">
          404
        </h1>
        <h2 className="text-xl font-serif font-semibold text-neutral-800 dark:text-neutral-200">
          Capture Lost
        </h2>
        <p className="text-sm font-light text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
          The creative angle you are looking for doesn't exist, or the page has been relocated.
        </p>

        {/* Action button */}
        <div className="pt-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-full text-xs font-semibold tracking-widest uppercase transition-all group"
          >
            <span>Return Home</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
