import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
@Injectable()
export class RedisManagerService implements OnModuleInit {
    // Ahora el tag del log también dirá RedisConnection
  private readonly logger = new Logger('RedisConnection');

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async onModuleInit() {
    try {
      await this.cacheManager.set('startup_check', 'ok', 10);
      this.logger.log('Redis: Connection established successfully');
    } catch (error) {
      this.logger.error(' Redis: Connection failed. Is the Docker container running?');
      this.logger.error(`Details: ${error.message}`);
    }
  }
}
