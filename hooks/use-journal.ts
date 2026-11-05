"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, APP_ID, COLLECTIONS } from "@/lib/firebase";
import type { Trade, Account, Transaction, JournalLists } from "@/types/index";

export function useJournal(uid: string) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lists, setLists] = useState<JournalLists>({ pairs: [], strategies: [], signals: [] });
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline">("synced");

  useEffect(() => {
    if (!db) { setLoading(false); setSyncStatus("offline"); return; }
    setLoading(true);

    const unsubs: (() => void)[] = [];

    // Accounts
    const accRef = collection(db, COLLECTIONS.accounts(uid));
    unsubs.push(onSnapshot(accRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Account));
      setAccounts(data.length ? data : []);
      setSyncStatus("synced");
    }, () => setSyncStatus("offline")));

    // Trades
    const trRef = collection(db, COLLECTIONS.trades(uid));
    unsubs.push(onSnapshot(query(trRef, orderBy("dateOpen", "desc")), (snap) => {
      setTrades(snap.docs.map(d => ({ id: d.id, ...d.data() } as Trade)));
      setSyncStatus("synced");
    }, () => setSyncStatus("offline")));

    // Transactions
    const txRef = collection(db, COLLECTIONS.transactions(uid));
    unsubs.push(onSnapshot(txRef, (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
      setSyncStatus("synced");
    }, () => setSyncStatus("offline")));

    // Settings lists
    const stRef = doc(db, COLLECTIONS.settings(uid));
    unsubs.push(onSnapshot(stRef, (snap) => {
      if (snap.exists()) setLists(snap.data() as JournalLists);
      setLoading(false);
    }, () => setLoading(false)));

    return () => unsubs.forEach(u => u());
  }, [uid, db]);

  const saveDoc = useCallback(async (col: string, id: string, data: any, merge = false) => {
    if (!db || !uid) return;
    setSyncStatus("saving");
    try {
      const base = COLLECTIONS[col as keyof typeof COLLECTIONS](uid);
      const ref = col === "settings" ? doc(db, base) : doc(db, base, id);
      await setDoc(ref, data, { merge });
      setSyncStatus("synced");
    } catch (err) {
      console.error("Save error:", err);
      setSyncStatus("offline");
    }
  }, [db, uid]);

  const deleteDocFn = useCallback(async (col: string, id: string) => {
    if (!db || !uid) return;
    setSyncStatus("saving");
    try {
      const base = COLLECTIONS[col as keyof typeof COLLECTIONS](uid);
      const ref = col === "settings" ? doc(db, base) : doc(db, base, id);
      await deleteDoc(ref);
      setSyncStatus("synced");
    } catch (err) {
      console.error("Delete error:", err);
      setSyncStatus("offline");
    }
  }, [db, uid]);

  return {
    accounts, trades, transactions, lists, loading, syncStatus,
    saveAccount: (a: Account) => saveDoc("accounts", a.id, a),
    deleteAccount: (id: string) => deleteDocFn("accounts", id),
    saveTrade: (t: Trade) => saveDoc("trades", t.id, t),
    deleteTrade: (id: string) => deleteDocFn("trades", id),
    saveTransaction: (t: Transaction) => saveDoc("transactions", t.id, t),
    deleteTransaction: (id: string) => deleteDocFn("transactions", id),
    saveLists: (l: JournalLists) => saveDoc("settings", "lists", l, true),
  };
}
