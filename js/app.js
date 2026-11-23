/* ==========================================================================
   THE ULTIMATE JOURNAL - Vanilla JS Application (Improved)
   ========================================================================== */

const C = {
  purple: "#8B5CF6",
  green: "#10B981",
  red: "#EF4444",
  amber: "#F59E0B",
};

const fontBody = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', Roboto, Helvetica, Arial, sans-serif";
const fontMono = "-apple-system, BlinkMacSystemFont, 'SF Mono', 'SF Pro Rounded', 'SF Pro Display', SFMono-Regular, Consolas, monospace";

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

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function fmtMoney(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
}

/* ==========================================================================
   STORAGE
   ========================================================================== */

const STORAGE_KEYS = {
  accounts: "journal_accounts_local",
  trades: "journal_trades_local",
  transactions: "journal_transactions_local",
  lists: "journal_lists_local",
  theme: "theme-v1",
  name: "journal_name",
  analyticsFilter: "journal_analytics_filter",
};

function loadLocal(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch { return fallback; }
}

function saveLocal(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

class Store {
  constructor() {
    this.accounts = loadLocal(STORAGE_KEYS.accounts, INITIAL_ACCOUNTS);
    this.trades = loadLocal(STORAGE_KEYS.trades, INITIAL_TRADES);
    this.transactions = loadLocal(STORAGE_KEYS.transactions, INITIAL_TRANSACTIONS);
    this.lists = loadLocal(STORAGE_KEYS.lists, DEFAULT_LISTS);
  }

  save(key, id, data) {
    const col = this[key];
    const exists = col.findIndex((item) => item.id === id);
    let updated;
    if (exists >= 0) {
      updated = col.map((item) => item.id === id ? { ...item, ...data } : item);
    } else {
      updated = [...col, { ...data, id }];
    }
    this[key] = updated;
    saveLocal(STORAGE_KEYS[key], updated);
    return updated;
  }

  delete(key, id) {
    const updated = this[key].filter((item) => item.id !== id);
    this[key] = updated;
    saveLocal(STORAGE_KEYS[key], updated);
    return updated;
  }

  saveLists(data) {
    this.lists = { ...this.lists, ...data };
    saveLocal(STORAGE_KEYS.lists, this.lists);
    return this.lists;
  }

  exportAll() {
    return {
      accounts: this.accounts,
      trades: this.trades,
      transactions: this.transactions,
      lists: this.lists,
      exportedAt: new Date().toISOString(),
    };
  }

  importAll(data) {
    if (data.accounts) this.accounts = data.accounts;
    if (data.trades) this.trades = data.trades;
    if (data.transactions) this.transactions = data.transactions;
    if (data.lists) this.lists = data.lists;
    saveLocal(STORAGE_KEYS.accounts, this.accounts);
    saveLocal(STORAGE_KEYS.trades, this.trades);
    saveLocal(STORAGE_KEYS.transactions, this.transactions);
    saveLocal(STORAGE_KEYS.lists, this.lists);
  }

  clearAll() {
    this.accounts = [...INITIAL_ACCOUNTS];
    this.trades = [...INITIAL_TRADES];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.lists = { ...DEFAULT_LISTS };
    saveLocal(STORAGE_KEYS.accounts, this.accounts);
    saveLocal(STORAGE_KEYS.trades, this.trades);
    saveLocal(STORAGE_KEYS.transactions, this.transactions);
    saveLocal(STORAGE_KEYS.lists, this.lists);
  }
}

/* ==========================================================================
   THEME
   ========================================================================== */

const Theme = {
  storageKey: STORAGE_KEYS.theme,
  current: "system",

  init() {
    const root = document.documentElement;
    const stored = localStorage.getItem(this.storageKey);
    if (stored === "light" || stored === "dark" || stored === "system") {
      this.current = stored;
    }
    this.apply();
  },

  set(next) {
    this.current = next;
    localStorage.setItem(this.storageKey, next);
    this.apply();
  },

  toggle() {
    const resolved = this.getResolved();
    this.set(resolved === "dark" ? "light" : "dark");
  },

  getResolved() {
    if (this.current === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return this.current;
  },

  apply() {
    const root = document.documentElement;
    const resolved = this.getResolved();
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  },
};

/* ==========================================================================
   STATE
   ========================================================================== */

const state = {
  store: new Store(),
  user: { name: "Trader", email: null },
  page: "overview",
  activeScope: { mode: "ALL", selectedIds: [] },
  charts: {},
  editingTrade: null,
  editingAccount: null,
  editingTransaction: null,
  openTradeModal: false,
  openAccountModal: false,
  openTransactionModal: false,
  syncStatus: "synced",
  analyticsFilter: loadLocal(STORAGE_KEYS.analyticsFilter, "ALL"),
};

/* ==========================================================================
   DOM REFS
   ========================================================================== */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const els = {
  sidebar: $("#sidebar"),
  pageOverlay: $("#page-overlay"),
  navBtns: $$("[data-nav]"),
  themeToggleBtn: $("#theme-toggle"),
  logoutBtn: $("#logout-btn"),
  headerName: $("#header-name"),
  headerEmail: $("#header-email"),
  syncBadge: $("#sync-badge"),
  accountSelect: $("#account-filter"),
  pageSections: $$("[data-page]"),
  // Containers
  accountsGrid: $("#accounts-grid"),
  transactionsTable: $("#transactions-body"),
  tradesTable: $("#trades-body"),
  listsContainer: $("#lists-container"),
  resetBtn: $("#reset-defaults-btn"),
  // Stats
  totalPnlEl: $("#total-pnl"),
  winRateEl: $("#win-rate"),
  profitFactorEl: $("#profit-factor"),
  expectancyEl: $("#expectancy"),
  avgRR: $("#avg-rr"),
  maxDD: $("#max-dd"),
  maxDDPct: $("#max-dd-pct"),
  equityChart: $("#equity-chart"),
  dailyChart: $("#daily-chart"),
  weekdayChart: $("#weekday-chart"),
  cumulativeChart: $("#cumulative-chart"),
  instrumentTable: $("#instrument-body"),
  strategyTable: $("#strategy-body"),
  heatmapDays: $("#heatmap-days"),
  heatmapMonth: $("#heatmap-month"),
  heatmapPrev: $("#heatmap-prev"),
  heatmapNext: $("#heatmap-next"),
  // Modals
  tradeModal: $("#trade-modal"),
  accountModal: $("#account-modal"),
  transactionModal: $("#transaction-modal"),
  settingsModal: $("#settings-modal"),
  closeTradeModal: $("#close-trade-modal"),
  closeAccountModal: $("#close-account-modal"),
  closeTransactionModal: $("#close-transaction-modal"),
  closeSettingsModal: $("#close-settings-modal"),
};

/* ==========================================================================
   INIT
   ========================================================================== */

function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.split("/").pop() || "dashboard.html";
  if (file === "dashboard.html" || file === "") return "overview";
  if (file === "trades.html") return "trades";
  if (file === "ledger.html") return "ledger";
  if (file === "analytics.html") return "analytics";
  if (file === "settings.html") return "settings";
  return "overview";
}

function init() {
  Theme.init();
  if (!document.getElementById("sidebar")) return;
  state.page = getCurrentPage();
  renderHeader();
  renderSidebar();
  renderPage();
  setupEventListeners();
  setupGlobalListeners();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

function setupEventListeners() {
  // Navigation - delegated via data-nav attribute
  els.navBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.getAttribute("data-nav");
      navigateTo(key);
    });
  });

  // Theme toggle
  els.themeToggleBtn.addEventListener("click", () => {
    Theme.toggle();
    updateThemeIcon();
  });

  // Logout
  els.logoutBtn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });

  // Account scope filter
  els.accountSelect.addEventListener("change", (e) => {
    const val = e.target.value;
    if (val === "ALL") {
      state.activeScope = { mode: "ALL", selectedIds: state.store.accounts.map((a) => a.id) };
    } else {
      state.activeScope = { mode: "SINGLE", selectedIds: [val] };
    }
    renderPage();
  });

  // Trade form submit
  document.getElementById("trade-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const confluences = JSON.parse(document.getElementById("trade-confluences-input").value || "[]");
    const trade = {
      id: formData.get("id") || `t_${Date.now()}`,
      accountId: formData.get("accountId"),
      dateOpen: formData.get("dateOpen"),
      dateClose: formData.get("dateClose"),
      strategy: formData.get("strategy"),
      pair: formData.get("pair"),
      direction: formData.get("direction"),
      entryPrice: formData.get("entryPrice"),
      stopLoss: formData.get("stopLoss"),
      takeProfit: formData.get("takeProfit"),
      exitPrice: formData.get("exitPrice"),
      confluences,
      pnl: formData.get("pnl"),
      comments: formData.get("comments"),
      lesson: formData.get("lesson"),
    };
    state.store.save("trades", trade.id, trade);
    closeModal(state.tradeModal);
    state.editingTrade = null;
    resetTradeForm();
    renderPage();
  });

  // Account form submit
  document.getElementById("account-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const account = {
      id: formData.get("id") || `acc_${Date.now()}`,
      name: formData.get("name"),
      broker: formData.get("broker"),
      currency: formData.get("currency") || "USD",
      initialBalance: formData.get("initialBalance"),
      color: formData.get("color") || "#8B5CF6",
    };
    state.store.save("accounts", account.id, account);
    if (!state.activeScope.selectedIds.includes(account.id)) {
      state.activeScope.selectedIds.push(account.id);
    }
    closeModal(state.accountModal);
    state.editingAccount = null;
    resetAccountForm();
    renderPage();
  });

  // Transaction form submit
  document.getElementById("transaction-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tx = {
      id: formData.get("id") || `tx_${Date.now()}`,
      accountId: formData.get("accountId"),
      date: formData.get("date"),
      description: formData.get("description"),
      amount: formData.get("amount"),
    };
    state.store.save("transactions", tx.id, tx);
    closeModal(state.transactionModal);
    state.editingTransaction = null;
    resetTransactionForm();
    renderPage();
  });

  // Settings add item
  document.getElementById("settings-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get("type");
    const val = document.getElementById("new-item").value.trim();
    if (!val || state.store.lists[type].includes(val)) return;
    state.store.saveLists({ [type]: [...state.store.lists[type], val] });
    document.getElementById("new-item").value = "";
    closeModal(state.settingsModal);
    renderPage();
  });

  // Reset defaults
  els.resetBtn?.addEventListener("click", () => {
    if (confirm("Reset all lists to defaults?")) {
      state.store.lists = { ...DEFAULT_LISTS };
      saveLocal(STORAGE_KEYS.lists, state.store.lists);
      renderPage();
    }
  });

  // Modal close buttons
  [els.closeTradeModal, els.closeAccountModal, els.closeTransactionModal, els.closeSettingsModal].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const modal = btn.closest(".modal-overlay");
      if (modal) closeModal(modal);
    });
  });

  // Click overlay to close
  [els.tradeModal, els.accountModal, els.transactionModal, els.settingsModal].forEach((modal) => {
    if (!modal) return;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Heatmap nav
  els.heatmapPrev?.addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() - 1, 1);
    renderPage();
  });
  els.heatmapNext?.addEventListener("click", () => {
    state.calendarDate = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth() + 1, 1);
    renderPage();
  });

  // Add buttons
  document.getElementById("btn-add-trade")?.addEventListener("click", () => {
    state.editingTrade = null;
    resetTradeForm();
    openModal(state.tradeModal, "Log New Trade");
  });

  document.getElementById("btn-add-account")?.addEventListener("click", () => {
    state.editingAccount = null;
    resetAccountForm();
    openModal(state.accountModal, "Add Account");
  });

  document.getElementById("btn-add-transaction")?.addEventListener("click", () => {
    state.editingTransaction = null;
    resetTransactionForm();
    openModal(state.transactionModal, "Log Transaction");
  });
}

function setupGlobalListeners() {
  // Escape closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $$(".modal-overlay:not(.hidden)").forEach((m) => closeModal(m));
    }
  });
}

/* ==========================================================================
   NAVIGATION
   ========================================================================== */

function navigateTo(key) {
  const map = { overview: "dashboard.html", trades: "trades.html", ledger: "ledger.html", analytics: "analytics.html", settings: "settings.html" };
  window.location.href = map[key];
}

window.navigateTo = navigateTo;

/* ==========================================================================
   RENDER
   ========================================================================== */

function renderPage() {
  const accounts = state.store.accounts;
  const trades = state.store.trades;
  const transactions = state.store.transactions;
  const lists = state.store.lists;

  renderAccountSelect();

  const filteredTrades = state.activeScope.mode === "ALL"
    ? trades
    : trades.filter((t) => state.activeScope.selectedIds.includes(t.accountId));

  const startingEquity = (state.activeScope.mode === "ALL" ? transactions : transactions.filter((t) => state.activeScope.selectedIds.includes(t.accountId)))
    .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const derivedTrades = useDerivedTrades(filteredTrades, startingEquity);
  const totalPnl = derivedTrades.filter((t) => t.status !== "Open")
    .reduce((s, t) => s + (t.pnlNum || 0), 0);

  switch (state.page) {
    case "overview":
      renderOverview(derivedTrades, startingEquity, totalPnl, accounts);
      break;
    case "trades":
      renderTradeLog(derivedTrades, accounts, lists);
      break;
    case "ledger":
      renderCapitalLedger(transactions, accounts);
      break;
    case "analytics":
      renderAnalytics(derivedTrades, lists);
      break;
    case "settings":
      renderSettings(lists);
      break;
  }

  requestAnimationFrame(() => {
    if (state.page === "overview") renderOverviewCharts(derivedTrades, startingEquity, totalPnl);
    if (state.page === "analytics") renderAnalyticsCharts(derivedTrades);
  });
}

function renderHeader() {
  const savedName = sessionStorage.getItem(STORAGE_KEYS.name);
  if (savedName) state.user.name = savedName;
  els.headerName.textContent = state.user.name;
  els.headerEmail.textContent = state.user.email || "Signed in";
}

function renderSidebar() {
  els.navBtns.forEach((btn) => {
    const key = btn.getAttribute("data-nav");
    const active = key === state.page;
    btn.classList.toggle("bg-primary", active);
    btn.classList.toggle("text-primary-foreground", active);
    btn.classList.toggle("shadow-lg", active);
    btn.classList.toggle("hover:bg-muted", !active);
    btn.classList.toggle("text-muted-foreground", !active);
    btn.classList.toggle("hover:text-foreground", !active);
  });
}

function renderAccountSelect() {
  const select = els.accountSelect;
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = '<option value="ALL">All Accounts</option>';
  state.store.accounts.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.name;
    select.appendChild(opt);
  });
  if (state.activeScope.mode === "ALL") {
    select.value = "ALL";
  } else {
    select.value = state.activeScope.selectedIds[0] || "ALL";
  }
}

/* ==========================================================================
   OVERVIEW
   ========================================================================== */

function renderOverview(derivedTrades, startingEquity, totalPnl, accounts) {
  const closed = derivedTrades.filter((t) => t.status !== "Open");
  const winners = closed.filter((t) => (t.pnlNum || 0) > 0);
  const losers = closed.filter((t) => (t.pnlNum || 0) < 0);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  let grossProfit = 0, grossLoss = 0;
  closed.forEach((t) => {
    if ((t.pnlNum || 0) > 0) grossProfit += t.pnlNum;
    else if ((t.pnlNum || 0) < 0) grossLoss += Math.abs(t.pnlNum);
  });
  const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? "∞" : 0) : grossProfit / grossLoss;
  const expectancy = closed.length ? totalPnl / closed.length : 0;

  const validRR = closed.filter((t) => t.rr !== null && !Number.isNaN(t.rr));
  const avgRR = validRR.length ? validRR.reduce((s, t) => s + (t.rr || 0), 0) / validRR.length : null;

  let peak = startingEquity, maxDD = 0, running = startingEquity;
  const chrono = [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || ""));
  chrono.forEach((t) => {
    running += (t.pnlNum || 0);
    if (running > peak) peak = running;
    const dd = peak - running;
    if (dd > maxDD) maxDD = dd;
  });

  els.totalPnlEl.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.875rem;font-weight:bold;">${fmtMoney(totalPnl)}</span>`;
  els.totalPnlEl.style.color = totalPnl >= 0 ? C.green : C.red;
  document.getElementById("pnl-icon").textContent = totalPnl >= 0 ? "▲" : "▼";
  document.getElementById("pnl-icon").style.color = totalPnl >= 0 ? C.green : C.red;

  els.winRateEl.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:3rem;font-weight:bold;">${winRate.toFixed(1)}%</span>`;
  els.profitFactorEl.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:3rem;font-weight:bold;">${profitFactor === "∞" ? "∞" : profitFactor.toFixed(2)}</span>`;
  els.expectancyEl.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.125rem;font-weight:bold;">${fmtMoney(expectancy)}</span>`;
  els.avgRR.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.125rem;font-weight:bold;">${avgRR !== null ? avgRR.toFixed(2) + " R" : "—"}</span>`;
  els.maxDD.innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.125rem;font-weight:bold;color:${C.red}">-${fmtMoney(maxDD)}</span>`;
  els.maxDDPct.innerHTML = `<span style="color:${C.red}">-${((maxDD / peak) * 100).toFixed(1)}%</span>`;

  const circle = document.getElementById("win-circle");
  if (circle) {
    const circumference = 226;
    circle.style.strokeDashoffset = circumference - (winRate / 100) * circumference;
  }

  document.getElementById("pnl-vs-capital").textContent = startingEquity > 0 ? ((totalPnl / startingEquity) * 100).toFixed(2) + "% vs capital" : "—";
  document.getElementById("winners-losers").textContent = `${winners.length}W / ${losers.length}L`;

  const equityData = [{ date: "Start", balance: startingEquity }];
  running = startingEquity;
  chrono.forEach((t) => {
    running += (t.pnlNum || 0);
    equityData.push({ date: t.dateOpen || "N/A", balance: running });
  });

  const dailyMap = {};
  closed.forEach((t) => {
    const d = t.dateOpen || "Unknown";
    dailyMap[d] = (dailyMap[d] || 0) + (t.pnlNum || 0);
  });
  const dailyData = Object.entries(dailyMap).map(([date, pnl]) => ({ date, pnl }));

  const pairMap = {};
  closed.forEach((t) => {
    if (!t.pair) return;
    if (!pairMap[t.pair]) pairMap[t.pair] = { pair: t.pair, trades: 0, pnl: 0 };
    pairMap[t.pair].trades += 1;
    pairMap[t.pair].pnl += (t.pnlNum || 0);
  });
  const byPair = Object.values(pairMap).sort((a, b) => b.pnl - a.pnl);

  const tbody = document.getElementById("instrument-body");
  if (tbody) {
    tbody.innerHTML = "";
    byPair.forEach((p) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-b-border/50";
      tr.innerHTML = `
        <td class="py-2 font-medium">${escapeHtml(p.pair)}</td>
        <td class="py-2 text-center font-mono">${p.trades}</td>
        <td class="py-2 text-right font-bold font-mono tabular-nums" style="color:${p.pnl >= 0 ? C.green : C.red}">
          ${fmtMoney(p.pnl)}
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const scopeSelect = document.getElementById("overview-scope-select");
  if (scopeSelect) {
    scopeSelect.innerHTML = '<option value="ALL">All Accounts</option>';
    accounts.forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a.id;
      opt.textContent = a.name;
      scopeSelect.appendChild(opt);
    });
    scopeSelect.value = state.activeScope.mode === "ALL" ? "ALL" : state.activeScope.selectedIds[0];
    scopeSelect.onchange = (e) => {
      const val = e.target.value;
      if (val === "ALL") {
        state.activeScope = { mode: "ALL", selectedIds: accounts.map((a) => a.id) };
      } else {
        state.activeScope = { mode: "SINGLE", selectedIds: [val] };
      }
      renderPage();
    };
  }

  state.chartData = { equityData, dailyData, totalPnl };
}

function renderOverviewCharts(derivedTrades, totalPnl) {
  const { equityData, dailyData } = state.chartData || {};

  const eqCanvas = document.getElementById("equity-chart-canvas");
  if (eqCanvas && window.Chart) {
    if (state.charts.equity) state.charts.equity.destroy();
    const color = totalPnl >= 0 ? C.green : C.red;
    state.charts.equity = new Chart(eqCanvas.getContext("2d"), {
      type: "line",
      data: {
        labels: equityData.map((d) => d.date),
        datasets: [{
          label: "Balance",
          data: equityData.map((d) => d.balance),
          borderColor: color,
          borderWidth: 3,
          backgroundColor: color + "40",
          fill: true,
          tension: 0.4,
          pointRadius: 0,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: "index", intersect: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "var(--muted-foreground)", font: { size: 11 } } },
          y: { grid: { borderColor: "var(--border)" }, ticks: { color: "var(--muted-foreground)", font: { size: 11 }, callback: (v) => "$" + v } },
        },
      },
    });
  }

  const dailyCanvas = document.getElementById("daily-chart-canvas");
  if (dailyCanvas && window.Chart) {
    if (state.charts.daily) state.charts.daily.destroy();
    state.charts.daily = new Chart(dailyCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: dailyData.map((d) => d.date),
        datasets: [{
          label: "P&L",
          data: dailyData.map((d) => d.pnl),
          backgroundColor: dailyData.map((d) => (d.pnl >= 0 ? C.green : C.red)),
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "var(--muted-foreground)", font: { size: 10 } } },
          y: { grid: { borderColor: "var(--border)" }, ticks: { color: "var(--muted-foreground)", font: { size: 10 }, callback: (v) => "$" + v } },
        },
      },
    });
  }
}

/* ==========================================================================
   TRADE LOG
   ========================================================================== */

function renderTradeLog(trades, accounts, lists) {
  const header = document.getElementById("trade-log-header");
  if (!header) return;
  header.innerHTML = `
    <div class="flex items-center gap-2">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
      <h2 class="font-semibold">Trade Journal Log</h2>
    </div>
    <div class="flex items-center gap-2">
      <select id="trade-account-filter" class="input w-auto">
        <option value="ALL">All Accounts</option>
        ${accounts.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join("")}
      </select>
      <button id="btn-add-trade" class="btn btn-default">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        Log Trade
      </button>
    </div>
  `;

  const filterSelect = document.getElementById("trade-account-filter");
  if (filterSelect) {
    filterSelect.value = state.activeScope.mode === "ALL" ? "ALL" : state.activeScope.selectedIds[0];
    filterSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "ALL") state.activeScope = { mode: "ALL", selectedIds: accounts.map((a) => a.id) };
      else state.activeScope = { mode: "SINGLE", selectedIds: [val] };
      renderPage();
    });
  }

  const tableBody = document.getElementById("trades-body");
  const filtered = state.activeScope.mode === "ALL" ? trades : trades.filter((t) => state.activeScope.selectedIds.includes(t.accountId));
  tableBody.innerHTML = "";

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="h-24 text-center text-muted-foreground">No trades found.</td></tr>`;
    return;
  }

  filtered.forEach((t) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-b-border/50";
    const pnlColor = (t.pnlNum || 0) >= 0 ? C.green : C.red;
    tr.innerHTML = `
      <td class="py-3 font-mono text-xs text-muted-foreground">${escapeHtml(t.dateOpen)}</td>
      <td class="py-3 font-medium">${escapeHtml(t.pair)}</td>
      <td class="py-3 text-xs text-muted-foreground">${escapeHtml(t.strategy)}</td>
      <td class="py-3">${t.direction}</td>
      <td class="py-3 text-right font-bold font-mono tabular-nums" style="color:${pnlColor}">
        ${t.pnlNum !== null ? fmtMoney(t.pnlNum) : "—"}
      </td>
      <td class="py-3 text-center">
        <span class="badge ${t.status === "Win" ? "badge-win" : "badge-loss"}">${t.status}</span>
      </td>
      <td class="py-3 text-right">
        <button class="btn-icon-sm btn-outline" title="Edit" onclick="app.editTrade('${escapeJs(t.id)}')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11-4-5 2zm0 0l5 5M7.188 2.239l.777.284M7.188 2.239l.777-.284M7.188 2.239l-.777.284M7.188 2.239l-.777-.284M12.812 21.239l-.777.284M12.812 21.239l.777.284M12.812 21.239l-.777-.284M12.812 21.239l.777-.284" /></svg>
        </button>
        <button class="btn-icon-sm btn-outline btn-destructive" title="Delete" onclick="app.deleteTrade('${escapeJs(t.id)}')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  populateTradeForm(accounts, lists);
}

function populateTradeForm(accounts, lists) {
  const accountSelect = document.getElementById("trade-account-id");
  if (accountSelect) {
    accountSelect.innerHTML = accounts.map((a) => `<option value="${a.id}">${escapeHtml(a.name)}</option>`).join("");
  }
  const strategySelect = document.getElementById("trade-strategy");
  if (strategySelect) {
    strategySelect.innerHTML = '<option value="">Select Strategy...</option>' + lists.strategies.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
  }
  const pairSelect = document.getElementById("trade-pair");
  if (pairSelect) {
    pairSelect.innerHTML = '<option value="">Select Pair...</option>' + lists.pairs.map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
  }
  const signalsContainer = document.getElementById("trade-confluences");
  if (signalsContainer) {
    signalsContainer.innerHTML = lists.signals.map((sig) => `
      <button type="button" class="tag-toggle" data-sig="${escapeHtml(sig)}" onclick="app.toggleConfluence(this, '${escapeJs(sig)}')">${escapeHtml(sig)}</button>
    `).join("");
  }
}

function resetTradeForm() {
  const form = document.getElementById("trade-form");
  if (!form) return;
  form.reset();
  const accounts = state.store.accounts;
  const lists = state.store.lists;
  document.getElementById("trade-account-id").value = accounts[0]?.id || "";
  document.getElementById("trade-date-open").value = new Date().toISOString().split("T")[0];
  document.getElementById("trade-date-close").value = new Date().toISOString().split("T")[0];
  document.getElementById("trade-direction").value = "Long";
  document.getElementById("trade-strategy").value = lists.strategies[0] || "";
  document.getElementById("trade-pair").value = lists.pairs[0] || "";
  document.getElementById("trade-id").value = "";
  document.getElementById("trade-confluences-input").value = "[]";
  const container = document.getElementById("trade-confluences");
  if (container) {
    container.querySelectorAll(".tag-toggle").forEach((btn) => btn.classList.remove("active"));
  }
  document.getElementById("trade-pnl").value = "";
  document.getElementById("trade-comments").value = "";
  document.getElementById("trade-lesson").value = "";
  document.getElementById("trade-entry").value = "";
  document.getElementById("trade-stop").value = "";
  document.getElementById("trade-target").value = "";
  document.getElementById("trade-exit").value = "";
}

window.app = {
  editTrade(id) {
    const trade = state.store.trades.find((t) => t.id === id);
    if (!trade) return;
    state.editingTrade = trade;
    document.getElementById("trade-id").value = trade.id;
    document.getElementById("trade-account-id").value = trade.accountId;
    document.getElementById("trade-direction").value = trade.direction;
    document.getElementById("trade-strategy").value = trade.strategy;
    document.getElementById("trade-pair").value = trade.pair;
    document.getElementById("trade-date-open").value = trade.dateOpen;
    document.getElementById("trade-date-close").value = trade.dateClose || "";
    document.getElementById("trade-entry").value = trade.entryPrice;
    document.getElementById("trade-stop").value = trade.stopLoss;
    document.getElementById("trade-target").value = trade.takeProfit;
    document.getElementById("trade-exit").value = trade.exitPrice || "";
    document.getElementById("trade-pnl").value = trade.pnl;
    document.getElementById("trade-comments").value = trade.comments || "";
    document.getElementById("trade-lesson").value = trade.lesson || "";
    document.getElementById("trade-confluences-input").value = JSON.stringify(trade.confluences || []);
    const container = document.getElementById("trade-confluences");
    container.querySelectorAll(".tag-toggle").forEach((btn) => {
      btn.classList.toggle("active", (trade.confluences || []).includes(btn.getAttribute("data-sig")));
    });
    openModal(state.tradeModal, "Edit Trade Record");
  },

  deleteTrade(id) {
    if (!confirm("Delete this trade?")) return;
    state.store.delete("trades", id);
    renderPage();
  },

  toggleConfluence(btn, sig) {
    const input = document.getElementById("trade-confluences-input");
    let val = input.value ? JSON.parse(input.value) : [];
    if (val.includes(sig)) {
      val = val.filter((s) => s !== sig);
      btn.classList.remove("active");
    } else {
      val.push(sig);
      btn.classList.add("active");
    }
    input.value = JSON.stringify(val);
  },

  navigateTo(key) {
    navigateTo(key);
  },
};

/* ==========================================================================
   CAPITAL LEDGER
   ========================================================================== */

function renderCapitalLedger(transactions, accounts) {
  const filteredTx = state.activeScope.mode === "ALL"
    ? transactions
    : transactions.filter((t) => state.activeScope.selectedIds.includes(t.accountId));

  const totalDeposits = filteredTx.filter((t) => parseFloat(t.amount || 0) > 0).reduce((s, t) => s + parseFloat(t.amount), 0);
  const totalWithdrawals = filteredTx.filter((t) => parseFloat(t.amount || 0) < 0).reduce((s, t) => s + Math.abs(parseFloat(t.amount)), 0);
  const netCapital = totalDeposits - totalWithdrawals;

  document.getElementById("net-capital").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;">${fmtMoney(netCapital)}</span>`;
  document.getElementById("total-deposits").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;color:${C.green}">${fmtMoney(totalDeposits)}</span>`;
  document.getElementById("total-withdrawals").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;color:${C.red}">-${fmtMoney(totalWithdrawals)}</span>`;
  document.getElementById("active-accounts").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;">${accounts.length}</span>`;

  const accountsGrid = document.getElementById("accounts-grid");
  accountsGrid.innerHTML = "";
  accounts.forEach((acc) => {
    const div = document.createElement("div");
    div.className = "p-4 rounded-xl border border-card-border bg-card";
    div.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium" style="color:${acc.color}">${escapeHtml(acc.name)}</span>
        <span class="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground">${escapeHtml(acc.broker)}</span>
      </div>
      <div class="text-xl font-bold font-mono tabular-nums mb-3">
        $${parseFloat(acc.initialBalance || 0).toLocaleString()} <span class="text-sm text-muted-foreground">${escapeHtml(acc.currency)}</span>
      </div>
      <div class="flex gap-2">
        <button class="flex-1 btn btn-outline btn-sm" onclick="app.editAccount('${escapeJs(acc.id)}')">Edit</button>
        ${accounts.length > 1 ? `<button class="flex-1 btn btn-outline btn-sm btn-destructive" onclick="app.deleteAccount('${escapeJs(acc.id)}')">Delete</button>` : ""}
      </div>
    `;
    accountsGrid.appendChild(div);
  });

  const tbody = document.getElementById("transactions-body");
  tbody.innerHTML = "";
  filteredTx.forEach((tx) => {
    const acc = accounts.find((a) => a.id === tx.accountId);
    const amt = parseFloat(tx.amount || 0);
    const tr = document.createElement("tr");
    tr.className = "border-b border-b-border/50";
    tr.innerHTML = `
      <td class="py-3 font-mono text-xs text-muted-foreground">${escapeHtml(tx.date)}</td>
      <td class="py-3 font-medium">${acc ? escapeHtml(acc.name) : "N/A"}</td>
      <td class="py-3">${escapeHtml(tx.description)}</td>
      <td class="py-3 text-right font-bold font-mono tabular-nums" style="color:${amt >= 0 ? C.green : C.red}">
        ${fmtMoney(amt)}
      </td>
      <td class="py-3 text-right">
        <button class="btn-icon-sm btn-outline" onclick="app.editTransaction('${escapeJs(tx.id)}')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11-4-5 2zm0 0l5 5M7.188 2.239l.777.284M7.188 2.239l.777-.284M7.188 2.239l-.777.284M7.188 2.239l-.777-.284M12.812 21.239l-.777.284M12.812 21.239l.777.284M12.812 21.239l-.777-.284M12.812 21.239l.777-.284" /></svg>
        </button>
        <button class="btn-icon-sm btn-outline btn-destructive" onclick="app.deleteTransaction('${escapeJs(tx.id)}')">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function resetAccountForm() {
  const form = document.getElementById("account-form");
  if (!form) return;
  form.reset();
  document.getElementById("acc-id").value = "";
  document.getElementById("acc-name").value = "";
  document.getElementById("acc-broker").value = "";
  document.getElementById("acc-currency").value = "USD";
  document.getElementById("acc-balance").value = "50000";
  document.getElementById("acc-color").value = "#8B5CF6";
}

function resetTransactionForm() {
  const form = document.getElementById("transaction-form");
  if (!form) return;
  form.reset();
  document.getElementById("tx-id").value = "";
  document.getElementById("tx-account").value = state.store.accounts[0]?.id || "";
  document.getElementById("tx-date").value = new Date().toISOString().split("T")[0];
  document.getElementById("tx-description").value = "";
  document.getElementById("tx-amount").value = "";
}

window.app.editAccount = function (id) {
  const acc = state.store.accounts.find((a) => a.id === id);
  if (!acc) return;
  state.editingAccount = acc;
  document.getElementById("acc-id").value = acc.id;
  document.getElementById("acc-name").value = acc.name;
  document.getElementById("acc-broker").value = acc.broker;
  document.getElementById("acc-currency").value = acc.currency;
  document.getElementById("acc-balance").value = acc.initialBalance;
  document.getElementById("acc-color").value = acc.color;
  openModal(state.accountModal, "Edit Account");
};

window.app.deleteAccount = function (id) {
  const acc = state.store.accounts.find((a) => a.id === id);
  const hasTrades = state.store.trades.some((t) => t.accountId === id);
  const hasTxs = state.store.transactions.some((t) => t.accountId === id);
  if (hasTrades || hasTxs) {
    alert("Cannot delete account with existing trades or transactions. Remove them first.");
    return;
  }
  if (state.store.accounts.length <= 1) {
    alert("Cannot delete the last account.");
    return;
  }
  if (!confirm(`Delete account "${acc.name}"?`)) return;
  state.store.delete("accounts", id);
  state.activeScope.selectedIds = state.activeScope.selectedIds.filter((sid) => sid !== id);
  renderPage();
};

window.app.editTransaction = function (id) {
  const tx = state.store.transactions.find((t) => t.id === id);
  if (!tx) return;
  state.editingTransaction = tx;
  document.getElementById("tx-id").value = tx.id;
  document.getElementById("tx-account").value = tx.accountId;
  document.getElementById("tx-date").value = tx.date;
  document.getElementById("tx-description").value = tx.description;
  document.getElementById("tx-amount").value = tx.amount;
  openModal(state.transactionModal, "Edit Transaction");
};

window.app.deleteTransaction = function (id) {
  if (!confirm("Delete this transaction?")) return;
  state.store.delete("transactions", id);
  renderPage();
};

/* ==========================================================================
   ANALYTICS
   ========================================================================== */

function renderAnalytics(derivedTrades, lists) {
  const filterSelect = document.getElementById("analytics-strategy-filter");
  if (filterSelect) {
    filterSelect.innerHTML = '<option value="ALL">All Strategies</option>' + lists.strategies.map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
    filterSelect.value = state.analyticsFilter || "ALL";
    filterSelect.onchange = (e) => {
      state.analyticsFilter = e.target.value;
      saveLocal(STORAGE_KEYS.analyticsFilter, state.analyticsFilter);
      renderPage();
    };
  }

  const selectedStrategy = state.analyticsFilter || "ALL";
  const filtered = selectedStrategy === "ALL" ? derivedTrades : derivedTrades.filter((t) => t.strategy === selectedStrategy);
  const closed = filtered.filter((t) => t.status !== "Open");
  const totalPnl = closed.reduce((s, t) => s + (t.pnlNum || 0), 0);
  const winners = closed.filter((t) => (t.pnlNum || 0) > 0);
  const losers = closed.filter((t) => (t.pnlNum || 0) < 0);
  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  document.getElementById("analytics-pnl").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;color:${totalPnl >= 0 ? C.green : C.red}">${fmtMoney(totalPnl)}</span>`;
  document.getElementById("analytics-win-rate").innerHTML = `<span style="font-family:${fontMono};font-variant-numeric:tabular-nums;font-size:1.5rem;font-weight:bold;">${winRate.toFixed(1)}%</span>`;
  document.getElementById("analytics-filter-label").textContent = selectedStrategy === "ALL" ? "All playbooks" : selectedStrategy;
  document.getElementById("analytics-win-loss").textContent = `${winners.length}W / ${losers.length}L`;

  const byStrategy = {};
  for (const t of derivedTrades) {
    if (!t.strategy) continue;
    if (!byStrategy[t.strategy]) byStrategy[t.strategy] = { strategy: t.strategy, trades: 0, wins: 0, losses: 0, pnl: 0, winSum: 0, lossSum: 0 };
    if (t.status !== "Open") {
      byStrategy[t.strategy].trades += 1;
      byStrategy[t.strategy].pnl += (t.pnlNum || 0);
      if ((t.pnlNum || 0) > 0) { byStrategy[t.strategy].wins += 1; byStrategy[t.strategy].winSum += t.pnlNum; }
      else if ((t.pnlNum || 0) < 0) { byStrategy[t.strategy].losses += 1; byStrategy[t.strategy].lossSum += Math.abs(t.pnlNum); }
    }
  }
  const strategyRows = Object.values(byStrategy).map((s) => {
    const pf = s.lossSum > 0 ? s.winSum / s.lossSum : (s.winSum > 0 ? Infinity : 0);
    const winPct = s.trades > 0 ? (s.wins / s.trades) * 100 : 0;
    return { ...s, winPct, profitFactor: pf === Infinity ? "∞" : pf.toFixed(2) };
  }).sort((a, b) => b.pnl - a.pnl);

  const tbody = document.getElementById("strategy-body");
  tbody.innerHTML = "";
  strategyRows.forEach((s) => {
    const tr = document.createElement("tr");
    tr.className = "border-b border-b-border/50";
    tr.innerHTML = `
      <td class="py-3 font-medium">${escapeHtml(s.strategy)}</td>
      <td class="py-3 text-center font-mono">${s.trades} (${s.wins})</td>
      <td class="py-3 text-center font-mono">${s.winPct.toFixed(1)}%</td>
      <td class="py-3 text-center font-mono">${s.profitFactor}</td>
      <td class="py-3 text-right font-bold font-mono tabular-nums" style="color:${s.pnl >= 0 ? C.green : C.red}">${fmtMoney(s.pnl)}</td>
    `;
    tbody.appendChild(tr);
  });

  renderAnalyticsCharts(derivedTrades);
}

function renderAnalyticsCharts(derivedTrades) {
  const selectedStrategy = state.analyticsFilter || "ALL";
  const filtered = selectedStrategy === "ALL" ? derivedTrades : derivedTrades.filter((t) => t.strategy === selectedStrategy);
  const closed = filtered.filter((t) => t.status !== "Open");

  const weekdayMap = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 };
  closed.forEach((t) => { if (t.day && weekdayMap[t.day] !== undefined) weekdayMap[t.day] += (t.pnlNum || 0); });
  const weekdayData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => ({ day: d.slice(0, 3), pnl: weekdayMap[d] }));

  const weekdayCanvas = document.getElementById("weekday-chart-canvas");
  if (weekdayCanvas && window.Chart) {
    if (state.charts.weekday) state.charts.weekday.destroy();
    state.charts.weekday = new Chart(weekdayCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: weekdayData.map((d) => d.day),
        datasets: [{
          label: "P&L",
          data: weekdayData.map((d) => d.pnl),
          backgroundColor: weekdayData.map((d) => (d.pnl >= 0 ? C.green : C.red)),
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "var(--muted-foreground)", font: { size: 10 } } },
          y: { grid: { borderColor: "var(--border)" }, ticks: { color: "var(--muted-foreground)", font: { size: 10 }, callback: (v) => "$" + v } },
        },
      },
    });
  }

  const cumulative = [];
  let running = 0;
  [...closed].sort((a, b) => (a.dateOpen || "").localeCompare(b.dateOpen || "")).forEach((t, i) => {
    running += (t.pnlNum || 0);
    cumulative.push({ idx: i + 1, date: t.dateOpen || `Trade #${i + 1}`, pnl: running });
  });

  const cumCanvasParent = document.getElementById("cumulative-chart-canvas")?.parentElement;
  if (cumulative.length === 0) {
    if (cumCanvasParent) cumCanvasParent.innerHTML = `<div class="h-64 flex items-center justify-center text-muted-foreground text-sm">No closed trades found.</div>`;
  } else {
    if (cumCanvasParent) cumCanvasParent.innerHTML = `<canvas id="cumulative-chart-canvas" class="w-full h-64"></canvas>`;
    const newCanvas = document.getElementById("cumulative-chart-canvas");
    if (newCanvas && window.Chart) {
      if (state.charts.cumulative) state.charts.cumulative.destroy();
      state.charts.cumulative = new Chart(newCanvas.getContext("2d"), {
        type: "line",
        data: {
          labels: cumulative.map((d) => d.date),
          datasets: [{
            label: "Cumulative P&L",
            data: cumulative.map((d) => d.pnl),
            borderColor: C.green,
            borderWidth: 2.5,
            backgroundColor: C.green + "40",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: "var(--muted-foreground)", font: { size: 10 } } },
            y: { grid: { borderColor: "var(--border)" }, ticks: { color: "var(--muted-foreground)", font: { size: 10 }, callback: (v) => "$" + v } },
          },
        },
      });
    }
  }

  renderHeatmap(closed);
}

function renderHeatmap(closed) {
  if (!state.calendarDate) state.calendarDate = new Date();
  const calendarDate = state.calendarDate;
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dailyMap = {};
  closed.forEach((t) => {
    const d = t.dateOpen || t.dateClose;
    if (d) dailyMap[d] = (dailyMap[d] || 0) + (t.pnlNum || 0);
  });

  document.getElementById("heatmap-month").textContent = calendarDate.toLocaleDateString(undefined, { month: "short", year: "numeric" });

  const daysGrid = document.getElementById("heatmap-days");
  daysGrid.innerHTML = "";
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
    const div = document.createElement("div");
    div.className = "text-xs font-medium text-muted-foreground text-center";
    div.textContent = d;
    daysGrid.appendChild(div);
  });

  for (let i = 0; i < firstDayIndex; i++) {
    const div = document.createElement("div");
    div.className = "h-10 rounded-md";
    daysGrid.appendChild(div);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const pnl = dailyMap[d];
    const hasPnl = pnl !== undefined;
    const isWin = hasPnl && pnl > 0;
    const isLoss = hasPnl && pnl < 0;
    const div = document.createElement("div");
    div.className = `h-10 rounded-md border ${isWin ? "bg-green/20 border-green/30" : isLoss ? "bg-red/20 border-red/30" : "bg-muted border-border"}`;
    div.innerHTML = `
      <div class="flex items-center justify-center">
        <span class="text-[10px] font-bold ${isWin ? "text-green" : isLoss ? "text-red" : "text-muted-foreground"}">
          ${hasPnl ? (pnl >= 0 ? "+" : "") + Math.round(pnl).toLocaleString() : "—"}
        </span>
      </div>
      <div class="text-[9px] text-muted-foreground text-center mt-0.5">${day}</div>
    `;
    daysGrid.appendChild(div);
  }
}

/* ==========================================================================
   SETTINGS
   ========================================================================== */

function renderSettings(lists) {
  const container = document.getElementById("lists-container");
  const sections = [
    { key: "strategies", label: "Strategy Playbooks", placeholder: "e.g. ICT Silver Bullet" },
    { key: "pairs", label: "Instrument Pairs", placeholder: "e.g. NASDAQ100" },
    { key: "signals", label: "Confluence Tags", placeholder: "e.g. FVG Tap" },
  ];

  container.innerHTML = "";
  sections.forEach((sec) => {
    const section = document.createElement("div");
    section.className = "rounded-xl border border-card-border bg-card p-5";
    section.innerHTML = `
      <div class="mb-4">
        <h3 class="font-semibold">${escapeHtml(sec.label)}</h3>
        <p class="text-xs text-muted-foreground mt-1">Items appear in trade-log dropdowns.</p>
      </div>
      <div class="flex gap-2 mb-4">
        <input type="text" class="flex-1 input" placeholder="${escapeHtml(sec.placeholder)}" data-sec="${sec.key}" />
        <button type="button" class="btn btn-default btn-sm" onclick="app.addSettingItem('${sec.key}')">Add</button>
      </div>
      <div class="flex flex-wrap gap-2">
        ${lists[sec.key].map((item) => `
          <span class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-input bg-background">
            ${escapeHtml(item)}
            <button type="button" class="ml-1 p-0.5 text-muted-foreground hover:text-red" onclick="app.deleteSettingItem('${sec.key}', '${escapeJs(item)}')">
              <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>
        `).join("")}
      </div>
    `;
    container.appendChild(section);
  });
}

window.app.addSettingItem = function (key) {
  const container = document.getElementById("lists-container");
  const input = container.querySelector(`input[data-sec="${key}"]`);
  const val = input.value.trim();
  if (!val || state.store.lists[key].includes(val)) return;
  state.store.saveLists({ [key]: [...state.store.lists[key], val] });
  input.value = "";
  renderPage();
};

window.app.deleteSettingItem = function (key, item) {
  state.store.saveLists({ [key]: state.store.lists[key].filter((i) => i !== item) });
  renderPage();
};

/* ==========================================================================
   EXPORT / IMPORT / CLEAR
   ========================================================================== */

window.app.exportData = function () {
  const data = state.store.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

window.app.importData = function (fileInput) {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      state.store.importAll(data);
      alert("Data imported successfully.");
      renderPage();
    } catch (err) {
      alert("Invalid import file.");
    }
  };
  reader.readAsText(file);
};

window.app.clearAllData = function () {
  if (!confirm("WARNING: This will reset ALL data to defaults. This cannot be undone. Continue?")) return;
  if (!confirm("Are you absolutely sure? All trades, accounts, and transactions will be lost.")) return;
  state.store.clearAll();
  state.activeScope = { mode: "ALL", selectedIds: state.store.accounts.map((a) => a.id) };
  renderPage();
};

/* ==========================================================================
   MODALS
   ========================================================================== */

function openModal(modal, title) {
  if (!modal) return;
  const titleEl = modal.querySelector(".modal-title");
  if (titleEl) titleEl.textContent = title;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ==========================================================================
   UTILITIES
   ========================================================================== */

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[m]));
}

function escapeJs(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n");
}
