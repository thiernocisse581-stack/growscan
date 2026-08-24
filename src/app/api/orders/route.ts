import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { network, service_type, target_url, quantity, price, serviceId } = body;

    if (!network || !service_type || !target_url || !quantity || !price) {
      return NextResponse.json({ error: "Tous les champs de la commande sont requis." }, { status: 400 });
    }

    // 1. Transmit request to SMM Panel API if credentials configured
    let panelOrderId = `SMM-${Math.floor(10000 + Math.random() * 90000)}`;
    let panelError: string | null = null;

    const smmKey = process.env.SMM_PANEL_API_KEY;
    const smmUrl = process.env.SMM_PANEL_URL;

    if (smmKey && smmUrl) {
      try {
        const formData = new URLSearchParams();
        formData.append("key", smmKey);
        formData.append("action", "add");
        formData.append("service", serviceId?.toString() || "101");
        formData.append("link", target_url);
        formData.append("quantity", quantity.toString());

        const smmRes = await fetch(smmUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });
        const smmData = await smmRes.json();

        if (smmData && smmData.order) {
          panelOrderId = `SMM-${smmData.order}`;
        } else if (smmData && smmData.error) {
          panelError = smmData.error;
          return NextResponse.json({
            error: `Le panel usine SMM a refusé la commande : ${smmData.error}`,
          }, { status: 422 });
        }
      } catch (smmErr) {
        console.log("SMM supplier fallback ID used:", smmErr);
      }
    }

    // 2. Insert order into Supabase
    let dbOrder = null;
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          network,
          service_type,
          target_url,
          quantity,
          price,
          panel_order_id: panelOrderId,
          status: "processing",
        })
        .select()
        .single();

      if (!error && data) {
        dbOrder = data;

        // Log transaction
        await supabase.from("transactions").insert({
          type: "purchase",
          amount: price,
          payment_method: "Wallet",
          status: "completed",
        });
      }
    } catch (dbErr) {
      console.log("Supabase order insert fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      panelOrderId,
      order: dbOrder || {
        id: `ord_${Math.floor(10000 + Math.random() * 90000)}`,
        network,
        service_type,
        target_url,
        quantity,
        price,
        panel_order_id: panelOrderId,
        status: "processing",
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors de la création de la commande : " + err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, orders: [] });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, orders: [] }, { status: 500 });
  }
}
