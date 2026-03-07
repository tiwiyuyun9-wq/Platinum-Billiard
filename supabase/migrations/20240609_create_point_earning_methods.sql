-- Create point_earning_methods table to store customizable rules for earning points
CREATE TABLE IF NOT EXISTS public.point_earning_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(255), -- Stores the icon name (e.g., 'Clock', 'ShoppingBag')
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.point_earning_methods ENABLE ROW LEVEL SECURITY;

-- Everyone can read the point earning methods
CREATE POLICY "Public Read Access"
    ON public.point_earning_methods
    FOR SELECT
    USING (true);

-- Only admins can manage the methods
CREATE POLICY "Admins Full Access"
    ON public.point_earning_methods
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_point_earning_methods_modtime()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_point_earning_methods_modtime ON public.point_earning_methods;
CREATE TRIGGER trg_update_point_earning_methods_modtime
BEFORE UPDATE ON public.point_earning_methods
FOR EACH ROW EXECUTE FUNCTION update_point_earning_methods_modtime();

-- Insert some default values based on the screenshot/knowledge
INSERT INTO public.point_earning_methods (title, description, icon) 
VALUES 
    ('Main Billiard', 'Dapatkan 10 Poin setiap 1 Jam bermain. *Poin akan masuk otomatis setelah booking selesai (status Completed).', 'Clock'),
    ('Pesanan Cafe & Resto', 'Dapatkan poin untuk setiap pesanan. Semakin besar pesanan Anda, semakin tinggi poin yang didapat.', 'Coffee')
ON CONFLICT DO NOTHING;

-- Reload schema
notify pgrst, 'reload schema';
