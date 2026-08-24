import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, network = "tiktok", followerCountInput, bioInput, avatarUrlInput } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Lien de profil requis." }, { status: 400 });
    }

    const currentNetwork = (network || "tiktok").toLowerCase();

    // 1. Extraction propre du nom d'utilisateur (@pseudo)
    let rawUsername = url.trim();
    rawUsername = rawUsername.split("?")[0].replace(/\/$/, "");
    
    if (rawUsername.includes("/")) {
      const parts = rawUsername.split("/").filter(Boolean);
      rawUsername = parts[parts.length - 1] || parts[parts.length - 2] || "createur";
    }
    
    if (rawUsername.startsWith("@")) {
      rawUsername = rawUsername.substring(1);
    }

    const cleanHandle = "@" + rawUsername;

    // Avatar & Label
    let avatarUrl = avatarUrlInput || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUsername)}&background=06b6d4&color=ffffff&bold=true&size=300&font-size=0.45`;
    let creatorFullName = rawUsername;

    // Network labels
    const networkNames: Record<string, string> = {
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      telegram: "Telegram",
      facebook: "Facebook",
    };
    const networkLabel = networkNames[currentNetwork] || "TikTok";

    // 2. Calculation of deterministic metrics
    const charCodeSum = cleanHandle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let followerCount = followerCountInput ? Number(followerCountInput) : (3500 + (charCodeSum * 43) % 24500);
    let followingCount = 120 + (charCodeSum * 9) % 380;
    let currentBioText = bioInput || `Créateur & Compte Officiel ${networkLabel} | ${cleanHandle}`;
    const aiScore = 74 + (charCodeSum % 20);

    // Fetch TikTok OEmbed if TikTok
    if (currentNetwork === "tiktok") {
      try {
        const tiktokRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${rawUsername}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (tiktokRes.ok) {
          const tiktokData = await tiktokRes.json();
          if (tiktokData && tiktokData.author_name) {
            creatorFullName = tiktokData.author_name;
            if (!bioInput) {
              currentBioText = `Profil Officiel TikTok de ${tiktokData.author_name} (@${rawUsername})`;
            }
          }
        }
      } catch (e) {
        console.log("TikTok fetch note:", e);
      }
    }

    const isTechNiche = /tech|iphone|android|hacks|app|digital/i.test(currentBioText + rawUsername);
    const isBusinessNiche = /business|ca|ventes|marketing|e-commerce|collab/i.test(currentBioText + rawUsername);

    let reportBioTemplates = [
      `🚀 Compte Officiel ${networkLabel} de ${creatorFullName}\n📊 Créateur de Contenu & Marque | ${cleanHandle}\n👇 Regardez nos offres et nouveautés :`,
      `💡 ${creatorFullName} | Astuces ${networkLabel} Exclusives 🌍\n🎬 Conseils pratiques pour booster vos résultats\n🔥 Abonnez-vous pour ne rien rater :`,
      `👑 ${creatorFullName} | Univers Pro & Contenu ${networkLabel}\n📦 Partenariats & Collabs\n📩 DM pour échanger :`,
    ];

    const bioDiagnostic = `Le profil ${networkLabel} ${cleanHandle} (${creatorFullName}) présente un fort potentiel, mais sa biographie et son appel à l'action (CTA) méritent d'être optimisés avec des mots-clés d'autorité.`;

    const reportData = {
      id: "rpt_" + Math.random().toString(36).substring(2, 9),
      handle: cleanHandle,
      username: rawUsername,
      creatorName: creatorFullName,
      avatarUrl,
      network: currentNetwork,
      followerCount,
      followingCount,
      score: aiScore,
      bioAudit: {
        currentBio: currentBioText,
        clarityScore: aiScore,
        diagnostic: bioDiagnostic,
        templates: reportBioTemplates,
      },
      videoHooks: [
        {
          id: 1,
          title: `Publication 1 (${cleanHandle}) : "${isTechNiche ? 'L\'astuce secrète sur votre téléphone' : 'Cette erreur qui ralentit votre croissance sur ' + networkLabel}"`,
          retention: 42,
          status: "À améliorer",
          flaw: `L'accroche visuelle manque d'un texte d'appel fort sur ${networkLabel}.`,
          script: `"Arrêtez de scroller ! Voici la méthode utilisée par ${cleanHandle}..."`,
        },
        {
          id: 2,
          title: `Publication 2 (${cleanHandle}) : "Format viral à fort taux d'engagement"`,
          retention: 86,
          status: "Excellente",
          flaw: `Excellente rétention. Le contenu capte immédiatement l'attention sur ${networkLabel}.`,
          script: `Structure idéale. Recommandation : Dupliquez ce format sur vos 5 prochaines publications.`,
        },
      ],
      growthPlan: {
        targetFollowers: followerCount + 5000,
        day1: `+ 1 500 Abonnés ciblés ${networkLabel} pour ${cleanHandle} + Boost d'interaction`,
        day2: `+ 2 000 Abonnés ${networkLabel} + Vues Virales`,
        day3: `+ 1 500 Abonnés ${networkLabel} + Stabilisation 90 jours`,
      },
      dmScript: `Salut ! Merci pour ton abonnement sur ${networkLabel} ${cleanHandle} 🚀\nRéponds 'OUI' et je t'envoie mon guide de croissance offert.`,
    };

    // Log in Supabase
    try {
      await supabase.from("analysis_reports").insert({
        profile_url: url,
        network: currentNetwork,
        score: reportData.score,
        summary: reportData.bioAudit.diagnostic,
        full_report: reportData,
        is_unlocked: false,
      });
    } catch (dbErr) {
      console.log("Supabase insert note :", dbErr);
    }

    return NextResponse.json({
      success: true,
      reportId: reportData.id,
      report: reportData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors de l'analyse : " + err.message }, { status: 500 });
  }
}
