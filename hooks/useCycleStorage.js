import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { upsertProfile } from "@/lib/database";

const STORAGE_KEY = "@MenseCare_cycleData";

const DEFAULTS = {
  lastPeriodDate: null,
  cycleLength: 28,
  periodDuration: 5,
};

/**
 * Hybrid storage hook: reads from Supabase profile on login,
 * falls back to AsyncStorage, writes to both on update.
 */
export function useCycleStorage() {
  const { user, profile } = useAuth();
  const [cycleData, setCycleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadData();

    return () => {
      mounted.current = false;
    };
  }, [profile]);

  const loadData = async () => {
    try {
      // Priority 1: Supabase profile
      if (profile?.last_period_date) {
        const data = {
          lastPeriodDate: new Date(profile.last_period_date),
          cycleLength: profile.cycle_length ?? DEFAULTS.cycleLength,
          periodDuration: profile.period_duration ?? DEFAULTS.periodDuration,
        };
        if (mounted.current) setCycleData(data);

        // Sync to AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            lastPeriodDate: data.lastPeriodDate.toISOString(),
            cycleLength: data.cycleLength,
            periodDuration: data.periodDuration,
          })
        );
      } else {
        // Priority 2: AsyncStorage
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (mounted.current) {
            setCycleData({
              lastPeriodDate: new Date(parsed.lastPeriodDate),
              cycleLength: parsed.cycleLength ?? DEFAULTS.cycleLength,
              periodDuration: parsed.periodDuration ?? DEFAULTS.periodDuration,
            });
          }
        } else {
          // Priority 3: Defaults
          const fiveAgo = new Date();
          fiveAgo.setDate(fiveAgo.getDate() - 5);
          fiveAgo.setHours(0, 0, 0, 0);
          if (mounted.current) {
            setCycleData({ ...DEFAULTS, lastPeriodDate: fiveAgo });
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load cycle data:", e);
      const fiveAgo = new Date();
      fiveAgo.setDate(fiveAgo.getDate() - 5);
      fiveAgo.setHours(0, 0, 0, 0);
      if (mounted.current) {
        setCycleData({ ...DEFAULTS, lastPeriodDate: fiveAgo });
      }
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  const updateCycleData = useCallback(
    async (newData) => {
      setCycleData(newData);

      // Save to AsyncStorage (instant)
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            lastPeriodDate: newData.lastPeriodDate.toISOString(),
            cycleLength: newData.cycleLength,
            periodDuration: newData.periodDuration,
          })
        );
      } catch (e) {
        console.warn("AsyncStorage save failed:", e);
      }

      // Save to Supabase (async, non-blocking)
      if (user) {
        try {
          await upsertProfile(user.id, {
            last_period_date: newData.lastPeriodDate
              .toISOString()
              .split("T")[0],
            cycle_length: newData.cycleLength,
            period_duration: newData.periodDuration,
          });
        } catch (e) {
          console.warn("Supabase sync failed:", e);
        }
      }
    },
    [user]
  );

  return { cycleData, isLoading, updateCycleData };
}
