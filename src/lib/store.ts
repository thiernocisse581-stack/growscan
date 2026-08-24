"use client";

export interface OrderItem {
  id: string;
  network: "instagram" | "tiktok" | "youtube" | "telegram" | "facebook" | "twitter" | string;
  service_type: string;
  target_url: string;
  quantity: number;
  price: number; // in FCFA
  panel_order_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
}

export interface ReportItem {
  id: string;
  profile_url: string;
  network: "instagram" | "tiktok" | "youtube" | "telegram" | "facebook" | "twitter" | string;
  score: number;
  summary: string;
  full_report?: any;
  is_unlocked: boolean;
  created_at: string;
}

const STORAGE_KEYS = {
  WALLET: "growscan_wallet_balance",
  ORDERS: "growscan_orders",
  REPORTS: "growscan_reports",
};

const DEFAULT_ORDERS: OrderItem[] = [];

const DEFAULT_REPORTS: ReportItem[] = [];

// Helper to safely access window.localStorage
function isClient() {
  return typeof window !== "undefined";
}

// Event emitter for store updates
export function notifyStoreChange() {
  if (isClient()) {
    window.dispatchEvent(new Event("growscan_store_updated"));
  }
}

// Wallet Functions
export function getWalletBalance(): number {
  if (!isClient()) return 0;
  const stored = localStorage.getItem(STORAGE_KEYS.WALLET);
  if (stored === null) {
    localStorage.setItem(STORAGE_KEYS.WALLET, "0");
    return 0;
  }
  return parseFloat(stored) || 0;
}

export function topupWallet(amount: number): number {
  const current = getWalletBalance();
  const newBalance = current + amount;
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.WALLET, newBalance.toString());
    notifyStoreChange();
  }
  return newBalance;
}

export function deductWallet(amount: number): boolean {
  const current = getWalletBalance();
  if (current < amount) return false;
  const newBalance = current - amount;
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.WALLET, newBalance.toString());
    notifyStoreChange();
  }
  return true;
}

// Orders Functions
export function getOrders(): OrderItem[] {
  if (!isClient()) return DEFAULT_ORDERS;
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    return DEFAULT_ORDERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_ORDERS;
  }
}

export function addOrder(newOrder: Partial<OrderItem> & { network: string; service_type: string; target_url: string; quantity: number; price: number }): OrderItem {
  const orders = getOrders();
  const randId = Math.floor(10000 + Math.random() * 90000);
  const created: OrderItem = {
    network: newOrder.network,
    service_type: newOrder.service_type,
    target_url: newOrder.target_url,
    quantity: newOrder.quantity,
    price: newOrder.price,
    id: newOrder.id || `ord_${randId}`,
    panel_order_id: newOrder.panel_order_id || `SMM-${randId}`,
    status: newOrder.status || "processing",
    created_at: newOrder.created_at || new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const updated = [created, ...orders];
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    notifyStoreChange();
  }
  return created;
}

// Reports Functions
export function getReports(): ReportItem[] {
  if (!isClient()) return DEFAULT_REPORTS;
  const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_REPORTS;
  }
}

export function addReport(newReport: Omit<ReportItem, "id" | "created_at"> & { id?: string }): ReportItem {
  const reports = getReports();
  const randId = Math.floor(1000 + Math.random() * 9000);
  const created: ReportItem = {
    ...newReport,
    id: newReport.id || `rep_${randId}`,
    created_at: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };

  const updated = [created, ...reports];
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    notifyStoreChange();
  }
  return created;
}

export function unlockReport(reportId: string): boolean {
  const reports = getReports();
  let found = false;
  const updated = reports.map((r) => {
    if (r.id === reportId || r.profile_url === reportId) {
      found = true;
      return { ...r, is_unlocked: true };
    }
    return r;
  });

  if (found && isClient()) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    notifyStoreChange();
  }
  return found;
}

// URL Validation Utility
export function validateSocialUrl(input: string, network: "instagram" | "tiktok" | "youtube"): { valid: boolean; formattedUrl: string; error?: string } {
  const cleaned = input.trim();
  if (!cleaned) {
    return { valid: false, formattedUrl: "", error: "Veuillez saisir un lien ou un identifiant." };
  }

  // Handle @pseudo shorthand
  if (cleaned.startsWith("@")) {
    const handle = cleaned.substring(1);
    if (handle.length < 2) {
      return { valid: false, formattedUrl: "", error: "L'identifiant est trop court." };
    }
    return {
      valid: true,
      formattedUrl: `https://${network}.com/${handle}`,
    };
  }

  // Check network specific patterns
  if (network === "instagram") {
    if (cleaned.includes("instagram.com") || cleaned.includes("instagr.am") || !cleaned.includes(".")) {
      const url = cleaned.startsWith("http") ? cleaned : `https://${cleaned.startsWith("instagram.com") ? "" : "instagram.com/"}${cleaned}`;
      return { valid: true, formattedUrl: url };
    }
    return { valid: false, formattedUrl: "", error: "L'URL doit contenir instagram.com ou votre @pseudo." };
  }

  if (network === "tiktok") {
    if (cleaned.includes("tiktok.com") || !cleaned.includes(".")) {
      const url = cleaned.startsWith("http") ? cleaned : `https://${cleaned.startsWith("tiktok.com") ? "" : "tiktok.com/@"}${cleaned.replace("@", "")}`;
      return { valid: true, formattedUrl: url };
    }
    return { valid: false, formattedUrl: "", error: "L'URL doit contenir tiktok.com ou votre @pseudo." };
  }

  if (network === "youtube") {
    if (cleaned.includes("youtube.com") || cleaned.includes("youtu.be") || !cleaned.includes(".")) {
      const url = cleaned.startsWith("http") ? cleaned : `https://${cleaned.startsWith("youtube.com") ? "" : "youtube.com/@"}${cleaned.replace("@", "")}`;
      return { valid: true, formattedUrl: url };
    }
    return { valid: false, formattedUrl: "", error: "L'URL doit contenir youtube.com ou votre chaîne." };
  }

  return { valid: true, formattedUrl: cleaned.startsWith("http") ? cleaned : `https://${cleaned}` };
}
