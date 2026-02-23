interface StoreCache {
  [storeSlug: string]: {
    seller: any;
    products: any[];
    timestamp: number;
  };
}

const CACHE_KEY = "yog_store_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedStore(storeSlug: string) {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const cache: StoreCache = JSON.parse(cached);
    const storeData = cache[storeSlug];

    if (!storeData) return null;

    const age = Date.now() - storeData.timestamp;
    if (age > CACHE_DURATION) return null;

    console.log(`⚡ Using cached store data (${Math.round(age / 1000)}s old)`);
    return storeData;
  } catch (error) {
    return null;
  }
}

export function setCachedStore(storeSlug: string, seller: any, products: any[]) {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cache: StoreCache = cached ? JSON.parse(cached) : {};

    cache[storeSlug] = {
      seller,
      products,
      timestamp: Date.now(),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log("💾 Store data cached");
  } catch (error) {
    console.error("Failed to cache store:", error);
  }
}