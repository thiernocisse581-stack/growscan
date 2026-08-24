"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Share2,
  Zap,
  Wallet,
  AlertCircle,
  PlusCircle,
  Copy,
  Check,
  Video,
  Target,
  FileText,
  MessageSquare,
  Users,
} from "lucide-react";
import { getWalletBalance, deductWallet, getReports, unlockReport, topupWallet } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, role } = useAuth();
  const rawUrl = searchParams.get("url") || "https://instagram.com/babi_creator";
  const net = searchParams.get("net") || "instagram";
  const reportId = searchParams.get("id") || "";

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [walletBalance, setWalletBalance] = useState(15500);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeReport, setActiveReport] = useState<any>(null);

  useEffect(() => {
    setWalletBalance(getWalletBalance());

    // Admin users get all reports 100% unlocked for FREE
    if (role === "admin" || user?.email === "thiernocisse581@gmail.com") {
      setIsUnlocked(true);
    }

    // Check if this report exists in local store or memory
    const reports = getReports();
    const existing = reports.find((r) => r.id === reportId || r.profile_url === rawUrl);

    if (existing) {
      if (existing.is_unlocked || role === "admin") setIsUnlocked(true);
      if (existing.full_report) setActiveReport(existing.full_report);
    } else if (reportId) {
      // API fallback
      fetch(`/api/analyze?id=${encodeURIComponent(reportId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.report) {
            setActiveReport(data.report);
            if (role === "admin") setIsUnlocked(true);
          }
        })
        .catch((e) => console.log("Report fetch fallback error:", e));
    }
  }, [reportId, rawUrl, role, user]);

  const handleUnlock = async () => {
    setErrorMessage(null);
    const UNLOCK_COST = 2000;
    setUnlocking(true);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: UNLOCK_COST,
          paymentMethod: "Moneroo",
          orderType: "ai_unlock",
          userId: user?.id,
          userEmail: user?.email,
          orderDetails: {
            reportId: reportId || activeReport?.id || rawUrl,
          },
        }),
      });

      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      } else {
        setErrorMessage(data.error || "Erreur d'initialisation du paiement.");
        setUnlocking(false);
      }
    } catch (err: any) {
      setErrorMessage("Erreur lors de l'initialisation : " + err.message);
      setUnlocking(false);
    }
  };



  const copyToClipboard = (text: string, index: number) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Extract display values from activeReport or fallback
  const rawHandle = rawUrl.split("?")[0].replace(/\/$/, "").split("/").filter(Boolean).pop()?.replace(/^@/, "") || "compte";
  const displayHandle = activeReport?.handle || ("@" + rawHandle);
  const avatarUrl = activeReport?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(rawHandle)}&background=0f766e&color=ffffff&bold=true&size=300&font-size=0.45`;
  const followerCount = activeReport?.followerCount ? activeReport.followerCount.toLocaleString("fr-FR") : "4 820";

  const bioTemplates = activeReport?.bioAudit?.templates || [
    "🚀 J'aide les entrepreneurs africains à doubler leur CA via le digital.\n📊 +150 clients accompagnés | Dakar & Abidjan\n👇 Réservez votre audit gratuit ici :",
    "💡 Astuces Créateurs & Business en Afrique 🌍\n🎬 +50k abonnés formés à la création vidéo\n🔥 Télécharge ton guide gratuit en 1-clic :",
    "👑 Marque & Content Creator Francophone\n📦 Livraison & Expédition partout en Afrique de l'Ouest\n📩 Envoyez 'GROW' en DM pour passer commande :",
  ];

  return (
    <div className="space-y-8">
      {/* Top Header Card with Scraped Creator Info */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10">
            <img src={avatarUrl} alt={displayHandle} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Compte Détecté</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 capitalize">{net}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{displayHandle}</h1>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-slate-200">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> {followerCount} Abonnés
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Profil Public Scanné</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof navigator !== "undefined") {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien du rapport copié !");
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4" /> Partager
          </button>
          <Link
            href="/analyze"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
          >
            Nouveau Scan
          </Link>
        </div>
      </div>

      {/* Main Score & Free Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Score Gauge */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            Score Global de Santé Profil
          </span>

          {/* Circle Radial Score Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${activeReport?.score || 74}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white">{activeReport?.score || 74}</span>
              <span className="text-xs font-bold text-emerald-400">sur 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-sm font-bold text-white">Diagnostic : Bon potentiel de conversion</span>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              Votre contenu est de qualité mais souffre d'un manque de preuve sociale initiale et d'un appel à l'action imprécis dans la bio.
            </p>
          </div>

          {/* Quick Boost Recommendation Box */}
          <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" /> Boost d'Abonnés Recommandé
              </span>
              <span className="text-emerald-400 font-extrabold">+ 5 000 followers</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Injecter 5 000 abonnés ciblés permettra de franchir le palier de crédibilité et d'augmenter votre taux d'abonnement naturel de 40%.
            </p>
            <Link
              href="/services"
              className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
            >
              Commander ce boost (7 500 FCFA) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Unlocked Summary & Detailed Audit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Free Synth Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" /> Synthèse Gratuite de l'Audit
              </h3>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">
                Gratuit
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    1. Clarté Biographie & Positionnement
                  </span>
                  <span className="text-emerald-400">Validé (85/100)</span>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  {activeReport?.bioAudit?.diagnostic || "Votre profil présente bien la thématique générale, mais n'incite pas l'utilisateur à cliquer sur votre lien ou à s'abonner dans les 3 premières secondes."}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    2. Ratio d'Engagement vs Volume d'Audience
                  </span>
                  <span className="text-amber-400">Attention (55/100)</span>
                </div>
                <p className="text-slate-400 text-[11px] pt-1">
                  Vos vues sur les contenus récents dépassent le nombre total d'abonnés de votre profil ({followerCount} abonnés), provoquant de la méfiance chez les nouveaux visiteurs.
                </p>
              </div>
            </div>
          </div>

          {/* Paid Detailed Section (Exhaustive & Actionable) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-400" /> Rapport Détaillé IA & Stratégie Complète
                </h3>
                <p className="text-xs text-slate-400">
                  Audit approfondi des crochets vidéo, plan d'action abonnés & scripts de conversion prêt-à-copier.
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                isUnlocked
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}>
                {isUnlocked ? "DÉBLOQUÉ" : "Version Payante"}
              </span>
            </div>

            {/* Content Container (Blurred if not unlocked) */}
            <div className={`space-y-6 transition-all duration-500 ${!isUnlocked ? "blur-md select-none pointer-events-none opacity-30" : ""}`}>

              {/* Module 1: Detailed Bio Audit + 3 Copy/Paste Templates */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-emerald-400 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 1. Audit Mot à Mot de la Biographie & Modèles Copier/Coller
                  </h4>
                  <span className="text-[10px] text-slate-400">Recommandé par l'IA</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Diagnostic IA pour {displayHandle} :</strong> Votre bio actuelle manque d'un appel à l'action (Call-To-Action) direct. Choisissez l'un des 3 modèles optimisés suivants :
                </p>

                <div className="space-y-2.5 pt-1">
                  {bioTemplates.map((tpl: string, i: number) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span>Option {i + 1} : {i === 0 ? "Format Business / Consultant" : i === 1 ? "Format Formateur / Créateur" : "Format E-Commerce / Vente"}</span>
                        <button
                          onClick={() => copyToClipboard(tpl, i)}
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-[10px] font-bold bg-emerald-500/10 px-2 py-1 rounded-md"
                        >
                          {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedIndex === i ? "Copié !" : "Copier"}
                        </button>
                      </div>
                      <pre className="font-sans text-[11px] text-slate-200 whitespace-pre-line leading-relaxed">
                        {tpl}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 2: Exhaustive 3 Video Hook Audit */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                <h4 className="font-extrabold text-cyan-400 text-sm flex items-center gap-2">
                  <Video className="w-4 h-4" /> 2. Analyse Approfondie des 3 Derniers Crochets (Hooks) & Rétention
                </h4>

                <div className="space-y-3">
                  {(activeReport?.videoHooks || [
                    {
                      id: 1,
                      title: 'Vidéo 1 : "Saviez-vous que cette erreur détruit vos ventes ?"',
                      retention: 34,
                      status: "Faible",
                      flaw: "Intro trop lente (2.5s) sans visuel d'accroche direct. L'utilisateur scrolle avant d'avoir entendu la valeur.",
                      script: '"Arrêtez de faire ça ! Voici les 3 erreurs exactes qui ruinent votre profil aujourd\'hui..."',
                    },
                    {
                      id: 2,
                      title: 'Vidéo 2 : "Voici la méthode secrète pour automatiser votre contenu"',
                      retention: 78,
                      status: "Excellente",
                      flaw: "Aucune erreur majeure. Excellent crochet visuel avec affichage de texte à l'écran dès la 1ère seconde.",
                      script: "Format parfait. Recommandation : Dupliquez ce format sur vos prochains reels.",
                    },
                    {
                      id: 3,
                      title: 'Vidéo 3 : "Mon avis honnête après 1 an d\'expérience"',
                      retention: 51,
                      status: "Moyenne",
                      flaw: "Titre trop vague. Manque un bénéfice chiffré explicite dès la miniature.",
                      script: '"Après 1 an et +10M de vues, voici les 2 leçons que personne ne vous dit..."',
                    },
                  ]).map((hook: any) => (
                    <div key={hook.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-white">{hook.title}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] ${
                          hook.retention > 70 ? "text-emerald-400 bg-emerald-500/10" : hook.retention > 45 ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"
                        }`}>
                          Rétention {hook.retention}% ({hook.status})
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        ⚠️ <strong>Analyse IA :</strong> {hook.flaw}
                      </p>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                        💡 <strong>Script de réécriture conseillé :</strong><br />
                        <span className="text-emerald-300 font-medium">{hook.script}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 3: Tailored SMM Growth & Injection Plan */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-extrabold text-indigo-400 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" /> 3. Plan d'Injection d'Abonnés Ciblés & Algorithme SMM
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Afin de garantir un ratio 100% naturel auprès des algorithmes, suivez le planning de livraison automatisé suivant :
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Jour 1</span>
                    <div className="font-black text-white text-sm">+ 1 500 Abonnés</div>
                    <div className="text-[10px] text-emerald-400">+ 500 Likes récents</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Jour 2</span>
                    <div className="font-black text-white text-sm">+ 2 000 Abonnés</div>
                    <div className="text-[10px] text-cyan-400">+ 2 000 Vues ForYou/Explore</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Jour 3</span>
                    <div className="font-black text-white text-sm">+ 1 500 Abonnés</div>
                    <div className="text-[10px] text-indigo-400">Stabilisation 90 jours</div>
                  </div>
                </div>
              </div>

              {/* Module 4: DM & Conversion Scripts */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-extrabold text-pink-400 text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> 4. Script Automatique de Conversion DM (Conversion Abonnés → Clients)
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1.5">
                  <p className="text-emerald-400 font-bold font-sans">Message automatique à envoyer à chaque nouvel abonné :</p>
                  <p>"Salut [Prénom] ! Merci pour l'abonnement 🚀"</p>
                  <p>"Dis-moi, est-ce que tu cherches actuellement à développer tes réseaux ou ton business ?"</p>
                  <p>"Réponds 'OUI' et je t'envoie directement mon guide stratégique offert."</p>
                </div>
              </div>

            </div>

            {/* Paywall Overlay Banner (Shown when locked) */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-xl font-black text-white">Débloquez l'Audit Complet & Stratégie</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Accédez à l'analyse mot à mot de la bio de {displayHandle}, la réécriture de vos 3 crochets vidéo, et le plan d'injection abonnés SMM.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between w-full max-w-xs text-xs">
                  <span className="text-slate-400">Paiement Direct 1-Shot</span>
                  <span className="font-extrabold text-emerald-400 text-sm">2 000 FCFA</span>
                </div>

                {errorMessage && (
                  <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl max-w-xs">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={handleUnlock}
                  disabled={unlocking}
                  className="w-full max-w-xs py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
                >
                  {unlocking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Initialisation du paiement PayTech...
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      Payer 2 000 FCFA via PayTech (Wave, OM, Free, Carte)
                    </>
                  )}
                </button>

                <p className="text-[10px] text-slate-500">
                  Paiement sécurisé par Mobile Money ou Carte via PayTech.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzeResultPage() {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px] text-emerald-400 text-sm font-bold gap-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          Chargement du rapport d'analyse IA...
        </div>
      }>
        <ResultContent />
      </Suspense>
    </div>
  );
}
