"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  ShoppingBag,
  FileText,
  DollarSign,
  PlusCircle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Search,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Server,
  Zap,
  Sparkles,
  Key,
  Mail,
  UserCheck,
  Clock,
  ArrowDownRight,
  Database,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  activity_type: string;
  primary_network: string;
  role: string;
  wallet_balance: number;
  created_at: string;
};

type SmmOrder = {
  id: string;
  user_email: string;
  service_name: string;
  network: string;
  target_link: string;
  quantity: number;
  cost: number;
  status: string;
  smm_order_id: string;
  created_at: string;
};

type DbTx = {
  id: string;
  user_id?: string;
  type: string;
  amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type AdminStats = {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalReports: number;
};

export default function AdminDashboardPage() {
  const { user, role, loading: authLoading, signInWithEmail, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<"users" | "orders" | "transactions" | "system">("users");
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalReports: 0,
  });

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [ordersList, setOrdersList] = useState<SmmOrder[]>([]);
  const [txList, setTxList] = useState<DbTx[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Quick Admin Login State for thiernocisse581@gmail.com / Nasser2018
  const [adminEmailInput, setAdminEmailInput] = useState("thiernocisse581@gmail.com");
  const [adminPasswordInput, setAdminPasswordInput] = useState("Nasser2018");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Credit Wallet Modal state
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [creditAmount, setCreditAmount] = useState<number>(10000);
  const [creditAction, setCreditAction] = useState<"add" | "deduct">("add");
  const [isCrediting, setIsCrediting] = useState(false);
  const [creditMessage, setCreditMessage] = useState<string | null>(null);

  // Self promotion state
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoteMsg, setPromoteMsg] = useState<string | null>(null);

  // Seed DB / Setup Admin State
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoadingData(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setUsersList(data.users || []);
        setOrdersList(data.orders || []);
        setTxList(data.transactions || []);
      }
    } catch (err) {
      console.log("Erreur chargement admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user && role === "admin") {
      fetchAdminData();
    }
  }, [user, role]);

  // Handle direct login with pre-configured Admin credentials
  const handleQuickAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      
      // Ensure admin account exists/synced first
      await fetch("/api/admin/setup-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmailInput, password: adminPasswordInput }),
      });

      const { error } = await signInWithEmail(adminEmailInput, adminPasswordInput);
      if (error) {
        setLoginError(error.message || "Erreur d'authentification admin.");
      } else {
        await refreshProfile();
        fetchAdminData();
      }
    } catch (err: any) {
      setLoginError(err.message || "Erreur de connexion.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSeedAccount = async () => {
    try {
      setIsSeeding(true);
      setSeedStatus(null);
      const res = await fetch("/api/admin/setup-account");
      const data = await res.json();
      if (data.success) {
        setSeedStatus(`✅ Compte admin prêt: ${data.credentials.email}`);
        await refreshProfile();
        fetchAdminData();
      } else {
        setSeedStatus(`❌ ${data.error || "Erreur d'initialisation"}`);
      }
    } catch (err: any) {
      setSeedStatus(`❌ ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePromoteSelf = async () => {
    if (!user?.email) return;
    try {
      setIsPromoting(true);
      setPromoteMsg(null);
      const res = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.success) {
        setPromoteMsg("✅ Votre compte est désormais Administrateur !");
        await refreshProfile();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setPromoteMsg(`❌ ${data.error}`);
      }
    } catch (err: any) {
      setPromoteMsg(`❌ ${err.message}`);
    } finally {
      setIsPromoting(false);
    }
  };

  const handleCreditWallet = async () => {
    if (!selectedUser) return;
    try {
      setIsCrediting(true);
      setCreditMessage(null);
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: creditAmount,
          action: creditAction,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreditMessage(
          `✅ Solde ${creditAction === "add" ? "crédité" : "débité"} avec succès ! NOUVEAU SOLDE : ${data.profile?.wallet_balance?.toLocaleString("fr-FR")} FCFA`
        );
        await fetchAdminData();
        await refreshProfile();
        setTimeout(() => {
          setCreditModalOpen(false);
          setCreditMessage(null);
        }, 1800);
      } else {
        setCreditMessage(`❌ Erreur: ${data.error}`);
      }
    } catch (err: any) {
      setCreditMessage(`❌ Erreur serveur: ${err.message}`);
    } finally {
      setIsCrediting(false);
    }
  };

  // 1. Guard: Check if User is Admin or unauthenticated
  if (!authLoading && (!user || role !== "admin")) {
    return (
      <div className="py-12 max-w-xl mx-auto px-4 space-y-8">
        <div className="p-8 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl space-y-6 text-center backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-indigo-500/20 to-emerald-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
              <Key className="w-3.5 h-3.5" /> Portail d'Administration Sécurisé
            </div>
            <h1 className="text-2xl font-black text-white">Connexion Administrateur GrowScan</h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Saisissez les identifiants administrateur pour accéder à la console de gestion globale.
            </p>
          </div>

          {user && (
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-slate-400">Compte connecté :</span>
              <span className="font-bold text-white">{user.email}</span>
            </div>
          )}

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
              {loginError}
            </div>
          )}

          {seedStatus && (
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              {seedStatus}
            </div>
          )}

          {/* Quick Admin Auth Form */}
          <form onSubmit={handleQuickAdminLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                Email Administrateur
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  Authentification Admin en cours...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Se Connecter au Dashboard Admin (thiernocisse581@gmail.com)
                </>
              )}
            </button>
          </form>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
            {user ? (
              <button
                onClick={handlePromoteSelf}
                disabled={isPromoting}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <UserCheck className="w-4 h-4" /> Activer le Rôle Admin sur {user.email}
              </button>
            ) : (
              <button
                onClick={handleSeedAccount}
                disabled={isSeeding}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Database className="w-4 h-4" /> Initialiser les Accès Admin Supabase
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.activity_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = ordersList.filter(
    (o) =>
      o.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.target_link?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.smm_order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Administration Principale
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
              Compte : {user?.email}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            GrowScan Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-emerald-400" : ""}`} /> Actualiser
          </button>

          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            Espace Client <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Utilisateurs</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-md">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.totalUsers}</p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Comptes inscrits dans Supabase
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Chiffre d'Affaires</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.totalRevenue.toLocaleString("fr-FR")} <span className="text-sm font-normal text-slate-400">FCFA</span>
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Transactions validées
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Commandes SMM</span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.totalOrders}</p>
          <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Usine JustAnotherPanel / Peakerr
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Rapports d'Audit IA</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{stats.totalReports}</p>
          <span className="text-[11px] text-purple-400 font-semibold flex items-center gap-1">
            <Activity className="w-3 h-3" /> Audits de profils générés
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "users"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Users className="w-4 h-4" /> Utilisateurs ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "orders"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Commandes SMM ({ordersList.length})
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "transactions"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <DollarSign className="w-4 h-4" /> Transactions ({txList.length})
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "system"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Server className="w-4 h-4" /> Monitoring Connecteurs
        </button>
      </div>

      {/* TAB 1: USERS MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher par email, nom ou activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            <p className="text-xs text-slate-400">
              Affichage de <strong className="text-white">{filteredUsers.length}</strong> utilisateur(s)
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Utilisateur</th>
                    <th className="px-6 py-4">Activité</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4">Solde Wallet</th>
                    <th className="px-6 py-4 text-right">Actions Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 space-y-0.5">
                        <p className="font-bold text-white">{u.full_name || "Utilisateur Growscan"}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                        {u.phone && <p className="text-[10px] text-slate-500">{u.phone}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                          {u.activity_type || "Créateur de contenu"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === "admin" ? (
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-indigo-400" /> ADMIN
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-bold">
                            USER
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-emerald-400 text-sm">
                          {(u.wallet_balance || 0).toLocaleString("fr-FR")} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setCreditModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Gérer Solde
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL ORDERS MONITOR */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Filtrer par client, service ou ID usine..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
            <p className="text-xs text-slate-400">
              Total de <strong className="text-white">{filteredOrders.length}</strong> commande(s) SMM
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Service SMM Usine</th>
                    <th className="px-6 py-4">Quantité / Lien Cible</th>
                    <th className="px-6 py-4">Prix</th>
                    <th className="px-6 py-4">ID SMM Usine</th>
                    <th className="px-6 py-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{ord.user_email}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-200">{ord.service_name}</p>
                        <span className="text-[10px] text-emerald-400 uppercase font-bold">{ord.network}</span>
                      </td>
                      <td className="px-6 py-4 space-y-0.5">
                        <p className="font-bold text-white">{ord.quantity.toLocaleString("fr-FR")} unités</p>
                        <a
                          href={ord.target_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                        >
                          {ord.target_link} <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      </td>
                      <td className="px-6 py-4 font-black text-emerald-400">
                        {ord.cost.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-indigo-400 font-bold">{ord.smm_order_id || "Mock #10842"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          {ord.status || "En cours d'exécution"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        Aucune commande SMM enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-extrabold border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4">ID Transaction</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Montant</th>
                    <th className="px-6 py-4">Méthode de Paiement</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {txList.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-400">{tx.id.substring(0, 13)}...</td>
                      <td className="px-6 py-4 uppercase font-bold text-slate-300">{tx.type}</td>
                      <td className="px-6 py-4 font-black text-emerald-400">
                        {tx.amount.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-300">{tx.payment_method}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[11px]">
                        {new Date(tx.created_at).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                  {txList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        Aucune transaction enregistrée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM MONITORING & CONNECTORS */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-400" /> Passerelles & Connecteurs API
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Fournisseur Usine SMM (JustAnotherPanel)</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connecté (API v2)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Agrégateur Moneroo (Mobile Money + Carte)</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Actif (XOF/XAF)
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Passerelle Stripe Checkout</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Actif
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Passerelle PayTech Senegal</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Actif (Wave / OM)
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" /> Infrastructure IA & Base de Données
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Supabase DB & Auth RLS</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  En Ligne
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Moteurs IA (OpenAI / Gemini)</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  Opérationnel
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREDIT WALLET */}
      {creditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white">Ajuster le Solde Wallet</h3>
              <p className="text-xs text-slate-400">
                Pour l'utilisateur : <strong className="text-emerald-400">{selectedUser.email}</strong>
              </p>
            </div>

            {creditMessage && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-center text-slate-200">
                {creditMessage}
              </div>
            )}

            {/* Action Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setCreditAction("add")}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  creditAction === "add"
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" /> Créditer (Ajouter)
              </button>
              <button
                type="button"
                onClick={() => setCreditAction("deduct")}
                className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  creditAction === "deduct"
                    ? "bg-rose-500 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5" /> Débiter (Déduire)
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase">
                Montant à {creditAction === "add" ? "ajouter" : "déduire"} (FCFA)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5000, 10000, 25000, 50000, 100000, 250000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCreditAmount(amt)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      creditAmount === amt
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {amt.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
                placeholder="Montant personnalisé..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs mt-2 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCreditModalOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleCreditWallet}
                disabled={isCrediting}
                className="w-1/2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isCrediting ? "Traitement..." : "Valider l'Opération"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
