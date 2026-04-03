"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        router.push('/?error=missing_supabase_env');
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      // في OAuth/PKCE قد يأتي code ويحتاج exchange
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError);
          router.push('/?error=auth_exchange_failed');
          return;
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth callback error:", error);
        router.push("/?error=auth_callback_failed");
        return;
      }

      if (session) {
        router.push("/");
      } else {
        router.push("/?error=no_session");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-muted-foreground">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}
