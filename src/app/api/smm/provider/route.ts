import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const smmKey = process.env.SMM_PANEL_API_KEY || "dccd47cb9daa1f71940b92becdc747b1";
    const smmUrl = process.env.SMM_PANEL_URL || "https://justanotherpanel.com/api/v2";

    const { searchParams } = new URL(req.url);
    const categoryQuery = searchParams.get("category") || "";
    const searchQuery = searchParams.get("search") || "";

    const startTime = Date.now();

    // 1. Fetch Provider Balance
    let providerBalance = { balance: "0.00", currency: "USD", fcfa: 0 };
    try {
      const resBalance = await fetch(smmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key: smmKey, action: "balance" }).toString(),
      });
      const dataBalance = await resBalance.json();
      if (dataBalance && dataBalance.balance !== undefined) {
        const balUsd = parseFloat(dataBalance.balance) || 0;
        providerBalance = {
          balance: balUsd.toFixed(2),
          currency: dataBalance.currency || "USD",
          fcfa: Math.round(balUsd * 650),
        };
      }
    } catch (balErr) {
      console.log("Balance fetch note:", balErr);
    }

    // 2. Fetch Provider Services
    let rawServices: any[] = [];
    try {
      const resServices = await fetch(smmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key: smmKey, action: "services" }).toString(),
      });
      const dataServices = await resServices.json();
      if (Array.isArray(dataServices)) {
        rawServices = dataServices;
      }
    } catch (servErr) {
      console.log("Services fetch note:", servErr);
    }

    const pingTimeMs = Date.now() - startTime;

    // Filter services if category or search query requested
    let filteredServices = rawServices;
    if (categoryQuery) {
      filteredServices = filteredServices.filter((s) =>
        s.category?.toLowerCase().includes(categoryQuery.toLowerCase())
      );
    }
    if (searchQuery) {
      filteredServices = filteredServices.filter((s) =>
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.service?.toString().includes(searchQuery) ||
        s.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Map to formatted list with profit margin calculation
    const formattedServices = filteredServices.slice(0, 100).map((s) => {
      const rateUsd = parseFloat(s.rate) || 0;
      // Supplier cost per 1000 in FCFA (1 USD = 650 FCFA)
      const costFcfa = Math.round(rateUsd * 650);
      // Selling price with +50% margin
      const retailFcfa = Math.round(costFcfa * 1.5);

      return {
        serviceId: s.service,
        name: s.name,
        category: s.category || "Général",
        rateUsd: rateUsd.toFixed(4),
        costFcfa,
        retailFcfa,
        min: s.min,
        max: s.max,
        refill: s.refill || false,
        cancel: s.cancel || false,
        type: s.type || "Default",
      };
    });

    // Categories List
    const categoriesSet = new Set<string>();
    rawServices.forEach((s) => {
      if (s.category) categoriesSet.add(s.category);
    });

    return NextResponse.json({
      success: true,
      provider: {
        name: "JustAnotherPanel (API v2)",
        apiUrl: smmUrl,
        balance: providerBalance,
        pingMs: pingTimeMs,
        totalServices: rawServices.length,
        categoriesCount: categoriesSet.size,
      },
      categories: Array.from(categoriesSet).slice(0, 30),
      servicesCount: filteredServices.length,
      services: formattedServices,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur API Fournisseur SMM : " + err.message }, { status: 500 });
  }
}
