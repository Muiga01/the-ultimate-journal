export const C = {
  purple: "#8B5CF6",
  purpleLight: "rgba(139, 92, 246, 0.15)",
  green: "#10B981",
  greenLight: "rgba(16, 185, 129, 0.15)",
  red: "#EF4444",
  redLight: "rgba(239, 68, 68, 0.15)",
  amber: "#F59E0B",
  amberLight: "rgba(245, 158, 11, 0.15)",
};

export const fontBody =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Roboto, Helvetica, Arial, sans-serif";
export const fontMono =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Rounded', 'SF Pro Display', 'SF Mono', SFMono-Regular, Consolas, monospace";

export const DEFAULT_LISTS = {
  pairs: ["NASDAQ100", "S&P500", "XAU/USD", "EUR/USD", "BTC/USD", "AAPL", "MSFT", "TSLA", "NVDA"],
  strategies: ["ICT Silver Bullet", "AMD Accumulation", "CRT Model", "Breaker Block Retest", "Order Block Liquidity"],
  signals: ["SMT Divergence", "FVG Tap", "Order Block", "Breaker Block", "Liquidity Sweep"],
};

export const INITIAL_ACCOUNTS = [
  { id: "acc_1", name: "Main Trading Account", broker: "Apex Trader", currency: "USD", initialBalance: "50000", color: "#8B5CF6" },
  { id: "acc_2", name: "Prop Fund Evaluation", broker: "Tradovate", currency: "USD", initialBalance: "25000", color: "#10B981" },
  { id: "acc_3", name: "Personal Futures", broker: "Interactive Brokers", currency: "USD", initialBalance: "10000", color: "#F59E0B" },
];

export const INITIAL_TRADES = [
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

export const INITIAL_TRANSACTIONS = [
  { id: "tx_1", accountId: "acc_1", date: "2026-06-01", description: "Initial Deposit", amount: "50000" },
  { id: "tx_2", accountId: "acc_2", date: "2026-06-01", description: "Prop Eval Funding", amount: "25000" },
  { id: "tx_3", accountId: "acc_3", date: "2026-06-01", description: "Personal Capital Seed", amount: "10000" },
];

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

import React from "react";
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const fmtMoney = (n: number | null | undefined): string => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export function useDerivedTrades(trades: any[], startingEquity: number) {
  return React.useMemo(() => {
    const sorted = [...trades].sort((a: any, b: any) => (a.dateOpen || "").localeCompare(b.dateOpen || "") || a.id.localeCompare(b.id));
    let balance = startingEquity;
    const map: Record<string, any> = {};
    for (const t of sorted) {
      const balanceBefore = balance;
      const closed = t.pnl !== null && t.pnl !== undefined && t.pnl !== "";
      const pnlNum = closed ? parseFloat(t.pnl) : null;
      const pnlPercent = closed && balanceBefore !== 0 ? (pnlNum! / balanceBefore) * 100 : null;
      if (closed) balance += pnlNum!;
      map[t.id] = {
        ...t,
        day: t.dateOpen ? WEEKDAYS[new Date(t.dateOpen + "T00:00:00").getDay()] : "",
        rr: computeRR(t),
        pnlNum,
        pnlPercent,
        balanceBefore,
        balanceAfter: closed ? balance : balanceBefore,
        status: closed ? (pnlNum! > 0 ? "Win" : pnlNum! < 0 ? "Loss" : "Breakeven") : "Open",
      };
    }
    return trades.map((t: any) => map[t.id] || t).sort((a: any, b: any) => (b.dateOpen || "").localeCompare(a.dateOpen || "") || b.id.localeCompare(a.id));
  }, [trades, startingEquity]);
}

export function computeRR(trade: { direction: string; entryPrice: string; stopLoss: string; takeProfit: string }): number | null {
  const { direction, entryPrice, stopLoss, takeProfit } = trade;
  const e = parseFloat(entryPrice), s = parseFloat(stopLoss), t = parseFloat(takeProfit);
  if ([e, s, t].some((v) => Number.isNaN(v))) return null;
  let risk, reward;
  if (direction === "Short") { risk = s - e; reward = e - t; }
  else { risk = e - s; reward = t - e; }
  if (risk <= 0) return null;
  return reward / risk;
}
