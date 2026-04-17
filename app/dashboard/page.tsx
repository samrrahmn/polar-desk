"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../src/lib/supabaseClient";

export default function DashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        router.push("/dashboard/projects");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--primary))]"></div>
    </div>
  );
}
