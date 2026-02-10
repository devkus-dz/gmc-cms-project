import NodeCache from 'node-cache';
import { logger } from '../utils/logger.js';

class CacheService {
    constructor(ttlSeconds = 600) {
        // stdTTL: Standard Time To Live (default 10 minutes / 600 seconds)
        this.cache = new NodeCache({
            stdTTL: ttlSeconds,
            checkperiod: ttlSeconds * 0.2,
            useClones: false
        });
    }

    /**
     * Get value from cache
     * @param {string} key - Unique key
     * @returns {any|undefined} - The cached value or undefined
     */
    get(key) {
        const value = this.cache.get(key);
        if (value) {
            logger.info(`⚡ Cache HIT for key: ${key}`);
        } else {
            logger.info(`🐢 Cache MISS for key: ${key}`);
        }
        return value;
    }

    /**
     * Set value in cache
     * @param {string} key - Unique key
     * @param {any} value - Data to store
     * @param {number} [ttl] - Optional custom TTL in seconds
     */
    set(key, value, ttl) {
        // If ttl is provided, use it; otherwise use default
        if (ttl) {
            this.cache.set(key, value, ttl);
        } else {
            this.cache.set(key, value);
        }
        logger.info(`💾 Cached data for key: ${key}`);
    }

    /**
     * Delete a specific key
     * @param {string} key 
     */
    del(key) {
        this.cache.del(key);
        logger.info(`🗑️ Deleted cache key: ${key}`);
    }

    /**
     * Flush all data (Clear cache)
     * Use this when creating/updating content to ensure users get fresh data
     */
    flush() {
        this.cache.flushAll();
        logger.info('🧹 Cache Flushed (All data cleared)');
    }
}

// Export as a Singleton (One instance for the whole app)
export default new CacheService();