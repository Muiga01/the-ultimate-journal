import { z } from "zod";

export const tradeSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().min(1, "Account is required"),
  dateOpen: z.string().min(1, "Open date is required"),
  dateClose: z.string().optional(),
  strategy: z.string().min(1, "Strategy is required"),
  pair: z.string().min(1, "Pair is required"),
  direction: z.enum(["Long", "Short"]),
  entryPrice: z.string().refine((v) => !isNaN(parseFloat(v)), "Invalid entry price"),
  stopLoss: z.string().refine((v) => !isNaN(parseFloat(v)), "Invalid stop loss"),
  takeProfit: z.string().refine((v) => !isNaN(parseFloat(v)), "Invalid take profit"),
  exitPrice: z.string().optional(),
  confluences: z.array(z.string()).default([]),
  pnl: z.string().optional(),
  comments: z.string().optional(),
  lesson: z.string().optional(),
});

export const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  broker: z.string().min(1, "Broker is required"),
  currency: z.string().min(1, "Currency is required"),
  initialBalance: z.string().refine((v) => !isNaN(parseFloat(v)), "Invalid balance"),
  color: z.string().default("#8B5CF6"),
});

export const transactionSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().min(1, "Account is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().refine((v) => !isNaN(parseFloat(v)), "Invalid amount"),
});

export const listsSchema = z.object({
  pairs: z.array(z.string()),
  strategies: z.array(z.string()),
  signals: z.array(z.string()),
});

export type TradeInput = z.infer<typeof tradeSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type ListsInput = z.infer<typeof listsSchema>;
