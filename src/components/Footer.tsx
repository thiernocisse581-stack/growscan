import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { InstagramIcon, TikTokIcon, YoutubeIcon } from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Grow<span className="text-emerald-400">Scan</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-xs">
              La plateforme tout-en-un de croissance réseaux sociaux boostée par l'Intelligence Artificielle. Audit stratégique & livraison d'abonnés instantanée.
            </p>
            <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Optimisé pour l'Afrique francophone & International
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Audit IA Gratuit
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-emerald-400 transition-colors">
                  Catalogue Abonnés SMM
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Supported Networks */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Réseaux pris en charge</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
                Instagram (Abonnés, Likes, Vues)
              </li>
              <li className="flex items-center gap-2">
                <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
                TikTok (Followers, Vues, Vitesse)
              </li>
              <li className="flex items-center gap-2">
                <YoutubeIcon className="w-3.5 h-3.5 text-red-500" />
                YouTube (Abonnés, Vues, Heures)
              </li>
            </ul>
          </div>

          {/* Mobile Money & Payments */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Paiements Sécurisés</h4>
            <p className="text-slate-400 text-xs">
              Rechargez votre Wallet instantanément via vos moyens de paiement locaux préférés :
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-300 font-bold text-[11px]">
                Wave
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-orange-950/80 border border-orange-800/60 text-orange-400 font-bold text-[11px]">
                Orange Money
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-yellow-950/80 border border-yellow-800/60 text-yellow-400 font-bold text-[11px]">
                MTN / Moov
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-bold text-[11px]">
                Stripe / CB
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Garantie de rechargement sécurisé à 100%
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} GrowScan SaaS. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Conditions Générales (CGU/CGV)
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Politique de Confidentialité
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Support API SMM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
