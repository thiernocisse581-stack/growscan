"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  ShoppingBag,
  LayoutDashboard,
  Wallet,
  Menu,
  X,
  TrendingUp,
  PlusCircle,
  Zap,
  LogIn,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import { getWalletBalance } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    setBalance(profile?.wallet_balance ?? getWalletBalance());

    const handleUpdate = () => {
      setBalance(profile?.wallet_balance ?? getWalletBalance());
    };

    window.addEventListener("growscan_store_updated", handleUpdate);
    return () => {
      window.removeEventListener("growscan_store_updated", handleUpdate);
    };
  }, [profile]);

  const navLinks = [
    { name: "Accueil", href: "/", icon: TrendingUp },
    { name: "Audit IA Gratuit", href: "/analyze", icon: Sparkles },
    { name: "Acheter Abonnés", href: "/services", icon: ShoppingBag },
    { name: "Mon Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ];

  if (user && role === "admin") {
    navLinks.push({ name: "Admin Portal", href: "/admin", icon: Shield });
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Grow<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Scan</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                IA & Growth Réseaux
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-white" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Auth Buttons / User Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[100px] truncate font-medium">{user.email?.split("@")[0]}</span>
                  {role === "admin" && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={() => signOut()}
                  title="Se Déconnecter"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Se Connecter
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold"
            >
              <Wallet className="w-3.5 h-3.5" />
              {(balance / 1000).toFixed(1)}k
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Menu Mobile"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-sm"
              >
                <LogOut className="w-4 h-4" /> Se Déconnecter ({user.email})
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm"
              >
                <LogIn className="w-4 h-4" /> Se Connecter / S'inscrire
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
