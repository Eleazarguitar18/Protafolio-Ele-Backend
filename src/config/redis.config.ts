import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisStore from '@keyv/redis';
import { Logger } from '@nestjs/common';

export const RedisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisConfig'); // Opcional: para que se vea como un log de Nest
    
    const url = `redis://:${configService.get('REDIS_PASSWORD')}@${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`;
    
    logger.log(`Intentando conectar a Redis en ${configService.get('REDIS_HOST')}...`);
    
    return {
      store: redisStore,
      url: url,
      ttl: configService.get<number>('REDIS_TTL') || 900000,
    };
  },
  inject: [ConfigService],
};