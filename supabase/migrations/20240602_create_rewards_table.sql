-- Create Rewards Table
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    points_cost INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    stock INTEGER DEFAULT -1, -- -1 means unlimited
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Rewards
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active rewards, or admins can view all
CREATE POLICY "Anyone can view active rewards"
    ON public.rewards FOR SELECT
    USING (is_active = true OR (auth.role() = 'authenticated')); 

-- (Admins handle inserts/updates/deletes via service role key, so no public policies for those)

-- Create Reward Redemptions Table
CREATE TYPE redemption_status AS ENUM ('pending', 'fulfilled', 'rejected');

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    reward_id UUID REFERENCES public.rewards NOT NULL,
    status redemption_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for Redemptions
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own redemptions
CREATE POLICY "Users can view own redemptions"
    ON public.reward_redemptions FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own redemptions
CREATE POLICY "Users can insert own redemptions"
    ON public.reward_redemptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Function to handle auto-updating updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rewards_modtime
    BEFORE UPDATE ON public.rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_reward_redemptions_modtime
    BEFORE UPDATE ON public.reward_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
