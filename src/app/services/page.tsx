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
  ShoppingCart,
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
    id: 10349,
    category: "📸 Instagram",
    network: "instagram",
    name: "Abonnés Instagram HQ",
    pricePer1000FCFA: 1500,
    costSupplierFCFA: 487,
    min: 100,
    max: 50000,
    startSpeed: "Instantané (0 - 15 min)",
    speedPerDay: "5 000 à 10 000 / jour",
    guarantee: "Garantie 30 Jours",
    badge: "🔥 Populaire",
    description: "Abonnés internationaux haute qualité avec photos de profil réelles.",
  },
  {
    id: 1810,
    category: "📸 Instagram",
    network: "instagram",
    name: "Abonnés Instagram VIP",
    pricePer1000FCFA: 2900,
    costSupplierFCFA: 780,
    min: 100,
    max: 30000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "2 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "👑 VIP",
    description: "Profils réels actifs à forte valeur ajoutée sans perte.",
  },
  {
    id: 1910,
    category: "📸 Instagram",
    network: "instagram",
    name: "Likes Instagram Express",
    pricePer1000FCFA: 500,
    costSupplierFCFA: 97,
    min: 50,
    max: 100000,
    startSpeed: "Instantané",
    speedPerDay: "50 000 / jour",
    guarantee: "Garantie 60 Jours",
    badge: "⚡ Rapide",
    description: "Boostez vos réels et carrousels dès la publication.",
  },
  {
    id: 5994,
    category: "📸 Instagram",
    network: "instagram",
    name: "Vues Réels Instagram",
    pricePer1000FCFA: 300,
    costSupplierFCFA: 52,
    min: 500,
    max: 500000,
    startSpeed: "Instantané",
    speedPerDay: "200 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "🚀 Explorer",
    description: "Vues à haute rétention conçues pour propulser vos réels.",
  },

  // 🎵 TIKTOK SERVICES
  {
    id: 10338,
    category: "🎵 TikTok",
    network: "tiktok",
    name: "Abonnés TikTok Fast",
    pricePer1000FCFA: 1800,
    costSupplierFCFA: 585,
    min: 100,
    max: 50000,
    startSpeed: "0 - 1 heure",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 30 Jours",
    badge: "🔥 Accès Live",
    description: "Atteignez le palier des 1 000 abonnés pour débloquer le Live TikTok.",
  },
  {
    id: 8526,
    category: "🎵 TikTok",
    network: "tiktok",
    name: "Vues TikTok ForYou",
    pricePer1000FCFA: 200,
    costSupplierFCFA: 26,
    min: 1000,
    max: 1000000,
    startSpeed: "Instantané",
    speedPerDay: "500 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "⚡ 100% ForYou",
    description: "Relancez la diffusion d'une vidéo bloquée à 200 vues.",
  },
  {
    id: 10337,
    category: "🎵 TikTok",
    network: "tiktok",
    name: "Likes TikTok Engagés",
    pricePer1000FCFA: 800,
    costSupplierFCFA: 227,
    min: 100,
    max: 50000,
    startSpeed: "0 - 15 minutes",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 30 Jours",
    description: "Likes réels pour maximiser le ratio d'interaction TikTok.",
  },

  // 📺 YOUTUBE SERVICES
  {
    id: 9533,
    category: "📺 YouTube",
    network: "youtube",
    name: "Abonnés YouTube Stables",
    pricePer1000FCFA: 4900,
    costSupplierFCFA: 2080,
    min: 50,
    max: 10000,
    startSpeed: "12 - 24 heures",
    speedPerDay: "300 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "👑 Monétisation",
    description: "Abonnés stables pour valider le Programme Partenaire YouTube.",
  },
  {
    id: 5971,
    category: "📺 YouTube",
    network: "youtube",
    name: "Vues YouTube HD Rétention",
    pricePer1000FCFA: 2500,
    costSupplierFCFA: 910,
    min: 500,
    max: 100000,
    startSpeed: "2 - 6 heures",
    speedPerDay: "5 000 / jour",
    guarantee: "Garantie 90 Jours",
    badge: "🎯 Rétention HD",
    description: "Génère des heures de visionnage effectives pour la monétisation.",
  },

  // 💬 TELEGRAM SERVICES
  {
    id: 7102,
    category: "💬 Telegram",
    network: "telegram",
    name: "Membres Canal Telegram",
    pricePer1000FCFA: 1200,
    costSupplierFCFA: 422,
    min: 100,
    max: 50000,
    startSpeed: "0 - 30 min",
    speedPerDay: "10 000 / jour",
    guarantee: "Garantie 30 Jours",
    badge: "🚀 Canal Pro",
    description: "Développez la crédibilité de vos canaux de vente sur Telegram.",
  },

  // 📘 FACEBOOK SERVICES
  {
    id: 7867,
    category: "📘 Facebook",
    network: "facebook",
    name: "Followers Page Facebook",
    pricePer1000FCFA: 2200,
    costSupplierFCFA: 715,
    min: 100,
    max: 50000,
    startSpeed: "1 - 3 heures",
    speedPerDay: "2 000 / jour",
    guarantee: "Garantie 60 Jours",
    badge: "🏢 Entreprise",
    description: "Idéal pour crédibiliser votre page professionnelle Facebook.",
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

  // Modal State for Configurator (Triggers when clicking any service card)
  const [configuratorOpen, setConfiguratorOpen] = useState<boolean>(false);
  // Modal State for Direct One-Shot Payment
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
        setConfiguratorOpen(false);
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

  const getNetworkIcon = (net: string) => {
    if (net === "tiktok") return TikTokIcon;
    if (net === "instagram") return InstagramIcon;
    if (net === "youtube") return YoutubeIcon;
    if (net === "telegram") return TelegramIcon;
    return Globe;
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* HEADER PAGE */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-sm">
          <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" /> Usine SMM Directe & Paiement Instantané
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Catalogue des Services <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">SMM GrowScan</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Parcourez nos offres ci-dessous. Cliquez sur n'importe quel pack pour ouvrir le configurateur et payer en 1 clic par <strong>Wave, Orange Money ou Carte</strong> !
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

      {/* FULL WIDTH SERVICES CARDS GRID */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Packs {activeNetwork.toUpperCase()} Disponibles ({filteredServices.length})
          </h3>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Filtrer une offre..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* FULL WIDTH RESPONSIVE GRID (3-4 COLUMNS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => {
            const isSelected = selectedService.id === service.id && configuratorOpen;
            const IconComp = getNetworkIcon(service.network);
            return (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setQuantity(service.min < 1000 ? 1000 : service.min);
                  setConfiguratorOpen(true);
                }}
                className={`p-6 rounded-3xl border transition-all cursor-pointer relative space-y-4 flex flex-col justify-between group ${
                  isSelected
                    ? "bg-slate-900 border-emerald-500 shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-500/40 scale-[1.02]"
                    : "bg-slate-900/80 border-slate-800/90 hover:bg-slate-900 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                <div className="space-y-3">
                  {/* Header: Icon Avatar + Title */}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl border p-0.5 shadow-sm shrink-0 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-300 group-hover:border-emerald-500/30"
                    }`}>
                      <IconComp className="w-6 h-6 text-emerald-400" />
                    </div>

                    <div className="space-y-0.5 overflow-hidden">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {service.badge && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-white truncate">{service.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Min: {service.min.toLocaleString("fr-FR")} • Max: {service.max.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>

                {/* Footer: Price Badge & Commander Action Button */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 inline-block">
                      {service.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA/1K
                    </span>
                  </div>

                  <button
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                        : "bg-slate-950 text-slate-300 border border-slate-800 group-hover:border-emerald-500/50 group-hover:text-emerald-400 group-hover:bg-emerald-500/10"
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Acheter
                  </button>
                </div>
              </div>
            );
          })}

          {filteredServices.length === 0 && (
            <div className="col-span-full p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-400">Aucun service trouvé pour cette recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* CONFIGURATEUR DE COMMANDE MODAL / DRAWER (Apparaît au clic sur un service) */}
      {configuratorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setConfiguratorOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Configurer la Commande</h3>
                <span className="text-xs text-emerald-400 font-semibold">Exécution Usine Directe</span>
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

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    Suivre sur mon Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      setOrderSuccess(false);
                      setConfiguratorOpen(false);
                      setTargetUrl("");
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOpenCheckout} className="space-y-5">
                {/* Selected Service Summary */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                    PACK SÉLECTIONNÉ :
                  </span>
                  <p className="text-base font-black text-white leading-snug">{selectedService.name}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-900">
                    <span>Tarif : {selectedService.pricePer1000FCFA.toLocaleString("fr-FR")} FCFA / 1K</span>
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
                    Étape 1 : Entrez votre Lien ou Nom d'utilisateur *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: https://www.tiktok.com/@votre_compte ou @pseudo"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Assurez-vous que votre compte ou vidéo est en mode public.
                  </span>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-300 uppercase tracking-wider">
                      Étape 2 : Quantité Souhaitée
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
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black"
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

                {/* Total Price Summary */}
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

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-4 h-4 fill-slate-950" /> Payer & Lancer la Livraison ({calculateTotalPrice().toLocaleString("fr-FR")} FCFA)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

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
                ⚡ Paiement One-Shot Instantané
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
              {/* Option 1: Wave / Orange Money / PayTech */}
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
