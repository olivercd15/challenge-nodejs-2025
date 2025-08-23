import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

export function CacheResponse(key?: string, ttl?: number) {
  return applyDecorators(
    UseInterceptors(CacheInterceptor),
    key ? CacheKey(key) : () => {},
    ttl ? CacheTTL(ttl) : () => {},
  );
}
