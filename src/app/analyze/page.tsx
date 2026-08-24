"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  Activity,
  Flame,
  Globe,
  LogIn,
} from "lucide-react";
import { TikTokIcon } from "@/components/SocialIcons";
import { addReport, validateSocialUrl } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AnalyzePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profileUrl, setProfileUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [followerCountInput, setFollowerCountInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const scanStepsMessages = [
    "Connexion aux serveurs API TikTok et vérification du profil...",
    "Audit IA de la biographie et de la clarté du positionnement TikTok...",
    "Analyse du taux de rétention ForYou et des crochets de contenu...",
    "Génération du score de santé et du plan de recommandation SMM TikTok...",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateSocialUrl(profileUrl, "tiktok");
    if (!validation.valid) {
      setErrorMessage(validation.error || "Format de lien TikTok invalide.");
      return;
    }

    setIsScanning(true);
    setScanStep(0);

    setTimeout(() => setScanStep(1), 700);
    setTimeout(() => setScanStep(2), 1400);
    setTimeout(() => setScanStep(3), 2100);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: validation.formattedUrl,
          network: "tiktok",
          followerCountInput: followerCountInput ? Number(followerCountInput) : undefined,
          bioInput: bioInput || undefined,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        if (data.success && data.report) {
          addReport({
            id: data.reportId,
            profile_url: validation.formattedUrl,
            network: "tiktok",
            score: data.report.score,
            summary: data.report.bioAudit.diagnostic,
            full_report: data.report,
            is_unlocked: false,
          });

          router.push(`/analyze/result?id=${data.reportId}`);
        } else {
          setErrorMessage(data.error || "Erreur lors de l'analyse du compte TikTok.");
          setIsScanning(false);
        }
      }, 2600);
    } catch (err: any) {
      setErrorMessage("Erreur serveur : " + err.message);
      setIsScanning(false);
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold shadow-sm">
          <TikTokIcon className="w-4 h-4 text-cyan-400" /> Audit IA Spécialisé TikTok & API Officielle
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Audit IA gratuit de votre <br />
          <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
            Compte TikTok & Diagnostic ForYou
          </span>
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Saisissez votre nom d'utilisateur ou lien <strong>TikTok (@pseudo ou tiktok.com/@votre_compte)</strong> pour obtenir une analyse algorithmique instantanée et débloquer votre potentiel de croissance !
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {!user && !authLoading && (
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Analyse TikTok gratuite sans inscription préalable !</span>
            </div>
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] shrink-0 transition-all"
            >
              Se connecter
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TikTok Search Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TikTokIcon className="w-4 h-4 text-cyan-400" />
              SAISISSEZ VOTRE LIEN OU @PSEUDO TIKTOK :
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isScanning}
                placeholder="ex: tiktok.com/@votre_compte ou @pseudo"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-950 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono transition-all disabled:opacity-50"
              />
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
            </div>
          </div>

          {/* Toggle Advanced Inputs */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              {showAdvanced ? "- Masquer les données précises" : "+ Ajouter des données précises (Optionnel)"}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Nombre d'abonnés actuel (Est.)</label>
                  <input
                    type="number"
                    placeholder="ex: 12500"
                    value={followerCountInput}
                    onChange={(e) => setFollowerCountInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Texte exact de votre bio TikTok</label>
                  <input
                    type="text"
                    placeholder="ex: Créateur Tech & Astuces TikTok..."
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Scanning Progress */}
          {isScanning ? (
            <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-cyan-400">
                  {scanStepsMessages[scanStep]}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${(scanStep + 1) * 25}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-slate-950" /> Lancer l'Audit IA Gratuit (TikTok)
            </button>
          )}
        </form>
      </div>

      {/* WHAT THE TIKTOK AI AUDIT ANALYZES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
            01
          </div>
          <h4 className="text-sm font-bold text-white">Score de Santé & Rétention</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Évaluation de la clarté de votre niche TikTok et du potentiel de viralité de vos vidéos dans le flux ForYou.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs">
            02
          </div>
          <h4 className="text-sm font-bold text-white">Optimisation Bio & Mots-Clés</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recommandations précises sur la rédaction de votre bio TikTok pour maximiser le taux de conversion visiteurs ➔ abonnés.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
            03
          </div>
          <h4 className="text-sm font-bold text-white">Plan SMM & Monétisation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Recommandation personnalisée de packs d'abonnés et de vues TikTok pour débloquer le Live et le Fonds Créateur.
          </p>
        </div>
      </div>
    </div>
  );
}
