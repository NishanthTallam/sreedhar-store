"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BannerCarousel() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) {
        const json = await res.json();
        // Only show HOMEPAGE and FESTIVAL on the main carousel, or all. 
        // We'll show all active banners.
        setBanners(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch banners", err);
    }
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-surface-100 rounded-2xl aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1]">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {banner.linkUrl ? (
            <Link href={banner.linkUrl} className="block w-full h-full">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
            </Link>
          ) : (
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
          )}
          
          {/* Optional Overlay Text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none flex items-end">
            <div className="p-6 md:p-8">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-white uppercase bg-brand-600 rounded-full">
                {banner.type}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white shadow-sm">{banner.title}</h2>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
