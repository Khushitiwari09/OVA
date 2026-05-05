-- =====================================================
-- MenseCare — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)
-- =====================================================

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  cycle_length INTEGER DEFAULT 28,
  period_duration INTEGER DEFAULT 5,
  last_period_date DATE,
  regularity TEXT,
  flow_intensity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Health Logs (daily symptom tracking)
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  pain_level TEXT,
  flow TEXT,
  skin TEXT[],
  energy TEXT,
  mood TEXT[],
  cravings TEXT[],
  sleep TEXT,
  bloating TEXT,
  stress TEXT,
  activity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own health logs"
  ON health_logs FOR ALL
  USING (auth.uid() = user_id);

-- 3. Mood Logs (for mood tracker + graph)
CREATE TABLE IF NOT EXISTS mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own mood logs"
  ON mood_logs FOR ALL
  USING (auth.uid() = user_id);

-- 4. Blood Logs (period blood tracking)
CREATE TABLE IF NOT EXISTS blood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  color TEXT NOT NULL,        -- bright_red | dark_red | brown | pink
  flow TEXT NOT NULL,         -- light | medium | heavy
  clots BOOLEAN DEFAULT false,
  insight TEXT,               -- cached AI-generated insight
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blood logs"
  ON blood_logs FOR ALL
  USING (auth.uid() = user_id);

-- Done! All tables are ready with Row Level Security.
