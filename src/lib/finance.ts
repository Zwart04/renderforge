export interface FinanceEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  source: "auto-task" | "auto-vendor" | "manual";
  category: string;
}

const STORAGE_KEY = "rf_finance";

export function getStoredEntries(): FinanceEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore parse error
  }
  return [];
}

export function saveEntries(entries: FinanceEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore write error
  }
}

export function formatCurrency(amount: number, locale: string = "id"): string {
  return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function addFinanceEntry(entry: Omit<FinanceEntry, "id" | "date">): void {
  const newEntry: FinanceEntry = {
    ...entry,
    id: Math.random().toString(36).slice(2, 9),
    date: new Date().toISOString(),
  };
  const entries = getStoredEntries();
  saveEntries([newEntry, ...entries]);
}
