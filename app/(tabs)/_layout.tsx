import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#C9929B",
        tabBarInactiveTintColor: "#B8A0B0",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#FAF7F4",
          borderTopColor: "rgba(200,180,190,0.12)",
          borderTopWidth: 0.5,
          paddingTop: 4,
          elevation: 12,
          shadowColor: "#8C748A",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cycleTracker"
        options={{
          href: null,
          title: "Cycle Tracker",
        }}
      />
      <Tabs.Screen
        name="aiChat"
        options={{
          href: null,
          title: "Aira AI",
        }}
      />
      <Tabs.Screen
        name="moodTracker"
        options={{
          href: null,
          title: "Mood",
        }}
      />
      <Tabs.Screen
        name="bloodTracker"
        options={{
          href: null,
          title: "Blood Tracker",
        }}
      />
      <Tabs.Screen
        name="dietician"
        options={{
          href: null,
          title: "Dietician",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
