// Simple in-memory cache for visited products
class ProductCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(productId: string, data: any) {
    this.cache.set(productId, {
      data,
      timestamp: Date.now(),
    });
  }

  get(productId: string): any | null {
    const cached = this.cache.get(productId);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(productId);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const productCache = new ProductCache();