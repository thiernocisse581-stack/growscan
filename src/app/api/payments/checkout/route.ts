import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { paytechAdapter } from "@/lib/paytech";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, paymentMethod = "PayTech", userId, userEmail, orderType = "smm_order", orderDetails = {} } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    let redirectUrl = `${appUrl}/dashboard?payment=success&amount=${amount}`;
    let paymentRef = `PAY-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderDescription = orderType === "ai_unlock"
      ? `Déverrouillage Audit IA GrowScan (${amount} FCFA)`
      : `Commande ${orderDetails.service_type || 'Service SMM'} (${amount} FCFA)`;

    // Initialisation Directe PayTech (Wave, Orange Money, Free Money, Carte)
    try {
      const paytechRes = await paytechAdapter.requestPayment({
        itemName: orderDescription,
        itemPrice: amount,
        refCommand: paymentRef,
        commandName: "GrowScan 1-Shot Direct Checkout",
        targetUrl: `${appUrl}/dashboard?payment=success&ref=${paymentRef}&amount=${amount}`,
        ipnUrl: `${appUrl}/api/payments/paytech/ipn`,
        customField: {
          userId: userId || "",
          userEmail: userEmail || "",
          orderType,
          amount,
          orderDetails,
        },
      });

      if (paytechRes.success === 1 && (paytechRes.redirect_url || paytechRes.redirectUrl)) {
        redirectUrl = paytechRes.redirect_url || paytechRes.redirectUrl || redirectUrl;
        if (paytechRes.token) {
          paymentRef = paytechRes.token;
        }
      } else if (paytechRes.message || paytechRes.error_message) {
        console.warn("PayTech API Error :", paytechRes.message || paytechRes.error_message);
        return NextResponse.json({ error: paytechRes.message || paytechRes.error_message }, { status: 400 });
      }
    } catch (paytechErr: any) {
      console.error("PayTech checkout error :", paytechErr.message);
    }

    // Log transaction standard dans Supabase DB `transactions`
    try {
      await supabase.from("transactions").insert({
        user_id: userId || null,
        type: orderType === "ai_unlock" ? "ai_unlock" : "purchase",
        amount,
        payment_method: "PayTech Mobile Money / Carte",
        status: "pending",
        reference_id: paymentRef,
      });
    } catch (dbErr) {
      console.log("Supabase transaction insert note :", dbErr);
    }

    return NextResponse.json({
      success: true,
      redirectUrl,
      paymentRef,
      amount,
      paymentMethod: "PayTech",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors de l'initialisation du paiement PayTech : " + err.message }, { status: 500 });
  }
}
