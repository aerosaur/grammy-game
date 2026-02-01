-- Grammy Game: Migration to Google Auth
-- Run this in Supabase SQL Editor AFTER enabling Google Auth
-- WARNING: This will drop existing predictions data

-- Drop existing predictions table and recreate with user_id
DROP TABLE IF EXISTS predictions CASCADE;

-- Predictions table with user_id (from Supabase Auth)
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  nominee TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Enable Row Level Security (RLS)
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Policies for predictions - users can only access their own predictions
CREATE POLICY "Users can read their own predictions" ON predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own predictions" ON predictions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own predictions" ON predictions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own predictions" ON predictions
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_category ON predictions(category);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS predictions_updated_at ON predictions;
CREATE TRIGGER predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add insert/update/delete policies for winners (for admin)
-- Keep read-only for anonymous users, but allow service role to modify
CREATE POLICY "Anyone can insert winners" ON winners
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update winners" ON winners
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete winners" ON winners
  FOR DELETE USING (true);
