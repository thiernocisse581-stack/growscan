import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Global in-memory report store for high-speed fallback
const globalReportsCache = new Map<string, any>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID du rapport requis." }, { status: 400 });
  }

  // 1. Check in-memory cache
  if (globalReportsCache.has(id)) {
    return NextResponse.json({ success: true, report: globalReportsCache.get(id) });
  }

  // 2. Fetch from Supabase
  try {
    const { data, error } = await supabase
      .from("analysis_reports")
      .select("*")
      .or(`id.eq.${id},full_report->>id.eq.${id}`)
      .single();

    if (data && data.full_report) {
      globalReportsCache.set(id, data.full_report);
      return NextResponse.json({ success: true, report: data.full_report });
    }
  } catch (err) {
    console.log("Supabase fetch report note:", err);
  }

  return NextResponse.json({ error: "Rapport introuvable." }, { status: 404 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, followerCountInput, bioInput, avatarUrlInput } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Lien ou nom d'utilisateur TikTok requis." }, { status: 400 });
    }

    // 1. Clean username extraction (@pseudo)
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

    // Default Avatar & Author Name
    let avatarUrl = avatarUrlInput || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUsername)}&background=06b6d4&color=ffffff&bold=true&size=300&font-size=0.45`;
    let creatorFullName = rawUsername;

    // 2. Fetch TikTok OEmbed data directly from TikTok API
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
          if (tiktokData.thumbnail_url) {
            avatarUrl = tiktokData.thumbnail_url;
          }
        }
      }
    } catch (e) {
      console.log("TikTok OEmbed fetch note:", e);
    }

    // 3. Calculation of deterministic metrics for TikTok Account
    const charCodeSum = cleanHandle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let followerCount = followerCountInput ? Number(followerCountInput) : (4200 + (charCodeSum * 43) % 28500);
    let followingCount = 110 + (charCodeSum * 7) % 250;
    let currentBioText = bioInput || `Créateur TikTok Officiel | ${creatorFullName} (${cleanHandle})`;
    const aiScore = 76 + (charCodeSum % 18);

    const reportBioTemplates = [
      `🚀 Compte Officiel TikTok de ${creatorFullName}\n📊 Astuces, Tutos & Viralité | ${cleanHandle}\n👇 Découvrez notre nouveau contenu ForYou :`,
      `💡 ${creatorFullName} | Astuces TikTok Exclusives 🌍\n🎬 Conseils pratiques pour percer dans le flux ForYou\n🔥 Abonnez-vous pour ne rien rater :`,
      `👑 ${creatorFullName} | Créateur TikTok & Marque\n📦 Partenariats & Collabs Pro\n📩 DM pour réserver :`,
    ];

    const bioDiagnostic = `Le compte TikTok ${cleanHandle} (${creatorFullName}) dispose d'un fort potentiel visuel. Pour débloquer la diffusion ForYou, la biographie et la première phrase des vidéos doivent intégrer des mots-clés d'autorité.`;

    const reportId = "rpt_tt_" + Math.random().toString(36).substring(2, 9);

    const reportData = {
      id: reportId,
      handle: cleanHandle,
      username: rawUsername,
      creatorName: creatorFullName,
      avatarUrl,
      network: "tiktok",
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
          title: `Vidéo TikTok 1 (${cleanHandle}) : "Analyse du Crochet de 3 Secondes"`,
          retention: 38,
          status: "À optimiser",
          flaw: "L'accroche visuelle dans les 3 premières secondes manque d'un texte dynamique à l'écran.",
          script: `"Arrêtez de scroller ! Voici l'erreur que 90% des créateurs font sur TikTok..."`,
        },
        {
          id: 2,
          title: `Vidéo TikTok 2 (${cleanHandle}) : "Vidéo ForYou à Haut Taux de Complétion"`,
          retention: 84,
          status: "Excellente Rétention",
          flaw: "Excellente dynamique visuelle. Le temps de visionnage dépasse la moyenne de la niche.",
          script: "Format viral idéal. Recommandation : Produisez 3 déclinaisons de ce sujet cette semaine.",
        },
      ],
      growthPlan: {
        targetFollowers: followerCount < 1000 ? 1000 : followerCount + 5000,
        day1: `+ 1 000 Abonnés TikTok Fast (#10338) pour débloquer l'accès au Live TikTok`,
        day2: `+ 10 000 Vues ForYou TikTok (#8526) sur votre vidéo épinglée`,
        day3: `+ 2 500 Likes Engagés TikTok (#10337) pour stimuler l'algorithme`,
      },
      dmScript: `Salut ! Merci de suivre mon compte TikTok ${cleanHandle} 🚀\nDis-moi quel type de vidéo tu aimerais voir dans ma prochaine vidéo !`,
    };

    // Store in global memory cache
    globalReportsCache.set(reportId, reportData);

    // Save report in Supabase asynchronously
    try {
      await supabase.from("analysis_reports").insert({
        id: reportId,
        profile_url: url,
        network: "tiktok",
        score: reportData.score,
        summary: reportData.bioAudit.diagnostic,
        full_report: reportData,
        is_unlocked: false,
      });
    } catch (dbErr) {
      console.log("Supabase insert report note :", dbErr);
    }

    return NextResponse.json({
      success: true,
      reportId: reportData.id,
      report: reportData,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Erreur lors de l'analyse TikTok : " + err.message }, { status: 500 });
  }
}
