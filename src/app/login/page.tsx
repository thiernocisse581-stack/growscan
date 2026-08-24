"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  User,
  Phone,
  Briefcase,
  Globe,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/SocialIcons";

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Enriched registration fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [activityType, setActivityType] = useState("Créateur de contenu / Influenceur");
  const [primaryNetwork, setPrimaryNetwork] = useState("instagram");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    if (mode === "login") {
      const { error } = await signInWithEmail(email, password);
      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message || "Identifiants invalides.");
      } else {
        router.push("/dashboard");
      }
    } else {
      const { error } = await signUpWithEmail(email, password, {
        fullName,
        phone,
        activityType,
        primaryNetwork,
      });
      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message || "Erreur lors de l'inscription.");
      } else {
        setSuccessMessage("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setMode("login");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMessage(error.message || "Erreur lors de la connexion Google.");
    }
  };

  return (
    <div className="py-12 max-w-lg mx-auto px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5" /> Authentification Supabase Pro
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          {mode === "login" ? "Connexion Espace Client" : "Créer un Compte Growscan"}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          {mode === "login"
            ? "Accédez à vos audits IA, suivez vos commandes SMM et gérez votre solde Wallet."
            : "Rejoignez Growscan et boostez votre présence sur les réseaux sociaux."}
        </p>
      </div>

      {/* Main Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xl">
        {/* Toggle Mode Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              mode === "login"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="w-4 h-4" /> Se Connecter
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              mode === "register"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4" /> S'inscrire
          </button>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-3 shadow-md transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continuer avec Google OAuth
        </button>

        <div className="flex items-center gap-3 my-4 text-xs text-slate-500">
          <div className="h-[1px] bg-slate-800 flex-1"></div>
          <span>ou avec vos informations</span>
          <div className="h-[1px] bg-slate-800 flex-1"></div>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMessage}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Enriched Registration Fields */}
          {mode === "register" && (
            <>
              {/* Full Name / Business Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Nom Complet ou Marque
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Abdoulaye Diallo ou Agence Digital Dakar"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Téléphone / WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ex: +221 77 000 00 00 (Pour notifications WhatsApp)"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Activity Type Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Votre Activité Principale
                </label>
                <div className="relative">
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="Créateur de contenu / Influenceur">Créateur de contenu / Influenceur</option>
                    <option value="Marque E-Commerce / Boutique">Marque E-Commerce / Boutique</option>
                    <option value="Agence Marketing / SMMA">Agence Marketing / SMMA</option>
                    <option value="Consultant / Formateur">Consultant / Formateur</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Primary Network Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">
                  Réseau Social Prioritaire
                </label>
                <div className="relative">
                  <select
                    value={primaryNetwork}
                    onChange={(e) => setPrimaryNetwork(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase">Adresse Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.nom@exemple.com"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase">Mot de passe</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (6 caractères minimum)"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75 mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                Traitement en cours...
              </>
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" /> Se Connecter à mon Espace
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Créer mon Compte & Accéder au Wallet
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
