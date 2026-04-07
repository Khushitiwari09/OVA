import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import { getProfile, upsertProfile } from "@/lib/database";
import { supabase } from "@/lib/supabase";

const GUEST_PROFILE_KEY = "@MenseCare_guestProfile";

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isGuest: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  signInAsGuest: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // ── Check if Supabase is configured
  const supabaseConfigured =
    !!process.env.EXPO_PUBLIC_SUPABASE_URL &&
    process.env.EXPO_PUBLIC_SUPABASE_URL !== "https://YOUR_PROJECT_ID.supabase.co";

  // ── Load on mount
  useEffect(() => {
    loadInitialState();
  }, []);

  const loadInitialState = async () => {
    // Check for saved guest profile first
    try {
      const guestRaw = await AsyncStorage.getItem(GUEST_PROFILE_KEY);
      if (guestRaw) {
        const guestProfile = JSON.parse(guestRaw);
        setProfile(guestProfile);
        setUser({ id: "guest", email: "guest@local" });
        setSession({ guest: true });
        setIsGuest(true);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    // Try Supabase auth
    if (supabaseConfigured) {
      try {
        const { data: { session: s } } = await supabase.auth.getSession();
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await loadProfile(s.user.id);
        } else {
          setIsLoading(false);
        }

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, s) => {
            setSession(s);
            setUser(s?.user ?? null);
            if (s?.user) {
              loadProfile(s.user.id);
            } else {
              setProfile(null);
              setIsLoading(false);
            }
          }
        );

        return () => subscription.unsubscribe();
      } catch (e) {
        console.warn("Supabase auth init failed:", e);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const loadProfile = async (userId) => {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch (e) {
      console.warn("Failed to load profile:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInAsGuest = async () => {
    // Create a local guest session
    setUser({ id: "guest", email: "guest@local" });
    setSession({ guest: true });
    setIsGuest(true);
    // No profile yet → will navigate to intake
  };

  const signOut = async () => {
    if (isGuest) {
      await AsyncStorage.removeItem(GUEST_PROFILE_KEY);
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsGuest(false);
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (isGuest) return;
    if (user) {
      await loadProfile(user.id);
    }
  };

  const updateProfile = async (data) => {
    if (isGuest) {
      // Save guest profile to AsyncStorage
      const guestProfile = { ...profile, ...data, id: "guest" };
      setProfile(guestProfile);
      await AsyncStorage.setItem(
        GUEST_PROFILE_KEY,
        JSON.stringify(guestProfile)
      );
      return guestProfile;
    }

    if (!user) return;
    const updated = await upsertProfile(user.id, data);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isGuest,
        signUp,
        signIn,
        signOut,
        signInAsGuest,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
