// Sample data for the dashboard: one person's month, made up. Amounts are in cents so sums stay exact.

export type Category = "Groceries" | "Dining out" | "Transport" | "Rent" | "Utilities" | "Subscriptions" | "Income" | "Savings" | "Shopping" | "Health";
export type Transaction = { id: string; date: string; merchant: string; category: Category; amount: number; status: "cleared" | "pending" };

export const money = (cents: number, signed = false) => {
  const text = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(cents) / 100);
  return signed && cents !== 0 ? `${cents < 0 ? "−" : "+"}${text}` : cents < 0 ? `−${text}` : text;
};
export const shortDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const transactions: Transaction[] = [
  { id: "t1", date: "2026-10-29", merchant: "Corner Market", category: "Groceries", amount: -8640, status: "pending" },
  { id: "t2", date: "2026-10-28", merchant: "Metro card", category: "Transport", amount: -3200, status: "cleared" },
  { id: "t3", date: "2026-10-28", merchant: "Lantern Noodles", category: "Dining out", amount: -2480, status: "cleared" },
  { id: "t4", date: "2026-10-27", merchant: "Streaming", category: "Subscriptions", amount: -1599, status: "cleared" },
  { id: "t5", date: "2026-10-26", merchant: "Pharmacy", category: "Health", amount: -1875, status: "cleared" },
  { id: "t6", date: "2026-10-25", merchant: "Transfer to savings", category: "Savings", amount: -40000, status: "cleared" },
  { id: "t7", date: "2026-10-24", merchant: "Bookshop", category: "Shopping", amount: -2700, status: "cleared" },
  { id: "t8", date: "2026-10-22", merchant: "Electricity", category: "Utilities", amount: -9420, status: "cleared" },
  { id: "t9", date: "2026-10-21", merchant: "Corner Market", category: "Groceries", amount: -6215, status: "cleared" },
  { id: "t10", date: "2026-10-20", merchant: "Ride home", category: "Transport", amount: -1450, status: "cleared" },
  { id: "t11", date: "2026-10-18", merchant: "Saturday brunch", category: "Dining out", amount: -4120, status: "cleared" },
  { id: "t12", date: "2026-10-15", merchant: "Salary", category: "Income", amount: 480000, status: "cleared" },
  { id: "t13", date: "2026-10-14", merchant: "Music", category: "Subscriptions", amount: -1099, status: "cleared" },
  { id: "t14", date: "2026-10-12", merchant: "Weekly shop", category: "Groceries", amount: -7380, status: "cleared" },
  { id: "t15", date: "2026-10-10", merchant: "Phone plan", category: "Utilities", amount: -3500, status: "cleared" },
  { id: "t16", date: "2026-10-08", merchant: "Running shoes", category: "Shopping", amount: -12900, status: "cleared" },
  { id: "t17", date: "2026-10-06", merchant: "Dentist", category: "Health", amount: -8000, status: "cleared" },
  { id: "t18", date: "2026-10-04", merchant: "Team dinner", category: "Dining out", amount: -5690, status: "cleared" },
  { id: "t19", date: "2026-10-03", merchant: "Rent", category: "Rent", amount: -120000, status: "cleared" },
  { id: "t20", date: "2026-10-02", merchant: "Freelance invoice", category: "Income", amount: 65000, status: "cleared" },
  { id: "t21", date: "2026-10-01", merchant: "Weekly shop", category: "Groceries", amount: -6890, status: "cleared" },
  { id: "t22", date: "2026-10-01", merchant: "Cloud storage", category: "Subscriptions", amount: -299, status: "cleared" },
];

export const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
export const spent = transactions.filter((t) => t.amount < 0 && t.category !== "Savings").reduce((s, t) => s - t.amount, 0);
export const saved = transactions.filter((t) => t.category === "Savings").reduce((s, t) => s - t.amount, 0);
export const balance = 1284522;
export const left = income - spent - saved;

/** Spending per month, the last six months, in dollars (what the chart draws). */
export const months = [
  { month: "May", total: 2410 },
  { month: "Jun", total: 2655 },
  { month: "Jul", total: 2380 },
  { month: "Aug", total: 2890 },
  { month: "Sep", total: 2520 },
  { month: "Oct", total: Math.round(spent / 100) },
];

/** Where this month's spending went, in dollars. */
export const shares = (["Rent", "Groceries", "Dining out", "Shopping", "Utilities", "Transport", "Health", "Subscriptions"] as const).map((category, i) => ({
  category,
  value: Math.round(transactions.filter((t) => t.category === category && t.amount < 0).reduce((s, t) => s - t.amount, 0) / 100),
  fill: `var(--chart-${i + 1})`,
}));

export type Goal = { id: string; name: string; saved: number; target: number; by: string; monthly: number; icon: "PiggyBankIcon" | "TargetIcon" | "LandmarkIcon" | "WalletIcon" };
export const goals: Goal[] = [
  { id: "g1", name: "Emergency fund", saved: 840000, target: 1200000, by: "June 2027", monthly: 40000, icon: "PiggyBankIcon" },
  { id: "g2", name: "New laptop", saved: 125000, target: 240000, by: "March 2027", monthly: 25000, icon: "TargetIcon" },
  { id: "g3", name: "Trip to Kyoto", saved: 62000, target: 350000, by: "October 2027", monthly: 24000, icon: "LandmarkIcon" },
];

export type Bill = { name: string; due: string; amount: number; auto: boolean };
export const bills: Bill[] = [
  { name: "Rent", due: "2026-11-03", amount: 120000, auto: true },
  { name: "Streaming", due: "2026-11-04", amount: 1599, auto: true },
  { name: "Internet", due: "2026-11-07", amount: 5500, auto: false },
  { name: "Music", due: "2026-11-12", amount: 1099, auto: true },
  { name: "Gym", due: "2026-12-01", amount: 4500, auto: true },
];

export const subscriptions = [
  { name: "Streaming", note: "Renews Nov 4", price: 1599, months: [60, 60, 100, 100] },
  { name: "Music", note: "Renews Nov 12", price: 1099, months: [100, 100, 100, 100] },
  { name: "Cloud storage", note: "Renews Nov 20", price: 299, months: [40, 40, 40, 70] },
  { name: "Gym", note: "Renews Dec 1", price: 4500, months: [100, 80, 100, 90] },
];

export const categoryTone: Record<Category, "default" | "secondary" | "success" | "warning" | "info" | "outline"> = {
  Income: "success", Savings: "info", Rent: "default", Utilities: "secondary", Subscriptions: "outline", Groceries: "secondary", "Dining out": "secondary", Transport: "secondary", Shopping: "warning", Health: "secondary",
};
