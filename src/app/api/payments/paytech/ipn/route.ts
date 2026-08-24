import { NextResponse } from "next/server";
import { paytechAdapter } from "@/lib/paytech";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    let bodyData: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      bodyData = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.text();
      const params = new URLSearchParams(formData);
      for (const [key, val] of params.entries()) {
        bodyData[key] = val;
      }
    } else {
      const text = await req.text();
      try {
        bodyData = JSON.parse(text);
      } catch (e) {
        bodyData = {};
      }
    }

    console.log("⚡ Notification IPN PayTech Reçue :", bodyData);

    const {
      type_event,
      ref_command,
      api_secret_sha256,
      custom_field,
      item_price,
    } = bodyData;

    // 1. Vérification de la signature IPN PayTech
    if (api_secret_sha256) {
      const isValid = paytechAdapter.verifyIpnSignature(api_secret_sha256);
      if (!isValid) {
        console.warn("⚠️ Signature IPN PayTech invalide !");
        return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
      }
    }

    // 2. Extraire les métadonnées de la commande
    let metadata: any = {};
    if (typeof custom_field === "string") {
      try {
        metadata = JSON.parse(custom_field);
      } catch (e) {
        metadata = {};
      }
    } else if (typeof custom_field === "object") {
      metadata = custom_field || {};
    }

    const orderType = metadata.orderType || "smm_order";
    const orderDetails = metadata.orderDetails || {};
    const userId = metadata.userId || null;
    const userEmail = metadata.userEmail || null;
    const amount = Number(item_price || metadata.amount || 0);

    // 3. Si l'événement est un paiement validé (sale_complete)
    if (type_event === "sale_complete" || !type_event) {
      console.log(`✅ Paiement PayTech validé (${amount} FCFA) pour type: ${orderType}`);

      // Traitement A : Commande SMM (Abonnés / Likes / Vues)
      if (orderType === "smm_order" && orderDetails.serviceId) {
        let panelOrderId = `SMM-${Math.floor(10000 + Math.random() * 90000)}`;

        const smmApiKey = process.env.SMM_PANEL_API_KEY;
        const smmApiUrl = process.env.SMM_PANEL_URL || "https://justanotherpanel.com/api/v2";

        if (smmApiKey) {
          try {
            const smmRes = await fetch(smmApiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                key: smmApiKey,
                action: "add",
                service: (orderDetails.serviceId || 10338).toString(),
                link: orderDetails.target_url || "",
                quantity: (orderDetails.quantity || 1000).toString(),
              }).toString(),
            });

            const smmData = await smmRes.json();
            if (smmData.order) {
              panelOrderId = smmData.order.toString();
              console.log("⚡ Commande transmise à l'Usine SMM avec succès ID :", panelOrderId);
            }
          } catch (smmErr) {
            console.error("Erreur lors de la transmission à l'Usine SMM :", smmErr);
          }
        }

        // Sauvegarde dans Supabase `orders`
        try {
          await supabase.from("orders").insert({
            user_id: userId,
            user_email: userEmail,
            network: orderDetails.network || "instagram",
            service_type: orderDetails.service_type || "Abonnés",
            target_url: orderDetails.target_url || "",
            quantity: Number(orderDetails.quantity || 1000),
            price: amount,
            panel_order_id: panelOrderId,
            status: "processing",
          });
        } catch (dbErr) {
          console.error("Supabase insert order error :", dbErr);
        }
      }

      // Traitement B : Déverrouillage d'Audit IA
      if (orderType === "ai_unlock" && orderDetails.reportId) {
        try {
          await supabase
            .from("reports")
            .update({ is_unlocked: true })
            .eq("id", orderDetails.reportId);
        } catch (dbErr) {
          console.error("Supabase unlock report error :", dbErr);
        }
      }

      // Enregistrement de la transaction dans `transactions`
      try {
        await supabase.from("transactions").insert({
          user_id: userId,
          type: orderType === "ai_unlock" ? "ai_unlock" : "purchase",
          amount,
          payment_method: "PayTech Mobile Money / Carte",
          status: "completed",
          reference_id: ref_command || `PAY-${Date.now()}`,
        });
      } catch (dbErr) {
        console.error("Supabase transaction log error :", dbErr);
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error("Erreur Webhook IPN PayTech :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
