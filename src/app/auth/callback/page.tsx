"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponent } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClientComponent();

  useEffect(() => {
    const handleAuthCallback = async () => {
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
  }, [router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-muted-foreground">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}
