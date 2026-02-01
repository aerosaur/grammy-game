-- Grammy Game Database Schema
-- Run this in Supabase SQL Editor

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  category TEXT NOT NULL,
  nominee TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, category)
);

-- Winners table (you'll populate this as winners are announced)
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL UNIQUE,
  nominee TEXT NOT NULL,
  announced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Policies for predictions
CREATE POLICY "Anyone can read predictions" ON predictions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert predictions" ON predictions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own predictions" ON predictions
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own predictions" ON predictions
  FOR DELETE USING (true);

-- Policies for winners (read-only for app, you update manually)
CREATE POLICY "Anyone can read winners" ON winners
  FOR SELECT USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_predictions_username ON predictions(username);
CREATE INDEX IF NOT EXISTS idx_predictions_category ON predictions(category);
CREATE INDEX IF NOT EXISTS idx_winners_category ON winners(category);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
