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
import { OvaDivider } from "@/components/shared/OvaDivider";
import { useAuth } from "@/context/AuthContext";

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await signUp(email.trim(), password);
    } catch (e) {
      setError(e.message || "Sign up failed. Please try again.");
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
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <MaterialIcons name="arrow-back-ios" size={18} color="#7A6170" />
            </Pressable>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Let's begin your wellness journey
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
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
                  placeholder="Min 6 characters"
                  placeholderTextColor="#C4B8BE"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputRow}>
                <MaterialIcons name="lock-outline" size={18} color="#9A8A92" />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor="#C4B8BE"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorRow}>
                <MaterialIcons name="error-outline" size={14} color="#C45A6E" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <OvaButton
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              variant="primary"
              size="md"
              icon={
                !loading ? (
                  <MaterialIcons name="person-add" size={18} color="#FFFFFF" />
                ) : undefined
              }
            />

            <OvaDivider variant="dots" />

            <Pressable
              onPress={() => router.back()}
              style={styles.linkRow}
            >
              <Text style={styles.linkText}>Already have an account? </Text>
              <Text style={styles.linkTextBold}>Sign In</Text>
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
  header: { marginBottom: 16 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  titleSection: { marginBottom: 24 },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#4B3D45",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: "#9A8A92",
    marginTop: 4,
  },
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
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 12,
    color: "#C45A6E",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
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
