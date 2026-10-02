const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 6; // per IP per window

const hits = new Map<string, number[]>(); // IP -> request timestamps inside the window

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
