"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wallet,
  ShoppingBag,
  Sparkles,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  FileText,
  Lock,
  Unlock,
  CreditCard,
  LogIn,
  Shield,
  UserCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/SocialIcons";
import {
  getWalletBalance,
  topupWallet,
  getOrders,
  getReports,
  OrderItem,
  ReportItem,
} from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, profile, role, loading: authLoading } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [topupModalOpen, setTopupModalOpen] = useState<boolean>(false);
  const [selectedTopupAmount, setSelectedTopupAmount] = useState<number>(5000);
  const [selectedMethod, setSelectedMethod] = useState<string>("Wave");
  const [isTopupProcessing, setIsTopupProcessing] = useState<boolean>(false);
  const [isSyncingStatus, setIsSyncingStatus] = useState<boolean>(false);

  const pollSmmStatus = async () => {
    try {
      setIsSyncingStatus(true);
      await fetch("/api/smm/status", { method: "POST" });
      await loadData();
    } catch (err) {
      console.log("Status polling error:", err);
    } finally {
      setIsSyncingStatus(false);
    }
  };

  const loadData = async () => {
    setWalletBalance(profile?.wallet_balance ?? getWalletBalance());
    setOrders(getOrders());
    setReports(getReports());

    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success && Array.isArray(data.orders) && data.orders.length > 0) {
        const dbMapped: OrderItem[] = data.orders.map((o: any) => ({
          id: o.id || `ord_${Math.floor(1000 + Math.random() * 9000)}`,
          network: o.network || "instagram",
          service_type: o.service_type || "Service SMM",
          target_url: o.target_url || "https://instagram.com/compte",
          quantity: o.quantity || 1000,
          price: o.price || 1500,
          panel_order_id: o.panel_order_id || `SMM-${Math.floor(10000 + Math.random() * 90000)}`,
          status: o.status || "processing",
          created_at: o.created_at ? new Date(o.created_at).toLocaleDateString("fr-FR") : "Récemment",
        }));

        const local = getOrders();
        const existingIds = new Set(local.map((l) => l.id));
        const newFromDb = dbMapped.filter((d) => !existingIds.has(d.id));
        setOrders([...newFromDb, ...local]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadData();
    pollSmmStatus();

    // Auto poll every 30 seconds for live order updates
    const interval = setInterval(() => {
      pollSmmStatus();
    }, 30000);

    if (typeof window !== "undefined") {
      window.addEventListener("growscan_store_updated", loadData);
      return () => {
        clearInterval(interval);
        window.removeEventListener("growscan_store_updated", loadData);
      };
    }
  }, [profile]);

  const handleConfirmTopup = async () => {
    setIsTopupProcessing(true);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedTopupAmount,
          paymentMethod: selectedMethod,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();

      if (data.redirectUrl && data.redirectUrl !== `${window.location.origin}/dashboard?payment=success&amount=${selectedTopupAmount}`) {
        window.location.href = data.redirectUrl;
        return;
      }
    } catch (err) {}

    setTimeout(() => {
      topupWallet(selectedTopupAmount);
      setWalletBalance(getWalletBalance());
      setIsTopupProcessing(false);
      setTopupModalOpen(false);
    }, 800);
  };

  // Auth Guard view if not logged in
  if (!authLoading && !user) {
    return (
      <div className="py-20 max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Connexion Requise</h1>
          <p className="text-slate-400 text-xs leading-relaxed">
            Connectez-vous à votre compte Supabase pour accéder à votre tableau de bord et suivre vos commandes.
          </p>
        </div>
        <Link
          href="/login"
          className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <LogIn className="w-4 h-4" /> Se Connecter / S'inscrire
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Espace Client Supabase</span>
            {role === "admin" && (
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center gap-1 border border-indigo-500/30">
                <Shield className="w-3 h-3" /> Administrateur
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Tableau de Bord — <span className="text-slate-300 text-xl font-normal">{user?.email}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/analyze"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" /> Nouvel Audit IA
          </Link>
          <Link
            href="/services"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Passer une commande
          </Link>
        </div>
      </div>

      {/* METRICS & CARDS OVERVIEW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Quick SMM Boost */}
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Booster vos Réseaux
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Croissance Express</span>
            <div className="text-xl font-black text-white">Abonnés, Likes & Vues</div>
            <span className="text-[11px] text-slate-400 block pt-1">
              Instagram, TikTok & YouTube — Paiement Wave, OM, Free & Carte
            </span>
          </div>

          <Link
            href="/services"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingBag className="w-4 h-4" /> Accéder au Catalogue SMM <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              Historique
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Commandes SMM Effectuées</span>
            <div className="text-3xl font-black text-white">{orders.length}</div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Livraisons en cours & terminées
            </span>
          </div>

          <Link
            href="/services"
            className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            Nouvelle commande SMM <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Saved AI Reports */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Audits
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Rapports d'Analyse IA</span>
            <div className="text-3xl font-black text-white">{reports.length}</div>
            <span className="text-[11px] text-indigo-300 font-medium">
              Sauvegardés & consultables
            </span>
          </div>

          <Link
            href="/analyze"
            className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            Lancer un scan IA <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ORDERS HISTORY TABLE (SUPABASE SYNCED) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" /> Suivi des Commandes SMM
            </h2>
            <p className="text-xs text-slate-400">Mise à jour automatique synchronisée avec le Panel SMM usine.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={pollSmmStatus}
              disabled={isSyncingStatus}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingStatus ? "animate-spin" : ""}`} />
              {isSyncingStatus ? "Synchro..." : "Actualiser statuts"}
            </button>
            <Link
              href="/services"
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Passer une commande <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-slate-400 text-xs">Aucune commande enregistrée pour le moment.</p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              Commander maintenant
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Réf. Commande</th>
                  <th className="py-3.5 px-4">Réseau</th>
                  <th className="py-3.5 px-4">Service</th>
                  <th className="py-3.5 px-4">Lien Cible</th>
                  <th className="py-3.5 px-4 text-center">Quantité</th>
                  <th className="py-3.5 px-4 text-right">Prix</th>
                  <th className="py-3.5 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {ord.panel_order_id || ord.id}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300 capitalize flex items-center gap-1.5">
                      {ord.network === "instagram" && <InstagramIcon className="w-4 h-4 text-pink-400" />}
                      {ord.network === "tiktok" && <TikTokIcon className="w-4 h-4 text-cyan-300" />}
                      {ord.network === "youtube" && <YoutubeIcon className="w-4 h-4 text-red-400" />}
                      <span>{ord.network}</span>
                    </td>
                    <td className="py-3.5 px-4 text-white font-medium">{ord.service_type}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] max-w-xs truncate">
                      {ord.target_url}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-200 font-bold">
                      {ord.quantity.toLocaleString("fr-FR")}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-white">
                      {ord.price.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                        ord.status === "completed"
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                          : "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                      }`}>
                        {ord.status === "completed" ? "Terminé" : "En cours"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
