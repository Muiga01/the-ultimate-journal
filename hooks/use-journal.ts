"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db, APP_ID, COLLECTIONS } from "@/lib/firebase";
import type { Trade, Account, Transaction, JournalLists } from "@/types/index";
import { INITIAL_ACCOUNTS, INITIAL_TRADES, INITIAL_TRANSACTIONS, DEFAULT_LISTS } from "@/data/defaults";

const STORAGE_KEYS = {
  accounts: "journal_accounts_local",
  trades: "journal_trades_local",
  transactions: "journal_transactions_local",
  lists: "journal_lists_local",
};

function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key: string, data: any) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function useJournal(uid: string) {
  const isLocalMode = !uid || uid === "";
  const [accounts, setAccounts] = useState<Account[]>(() => isLocalMode ? loadLocal(STORAGE_KEYS.accounts, INITIAL_ACCOUNTS) : []);
  const [trades, setTrades] = useState<Trade[]>(() => isLocalMode ? loadLocal(STORAGE_KEYS.trades, INITIAL_TRADES) : []);
  const [transactions, setTransactions] = useState<Transaction[]>(() => isLocalMode ? loadLocal(STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS) : []);
  const [lists, setLists] = useState<JournalLists>(() => isLocalMode ? loadLocal(STORAGE_KEYS.lists, DEFAULT_LISTS) : { pairs: [], strategies: [], signals: [] });
  const [loading, setLoading] = useState(!isLocalMode);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline">(isLocalMode ? "offline" : "synced");

  // Firestore sync (only when we have a real UID)
  useEffect(() => {
    if (isLocalMode || !db) {
      setLoading(false);
      setSyncStatus("offline");
      return;
    }
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
  }, [uid, db, isLocalMode]);

  const saveDoc = useCallback(async (col: string, id: string, data: any, merge = false) => {
    if (isLocalMode) {
      // Local mode: update state and persist to localStorage
      if (col === "accounts") {
        setAccounts(prev => {
          const exists = prev.find(a => a.id === id);
          const updated = exists ? prev.map(a => a.id === id ? { ...a, ...data } : a) : [...prev, { ...data, id }];
          saveLocal(STORAGE_KEYS.accounts, updated);
          return updated;
        });
      } else if (col === "trades") {
        setTrades(prev => {
          const exists = prev.find(t => t.id === id);
          const updated = exists ? prev.map(t => t.id === id ? { ...t, ...data } : t) : [...prev, { ...data, id }];
          saveLocal(STORAGE_KEYS.trades, updated);
          return updated;
        });
      } else if (col === "transactions") {
        setTransactions(prev => {
          const exists = prev.find(t => t.id === id);
          const updated = exists ? prev.map(t => t.id === id ? { ...t, ...data } : t) : [...prev, { ...data, id }];
          saveLocal(STORAGE_KEYS.transactions, updated);
          return updated;
        });
      } else if (col === "settings") {
        setLists(prev => {
          const updated = { ...prev, ...data };
          saveLocal(STORAGE_KEYS.lists, updated);
          return updated;
        });
      }
      return;
    }

    // Cloud mode (Firestore)
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
  }, [db, uid, isLocalMode]);

  const deleteDocFn = useCallback(async (col: string, id: string) => {
    if (isLocalMode) {
      // Local mode: update state and persist to localStorage
      if (col === "accounts") {
        setAccounts(prev => {
          const updated = prev.filter(a => a.id !== id);
          saveLocal(STORAGE_KEYS.accounts, updated);
          return updated;
        });
      } else if (col === "trades") {
        setTrades(prev => {
          const updated = prev.filter(t => t.id !== id);
          saveLocal(STORAGE_KEYS.trades, updated);
          return updated;
        });
      } else if (col === "transactions") {
        setTransactions(prev => {
          const updated = prev.filter(t => t.id !== id);
          saveLocal(STORAGE_KEYS.transactions, updated);
          return updated;
        });
      }
      return;
    }

    // Cloud mode (Firestore)
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
  }, [db, uid, isLocalMode]);

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
