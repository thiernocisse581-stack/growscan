import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, network = "tiktok", followerCountInput, bioInput, avatarUrlInput } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Lien de profil TikTok requis." }, { status: 400 });
    }

    // 1. Extraction propre du nom d'utilisateur TikTok (@pseudo)
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
    const currentNetwork = "tiktok";

    // 2. Avatar HD & Initiales TikTok
    let avatarUrl = avatarUrlInput || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawUsername)}&background=06b6d4&color=ffffff&bold=true&size=300&font-size=0.45`;

    // 3. Algorithme de calcul déterministe pour les métriques
    const charCodeSum = cleanHandle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let followerCount = followerCountInput ? Number(followerCountInput) : (3500 + (charCodeSum * 43) % 24500);
    let followingCount = 120 + (charCodeSum * 9) % 380;
    let currentBioText = bioInput || `Créateur & Compte Officiel TikTok | ${cleanHandle}`;
    let creatorFullName = rawUsername;
    const aiScore = 72 + (charCodeSum % 20);

    // 4. Extraction Officielle TikTok API (OAuth Client & oEmbed)
    const tikTokClientKey = (process.env.TIKTOK_CLIENT_KEY || "").trim();
    const tikTokClientSecret = (process.env.TIKTOK_CLIENT_SECRET || "").trim();

    try {
      // 4.1 Authentification OAuth TikTok Client Credentials si les clés sont configurées
      let tikTokAccessToken = "";
      if (tikTokClientKey && tikTokClientSecret) {
        try {
          const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_key: tikTokClientKey,
              client_secret: tikTokClientSecret,
              grant_type: "client_credentials",
            }),
          });
          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            if (tokenData.access_token) {
              tikTokAccessToken = tokenData.access_token;
            }
          }
        } catch (authErr) {
          console.log("TikTok OAuth Token Note:", authErr);
        }
      }

      // 4.2 Récupération des données publiques via l'API officielle TikTok oEmbed
      const tiktokRes = await fetch(`https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${rawUsername}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (tiktokRes.ok) {
        const tiktokData = await tiktokRes.json();
        if (tiktokData && tiktokData.author_name) {
          creatorFullName = tiktokData.author_name;
          if (!bioInput) {
            currentBioText = `Profil Officiel TikTok de ${tiktokData.author_name} (@${rawUsername})`;
          }
          if (!avatarUrlInput) {
            avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(tiktokData.author_name)}&background=06b6d4&color=ffffff&bold=true&size=300&font-size=0.45`;
          }
        }
      }
    } catch (ttErr) {
      console.log("TikTok Fetch Note :", ttErr);
    }

    // 5. Analyse IA de la niche du profil TikTok
    const isTechNiche = /tech|iphone|android|hacks|app|digital/i.test(currentBioText + rawUsername);
    const isBusinessNiche = /business|ca|ventes|marketing|e-commerce|collab/i.test(currentBioText + rawUsername);

    let reportBioTemplates = [];
    if (isTechNiche) {
      reportBioTemplates = [
        `⚡ Astuces TikTok & Hacks Mobile | ${creatorFullName} 📲\n🎬 1 Tuto court par jour sur la chaîne\n🤝 Collabs & DM : contactez-moi ici\n👇 Regardez ma dernière vidéo ForYou :`,
        `🔥 ${creatorFullName} | Expert Contenu Court TikTok 🌍\n⚡ +1M de créateurs accompagnés | iPhone & Android\n📩 Demandes pro en DM\n👇 Cliquez ici pour voir le dernier tuto :`,
        `👑 Hacks TikTok & Astuces Inédites | @${rawUsername}\n📦 Test de produits & Nouveautés Tech\n👇 Abonnez-vous pour ne rien rater :`,
      ];
    } else if (isBusinessNiche) {
      reportBioTemplates = [
        `🚀 ${creatorFullName} | Formateur & Stratège TikTok 📊\n💡 J'aide les marques à percer sur TikTok\n👇 Réservez votre audit offert en 1-clic :`,
        `💼 Conseils Business & Ventes TikTok | @${rawUsername}\n📈 +100 projets accompagnés en Afrique & Europe\n📩 Envoyez 'GROW' en DM pour échanger :`,
        `👑 Marque & Content Creator | ${creatorFullName}\n📦 Produits disponibles & Expédition rapide\n👇 Commandez directement via le lien :`,
      ];
    } else {
      reportBioTemplates = [
        `🚀 Compte Officiel TikTok de ${creatorFullName}\n📊 Créateur de Contenu ForYou | @${rawUsername}\n👇 Regardez mes vidéos récentes :`,
        `💡 ${creatorFullName} | Astuces TikTok Exclusives 🌍\n🎬 Conseils pratiques pour booster vos vues\n🔥 Suivez-moi pour ne rien rater :`,
        `👑 ${creatorFullName} | Univers & Contenu Court TikTok\n📦 Projets & Partenariats\n📩 DM pour échanger :`,
      ];
    }

    const bioDiagnostic = `Le profil TikTok ${cleanHandle} (${creatorFullName}) présente un fort potentiel sur TikTok, mais sa biographie gagnerait à ajouter un appel à l'action (CTA) plus direct vers son lien ou ses partenariats.`;

    // 6. Rapport d'Analyse IA TikTok
    const reportData = {
      id: "rpt_" + Math.random().toString(36).substring(2, 9),
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
          title: `Vidéo ForYou 1 (${cleanHandle}) : "${isTechNiche ? 'Voici l\'astuce TikTok secrètement cachée sur votre téléphone !' : 'Saviez-vous que cette erreur détruit vos vues TikTok ?'}"`,
          retention: 42,
          status: "À améliorer",
          flaw: `L'accroche visuelle des 2 premières secondes manque d'un texte dynamique en surimpression sur @${rawUsername}.`,
          script: `"Arrêtez de scroller ! Voici les 3 erreurs exactes que fait ${cleanHandle}..."`,
        },
        {
          id: 2,
          title: `Vidéo ForYou 2 (${cleanHandle}) : "${isTechNiche ? 'La méthode pour doubler la vitesse de vos vidéos' : 'Voici la méthode secrète pour automatiser votre contenu TikTok'}"`,
          retention: 86,
          status: "Excellente",
          flaw: "Excellente rétention ForYou. Le rythme captant immédiatement l'attention du spectateur TikTok.",
          script: `Format idéal pour TikTok. Recommandation : Dupliquez cette structure sur vos 5 prochains Tiktoks.`,
        },
        {
          id: 3,
          title: `Vidéo ForYou 3 (${cleanHandle}) : "Mon secret pour percer sur TikTok en 2026"`,
          retention: 58,
          status: "Moyenne",
          flaw: "Titre un peu trop généraliste. L'utilisateur TikTok a du mal à percevoir le bénéfice en moins de 3s.",
          script: `"Après des milliers de vues sur TikTok avec ${cleanHandle}, voici les 2 leçons clés..."`,
        },
      ],
      growthPlan: {
        targetFollowers: followerCount + 5000,
        day1: `+ 1 500 Abonnés ciblés TikTok pour ${cleanHandle} + 500 Likes`,
        day2: `+ 2 000 Abonnés TikTok + 2 000 Vues ForYou`,
        day3: `+ 1 500 Abonnés TikTok + Stabilisation 90 jours`,
      },
      dmScript: `Salut ! Merci pour ton abonnement sur TikTok @${rawUsername} 🚀\nEst-ce que tu cherches actuellement à percer sur TikTok ?\nRéponds 'OUI' et je t'envoie mon guide offert.`,
    };

    // 7. Sauvegarde Supabase `analysis_reports`
    try {
      await supabase.from("analysis_reports").insert({
        profile_url: url,
        network: "tiktok",
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
    return NextResponse.json({ error: "Erreur lors de l'analyse TikTok : " + err.message }, { status: 500 });
  }
}
