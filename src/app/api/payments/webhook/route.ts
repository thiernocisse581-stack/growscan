import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { parseMonerooEvent, monerooAdapter } from "@/lib/moneroo";

export async function POST(req: Request) {
  try {
    const rawBodyText = await req.text();
    let payload: any = {};
    try {
      payload = JSON.parse(rawBodyText);
    } catch {
      payload = {};
    }

    let amount = 0;
    let userEmail: string | null = null;
    let userId: string | null = null;
    let paymentRef: string | null = null;
    let isCompleted = false;
    let providerName = "Webhook Gateway";

    // 0. Moneroo Webhook Event Handling
    const monerooSig = req.headers.get("x-moneroo-signature");
    const monerooWebhookSecret = process.env.MONEROO_WEBHOOK_SECRET;

    if (monerooSig && monerooWebhookSecret) {
      const isValid = monerooAdapter.verifyWebhookSignature(
        rawBodyText,
        monerooSig,
        monerooWebhookSecret
      );
      if (!isValid) {
        return NextResponse.json({ error: "Signature Moneroo invalide" }, { status: 401 });
      }
    }

    const monerooEvent = parseMonerooEvent(payload);
    if (monerooEvent) {
      providerName = "Moneroo Mobile Money";
      paymentRef = monerooEvent.providerTransactionId;

      if (monerooEvent.status === "completed") {
        amount = monerooEvent.reportedAmount || 0;
        userEmail = monerooEvent.metadata?.userEmail || null;
        userId = monerooEvent.metadata?.userId || null;

        // Defense-in-depth: Re-query live Moneroo API if secretKey is set
        const monerooSecret = process.env.MONEROO_SECRET_KEY;
        if (monerooSecret && paymentRef) {
          const liveCheck = await monerooAdapter.verifyPayment(paymentRef, monerooSecret);
          if (liveCheck && (liveCheck.status === "success" || liveCheck.status === "succeeded")) {
            isCompleted = true;
            if (!amount && liveCheck.amount) amount = liveCheck.amount;
            if (!userEmail && liveCheck.metadata?.userEmail) userEmail = liveCheck.metadata.userEmail;
          } else {
            isCompleted = false;
          }
        } else {
          isCompleted = true;
        }
      }
    }
    // 1. Stripe Webhook Event Handling
    else if (payload.type === "checkout.session.completed" && payload.data?.object) {
      const session = payload.data.object;
      amount = session.amount_total ? session.amount_total / 100 : 0;
      userEmail = session.customer_details?.email || null;
      paymentRef = session.id;
      providerName = "Stripe";
      isCompleted = true;
    } 
    // 2. PayTech / Mobile Money Webhook Event Handling
    else if (payload.type_event === "sale_complete" || payload.api_key_sha256 || payload.type === "payment") {
      amount = Number(payload.item_price || payload.amount || 0);
      paymentRef = payload.token || payload.ref_command || null;
      providerName = "PayTech Mobile Money";
      if (payload.custom_field) {
        try {
          const parsedCustom = typeof payload.custom_field === "string" ? JSON.parse(payload.custom_field) : payload.custom_field;
          userId = parsedCustom.userId || null;
          userEmail = parsedCustom.userEmail || null;
        } catch (e) {}
      }
      isCompleted = true;
    } else {
      // Default payload fallback
      amount = Number(payload.amount || 0);
      userEmail = payload.email || null;
      isCompleted = true;
    }

    if (isCompleted && amount > 0) {
      // Update transaction status in Supabase DB
      try {
        await supabase.from("transactions").insert({
          user_id: userId,
          type: "topup",
          amount,
          payment_method: providerName,
          status: "completed",
          reference_id: paymentRef,
        });

        // Credit user's wallet in Supabase profiles table
        if (userEmail) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("wallet_balance")
            .eq("email", userEmail)
            .single();

          if (profileData) {
            const currentBal = Number(profileData.wallet_balance || 0);
            await supabase
              .from("profiles")
              .update({ wallet_balance: currentBal + amount })
              .eq("email", userEmail);
          }
        }
      } catch (dbErr) {
        console.log("Webhook DB credit fallback:", dbErr);
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors du traitement du Webhook : " + err.message }, { status: 500 });
  }
}
