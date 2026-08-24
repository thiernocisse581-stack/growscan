import { NextResponse } from "next/server";

const ALLOWED_ADMINS = ["thiernocisse581@gmail.com", "admin@growscan.com"];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email || !ALLOWED_ADMINS.includes(email.toLowerCase().trim())) {
      return NextResponse.json(
        { error: "Accès refusé. La création ou promotion d'administrateur est strictement désactivée." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Compte Administrateur ${email} vérifié.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
