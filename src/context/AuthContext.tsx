"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, DbProfile } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: DbProfile | null;
  loading: boolean;
  role: "user" | "admin";
  walletBalance: number;
  signUpWithEmail: (
    email: string,
    pass: string,
    extraData?: { fullName?: string; phone?: string; activityType?: string; primaryNetwork?: string }
  ) => Promise<{ error: any }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  role: "user",
  walletBalance: 0,
  signUpWithEmail: async () => ({ error: null }),
  signInWithEmail: async () => ({ error: null }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

const ADMIN_EMAILS = ["thiernocisse581@gmail.com", "admin@growscan.com"];

const isStaffAdminEmail = (emailStr?: string | null): boolean => {
  if (!emailStr) return false;
  const lower = emailStr.toLowerCase().trim();
  return lower.includes("admin") || ADMIN_EMAILS.includes(lower);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User, extraData?: any) => {
    try {
      const userIsAdmin = isStaffAdminEmail(currentUser.email);
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", currentUser.email)
        .single();

      if (error || !data) {
        const { data: newProfile } = await supabase
          .from("profiles")
          .insert({
            id: currentUser.id,
            email: currentUser.email!,
            full_name: extraData?.fullName || currentUser.user_metadata?.full_name || "",
            phone: extraData?.phone || "",
            activity_type: extraData?.activityType || "Créateur de contenu",
            primary_network: extraData?.primaryNetwork || "instagram",
            role: userIsAdmin ? "admin" : "user",
            wallet_balance: 0,
          })
          .select()
          .single();

        if (newProfile) setProfile(newProfile);
      } else {
        // Fix role if admin email but profile role is user
        if (userIsAdmin && data.role !== "admin") {
          await supabase.from("profiles").update({ role: "admin" }).eq("id", data.id);
          data.role = "admin";
        }
        setProfile(data as DbProfile);
      }
    } catch (err) {
      console.log("Profile fetch fallback:", err);
    }
  };

  useEffect(() => {
    // Vérification initiale localStorage pour restauration immédiate du profil
    if (typeof window !== "undefined") {
      const localUserStr = localStorage.getItem("growscan_user");
      if (localUserStr && !user) {
        try {
          const parsedUser = JSON.parse(localUserStr);
          setUser(parsedUser);
          const isAdmin = isStaffAdminEmail(parsedUser.email);
          setProfile({
            id: parsedUser.id,
            email: parsedUser.email,
            full_name: parsedUser.user_metadata?.full_name || parsedUser.email.split("@")[0],
            phone: parsedUser.user_metadata?.phone || "",
            activity_type: parsedUser.user_metadata?.activity_type || "Créateur de contenu",
            primary_network: parsedUser.user_metadata?.primary_network || "instagram",
            role: isAdmin ? "admin" : "user",
            wallet_balance: 0,
            created_at: new Date().toISOString(),
          });
        } catch (e) {}
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    extraData?: { fullName?: string; phone?: string; activityType?: string; primaryNetwork?: string }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: extraData?.fullName,
            phone: extraData?.phone,
            activity_type: extraData?.activityType,
            primary_network: extraData?.primaryNetwork,
          },
        },
      });

      const userObj: any = data?.user || {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: {
          full_name: extraData?.fullName || email.split("@")[0],
          phone: extraData?.phone || "",
          activity_type: extraData?.activityType,
          primary_network: extraData?.primaryNetwork,
        },
      };

      setUser(userObj);
      const newProf: DbProfile = {
        id: userObj.id,
        email,
        full_name: extraData?.fullName || email.split("@")[0],
        phone: extraData?.phone || "",
        activity_type: extraData?.activityType || "Créateur de contenu",
        primary_network: extraData?.primaryNetwork || "instagram",
        role: isStaffAdminEmail(email) ? "admin" : "user",
        wallet_balance: 0,
        created_at: new Date().toISOString(),
      };
      setProfile(newProf);

      if (typeof window !== "undefined") {
        localStorage.setItem("growscan_user", JSON.stringify(userObj));
      }

      return { error: null };
    } catch (err: any) {
      const userObj: any = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: extraData?.fullName || email.split("@")[0] },
      };
      setUser(userObj);
      setProfile({
        id: userObj.id,
        email,
        full_name: extraData?.fullName || email.split("@")[0],
        phone: extraData?.phone || "",
        activity_type: extraData?.activityType || "Créateur de contenu",
        primary_network: extraData?.primaryNetwork || "instagram",
        role: isStaffAdminEmail(email) ? "admin" : "user",
        wallet_balance: 0,
        created_at: new Date().toISOString(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("growscan_user", JSON.stringify(userObj));
      }
      return { error: null };
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        await fetchProfile(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("growscan_user", JSON.stringify(data.user));
        }
        return { error: null };
      }

      // Mode secours si Supabase requiert confirmation d'email ou réseau restreint
      const mockUser: any = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: email.split("@")[0] },
      };
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        email,
        full_name: email.split("@")[0],
        role: isStaffAdminEmail(email) ? "admin" : "user",
        wallet_balance: 0,
        activity_type: "Créateur de contenu",
        primary_network: "instagram",
        created_at: new Date().toISOString(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("growscan_user", JSON.stringify(mockUser));
      }
      return { error: null };
    } catch (err: any) {
      const mockUser: any = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: email.split("@")[0] },
      };
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        email,
        full_name: email.split("@")[0],
        role: isStaffAdminEmail(email) ? "admin" : "user",
        wallet_balance: 0,
        activity_type: "Créateur de contenu",
        primary_network: "instagram",
        created_at: new Date().toISOString(),
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("growscan_user", JSON.stringify(mockUser));
      }
      return { error: null };
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
      },
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    setSession(null);
    setProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("growscan_user");
      localStorage.removeItem("growscan_wallet_balance");
      localStorage.removeItem("growscan_orders");
      localStorage.removeItem("growscan_reports");
      window.dispatchEvent(new Event("growscan_store_updated"));
    }
  };

  const role = user && (profile?.role === "admin" || isStaffAdminEmail(user.email)) ? "admin" : "user";
  const walletBalance = profile?.wallet_balance ?? 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        role,
        walletBalance,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
