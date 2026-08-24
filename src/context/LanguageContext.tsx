"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageMode = "fr" | "en";

interface LanguageContextType {
  lang: LanguageMode;
  setLang: (lang: LanguageMode) => void;
  t: (key: string) => string;
}

const translations: Record<LanguageMode, Record<string, string>> = {
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_audit: "Audit IA Gratuit",
    nav_services: "Booster mes Abonnés",
    nav_dashboard: "Mon Dashboard",
    nav_login: "Se Connecter",
    nav_logout: "Déconnexion",
    wallet_balance: "Solde Wallet",

    // Homepage
    hero_badge: "Logiciel SaaS d'Analyse IA & Croissance Sociale",
    hero_title_1: "Multipliez vos Ventes & Abonnés avec",
    hero_title_2: "L'Intelligence Artificielle",
    hero_desc: "Scannez votre profil Instagram, TikTok ou YouTube, obtenez votre diagnostic d'optimisation IA et commandez des abonnés réels livrés en quelques minutes.",
    cta_analyze: "Analyser mon profil gratuitement",
    cta_boost: "Booster mes Abonnés & Likes",
    hero_trust_1: "Sans mot de passe",
    hero_trust_2: "Analyse en 10s",
    hero_trust_3: "100% Confidentiel",
    demo_badge: "Démo en Direct de l'Audit IA",
    demo_title: "Ce que notre IA révèle sur votre profil",
    feature_1_title: "1. Diagnostic IA Complet",
    feature_1_desc: "Analyse de votre biographie, de la clarté de votre positionnement et retours sur vos 3 derniers crochets vidéo.",
    feature_2_title: "2. Boost d'Abonnés & Likes",
    feature_2_desc: "Commandes direct usine livrées en quelques minutes pour déclencher l'algorithme d'Instagram, TikTok & YouTube.",

    // Auth & Guards
    auth_required_title: "Connexion Obligatoire",
    auth_required_desc: "Vous devez être connecté à votre compte pour accéder à cette fonctionnalité et suivre vos performances.",
    auth_btn_login: "Se Connecter / S'inscrire",
    login_title_login: "Connexion Espace Client",
    login_title_register: "Créer un Compte Growscan",
    login_google_btn: "Continuer avec Google OAuth",
    login_or_email: "ou avec vos informations",
    login_email_label: "Adresse Email",
    login_pass_label: "Mot de passe",
    login_fullname_label: "Nom Complet ou Marque",
    login_phone_label: "Téléphone / WhatsApp",
    login_activity_label: "Votre Activité Principale",
    login_network_label: "Réseau Social Prioritaire",

    // Dashboard
    dash_title: "Tableau de Bord",
    dash_wallet_title: "Solde Wallet Actuel",
    dash_orders_title: "Commandes SMM Effectuées",
    dash_reports_title: "Rapports d'Analyse IA",
    dash_topup_btn: "Recharger mon solde (Wave / OM)",
    dash_orders_history: "Suivi des Commandes SMM",
    dash_sync_btn: "Actualiser statuts",

    // Services
    services_title: "Catalogue de Services & Abonnés SMM",
    services_subtitle: "Sélectionnez le réseau et le service désiré pour stimuler l'algorithme social.",
    services_category_label: "1. Choisissez la catégorie de service :",
    services_url_label: "2. Lien du compte ou de la publication cible :",
    services_qty_label: "3. Quantité souhaitée :",
    services_order_btn: "Valider & Payer la Commande SMM",

    // Themes & General
    theme_dark: "Sombre",
    theme_light: "Clair",
    theme_system: "Système",
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_audit: "Free AI Audit",
    nav_services: "Boost Followers",
    nav_dashboard: "My Dashboard",
    nav_login: "Sign In",
    nav_logout: "Sign Out",
    wallet_balance: "Wallet Balance",

    // Homepage
    hero_badge: "SaaS AI Analysis & Social Growth Platform",
    hero_title_1: "Multiply your Sales & Followers with",
    hero_title_2: "Artificial Intelligence",
    hero_desc: "Scan your Instagram, TikTok, or YouTube profile, get your AI optimization audit, and order real followers delivered in minutes.",
    cta_analyze: "Analyze my profile for free",
    cta_boost: "Boost Followers & Likes",
    hero_trust_1: "No password required",
    hero_trust_2: "10s Instant Scan",
    hero_trust_3: "100% Confidential",
    demo_badge: "Live AI Audit Demo",
    demo_title: "What our AI reveals about your profile",
    feature_1_title: "1. Full AI Diagnostic",
    feature_1_desc: "Analysis of your bio, positioning clarity, and performance breakdown of your last 3 video hooks.",
    feature_2_title: "2. Followers & Likes Boost",
    feature_2_desc: "Direct factory orders delivered in minutes to trigger Instagram, TikTok & YouTube algorithms.",

    // Auth & Guards
    auth_required_title: "Authentication Required",
    auth_required_desc: "You must be signed in to your account to access this feature and track your performance.",
    auth_btn_login: "Sign In / Register",
    login_title_login: "Client Portal Login",
    login_title_register: "Create a Growscan Account",
    login_google_btn: "Continue with Google OAuth",
    login_or_email: "or with your credentials",
    login_email_label: "Email Address",
    login_pass_label: "Password",
    login_fullname_label: "Full Name or Brand Name",
    login_phone_label: "Phone / WhatsApp",
    login_activity_label: "Main Business Activity",
    login_network_label: "Primary Social Network",

    // Dashboard
    dash_title: "Dashboard",
    dash_wallet_title: "Current Wallet Balance",
    dash_orders_title: "Total SMM Orders",
    dash_reports_title: "Saved AI Reports",
    dash_topup_btn: "Top Up Wallet (Wave / Card)",
    dash_orders_history: "SMM Orders Tracking",
    dash_sync_btn: "Refresh status",

    // Services
    services_title: "SMM Followers & Growth Catalog",
    services_subtitle: "Select your social network and service to jumpstart your account growth.",
    services_category_label: "1. Choose service category:",
    services_url_label: "2. Target Account or Post URL:",
    services_qty_label: "3. Desired Quantity:",
    services_order_btn: "Confirm & Pay SMM Order",

    // Themes & General
    theme_dark: "Dark",
    theme_light: "Light",
    theme_system: "System",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LanguageMode>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("growscan_lang") as LanguageMode | null;
    if (saved) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: LanguageMode) => {
    setLangState(newLang);
    localStorage.setItem("growscan_lang", newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["fr"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
