"use client";

import React, { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { fmtMoney } from "@/data/defaults";

interface CapitalLedgerProps {
  transactions: any[];
  accounts: any[];
  activeScope: any;
  onAddAccount: (acc: any) => void;
  onEditAccount: (acc: any) => void;
  onDeleteAccount: (id: string) => void;
  onAddTransaction: (tx: any) => void;
  onEditTransaction: (tx: any) => void;
  onDeleteTransaction: (id: string) => void;
}

export function CapitalLedgerView({
  transactions, accounts, activeScope,
  onAddAccount, onEditAccount, onDeleteAccount,
  onAddTransaction, onEditTransaction, onDeleteTransaction,
}: CapitalLedgerProps) {
  const [accOpen, setAccOpen] = useState(false);
  const [txOpen, setTxOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<any>(null);
  const [editingTx, setEditingTx] = useState<any>(null);

  const [accForm, setAccForm] = useState({ id: null, name: "", broker: "", currency: "USD", initialBalance: "50000", color: "#8B5CF6" });
  const [txForm, setTxForm] = useState({ id: null, accountId: accounts[0]?.id || "", date: new Date().toISOString().split("T")[0], description: "", amount: "" });

  const filteredTx = useMemo(() => {
    if (activeScope.mode === "ALL") return transactions;
    return transactions.filter((t: any) => activeScope.selectedIds.includes(t.accountId));
  }, [transactions, activeScope]);

  const totalDeposits = filteredTx.filter((t: any) => parseFloat(t.amount || 0) > 0).reduce((s, t: any) => s + parseFloat(t.amount), 0);
  const totalWithdrawals = filteredTx.filter((t: any) => parseFloat(t.amount || 0) < 0).reduce((s, t: any) => s + Math.abs(parseFloat(t.amount)), 0);
  const netCapital = totalDeposits - totalWithdrawals;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-4">
        <div className="p-4 rounded-xl border border-border bg-background">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Capital Seeded</div>
          <div className="text-2xl font-bold font-mono tabular-nums">{fmtMoney(netCapital)}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-background">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Deposits</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-green">{fmtMoney(totalDeposits)}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-background">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Withdrawals</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-red">-{fmtMoney(totalWithdrawals)}</div>
        </div>
        <div className="p-4 rounded-xl border border-border bg-background">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Accounts</div>
          <div className="text-2xl font-bold font-mono tabular-nums">{accounts.length}</div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Trading Accounts</h3>
          <Button onClick={() => { setEditingAcc(null); setAccForm({ id: null, name: "", broker: "", currency: "USD", initialBalance: "50000", color: "#8B5CF6" }); setAccOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Account
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {accounts.map((acc: any) => (
            <div key={acc.id} className="p-4 rounded-xl border border-border bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: acc.color }}>{acc.name}</span>
                <span className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground">{acc.broker}</span>
              </div>
              <div className="text-xl font-bold font-mono tabular-nums mb-3">
                ${parseFloat(acc.initialBalance || 0).toLocaleString()} <span className="text-sm text-muted-foreground">{acc.currency}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditingAcc(acc); setAccForm(acc); setAccOpen(true); }} className="flex-1">Edit</Button>
                {accounts.length > 1 && (
                  <Button size="sm" variant="destructive" onClick={() => onDeleteAccount(acc.id)} className="flex-1">Delete</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Capital Transactions</h3>
          <Button onClick={() => { setEditingTx(null); setTxForm({ id: null, accountId: accounts[0]?.id || "", date: new Date().toISOString().split("T")[0], description: "", amount: "" }); setTxOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Log Event
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3">Date</th>
                <th className="pb-3">Account</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount ($)</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx: any) => {
                const acc = accounts.find((a: any) => a.id === tx.accountId);
                const amt = parseFloat(tx.amount || 0);
                return (
                  <tr key={tx.id} className="border-b border-border/50">
                    <td className="py-3 font-mono text-xs text-muted-foreground">{tx.date}</td>
                    <td className="py-3 font-medium">{acc?.name || "N/A"}</td>
                    <td className="py-3">{tx.description}</td>
                    <td className="py-3 text-right font-bold font-mono tabular-nums" style={{ color: amt >= 0 ? "#10B981" : "#EF4444" }}>
                      {fmtMoney(amt)}
                    </td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => { setEditingTx(tx); setTxForm(tx); setTxOpen(true); }} className="p-1.5">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteTransaction(tx.id)} className="p-1.5">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {accOpen && (
        <Modal title={editingAcc ? "Edit Account" : "Add Account"} onClose={() => setAccOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingAcc) onEditAccount(accForm);
              else {
                const newAcc = { ...accForm, id: `acc_${Date.now()}` };
                onAddAccount(newAcc);
              }
              setAccOpen(false);
            }}
            className="space-y-3 p-4"
          >
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Account Name</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={accForm.name} onChange={(e) => setAccForm({ ...accForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Broker / Firm</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={accForm.broker} onChange={(e) => setAccForm({ ...accForm, broker: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Initial Balance ($)</label>
              <input type="number" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={accForm.initialBalance} onChange={(e) => setAccForm({ ...accForm, initialBalance: e.target.value })} required />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setAccOpen(false)}>Cancel</Button>
              <Button type="submit">Save Account</Button>
            </div>
          </form>
        </Modal>
      )}

      {txOpen && (
        <Modal title={editingTx ? "Edit Transaction" : "Log Transaction"} onClose={() => setTxOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingTx) onEditTransaction(txForm);
              else onAddTransaction({ ...txForm, id: `tx_${Date.now()}` });
              setTxOpen(false);
            }}
            className="space-y-3 p-4"
          >
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Account</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={txForm.accountId} onChange={(e) => setTxForm({ ...txForm, accountId: e.target.value })} required>
                {accounts.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
              <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
              <input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} required placeholder="Deposit, Withdrawal..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Amount ($)</label>
              <input type="number" step="any" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} required placeholder="5000 or -1200" />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setTxOpen(false)}>Cancel</Button>
              <Button type="submit">Save Transaction</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
