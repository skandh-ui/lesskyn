import { Redis } from "@upstash/redis";

// Initialize Redis client with error handling
const redis =
  process.env.REDIS_URL && process.env.REDIS_TOKEN
    ? new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
    : null;

// Helper to check if Redis is available
function isRedisAvailable(): boolean {
  if (!redis) {
    console.warn("Redis is not configured. Caching is disabled.");
    return false;
  }
  return true;
}

// TTL constants
const TTL = {
  PRICE: 24 * 60 * 60, // 24 hours in seconds
  DETAILS: 9 * 24 * 60 * 60, // 9 days in seconds
};

interface CachedProductPrice {
  price: number | null;
  cached_at: string;
}

interface CachedProductDetails {
  name: string;
  company: string | null;
  image: string | null;
  cached_at: string;
}

interface CombinedProductCache {
  name: string;
  company: string | null;
  price: number | null;
  image: string | null;
  price_cached_at?: string;
  details_cached_at?: string;
}

/**
 * Generate cache key from Amazon URL
 */
function getCacheKey(url: string, type: "price" | "details"): string {
  // Extract product ID from URL or use hash
  const urlHash = Buffer.from(url).toString("base64").slice(0, 32);
  return `product:${type}:${urlHash}`;
}

/**
 * Get cached product data (combines price + details)
 */
export async function getCachedProduct(
  url: string,
): Promise<CombinedProductCache | null> {
  if (!isRedisAvailable()) return null;

  try {
    const priceKey = getCacheKey(url, "price");
    const detailsKey = getCacheKey(url, "details");

    const [priceData, detailsData] = await Promise.all([
      redis!.get<CachedProductPrice>(priceKey),
      redis!.get<CachedProductDetails>(detailsKey),
    ]);

    // If neither exists, return null
    if (!priceData && !detailsData) {
      return null;
    }

    // Combine cached data
    return {
      name: detailsData?.name || "",
      company: detailsData?.company || null,
      price: priceData?.price || null,
      image: detailsData?.image || null,
      price_cached_at: priceData?.cached_at,
      details_cached_at: detailsData?.cached_at,
    };
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

/**
 * Cache product price (12 hour TTL)
 */
export async function cacheProductPrice(
  url: string,
  price: number | null,
): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const key = getCacheKey(url, "price");
    const data: CachedProductPrice = {
      price,
      cached_at: new Date().toISOString(),
    };

    await redis!.setex(key, TTL.PRICE, JSON.stringify(data));
  } catch (error) {
    console.error("Redis cache price error:", error);
  }
}

/**
 * Cache product details (7 day TTL)
 */
export async function cacheProductDetails(
  url: string,
  details: {
    name: string;
    company: string | null;
    image: string | null;
  },
): Promise<void> {
  if (!isRedisAvailable()) return;

  try {
    const key = getCacheKey(url, "details");
    const data: CachedProductDetails = {
      ...details,
      cached_at: new Date().toISOString(),
    };

    await redis!.setex(key, TTL.DETAILS, JSON.stringify(data));
  } catch (error) {
    console.error("Redis cache details error:", error);
  }
}

/**
 * Cache complete product (both price and details)
 */
export async function cacheCompleteProduct(
  url: string,
  product: {
    name: string;
    company: string | null;
    price: number | null;
    image: string | null;
  },
): Promise<void> {
  await Promise.all([
    cacheProductPrice(url, product.price),
    cacheProductDetails(url, {
      name: product.name,
      company: product.company,
      image: product.image,
    }),
  ]);
}
