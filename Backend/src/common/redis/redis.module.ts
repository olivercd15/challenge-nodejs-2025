import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379,
          },
          password: process.env.REDIS_PASSWORD,
          ttl: 60 * 60 * 24,
        });

        return {
          store: () => store,
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
