import { Broker, Review } from "@/types";

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return { url, anon };
}

async function supabaseRest<T>(path: string): Promise<T> {
  const { url, anon } = getEnv();
  if (!url || !anon) throw new Error("Missing Supabase ENV");

  const res = await fetch(`${url}${path}`, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase REST ${res.status}: ${text.slice(0, 200)}`);
  }

  return (await res.json()) as T;
}

export async function fetchBrokersServer(): Promise<Broker[]> {
  try {
    const rows = await supabaseRest<any[]>(
      "/rest/v1/brokers?select=*&is_active=eq.true&order=rating.desc"
    );
    return (rows || []).map((b) => ({
      ...b,
      features: Array.isArray(b.features) ? b.features : [],
      trading_platforms: Array.isArray(b.trading_platforms) ? b.trading_platforms : [],
    })) as Broker[];
  } catch {
    return [];
  }
}

export async function fetchReviewsServer(): Promise<Review[]> {
  try {
    const rows = await supabaseRest<Review[]>(
      "/rest/v1/reviews?select=*,public_profiles:user_id(full_name,avatar_url)&is_approved=eq.true&order=created_at.desc&limit=6"
    );
    return rows || [];
  } catch {
    return [];
  }
}
