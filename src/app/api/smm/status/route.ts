import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const smmKey = process.env.SMM_PANEL_API_KEY;
    const smmUrl = process.env.SMM_PANEL_URL || "https://justanotherpanel.com/api/v2";

    // 1. Fetch processing orders from Supabase DB
    const { data: dbOrders, error: dbErr } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "processing");

    if (dbErr || !dbOrders || dbOrders.length === 0) {
      return NextResponse.json({
        success: true,
        updatedCount: 0,
        message: "Aucune commande en cours de traitement.",
      });
    }

    const updatedOrders: any[] = [];

    // If SMM API Key is present, perform real API status check
    if (smmKey) {
      const panelIds = dbOrders
        .map((o) => o.panel_order_id?.replace("SMM-", ""))
        .filter(Boolean);

      if (panelIds.length > 0) {
        try {
          const formData = new URLSearchParams();
          formData.append("key", smmKey);
          formData.append("action", "status");
          formData.append("orders", panelIds.join(","));

          const smmRes = await fetch(smmUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
          });
          const smmData = await smmRes.json();

          // Process status for each order
          for (const order of dbOrders) {
            const rawId = order.panel_order_id?.replace("SMM-", "");
            const statusInfo = smmData[rawId] || smmData;

            if (statusInfo && statusInfo.status) {
              const statusStr = statusInfo.status.toString().toLowerCase();
              let newStatus: "processing" | "completed" | "canceled" = "processing";

              if (statusStr.includes("completed") || statusStr.includes("finished")) {
                newStatus = "completed";
              } else if (statusStr.includes("canceled") || statusStr.includes("cancel") || statusStr.includes("partial")) {
                newStatus = "canceled";

                // Refund wallet in case of cancellation
                await supabase.from("transactions").insert({
                  user_id: order.user_id,
                  type: "topup",
                  amount: order.price,
                  payment_method: "Remboursement SMM",
                  status: "completed",
                });
              }

              if (newStatus !== order.status) {
                await supabase
                  .from("orders")
                  .update({ status: newStatus, updated_at: new Date().toISOString() })
                  .eq("id", order.id);

                updatedOrders.push({ id: order.id, oldStatus: order.status, newStatus });
              }
            }
          }
        } catch (smmErr) {
          console.log("SMM Status Check API Error:", smmErr);
        }
      }
    } else {
      // Simulation mode for demo orders older than 2 minutes: transition to completed
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      for (const order of dbOrders) {
        if (order.created_at < twoMinutesAgo) {
          await supabase
            .from("orders")
            .update({ status: "completed", updated_at: new Date().toISOString() })
            .eq("id", order.id);

          updatedOrders.push({ id: order.id, oldStatus: "processing", newStatus: "completed" });
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedOrders.length,
      updates: updatedOrders,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors du polling SMM : " + err.message }, { status: 500 });
  }
}
