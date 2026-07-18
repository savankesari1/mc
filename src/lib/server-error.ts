/**
 * Server-side error sanitization.
 *
 * Every server function handler should wrap its body with `handleServerError`
 * so users never see stack traces, internal paths, or raw DB errors.
 * Full details are always logged server-side for debugging.
 */

/** Error with separate user-safe and internal messages. */
export class ServerError extends Error {
  public readonly userMessage: string;
  public readonly statusCode: number;

  constructor(userMessage: string, opts?: { internal?: string; statusCode?: number; cause?: unknown }) {
    super(opts?.internal ?? userMessage, { cause: opts?.cause });
    this.name = "ServerError";
    this.userMessage = userMessage;
    this.statusCode = opts?.statusCode ?? 500;
  }
}

/**
 * Map of known safe error messages that can be forwarded to the user as-is.
 * Anything NOT in this set gets replaced with a generic message.
 */
const SAFE_USER_MESSAGES = new Set([
  "Resource not found",
  "Resource unavailable",
  "Resource is free — no payment needed",
  "You have already purchased this resource",
  "Payment signature verification failed",
  "You haven't purchased this resource yet",
  "No file has been attached to this resource yet",
  "Could not generate download link",
  "Authentication required",
]);

/** Generic fallback the user sees when we can't identify the error. */
const GENERIC_MESSAGE = "Something went wrong. Please try again.";

/**
 * Sanitize any error into a user-safe message.
 * Logs the full error server-side, returns only a safe string for the client.
 */
export function sanitizeError(error: unknown): string {
  // Already a ServerError — we trust the userMessage.
  if (error instanceof ServerError) {
    console.error(`[ServerError] ${error.userMessage}`, error);
    return error.userMessage;
  }

  const msg = error instanceof Error ? error.message : String(error);

  // If the message is in our known-safe set, let it through.
  if (SAFE_USER_MESSAGES.has(msg)) {
    console.error(`[KnownError] ${msg}`, error);
    return msg;
  }

  // Zod validation errors — return the first human-readable issue.
  if (isZodError(error)) {
    const firstIssue = (error as { issues: Array<{ message: string }> }).issues[0]?.message ?? "Invalid input";
    console.error(`[ValidationError] ${firstIssue}`, error);
    return firstIssue;
  }

  // Supabase errors often have a `code` + `message` shape.
  if (isSupabaseError(error)) {
    console.error(`[SupabaseError]`, error);
    return GENERIC_MESSAGE;
  }

  // Catch-all: log everything, return nothing revealing.
  console.error(`[UnhandledError]`, error);
  return GENERIC_MESSAGE;
}

/**
 * Wraps a server function handler body so all thrown errors are sanitized.
 * Usage: `return handleServerError(async () => { ... your logic ... });`
 */
export async function handleServerError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw new Error(sanitizeError(error));
  }
}

// ── Type guards ──

function isZodError(err: unknown): boolean {
  return (
    err != null &&
    typeof err === "object" &&
    "issues" in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}

function isSupabaseError(err: unknown): boolean {
  return (
    err != null &&
    typeof err === "object" &&
    "code" in err &&
    "message" in err &&
    // Supabase errors often include a details or hint field
    ("details" in err || "hint" in err)
  );
}
