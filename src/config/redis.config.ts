import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';

export const RedisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const url: string = configService.get('REDIS_URL') ?? '';
    if (!configService.get('REDIS_URL')) {
      const user = configService.get('REDIS_USER') ?? '';
      const host = configService.get('REDIS_HOST');
      const port = configService.get('REDIS_PORT');
      const password = configService.get('REDIS_PASSWORD');
      // Construimos la URL
      const url = `redis://${user}:${password}@${host}:${port}`;
    }
    return {
      // Usamos 'stores' en plural como dice la nueva doc de Nest
      stores: [
        new Keyv({
          store: new KeyvRedis(url),
        }),
      ],
    };
  },
  inject: [ConfigService],
};
