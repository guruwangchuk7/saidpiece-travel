-- ==========================================
-- PRODUCTION BOOKINGS MIGRATION
-- Targeted for Saidpiece Travel V2
-- ==========================================

-- 1. Create Booking Status Enum (Safe/Idempotent)
DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('pending', 'awaiting_payment', 'paid', 'confirmed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create or Upgrade Bookings Table
-- If it doesn't exist, create it with full spec
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE RESTRICT,
    departure_id UUID REFERENCES public.trip_departures(id) ON DELETE SET NULL,
    traveler_name VARCHAR(255),
    traveler_email VARCHAR(255),
    passengers_count INTEGER DEFAULT 1 NOT NULL CHECK (passengers_count > 0),
    total_amount DECIMAL(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency VARCHAR(10) DEFAULT 'USD' NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', 
    payment_method VARCHAR(50), 
    payment_reference VARCHAR(255) UNIQUE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. In case table existed but lacks production columns, ADD THEM SAFELY
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS traveler_name VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS traveler_email VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Cast status column to Enum safely
-- This is split to accommodate existing VARCHAR status columns
DO $$ BEGIN
    ALTER TABLE public.bookings 
    ALTER COLUMN status TYPE booking_status USING (status::booking_status);
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Could not automatically cast status column. Ensure existing values match enum.';
END $$;

-- 5. Add Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_reference ON public.bookings(payment_reference);

-- 6. Fix Constraints (Safe)
ALTER TABLE public.bookings ALTER COLUMN traveler_name SET NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN traveler_email SET NOT NULL;

-- 7. Enable RLS & Policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings" ON public.bookings 
    FOR SELECT USING (auth.uid() = user_id OR public.is_staff());

DROP POLICY IF EXISTS "Users can insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert own bookings" ON public.bookings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can manage all bookings" ON public.bookings;
CREATE POLICY "Staff can manage all bookings" ON public.bookings 
    FOR ALL USING (public.is_staff());

-- 8. Updated At Trigger Logic
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_bookings_updated ON public.bookings;
CREATE TRIGGER on_bookings_updated
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Cross-table links for tracking
ALTER TABLE public.crypto_payment_intents 
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;

ALTER TABLE public.enquiries 
ADD COLUMN IF NOT EXISTS booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL;
