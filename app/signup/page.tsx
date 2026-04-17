"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthPageShell from "../../components/AuthPageShell";
import { supabase } from "../../src/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <AuthPageShell
      title="Get Started"
      subtitle="Create your account to start collaborating"
      bottomText="Already have an account?"
      bottomLinkHref="/login"
      bottomLinkText="Login"
    >
      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-lg border border-default bg-surface-2 hover:bg-surface-3 transition active:scale-[0.98] cursor-pointer"
      >
        <i className="fa-brands fa-google text-xl"></i>
        <span className="text-sm font-semibold">Sign up with Google</span>
      </button>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-lg transition active:scale-[0.98] cursor-pointer text-white"
        style={{ background: "rgb(var(--primary))" }}
      >
        <i className="fa-solid fa-envelope text-xl"></i>
        <span className="text-sm font-semibold">Sign up with Email</span>
      </button>
    </AuthPageShell>
  );
}
