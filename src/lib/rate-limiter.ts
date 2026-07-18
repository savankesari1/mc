/**
 * Simple in-memory rate limiter using sliding windows.
 * Suitable for single-instance or serverless environments.
 */

interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
  backoffBaseSeconds?: number;
}

interface Bucket {
  count: number;
  firstRequest: number; // ms timestamp
  lastReject?: number;  // ms timestamp
  consecutiveRejects: number;
}

const store = new Map<string, Bucket>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store.entries()) {
    // If the bucket hasn't seen activity in its window AND isn't currently backed off
    if (now - bucket.firstRequest > 15 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a request should be allowed.
 * Returns { allowed, retryAfter } where retryAfter is in seconds if allowed=false.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  let bucket = store.get(key);
  
  if (!bucket) {
    bucket = { count: 1, firstRequest: now, consecutiveRejects: 0 };
    store.set(key, bucket);
    return { allowed: true };
  }

  // Check if we are in an exponential backoff period
  if (bucket.lastReject && config.backoffBaseSeconds) {
    const backoffMs = Math.min(
      Math.pow(config.backoffBaseSeconds, bucket.consecutiveRejects) * 1000,
      15 * 60 * 1000 // cap at 15 minutes
    );
    
    if (now - bucket.lastReject < backoffMs) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil((backoffMs - (now - bucket.lastReject)) / 1000) 
      };
    }
  }

  // Reset window if expired
  if (now - bucket.firstRequest > windowMs) {
    bucket.count = 1;
    bucket.firstRequest = now;
    // We do NOT reset consecutiveRejects here to maintain backoff memory
    store.set(key, bucket);
    return { allowed: true };
  }

  // Increment and check limits
  bucket.count++;
  if (bucket.count > config.maxRequests) {
    bucket.lastReject = now;
    bucket.consecutiveRejects++;
    store.set(key, bucket);
    
    // Calculate retryAfter
    if (config.backoffBaseSeconds) {
       const nextBackoff = Math.min(
         Math.pow(config.backoffBaseSeconds, bucket.consecutiveRejects) * 1000,
         15 * 60 * 1000
       );
       return { allowed: false, retryAfter: Math.ceil(nextBackoff / 1000) };
    }
    
    return { 
      allowed: false, 
      retryAfter: Math.ceil((windowMs - (now - bucket.firstRequest)) / 1000) 
    };
  }

  // Success — reset backoff tracking since they had a legitimate successful request
  bucket.consecutiveRejects = 0;
  bucket.lastReject = undefined;
  store.set(key, bucket);
  
  return { allowed: true };
}

export const RATE_LIMIT_CONFIG = {
  auth: {
    perIp: { windowSeconds: 900, maxRequests: Number(process.env.RATE_LIMIT_AUTH_IP_MAX ?? 10) },
    perAccount: { windowSeconds: 900, maxRequests: Number(process.env.RATE_LIMIT_AUTH_ACCOUNT_MAX ?? 5) },
    backoffBase: Number(process.env.RATE_LIMIT_AUTH_BACKOFF_BASE ?? 2),
  },
  public: {
    perIp: { windowSeconds: 60, maxRequests: Number(process.env.RATE_LIMIT_PUBLIC_IP_MAX ?? 60) },
  },
  authenticated: {
    perIp: { windowSeconds: 60, maxRequests: Number(process.env.RATE_LIMIT_AUTH_USER_MAX ?? 120) },
  },
};
