import { NextResponse } from "next/server";
import { monerooAdapter } from "@/lib/moneroo";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const paymentId = url.searchParams.get("paymentId") || url.searchParams.get("id");
  const reference = url.searchParams.get("reference");
  const secretKey = process.env.MONEROO_SECRET_KEY;

  if (!paymentId || !secretKey) {
    return NextResponse.redirect(`${appUrl}/dashboard?payment=cancel`);
  }

  try {
    const verification = await monerooAdapter.verifyPayment(paymentId, secretKey);

    if (verification && (verification.status === "success" || verification.status === "succeeded" || verification.status === "completed")) {
      const amount = verification.amount || 0;
      const metadata = verification.metadata || {};
      const userEmail = metadata.userEmail;
      const userId = metadata.userId;
      const orderType = metadata.orderType || "smm_order";

      // 1. Handle Direct SMM Order Fulfillment
      if (orderType === "smm_order" && metadata.target_url) {
        let panelOrderId = `SMM-${Math.floor(10000 + Math.random() * 90000)}`;

        // Transmit request to SMM Usine Panel API
        const smmKey = process.env.SMM_PANEL_API_KEY;
        const smmUrl = process.env.SMM_PANEL_URL;

        if (smmKey && smmUrl) {
          try {
            const formData = new URLSearchParams();
            formData.append("key", smmKey);
            formData.append("action", "add");
            formData.append("service", metadata.serviceId || "101");
            formData.append("link", metadata.target_url);
            formData.append("quantity", metadata.quantity ? String(metadata.quantity) : "1000");

            const smmRes = await fetch(smmUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: formData.toString(),
            });
            const smmData = await smmRes.json();
            if (smmData && smmData.order) {
              panelOrderId = `SMM-${smmData.order}`;
            }
          } catch (smmErr) {
            console.log("SMM usine API transmit error:", smmErr);
          }
        }

        // Insert order into Supabase
        await supabase.from("orders").insert({
          user_email: userEmail,
          network: metadata.network || "instagram",
          service_type: metadata.service_type || "Service SMM",
          target_url: metadata.target_url,
          quantity: Number(metadata.quantity || 1000),
          price: amount,
          panel_order_id: panelOrderId,
          status: "processing",
        });

        // Log transaction
        await supabase.from("transactions").insert({
          user_id: userId || null,
          type: "purchase",
          amount,
          payment_method: "Moneroo Mobile Money",
          status: "completed",
          reference_id: paymentId,
        });

        return NextResponse.redirect(`${appUrl}/dashboard?payment=success&order=smm_order&orderId=${panelOrderId}`);
      }

      // 2. Handle Direct AI Unlock Fulfillment
      if (orderType === "ai_unlock") {
        await supabase.from("transactions").insert({
          user_id: userId || null,
          type: "ai_unlock",
          amount,
          payment_method: "Moneroo Mobile Money",
          status: "completed",
          reference_id: paymentId,
        });

        return NextResponse.redirect(`${appUrl}/dashboard?payment=success&order=ai_unlock`);
      }

      return NextResponse.redirect(`${appUrl}/dashboard?payment=success&amount=${amount}`);
    } else {
      return NextResponse.redirect(`${appUrl}/dashboard?payment=cancel`);
    }
  } catch (err) {
    console.error("Erreur de vérification Moneroo :", err);
    return NextResponse.redirect(`${appUrl}/dashboard?payment=error`);
  }
}
