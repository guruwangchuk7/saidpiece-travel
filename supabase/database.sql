-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name character varying NOT NULL,
  record_id uuid NOT NULL,
  operation character varying NOT NULL,
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id),
  CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id)
);
CREATE TABLE public.blockchain_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  payment_intent_id uuid UNIQUE,
  user_id uuid,
  booking_id character varying NOT NULL UNIQUE,
  chain_id bigint NOT NULL,
  status character varying NOT NULL DEFAULT 'draft'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT blockchain_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT blockchain_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  excerpt text,
  content text,
  main_image character varying,
  author_id uuid,
  status character varying NOT NULL DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying]::text[])),
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
  CONSTRAINT blog_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  trip_id uuid,
  departure_id uuid,
  total_amount numeric NOT NULL,
  currency character varying DEFAULT 'USD'::character varying,
  status character varying DEFAULT 'pending'::character varying,
  payment_method character varying,
  payment_reference_id character varying,
  traveler_details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  traveler_name character varying NOT NULL,
  traveler_email character varying NOT NULL,
  payment_reference character varying,
  metadata jsonb DEFAULT '{}'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  passengers_count integer NOT NULL DEFAULT 1,
  CONSTRAINT bookings_pkey PRIMARY KEY (id),
  CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT bookings_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT bookings_departure_id_fkey FOREIGN KEY (departure_id) REFERENCES public.trip_departures(id)
);
CREATE TABLE public.crypto_payment_intents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  enquiry_id uuid,
  user_email character varying NOT NULL,
  traveler_name character varying NOT NULL,
  trip_name character varying NOT NULL,
  fiat_currency character varying NOT NULL,
  fiat_amount numeric NOT NULL CHECK (fiat_amount >= 0::numeric),
  token_symbol character varying NOT NULL,
  token_address character varying NOT NULL,
  token_decimals integer NOT NULL CHECK (token_decimals >= 0),
  expected_token_amount numeric NOT NULL CHECK (expected_token_amount >= 0::numeric),
  expected_token_amount_base_units character varying NOT NULL,
  received_token_amount numeric,
  received_token_amount_base_units character varying,
  chain_id bigint NOT NULL,
  recipient_address character varying NOT NULL,
  sender_address character varying,
  tx_hash character varying UNIQUE,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::crypto_payment_status,
  quote_expires_at timestamp with time zone NOT NULL,
  verified_at timestamp with time zone,
  failure_code character varying,
  failure_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  booking_id uuid,
  CONSTRAINT crypto_payment_intents_pkey PRIMARY KEY (id),
  CONSTRAINT crypto_payment_intents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT crypto_payment_intents_enquiry_id_fkey FOREIGN KEY (enquiry_id) REFERENCES public.enquiries(id),
  CONSTRAINT crypto_payment_intents_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.destinations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  image_url character varying,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT destinations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.enquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  trip_id uuid,
  departure_id uuid,
  first_name character varying NOT NULL,
  email character varying NOT NULL,
  passengers_count integer NOT NULL DEFAULT 1 CHECK (passengers_count > 0),
  message text,
  trip_name_fallback character varying,
  proposed_date date,
  total_amount numeric CHECK (total_amount >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'new'::enquiry_status,
  payment_status USER-DEFINED NOT NULL DEFAULT 'pending'::payment_status,
  stripe_session_id character varying UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  booking_id uuid,
  CONSTRAINT enquiries_pkey PRIMARY KEY (id),
  CONSTRAINT enquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT enquiries_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id),
  CONSTRAINT enquiries_departure_id_fkey FOREIGN KEY (departure_id) REFERENCES public.trip_departures(id),
  CONSTRAINT enquiries_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id)
);
CREATE TABLE public.faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  question text NOT NULL UNIQUE,
  answer text NOT NULL,
  category character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT faqs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  role USER-DEFINED NOT NULL DEFAULT 'customer'::user_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.site_settings (
  key character varying NOT NULL,
  value text,
  description text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_pkey PRIMARY KEY (key)
);
CREATE TABLE public.testimonials (
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
CREATE TABLE public.trip_departures (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  price numeric NOT NULL CHECK (price >= 0::numeric),
  status USER-DEFINED NOT NULL DEFAULT 'available'::departure_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trip_departures_pkey PRIMARY KEY (id),
  CONSTRAINT trip_departures_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);
CREATE TABLE public.trip_itineraries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL,
  day_number integer NOT NULL,
  title character varying NOT NULL,
  description text,
  accommodation character varying,
  meals character varying,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT trip_itineraries_pkey PRIMARY KEY (id),
  CONSTRAINT trip_itineraries_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id)
);
CREATE TABLE public.trips (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  duration_nights integer NOT NULL CHECK (duration_nights >= 0),
  starting_price numeric NOT NULL CHECK (starting_price >= 0::numeric),
  level character varying,
  image_url character varying,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  trip_type character varying,
  destination character varying,
  category character varying,
  CONSTRAINT trips_pkey PRIMARY KEY (id)
);

CREATE TABLE public.homepage_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  description text NOT NULL,
  link_text character varying,
  link_url character varying,
  image_url character varying,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT homepage_services_pkey PRIMARY KEY (id)
);

CREATE TABLE public.travel_styles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  image_url character varying,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT travel_styles_pkey PRIMARY KEY (id)
);