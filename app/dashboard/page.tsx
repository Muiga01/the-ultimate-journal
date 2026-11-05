"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useJournal } from "@/hooks/use-journal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { LayoutDashboard, NotebookText, Wallet, BarChart3, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardOverview } from "@/components/dashboard-overview";
import { TradeLog } from "@/components/trade-log";
import { CapitalLedgerView } from "@/components/capital-ledger";
import { PerformanceAnalytics } from "@/components/analytics";
import { JournalSettings } from "@/components/settings";
import { useDerivedTrades } from "@/data/defaults";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "trades", label: "Trade Log", icon: NotebookText },
  { key: "ledger", label: "Ledger", icon: Wallet },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SlidersHorizontal },
];

export default function DashboardPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("Trader");
  const [page, setPage] = useState("overview");
  const [activeScope, setActiveScope] = useState({ mode: "ALL" as const, selectedIds: [] as string[] });

  const journal = useJournal(user?.uid || "");
  const { accounts, trades, transactions, lists, loading, syncStatus, saveAccount, deleteAccount, saveTrade, deleteTrade, saveTransaction, deleteTransaction, saveLists } = journal;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.displayName) setName(u.displayName);
      else if (sessionStorage.getItem("journal_name")) setName(sessionStorage.getItem("journal_name")!);
    });
    return () => unsub();
  }, []);

  const startingEquity = useMemo(() => {
    const txs = activeScope.mode === "ALL" ? transactions : transactions.filter((t: any) => activeScope.selectedIds.includes(t.accountId));
    return txs.reduce((s, t: any) => s + parseFloat(t.amount || 0), 0);
  }, [transactions, activeScope]);

  const filteredTrades = useMemo(() => {
    if (activeScope.mode === "ALL") return trades;
    return trades.filter((t: any) => activeScope.selectedIds.includes(t.accountId));
  }, [trades, activeScope]);

  const derivedTrades = useDerivedTrades(filteredTrades, startingEquity);
  const totalPnl = derivedTrades.filter((t: any) => t.status !== "Open").reduce((s, t: any) => s + (t.pnlNum || 0), 0);

  if (!user) return <div className="p-8 text-center">Signing in...</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden md:flex w-20 flex-col items-center justify-center gap-5 border-r border-border bg-card/40 backdrop-blur p-3 rounded-2xl shadow-lg sticky top-4 self-start">
        <div className="text-xs font-mono font-bold tracking-widest text-primary">TJV1</div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${active ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </button>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition"
          >
            {resolvedTheme === "dark" ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 008 0z" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
          <button
            onClick={() => { auth.signOut(); sessionStorage.clear(); router.push("/sign-in"); }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-destructive/10 text-destructive transition"
          >
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
              <div className="text-xs text-muted-foreground">{user.email || "Signed in"}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${syncStatus === "synced" ? "bg-green/10 text-green border-green/20" : syncStatus === "saving" ? "bg-purple/10 text-purple border-purple/20" : "bg-amber/10 text-amber border-amber/20"}`}>
              {syncStatus === "synced" ? "Cloud Synced" : syncStatus === "saving" ? "Saving…" : "Offline"}
            </span>
            <div className="flex gap-2">
              <SelectScope accounts={accounts} activeScope={activeScope} onChange={setActiveScope} />
              <Button size="sm" onClick={() => auth.signOut()}>Logout</Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {page === "overview" && (
              <DashboardOverview
                derivedTrades={derivedTrades}
                startingEquity={startingEquity}
                totalPnl={totalPnl}
                accounts={accounts}
                activeScope={activeScope}
                onScopeChange={setActiveScope}
              />
            )}
            {page === "trades" && (
              <TradeLog
                trades={derivedTrades}
                accounts={accounts}
                lists={lists}
                onSave={(t) => { saveTrade(t); router.refresh(); }}
                onDelete={deleteTrade}
              />
            )}
            {page === "ledger" && (
              <CapitalLedgerView
                transactions={transactions}
                accounts={accounts}
                activeScope={activeScope}
                onAddAccount={(a) => { saveAccount(a); setActiveScope(prev => ({ ...prev, selectedIds: [...prev.selectedIds, a.id] })); }}
                onEditAccount={saveAccount}
                onDeleteAccount={deleteAccount}
                onAddTransaction={(t) => saveTransaction(t)}
                onEditTransaction={saveTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            )}
            {page === "analytics" && (
              <PerformanceAnalytics derivedTrades={derivedTrades} lists={lists} />
            )}
            {page === "settings" && (
              <JournalSettings lists={lists} onUpdate={saveLists} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SelectScope({ accounts, activeScope, onChange }: { accounts: any[]; activeScope: any; onChange: any }) {
  return (
    <select
      value={activeScope.mode === "ALL" ? "ALL" : activeScope.selectedIds[0]}
      onChange={(e) => {
        const val = e.target.value;
        if (val === "ALL") onChange({ mode: "ALL", selectedIds: accounts.map((a: any) => a.id) });
        else onChange({ mode: "SINGLE", selectedIds: [val] });
      }}
      className="rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
    >
      <option value="ALL">All Accounts</option>
      {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
    </select>
  );
}
