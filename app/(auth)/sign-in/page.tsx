"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function SignIn() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/dashboard");
    });
    return () => unsub();
  }, [router]);

  const handleGoogle = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      console.error("Google sign-in failed:", err);
      try {
        await signInAnonymously(auth);
      } catch (e) {
        setError("Sign-in failed");
        setLoading(false);
      }
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter a name"); return; }
    // Name-only auth: local session only (no cloud sync until real auth added)
    sessionStorage.setItem("journal_name", name.trim());
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card text-foreground shadow-xl p-8">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck />
          </div>
          <h1 className="text-xl font-bold tracking-tight">The Ledger</h1>
          <p className="text-sm text-muted-foreground">NovaPay Shared Trading Journal</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full justify-center"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue with Google
          </Button>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or sign in with name</span>
          </div>
        </div>

        <form onSubmit={handleNameSubmit} className="mt-4 space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Trader name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-9"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Enter Journal
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hover:underline"
          >
            Switch to {resolvedTheme === "dark" ? "Light" : "Dark"} mode
          </button>
        </div>
      </div>
    </div>
  );
}
