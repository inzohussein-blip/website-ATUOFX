-- ============================================
-- Forex Brokers Review - Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Brokers Table
-- ============================================
CREATE TABLE brokers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    affiliate_link TEXT,
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0,
    features JSONB DEFAULT '[]'::jsonb,
    regulation VARCHAR(255),
    minimum_deposit VARCHAR(100),
    spread_type VARCHAR(100),
    trading_platforms JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Reviews Table
-- ============================================
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(broker_id, user_id)
);

-- ============================================
-- User Profiles Table (extends auth.users)
-- ============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX idx_brokers_rating ON brokers(rating DESC);
CREATE INDEX idx_brokers_active ON brokers(is_active);
CREATE INDEX idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Brokers policies
CREATE POLICY "Brokers are viewable by everyone" 
    ON brokers FOR SELECT 
    USING (is_active = true);

CREATE POLICY "Only admins can insert brokers" 
    ON brokers FOR INSERT 
    TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Only admins can update brokers" 
    ON brokers FOR UPDATE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Only admins can delete brokers" 
    ON brokers FOR DELETE 
    TO authenticated 
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Reviews policies
CREATE POLICY "Approved reviews are viewable by everyone" 
    ON reviews FOR SELECT 
    USING (is_approved = true);

CREATE POLICY "Users can view their own pending reviews" 
    ON reviews FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "Authenticated users can insert reviews" 
    ON reviews FOR INSERT 
    TO authenticated 
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" 
    ON reviews FOR UPDATE 
    TO authenticated 
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reviews" 
    ON reviews FOR DELETE 
    TO authenticated 
    USING (user_id = auth.uid());

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (id = auth.uid());

-- ============================================
-- Functions and Triggers
-- ============================================

-- Function to update broker rating and review count
CREATE OR REPLACE FUNCTION update_broker_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE brokers 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) 
            AND is_approved = true
        ),
        review_count = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE broker_id = COALESCE(NEW.broker_id, OLD.broker_id) 
            AND is_approved = true
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.broker_id, OLD.broker_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update broker rating on review changes
CREATE TRIGGER update_broker_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_broker_rating();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Sample Data
-- ============================================

-- Insert sample brokers
INSERT INTO brokers (name, logo_url, website_url, affiliate_link, description, regulation, minimum_deposit, spread_type, features, trading_platforms, rating) VALUES
('XM', 'https://via.placeholder.com/100?text=XM', 'https://www.xm.com', 'https://www.xm.com?aff=123', 'وسيط عالمي موثوق به يقدم خدمات تداول شاملة', 'CySEC, FCA, ASIC', '$5', 'متغير', '["رافعة مالية 1:888", "حساب إسلامي", "بونص ترحيبي"]', '["MT4", "MT5"]', 4.5),

('Exness', 'https://via.placeholder.com/100?text=Exness', 'https://www.exness.com', 'https://www.exness.com?aff=456', 'وسيط رائد في مجال الفوركس مع تنفيذ فوري للأوامر', 'FCA, CySEC, FSA', '$10', 'ثابت ومتغير', '["رافعة مالية 1:2000", "سحب فوري", "حسابات متعددة"]', '["MT4", "MT5"]', 4.7),

('IC Markets', 'https://via.placeholder.com/100?text=IC+Markets', 'https://www.icmarkets.com', 'https://www.icmarkets.com?aff=789', 'أفضل وسيط للتداول بالعملات الأجنبية مع فروقات منخفضة', 'ASIC, CySEC, FSA', '$200', 'RAW Spread', '["فروقات منخفضة", "تنفيذ سريع", "سيولة عميقة"]', '["MT4", "MT5", "cTrader"]', 4.6),

('Pepperstone', 'https://via.placeholder.com/100?text=Pepperstone', 'https://www.pepperstone.com', 'https://www.pepperstone.com?aff=101', 'وسيط أسترالي حائز على جوائز عالمية', 'ASIC, FCA, DFSA', '$0', 'متغير', '["تداول اجتماعي", "أدوات تحليلية", "تعليم مجاني"]', '["MT4", "MT5", "TradingView"]', 4.4),

('FBS', 'https://via.placeholder.com/100?text=FBS', 'https://www.fbs.com', 'https://www.fbs.com?aff=202', 'وسيط شهير مع بونصات مغرية للمتداولين', 'CySEC, IFSC', '$1', 'ثابت ومتغير', '["بونص 100%", "حساب سنت", "رافعة عالية"]', '["MT4", "MT5"]', 4.2),

('AvaTrade', 'https://via.placeholder.com/100?text=AvaTrade', 'https://www.avatrade.com', 'https://www.avatrade.com?aff=303', 'وسيط آمن وموثوق به عالمياً', 'Central Bank of Ireland, ASIC, FSCA', '$100', 'ثابت', '["منصة خاصة", "تداول آلي", "حماية رأس المال"]', '["MT4", "MT5", "AvaTradeGO"]', 4.3);

-- ============================================
-- Storage Bucket for Images
-- ============================================
-- Create a storage bucket for broker logos and user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Logos are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'logos');

CREATE POLICY "Avatars are publicly accessible" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" 
    ON storage.objects FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Only admins can upload logos" 
    ON storage.objects FOR INSERT 
    TO authenticated 
    WITH CHECK (bucket_id = 'logos' AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
