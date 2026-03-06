import { Module } from '@nestjs/common';
import { RedisManagerService } from './redis-manager.service';

@Module({
  providers: [RedisManagerService]
})
export class RedisManagerModule {}
