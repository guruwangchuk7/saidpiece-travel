-- # Saidpiece Travel CMS Schema Expansion (FIXED VERSION)
-- This schema complements the existing database and adds CMS-specific capabilities.

-- 1. Destinations Table
CREATE TABLE IF NOT EXISTS public.destinations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,      
  title character varying NOT NULL,     
  slug character varying NOT NULL UNIQUE,
  description text,
  image_url character varying,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT destinations_pkey PRIMARY KEY (id)
);

-- 2. Link Trips to Destinations (Run this if trips already exists)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trips' AND column_name='destination_id') THEN
    ALTER TABLE public.trips ADD COLUMN destination_id uuid REFERENCES public.destinations(id);
  END IF;
END $$;

-- 3. Trip Itineraries
CREATE TABLE IF NOT EXISTS public.trip_itineraries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  day_number integer NOT NULL,
  title character varying NOT NULL,
  description text,
  accommodation character varying,
  meals character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trip_itineraries_pkey PRIMARY KEY (id),
  CONSTRAINT trip_itineraries_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE
);

-- 4. Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  client_name character varying NOT NULL,
  role character varying,
  content text NOT NULL,
  avatar_url character varying,
  rating integer DEFAULT 5,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);

-- 5. Blog Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content text, 
  main_image character varying,
  author_id uuid,
  status character varying NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);

-- 6. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
  key character varying NOT NULL,
  value text,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);

-- Enable RLS
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- FIXED POLICIES (Using FOR ALL and casting to your public.user_role)
CREATE POLICY "Staff can manage destinations" ON public.destinations FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'staff'::public.user_role OR role = 'admin'::public.user_role)));
CREATE POLICY "Staff can manage itineraries" ON public.trip_itineraries FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'staff'::public.user_role OR role = 'admin'::public.user_role)));
CREATE POLICY "Staff can manage testimonials" ON public.testimonials FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'staff'::public.user_role OR role = 'admin'::public.user_role)));
CREATE POLICY "Staff can manage blog posts" ON public.blog_posts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'staff'::public.user_role OR role = 'admin'::public.user_role)));
CREATE POLICY "Staff can manage site settings" ON public.site_settings FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'staff'::public.user_role OR role = 'admin'::public.user_role)));

-- Public reads
CREATE POLICY "Public can view destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Public can view itineraries" ON public.trip_itineraries FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public can view published blogs" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
