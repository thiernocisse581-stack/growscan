import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // 1. Fetch total users
    const { data: profiles, error: profilesErr } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    
    // 2. Fetch total orders
    const { data: orders, error: ordersErr } = await supabase.from("orders").select("*").order("created_at", { ascending: false });

    // 3. Fetch total transactions
    const { data: transactions, error: txErr } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });

    // 4. Fetch total AI reports
    const { data: reports, error: reportsErr } = await supabase.from("analysis_reports").select("*").order("created_at", { ascending: false });

    const userList = profiles || [];
    const orderList = orders || [];
    const txList = transactions || [];
    const reportList = reports || [];

    const totalUsers = userList.length;
    const totalOrders = orderList.length;
    const totalReports = reportList.length;
    const totalRevenue = txList.reduce((acc, t) => acc + (t.amount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalReports,
        totalRevenue,
      },
      users: userList,
      orders: orderList,
      transactions: txList,
      reports: reportList,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST endpoint for Admin Manual Wallet Credit
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, action } = body;

    if (!userId || !amount) {
      return NextResponse.json({ error: "L'identifiant utilisateur et le montant sont requis." }, { status: 400 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
    }

    // Fetch target user profile
    const { data: targetProfile, error: fetchErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchErr || !targetProfile) {
      return NextResponse.json({ error: "Utilisateur non trouvé dans Supabase." }, { status: 404 });
    }

    const currentBalance = targetProfile.wallet_balance || 0;
    const newBalance = action === "deduct" ? Math.max(0, currentBalance - numericAmount) : currentBalance + numericAmount;

    // Update DB
    const { data: updatedProfile, error: updateErr } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance })
      .eq("id", userId)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json({ error: "Erreur lors de la mise à jour du solde : " + updateErr.message }, { status: 500 });
    }

    // Log transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      type: "topup",
      amount: numericAmount,
      payment_method: "Admin Manual Credit",
      status: "completed",
    });

    return NextResponse.json({
      success: true,
      message: `Solde mis à jour avec succès (${newBalance.toLocaleString("fr-FR")} FCFA)`,
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
