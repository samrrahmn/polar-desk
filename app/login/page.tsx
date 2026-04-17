"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageShell from "../../components/AuthPageShell";
import { supabase } from "../../src/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <AuthPageShell
      title="Welcome Back"
      subtitle="Login to continue your workspace"
      bottomText="Don't have an account?"
      bottomLinkHref="/signup"
      bottomLinkText="Sign up"
    >
      <div className="w-full space-y-4">
        <input
          type="email"
          placeholder="Email address"
          style={{ paddingLeft: 16, paddingRight: 16 }}
          className="w-full h-12 rounded-lg border border-default bg-surface text-sm outline-none appearance-none focus:border-[rgb(var(--primary))]"
        />

        <input
          type="password"
          placeholder="Password"
          style={{ paddingLeft: 16, paddingRight: 16 }}
          className="w-full h-12 rounded-lg border border-default bg-surface text-sm outline-none appearance-none focus:border-[rgb(var(--primary))]"
        />

        <button
          type="button"
          className="w-full h-12 flex items-center justify-center gap-3 rounded-lg cursor-pointer text-white font-semibold"
          style={{ background: "rgb(var(--primary))" }}
        >
          Log In
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-lg border border-default bg-surface-2 hover:bg-surface-3 transition cursor-pointer"
        >
          <i className="fa-brands fa-google text-base"></i>
          <span className="text-sm font-semibold">Sign in with Google</span>
        </button>
      </div>
    </AuthPageShell>
  );
}
