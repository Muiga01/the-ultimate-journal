"use client";

import React, { useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fmtMoney } from "@/data/defaults";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const green = "#10B981";
const red = "#EF4444";

interface AnalyticsProps {
  derivedTrades: any[];
  lists: any;
}

export function PerformanceAnalytics({ derivedTrades, lists }: AnalyticsProps) {
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const filtered = useMemo(() => {
    if (selectedStrategy === "ALL") return derivedTrades;
    return derivedTrades.filter((t: any) => t.strategy === selectedStrategy);
  }, [derivedTrades, selectedStrategy]);

  const closed = filtered.filter((t: any) => t.status !== "Open");
  const totalPnl = closed.reduce((s, t: any) => s + (t.pnlNum || 0), 0);
  const winners = closed.filter((t: any) => (t.pnlNum || 0) > 0);
  const losers = closed.filter((t: any) => (t.pnlNum || 0) < 0);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  const byStrategy = useMemo(() => {
    const map: Record<string, any> = {};
    for (const t of derivedTrades) {
      if (!t.strategy) continue;
      if (!map[t.strategy]) map[t.strategy] = { strategy: t.strategy, trades: 0, wins: 0, losses: 0, pnl: 0, winSum: 0, lossSum: 0, tradesList: [] as any[] };
      map[t.strategy].tradesList.push(t);
      if (t.status !== "Open") {
        map[t.strategy].trades += 1;
        map[t.strategy].pnl += (t.pnlNum || 0);
        if ((t.pnlNum || 0) > 0) { map[t.strategy].wins += 1; map[t.strategy].winSum += t.pnlNum!; }
        else if ((t.pnlNum || 0) < 0) { map[t.strategy].losses += 1; map[t.strategy].lossSum += Math.abs(t.pnlNum!); }
      }
    }
    return Object.values(map).map((s: any) => {
      const pf = s.lossSum > 0 ? s.winSum / s.lossSum : (s.winSum > 0 ? Infinity : 0);
      const winPct = s.trades > 0 ? (s.wins / s.trades) * 100 : 0;
      return { ...s, winPct, profitFactor: pf === Infinity ? "∞" : pf.toFixed(2) };
    }).sort((a: any, b: any) => b.pnl - a.pnl);
  }, [derivedTrades]);

  const dailyMap: Record<string, number> = {};
  closed.forEach((t: any) => { const d = t.dateOpen || t.dateClose; if (d) dailyMap[d] = (dailyMap[d] || 0) + (t.pnlNum || 0); });

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: any[] = [];
  for (let i = 0; i < firstDayIndex; i++) cells.push({ empty: true, id: `e_${i}` });
  for (let day = 1; day <= daysInMonth; day++) {
    const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const pnl = dailyMap[d];
    cells.push({ empty: false, day, dateStr: d, pnl });
  }

  const weekdayMap: Record<string, number> = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
  closed.forEach((t: any) => { if (t.day && weekdayMap[t.day] !== undefined) weekdayMap[t.day] += (t.pnlNum || 0); });
  const weekdayData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => ({ day: d.slice(0, 3), pnl: weekdayMap[d] }));

  const cumulative: any[] = [];
  let running = 0;
  [...closed].sort((a: any, b: any) => (a.dateOpen || "").localeCompare(b.dateOpen || "")).forEach((t: any, i) => {
    running += (t.pnlNum || 0);
    cumulative.push({ idx: i + 1, date: t.dateOpen || `Trade #${i + 1}`, pnl: running });
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Performance Analytics</h2>
          <p className="text-sm text-muted-foreground">Strategy breakdown, calendar heatmap, and equity trajectory</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filter:</span>
          <Select value={selectedStrategy} onValueChange={(v: any) => setSelectedStrategy(v)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Strategies</SelectItem>
              {lists.strategies.map((s: string) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Net P&L</div>
          <div className="text-2xl font-bold font-mono tabular-nums" style={{ color: totalPnl >= 0 ? green : red }}>
            {fmtMoney(totalPnl)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{selectedStrategy === "ALL" ? "All playbooks" : selectedStrategy}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Win Rate</div>
          <div className="text-2xl font-bold font-mono tabular-nums">{winRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-1">{winners.length}W / {losers.length}L</div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Monthly Heatmap</h3>
              <p className="text-xs text-muted-foreground">{calendarDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}</p>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => setCalendarDate(new Date(year, month - 1, 1))}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setCalendarDate(new Date(year, month + 1, 1))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-xs font-medium text-muted-foreground text-center">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell) => {
              if (cell.empty) return <div key={cell.id} className="h-10 rounded-md" />;
              const hasPnl = cell.pnl !== undefined;
              const isWin = hasPnl && cell.pnl > 0;
              const isLoss = hasPnl && cell.pnl < 0;
              return (
                <div key={cell.dateStr} className={`h-10 rounded-md border ${isWin ? "bg-green/20 border-green/30" : isLoss ? "bg-red/20 border-red/30" : "bg-muted border-border"}`}>
                  <div className="flex items-center justify-center">
                    <span className={`text-[10px] font-bold ${isWin ? "text-green" : isLoss ? "text-red" : "text-muted-foreground"}`}>
                      {hasPnl ? (cell.pnl >= 0 ? "+" : "") + Math.round(cell.pnl).toLocaleString() : "—"}
                    </span>
                  </div>
                  <div className="text-[9px] text-muted-foreground text-center mt-0.5">{cell.day}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-3">
            <h3 className="font-semibold">P/L by Weekday</h3>
            <p className="text-xs text-muted-foreground">Aggregated across weekdays</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [fmtMoney(Number(v)), "P&L"]} />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {weekdayData.map((e, i) => (<Cell key={`w${i}`} fill={(e.pnl || 0) >= 0 ? green : red} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold">Cumulative P&L Trajectory</h3>
          <p className="text-xs text-muted-foreground">Progressive equity over filtered trades</p>
        </div>
        {cumulative.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">No closed trades found.</div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulative}>
                <defs>
                  <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={green} stopOpacity={0.35} /><stop offset="95%" stopColor={green} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => [fmtMoney(Number(v)), "Cumulative"]} />
                <Area type="monotone" dataKey="pnl" stroke={green} strokeWidth={2.5} fillOpacity={1} fill="url(#cumGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Strategy Playbook Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3 font-medium">Strategy</th>
                <th className="pb-3 text-center font-medium">Trades (Wins)</th>
                <th className="pb-3 text-center font-medium">Win Rate</th>
                <th className="pb-3 text-center font-medium">Profit Factor</th>
                <th className="pb-3 text-right font-medium">Net P&L</th>
              </tr>
            </thead>
            <tbody>
              {byStrategy.map((s: any) => (
                <tr key={s.strategy} className="border-b border-border/50">
                  <td className="py-3 font-medium">{s.strategy}</td>
                  <td className="py-3 text-center font-mono">{s.trades} ({s.wins})</td>
                  <td className="py-3 text-center font-mono">{s.winPct.toFixed(1)}%</td>
                  <td className="py-3 text-center font-mono">{s.profitFactor}</td>
                  <td className="py-3 text-right font-bold font-mono tabular-nums" style={{ color: s.pnl >= 0 ? green : red }}>
                    {fmtMoney(s.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
