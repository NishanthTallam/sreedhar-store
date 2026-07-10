// lib/cache.ts
// Simple Upstash Redis caching utility
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * Get cached data or fetch from source and cache it.
 * Simple key-value caching with TTL (time-to-live in seconds).
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 60
): Promise<T> {
  try {
    const cachedData = await redis.get<T>(key);
    if (cachedData !== null && cachedData !== undefined) {
      return cachedData;
    }
  } catch (error) {
    // If Redis is down, just fetch from source
    console.warn("[CACHE] Redis read failed, falling back to source:", error);
  }

  const data = await fetcher();

  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch (error) {
    console.warn("[CACHE] Redis write failed:", error);
  }

  return data;
}

/**
 * Invalidate (delete) one or more cache keys.
 */
export async function invalidateCache(...keys: string[]): Promise<void> {
  try {
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.warn("[CACHE] Redis delete failed:", error);
  }
}

// Common cache keys
export const CACHE_KEYS = {
  HOMEPAGE_CATEGORIES: "homepage:categories",
  HOMEPAGE_PRODUCTS: "homepage:products",
  HOMEPAGE_BANNERS: "homepage:banners",
  ALL_CATEGORIES: "all:categories",
  ALL_BRANDS: "all:brands",
  STORE_SETTINGS: "store:settings",
  DASHBOARD_KPI: "dashboard:kpi",
} as const;
