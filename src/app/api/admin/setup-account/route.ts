import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function createOrUpdateAdmin(emailStr?: string, passStr?: string) {
  const adminEmail = emailStr || "thiernocisse581@gmail.com";
  const adminPassword = passStr || "Nasser2018";
  const fullName = "Thierno Cissé (Admin Principal)";

  try {
    // 1. Try to sign up admin account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          full_name: fullName,
          role: "admin",
        },
      },
    });

    let targetId = authData?.user?.id;

    if (!targetId) {
      const { data: existingProf } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", adminEmail)
        .single();
      if (existingProf) targetId = existingProf.id;
    }

    if (targetId) {
      await supabase
        .from("profiles")
        .update({
          role: "admin",
          full_name: fullName,
          wallet_balance: 500000,
        })
        .eq("email", adminEmail);
    } else {
      await supabase.from("profiles").upsert({
        email: adminEmail,
        full_name: fullName,
        role: "admin",
        wallet_balance: 500000,
      });
    }

    return {
      success: true,
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
      message: `Compte Administrateur (${adminEmail}) prêt à l'emploi avec accès complet !`,
    };
  } catch (err: any) {
    return {
      success: false,
      credentials: {
        email: adminEmail,
        password: adminPassword,
      },
      error: err.message,
    };
  }
}

export async function GET() {
  const res = await createOrUpdateAdmin();
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const res = await createOrUpdateAdmin(body.email, body.password);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

