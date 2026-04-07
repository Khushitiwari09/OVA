import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { OvaBackground } from "@/components/shared/OvaBackground";
import { OvaButton } from "@/components/shared/OvaButton";
import { FeminineIcon } from "@/components/icons/OvaIcons";
import { OvaDivider } from "@/components/shared/OvaDivider";
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInAsGuest } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e) {
      setError(e.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <OvaBackground variant="auth">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={styles.logoBubble}>
              <FeminineIcon size={36} color="#C9929B" />
            </View>
            <Text style={styles.appName}>OVA</Text>
            <Text style={styles.tagline}>Feminine Balance | Strength</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.cardSubtitle}>
              Sign in to access your cycle insights
            </Text>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <MaterialIcons name="mail-outline" size={18} color="#9A8A92" />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="#C4B8BE"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <MaterialIcons name="lock-outline" size={18} color="#9A8A92" />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#C4B8BE"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color="#9A8A92"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color="#C45A6E" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Login button */}
            <OvaButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              variant="primary"
              size="md"
              icon={
                !loading ? (
                  <MaterialIcons name="login" size={18} color="#FFFFFF" />
                ) : undefined
              }
            />

            {/* Divider */}
            <OvaDivider variant="dots" />

            {/* Google button */}
            <OvaButton
              title="Continue with Google"
              variant="soft"
              size="md"
              onPress={() => {}}
            />

            <View style={{ height: 12 }} />

            {/* Guest button */}
            <OvaButton
              title="Continue as Guest"
              variant="secondary"
              size="md"
              onPress={signInAsGuest}
              icon={
                <MaterialIcons name="person-outline" size={18} color="#5B4B54" />
              }
            />

            {/* Sign up link */}
            <Pressable
              onPress={() => router.push("/signup")}
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
              </Text>
              <Text style={styles.linkTextBold}>Sign Up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </OvaBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // Header
  header: { alignItems: "center", marginBottom: 32 },
  logoBubble: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: "rgba(201, 146, 155, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#D4879E",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  appName: {
    fontFamily: "Poppins_700Bold",
    fontSize: 38,
    color: "#4B3D45",
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
    marginTop: 4,
    letterSpacing: 1,
  },

  // Card
  card: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#8C748A",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 8,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#4B3D45",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
    marginBottom: 24,
    lineHeight: 20,
  },

  // Fields
  field: { marginBottom: 18 },
  label: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: "#6D5C65",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(253,245,247,0.8)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: "rgba(200,180,190,0.2)",
  },
  input: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: "#4B3D45",
  },

  // Error
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  errorText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#C45A6E",
  },

  // Link
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  linkText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#9A8A92",
  },
  linkTextBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 13,
    color: "#C9929B",
  },
});
