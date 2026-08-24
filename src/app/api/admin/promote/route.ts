import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Adresse email requise." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Impossible d'accorder le rôle admin dans Supabase : " + error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Félicitations ! Le compte ${email} a été promu Administrateur.`,
      profile: data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
