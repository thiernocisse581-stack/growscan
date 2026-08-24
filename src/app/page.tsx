"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Flame,
  Users,
  Eye,
  HelpCircle,
  ChevronDown,
  Star,
  Wallet,
  CreditCard,
  Smartphone,
  Lock,
  Calculator,
  Sliders,
  Check,
  Activity,
  Award,
  Globe,
} from "lucide-react";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  TelegramIcon,
  SnapchatIcon,
  DiscordIcon,
  TwitchIcon,
  PinterestIcon,
  SpotifyIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
} from "@/components/SocialIcons";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Calculator State
  const [calcNetwork, setCalcNetwork] = useState<"instagram" | "tiktok" | "youtube">("instagram");
  const [calcQuantity, setCalcQuantity] = useState<number>(5000);

  const pricePerThousand = {
    instagram: 1500, // 1500 FCFA per 1k followers
    tiktok: 1200,    // 1200 FCFA per 1k followers
    youtube: 3500,   // 3500 FCFA per 1k subscribers
  };

  const calculatedPrice = Math.round((calcQuantity / 1000) * pricePerThousand[calcNetwork]);

  // Live Orders Ticker Feed
  const [tickerIndex, setTickerIndex] = useState(0);
  const liveTickerOrders = [
    { name: "Mamadou K.", city: "Dakar 🇸🇳", service: "5 000 Abonnés Instagram HQ", time: "il y a 2 min" },
    { name: "Aïcha S.", city: "Abidjan 🇨🇮", service: "10 000 Vues TikTok ForYou", time: "il y a 4 min" },
    { name: "Ibrahima D.", city: "Bamako 🇲🇱", service: "1 000 Abonnés YouTube Monetisation", time: "il y a 7 min" },
    { name: "Fatou N.", city: "Saint-Louis 🇸🇳", service: "2 500 Likes Instagram", time: "il y a 11 min" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveTickerOrders.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveTickerOrders.length]);

  // Social Marquee Data Track 1
  const marqueeTrack1 = [
    { name: "Instagram", tag: "Abonnés & Likes", icon: InstagramIcon, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { name: "TikTok", tag: "Vues ForYou", icon: TikTokIcon, color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20" },
    { name: "YouTube", tag: "Abonnés & Vues", icon: YoutubeIcon, color: "text-red-400 bg-red-500/10 border-red-500/20" },
    { name: "Telegram", tag: "Membres & Vues", icon: TelegramIcon, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
    { name: "Snapchat", tag: "Abonnés & Vues", icon: SnapchatIcon, color: "text-amber-300 bg-amber-500/10 border-amber-500/20" },
    { name: "Spotify", tag: "Écoutes & Followers", icon: SpotifyIcon, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { name: "WhatsApp", tag: "Membres Canaux", icon: WhatsappIcon, color: "text-green-400 bg-green-500/10 border-green-500/20" },
    { name: "LinkedIn", tag: "Relations & Likes", icon: LinkedinIcon, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  ];

  // Social Marquee Data Track 2
  const marqueeTrack2 = [
    { name: "Twitter / X", tag: "Followers & Retweets", icon: TwitterIcon, color: "text-slate-200 bg-slate-800 border-slate-700" },
    { name: "Discord", tag: "Membres Serveur", icon: DiscordIcon, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { name: "Twitch", tag: "Followers & Vues", icon: TwitchIcon, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { name: "Pinterest", tag: "Followers & Enregistrements", icon: PinterestIcon, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { name: "Instagram", tag: "Reels & Vues", icon: InstagramIcon, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    { name: "TikTok", tag: "Partages & Vues", icon: TikTokIcon, color: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20" },
    { name: "YouTube", tag: "Heures de Visionnage", icon: YoutubeIcon, color: "text-red-400 bg-red-500/10 border-red-500/20" },
    { name: "Telegram", tag: "Vues de Canal", icon: TelegramIcon, color: "text-sky-400 bg-sky-500/10 border-sky-500/20" },
  ];

  const faqs = [
    {
      q: "Comment fonctionne l'analyse de profil par IA ?",
      a: "Notre outil d'analyse par IA est spécialement optimisé pour les comptes TikTok. Il scanne les métadonnées publiques de votre profil TikTok (bio, rétention des crochets vidéo ForYou) et génère un rapport chiffré sur-mesure. Pour le boosting d'abonnés, nos services SMM couvrent TikTok, Instagram, YouTube et Telegram.",
    },
    {
      q: "Est-ce sécurisé ? Dois-je donner mon mot de passe ?",
      a: "Non ! Jamais. Growscan n'a besoin d'aucun mot de passe ni accès privé. Nous utilisons uniquement des données publiques et des API sécurisées.",
    },
    {
      q: "Quels sont les moyens de paiement acceptés ?",
      a: "Vous pouvez recharger votre Wallet Growscan directement par Mobile Money (Wave, Orange Money, Free Money) ou par Carte Bancaire internationale (Visa / Mastercard).",
    },
    {
      q: "Combien de temps prend la livraison des abonnés ?",
      a: "Les commandes envoyées au panel usine SMM démarrant sous 1 à 15 minutes et sont livrées de manière naturelle avec un suivi en direct sur votre dashboard.",
    },
    {
      q: "Que se passe-t-il si mon solde Wallet est insuffisant ?",
      a: "Vous pouvez recharger instantanément votre Wallet par Wave ou Orange Money depuis votre Dashboard en indiquant le montant souhaité.",
    },
  ];

  const testimonials = [
    {
      name: "Ousmane Diallo",
      role: "Créateur de Contenu Tech",
      city: "Dakar, Sénégal",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      content: "Growscan a analysé ma bio Instagram en 10 secondes. Les recommandations de crochets vidéo ont augmenté mes vues de 300% en deux semaines !",
      rating: 5,
    },
    {
      name: "Aminata Traoré",
      role: "Fondatrice E-commerce Beauté",
      city: "Abidjan, Côte d'Ivoire",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      content: "Le boost d'abonnés SMM livré par Wave en 5 minutes a donné une crédibilité folle à ma boutique. Mes ventes de produits ont explosé !",
      rating: 5,
    },
    {
      name: "Cheikh Tidiane",
      role: "Influencer Lifestyle",
      city: "Thiès, Sénégal",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      content: "L'interface est hyper rapide sur mobile. La recharge Wave et le suivi de commande en direct sur le Dashboard font toute la différence.",
      rating: 5,
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Glow Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* LIVE TICKER NOTIFICATION POPUP */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:block max-w-xs pointer-events-none">
        <div className="glass-floating px-3.5 py-2.5 rounded-2xl flex items-center gap-3 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="font-extrabold text-white">{liveTickerOrders[tickerIndex].name}</span>{" "}
            <span className="text-slate-400">({liveTickerOrders[tickerIndex].city})</span>
            <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
              {liveTickerOrders[tickerIndex].service} • <span className="text-slate-400 font-normal">{liveTickerOrders[tickerIndex].time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION WITH MOBILE & DESKTOP FLOATING VISUAL BADGES */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* TOP RESPONSIVE BADGES BAR (Visible on Mobile & Tablet) */}
          <div className="flex xl:hidden items-center justify-center gap-2 flex-wrap mb-4">
            <div className="glass-floating px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-bold text-white border border-pink-500/30 shadow-lg">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Instagram</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">+5.4k</span>
            </div>

            <div className="glass-floating px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-bold text-white border border-cyan-500/30 shadow-lg">
              <TikTokIcon className="w-3.5 h-3.5 text-cyan-300" />
              <span>TikTok ForYou</span>
              <span className="text-[9px] text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded font-bold">+12.8k vues</span>
            </div>

            <div className="glass-floating px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-bold text-white border border-emerald-500/30 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span>Usine SMM</span>
              <span className="text-[9px] text-emerald-400 font-bold">Livraison 3 min</span>
            </div>
          </div>

          {/* DESKTOP WIDESCREEN OUTER MARGIN FLOATING BADGES (Positioned cleanly in wide margins outside text) */}
          <div className="hidden xl:block absolute top-0 -left-12 2xl:-left-20 animate-float pointer-events-none z-10 opacity-90">
            <div className="glass-floating px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-extrabold text-white border border-pink-500/30 shadow-2xl">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Instagram Growth</div>
                <div className="text-pink-300 font-bold">@babi_creator <span className="text-emerald-400 text-[10px]">+5.4k</span></div>
              </div>
            </div>
          </div>

          <div className="hidden xl:block absolute top-0 -right-12 2xl:-right-20 animate-float-slow pointer-events-none z-10 opacity-90">
            <div className="glass-floating px-4 py-3 rounded-2xl flex items-center gap-3 text-xs font-extrabold text-white border border-cyan-500/30 shadow-2xl">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <TikTokIcon className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-400">Algorithme TikTok</div>
                <div className="text-cyan-300 font-bold">Boost ForYou <span className="text-emerald-400 text-[10px]">+12.8k vues</span></div>
              </div>
            </div>
          </div>

          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-lg shadow-emerald-500/10 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>Logiciel SaaS d'Analyse IA & Croissance Sociale</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-[10px] font-bold uppercase text-emerald-300">
              v2.4 Pro
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Optimisez votre profil par <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">l'Intelligence Artificielle</span> & boostez vos abonnés.
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Obtenez une analyse IA gratuite de votre compte <span className="text-cyan-300 font-extrabold flex-inline items-center gap-1">TikTok 🎵</span>. Identifiez vos points faibles ForYou et boostez vos abonnés sur tous vos réseaux avec nos services SMM ultra-rapides.
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <Link
              href="/analyze"
              className="btn-shimmer w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              Analyser un Compte TikTok avec l'IA
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md backdrop-blur-md hover:scale-[1.01]"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              Booster mes Abonnés & Likes
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 text-slate-400 text-[11px] sm:text-xs mt-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sans mot de passe
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Analyse en 10s
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Confidentiel
            </span>
          </div>
        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="py-8 border-y border-slate-900 bg-slate-950/60 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">+120 000</div>
              <div className="text-xs text-slate-400">Profils scannés par IA</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">+1.8M</div>
              <div className="text-xs text-slate-400">Abonnés & Likes livrés</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">99.4%</div>
              <div className="text-xs text-slate-400">Taux de satisfaction client</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-teal-400">&lt; 3 min</div>
              <div className="text-xs text-slate-400">Délai moyen de livraison</div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: INFINITE SCROLLING SOCIAL MEDIA MARQUEE SECTION */}
      <section className="py-16 bg-slate-950/90 border-b border-slate-900 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" /> Compatibilité Universelle SMM
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Tous vos Réseaux Pris en Charge
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Générez des abonnés, des likes, des vues et du retentissement sur toutes les plus grandes plateformes du monde.
          </p>
        </div>

        {/* Marquee Track 1 (Right to Left) */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Gradient Side Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b0f19] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b0f19] to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee flex gap-4">
            {[...marqueeTrack1, ...marqueeTrack1, ...marqueeTrack1].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex items-center gap-3.5 shrink-0 hover:scale-105 group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marquee Track 2 (Left to Right) */}
        <div className="relative w-full overflow-hidden py-3 mt-3">
          {/* Gradient Side Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b0f19] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b0f19] to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee-reverse flex gap-4">
            {[...marqueeTrack2, ...marqueeTrack2, ...marqueeTrack2].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 shadow-xl flex items-center gap-3.5 shrink-0 hover:scale-105 group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{item.tag}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TWO PILLARS FEATURE CARDS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Audit IA */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Étape 1 — Diagnostic</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-3">Audit IA de Profil & Conversion</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              L'IA scanne la clarté de votre bio, votre positionnement et la puissance de vos 3 dernières accroches vidéo pour maximiser vos conversions.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Score d'optimisation global (0-100)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Réécriture instantanée de biographie
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Analyse de rétention des crochets vidéo
              </li>
            </ul>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all"
            >
              Tester mon profil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Panel SMM Abonnés */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 relative group overflow-hidden shadow-2xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Étape 2 — Accélération</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-3">Boost d'Abonnés & Visibilité</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Commandez des abonnés réels, des likes et des vues pour établir votre preuve sociale et débloquer les algorithmes d'Instagram, TikTok et YouTube.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Tarifs SMM direct usine (à partir de 200 FCFA)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Suivi en temps réel de votre commande
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Recharge de Wallet en Wave & Orange Money
              </li>
            </ul>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs border border-cyan-500/30 transition-all"
            >
              Booster mes Abonnés & Likes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PRICING CALCULATOR / SIMULATOR SECTION */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <Calculator className="w-4 h-4" /> Simulateur Rapide de Tarifs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Calculez le tarif de votre boost en FCFA</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Sélectionnez le réseau et la quantité pour obtenir le prix instantané.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCalcNetwork("instagram")}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 text-xs font-bold transition-all ${
                calcNetwork === "instagram"
                  ? "bg-pink-500/10 border-pink-500/40 text-pink-400 shadow-lg shadow-pink-500/10"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <InstagramIcon className="w-5 h-5" /> Instagram
            </button>
            <button
              onClick={() => setCalcNetwork("tiktok")}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 text-xs font-bold transition-all ${
                calcNetwork === "tiktok"
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <TikTokIcon className="w-5 h-5" /> TikTok
            </button>
            <button
              onClick={() => setCalcNetwork("youtube")}
              className={`p-4 rounded-2xl border flex items-center justify-center gap-3 text-xs font-bold transition-all ${
                calcNetwork === "youtube"
                  ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-lg shadow-red-500/10"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <YoutubeIcon className="w-5 h-5" /> YouTube
            </button>
          </div>

          {/* Slider */}
          <div className="space-y-4 bg-slate-950 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white">
              <span>Quantité souhaitée :</span>
              <span className="text-emerald-400 text-lg font-black">{calcQuantity.toLocaleString("fr-FR")} abonnés</span>
            </div>
            <input
              type="range"
              min={1000}
              max={50000}
              step={1000}
              value={calcQuantity}
              onChange={(e) => setCalcQuantity(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 000</span>
              <span>10 000</span>
              <span>25 000</span>
              <span>50 000</span>
            </div>
          </div>

          {/* Price Result Box */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 gap-4">
            <div>
              <div className="text-xs text-slate-400">Estimation du prix total</div>
              <div className="text-3xl font-black text-emerald-400">{calculatedPrice.toLocaleString("fr-FR")} FCFA</div>
            </div>
            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
            >
              Commandez maintenant <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DEMO PREVIEW & AUDIT REPORT CAROUSEL SHOWCASE */}
      <section className="py-16 bg-slate-950/80 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Aperçu en Direct</span>
            <h2 className="text-3xl font-extrabold text-white">Ce que notre IA révèle sur votre profil</h2>
            <p className="text-slate-400 text-sm">
              Chaque scan vous délivre un score de conversion chiffré et des recommandations concrètes à appliquer immédiatement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                  alt="Aperçu Profil"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
                />
                <div>
                  <h3 className="font-extrabold text-white text-lg">@babi_creator</h3>
                  <p className="text-xs text-slate-400">Instagram • 8 420 Abonnés</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Score de Conversion</span>
                  <span className="text-xl font-black text-emerald-400">74 / 100</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full w-[74%]" />
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Bio claire avec thématique identifiée, mais manque d'un appel à l'action direct (CTA).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>3 propositions de biographies captivantes générées sur-mesure.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Feuille de route d'injection d’abonnés SMM pour maximiser l’effet de preuve sociale.</span>
                </div>
              </div>

              <Link
                href="/analyze"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Lancer l'analyse de mon compte
              </Link>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Proposition Bio 1 (Générée par IA)</span>
                <p className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line">
                  {`🚀 J'aide les entrepreneurs africains à doubler leur CA via le digital.\n📊 +150 clients accompagnés | Dakar & Abidjan\n👇 Réservez votre audit gratuit ici :`}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Analyse Crochet Vidéo</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Saviez-vous que cette erreur détruit vos ventes ?" — <span className="text-rose-400 font-semibold">Intro trop lente (2.5s)</span>. Nouveau script suggéré : "Arrêtez de faire ça ! Voici les 3 erreurs exactes..."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS & REVIEWS SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Avis & Témoignages</span>
          <h2 className="text-3xl font-extrabold text-white">Adopté par les créateurs & marques en Afrique</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.rating)].map((_, r) => (
                  <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{item.content}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-emerald-500/30" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.role} • {item.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE MONEY & PAYMENT METHOD BANNER */}
      <section className="py-12 border-t border-slate-900 bg-slate-900/40 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Moyens de Paiement 100% Adaptés à l'Afrique</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Rechargez votre Wallet en toute sécurité</h2>
          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap pt-2">
            <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-md">
              <Smartphone className="w-4 h-4 text-cyan-400" /> Wave Mobile Money
            </div>
            <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-md">
              <Smartphone className="w-4 h-4 text-orange-400" /> Orange Money (OM)
            </div>
            <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-md">
              <CreditCard className="w-4 h-4 text-emerald-400" /> Carte Visa / Mastercard
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Foire Aux Questions</span>
          <h2 className="text-3xl font-extrabold text-white">Tout ce que vous devez savoir</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left font-bold text-sm text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
