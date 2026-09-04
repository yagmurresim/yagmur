interface RateLimitResult {
  success: boolean;
  remaining?: number;
}

const LIMIT = 5;
const WINDOW_SECONDS = 3600;

async function getRedisRateLimit(ip: string): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const isProd = process.env.NODE_ENV === "production";

  if (!url || !token) {
    if (!isProd) return { success: true };
    console.error("[rate-limit] Upstash Redis not configured.");
    return { success: false };
  }

  const key = `rl:apply:${ip}`;

  try {
    const incrRes = await fetch(`${url}/incr/${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!incrRes.ok) {
      if (!isProd) return { success: true };
      console.error("[rate-limit] INCR failed:", incrRes.status);
      return { success: false };
    }

    const { result: count } = (await incrRes.json()) as { result: number };

    if (count === 1) {
      const expireRes = await fetch(
        `${url}/expire/${encodeURIComponent(key)}/${WINDOW_SECONDS}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!expireRes.ok && isProd) {
        console.error("[rate-limit] EXPIRE failed:", expireRes.status);
      }
    }

    return {
      success: count <= LIMIT,
      remaining: Math.max(0, LIMIT - count),
    };
  } catch (err) {
    if (!isProd) return { success: true };
    console.error("[rate-limit] Redis error:", err);
    return { success: false };
  }
}

export async function checkApplicationRateLimit(
  ip: string
): Promise<RateLimitResult> {
  return getRedisRateLimit(ip);
}

export function getClientIP(request: {
  headers: { get: (key: string) => string | null };
}): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first && first !== "unknown") return first;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && realIp !== "unknown") return realIp;

  return null;
}
