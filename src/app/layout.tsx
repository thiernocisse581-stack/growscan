import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Growscan — Audit IA de Profil Social & Abonnés Instagram/TikTok/YouTube",
  description: "Outil SaaS d'analyse IA de profil social et panel de croissance d'abonnés pour Instagram, TikTok et YouTube avec paiement Mobile Money (Wave, Orange Money) et carte bancaire.",
  keywords: ["Abonnés Instagram", "Followers TikTok", "Vues YouTube", "Audit profil IA", "SMM Panel Afrique", "Wave Mobile Money", "Orange Money"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
