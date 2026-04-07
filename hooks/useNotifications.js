import * as Notifications from "expo-notifications";
import { useCallback, useEffect } from "react";

import { getNextPeriodDate } from "@/utils/cycleCalculations";

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/**
 * Hook that schedules local cycle-related notifications.
 *
 * @param {Object} cycleData — { lastPeriodDate, cycleLength, periodDuration }
 */
export function useNotifications(cycleData) {
  useEffect(() => {
    if (cycleData) {
      scheduleCycleNotifications(cycleData);
    }
  }, [cycleData]);

  const scheduleCycleNotifications = useCallback(
    async (data) => {
      try {
        // Request permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        // Cancel all previous
        await Notifications.cancelAllScheduledNotificationsAsync();

        const nextPeriod = getNextPeriodDate(data);
        const now = new Date();

        // "Your cycle may start in 2 days"
        const twoDaysBefore = new Date(nextPeriod);
        twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
        twoDaysBefore.setHours(9, 0, 0, 0);

        if (twoDaysBefore > now) {
          const triggerSeconds = Math.floor(
            (twoDaysBefore.getTime() - now.getTime()) / 1000
          );
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "MenseCare 💕",
              body: "Your cycle may start in 2 days. Stay prepared and take care!",
            },
            trigger: { seconds: triggerSeconds },
          });
        }

        // "Your cycle may start tomorrow"
        const oneDayBefore = new Date(nextPeriod);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        oneDayBefore.setHours(9, 0, 0, 0);

        if (oneDayBefore > now) {
          const triggerSeconds = Math.floor(
            (oneDayBefore.getTime() - now.getTime()) / 1000
          );
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "MenseCare 💕",
              body: "Your period may start tomorrow. Remember to be gentle with yourself.",
            },
            trigger: { seconds: triggerSeconds },
          });
        }

        // Daily affirmation at 8 AM
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Good Morning! ✨",
            body: "You're doing great today. Take a moment to check in with yourself.",
          },
          trigger: {
            hour: 8,
            minute: 0,
            repeats: true,
          },
        });
      } catch (e) {
        console.warn("Notification scheduling failed:", e);
      }
    },
    []
  );
}
