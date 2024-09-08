import { injectable } from "tsyringe";
import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";

dotenv.config();

@injectable()
export class CacheService {
  private cache!: RedisClientType;
  private readonly DEFAULT_TTL = 300; // 5 minutes

  constructor() {
    this.createRedisClient();
  }

  async createRedisClient() {
    (async () => {
      this.cache = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          tls: false,
        },
      });

      this.cache.on("error", (error: any) => console.error(`Error : ${error}`));

      await this.cache.connect();
    })();
  }

  /**
   * Get a value from the cache
   *
   * @param key
   * @returns value
   */
  async get(key: string): Promise<string | null> {
    const result = await this.cache.get(key);

    console.info(result ? `Key ${key} retrieved from cache` : `Key ${key} not found in cache`);

    return result ?? null;
  }

  /**
   * Set a key-value pair in the cache
   *
   * @param key
   * @param value
   * @param ttl
   */
  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    await this.cache.set(key, value, { EX: ttl });
    console.info(`Key ${key} set in cache`);
  }

  /**
   * Delete a key from the cache
   *
   * @param key
   */
  async del(key: string): Promise<void> {
    await this.cache.del(key);
    console.info(`Key ${key} deleted from cache`);
  }

  /**
   * Flush all keys from the cache
   */
  async flushAll(): Promise<void> {
    await this.cache.flushAll();
    console.info(`All keys deleted from cache`);
  }
}
