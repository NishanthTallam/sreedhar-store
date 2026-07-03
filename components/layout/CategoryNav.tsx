"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
  name: string
  slug: string
}

interface CategoryNavProps {
  categories: Category[]
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const pathname = usePathname()

  if (!categories || categories.length === 0) return null

  return (
    <div className="sticky top-16 z-30 w-full border-b border-neutral-200 bg-white shadow-sm md:top-[65px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center overflow-x-auto py-2 no-scrollbar">
          <nav className="flex items-center gap-6 whitespace-nowrap">
            {categories.map((category) => {
              const href = `/category/${category.slug}`
              const isActive = pathname === href
              return (
                <Link
                  key={category.slug}
                  href={href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-600 pb-2 border-b-2 border-transparent",
                    isActive ? "text-brand-600 border-brand-500" : "text-neutral-600"
                  )}
                >
                  {category.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
