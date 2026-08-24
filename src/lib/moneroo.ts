import crypto from "crypto";
import { z } from "zod";

const MONEROO_API_URL = "https://api.moneroo.io";
const FETCH_TIMEOUT_MS = 15_000;

// ─────────────────────────────────────────────────────────────────────────
// Credentials schema
// ─────────────────────────────────────────────────────────────────────────

export const monerooCredentialsSchema = z.object({
  secretKey: z
    .string()
    .trim()
    .min(10)
    .refine(
      (v) => !/^sk_/.test(v) && !/^pk_/.test(v) && !/^whsec_/.test(v),
      "Clé Moneroo invalide (ressemble à une clé Stripe sk_/pk_/whsec_)."
    ),
  webhookSecret: z.string().trim().min(1).optional(),
});

export type MonerooCredentials = z.infer<typeof monerooCredentialsSchema>;

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

export type InitiatePaymentParams = {
  amount: number;
  currency: "XOF" | "XAF" | "USD" | "EUR" | string;
  description: string;
  reference: string;
  returnUrl: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  metadata?: Record<string, string | number | boolean | undefined>;
};

export type InitiatePaymentResult =
  | {
      ok: true;
      providerTransactionId: string;
      checkoutUrl: string;
      status: "pending";
    }
  | { ok: false; error: string };

export type NormalizedMonerooEvent = {
  providerTransactionId: string;
  status: "completed" | "failed" | "pending";
  failureReason?: string;
  reportedAmount?: number;
  reportedCurrency?: string;
  metadata?: Record<string, any>;
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function splitName(
  full: string | undefined,
  fallbackEmail: string
): { first: string; last: string } {
  const v = (full ?? "").trim();
  if (!v) {
    const local = fallbackEmail.split("@")[0] || "Customer";
    return { first: local, last: "-" };
  }
  const parts = v.split(/\s+/);
  return { first: parts[0]!, last: parts.slice(1).join(" ") || "-" };
}

async function monerooFetch(
  path: string,
  init: RequestInit
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${MONEROO_API_URL}${path}`, {
      ...init,
      signal: ctrl.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Adapter
// ─────────────────────────────────────────────────────────────────────────

export const monerooAdapter = {
  /**
   * Initialiser une session de paiement Moneroo (Mobile Money / Carte)
   */
  async initiatePayment(
    params: InitiatePaymentParams,
    credentials: MonerooCredentials
  ): Promise<InitiatePaymentResult> {
    const { first, last } = splitName(
      params.customerName,
      params.customerEmail
    );

    const body: Record<string, unknown> = {
      amount: Math.round(params.amount),
      currency: params.currency || "XOF",
      description: params.description.slice(0, 200),
      return_url: params.returnUrl,
      customer: {
        email: params.customerEmail,
        first_name: first,
        last_name: last,
        ...(params.customerPhone ? { phone: params.customerPhone } : {}),
      },
      metadata: Object.fromEntries(
        Object.entries({
          reference: params.reference,
          ...(params.metadata ?? {}),
        })
          .filter(
            ([, v]) => v !== undefined && v !== null && String(v).length > 0
          )
          .map(([k, v]) => [k, String(v)])
      ),
    };

    let res: Response;
    try {
      res = await monerooFetch("/v1/payments/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${credentials.secretKey}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      return {
        ok: false,
        error: `Erreur réseau Moneroo : ${(err as Error).message}`,
      };
    }

    let parsed: {
      data?: { id?: string; checkout_url?: string };
      message?: string;
    };
    try {
      parsed = (await res.json()) as typeof parsed;
    } catch {
      return { ok: false, error: `Moneroo a retourné ${res.status} (non-JSON)` };
    }

    if (!res.ok || !parsed.data?.id || !parsed.data?.checkout_url) {
      return {
        ok: false,
        error: parsed.message || `Erreur d'initialisation Moneroo (${res.status})`,
      };
    }

    return {
      ok: true,
      providerTransactionId: parsed.data.id,
      checkoutUrl: parsed.data.checkout_url,
      status: "pending",
    };
  },

  /**
   * Vérifier / Re-requêter le statut d'un paiement en direct (Defense in Depth)
   */
  async verifyPayment(
    paymentId: string,
    secretKey: string
  ): Promise<{
    status: string;
    amount?: number;
    currency?: string;
    metadata?: Record<string, any>;
    raw: unknown;
  } | null> {
    let res: Response;
    try {
      res = await monerooFetch(
        `/v1/payments/${encodeURIComponent(paymentId)}/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            Accept: "application/json",
          },
        }
      );
    } catch {
      return null;
    }
    if (!res.ok) return null;

    const json = (await res.json().catch(() => null)) as {
      data?: {
        status?: string;
        amount?: number | string;
        currency?: { code?: string } | string;
        metadata?: Record<string, any>;
      };
    } | null;

    if (!json?.data?.status) return null;

    const currency =
      typeof json.data.currency === "string"
        ? json.data.currency
        : json.data.currency?.code;

    return {
      status: String(json.data.status).toLowerCase(),
      amount:
        typeof json.data.amount === "string"
          ? parseInt(json.data.amount, 10)
          : json.data.amount,
      currency,
      metadata: json.data.metadata,
      raw: json,
    };
  },

  /**
   * Tester la validité de la clé API Moneroo
   */
  async probeKey(secretKey: string): Promise<{ ok: boolean; error?: string }> {
    let res: Response;
    try {
      res = await monerooFetch(`/v1/payments/izi_verify_probe_${Date.now()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          Accept: "application/json",
        },
      });
    } catch (err) {
      return { ok: false, error: `Erreur réseau : ${(err as Error).message}` };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "Clé API Moneroo invalide" };
    }
    return { ok: true };
  },

  /**
   * Vérification de signature Webhook HMAC-SHA256
   */
  verifyWebhookSignature(
    rawBody: Buffer | string,
    signatureHeader: string,
    secret: string
  ): boolean {
    if (!signatureHeader || !secret) return false;
    try {
      const expected = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      const a = Buffer.from(signatureHeader.trim());
      const b = Buffer.from(expected);
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  },
};

/**
 * Normaliser un évènement Webhook Moneroo
 */
export function parseMonerooEvent(body: unknown): NormalizedMonerooEvent | null {
  const b = body as { event?: string; data?: Record<string, unknown> } | null;
  if (!b?.event || !b.data) return null;

  const data = b.data;
  const id = data.id as string | undefined;
  if (!id) return null;

  const reportedAmount =
    typeof data.amount === "number"
      ? data.amount
      : typeof data.amount === "string"
      ? parseInt(data.amount, 10)
      : undefined;

  const reportedCurrency =
    typeof data.currency === "string"
      ? data.currency
      : (data.currency as { code?: string } | undefined)?.code;

  const metadata = (data.metadata as Record<string, any>) || {};

  if (b.event === "payment.success" || data.status === "success" || data.status === "succeeded") {
    return {
      providerTransactionId: id,
      status: "completed",
      reportedAmount,
      reportedCurrency,
      metadata,
    };
  }

  if (b.event === "payment.failed" || b.event === "payment.cancelled" || data.status === "failed") {
    return {
      providerTransactionId: id,
      status: "failed",
      failureReason: typeof data.status === "string" ? data.status : b.event,
      reportedAmount,
      reportedCurrency,
      metadata,
    };
  }

  return null;
}
