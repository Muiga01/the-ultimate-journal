import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, AreaChart, Area
} from "recharts";
import {
  LayoutDashboard, NotebookText, Wallet, BarChart3, SlidersHorizontal,
  Plus, Pencil, Trash2, X, ChevronDown, RefreshCw, Layers, Search,
  Download, Upload, DollarSign, User, TrendingUp, TrendingDown, Flame, Snowflake, ArrowUpDown, Sun, Moon,
  WifiOff, Loader2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Lock, KeyRound, ShieldCheck
} from "lucide-react";

const CloudCheck = ({ size = 14, style, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    className={className}
  >
    <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 2 15h.5" />
    <path d="m9 16 2 2 4-4" />
  </svg>
);

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection
} from "firebase/firestore";

const appId = typeof __app_id !== 'undefined' ? __app_id : 'novapay-ledger-v1';
let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (typeof __firebase_config !== 'undefined' && __firebase_config) {
  try {
    const firebaseConfig = JSON.parse(__firebase_config);
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error("Firebase initialization error:", err);
  }
}

const C = {
  purple: "#8B5CF6",
  purpleLight: "rgba(139, 92, 246, 0.15)",
  green: "#10B981",
  greenLight: "rgba(16, 185, 129, 0.15)",
  red: "#EF4444",
  redLight: "rgba(239, 68, 68, 0.15)",
  amber: "#F59E0B",
  amberLight: "rgba(245, 158, 11, 0.15)",
};

const fontBody = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Roboto, Helvetica, Arial, sans-serif";
const fontMono = "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'SF Pro Display', 'SF Mono', SFMono-Regular, Consolas, monospace";

const getThemeTokens = (theme) => {
  const isDark = theme === "dark";
  return {
    isDark,
    bg: isDark ? "#000000" : "#F1F3F7",
    cardBg: isDark ? "rgba(14, 14, 16, 0.78)" : "rgba(255, 255, 255, 0.85)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(226, 232, 240, 0.8)",
    cardShadow: isDark 
      ? "0 24px 48px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.07)" 
      : "0 10px 30px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)",
    textMain: isDark ? "#F8FAFC" : "#0F172A",
    textSub: isDark ? "#94A3B8" : "#64748B",
    textMuted: isDark ? "#64748B" : "#94A3B8",
    inputBg: isDark ? "#0A0A0C" : "#F8FAFC",
    inputBorder: isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(226, 232, 240, 0.8)",
    tableBorder: isDark ? "rgba(255, 255, 255, 0.06)" : "#F8FAFC",
    chartGrid: isDark ? "rgba(255, 255, 255, 0.07)" : "#E2E8F0",
    modalOverlay: isDark ? "rgba(0, 0, 0, 0.85)" : "rgba(15, 23, 42, 0.4)",
    darkBtn: isDark ? "#38BDF8" : "#0F172A",
    darkBtnText: isDark ? "#0F172A" : "#FFFFFF",
  };
};

const DEFAULT_LISTS = {
  pairs: ["NASDAQ100", "S&P500", "XAU/USD", "EUR/USD", "BTC/USD", "AAPL", "MSFT", "TSLA", "NVDA"],
  strategies: ["ICT Silver Bullet", "AMD Accumulation", "CRT Model", "Breaker Block Retest", "Order Block Liquidity"],
  signals: ["SMT Divergence", "FVG Tap", "Order Block", "Breaker Block", "Liquidity Sweep"],
};

const INITIAL_ACCOUNTS = [
  { id: "acc_1", name: "Main Trading Account", broker: "Apex Trader", currency: "USD", initialBalance: "50000", color: "#8B5CF6" },
  { id: "acc_2", name: "Prop Fund Evaluation", broker: "Tradovate", currency: "USD", initialBalance: "25000", color: "#10B981" },
  { id: "acc_3", name: "Personal Futures", broker: "Interactive Brokers", currency: "USD", initialBalance: "10000", color: "#F59E0B" },
];

const INITIAL_TRADES = [
  { id: "t_1", accountId: "acc_1", dateOpen: "2026-06-05", dateClose: "2026-06-05", strategy: "ICT Silver Bullet", pair: "NASDAQ100", direction: "Long", entryPrice: "18450", stopLoss: "18380", takeProfit: "18620", exitPrice: "18610", confluences: ["FVG Tap", "SMT Divergence"], pnl: "2450", comments: "Clean AM Silver Bullet expansion off M5 FVG", lesson: "Patience paid off waiting for liquidity sweep" },
  { id: "t_2", accountId: "acc_1", dateOpen: "2026-06-07", dateClose: "2026-06-07", strategy: "ICT Silver Bullet", pair: "NASDAQ100", direction: "Short", entryPrice: "18520", stopLoss: "18650", takeProfit: "18200", exitPrice: "18600", confluences: ["FVG Tap"], pnl: "-780", comments: "Tight stop sweep on Asia high retest", lesson: "Wait for M5 confirmation candle before market entry" },
  { id: "t_3", accountId: "acc_1", dateOpen: "2026-06-08", dateClose: "2026-06-08", strategy: "AMD Accumulation", pair: "S&P500", direction: "Long", entryPrice: "5420", stopLoss: "5400", takeProfit: "5480", exitPrice: "5465", confluences: ["SMT Divergence"], pnl: "1850", comments: "Clean setup during NY morning session", lesson: "Held firm for target despite mid-session pullback" },
  { id: "t_4", accountId: "acc_1", dateOpen: "2026-06-09", dateClose: "2026-06-09", strategy: "CRT Model", pair: "XAU/USD", direction: "Short", entryPrice: "2350", stopLoss: "2365", takeProfit: "2310", exitPrice: "2360", confluences: ["Order Block"], pnl: "-500", comments: "Slight slippage on stop trigger during news drop", lesson: "Avoid opening trades 10 mins prior to CPI release" },
  { id: "t_5", accountId: "acc_1", dateOpen: "2026-06-10", dateClose: "2026-06-10", strategy: "Breaker Block Retest", pair: "BTC/USD", direction: "Long", entryPrice: "68250", stopLoss: "67500", takeProfit: "71000", exitPrice: "70400", confluences: ["Liquidity Sweep"], pnl: "4300", comments: "Rode expansion wave past key equal highs", lesson: "Great discipline trailing stops into profit" },
  { id: "t_6", accountId: "acc_1", dateOpen: "2026-06-11", dateClose: "2026-06-11", strategy: "Order Block Liquidity", pair: "EUR/USD", direction: "Short", entryPrice: "1.0850", stopLoss: "1.0880", takeProfit: "1.0780", exitPrice: "1.0870", confluences: ["SMT Divergence"], pnl: "-320", comments: "Early entry prior to HTF order block confirmation", lesson: "Stick strictly to execution rules" },
  { id: "t_7", accountId: "acc_1", dateOpen: "2026-06-12", dateClose: "2026-06-12", strategy: "ICT Silver Bullet", pair: "NVDA", direction: "Long", entryPrice: "120.50", stopLoss: "118.00", takeProfit: "128.00", exitPrice: "125.80", confluences: ["FVG Tap"], pnl: "1140", comments: "Scalped partial position into key resistance level", lesson: "Quick partial profit taking preserved gain" },
  { id: "t_8", accountId: "acc_2", dateOpen: "2026-06-14", dateClose: "2026-06-14", strategy: "AMD Accumulation", pair: "AAPL", direction: "Short", entryPrice: "215.00", stopLoss: "218.00", takeProfit: "208.00", exitPrice: "211.20", confluences: ["Liquidity Sweep"], pnl: "1520", comments: "Choppy open resolved nicely down into PM session", lesson: "Controlled position size reduced stress" },
  { id: "t_9", accountId: "acc_2", dateOpen: "2026-06-15", dateClose: "2026-06-15", strategy: "CRT Model", pair: "NASDAQ100", direction: "Long", entryPrice: "18600", stopLoss: "18530", takeProfit: "18780", exitPrice: "18750", confluences: ["Order Block", "FVG Tap"], pnl: "3100", comments: "High probability retest on 15m order block", lesson: "Flawless execution according to plan" },
  { id: "t_10", accountId: "acc_3", dateOpen: "2026-06-16", dateClose: "2026-06-16", strategy: "Breaker Block Retest", pair: "S&P500", direction: "Short", entryPrice: "5480", stopLoss: "5505", takeProfit: "5420", exitPrice: "5440", confluences: ["Breaker Block"], pnl: "1950", comments: "PM session trend reversal play off daily breaker", lesson: "Patience waiting for 4pm candle close" },
  { id: "t_11", accountId: "acc_3", dateOpen: "2026-06-17", dateClose: "2026-06-17", strategy: "ICT Silver Bullet", pair: "XAU/USD", direction: "Long", entryPrice: "2320", stopLoss: "2308", takeProfit: "2350", exitPrice: "2312", confluences: ["SMT Divergence"], pnl: "-410", comments: "USD strength spiked market below SL", lesson: "Mind high impact macro releases" },
  { id: "t_12", accountId: "acc_2", dateOpen: "2026-06-18", dateClose: "2026-06-18", strategy: "Order Block Liquidity", pair: "BTC/USD", direction: "Long", entryPrice: "65100", stopLoss: "64300", takeProfit: "67500", exitPrice: "67200", confluences: ["Liquidity Sweep", "FVG Tap"], pnl: "2850", comments: "Asia session low sweep into demand zone", lesson: "Great risk-to-reward ratio achieved" },
];

const INITIAL_TRANSACTIONS = [
  { id: "tx_1", accountId: "acc_1", date: "2026-06-01", description: "Initial Deposit", amount: "50000" },
  { id: "tx_2", accountId: "acc_2", date: "2026-06-01", description: "Prop Eval Funding", amount: "25000" },
  { id: "tx_3", accountId: "acc_3", date: "2026-06-01", description: "Personal Capital Seed", amount: "10000" },
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const fmtMoney = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

function computeRR(trade) {
  const { direction, entryPrice, stopLoss, takeProfit } = trade;
  const e = parseFloat(entryPrice), s = parseFloat(stopLoss), t = parseFloat(takeProfit);
  if ([e, s, t].some((v) => Number.isNaN(v))) return null;
  let risk, reward;
  if (direction === "Short") { risk = s - e; reward = e - t; }
  else { risk = e - s; reward = t - e; }
  if (risk <= 0) return null;
  return reward / risk;
}

function useDerivedTrades(trades, startingEquity) {
  return useMemo(() => {
    const sorted = [...trades].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || "") || a.id.localeCompare(b.id));
    let balance = startingEquity;
    const map = {};
    for (const t of sorted) {
      const balanceBefore = balance;
      const closed = t.pnl !== null && t.pnl !== undefined && t.pnl !== "";
      const pnlNum = closed ? parseFloat(t.pnl) : null;
      const pnlPercent = closed && balanceBefore !== 0 ? (pnlNum / balanceBefore) * 100 : null;
      if (closed) balance += pnlNum;
      map[t.id] = {
        ...t,
        day: t.dateOpen ? WEEKDAYS[new Date(t.dateOpen + "T00:00:00").getDay()] : "",
        rr: computeRR(t),
        pnlNum,
        pnlPercent,
        balanceBefore,
        balanceAfter: closed ? balance : balanceBefore,
        status: closed ? (pnlNum > 0 ? "Win" : pnlNum < 0 ? "Loss" : "Breakeven") : "Open",
      };
    }
    return trades.map((t) => map[t.id] || t).sort((a, b) => (b.dateOpen || "").localeCompare(a.dateOpen || "") || b.id.localeCompare(a.id));
  }, [trades, startingEquity]);
}

function AnimatedNumber({ value, formatter = (v) => v.toString() }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      setDisplayValue(null);
      return;
    }

    const start = 0;
    const end = value;
    const duration = 1000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateCount);
      }
    };

    animationRef.current = requestAnimationFrame(updateCount);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);

  if (displayValue === null) return <span>—</span>;
  return <span style={{ fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{formatter(displayValue)}</span>;
}

function Modal({ title, onClose, children, wide, theme }) {
  const T = getThemeTokens(theme);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: T.modalOverlay,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 100,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: T.cardBg,
        borderRadius: 24,
        border: `1px solid ${T.cardBorder}`,
        boxShadow: T.cardShadow,
        width: "100%",
        maxWidth: wide ? 760 : 480,
        maxHeight: "90vh",
        overflowY: "auto",
        transition: "all 0.2s ease-in-out",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: `1px solid ${T.cardBorder}`,
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: T.textMain, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: T.textMuted, cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

function Button({ children, onClick, variant = "default", type = "button", disabled, style: override, theme }) {
  const T = getThemeTokens(theme);
  const base = {
    fontFamily: fontBody,
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 14,
    padding: "10px 18px",
    cursor: disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.15s ease",
    border: "none",
    outline: "none",
    opacity: disabled ? 0.6 : 1,
  };

  const variants = {
    primary: { background: T.darkBtn, color: T.darkBtnText, boxShadow: T.isDark ? "0 0 20px rgba(56, 189, 248, 0.3)" : "0 4px 12px rgba(15, 23, 42, 0.15)" },
    purple: { background: C.purple, color: "#FFFFFF", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)" },
    default: { background: T.inputBg, color: T.textMain, border: `1px solid ${T.inputBorder}` },
    outline: { background: "transparent", color: T.textMain, border: `1px solid ${T.cardBorder}` },
    danger: { background: C.redLight, color: C.red },
    ghost: { background: "transparent", color: T.textSub, padding: "6px 10px" },
    google: { background: "#FFFFFF", color: "#1F2937", border: "1px solid #D1D5DB", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...override }}>
      {children}
    </button>
  );
}

function Field({ label, children, hint, theme }) {
  const T = getThemeTokens(theme);
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.textSub, marginBottom: 6 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

function CapitalHeroWidget({ totalPnl, startingEquity, currentEquity, theme }) {
  const T = getThemeTokens(theme);
  const isPositive = totalPnl >= 0;
  const pnlPct = startingEquity > 0 ? (totalPnl / startingEquity) * 100 : 0;
  
  const glowGradient = isPositive
    ? (T.isDark
        ? "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.38) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 80%)"
        : "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.25) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 80%)")
    : (T.isDark
        ? "radial-gradient(circle at 85% 15%, rgba(239, 68, 68, 0.38) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 80%)"
        : "radial-gradient(circle at 85% 15%, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.06) 50%, transparent 80%)");

  const badgeBg = isPositive ? C.greenLight : C.redLight;
  const badgeColor = isPositive ? C.green : C.red;

  return (
    <div
      style={{
        background: T.cardBg,
        backgroundImage: glowGradient,
        borderRadius: 24,
        border: `1px solid ${T.cardBorder}`,
        boxShadow: T.cardShadow,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gridColumn: "1 / -1",
        transition: "all 0.3s ease",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          borderRadius: 20,
          background: badgeBg,
          color: badgeColor,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: fontMono,
          fontVariantNumeric: "tabular-nums"
        }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{isPositive ? "+" : ""}{pnlPct.toFixed(2)}% vs starting capital</span>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
          Total Net P&L
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: isPositive ? C.green : C.red, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}>
          <AnimatedNumber value={totalPnl} formatter={fmtMoney} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div
          style={{
            background: T.isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)",
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 16,
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub }}>Starting Capital</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.textMain, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
            <AnimatedNumber value={startingEquity} formatter={fmtMoney} />
          </div>
        </div>

        <div
          style={{
            background: T.isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.03)",
            border: `1px solid ${T.cardBorder}`,
            borderRadius: 16,
            padding: "12px 16px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub }}>Current Equity</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.purple, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
            <AnimatedNumber value={currentEquity} formatter={fmtMoney} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WinRatioWidget({ winRate, winnersCount, losersCount, theme }) {
  const T = getThemeTokens(theme);
  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    transition: "all 0.2s ease-in-out",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const validWinRate = Math.min(Math.max(winRate || 0, 0), 100);
  const strokeDashoffset = circumference - (validWinRate / 100) * circumference;

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: T.textMain }}>Win ratio</span>
        <span style={{ fontSize: 11, color: T.textMuted, cursor: "help" }} title="Percentage and breakdown of winning vs losing trades">ⓘ</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ position: "relative", width: 78, height: 78, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="78" height="78" viewBox="0 0 78 78">
            <circle
              cx="39"
              cy="39"
              r={radius}
              stroke={T.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx="39"
              cy="39"
              r={radius}
              stroke={C.green}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 39 39)"
              style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </svg>
          <div style={{ position: "absolute", textAlign: "center", display: "flex", alignItems: "baseline", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: T.textMain, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {Math.round(validWinRate)}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: T.textMuted, marginLeft: 1, fontFamily: fontMono }}>%</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, paddingLeft: 4 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.textSub }}>Winning trades</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.textMain, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
              {winnersCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, color: T.textSub }}>Losing trades</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.textMain, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>
              {losersCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getInputStyle = (theme) => {
  const T = getThemeTokens(theme);
  return {
    fontFamily: fontBody,
    width: "100%",
    boxSizing: "border-box",
    background: T.inputBg,
    border: `1px solid ${T.inputBorder}`,
    color: T.textMain,
    borderRadius: 12,
    padding: "10px 14px",
    fontSize: 13,
    outline: "none",
    transition: "all 0.15s ease",
  };
};

function DashboardOverview({ derivedTrades, startingEquity, totalPnl, accounts, activeScope, onScopeChange, theme }) {
  const T = getThemeTokens(theme);
  const inputStyle = getInputStyle(theme);
  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    transition: "all 0.2s ease-in-out",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const [pairSortMode, setPairSortMode] = useState("BEST");
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width < 1024;

  const closed = useMemo(() => derivedTrades.filter((t) => t.status !== "Open"), [derivedTrades]);

  const winners = useMemo(() => closed.filter((t) => t.pnlNum > 0), [closed]);
  const losers = useMemo(() => closed.filter((t) => t.pnlNum < 0), [closed]);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  const profitFactorInfo = useMemo(() => {
    let grossProfit = 0;
    let grossLoss = 0;
    closed.forEach((t) => {
      if (t.pnlNum > 0) grossProfit += t.pnlNum;
      else if (t.pnlNum < 0) grossLoss += Math.abs(t.pnlNum);
    });
    if (grossLoss === 0) return grossProfit > 0 ? "∞" : 0;
    return grossProfit / grossLoss;
  }, [closed]);

  const expectancy = useMemo(() => {
    return closed.length ? totalPnl / closed.length : 0;
  }, [closed, totalPnl]);

  const avgRR = useMemo(() => {
    const valid = closed.filter((t) => t.rr !== null && !Number.isNaN(t.rr));
    if (!valid.length) return null;
    return valid.reduce((sum, t) => sum + t.rr, 0) / valid.length;
  }, [closed]);

  const maxProfitHit = useMemo(() => {
    if (winners.length === 0) return { amount: 0, pct: 0 };
    const maxVal = Math.max(...winners.map((t) => t.pnlNum));
    const pct = startingEquity > 0 ? (maxVal / startingEquity) * 100 : 0;
    return { amount: maxVal, pct };
  }, [winners, startingEquity]);

  const drawdownInfo = useMemo(() => {
    let peak = startingEquity;
    let maxDD = 0;
    let running = startingEquity;
    const chrono = [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || ""));
    for (const t of chrono) {
      running += t.pnlNum;
      if (running > peak) peak = running;
      const dd = peak - running;
      if (dd > maxDD) maxDD = dd;
    }
    const pct = peak > 0 ? (maxDD / peak) * 100 : 0;
    return { maxDD, pct };
  }, [closed, startingEquity]);

  const equityCurveData = useMemo(() => {
    let running = startingEquity;
    const sorted = [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || ""));
    const pts = [{ date: "Start", balance: startingEquity }];
    sorted.forEach((t) => {
      running += t.pnlNum;
      pts.push({ date: t.dateOpen || "N/A", balance: running });
    });
    return pts;
  }, [closed, startingEquity]);

  const dailyPnlData = useMemo(() => {
    const map = {};
    closed.forEach((t) => {
      const d = t.dateOpen || "Unknown";
      map[d] = (map[d] || 0) + t.pnlNum;
    });
    return Object.entries(map).map(([date, pnl]) => ({ date, pnl }));
  }, [closed]);

  const byPair = useMemo(() => {
    const map = {};
    for (const t of closed) {
      if (!t.pair) continue;
      if (!map[t.pair]) map[t.pair] = { pair: t.pair, trades: 0, pnl: 0 };
      map[t.pair].trades += 1;
      map[t.pair].pnl += t.pnlNum;
    }
    const list = Object.values(map);
    if (pairSortMode === "BEST") return list.sort((a, b) => b.pnl - a.pnl);
    return list.sort((a, b) => a.pnl - b.pnl);
  }, [closed, pairSortMode]);

  const isProfitable = totalPnl >= 0;
  const equityColor = isProfitable ? C.green : C.red;
  const gradientId = isProfitable ? "equityGradientGreen" : "equityGradientRed";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: isTablet ? "1fr" : "1fr 1.3fr",
        gap: 24
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: 14
        }}>
          <CapitalHeroWidget
            totalPnl={totalPnl}
            startingEquity={startingEquity}
            currentEquity={startingEquity + totalPnl}
            theme={theme}
          />

          <WinRatioWidget
            winRate={winRate}
            winnersCount={winners.length}
            losersCount={losers.length}
            theme={theme}
          />

          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Profit Factor</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.purple, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
              {profitFactorInfo === "∞" ? "∞" : <AnimatedNumber value={profitFactorInfo} formatter={(v) => v.toFixed(2)} />}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Gross Win / Loss</div>
          </div>

          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Expectancy</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: expectancy >= 0 ? C.green : C.red, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
              <AnimatedNumber value={expectancy} formatter={fmtMoney} />
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Avg Return / Trade</div>
          </div>

          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Avg Risk : Reward</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.purple, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
              {avgRR !== null ? <AnimatedNumber value={avgRR} formatter={(v) => v.toFixed(2) + " R"} /> : "—"}
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Target Ratio</div>
          </div>

          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Peak Drawdown</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.red, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
              -<AnimatedNumber value={drawdownInfo.maxDD} formatter={fmtMoney} />
            </div>
            <div style={{ fontSize: 11, color: C.red, marginTop: 4 }}>
              -{drawdownInfo.pct.toFixed(1)}% Peak-to-Trough
            </div>
          </div>

          <div style={{ ...cardStyle, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Max Profit Hit</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.green, marginTop: 4, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
              +<AnimatedNumber value={maxProfitHit.amount} formatter={fmtMoney} />
            </div>
            <div style={{ fontSize: 11, color: C.green, marginTop: 4 }}>
              +{maxProfitHit.pct.toFixed(1)}% Single Trade Peak
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain }}>Account Growth Trajectory</div>
              <div style={{ fontSize: 12, color: T.textSub }}>Cumulative P&L Progression from Origin</div>
            </div>
            <select
              value={activeScope.mode === "ALL" ? "ALL" : activeScope.selectedIds[0]}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "ALL") onScopeChange({ mode: "ALL", selectedIds: accounts.map(a => a.id) });
                else onScopeChange({ mode: "SINGLE", selectedIds: [val] });
              }}
              style={{ ...inputStyle, width: "auto", padding: "6px 14px", fontSize: 12, fontWeight: 600 }}
            >
              <option value="ALL">Scope: All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurveData}>
                <defs>
                  <linearGradient id="equityGradientGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="equityGradientRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.red} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={C.red} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.chartGrid} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: T.textMuted }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: T.cardBg, borderColor: T.cardBorder, color: T.textMain, borderRadius: 12, backdropFilter: "blur(16px)" }}
                  formatter={(v) => [fmtMoney(v), "Account Balance"]} 
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke={equityColor}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#${gradientId})`}
                  dot={false}
                  activeDot={{ r: 5, fill: equityColor, stroke: "#FFFFFF", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        gap: 20
      }}>
        <div style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Net Daily P&L</div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16 }}>Daily Realized P&L Distribution</div>
          <div style={{ flex: 1, minHeight: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyPnlData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.chartGrid} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: T.textMuted }} />
                <YAxis tick={{ fontSize: 10, fill: T.textMuted }} />
                <Tooltip 
                  contentStyle={{ background: T.cardBg, borderColor: T.cardBorder, color: T.textMain, borderRadius: 12, backdropFilter: "blur(16px)" }}
                  formatter={(v) => [fmtMoney(v), "P&L"]} 
                />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {dailyPnlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? C.green : C.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain }}>Instrument Breakdown</div>
              <div style={{ fontSize: 12, color: T.textSub }}>Cumulative P&L Ranking</div>
            </div>
            <button
              onClick={() => setPairSortMode(pairSortMode === "BEST" ? "WORST" : "BEST")}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: 8,
                border: `1px solid ${T.cardBorder}`,
                background: T.inputBg,
                color: T.textMain,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4
              }}
            >
              <ArrowUpDown size={12} /> {pairSortMode === "BEST" ? "Best Pairs" : "Losing Pairs"}
            </button>
          </div>
          <div style={{ overflowX: "auto", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 260 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${T.cardBorder}`, textAlign: "left", color: T.textMuted }}>
                  <th style={{ padding: "8px 4px" }}>Symbol</th>
                  <th style={{ padding: "8px 4px", textAlign: "center" }}>Trades</th>
                  <th style={{ padding: "8px 4px", textAlign: "right" }}>Net P&L</th>
                </tr>
              </thead>
              <tbody>
                {byPair.map((p) => (
                  <tr key={p.pair} style={{ borderBottom: `1px solid ${T.tableBorder}` }}>
                    <td style={{ padding: "12px 4px", fontWeight: 700, color: T.textMain }}>{p.pair}</td>
                    <td style={{ padding: "12px 4px", textAlign: "center", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textSub }}>{p.trades}</td>
                    <td style={{ padding: "12px 4px", textAlign: "right", fontWeight: 700, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: p.pnl >= 0 ? C.green : C.red }}>
                      {fmtMoney(p.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradeModalForm({ initial, accounts, lists, defaultAccountId, onSave, onCancel, theme }) {
  const inputStyle = getInputStyle(theme);
  const T = getThemeTokens(theme);

  const [form, setForm] = useState(
    initial || {
      id: null,
      accountId: defaultAccountId || accounts[0]?.id || "",
      dateOpen: new Date().toISOString().split("T")[0],
      dateClose: new Date().toISOString().split("T")[0],
      strategy: lists.strategies[0] || "",
      pair: lists.pairs[0] || "",
      direction: "Long",
      entryPrice: "",
      stopLoss: "",
      takeProfit: "",
      exitPrice: "",
      confluences: [],
      pnl: "",
      comments: "",
      lesson: "",
    }
  );

  const toggleConfluence = (sig) => {
    setForm((prev) => {
      const exists = prev.confluences.includes(sig);
      return {
        ...prev,
        confluences: exists ? prev.confluences.filter((c) => c !== sig) : [...prev.confluences, sig],
      };
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.accountId || !form.dateOpen || !form.pair || !form.strategy) return;
        onSave({ ...form, id: form.id || "t_" + uid() });
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Trading Account" theme={theme}>
          <select style={inputStyle} value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} required>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name} ({a.broker})</option>
            ))}
          </select>
        </Field>
        <Field label="Direction" theme={theme}>
          <select style={inputStyle} value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value })}>
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Strategy Playbook" theme={theme}>
          <select style={inputStyle} value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} required>
            <option value="">Select Strategy...</option>
            {lists.strategies.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Instrument / Pair" theme={theme}>
          <select style={inputStyle} value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })} required>
            <option value="">Select Pair...</option>
            {lists.pairs.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Date Opened" theme={theme}>
          <input type="date" style={inputStyle} value={form.dateOpen} onChange={(e) => setForm({ ...form, dateOpen: e.target.value })} required />
        </Field>
        <Field label="Date Closed" theme={theme}>
          <input type="date" style={inputStyle} value={form.dateClose} onChange={(e) => setForm({ ...form, dateClose: e.target.value })} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10 }}>
        <Field label="Entry Price" theme={theme}>
          <input type="number" step="any" style={inputStyle} value={form.entryPrice} onChange={(e) => setForm({ ...form, entryPrice: e.target.value })} placeholder="0.00" />
        </Field>
        <Field label="Stop Loss" theme={theme}>
          <input type="number" step="any" style={inputStyle} value={form.stopLoss} onChange={(e) => setForm({ ...form, stopLoss: e.target.value })} placeholder="0.00" />
        </Field>
        <Field label="Take Profit" theme={theme}>
          <input type="number" step="any" style={inputStyle} value={form.takeProfit} onChange={(e) => setForm({ ...form, takeProfit: e.target.value })} placeholder="0.00" />
        </Field>
        <Field label="Exit Price" theme={theme}>
          <input type="number" step="any" style={inputStyle} value={form.exitPrice} onChange={(e) => setForm({ ...form, exitPrice: e.target.value })} placeholder="0.00" />
        </Field>
      </div>

      <Field label="Realized Net P&L ($)" theme={theme}>
        <input type="number" step="any" style={inputStyle} value={form.pnl} onChange={(e) => setForm({ ...form, pnl: e.target.value })} placeholder="e.g. 2450 or -780" />
      </Field>

      <Field label="Confluence / Signal Tags" theme={theme}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
          {lists.signals.map((sig) => {
            const selected = form.confluences.includes(sig);
            return (
              <button
                key={sig}
                type="button"
                onClick={() => toggleConfluence(sig)}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "5px 12px",
                  borderRadius: 8,
                  border: `1px solid ${selected ? C.purple : T.cardBorder}`,
                  background: selected ? C.purpleLight : T.inputBg,
                  color: selected ? C.purple : T.textSub,
                  cursor: "pointer",
                }}
              >
                {sig}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Trade Rationale & Comments" theme={theme}>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="Entry setup notes..." />
      </Field>

      <Field label="Key Lessons Learned" theme={theme}>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })} placeholder="Execution reflection..." />
      </Field>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <Button onClick={onCancel} variant="outline" theme={theme}>Cancel</Button>
        <Button variant="primary" type="submit" theme={theme}>Save Trade Record</Button>
      </div>
    </form>
  );
}

function CapitalLedgerView({ transactions, accounts, activeScope, onAddAccount, onEditAccount, onDeleteAccount, onAddTransaction, onEditTransaction, onDeleteTransaction, theme }) {
  const T = getThemeTokens(theme);
  const inputStyle = getInputStyle(theme);
  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const [accModalOpen, setAccModalOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState(null);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [txForm, setTxForm] = useState({ id: null, accountId: accounts[0]?.id || "", date: new Date().toISOString().split("T")[0], description: "", amount: "" });
  const [accForm, setAccForm] = useState({ id: null, name: "", broker: "", currency: "USD", initialBalance: "50000", color: "#8B5CF6" });

  const filteredTx = useMemo(() => {
    if (activeScope.mode === "ALL") return transactions;
    return transactions.filter((t) => activeScope.selectedIds.includes(t.accountId));
  }, [transactions, activeScope]);

  const totalDeposits = useMemo(() => filteredTx.filter((t) => parseFloat(t.amount || 0) > 0).reduce((s, t) => s + parseFloat(t.amount), 0), [filteredTx]);
  const totalWithdrawals = useMemo(() => filteredTx.filter((t) => parseFloat(t.amount || 0) < 0).reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0), [filteredTx]);
  const netCapital = totalDeposits - totalWithdrawals;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Net Capital Seeded</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.purple, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(netCapital)}</div>
        </div>
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Total Deposits</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.green, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(totalDeposits)}</div>
        </div>
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Total Withdrawals</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.red, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(totalWithdrawals)}</div>
        </div>
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Active Accounts</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: T.textMain, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>{accounts.length} Accounts</div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.textMain, margin: 0 }}>Trading Accounts Portfolio</h3>
          <Button variant="primary" theme={theme} onClick={() => { setEditingAcc(null); setAccForm({ id: null, name: "", broker: "", currency: "USD", initialBalance: "50000", color: "#8B5CF6" }); setAccModalOpen(true); }}>
            <Plus size={15} /> Add Account
          </Button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {accounts.map((acc) => (
            <div key={acc.id} style={{ background: T.inputBg, border: `1px solid ${T.cardBorder}`, borderRadius: 16, padding: 18, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: acc.color }}>{acc.name}</span>
                <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: T.cardBg, border: `1px solid ${T.cardBorder}`, color: T.textSub }}>{acc.broker}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textMain, marginBottom: 14 }}>
                ${parseFloat(acc.initialBalance || 0).toLocaleString()} <span style={{ fontSize: 12, color: T.textMuted }}>{acc.currency}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="outline" theme={theme} onClick={() => { setEditingAcc(acc); setAccForm(acc); setAccModalOpen(true); }} style={{ padding: "6px 12px", fontSize: 11 }}>Edit</Button>
                {accounts.length > 1 && (
                  <Button variant="danger" theme={theme} onClick={() => onDeleteAccount(acc.id)} style={{ padding: "6px 12px", fontSize: 11 }}>Delete</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: T.textMain, margin: 0 }}>Capital Transactions Log</h3>
          <Button variant="primary" theme={theme} onClick={() => { setEditingTx(null); setTxForm({ id: null, accountId: accounts[0]?.id || "", date: new Date().toISOString().split("T")[0], description: "", amount: "" }); setTxModalOpen(true); }}>
            <Plus size={15} /> Log Capital Event
          </Button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 540 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.cardBorder}`, textAlign: "left", color: T.textMuted }}>
                <th style={{ padding: "12px 10px" }}>Date</th>
                <th style={{ padding: "12px 10px" }}>Account</th>
                <th style={{ padding: "12px 10px" }}>Description</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Amount ($)</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx) => {
                const acc = accounts.find((a) => a.id === tx.accountId);
                const amt = parseFloat(tx.amount || 0);
                return (
                  <tr key={tx.id} style={{ borderBottom: `1px solid ${T.tableBorder}` }}>
                    <td style={{ padding: "14px 10px", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textSub }}>{tx.date}</td>
                    <td style={{ padding: "14px 10px", fontWeight: 600, color: acc?.color || T.textMain }}>{acc?.name || "N/A"}</td>
                    <td style={{ padding: "14px 10px", color: T.textMain }}>{tx.description}</td>
                    <td style={{ padding: "14px 10px", textAlign: "right", fontWeight: 700, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: amt >= 0 ? C.green : C.red }}>
                      {fmtMoney(amt)}
                    </td>
                    <td style={{ padding: "14px 10px", textAlign: "right" }}>
                      <button onClick={() => { setEditingTx(tx); setTxForm(tx); setTxModalOpen(true); }} style={{ background: "transparent", border: "none", color: T.textSub, cursor: "pointer", marginRight: 10 }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => onDeleteTransaction(tx.id)} style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {accModalOpen && (
        <Modal title={editingAcc ? "Edit Trading Account" : "Add Trading Account"} onClose={() => setAccModalOpen(false)} theme={theme}>
          <form onSubmit={(e) => { 
            e.preventDefault(); 
            if (editingAcc) {
              onEditAccount(accForm);
            } else {
              const newAccId = "acc_" + uid();
              const newAcc = { ...accForm, id: newAccId };
              onAddAccount(newAcc);
              if (accForm.initialBalance && parseFloat(accForm.initialBalance) > 0) {
                onAddTransaction({
                  id: "tx_" + uid(),
                  accountId: newAccId,
                  date: new Date().toISOString().split("T")[0],
                  description: "Initial Account Capital",
                  amount: accForm.initialBalance
                });
              }
            }
            setAccModalOpen(false); 
          }}>
            <Field label="Account Name" theme={theme}>
              <input style={inputStyle} value={accForm.name} onChange={(e) => setAccForm({ ...accForm, name: e.target.value })} required placeholder="e.g. Apex 50k Eval" />
            </Field>
            <Field label="Broker / Firm" theme={theme}>
              <input style={inputStyle} value={accForm.broker} onChange={(e) => setAccForm({ ...accForm, broker: e.target.value })} required placeholder="e.g. Tradovate" />
            </Field>
            <Field label="Initial Balance ($)" theme={theme}>
              <input type="number" style={inputStyle} value={accForm.initialBalance} onChange={(e) => setAccForm({ ...accForm, initialBalance: e.target.value })} required placeholder="50000" />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <Button variant="outline" theme={theme} onClick={() => setAccModalOpen(false)}>Cancel</Button>
              <Button variant="primary" theme={theme} type="submit">Save Account</Button>
            </div>
          </form>
        </Modal>
      )}

      {txModalOpen && (
        <Modal title={editingTx ? "Edit Capital Event" : "Log Capital Event"} onClose={() => setTxModalOpen(false)} theme={theme}>
          <form onSubmit={(e) => { e.preventDefault(); if (editingTx) onEditTransaction(txForm); else onAddTransaction({ ...txForm, id: "tx_" + uid() }); setTxModalOpen(false); }}>
            <Field label="Trading Account" theme={theme}>
              <select style={inputStyle} value={txForm.accountId} onChange={(e) => setTxForm({ ...txForm, accountId: e.target.value })} required>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Date" theme={theme}>
              <input type="date" style={inputStyle} value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} required />
            </Field>
            <Field label="Description" theme={theme}>
              <input style={inputStyle} value={txForm.description} onChange={(e) => setTxForm({ ...txForm, description: e.target.value })} required placeholder="Deposit, Withdrawal, Payout..." />
            </Field>
            <Field label="Amount ($)" hint="Positive for deposits, negative for withdrawals" theme={theme}>
              <input type="number" step="any" style={inputStyle} value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} required placeholder="5000 or -1200" />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <Button variant="outline" theme={theme} onClick={() => setTxModalOpen(false)}>Cancel</Button>
              <Button variant="primary" theme={theme} type="submit">Save Transaction</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function JournalSettingsView({ lists, onUpdateLists, theme }) {
  const T = getThemeTokens(theme);
  const inputStyle = getInputStyle(theme);
  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const [newStrategy, setNewStrategy] = useState("");
  const [newPair, setNewPair] = useState("");
  const [newSignal, setNewSignal] = useState("");

  const handleAddStrategy = (e) => {
    e.preventDefault();
    const val = newStrategy.trim();
    if (!val || lists.strategies.includes(val)) return;
    onUpdateLists({ ...lists, strategies: [...lists.strategies, val] });
    setNewStrategy("");
  };

  const handleDeleteStrategy = (item) => {
    onUpdateLists({ ...lists, strategies: lists.strategies.filter((s) => s !== item) });
  };

  const handleAddPair = (e) => {
    e.preventDefault();
    const val = newPair.trim();
    if (!val || lists.pairs.includes(val)) return;
    onUpdateLists({ ...lists, pairs: [...lists.pairs, val] });
    setNewPair("");
  };

  const handleDeletePair = (item) => {
    onUpdateLists({ ...lists, pairs: lists.pairs.filter((p) => p !== item) });
  };

  const handleAddSignal = (e) => {
    e.preventDefault();
    const val = newSignal.trim();
    if (!val || lists.signals.includes(val)) return;
    onUpdateLists({ ...lists, signals: [...lists.signals, val] });
    setNewSignal("");
  };

  const handleDeleteSignal = (item) => {
    onUpdateLists({ ...lists, signals: lists.signals.filter((s) => s !== item) });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: T.textMain, marginBottom: 6 }}>Journal Dropdown Configuration</div>
        <div style={{ fontSize: 13, color: T.textSub }}>
          Manage strategy models, instruments, and technical confluence tags. Items added here will appear in your trade logging drop-down selections.
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Strategy Playbooks</div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16 }}>Document setup models (e.g., ICT Silver Bullet, Order Block Retest, CRT Model).</div>

        <form onSubmit={handleAddStrategy} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Add new strategy model (e.g. 15M FVG Expansion)..."
            value={newStrategy}
            onChange={(e) => setNewStrategy(e.target.value)}
          />
          <Button variant="primary" theme={theme} type="submit">
            <Plus size={15} /> Add Strategy
          </Button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {lists.strategies.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 10,
                background: T.inputBg,
                border: `1px solid ${T.cardBorder}`,
                color: T.textMain,
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => handleDeleteStrategy(item)}
                style={{ background: "transparent", border: "none", color: T.textMuted, cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Tracked Asset Pairs & Tickers</div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16 }}>Define instruments traded (e.g., NASDAQ100, XAU/USD, EUR/USD, NVDA).</div>

        <form onSubmit={handleAddPair} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Add new symbol/pair (e.g. SOL/USD, USOIL, META)..."
            value={newPair}
            onChange={(e) => setNewPair(e.target.value)}
          />
          <Button variant="primary" theme={theme} type="submit">
            <Plus size={15} /> Add Pair
          </Button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {lists.pairs.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 10,
                background: T.inputBg,
                border: `1px solid ${T.cardBorder}`,
                color: T.textMain,
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => handleDeletePair(item)}
                style={{ background: "transparent", border: "none", color: T.textMuted, cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Execution Confluence & Signal Tags</div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16 }}>Define technical confirmation triggers (e.g., SMT Divergence, FVG Tap, Breaker Block).</div>

        <form onSubmit={handleAddSignal} style={{ display: "flex", gap: 12, marginBottom: 18 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Add new confluence tag (e.g. Asian High Sweep)..."
            value={newSignal}
            onChange={(e) => setNewSignal(e.target.value)}
          />
          <Button variant="primary" theme={theme} type="submit">
            <Plus size={15} /> Add Confluence Tag
          </Button>
        </form>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {lists.signals.map((item) => (
            <span
              key={item}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: "8px 14px",
                borderRadius: 10,
                background: C.purpleLight,
                border: `1px solid rgba(139, 92, 246, 0.25)`,
                color: C.purple,
              }}
            >
              {item}
              <button
                type="button"
                onClick={() => handleDeleteSignal(item)}
                style={{ background: "transparent", border: "none", color: C.purple, cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceAnalyticsView({ derivedTrades, lists, theme }) {
  const T = getThemeTokens(theme);
  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const windowSize = useWindowSize();
  const [selectedStrategy, setSelectedStrategy] = useState("ALL");
  const [calendarDate, setCalendarDate] = useState(new Date());

  const filteredTrades = useMemo(() => {
    if (selectedStrategy === "ALL") return derivedTrades;
    return derivedTrades.filter((t) => t.strategy === selectedStrategy);
  }, [derivedTrades, selectedStrategy]);

  const closed = useMemo(() => filteredTrades.filter((t) => t.status !== "Open"), [filteredTrades]);

  const totalPnl = useMemo(() => closed.reduce((sum, t) => sum + (t.pnlNum || 0), 0), [closed]);
  const winners = useMemo(() => closed.filter((t) => (t.pnlNum || 0) > 0), [closed]);
  const losers = useMemo(() => closed.filter((t) => (t.pnlNum || 0) < 0), [closed]);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  const byStrategy = useMemo(() => {
    const map = {};
    for (const t of derivedTrades) {
      if (!t.strategy) continue;
      if (!map[t.strategy]) {
        map[t.strategy] = { strategy: t.strategy, trades: 0, wins: 0, losses: 0, pnl: 0, winSum: 0, lossSum: 0, tradesList: [] };
      }
      map[t.strategy].tradesList.push(t);
      if (t.status !== "Open") {
        map[t.strategy].trades += 1;
        map[t.strategy].pnl += t.pnlNum || 0;
        if ((t.pnlNum || 0) > 0) {
          map[t.strategy].wins += 1;
          map[t.strategy].winSum += t.pnlNum;
        } else if ((t.pnlNum || 0) < 0) {
          map[t.strategy].losses += 1;
          map[t.strategy].lossSum += Math.abs(t.pnlNum);
        }
      }
    }
    return Object.values(map).map((s) => {
      const sortedTrades = [...s.tradesList].sort((a, b) => (b.dateOpen || "").localeCompare(a.dateOpen || ""));
      let currentStreak = 0;
      let streakType = null;
      for (const t of sortedTrades) {
        if (t.status === "Open") continue;
        const isWin = (t.pnlNum || 0) > 0;
        if (streakType === null) {
          streakType = isWin ? "W" : "L";
          currentStreak = 1;
        } else if ((isWin && streakType === "W") || (!isWin && streakType === "L")) {
          currentStreak += 1;
        } else {
          break;
        }
      }
      const pf = s.lossSum > 0 ? (s.winSum / s.lossSum) : (s.winSum > 0 ? "∞" : "0.00");
      const winPct = s.trades > 0 ? (s.wins / s.trades) * 100 : 0;
      return {
        ...s,
        winPct,
        profitFactor: typeof pf === "number" ? pf.toFixed(2) : pf,
        streak: streakType ? `${streakType === "W" ? "🔥" : "❄️"} ${currentStreak}${streakType}` : "—",
      };
    }).sort((a, b) => b.pnl - a.pnl);
  }, [derivedTrades]);

  const cumulativeData = useMemo(() => {
    let running = 0;
    const sorted = [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || ""));
    return sorted.map((t, idx) => {
      running += t.pnlNum || 0;
      return {
        idx: idx + 1,
        date: t.dateOpen || `Trade #${idx + 1}`,
        pnl: running,
        tradePnl: t.pnlNum || 0,
        pair: t.pair,
      };
    });
  }, [closed]);

  const dailyPnlMap = useMemo(() => {
    const map = {};
    closed.forEach((t) => {
      const d = t.dateOpen || t.dateClose;
      if (!d) return;
      map[d] = (map[d] || 0) + (t.pnlNum || 0);
    });
    return map;
  }, [closed]);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ empty: true, id: "empty_" + i });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const pnl = dailyPnlMap[dateStr];
      cells.push({ empty: false, day, dateStr, pnl });
    }
    return cells;
  }, [year, month, firstDayIndex, daysInMonth, dailyPnlMap]);

  const weekdayData = useMemo(() => {
    const weekdayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const map = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
    closed.forEach((t) => {
      const dayName = t.day;
      if (dayName && map[dayName] !== undefined) {
        map[dayName] += t.pnlNum || 0;
      }
    });
    return weekdayNames.map((day) => ({
      day: day.slice(0, 3),
      fullName: day,
      pnl: map[day],
    }));
  }, [closed]);

  const isProfitable = totalPnl >= 0;
  const analyticsColor = isProfitable ? C.green : C.red;
  const gradientId = isProfitable ? "analyticsGradientGreen" : "analyticsGradientRed";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ ...cardStyle, padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: T.textMain, margin: 0 }}>Performance Analytics</h2>
          <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>
            Detailed breakdown by strategy playbooks, daily calendar heatmaps, and weekday distributions
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.textSub }}>Filter Strategy:</span>
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value)}
            style={{
              background: T.inputBg,
              border: `1px solid ${T.inputBorder}`,
              borderRadius: 12,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: T.textMain,
              outline: "none",
              cursor: "pointer",
              minWidth: 180,
            }}
          >
            <option value="ALL">All Strategies ({derivedTrades.length})</option>
            {lists.strategies.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Filtered Net P&L</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: totalPnl >= 0 ? C.green : C.red, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
            <AnimatedNumber value={totalPnl} formatter={fmtMoney} />
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>
            {selectedStrategy === "ALL" ? "Across All Playbooks" : selectedStrategy}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, textTransform: "uppercase" }}>Win Rate</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: T.textMain, marginTop: 6, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
            <AnimatedNumber value={winRate} formatter={(v) => v.toFixed(1) + "%"} />
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>
            {winners.length} Wins / {losers.length} Losses ({closed.length} Total)
          </div>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: windowSize.width < 1024 ? "1fr" : "1fr 1fr",
        gap: 20
      }}>
        <div style={{ ...cardStyle, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain }}>Daily P&L Heatmap Calendar</div>
              <div style={{ fontSize: 12, color: T.textSub }}>Realized daily performance calendar</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.textMain, fontFamily: fontMono }}>
                {calendarDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                  style={{ background: T.inputBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: 6, cursor: "pointer", color: T.textMain, display: "flex" }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                  style={{ background: T.inputBg, border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: 6, cursor: "pointer", color: T.textMain, display: "flex" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: T.textMuted }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {calendarCells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.id} style={{ minHeight: 64, borderRadius: 10, background: "transparent" }} />;
              }
              const hasPnl = cell.pnl !== undefined;
              const isWin = hasPnl && cell.pnl > 0;
              const isLoss = hasPnl && cell.pnl < 0;

              const cellBg = isWin ? C.greenLight : isLoss ? C.redLight : T.inputBg;
              const cellBorder = isWin ? "rgba(16, 185, 129, 0.3)" : isLoss ? "rgba(239, 68, 68, 0.3)" : T.cardBorder;
              const cellColor = isWin ? C.green : isLoss ? C.red : T.textMuted;

              return (
                <div
                  key={cell.dateStr}
                  style={{
                    minHeight: 64,
                    borderRadius: 12,
                    background: cellBg,
                    border: `1px solid ${cellBorder}`,
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.textSub, fontFamily: fontMono }}>
                    {cell.day}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {hasPnl ? (
                      <span style={{ fontSize: 11, fontWeight: 800, color: cellColor, fontFamily: fontMono, fontVariantNumeric: "tabular-nums" }}>
                        {cell.pnl >= 0 ? "+" : ""}${Math.round(cell.pnl).toLocaleString()}
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, color: T.textMuted }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...cardStyle, padding: 24, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>P/L by Weekday Distribution</div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 18 }}>Performance aggregated across days of the week</div>
          <div style={{ flex: 1, minHeight: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekdayData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.chartGrid} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: T.textMuted }} />
                <YAxis tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ background: T.cardBg, borderColor: T.cardBorder, color: T.textMain, borderRadius: 12, backdropFilter: "blur(16px)" }}
                  formatter={(v) => [fmtMoney(v), "Net P&L"]} 
                />
                <Bar dataKey="pnl" radius={[6, 6, 0, 0]}>
                  {weekdayData.map((entry, index) => (
                    <Cell key={`cell-weekday-${index}`} fill={entry.pnl >= 0 ? C.green : C.red} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>
          Cumulative P&L Trajectory ({selectedStrategy === "ALL" ? "All Strategies" : selectedStrategy})
        </div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 18 }}>Progressive equity progression over filtered trades</div>
        {cumulativeData.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: T.textMuted, fontSize: 13 }}>
            No closed trades found for the selected strategy filter.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="analyticsGradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="analyticsGradientRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.red} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={C.red} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={T.chartGrid} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: T.textMuted }} />
              <YAxis tick={{ fontSize: 11, fill: T.textMuted }} tickFormatter={(v) => `$${v}`} />
              <Tooltip 
                contentStyle={{ background: T.cardBg, borderColor: T.cardBorder, color: T.textMain, borderRadius: 12, backdropFilter: "blur(16px)" }}
                formatter={(v) => [fmtMoney(v), "Cumulative P&L"]} 
              />
              <Area type="monotone" dataKey="pnl" stroke={analyticsColor} strokeWidth={2.5} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 5, fill: analyticsColor, stroke: "#FFFFFF", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={{ ...cardStyle, padding: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.textMain, marginBottom: 4 }}>Strategy Execution Playbooks Matrix</div>
        <div style={{ fontSize: 12, color: T.textSub, marginBottom: 18 }}>Performance & Active Streaks Breakdown Across Playbooks</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.cardBorder}`, textAlign: "left", color: T.textMuted }}>
                <th style={{ padding: "12px 10px" }}>Strategy Model</th>
                <th style={{ padding: "12px 10px", textAlign: "center" }}>Trades (Wins)</th>
                <th style={{ padding: "12px 10px", textAlign: "center" }}>Win Rate</th>
                <th style={{ padding: "12px 10px", textAlign: "center" }}>Profit Factor</th>
                <th style={{ padding: "12px 10px", textAlign: "center" }}>Streak</th>
                <th style={{ padding: "12px 10px", textAlign: "right" }}>Net Realized P&L</th>
              </tr>
            </thead>
            <tbody>
              {byStrategy.map((s) => (
                <tr key={s.strategy} style={{ borderBottom: `1px solid ${T.tableBorder}` }}>
                  <td style={{ padding: "14px 10px", fontWeight: 700, color: T.textMain }}>{s.strategy}</td>
                  <td style={{ padding: "14px 10px", textAlign: "center", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textSub }}>
                    {s.trades} ({s.wins})
                  </td>
                  <td style={{ padding: "14px 10px", textAlign: "center", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textMain }}>
                    {s.winPct.toFixed(1)}%
                  </td>
                  <td style={{ padding: "14px 10px", textAlign: "center", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textSub }}>
                    {s.profitFactor}
                  </td>
                  <td style={{ padding: "14px 10px", textAlign: "center", fontWeight: 700 }}>
                    {s.streak}
                  </td>
                  <td style={{ padding: "14px 10px", textAlign: "right", fontWeight: 700, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: s.pnl >= 0 ? C.green : C.red }}>
                    {fmtMoney(s.pnl)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessPasscode, setAccessPasscode] = useState("");
  const [traderName, setTraderName] = useState("Alex Trader");
  const [loginError, setLoginError] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [page, setPage] = useState("overview");
  const [theme, setTheme] = useState("dark");
  const T = getThemeTokens(theme);
  
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [lists, setLists] = useState(DEFAULT_LISTS);
  
  const [activeScope, setActiveScope] = useState({ mode: "ALL", selectedIds: ["acc_1", "acc_2", "acc_3"] });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState(null);

  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState("initializing");

  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  const cardStyle = {
    background: T.cardBg,
    borderRadius: 24,
    border: `1px solid ${T.cardBorder}`,
    boxShadow: T.cardShadow,
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    transition: "all 0.2s ease-in-out",
  };

  // Vanta.js NET Background Integration
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    let threeScript = document.querySelector('script[src*="three.min.js"]') || document.querySelector('script[src*="three.r134.min.js"]');
    let vantaScript = document.querySelector('script[src*="vanta.net.min.js"]');

    const initVanta = () => {
      if (window.VANTA && window.THREE && vantaRef.current && !vantaEffectRef.current) {
        try {
          vantaEffectRef.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.00,
            scaleMobile: 1.00,
            color: theme === "dark" ? 0x5600ff : 0x38bdf8,
            backgroundColor: theme === "dark" ? 0x000000 : 0xf1f3f7,
            points: 20.0,
            maxDistance: 15.0,
            spacing: 14.0,
            showDots: false
          });
        } catch (e) {
          console.error("Vanta NET init error:", e);
        }
      }
    };

    if (!threeScript) {
      threeScript = document.createElement("script");
      threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      document.head.appendChild(threeScript);
      threeScript.onload = () => {
        if (!vantaScript) {
          vantaScript = document.createElement("script");
          vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
          document.head.appendChild(vantaScript);
          vantaScript.onload = initVanta;
        } else {
          initVanta();
        }
      };
    } else if (!vantaScript) {
      vantaScript = document.createElement("script");
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
      document.head.appendChild(vantaScript);
      vantaScript.onload = initVanta;
    } else {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
      initVanta();
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, [theme]);

  useEffect(() => {
    if (!auth) {
      setIsAuthReady(true);
      setSyncStatus("offline");
      return;
    }

    let isMounted = true;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        }
      } catch (err) {
        console.error("Auth sign-in error:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!isMounted) return;
      setUser(currentUser);
      setIsAuthReady(true);
      if (currentUser) {
        if (currentUser.displayName) {
          setTraderName(currentUser.displayName);
        }
        setIsAuthenticated(true);
        setSyncStatus("synced");
      } else {
        setSyncStatus("offline");
      }
    });

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !isAuthReady || !user || !db) return;

    setSyncStatus("saving");

    const accountsCol = collection(db, 'artifacts', appId, 'users', user.uid, 'accounts');
    const unsubAccounts = onSnapshot(accountsCol, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_ACCOUNTS.forEach((acc) => {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'accounts', acc.id), acc);
        });
      } else {
        const loadedAccs = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        setAccounts(loadedAccs);
      }
      setSyncStatus("synced");
    }, (err) => {
      console.error("Firestore accounts snapshot error:", err);
      setSyncStatus("offline");
    });

    const tradesCol = collection(db, 'artifacts', appId, 'users', user.uid, 'trades');
    const unsubTrades = onSnapshot(tradesCol, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_TRADES.forEach((t) => {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'trades', t.id), t);
        });
      } else {
        const loadedTrades = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        setTrades(loadedTrades);
      }
      setSyncStatus("synced");
    }, (err) => {
      console.error("Firestore trades snapshot error:", err);
    });

    const txCol = collection(db, 'artifacts', appId, 'users', user.uid, 'transactions');
    const unsubTx = onSnapshot(txCol, (snapshot) => {
      if (snapshot.empty) {
        INITIAL_TRANSACTIONS.forEach((tx) => {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id), tx);
        });
      } else {
        const loadedTx = snapshot.docs.map(d => ({ ...d.data(), id: d.id }));
        setTransactions(loadedTx);
      }
      setSyncStatus("synced");
    }, (err) => {
      console.error("Firestore transactions snapshot error:", err);
    });

    const settingsDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'lists');
    const unsubSettings = onSnapshot(settingsDocRef, (docSnap) => {
      if (!docSnap.exists()) {
        setDoc(settingsDocRef, DEFAULT_LISTS);
      } else {
        setLists(docSnap.data());
      }
      setSyncStatus("synced");
    }, (err) => {
      console.error("Firestore settings snapshot error:", err);
    });

    return () => {
      unsubAccounts();
      unsubTrades();
      unsubTx();
      unsubSettings();
    };
  }, [isAuthenticated, isAuthReady, user]);

  const handleGoogleLogin = async () => {
    if (!auth || !googleProvider) {
      // Fallback if Firebase auth isn't configured
      setIsAuthenticated(true);
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setUser(result.user);
        if (result.user.displayName) setTraderName(result.user.displayName);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Google sign-in popup error:", err);
      // Fallback to anonymous auth if popup is blocked
      try {
        const anonResult = await signInAnonymously(auth);
        setUser(anonResult.user);
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(true);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSaveTrade = async (trade) => {
    if (editingTrade) {
      setTrades(prev => prev.map(t => t.id === trade.id ? trade : t));
      if (user && db) {
        setSyncStatus("saving");
        try {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'trades', trade.id), trade, { merge: true });
          setSyncStatus("synced");
        } catch (err) {
          console.error("Error updating trade:", err);
        }
      }
    } else {
      setTrades(prev => [trade, ...prev]);
      if (user && db) {
        setSyncStatus("saving");
        try {
          await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'trades', trade.id), trade);
          setSyncStatus("synced");
        } catch (err) {
          console.error("Error adding trade:", err);
        }
      }
    }
  };

  const handleDeleteTrade = async (tradeId) => {
    setTrades(prev => prev.filter(t => t.id !== tradeId));
    if (user && db) {
      setSyncStatus("saving");
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'trades', tradeId));
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error deleting trade:", err);
      }
    }
  };

  const handleAddAccount = async (acc) => {
    setAccounts(prev => [...prev, acc]);
    if (user && db) {
      setSyncStatus("saving");
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'accounts', acc.id), acc);
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error adding account:", err);
      }
    }
  };

  const handleEditAccount = async (acc) => {
    setAccounts(prev => prev.map(a => a.id === acc.id ? acc : a));
    if (user && db) {
      setSyncStatus("saving");
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'accounts', acc.id), acc, { merge: true });
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error editing account:", err);
      }
    }
  };

  const handleDeleteAccount = async (accId) => {
    if (accounts.length <= 1) return;
    setAccounts(prev => prev.filter(a => a.id !== accId));
    if (user && db) {
      setSyncStatus("saving");
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'accounts', accId));
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error deleting account:", err);
      }
    }
  };

  const handleAddTransaction = async (tx) => {
    setTransactions(prev => [tx, ...prev]);
    if (user && db) {
      setSyncStatus("saving");
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id), tx);
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error adding transaction:", err);
      }
    }
  };

  const handleEditTransaction = async (tx) => {
    setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    if (user && db) {
      setSyncStatus("saving");
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', tx.id), tx, { merge: true });
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error editing transaction:", err);
      }
    }
  };

  const handleDeleteTransaction = async (txId) => {
    setTransactions(prev => prev.filter(t => t.id !== txId));
    if (user && db) {
      setSyncStatus("saving");
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'transactions', txId));
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error deleting transaction:", err);
      }
    }
  };

  const handleUpdateLists = async (newLists) => {
    setLists(newLists);
    if (user && db) {
      setSyncStatus("saving");
      try {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'lists'), newLists);
        setSyncStatus("synced");
      } catch (err) {
        console.error("Error updating settings lists:", err);
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    if (activeScope.mode === "ALL") return transactions;
    return transactions.filter((t) => activeScope.selectedIds.includes(t.accountId));
  }, [transactions, activeScope]);

  const startingEquity = useMemo(() => {
    return filteredTransactions.reduce((s, t) => s + parseFloat(t.amount || 0), 0);
  }, [filteredTransactions]);

  const filteredTrades = useMemo(() => {
    if (activeScope.mode === "ALL") return trades;
    return trades.filter((t) => activeScope.selectedIds.includes(t.accountId));
  }, [trades, activeScope]);

  const derivedTrades = useDerivedTrades(filteredTrades, startingEquity);
  const totalPnl = useMemo(() => derivedTrades.filter((t) => t.status !== "Open").reduce((s, t) => s + (t.pnlNum || 0), 0), [derivedTrades]);

  const navItems = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    { key: "trades", label: "Trade Log", icon: NotebookText },
    { key: "transactions", label: "Ledger", icon: Wallet },
    { key: "charts", label: "Analytics", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: SlidersHorizontal },
  ];

  if (!isAuthenticated) {
    return (
      <div
        ref={vantaRef}
        style={{
          background: T.bg,
          color: T.textMain,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontBody,
          padding: 20,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
        
        <div style={{
          background: T.cardBg,
          borderRadius: 28,
          border: `1px solid ${T.cardBorder}`,
          boxShadow: T.cardShadow,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 440,
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          position: "relative",
          zIndex: 10
        }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: T.isDark ? "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)" : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(56, 189, 248, 0.3)"
            }}>
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: T.textMain, margin: "0 0 6px" }}>The Ledger</h1>
            <p style={{ fontSize: 13, color: T.textSub, margin: 0 }}>NovaPay Shared Trading Journal & Analytics</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <Button
              variant="google"
              theme={theme}
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              style={{ width: "100%", justifyContent: "center", padding: "12px 18px", fontSize: 14, fontWeight: 700 }}
            >
              {googleLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{googleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
            </Button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0", color: T.textMuted, fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
            <span>or sign in with name</span>
            <div style={{ flex: 1, height: 1, background: T.cardBorder }} />
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (traderName.trim().length > 0) {
              setIsAuthenticated(true);
              setLoginError(false);
            } else {
              setLoginError(true);
            }
          }}>
            <Field label="Trader Name / Alias" theme={theme}>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.textMuted }} />
                <input
                  style={{ ...getInputStyle(theme), paddingLeft: 42 }}
                  placeholder="Enter your name (e.g. Alex, Sarah)..."
                  value={traderName}
                  onChange={(e) => setTraderName(e.target.value)}
                />
              </div>
            </Field>

            {loginError && (
              <div style={{ fontSize: 12, color: C.red, marginBottom: 14, fontWeight: 600 }}>
                Please enter a valid trader name to join the journal.
              </div>
            )}

            <Button variant="primary" type="submit" theme={theme} style={{ width: "100%", justifyContent: "center", padding: "12px 18px", fontSize: 14 }}>
              Enter Trading Journal Workspace
            </Button>
          </form>

          <div style={{ marginTop: 24, textAlign: "center", fontSize: 11, color: T.textMuted }}>
            Secure Cloud Synchronized • Built for Collaborative Trading Groups
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={vantaRef}
      style={{
        background: T.bg,
        color: T.textMain,
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        fontFamily: fontBody,
        transition: "background-color 0.3s ease, color 0.3s ease",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
      <style>{`
        @keyframes glossyPageEnter {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
            filter: blur(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        @keyframes glossyFloat {
          0%, 100% {
            transform: translateY(-50%) translateY(0px);
          }
          50% {
            transform: translateY(-50%) translateY(-6px);
          }
        }
        .glossy-page-container {
          animation: glossyPageEnter 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity, filter;
        }
        .glossy-nav-item {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .glossy-nav-item:hover {
          transform: translateY(-2px) scale(1.08);
        }
        .glossy-nav-item:active {
          transform: translateY(1px) scale(0.95);
        }
      `}</style>

      <aside style={{
        position: isMobile ? "sticky" : "fixed",
        top: isMobile ? 12 : "50%",
        left: isMobile ? 12 : 24,
        right: isMobile ? 12 : "auto",
        transform: isMobile ? "none" : "translateY(-50%)",
        animation: isMobile ? "none" : "glossyFloat 6s ease-in-out infinite",
        background: T.isDark 
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(10, 10, 12, 0.92) 40%, rgba(0, 0, 0, 0.95) 100%)" 
          : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 243, 247, 0.85) 100%)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: `1px solid ${T.cardBorder}`,
        borderRadius: 32,
        boxShadow: T.cardShadow,
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        alignItems: "center",
        justifyContent: isMobile ? "space-around" : "center",
        padding: isMobile ? "12px 18px" : "24px 14px",
        gap: isMobile ? 14 : 24,
        zIndex: 90,
      }}>
        <div style={{ 
          fontFamily: fontMono, 
          fontSize: 14, 
          fontWeight: 900, 
          color: T.isDark ? "#38BDF8" : T.textMain, 
          letterSpacing: "0.08em",
          textShadow: T.isDark ? "0 0 12px rgba(56, 189, 248, 0.6)" : "none" 
        }}>
          TJV1
        </div>

        <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: 14 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                title={item.label}
                className="glossy-nav-item"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 18,
                  border: isActive 
                    ? (T.isDark ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid rgba(255, 255, 255, 0.8)")
                    : "1px solid transparent",
                  background: isActive 
                    ? (T.isDark 
                        ? "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)" 
                        : "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)")
                    : "transparent",
                  color: isActive ? "#FFFFFF" : T.textSub,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: isActive 
                    ? (T.isDark 
                        ? "0 0 24px rgba(56, 189, 248, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.6)" 
                        : "0 8px 22px rgba(15, 23, 42, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)")
                    : "none",
                  outline: "none"
                }}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </div>
      </aside>

      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 96,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
        zIndex: 10
      }}>
        <header style={{
          height: 76,
          padding: isMobile ? "0 16px" : "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          borderBottom: `1px solid ${T.cardBorder}`,
          background: T.isDark ? "rgba(0, 0, 0, 0.82)" : "rgba(241, 243, 247, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 22,
              fontSize: 11,
              fontWeight: 600,
              background: syncStatus === "synced" 
                ? (T.isDark ? "rgba(16, 185, 129, 0.15)" : C.greenLight)
                : syncStatus === "saving" 
                ? (T.isDark ? "rgba(139, 92, 246, 0.15)" : C.purpleLight)
                : (T.isDark ? "rgba(245, 158, 11, 0.15)" : C.amberLight),
              color: syncStatus === "synced" ? C.green : syncStatus === "saving" ? C.purple : C.amber,
              border: `1px solid ${syncStatus === "synced" ? C.green : syncStatus === "saving" ? C.purple : C.amber}`
            }}>
              {syncStatus === "synced" && <CloudCheck size={14} />}
              {syncStatus === "saving" && <Loader2 size={14} className="animate-spin" />}
              {syncStatus === "offline" && <WifiOff size={14} />}
              <span>{syncStatus === "synced" ? "Cloud Synced" : syncStatus === "saving" ? "Saving..." : "Offline Mode"}</span>
            </div>

            <select
              value={activeScope.mode === "ALL" ? "ALL" : activeScope.selectedIds[0]}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "ALL") setActiveScope({ mode: "ALL", selectedIds: accounts.map(a => a.id) });
                else setActiveScope({ mode: "SINGLE", selectedIds: [val] });
              }}
              style={{
                background: T.inputBg,
                border: `1px solid ${T.inputBorder}`,
                borderRadius: 22,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                color: T.textMain,
                outline: "none",
                cursor: "pointer",
                maxWidth: isMobile ? 160 : "none",
              }}
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </select>

            <button
              onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
              title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: T.inputBg,
                border: `1px solid ${T.inputBorder}`,
                borderRadius: 22,
                padding: "8px 16px",
                fontSize: 12,
                fontWeight: 600,
                color: T.textMain,
                cursor: "pointer",
                transition: "all 0.15s ease",
                outline: "none"
              }}
            >
              {theme === "light" ? (
                <>
                  <Moon size={14} color={T.textSub} />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun size={14} color="#F59E0B" />
                  <span>Light</span>
                </>
              )}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.inputBg, border: `1px solid ${T.inputBorder}`, borderRadius: 22, padding: "6px 14px 6px 8px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.purpleLight, border: `1px solid rgba(139, 92, 246, 0.3)`, display: "flex", alignItems: "center", justifyContent: "center", color: C.purple, fontWeight: 700, fontSize: 12 }}>
                {traderName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.textMain }}>{traderName}</span>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              style={{ background: "transparent", border: `1px solid ${T.cardBorder}`, borderRadius: 22, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: T.textSub, cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: isMobile ? "16px 16px 24px" : "32px 40px 40px" }}>
          <div key={page} className="glossy-page-container">
            {page === "overview" && (
              <DashboardOverview
                derivedTrades={derivedTrades}
                startingEquity={startingEquity}
                totalPnl={totalPnl}
                accounts={accounts}
                activeScope={activeScope}
                onScopeChange={setActiveScope}
                theme={theme}
              />
            )}

            {page === "trades" && (
              <div style={{ ...cardStyle, padding: isMobile ? 18 : 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: T.textMain, margin: 0 }}>Trade Journal Log</h2>
                  <Button variant="primary" theme={theme} onClick={() => { setEditingTrade(null); setModalOpen(true); }}>Log Trade</Button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${T.cardBorder}`, textAlign: "left", color: T.textMuted }}>
                        <th style={{ padding: "12px 10px" }}>Date</th>
                        <th style={{ padding: "12px 10px" }}>Symbol</th>
                        <th style={{ padding: "12px 10px" }}>Strategy</th>
                        <th style={{ padding: "12px 10px" }}>Direction</th>
                        <th style={{ padding: "12px 10px", textAlign: "right" }}>Net P&L</th>
                        <th style={{ padding: "12px 10px" }}>Outcome</th>
                        <th style={{ padding: "12px 10px", textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {derivedTrades.map((t) => (
                        <tr key={t.id} style={{ borderBottom: `1px solid ${T.tableBorder}` }}>
                          <td style={{ padding: "14px 10px", fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: T.textSub }}>{t.dateOpen}</td>
                          <td style={{ padding: "14px 10px", fontWeight: 700, color: T.textMain }}>{t.pair}</td>
                          <td style={{ padding: "14px 10px", color: T.textSub }}>{t.strategy}</td>
                          <td style={{ padding: "14px 10px", color: T.textMain }}>{t.direction}</td>
                          <td style={{ padding: "14px 10px", textAlign: "right", fontWeight: 700, fontFamily: fontMono, fontVariantNumeric: "tabular-nums", color: t.pnlNum >= 0 ? C.green : C.red }}>
                            {t.pnlNum !== null ? fmtMoney(t.pnlNum) : "—"}
                          </td>
                          <td style={{ padding: "14px 10px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 8, background: t.status === "Win" ? C.greenLight : C.redLight, color: t.status === "Win" ? C.green : C.red }}>
                              {t.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 10px", textAlign: "right" }}>
                            <button
                              onClick={() => { setEditingTrade(t); setModalOpen(true); }}
                              style={{ background: "transparent", border: "none", color: T.textSub, cursor: "pointer", marginRight: 10, padding: 4 }}
                              title="Edit Trade"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteTrade(t.id)}
                              style={{ background: "transparent", border: "none", color: C.red, cursor: "pointer", padding: 4 }}
                              title="Delete Trade"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {page === "transactions" && (
              <CapitalLedgerView
                transactions={transactions}
                accounts={accounts}
                activeScope={activeScope}
                onAddAccount={handleAddAccount}
                onEditAccount={handleEditAccount}
                onDeleteAccount={handleDeleteAccount}
                onAddTransaction={handleAddTransaction}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                theme={theme}
              />
            )}

            {page === "charts" && (
              <PerformanceAnalyticsView
                derivedTrades={derivedTrades}
                lists={lists}
                theme={theme}
              />
            )}

            {page === "settings" && (
              <JournalSettingsView
                lists={lists}
                onUpdateLists={handleUpdateLists}
                theme={theme}
              />
            )}
          </div>
        </main>
      </div>

      {modalOpen && (
        <Modal title={editingTrade ? "Edit Trade Record" : "Log New Trade"} onClose={() => { setModalOpen(false); setEditingTrade(null); }} wide theme={theme}>
          <TradeModalForm
            initial={editingTrade}
            accounts={accounts}
            lists={lists}
            defaultAccountId={activeScope.selectedIds[0] / accounts[0]?.id}
            onSave={(trade) => {
              handleSaveTrade(trade);
              setModalOpen(false);
              setEditingTrade(null);
            }}
            onCancel={() => { setModalOpen(false); setEditingTrade(null); }}
            theme={theme}
          />
        </Modal>
      )}
    </div>
  );
}