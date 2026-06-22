-- BELSOME Postgres Database Schema
-- Migration from Zustand-only state to Supabase Postgres backend

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- STYLISTS
CREATE TABLE stylists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  experience text NOT NULL,
  rating numeric NOT NULL DEFAULT 5.0,
  languages text[] NOT NULL DEFAULT '{}',
  certifications text[] NOT NULL DEFAULT '{}',
  ai_score numeric NOT NULL DEFAULT 80.0,
  reviews_count int NOT NULL DEFAULT 0,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- STYLIST BEFORE AFTER IMAGES
CREATE TABLE stylist_before_after (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id uuid NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  before_url text NOT NULL,
  after_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- SALONS
CREATE TABLE salons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating numeric NOT NULL DEFAULT 5.0,
  image text NOT NULL,
  min_price numeric NOT NULL DEFAULT 0,
  max_price numeric NOT NULL DEFAULT 0,
  peak_surge numeric NOT NULL DEFAULT 0,
  off_peak_discount numeric NOT NULL DEFAULT 0,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- SERVICES
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  duration int NOT NULL DEFAULT 30, -- duration in minutes
  image text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- APPOINTMENTS
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  salon_id uuid NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  salon_name text NOT NULL,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  stylist_id uuid NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  stylist_name text NOT NULL,
  date date NOT NULL,
  time_slot text NOT NULL,
  product_preference text[] NOT NULL DEFAULT '{}',
  original_price numeric NOT NULL DEFAULT 0,
  final_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
  pricing_reason text NOT NULL,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- VENDOR PRODUCTS
CREATE TABLE vendor_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  certifications text[] NOT NULL DEFAULT '{}',
  cost numeric NOT NULL DEFAULT 0,
  retail numeric NOT NULL DEFAULT 0,
  margin numeric NOT NULL DEFAULT 0,
  score numeric NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('ACCEPT', 'REVIEW', 'REJECT')),
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- EXAM ATTEMPTS
CREATE TABLE exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  language text NOT NULL,
  scenario text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('HIRE', 'TRAIN', 'REJECT')),
  feedback text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- WEDDING PROJECTS
CREATE TABLE wedding_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bride_name text NOT NULL,
  wedding_date date NOT NULL,
  budget numeric NOT NULL DEFAULT 0,
  progress numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- WEDDING BOOKED VENDORS
CREATE TABLE wedding_booked_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_project_id uuid NOT NULL REFERENCES wedding_projects(id) ON DELETE CASCADE,
  role text NOT NULL,
  name text NOT NULL,
  cost numeric NOT NULL DEFAULT 0,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- WEDDING TIMELINE
CREATE TABLE wedding_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_project_id uuid NOT NULL REFERENCES wedding_projects(id) ON DELETE CASCADE,
  time text NOT NULL,
  event text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- CORPORATE ACCOUNTS
CREATE TABLE corporate_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  plan text NOT NULL CHECK (plan IN ('Bronze', 'Silver', 'Gold')),
  total_employees int NOT NULL DEFAULT 0,
  allocated_credits numeric NOT NULL DEFAULT 0,
  used_credits numeric NOT NULL DEFAULT 0,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);
