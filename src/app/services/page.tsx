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
} from "lucide-react";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/SocialIcons";
import { getWalletBalance, deductWallet, addOrder, validateSocialUrl, topupWallet } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Lock } from "lucide-react";

interface SmmService {
  id: number;
  category: string;
  network: "instagram" | "tiktok" | "youtube";
  name: string;
  pricePer1000FCFA: number;
  pricePer1000EUR: number;
  min: number;
  max: number;
  startSpeed: string;
  speedPerDay: string;
  guarantee: string;
  description: string;
}

const SMM_SERVICES_LIST: SmmService[] = [
  // Instagram Services
  {
    id: 101,
    category: "Instagram - Abonnés",
    network: "instagram",
    name: "#101 - Abonnés Instagram HQ [Garantis 30j - Départ Instantané]",
    pricePer1000FCFA: 1500,
    pricePer1000EUR: 2.3,
    min: 100,
    max: 50000,
    startSpeed: "Instantané (0 - 15 min)",
    speedPerDay: "5 000 - 10 000 / jour",
    guarantee: "Garantie 30 Jours (Auto-Refill)",
    description: "Abonnés haute qualité avec photos de profil réelles et stories actives. Profil public exigé.",
  },
  {
    id: 102,
    category: "Instagram - Abonnés",
    network: "instagram",
    name: "#102 - Abonnés Instagram Réels Francophones [Garantis 60j]",
    pricePer1000FCFA: 3000,
    pricePer1000EUR: 4.5,
    min: 100,
    max: 20000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "2 000 / jour (Très naturel)",
    guarantee: "Garantie 60 Jours",
    description: "Abonnés ciblés avec forte activité en Afrique francophone & Europe. Idéal pour business.",
  },
  {
    id: 103,
    category: "Instagram - Likes",
    network: "instagram",
    name: "#103 - Likes Instagram Ultra-Rapides [Départ Instantané]",
    pricePer1000FCFA: 500,
    pricePer1000EUR: 0.8,
    min: 50,
    max: 100000,
    startSpeed: "Instantané",
    speedPerDay: "50 000 / jour",
    guarantee: "Garantie 60 Jours",
    description: "Boostez vos réels et carrousels instantanément dès la publication.",
  },
  {
    id: 104,
    category: "Instagram - Vues Réels",
    network: "instagram",
    name: "#104 - Vues Réels Instagram Virales [Algorithme Explorer]",
    pricePer1000FCFA: 300,
    pricePer1000EUR: 0.5,
    min: 500,
    max: 500000,
    startSpeed: "Instantané",
    speedPerDay: "200 000 / jour",
    guarantee: "Garantie 90 Jours",
    description: "Vues haute rétention conçues pour envoyer des signaux positifs à l'algorithme.",
  },

  // TikTok Services
  {
    id: 201,
    category: "TikTok - Followers",
    network: "tiktok",
    name: "#201 - Followers TikTok Fast & Live Ready [Départ 0-1h]",
    pricePer1000FCFA: 1800,
    pricePer1000EUR: 2.7,
    min: 100,
    max: 30000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 30 Jours",
    description: "Idéal pour débloquer l'accès aux Lives TikTok et au programme créateur.",
  },
  {
    id: 202,
    category: "TikTok - Vues ForYou",
    network: "tiktok",
    name: "#202 - Vues TikTok ForYou Page [Haute Rétention]",
    pricePer1000FCFA: 200,
    pricePer1000EUR: 0.3,
    min: 1000,
    max: 1000000,
    startSpeed: "Instantané",
    speedPerDay: "500 000 / jour",
    guarantee: "Garantie 90 Jours",
    description: "Relancez la diffusion d'une vidéo bloquée à 200 vues avec des impulsions ForYou.",
  },
  {
    id: 203,
    category: "TikTok - Likes",
    network: "tiktok",
    name: "#203 - Likes TikTok Francophones & Engagés",
    pricePer1000FCFA: 800,
    pricePer1000EUR: 1.2,
    min: 100,
    max: 50000,
    startSpeed: "0 - 15 minutes",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 30 Jours",
    description: "Augmente le ratio d'interaction pour propulser votre vidéo en tendance.",
  },

  // YouTube Services
  {
    id: 301,
    category: "YouTube - Abonnés",
    network: "youtube",
    name: "#301 - Abonnés YouTube Monétisation Ready [Stables 100%]",
    pricePer1000FCFA: 7500,
    pricePer1000EUR: 11.5,
    min: 50,
    max: 10000,
    startSpeed: "12 - 24 heures",
    speedPerDay: "200 - 500 / jour (Progression naturelle)",
    guarantee: "Garantie 60 Jours",
    description: "Abonnés stables conçus pour atteindre rapidement le palier de 1 000 abonnés.",
  },
  {
    id: 302,
    category: "YouTube - Vues",
    network: "youtube",
    name: "#302 - Vues YouTube Rétention Longue (4-8 min)",
    pricePer1000FCFA: 2500,
    pricePer1000EUR: 3.8,
    min: 500,
    max: 100000,
    startSpeed: "2 - 6 heures",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 90 Jours",
    description: "Génère des heures de visionnage effectives indispensables pour la monétisation.",
  },
];

export default function ServicesPage() {
  const { user, profile, loading: authLoading } = useAuth();

  const [activeNetworkFilter, setActiveNetworkFilter] = useState<"instagram" | "tiktok" | "youtube">("instagram");
  const [selectedCategory, setSelectedCategory] = useState<string>("Instagram - Abonnés");
  const [selectedServiceId, setSelectedServiceId] = useState<number>(101);
  const [quantity, setQuantity] = useState<number>(1000);
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("SMM-99824");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [topupModalOpen, setTopupModalOpen] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>("");

  useEffect(() => {
    setWalletBalance(profile?.wallet_balance ?? getWalletBalance());
  }, [profile]);

  const filteredServices = SMM_SERVICES_LIST.filter((s) => s.network === activeNetworkFilter);
  const categories = Array.from(new Set(filteredServices.map((s) => s.category)));
  const categoryServices = filteredServices.filter((s) => s.category === selectedCategory);
  const activeService = SMM_SERVICES_LIST.find((s) => s.id === selectedServiceId) || categoryServices[0] || filteredServices[0];

  const totalPriceFCFA = Math.round((quantity / 1000) * (activeService?.pricePer1000FCFA ?? 2500));
  const totalPriceEUR = ((quantity / 1000) * (activeService?.pricePer1000EUR ?? 3.8)).toFixed(2);

  const handleNetworkTabChange = (net: "instagram" | "tiktok" | "youtube") => {
    setActiveNetworkFilter(net);
    const firstNetService = SMM_SERVICES_LIST.find((s) => s.network === net);
    if (firstNetService) {
      setSelectedCategory(firstNetService.category);
      setSelectedServiceId(firstNetService.id);
      setQuantity(firstNetService.min > 1000 ? firstNetService.min : 1000);
      setErrorMessage(null);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const firstService = SMM_SERVICES_LIST.find((s) => s.category === cat);
    if (firstService) {
      setSelectedServiceId(firstService.id);
      setQuantity(firstService.min > 1000 ? firstService.min : 1000);
    }
  };

  const handleServiceSelect = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    const serv = SMM_SERVICES_LIST.find((s) => s.id === serviceId);
    if (serv && quantity < serv.min) {
      setQuantity(serv.min);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const validation = validateSocialUrl(targetUrl, activeService.network);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Lien cible invalide.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Direct 1-Shot Moneroo Mobile Money / Card Checkout
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPriceFCFA,
          paymentMethod: "Moneroo",
          orderType: "smm_order",
          userId: user?.id,
          userEmail: user?.email,
          orderDetails: {
            network: activeService.network,
            service_type: activeService.name,
            target_url: validation.formattedUrl,
            quantity,
            price: totalPriceFCFA,
            serviceId: activeService.id,
          },
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      } else {
        setErrorMessage(data.error || "Erreur lors de l'initialisation du paiement Moneroo.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage("Erreur serveur : " + err.message);
      setIsSubmitting(false);
    }
  };



  const tableServices = SMM_SERVICES_LIST.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase()) || s.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-emerald-400 text-sm font-bold gap-3">
        <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        Vérification de votre session en cours...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Connexion Obligatoire</h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Vous devez être connecté à votre compte pour accéder au catalogue et passer une commande d'abonnés SMM.
          </p>
        </div>
        <Link
          href="/login"
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <LogIn className="w-4 h-4" /> Se Connecter / S'inscrire
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <ShoppingBag className="w-3.5 h-3.5" /> Panel SMM Pro Direct Usine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Commander des Services SMM
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Sélectionnez la catégorie et le service dans le panneau ci-dessous, ajustez la quantité et lancez votre commande avec livraison instantanée.
        </p>
      </div>

      {/* MAIN SMM PANEL ORDER FORM (PRO SMM PANEL LAYOUT) */}
      <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg sm:text-xl">Passer une nouvelle commande</h2>
              <p className="text-slate-400 text-xs">Sélectionnez vos critères comme sur un panel SMM usine.</p>
            </div>
          </div>

          {/* Wallet Balance Pill */}
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Solde Wallet :</span>
            <span className="font-bold text-emerald-400">{walletBalance.toLocaleString("fr-FR")} FCFA</span>
          </div>
        </div>

        <form onSubmit={handleOrderSubmit} className="space-y-6">
          {/* Network Selection Tabs */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-400" /> 1. Choisissez le Réseau Social :
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleNetworkTabChange("instagram")}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 transition-all text-xs font-bold ${
                  activeNetworkFilter === "instagram"
                    ? "bg-pink-500/10 border-pink-500/50 text-white shadow-lg shadow-pink-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => handleNetworkTabChange("tiktok")}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 transition-all text-xs font-bold ${
                  activeNetworkFilter === "tiktok"
                    ? "bg-cyan-500/10 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <TikTokIcon className="w-4 h-4 text-cyan-300" />
                <span>TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => handleNetworkTabChange("youtube")}
                className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 transition-all text-xs font-bold ${
                  activeNetworkFilter === "youtube"
                    ? "bg-red-500/10 border-red-500/50 text-white shadow-lg shadow-red-500/10"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                <YoutubeIcon className="w-4 h-4 text-red-400" />
                <span>YouTube</span>
              </button>
            </div>
          </div>

          {/* Dropdown 1: Category Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> 2. Catégorie de service
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown 2: Specific Service Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" /> 3. Service précis
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceSelect(Number(e.target.value))}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              {categoryServices.map((serv) => (
                <option key={serv.id} value={serv.id} className="bg-slate-900 text-white">
                  {serv.name} — {serv.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA / 1 000 (~{serv.pricePer1000EUR}€)
                </option>
              ))}
            </select>
          </div>

          {/* Service Information Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Description & Fiche Technique du Service #{activeService?.id}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-bold">
                {activeService?.guarantee}
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-[11px]">{activeService?.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Vitesse départ</span>
                <span className="font-bold text-white">{activeService?.startSpeed}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Vitesse / jour</span>
                <span className="font-bold text-white">{activeService?.speedPerDay}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Min / Max</span>
                <span className="font-bold text-white">{activeService?.min.toLocaleString("fr-FR")} / {activeService?.max.toLocaleString("fr-FR")}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
                <span className="text-slate-500 block text-[10px]">Garantie Refill</span>
                <span className="font-bold text-emerald-400">100% Inclus</span>
              </div>
            </div>
          </div>

          {/* Input 4: Target URL / Link */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              4. Lien cible (URL du profil ou de la publication)
            </label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => {
                setTargetUrl(e.target.value);
                setErrorMessage(null);
              }}
              placeholder={`ex: https://${activeService?.network || 'instagram'}.com/votre_profil ou @pseudo`}
              className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-white text-sm placeholder-slate-500 focus:outline-none transition-all ${
                errorMessage ? "border-rose-500/80" : "border-slate-700 focus:border-emerald-500"
              }`}
            />
            {errorMessage && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errorMessage}
              </div>
            )}
          </div>

          {/* Input 5: Quantity + Range Slider + Quick Presets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="uppercase tracking-wider">5. Quantité désirée</span>
              <span className="text-emerald-400 text-sm font-black">{quantity.toLocaleString("fr-FR")} unités</span>
            </div>

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
              type="range"
              min={activeService.min}
              max={activeService.max > 20000 ? 20000 : activeService.max}
              step={100}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Realtime Price Calculation Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-slate-400 block text-[11px]">Tarif unitaire : {activeService.pricePer1000FCFA} FCFA / 1 000</span>
              <span className="text-slate-300 block">Quantité : <strong className="text-white">{quantity.toLocaleString("fr-FR")}</strong></span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-400 block">Montant Total :</span>
              <div className="text-emerald-400 text-2xl font-black">{totalPriceFCFA.toLocaleString("fr-FR")} FCFA</div>
              <div className="text-[10px] text-slate-400">(~{totalPriceEUR} € EUR)</div>
            </div>
          </div>

          {/* Action Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Initialisation du paiement PayTech...
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                Payer {totalPriceFCFA.toLocaleString("fr-FR")} FCFA via PayTech (Wave, OM, Free, Carte)
              </>
            )}
          </button>
        </form>
      </div>

      {/* FULL GENERAL PRICE LIST TABLE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-400" /> Liste Complète des Tarifs Usine SMM
            </h3>
            <p className="text-xs text-slate-400">Consultez tous nos prix et spécifications en un coup d'œil.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Rechercher un service..."
              className="w-full px-4 py-2 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Nom du Service</th>
                <th className="py-3.5 px-4 text-right">Prix / 1 000</th>
                <th className="py-3.5 px-4 text-center">Min / Max</th>
                <th className="py-3.5 px-4 text-center">Garantie</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tableServices.map((serv) => (
                <tr key={serv.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">#{serv.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-300">{serv.category}</td>
                  <td className="py-3.5 px-4 text-white font-medium max-w-xs">{serv.name}</td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-400">
                    {serv.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {serv.min} / {serv.max.toLocaleString("fr-FR")}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      {serv.guarantee}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedCategory(serv.category);
                        setSelectedServiceId(serv.id);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30 transition-all"
                    >
                      Commander
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* Success Feedback Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl max-w-md w-full text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Commande Transmise au Panel !</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Votre commande de <strong className="text-white">{quantity.toLocaleString("fr-FR")} {activeService.name}</strong> a été enregistrée avec succès dans la base de données.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Réf. commande panel :</span>
                <span className="font-mono text-emerald-400 font-bold">{confirmedOrderId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Statut :</span>
                <span className="text-cyan-400 font-bold">En traitement (processing)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Solde restant :</span>
                <span className="text-white font-bold">{walletBalance.toLocaleString("fr-FR")} FCFA</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/dashboard"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                Suivre sur mon Dashboard
              </Link>
              <button
                onClick={() => setOrderSuccess(false)}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                Passer une autre commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
