-- Create tables for quotes functionality

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  service_type TEXT,
  duration INTEGER, -- Duration in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add price column to inventory table if it doesn't exist
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0;

-- Add features column to inventory table if it doesn't exist
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Add image_url column to inventory table if it doesn't exist
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
CREATE INDEX IF NOT EXISTS idx_inventory_item_name ON inventory(item_name);

-- Add sample services data
INSERT INTO services (name, description, price, service_type, duration)
VALUES 
  ('Montaż klimatyzacji ściennej', 'Standardowy montaż jednostki ściennej', 800, 'installation', 240),
  ('Montaż klimatyzacji kanałowej', 'Montaż jednostki kanałowej z podłączeniem', 1500, 'installation', 360),
  ('Montaż klimatyzacji kasetonowej', 'Montaż jednostki kasetonowej w suficie podwieszanym', 1200, 'installation', 300),
  ('Montaż klimatyzacji przypodłogowej', 'Montaż jednostki przypodłogowej', 900, 'installation', 240),
  ('Montaż klimatyzacji multi-split', 'Montaż systemu multi-split z kilkoma jednostkami', 2000, 'installation', 480),
  ('Instalacja rurociągu chłodniczego', 'Dodatkowa instalacja rurociągu chłodniczego', 150, 'installation', 60),
  ('Wykonanie odpływu skroplin', 'Instalacja odpływu skroplin', 100, 'installation', 45),
  ('Wykonanie przebicia przez ścianę', 'Wykonanie otworu w ścianie na instalację', 120, 'installation', 30),
  ('Montaż sterownika przewodowego', 'Instalacja i konfiguracja sterownika przewodowego', 200, 'installation', 60),
  ('Uruchomienie i test systemu', 'Pierwsze uruchomienie i testowanie systemu', 250, 'installation', 120)
ON CONFLICT (id) DO NOTHING;

-- Update inventory items with prices and features
UPDATE inventory
SET 
  price = CASE 
    WHEN item_name LIKE '%klimatyzator%' OR item_name LIKE '%klimatyzacja%' THEN 3500
    WHEN item_name LIKE '%pompa%' THEN 5000
    WHEN item_name LIKE '%filtr%' THEN 150
    WHEN item_name LIKE '%sterownik%' THEN 300
    ELSE 100
  END,
  features = CASE
    WHEN item_name LIKE '%klimatyzator%' OR item_name LIKE '%klimatyzacja%' THEN 
      '["Energooszczędność A++", "Cicha praca", "Filtr antyalergiczny", "Sterowanie WiFi"]'::jsonb
    WHEN item_name LIKE '%pompa%' THEN 
      '["Wysoka wydajność", "Niski poziom hałasu", "Automatyczne sterowanie"]'::jsonb
    WHEN item_name LIKE '%filtr%' THEN 
      '["Filtracja drobnych cząstek", "Antybakteryjny", "Łatwy montaż"]'::jsonb
    WHEN item_name LIKE '%sterownik%' THEN 
      '["Dotykowy wyświetlacz", "Programowanie tygodniowe", "Sterowanie przez aplikację"]'::jsonb
    ELSE 
      '["Wysoka jakość", "Trwałość"]'::jsonb
  END
WHERE price IS NULL OR price = 0;
