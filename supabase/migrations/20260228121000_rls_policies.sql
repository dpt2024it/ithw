-- =============================================================
-- Migration: Row Level Security (RLS) policies
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- PROFILES
-- =============================================================
-- Всеки вижда всички профили
CREATE POLICY "Profiles: viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Потребителят редактира само собствения си профил
CREATE POLICY "Profiles: users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================
-- ASSIGNMENTS
-- =============================================================
-- Всеки logged-in потребител вижда задачите
CREATE POLICY "Assignments: viewable by authenticated users"
  ON assignments FOR SELECT
  TO authenticated
  USING (true);

-- Само admin може да създава задачи
CREATE POLICY "Assignments: admins can insert"
  ON assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Само admin може да редактира задачи
CREATE POLICY "Assignments: admins can update"
  ON assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Само admin може да изтрива задачи
CREATE POLICY "Assignments: admins can delete"
  ON assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================
-- SOLUTIONS
-- =============================================================
-- Всеки logged-in потребител вижда всички решения
CREATE POLICY "Solutions: viewable by authenticated users"
  ON solutions FOR SELECT
  TO authenticated
  USING (true);

-- Потребителят може да създаде собствено решение
CREATE POLICY "Solutions: users can insert own"
  ON solutions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Потребителят може да редактира собственото си решение
CREATE POLICY "Solutions: users can update own"
  ON solutions FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Потребителят може да изтрие собственото си решение, admin — всяко
CREATE POLICY "Solutions: users can delete own or admin any"
  ON solutions FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================
-- COMMENTS
-- =============================================================
-- Всеки logged-in вижда коментарите
CREATE POLICY "Comments: viewable by authenticated users"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

-- Потребителят може да пише коментар
CREATE POLICY "Comments: users can insert own"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Потребителят може да изтрие собствения си коментар, admin — всеки
CREATE POLICY "Comments: users can delete own or admin any"
  ON comments FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================
-- DISCUSSIONS
-- =============================================================
-- Всеки logged-in вижда дискусиите
CREATE POLICY "Discussions: viewable by authenticated users"
  ON discussions FOR SELECT
  TO authenticated
  USING (true);

-- Потребителят може да създаде дискусия
CREATE POLICY "Discussions: users can insert own"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Потребителят може да изтрие собствената си дискусия, admin — всяка
CREATE POLICY "Discussions: users can delete own or admin any"
  ON discussions FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================
-- DISCUSSION_REPLIES
-- =============================================================
-- Всеки logged-in вижда отговорите
CREATE POLICY "Replies: viewable by authenticated users"
  ON discussion_replies FOR SELECT
  TO authenticated
  USING (true);

-- Потребителят може да пише отговор
CREATE POLICY "Replies: users can insert own"
  ON discussion_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Потребителят може да изтрие собствения си отговор, admin — всеки
CREATE POLICY "Replies: users can delete own or admin any"
  ON discussion_replies FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================================
-- Storage bucket for solution files
-- =============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('solution-files', 'solution-files', true)
ON CONFLICT (id) DO NOTHING;

-- Authenticated users can upload files
CREATE POLICY "Storage: authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'solution-files');

-- Everyone can view files
CREATE POLICY "Storage: public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'solution-files');

-- Users can delete own files, admins can delete any
CREATE POLICY "Storage: users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'solution-files'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );
