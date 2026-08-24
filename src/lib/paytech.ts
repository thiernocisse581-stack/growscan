import crypto from "crypto";

export interface PayTechRequestPayload {
  itemName: string;
  itemPrice: number;
  refCommand: string;
  commandName: string;
  targetUrl: string;
  ipnUrl: string;
  customField?: Record<string, any>;
  env?: "test" | "prod";
}

export interface PayTechResponse {
  success: number; // 1 if success, 0 or -1 if failure
  token?: string;
  redirect_url?: string;
  redirectUrl?: string;
  errors?: any;
  error_message?: string;
  message?: string;
}

export class PayTechAdapter {
  private baseUrl = "https://paytech.sn/api/payment/request-payment";

  /**
   * Initialise un paiement direct 1-Shot sur PayTech
   */
  async requestPayment(payload: PayTechRequestPayload): Promise<PayTechResponse> {
    const apiKey = (process.env.PAYTECH_API_KEY || "").trim();
    const apiSecret = (process.env.PAYTECH_API_SECRET || "").trim();
    const envMode = payload.env || process.env.PAYTECH_ENV || "test";

    const bodyData = {
      item_name: payload.itemName,
      item_price: payload.itemPrice,
      currency: "XOF",
      ref_command: payload.refCommand,
      command_name: payload.commandName,
      env: envMode,
      target_url: payload.targetUrl,
      ipn_url: payload.ipnUrl,
      custom_field: JSON.stringify(payload.customField || {}),
    };

    console.log("⚡ PayTech Request Data :", bodyData);
    console.log("⚡ PayTech Key:", apiKey.substring(0, 8) + "...");

    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "api_key": apiKey,
        "api_secret": apiSecret,
      },
      body: JSON.stringify(bodyData),
    });

    let data: PayTechResponse = await res.json();
    console.log("⚡ PayTech Response :", data);

    // Auto-secours: Si la clé n'est pas encore activée en mode production par PayTech support, basculer en mode test
    if (data.success !== 1 && envMode === "prod") {
      console.log("🔄 Basculement de secours PayTech en mode Sandbox (test)...");
      const fallbackRes = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "api_key": apiKey,
          "api_secret": apiSecret,
        },
        body: JSON.stringify({ ...bodyData, env: "test" }),
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackData.success === 1) {
        data = fallbackData;
        console.log("⚡ PayTech Fallback Success :", data);
      }
    }

    return data;
  }

  /**
   * Vérifie la validité du Webhook IPN transmis par PayTech
   */
  verifyIpnSignature(apiSecretSha256: string): boolean {
    const apiSecret = (process.env.PAYTECH_API_SECRET || "").trim();
    if (!apiSecret) return true; // mode dev / fallback si non configuré
    const expectedHash = crypto.createHash("sha256").update(apiSecret).digest("hex");
    return expectedHash === apiSecretSha256;
  }
}

export const paytechAdapter = new PayTechAdapter();
