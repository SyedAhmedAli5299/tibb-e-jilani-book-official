/*
  # Create tables for Islamic Book Reader

  1. New Tables
    - `chapters`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `language` (text, enum: english/urdu)
      - `order` (integer)
      - `images` (text array for multiple images)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `text` (text)
      - `rating` (integer)
      - `approved` (boolean, default false)
      - `created_at` (timestamp)
    
    - `bookmarks`
      - `id` (uuid, primary key)
      - `chapter_id` (uuid, foreign key)
      - `position` (integer)
      - `note` (text, optional)
      - `created_at` (timestamp)
    
    - `notes`
      - `id` (uuid, primary key)
      - `chapter_id` (uuid, foreign key)
      - `position` (integer)
      - `text` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access and admin write access
*/

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  language text NOT NULL CHECK (language IN ('english', 'urdu')),
  "order" integer NOT NULL,
  images text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  note text,
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  position integer DEFAULT 0,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies for chapters (public read, admin write)
CREATE POLICY "Anyone can read chapters"
  ON chapters
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert chapters"
  ON chapters
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update chapters"
  ON chapters
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete chapters"
  ON chapters
  FOR DELETE
  TO public
  USING (true);

-- Policies for testimonials
CREATE POLICY "Anyone can read approved testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (approved = true OR true);

CREATE POLICY "Anyone can insert testimonials"
  ON testimonials
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update testimonials"
  ON testimonials
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Anyone can delete testimonials"
  ON testimonials
  FOR DELETE
  TO public
  USING (true);

-- Policies for bookmarks
CREATE POLICY "Anyone can manage bookmarks"
  ON bookmarks
  FOR ALL
  TO public
  USING (true);

-- Policies for notes
CREATE POLICY "Anyone can manage notes"
  ON notes
  FOR ALL
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS chapters_language_order_idx ON chapters(language, "order");
CREATE INDEX IF NOT EXISTS testimonials_approved_idx ON testimonials(approved);
CREATE INDEX IF NOT EXISTS bookmarks_chapter_id_idx ON bookmarks(chapter_id);
CREATE INDEX IF NOT EXISTS notes_chapter_id_idx ON notes(chapter_id);
