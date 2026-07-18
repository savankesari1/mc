import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { ServerError } from "@/lib/server-error";
import { checkRateLimit, RATE_LIMIT_CONFIG } from "./rate-limiter";

/** Helper to extract IP from request */
function getClientIp(): string {
  const req = getRequest();
  if (!req?.headers) return "unknown";
  
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function handleReject(retryAfter?: number): never {
  throw new ServerError("Too many requests. Please try again later.", {
    statusCode: 429,
    internal: `Rate limit exceeded. Retry after ${retryAfter}s`,
  });
}

/**
 * Middleware for unauthenticated public endpoints.
 * Limits by IP address.
 */
export const withPublicRateLimit = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const ip = getClientIp();
  const { allowed, retryAfter } = checkRateLimit(`public:${ip}`, {
    windowSeconds: RATE_LIMIT_CONFIG.public.perIp.windowSeconds,
    maxRequests: RATE_LIMIT_CONFIG.public.perIp.maxRequests,
  });

  if (!allowed) handleReject(retryAfter);
  return next();
});

/**
 * Middleware for authenticated user endpoints.
 * Requires `userId` in context (must be chained after `requireSupabaseAuth`).
 * Limits by user ID (stricter limit than public, but more generous than auth).
 */
export const withUserRateLimit = createMiddleware({ type: "function" }).server(async ({ next, context }) => {
  const userId = (context as { userId?: string }).userId;
  if (!userId) {
    throw new ServerError("Authentication required to check rate limit.");
  }

  const { allowed, retryAfter } = checkRateLimit(`user:${userId}`, {
    windowSeconds: RATE_LIMIT_CONFIG.authenticated.perIp.windowSeconds,
    maxRequests: RATE_LIMIT_CONFIG.authenticated.perIp.maxRequests,
  });

  if (!allowed) handleReject(retryAfter);
  return next();
});

/**
 * Middleware for sensitive auth endpoints (login, signup, reset).
 * Limits by IP and Account ID with exponential backoff.
 * Note: Must be provided account identifier (e.g. email) via context if applicable.
 */
export const withAuthRateLimit = createMiddleware({ type: "function" }).server(async ({ next, context }) => {
  const ip = getClientIp();
  const identifier = (context as { identifier?: string }).identifier; // e.g. email from request body

  // Check IP limit
  const ipCheck = checkRateLimit(`auth:ip:${ip}`, {
    windowSeconds: RATE_LIMIT_CONFIG.auth.perIp.windowSeconds,
    maxRequests: RATE_LIMIT_CONFIG.auth.perIp.maxRequests,
    backoffBaseSeconds: RATE_LIMIT_CONFIG.auth.backoffBase,
  });
  if (!ipCheck.allowed) handleReject(ipCheck.retryAfter);

  // Check Account limit (if identifier provided)
  if (identifier) {
    const accountCheck = checkRateLimit(`auth:acc:${identifier}`, {
      windowSeconds: RATE_LIMIT_CONFIG.auth.perAccount.windowSeconds,
      maxRequests: RATE_LIMIT_CONFIG.auth.perAccount.maxRequests,
      backoffBaseSeconds: RATE_LIMIT_CONFIG.auth.backoffBase,
    });
    if (!accountCheck.allowed) handleReject(accountCheck.retryAfter);
  }

  return next();
});
