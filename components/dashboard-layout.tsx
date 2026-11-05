"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Router } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  router: Router;
  user: User | null;
}

export default function DashboardLayout({ children, router, user }: DashboardLayoutProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [name, setName] = useState(user?.displayName || sessionStorage.getItem("journal_name") || "Trader");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u?.displayName) setName(u.displayName);
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden md:flex w-20 flex-col items-center justify-center gap-6 border-r border-border bg-card/50 backdrop-blur p-4 rounded-xl shadow-lg sticky top-4 self-start">
        <div className="text-xs font-mono font-bold tracking-widest text-primary">TJV1</div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => router.push("/dashboard")} className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground shadow-lg">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </button>
          <button onClick={() => router.push("/dashboard/trades")} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
          <button onClick={() => router.push("/dashboard/ledger")} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <button onClick={() => router.push("/dashboard/analytics")} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </button>
          <button onClick={() => router.push("/dashboard/settings")} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37Zm9.35-1.026c1.274.775 1.935 1.702 1.935 3.05v4c0 1.344-.661 2.274-1.935 3.055-.69.54-1.617.812-2.565.812h-4c-.949 0-1.876-.272-2.565-.812-1.274-.775-1.935-1.702-1.935-3.056v-4c0-1.344.661-2.274 1.935-3.055.69-.54 1.617-.812 2.565-.812h4c.948 0 1.875.271 2.564.812" /></svg>
          </button>
        </nav>
        <div className="mt-auto flex items-center gap-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition">
            {resolvedTheme === "dark" ? <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 008 0z" /></svg> : <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
          </button>
          <button onClick={() => { sessionStorage.clear(); auth.signOut(); router.push("/sign-in"); }} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-destructive/10 text-destructive transition">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/50 backdrop-blur flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-muted-foreground">Cloud Sync</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-green/10 text-green border border-green/20">Synced</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
