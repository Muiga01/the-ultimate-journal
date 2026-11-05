export interface Trade {
  id: string;
  accountId: string;
  dateOpen: string;
  dateClose: string;
  strategy: string;
  pair: string;
  direction: "Long" | "Short";
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  exitPrice: string;
  confluences: string[];
  pnl: string;
  comments: string;
  lesson: string;
  // Derived fields
  day?: string;
  rr?: number | null;
  pnlNum?: number | null;
  pnlPercent?: number | null;
  balanceBefore?: number;
  balanceAfter?: number;
  status?: "Win" | "Loss" | "Breakeven" | "Open";
}

export interface Account {
  id: string;
  name: string;
  broker: string;
  currency: string;
  initialBalance: string;
  color: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: string;
}

export interface JournalLists {
  pairs: string[];
  strategies: string[];
  signals: string[];
}

export interface ActiveScope {
  mode: "ALL" | "SINGLE";
  selectedIds: string[];
}

export interface ThemeTokens {
  isDark: boolean;
  bg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  textMain: string;
  textSub: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  tableBorder: string;
  chartGrid: string;
  modalOverlay: string;
  darkBtn: string;
  darkBtnText: string;
}

export type PageKey = "overview" | "trades" | "transactions" | "charts" | "settings";
