import { supabase } from "./supabase";

// ──────────────────────────────────────────────────────────
// Profiles
// ──────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.warn("getProfile error:", error.message);
  }
  return data;
}

export async function upsertProfile(userId, profileData) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    console.warn("upsertProfile error:", error.message);
    throw error;
  }
  return data;
}

// ──────────────────────────────────────────────────────────
// Health Logs
// ──────────────────────────────────────────────────────────

export async function saveHealthLog(userId, logDate, logData) {
  // Upsert based on user_id + log_date
  const { data: existing } = await supabase
    .from("health_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", logDate)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("health_logs")
      .update(logData)
      .eq("id", existing.id);
    if (error) console.warn("updateHealthLog error:", error.message);
  } else {
    const { error } = await supabase.from("health_logs").insert({
      user_id: userId,
      log_date: logDate,
      ...logData,
    });
    if (error) console.warn("insertHealthLog error:", error.message);
  }
}

export async function getHealthLog(userId, logDate) {
  const { data, error } = await supabase
    .from("health_logs")
    .select("*")
    .eq("user_id", userId)
    .eq("log_date", logDate)
    .single();

  if (error && error.code !== "PGRST116") {
    console.warn("getHealthLog error:", error.message);
  }
  return data;
}

export async function getHealthLogs(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from("health_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", startDate)
    .lte("log_date", endDate)
    .order("log_date", { ascending: true });

  if (error) console.warn("getHealthLogs error:", error.message);
  return data || [];
}

// ──────────────────────────────────────────────────────────
// Mood Logs
// ──────────────────────────────────────────────────────────

export async function saveMoodLog(userId, logDate, mood, note = "") {
  const { data: existing } = await supabase
    .from("mood_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", logDate)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("mood_logs")
      .update({ mood, note })
      .eq("id", existing.id);
    if (error) console.warn("updateMoodLog error:", error.message);
  } else {
    const { error } = await supabase.from("mood_logs").insert({
      user_id: userId,
      log_date: logDate,
      mood,
      note,
    });
    if (error) console.warn("insertMoodLog error:", error.message);
  }
}

export async function getMoodLogs(userId, days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", startStr)
    .order("log_date", { ascending: true });

  if (error) console.warn("getMoodLogs error:", error.message);
  return data || [];
}
