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

// ──────────────────────────────────────────────────────────
// Blood Logs (period blood tracking)
// ──────────────────────────────────────────────────────────

export async function saveBloodLog(userId, logData) {
  const today = new Date().toISOString().split("T")[0];

  // Check for existing entry today
  const { data: existing } = await supabase
    .from("blood_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("log_date", today)
    .single();

  const entry = {
    color: logData.color,
    flow: logData.flow,
    clots: logData.clots || false,
    insight: logData.insight || null,
  };

  if (existing) {
    const { error } = await supabase
      .from("blood_logs")
      .update(entry)
      .eq("id", existing.id);
    if (error) console.warn("updateBloodLog error:", error.message);
  } else {
    const { error } = await supabase.from("blood_logs").insert({
      user_id: userId,
      log_date: today,
      ...entry,
    });
    if (error) console.warn("insertBloodLog error:", error.message);
  }
}

export async function getBloodLogs(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("blood_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("log_date", startStr)
    .order("log_date", { ascending: false });

  if (error) console.warn("getBloodLogs error:", error.message);
  return data || [];
}

export async function getLatestBloodLog(userId) {
  const { data, error } = await supabase
    .from("blood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    console.warn("getLatestBloodLog error:", error.message);
  }
  return data;
}

