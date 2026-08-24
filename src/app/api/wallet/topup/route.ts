import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, paymentMethod = "Wave" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    // Insert transaction into Supabase
    let dbTransaction = null;
    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          type: "topup",
          amount,
          payment_method: paymentMethod,
          status: "completed",
        })
        .select()
        .single();

      if (!error) {
        dbTransaction = data;
      }
    } catch (dbErr) {
      console.log("Supabase transaction insert fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      amount,
      transaction: dbTransaction,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors du rechargement : " + err.message }, { status: 500 });
  }
}
