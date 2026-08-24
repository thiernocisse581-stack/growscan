"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Zap,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  Wallet,
  Info,
  Check,
  AlertCircle,
  PlusCircle,
  Search,
  Filter,
  Layers,
  Globe,
  Star,
  Shield,
  ThumbsUp,
  Users,
  Eye,
  LogIn,
  Lock,
  CreditCard,
  Smartphone,
  X,
  ExternalLink,
} from "lucide-react";
import {
  InstagramIcon,
  TikTokIcon,
  YoutubeIcon,
  TelegramIcon,
} from "@/components/SocialIcons";
import { getWalletBalance, deductWallet, addOrder } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

export interface SmmService {
  id: number;
  category: string;
  network: "instagram" | "tiktok" | "youtube" | "telegram" | "facebook";
  name: string;
  pricePer1000FCFA: number;
  costSupplierFCFA: number;
  min: number;
  max: number;
  startSpeed: string;
  speedPerDay: string;
  guarantee: string;
  badge?: string;
  description: string;
}

export const SMM_SERVICES_LIST: SmmService[] = [
  // 📸 INSTAGRAM SERVICES
  {
    id: 101,
    category: "📸 Instagram - Abonnés",
    network: "instagram",
    name: "Abonnés Instagram Haute Qualité [Garantie 30j - Départ Instantané]",
    pricePer1000FCFA: 1500,
    costSupplierFCFA: 487,
    min: 100,
    max: 50000,
    startSpeed: "Instantané (0 - 15 min)",
    speedPerDay: "5 000 à 10 000 / jour",
    guarantee: "Garantie 30 Jours (Auto-Refill)",
    badge: "🔥 Le Plus Populaire",
    description: "Abonnés internationaux haute qualité avec vraies photos de profil et activités réelles. Compte public exigé.",
  },
  {
    id: 102,
    category: "📸 Instagram - Abonnés",
    network: "instagram",
    name: "Abonnés Instagram Réels & Actifs [Zéro Perte - Garantie 90j]",
    pricePer1000FCFA: 2900,
    costSupplierFCFA: 780,
    min: 100,
    max: 30000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "2 000 / jour (Progression naturelle)",
    guarantee: "Garantie 90 Jours",
    badge: "👑 Qualité VIP",
    description: "Profils réels à forte valeur ajoutée. Idéal pour crédibiliser les marques, boutiques et créateurs.",
  },
  {
    id: 103,
    category: "📸 Instagram - Likes",
    network: "instagram",
    name: "Likes Instagram Express [Boost d'Engagement Instantané]",
    pricePer1000FCFA: 500,
    costSupplierFCFA: 97,
    min: 50,
    max: 100000,
    startSpeed: "Instantané (0 - 5 min)",
    speedPerDay: "50 000 / jour",
    guarantee: "Garantie 60 Jours",
    badge: "⚡ Ultra Rapide",
    description: "Boostez vos réels, photos et carrousels dès la publication pour stimuler le taux d'engagement.",
  },
  {
    id: 104,
    category: "📸 Instagram - Vues Réels",
    network: "instagram",
    name: "Vues Réels Instagram Virales [Algorithme Explorer]",
    pricePer1000FCFA: 300,
    costSupplierFCFA: 52,
    min: 500,
    max: 500000,
    startSpeed: "Instantané",
    speedPerDay: "200 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "🚀 Boost Viral",
    description: "Vues à haute rétention conçues pour envoyer des signaux positifs à l'algorithme Instagram.",
  },

  // 🎵 TIKTOK SERVICES
  {
    id: 201,
    category: "🎵 TikTok - Followers",
    network: "tiktok",
    name: "Followers TikTok Fast & Accès Live [Seuil 1k Réussi]",
    pricePer1000FCFA: 1800,
    costSupplierFCFA: 585,
    min: 100,
    max: 50000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 30 Jours",
    badge: "🔥 Spécial Live",
    description: "Atteignez le palier des 1 000 followers indispensable pour débloquer les Lives TikTok et la monétisation.",
  },
  {
    id: 202,
    category: "🎵 TikTok - Vues ForYou",
    network: "tiktok",
    name: "Vues TikTok ForYou Page [Déclencheur d'Algorithme]",
    pricePer1000FCFA: 200,
    costSupplierFCFA: 26,
    min: 1000,
    max: 1000000,
    startSpeed: "Instantané",
    speedPerDay: "500 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "⚡ 100% ForYou",
    description: "Relancez la diffusion d'une vidéo bloquée à 200 vues avec des impulsions de visionnage de qualité.",
  },
  {
    id: 203,
    category: "🎵 TikTok - Likes",
    network: "tiktok",
    name: "Likes TikTok Francophones & Engagés",
    pricePer1000FCFA: 800,
    costSupplierFCFA: 227,
    min: 100,
    max: 50000,
    startSpeed: "0 - 15 minutes",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 30 Jours",
    description: "Likes réels pour maximiser le ratio J'aime/Vues et booster votre crédibilité.",
  },
  {
    id: 204,
    category: "🎵 TikTok - Partages",
    network: "tiktok",
    name: "Partages & Favoris TikTok [Algorithme Puissant]",
    pricePer1000FCFA: 600,
    costSupplierFCFA: 130,
    min: 100,
    max: 50000,
    startSpeed: "Instantané",
    speedPerDay: "20 000 / jour",
    guarantee: "Garantie 60 Jours",
    badge: "📈 Score Virale",
    description: "Les partages et mises en favoris sont les signaux les plus puissants pour l'algorithme TikTok.",
  },

  // 📺 YOUTUBE SERVICES
  {
    id: 301,
    category: "📺 YouTube - Abonnés",
    network: "youtube",
    name: "Abonnés Chaines YouTube [Monétisation Ready - Stables]",
    pricePer1000FCFA: 4900,
    costSupplierFCFA: 2080,
    min: 50,
    max: 10000,
    startSpeed: "12 - 24 heures",
    speedPerDay: "300 / jour (Progression naturelle)",
    guarantee: "Garantie 90 Jours",
    badge: "👑 Monétisation",
    description: "Abonnés réels stables indispensables pour valider les conditions du Programme Partenaire YouTube.",
  },
  {
    id: 302,
    category: "📺 YouTube - Vues HD",
    network: "youtube",
    name: "Vues YouTube Haute Rétention (4 à 8 min)",
    pricePer1000FCFA: 2500,
    costSupplierFCFA: 910,
    min: 500,
    max: 100000,
    startSpeed: "2 - 6 heures",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "🎯 Rétention HD",
    description: "Génère des heures de visionnage effectives nécessaires pour débloquer la monétisation YouTube.",
  },
  {
    id: 303,
    category: "📺 YouTube - Likes",
    network: "youtube",
    name: "Likes Vidéos & Shorts YouTube Express",
    pricePer1000FCFA: 1200,
    costSupplierFCFA: 390,
    min: 100,
    max: 50000,
    startSpeed: "Instantané",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 60 Jours",
    description: "Augmente le CTR et le classement de vos vidéos dans les résultats de recherche YouTube.",
  },

  // 💬 TELEGRAM SERVICES
  {
    id: 401,
    category: "💬 Telegram - Membres",
    network: "telegram",
    name: "Membres Canal & Groupe Telegram Stables",
    pricePer1000FCFA: 1200,
    costSupplierFCFA: 422,
    min: 100,
    max: 50000,
    startSpeed: "0 - 30 min",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 30 Jours",
    badge: "🚀 Canal Pro",
    description: "Développez la notoriété de vos canaux de signaux, de crypto ou de vente sur Telegram.",
  },
  {
    id: 402,
    category: "💬 Telegram - Vues",
    network: "telegram",
    name: "Vues Auto sur les 5 Derniers Posts Telegram",
    pricePer1000FCFA: 400,
    costSupplierFCFA: 65,
    min: 500,
    max: 100000,
    startSpeed: "Instantané",
    speedPerDay: "50 000 / jour",
    guarantee: "Garantie 60 Jours",
    description: "Distribue automatiquement des vues de qualité sur vos 5 dernières publications.",
  },

  // 📘 FACEBOOK SERVICES
  {
    id: 501,
    category: "📘 Facebook - Followers",
    network: "facebook",
    name: "Followers Page & Profil Public Facebook",
    pricePer1000FCFA: 2200,
    costSupplierFCFA: 715,
    min: 100,
    max: 50000,
    startSpeed: "1 - 3 heures",
    speedPerDay: "2 000 / jour",
    guarantee: "Garantie 60 Jours",
    badge: "🏢 Entreprise",
    description: "Idéal pour crédibiliser votre page professionnelle ou entreprise sur Facebook.",
  },
  {
    id: 502,
    category: "📘 Facebook - Likes",
    network: "facebook",
    name: "Likes Publications & Photos Facebook",
    pricePer1000FCFA: 900,
    costSupplierFCFA: 260,
    min: 50,
    max: 50000,
    startSpeed: "Instantané",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 30 Jours",
    description: "Boostez l'interaction de vos annonces et contenus stratégiques sur Facebook.",
  },
];

export default function ServicesPage() {
  const { user, profile } = useAuth();

  const [activeNetwork, setActiveNetwork] = useState<"instagram" | "tiktok" | "youtube" | "telegram" | "facebook">("instagram");
  const [selectedService, setSelectedService] = useState<SmmService>(SMM_SERVICES_LIST[0]);
  const [quantity, setQuantity] = useState<number>(1000);
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>("");

  // Modal State for Direct One-Shot Checkout
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setWalletBalance(profile?.wallet_balance ?? getWalletBalance());
  }, [profile]);

  const handleNetworkChange = (net: "instagram" | "tiktok" | "youtube" | "telegram" | "facebook") => {
    setActiveNetwork(net);
    const first = SMM_SERVICES_LIST.find((s) => s.network === net);
    if (first) {
      setSelectedService(first);
      setQuantity(first.min < 1000 ? 1000 : first.min);
    }
  };

  const filteredServices = SMM_SERVICES_LIST.filter(
    (s) =>
      s.network === activeNetwork &&
      (s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        s.category.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const calculateTotalPrice = () => {
    if (!selectedService) return 0;
    return Math.round((quantity / 1000) * selectedService.pricePer1000FCFA);
  };

  // Open Checkout Modal or Process Order
  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!targetUrl || targetUrl.trim().length < 5) {
      setErrorMessage("Veuillez fournir un lien ou nom d'utilisateur valide.");
      return;
    }

    if (quantity < selectedService.min || quantity > selectedService.max) {
      setErrorMessage(
        `La quantité doit être comprise entre ${selectedService.min.toLocaleString("fr-FR")} et ${selectedService.max.toLocaleString("fr-FR")}.`
      );
      return;
    }

    setCheckoutModalOpen(true);
  };

  // Process Direct One-Shot Payment via PayTech (Wave / Orange Money)
  const handleDirectPayTechPayment = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const totalPrice = calculateTotalPrice();

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          paymentMethod: "PayTech",
          userId: user?.id || null,
          userEmail: user?.email || null,
          orderType: "smm_order",
          orderDetails: {
            serviceId: selectedService.id,
            network: selectedService.network,
            service_type: selectedService.name,
            target_url: targetUrl.trim(),
            quantity,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.redirectUrl) {
        // Direct redirect to PayTech (Wave / Orange Money / Card)
        window.location.href = data.redirectUrl;
      } else {
        setErrorMessage(data.error || "Impossible d'initialiser le paiement direct.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage("Erreur paiement direct : " + err.message);
      setIsSubmitting(false);
    }
  };

  // Process Wallet Payment (If balance is sufficient)
  const handleWalletPayment = async () => {
    const totalPrice = calculateTotalPrice();

    if (walletBalance < totalPrice) {
      setErrorMessage(
        `Solde Wallet insuffisant (${walletBalance.toLocaleString("fr-FR")} FCFA). Veuillez payer directement par Wave / Mobile Money.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: selectedService.network,
          service_type: selectedService.name,
          target_url: targetUrl.trim(),
          quantity,
          price: totalPrice,
          serviceId: selectedService.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        deductWallet(totalPrice);
        setWalletBalance((prev) => prev - totalPrice);
        addOrder({
          id: data.order?.id || `ord_${Math.floor(10000 + Math.random() * 90000)}`,
          network: selectedService.network,
          service_type: selectedService.name,
          target_url: targetUrl.trim(),
          quantity,
          price: totalPrice,
          panel_order_id: data.panelOrderId || `SMM-${Math.floor(10000 + Math.random() * 90000)}`,
          status: "processing",
          created_at: new Date().toLocaleDateString("fr-FR"),
        });

        setConfirmedOrderId(data.panelOrderId || "SMM-10942");
        setCheckoutModalOpen(false);
        setOrderSuccess(true);
      } else {
        setErrorMessage(data.error || "Impossible d'envoyer la commande.");
      }
    } catch (err: any) {
      setErrorMessage("Erreur serveur : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* HEADER PAGE */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-sm">
          <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" /> Usine SMM Directe & Paiement One-Shot Instantané
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Catalogue des Services <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">SMM GrowScan</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Sélectionnez votre réseau social, saisissez votre lien et payez directement par <strong>Wave, Orange Money, Mobile Money ou Carte</strong> pour lancer la livraison !
        </p>

        {/* User Wallet Bar */}
        <div className="inline-flex items-center justify-between gap-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Votre Solde Wallet</span>
              <strong className="text-lg font-black text-emerald-400">
                {walletBalance.toLocaleString("fr-FR")} FCFA
              </strong>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" /> Recharger
          </Link>
        </div>
      </div>

      {/* NETWORK FILTER TABS */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-3xl bg-slate-900/90 border border-slate-800 max-w-4xl mx-auto shadow-xl">
        {[
          { id: "instagram", name: "Instagram", icon: InstagramIcon, color: "from-pink-500 to-rose-600" },
          { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "from-cyan-400 to-teal-500" },
          { id: "youtube", name: "YouTube", icon: YoutubeIcon, color: "from-red-500 to-rose-700" },
          { id: "telegram", name: "Telegram", icon: TelegramIcon, color: "from-sky-400 to-blue-600" },
          { id: "facebook", name: "Facebook", icon: Globe, color: "from-blue-500 to-indigo-600" },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeNetwork === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNetworkChange(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all ${
                active
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-indigo-500/20 scale-105`
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* MAIN TWO COLUMNS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: SERVICES SELECTOR */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Offres Disponibles ({filteredServices.length})
            </h3>
            <div className="relative w-48 sm:w-64">
              <input
                type="text"
                placeholder="Filtrer une offre..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full px-3.5 py-1.5 pl-9 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredServices.map((service) => {
              const isSelected = selectedService.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service);
                    setQuantity(service.min < 1000 ? 1000 : service.min);
                  }}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative space-y-3 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {service.category}
                        </span>
                        {service.badge && (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{service.name}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-emerald-400 block">
                        {service.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">pour 1 000 unités</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{service.description}</p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" /> {service.startSpeed}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {service.guarantee}
                    </span>
                    <span className="font-mono text-slate-400 text-[10px]">
                      Min: {service.min.toLocaleString("fr-FR")} | Max: {service.max.toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredServices.length === 0 && (
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-slate-400">Aucun service trouvé pour cette recherche.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER CONFIGURATOR & PAYMENT */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Configurer la Commande</h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Exécution Usine Automatique</span>
              </div>
            </div>

            {orderSuccess ? (
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">Commande Confirmée !</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Votre commande a été transmise à l'usine avec succès.
                  </p>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-400 font-bold">
                    ID Suivi : {confirmedOrderId}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    Suivre sur mon Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      setTargetUrl("");
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                  >
                    Passer une autre commande
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOpenCheckout} className="space-y-5">
                {/* Selected Service Card Summary */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                    Service Sélectionné :
                  </span>
                  <p className="text-xs font-bold text-white leading-snug">{selectedService.name}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>Prix : {selectedService.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA / 1k</span>
                    <span className="text-indigo-400 font-semibold">{selectedService.guarantee}</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Target URL Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Lien ou Nom d'Utilisateur Cible *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.tiktok.com/@votre_compte ou @username"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Assurez-vous que le compte ou la vidéo est en mode public.
                  </span>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">
                      Quantité Souhaitée
                    </label>
                    <span className="text-slate-400 font-mono text-[11px]">
                      Min: {selectedService.min} | Max: {selectedService.max.toLocaleString("fr-FR")}
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    {[500, 1000, 2500, 5000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          quantity === preset
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {preset.toLocaleString("fr-FR")}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    min={selectedService.min}
                    max={selectedService.max}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Total Price Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Total à payer :</span>
                    <strong className="text-2xl font-black text-emerald-400">
                      {calculateTotalPrice().toLocaleString("fr-FR")} FCFA
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-900">
                    <span className="text-slate-400">Paiement Direct One-Shot :</span>
                    <span className="text-cyan-400 font-bold flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5" /> Wave / Mobile Money / Carte
                    </span>
                  </div>
                </div>

                {/* Main Action Button - Triggers Checkout Modal */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" /> Payer ({calculateTotalPrice().toLocaleString("fr-FR")} FCFA) & Lancer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* DIRECT ONE-SHOT PAYMENT CHOICE MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-6 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                ⚡ Paiement One-Shot Sans Rechargement
              </div>
              <h3 className="text-xl font-black text-white">Choisissez votre Mode de Paiement</h3>
              <p className="text-xs text-slate-400">
                Paiement direct de <strong className="text-emerald-400 font-bold">{calculateTotalPrice().toLocaleString("fr-FR")} FCFA</strong> pour la commande.
              </p>
            </div>

            {/* Order Brief */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-300 font-bold">
                <span className="truncate max-w-[200px]">{selectedService.name}</span>
                <span className="text-emerald-400 font-mono">{quantity.toLocaleString("fr-FR")} unités</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{targetUrl}</p>
            </div>

            {/* Payment Methods Choice */}
            <div className="space-y-3">
              {/* Option 1: Wave / Orange Money / PayTech (DIRECT REDIRECT) */}
              <button
                onClick={handleDirectPayTechPayment}
                disabled={isSubmitting}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 to-slate-900 border border-sky-500/40 hover:border-sky-400 text-left transition-all flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-black text-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-sky-300 transition-colors">
                      Wave / Orange Money / Free
                    </h4>
                    <span className="text-[10px] text-slate-400 block">Paiement Mobile Money Direct (PayTech)</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option 2: Mobile Money Afrique (Moneroo) */}
              <button
                onClick={handleDirectPayTechPayment}
                disabled={isSubmitting}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all flex items-center justify-between group shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors">
                      Carte Bancaire & Moneroo
                    </h4>
                    <span className="text-[10px] text-slate-400 block">Visa, Mastercard & Mobile Money XOF/XAF</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Option 3: Payer avec mon Solde Wallet (If available) */}
              {walletBalance >= calculateTotalPrice() && (
                <button
                  onClick={handleWalletPayment}
                  disabled={isSubmitting}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-sm">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white group-hover:text-indigo-300 transition-colors">
                        Payer avec mon Solde Wallet
                      </h4>
                      <span className="text-[10px] text-emerald-400 block">
                        Solde disponible: {walletBalance.toLocaleString("fr-FR")} FCFA
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </button>
              )}
            </div>

            {isSubmitting && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-cyan-400 font-semibold flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                Redirection vers la passerelle de paiement en cours...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
