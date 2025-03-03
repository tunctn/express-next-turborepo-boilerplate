import { redisManager } from "@/lib/redis";

export class AccessValidator {
  private localCache: Record<string, { value: boolean; addedAt: number }> = {};

  private static instance: AccessValidator;

  private constructor() {}

  static getInstance(): AccessValidator {
    if (!AccessValidator.instance) {
      AccessValidator.instance = new AccessValidator();
    }
    return AccessValidator.instance;
  }

  // Local cache
  private addToLocalCache = (key: string, value: boolean): void => {
    // Only cache last 1000 items
    const cacheSize = Object.keys(this.localCache).length;
    if (cacheSize > 5000) {
      const sortedCache = Object.entries(this.localCache).sort((a, b) => a[1].addedAt - b[1].addedAt);
      const key = sortedCache?.[0]?.[0];
      if (key) {
        delete this.localCache[key];
      }
    }

    // Add to cache
    this.localCache[key] = { value, addedAt: Date.now() };
  };
  private removeFromLocalCache = (key: string): void => {
    delete this.localCache[key];
  };
  private getFromLocalCache = (key: string): boolean | undefined => {
    const localCache = this.localCache?.[key];
    if (localCache) {
      return localCache.value;
    }

    return undefined;
  };

  // Generic access to local and redis cache
  private getCacheValue = async (key: string): Promise<boolean | undefined> => {
    // Check local cache, if exists return it
    const localCache = this.getFromLocalCache(key);
    if (localCache !== undefined) return localCache;

    const redis = redisManager.getClient();
    // Check redis, if exists and valid, return it
    const value = await redis.get(key);
    if (value !== null) {
      // If value is true or false, return it
      if (value === "true" || value === "false") {
        const booleanValue = value === "true";
        this.addToLocalCache(key, booleanValue);
        return booleanValue;
      }
      // Otherwise it's a corrupted value, delete it

      await this.removeCacheValue(key);
    }

    return undefined;
  };
  private addCacheValue = async (key: string, value: boolean): Promise<void> => {
    const redis = redisManager.getClient();
    await redis.set(key, value ? "true" : "false");
    await redis.expire(key, 60 * 60 * 24 * 7); // 7 days
    this.addToLocalCache(key, value);
  };
  private removeCacheValue = async (key: string): Promise<void> => {
    const redis = redisManager.getClient();
    await redis.del(key);
    this.removeFromLocalCache(key);
  };

  public async validateAccess({ key, validator }: { key: string; validator: (...args: any[]) => Promise<boolean> }) {
    const cacheValue = await this.getCacheValue(key);
    if (cacheValue !== undefined) return cacheValue;

    // Check access from database
    const hasAccess = await validator(key);

    await this.addCacheValue(key, hasAccess);
    return hasAccess;
  }
}
