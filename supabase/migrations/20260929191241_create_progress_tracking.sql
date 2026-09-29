/*
# Create training progress tracking table (single-tenant, no auth)

1. New Tables
- `training_sessions` — one row per training session completed by the user.
  - `id` (uuid, primary key)
  - `training_mode` (text, not null) — which mode was practiced: instant_response, three_ways, boundary_practice, play_mode, social_recovery
  - `category` (text) — category of the prompt
  - `skill` (text) — skill being trained
  - `difficulty` (text) — difficulty level
  - `response_text` (text) — what the user responded
  - `response_time_ms` (integer) — how long the user took to respond, in milliseconds
  - `response_modes` (jsonb) — for three_ways mode, the different response modes practiced (playful, honest, assertive, etc.)
  - `reflection` (jsonb) — user's reflection answers
  - `created_at` (timestamp, defaults to now)

2. Security
- Enable RLS on `training_sessions`.
- Allow anon + authenticated full CRUD — this is a single-tenant app with no sign-in, so all data is intentionally shared/public.
*/

CREATE TABLE IF NOT EXISTS training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_mode text NOT NULL,
  category text,
  skill text,
  difficulty text,
  response_text text,
  response_time_ms integer,
  response_modes jsonb,
  reflection jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sessions" ON training_sessions;
CREATE POLICY "anon_select_sessions" ON training_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sessions" ON training_sessions;
CREATE POLICY "anon_insert_sessions" ON training_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sessions" ON training_sessions;
CREATE POLICY "anon_update_sessions" ON training_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sessions" ON training_sessions;
CREATE POLICY "anon_delete_sessions" ON training_sessions FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_training_sessions_created_at ON training_sessions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_mode ON training_sessions (training_mode);