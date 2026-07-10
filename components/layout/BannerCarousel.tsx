"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Banner {
  id: string
  imageUrl: string
  title: string
  linkUrl?: string
}

interface BannerCarouselProps {
  banners: Banner[]
  className?: string
}

export function BannerCarousel({ banners, className }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  React.useEffect(() => {
    if (banners.length <= 1) return
    if (isPaused) return

    const matchMedia = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (matchMedia.matches) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [banners.length, isPaused])

  if (!banners.length) return null

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className="w-full shrink-0">
            {banner.linkUrl ? (
              <a href={banner.linkUrl} className="block w-full">
                <div className="relative aspect-[4/3] w-full md:aspect-[16/5]">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </a>
            ) : (
              <div className="relative aspect-[4/3] w-full md:aspect-[16/5]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                currentIndex === i ? "bg-brand-500 w-4" : "bg-white/60 hover:bg-white"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
