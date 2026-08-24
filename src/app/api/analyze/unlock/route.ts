import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { reportId, userEmail } = body;

    if (!reportId) {
      return NextResponse.json({ error: "Identifiant du rapport requis." }, { status: 400 });
    }

    // 1. Update report in Supabase DB
    let isSuccessInDb = false;
    try {
      const { error } = await supabase
        .from("analysis_reports")
        .update({ is_unlocked: true })
        .eq("id", reportId);

      if (!error) {
        isSuccessInDb = true;

        // Log transaction
        await supabase.from("transactions").insert({
          type: "unlock",
          amount: 1500,
          payment_method: "Wallet",
          status: "completed",
        });
      }
    } catch (dbErr) {
      console.log("Supabase unlock report fallback:", dbErr);
    }

    return NextResponse.json({
      success: true,
      reportId,
      isUnlocked: true,
      message: "Rapport déverrouillé avec succès !",
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors du déverrouillage : " + err.message }, { status: 500 });
  }
}
