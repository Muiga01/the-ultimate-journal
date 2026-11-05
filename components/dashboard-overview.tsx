"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from "recharts";
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { C, fontBody, fontMono, DEFAULT_LISTS, WEEKDAYS, fmtMoney, computeRR } from "@/data/defaults";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const colors = { purple: "#8B5CF6", green: "#10B981", red: "#EF4444", amber: "#F59E0B" };

export function AnimatedNumber({ value, formatter = (v: number) => v.toString() }: { value: number | null | undefined; formatter?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const animationRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (value === null || value === undefined || Number.isNaN(value)) { setDisplayValue(null); return; }
    const start = 0, end = value, duration = 1000, startTime = performance.now();
    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + (end - start) * ease);
      if (progress < 1) animationRef.current = requestAnimationFrame(update);
      else animationRef.current = null;
    };
    animationRef.current = requestAnimationFrame(update);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [value]);

  if (displayValue === null) return <span>—</span>;
  return <span style={{ fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{formatter(displayValue)}</span>;
}

interface DashboardOverviewProps {
  derivedTrades: any[];
  startingEquity: number;
  totalPnl: number;
  accounts: any[];
  activeScope: any;
  onScopeChange: (v: any) => void;
}

export function DashboardOverview({ derivedTrades, startingEquity, totalPnl, accounts, activeScope, onScopeChange }: DashboardOverviewProps) {
  const closed = derivedTrades.filter((t) => t.status !== "Open");
  const winners = closed.filter((t) => (t.pnlNum || 0) > 0);
  const losers = closed.filter((t) => (t.pnlNum || 0) < 0);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  let grossProfit = 0, grossLoss = 0;
  closed.forEach((t) => { if ((t.pnlNum || 0) > 0) grossProfit += t.pnlNum!; else if ((t.pnlNum || 0) < 0) grossLoss += Math.abs(t.pnlNum!); });
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? "∞" : 0) : grossProfit / grossLoss;
  const expectancy = closed.length ? totalPnl / closed.length : 0;

  const validRR = closed.filter((t) => t.rr !== null && !Number.isNaN(t.rr));
  const avgRR = validRR.length ? validRR.reduce((s, t) => s + (t.rr || 0), 0) / validRR.length : null;

  let peak = startingEquity, maxDD = 0, running = startingEquity;
  const chrono = [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || ""));
  chrono.forEach((t) => { running += (t.pnlNum || 0); if (running > peak) peak = running; const dd = peak - running; if (dd > maxDD) maxDD = dd; });

  const equityData = [{ date: "Start", balance: startingEquity }];
  chrono.forEach((t) => { running = (equityData[equityData.length - 1] as any).balance + (t.pnlNum || 0); equityData.push({ date: t.dateOpen || "N/A", balance: running }); });

  const dailyMap: Record<string, number> = {};
  closed.forEach((t) => { const d = t.dateOpen || "Unknown"; dailyMap[d] = (dailyMap[d] || 0) + (t.pnlNum || 0); });
  const dailyData = Object.entries(dailyMap).map(([date, pnl]) => ({ date, pnl }));

  const pairMap: Record<string, { pair: string; trades: number; pnl: number }> = {};
  closed.forEach((t) => { if (!t.pair) return; if (!pairMap[t.pair]) pairMap[t.pair] = { pair: t.pair, trades: 0, pnl: 0 }; pairMap[t.pair].trades += 1; pairMap[t.pair].pnl += (t.pnlNum || 0); });
  const byPair = Object.values(pairMap).sort((a: any, b: any) => b.pnl - a.pnl);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Net P&L</CardTitle>
            <div className="flex items-center gap-1">
              {totalPnl >= 0 ? <TrendingUp className="h-4 w-4 text-green" /> : <TrendingDown className="h-4 w-4 text-red" />}
              <span className="text-xs font-medium">{totalPnl >= 0 ? "+" : "-"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              <AnimatedNumber value={totalPnl} formatter={fmtMoney} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{startingEquity > 0 ? ((totalPnl / startingEquity) * 100).toFixed(2) + "% vs capital" : "—"}</p>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Win Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="text-3xl font-bold font-mono tabular-nums">{winRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">{winners.length}W / {losers.length}L</div>
              </div>
              <div className="w-24 h-24 flex items-center justify-center relative">
                <svg width="84" height="84">
                  <circle cx="42" cy="42" r="36" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
                  <circle cx="42" cy="42" r="36" stroke="hsl(var(--primary))" strokeWidth="4" fill="none" strokeDasharray="226" strokeDashoffset={226 - (winRate / 100) * 226} strokeLinecap="round" transform="rotate(-90 42 42)" className="transition-all duration-800" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="p-5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono tabular-nums">{profitFactor === "∞" ? "∞" : profitFactor.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Gross Win / Loss</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Expectancy</CardTitle><CardDescription className="text-xs">Avg return per trade</CardDescription></CardHeader>
          <CardContent className="pb-4"><div className="text-lg font-bold font-mono tabular-nums">{fmtMoney(expectancy)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Avg R:R</CardTitle><CardDescription className="text-xs">Target ratio</CardDescription></CardHeader>
          <CardContent className="pb-4"><div className="text-lg font-bold font-mono tabular-nums">{avgRR !== null ? avgRR.toFixed(2) + " R" : "—"}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Max Drawdown</CardTitle><CardDescription className="text-xs">Peak-to-trough</CardDescription></CardHeader>
          <CardContent className="pb-4"><div className="text-lg font-bold font-mono tabular-nums text-red">-${fmtMoney(maxDD)}</div><div className="text-xs text-red mt-1">-{((maxDD / peak) * 100).toFixed(1)}%</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Scope Filter</CardTitle><CardDescription className="text-xs">Account view</CardDescription></CardHeader>
          <CardContent className="pb-4">
            <Select value={activeScope.mode === "ALL" ? "ALL" : activeScope.selectedIds[0]} onChange={(e: any) => { const val = e.target.value; if (val === "ALL") onScopeChange({ mode: "ALL", selectedIds: accounts.map((a: any) => a.id) }); else onScopeChange({ mode: "SINGLE", selectedIds: [val] }); }}>
              <option value="ALL">All Accounts</option>
              {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-2">
            <CardTitle className="text-sm font-medium">Equity Curve</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onScopeChange({ mode: "ALL", selectedIds: accounts.map((a: any) => a.id) })}>
              <ArrowUpDown className="h-3 w-3" /> All Accounts
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={equityData}>
                  <defs>
                    <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={totalPnl >= 0 ? colors.green : colors.red} stopOpacity={0.35} /><stop offset="95%" stopColor={totalPnl >= 0 ? colors.green : colors.red} stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [fmtMoney(v), "Balance"]} />
                  <Area type="monotone" dataKey="balance" stroke={totalPnl >= 0 ? colors.green : colors.red} strokeWidth={3} fillOpacity={1} fill="url(#eqGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-2">
            <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => [fmtMoney(v), "P&L"]} />
                  <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                    {dailyData.map((entry, i) => (<Cell key={`c${i}`} fill={entry.pnl >= 0 ? colors.green : colors.red} />))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Instrument Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Symbol</th>
                  <th className="pb-2 text-center">Trades</th>
                  <th className="pb-2 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody>
                {byPair.map((p: any) => (
                  <tr key={p.pair} className="border-b border-border/50">
                    <td className="py-2 font-medium">{p.pair}</td>
                    <td className="py-2 text-center font-mono">{p.trades}</td>
                    <td className="py-2 text-right font-bold font-mono tabular-nums" style={{ color: p.pnl >= 0 ? colors.green : colors.red }}>
                      {fmtMoney(p.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
