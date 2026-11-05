"use client";

import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { fmtMoney } from "@/data/defaults";

interface TradeLogProps {
  trades: any[];
  accounts: any[];
  lists: any;
  onSave: (trade: any) => void;
  onDelete: (id: string) => void;
}

export function TradeLog({ trades, accounts, lists, onSave, onDelete }: TradeLogProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState("ALL");

  const [form, setForm] = useState({
    accountId: accounts[0]?.id || "",
    dateOpen: new Date().toISOString().split("T")[0],
    dateClose: new Date().toISOString().split("T")[0],
    strategy: lists.strategies[0] || "",
    pair: lists.pairs[0] || "",
    direction: "Long" as "Long" | "Short",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    exitPrice: "",
    confluences: [] as string[],
    pnl: "",
    comments: "",
    lesson: "",
  });

  const filtered = useMemo(() => {
    if (filter === "ALL") return trades;
    return trades.filter((t: any) => t.accountId === filter);
  }, [trades, filter]);

  const toggleConfluence = (sig: string) => {
    setForm((prev) => ({
      ...prev,
      confluences: prev.confluences.includes(sig)
        ? prev.confluences.filter((c: string) => c !== sig)
        : [...prev.confluences, sig],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: form.id || `t_${Date.now()}` });
    setOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <h2 className="font-semibold">Trade Journal Log</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Accounts</SelectItem>
              {accounts.map((a: any) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditing(null); setForm({ ...form, id: undefined }); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Log Trade
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Symbol</th>
              <th className="pb-3 font-medium">Strategy</th>
              <th className="pb-3 font-medium">Direction</th>
              <th className="pb-3 font-medium text-right">P&L</th>
              <th className="pb-3 font-medium text-center">Status</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t: any) => (
              <tr key={t.id} className="border-b border-border/50">
                <td className="py-3 font-mono text-xs text-muted-foreground">{t.dateOpen}</td>
                <td className="py-3 font-medium">{t.pair}</td>
                <td className="py-3 text-xs text-muted-foreground">{t.strategy}</td>
                <td className="py-3">{t.direction}</td>
                <td className="py-3 text-right font-bold font-mono tabular-nums" style={{ color: (t.pnlNum || 0) >= 0 ? "#10B981" : "#EF4444" }}>
                  {t.pnlNum !== null ? fmtMoney(t.pnlNum) : "—"}
                </td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === "Win" ? "bg-green/10 text-green" : "bg-red/10 text-red"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => { setEditing(t); setOpen(true); }} className="p-1.5">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(t.id)} className="p-1.5">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="h-24 text-center text-muted-foreground">
                  No trades found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={editing ? "Edit Trade Record" : "Log New Trade"} onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Account</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.accountId}
                  onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                  disabled={!!editing}
                >
                  {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Direction</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.direction}
                  onChange={(e) => setForm({ ...form, direction: e.target.value })}
                >
                  <option value="Long">Long</option>
                  <option value="Short">Short</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Strategy</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.strategy}
                  onChange={(e) => setForm({ ...form, strategy: e.target.value })}
                >
                  <option value="">Select Strategy...</option>
                  {lists.strategies.map((s: string) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Pair</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.pair}
                  onChange={(e) => setForm({ ...form, pair: e.target.value })}
                >
                  <option value="">Select Pair...</option>
                  {lists.pairs.map((p: string) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date Open</label>
                <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.dateOpen} onChange={(e) => setForm({ ...form, dateOpen: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date Close</label>
                <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.dateClose} onChange={(e) => setForm({ ...form, dateClose: e.target.value })} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Entry</label>
                <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Stop Loss</label>
                <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.stopLoss} onChange={(e) => setForm({ ...form, stopLoss: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Take Profit</label>
                <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.takeProfit} onChange={(e) => setForm({ ...form, takeProfit: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Exit</label>
                <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.exitPrice} onChange={(e) => setForm({ ...form, exitPrice: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Net P&L ($)</label>
              <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.pnl} onChange={(e) => setForm({ ...form, pnl: e.target.value })} placeholder="e.g. 2450 or -780" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Confluence Tags</label>
              <div className="flex flex-wrap gap-2">
                {lists.signals.map((sig: string) => (
                  <button
                    key={sig}
                    type="button"
                    onClick={() => toggleConfluence(sig)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border ${
                      form.confluences.includes(sig)
                        ? "bg-purple/10 text-purple border-purple/20"
                        : "border-input text-muted-foreground bg-background"
                    }`}
                  >
                    {sig}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Comments</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="Entry setup notes..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Lesson Learned</label>
              <textarea className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })} placeholder="Execution reflection..." />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save Changes" : "Save Trade"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
