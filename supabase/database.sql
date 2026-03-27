-- 0. Cleanup (Optional: Run this if you want a fresh start)
-- DROP FUNCTION IF EXISTS public.is_staff() CASCADE;

-- 1. Create Custom Types & Enums (Idempotent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'staff', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE enquiry_status AS ENUM ('new', 'proposed', 'awaiting_payment', 'confirmed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE departure_status AS ENUM ('available', 'guaranteed', 'limited_space', 'sold_out');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE crypto_payment_status AS ENUM ('pending', 'paid', 'failed', 'expired', 'underpaid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE blockchain_booking_status AS ENUM ('draft', 'created', 'deposited', 'confirmed', 'refunded', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Helper Function to Prevent RLS Recursion (CRITICAL)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (role IN ('staff', 'admin'))
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Tables
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    duration_nights INTEGER NOT NULL CHECK (duration_nights >= 0),
    starting_price DECIMAL(10, 2) NOT NULL CHECK (starting_price >= 0),
    level VARCHAR(100),
    image_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.trip_departures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    status departure_status DEFAULT 'available'::departure_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT chk_end_after_start CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    departure_id UUID REFERENCES public.trip_departures(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passengers_count INTEGER DEFAULT 1 NOT NULL CHECK (passengers_count > 0),
    message TEXT,
    trip_name_fallback VARCHAR(255),
    proposed_date DATE,
    total_amount DECIMAL(10, 2) CHECK (total_amount >= 0),
    status enquiry_status DEFAULT 'new'::enquiry_status NOT NULL,
    payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL,
    stripe_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.crypto_payment_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
    user_email VARCHAR(255) NOT NULL,
    traveler_name VARCHAR(255) NOT NULL,
    trip_name VARCHAR(255) NOT NULL,
    fiat_currency VARCHAR(16) NOT NULL,
    fiat_amount DECIMAL(12, 2) NOT NULL CHECK (fiat_amount >= 0),
    token_symbol VARCHAR(32) NOT NULL,
    token_address VARCHAR(255) NOT NULL,
    token_decimals INTEGER NOT NULL CHECK (token_decimals >= 0),
    expected_token_amount DECIMAL(24, 8) NOT NULL CHECK (expected_token_amount >= 0),
    expected_token_amount_base_units VARCHAR(255) NOT NULL,
    received_token_amount DECIMAL(24, 8),
    received_token_amount_base_units VARCHAR(255),
    chain_id BIGINT NOT NULL,
    recipient_address VARCHAR(255) NOT NULL,
    sender_address VARCHAR(255),
    tx_hash VARCHAR(255) UNIQUE,
    status crypto_payment_status DEFAULT 'pending'::crypto_payment_status NOT NULL,
    quote_expires_at TIMESTAMPTZ NOT NULL,
    verified_at TIMESTAMPTZ,
    failure_code VARCHAR(100),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Security Policies (FIXED RECURSION)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: Users see own, staff see all.
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles" ON public.profiles FOR SELECT USING (public.is_staff());

-- Enquiries: Users see own, guest insert, staff manage.
DROP POLICY IF EXISTS "Users can insert enquiries" ON public.enquiries;
CREATE POLICY "Users can insert enquiries" ON public.enquiries FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can view own enquiries" ON public.enquiries;
CREATE POLICY "Users can view own enquiries" ON public.enquiries FOR SELECT USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Staff can manage all enquiries" ON public.enquiries;
CREATE POLICY "Staff can manage all enquiries" ON public.enquiries FOR ALL USING (public.is_staff());

-- 5. Auto-Create Profile Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer'::public.user_role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
