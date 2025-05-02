-- Tabela przechowująca pliki audio
CREATE TABLE IF NOT EXISTS audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'email',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeks dla szybkiego wyszukiwania plików audio dla klienta
CREATE INDEX IF NOT EXISTS idx_audio_files_customer_id ON audio_files(customer_id);

-- Tabela przechowująca transkrypcje
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  audio_file_id UUID REFERENCES audio_files(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  key_points JSONB DEFAULT '[]'::jsonb,
  sentiment TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  important_dates JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  source TEXT NOT NULL DEFAULT 'phone',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT NOT NULL DEFAULT 'System',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indeks dla szybkiego wyszukiwania transkrypcji dla klienta
CREATE INDEX IF NOT EXISTS idx_transcriptions_customer_id ON transcriptions(customer_id);

-- Indeks dla szybkiego wyszukiwania transkrypcji dla pliku audio
CREATE INDEX IF NOT EXISTS idx_transcriptions_audio_file_id ON transcriptions(audio_file_id);

-- Indeks dla wyszukiwania pełnotekstowego w treści transkrypcji
CREATE INDEX IF NOT EXISTS idx_transcriptions_content_search ON transcriptions USING GIN (to_tsvector('polish', content));

-- Funkcja aktualizująca pole updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla tabeli audio_files
CREATE TRIGGER update_audio_files_updated_at
BEFORE UPDATE ON audio_files
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger dla tabeli transcriptions
CREATE TRIGGER update_transcriptions_updated_at
BEFORE UPDATE ON transcriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Dodanie uprawnień dla anon i authenticated
ALTER TABLE audio_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla audio_files
CREATE POLICY "Anon can read audio_files" ON audio_files
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert audio_files" ON audio_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update their audio_files" ON audio_files
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete their audio_files" ON audio_files
  FOR DELETE USING (true);

-- Polityki RLS dla transcriptions
CREATE POLICY "Anon can read transcriptions" ON transcriptions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert transcriptions" ON transcriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update their transcriptions" ON transcriptions
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete their transcriptions" ON transcriptions
  FOR DELETE USING (true);
