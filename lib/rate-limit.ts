const store = new Map<string, { count: number; resetAt: number }>();

// Returns true if request is allowed, false if rate-limited
export function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || now > record.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}
