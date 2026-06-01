-- ============================================
-- SUPABASE SCHEMA FOR PORTFOLIO WEBSITE
-- Run these SQL statements in Supabase SQL Editor
-- ============================================

-- PROFILES / ABOUT TABLE
create table about (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  tagline text,
  bio text,
  profile_image_url text,
  resume_url text,
  email text,
  location text,
  updated_at timestamptz default now()
);

-- SKILLS TABLE
create table skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null,
  proficiency int default 80,
  icon_name text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- PROJECTS TABLE
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  long_description text,
  thumbnail_url text,
  demo_url text,
  github_url text,
  tech_stack text[],
  status text default 'completed',
  is_featured boolean default false,
  display_order int default 0,
  created_at timestamptz default now()
);

-- CERTIFICATIONS TABLE
create table certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_url text,
  badge_image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- EDUCATION TABLE
create table education (
  id uuid default gen_random_uuid() primary key,
  institution text not null,
  degree text not null,
  field_of_study text,
  start_year int,
  end_year int,
  grade text,
  description text,
  institution_logo_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- ACHIEVEMENTS TABLE
create table achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date,
  category text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- BLOG POSTS TABLE
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  tags text[],
  is_published boolean default false,
  reading_time_mins int default 5,
  views int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- SOCIAL LINKS TABLE
create table social_links (
  id uuid default gen_random_uuid() primary key,
  platform text not null,
  url text not null,
  icon_name text,
  display_order int default 0
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on ALL tables
alter table about enable row level security;
alter table skills enable row level security;
alter table projects enable row level security;
alter table certifications enable row level security;
alter table education enable row level security;
alter table achievements enable row level security;
alter table blog_posts enable row level security;
alter table social_links enable row level security;

-- PUBLIC READ POLICIES (anyone can read)
create policy "Public can read about" on about for select using (true);
create policy "Public can read skills" on skills for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read certifications" on certifications for select using (true);
create policy "Public can read education" on education for select using (true);
create policy "Public can read achievements" on achievements for select using (true);
create policy "Public can read published blog posts" on blog_posts for select using (is_published = true);
create policy "Public can read social links" on social_links for select using (true);

-- ADMIN WRITE POLICIES (only authenticated user can insert/update/delete)
create policy "Admin can insert about" on about for insert with check (auth.role() = 'authenticated');
create policy "Admin can update about" on about for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete about" on about for delete using (auth.role() = 'authenticated');

create policy "Admin can insert skills" on skills for insert with check (auth.role() = 'authenticated');
create policy "Admin can update skills" on skills for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete skills" on skills for delete using (auth.role() = 'authenticated');

create policy "Admin can insert projects" on projects for insert with check (auth.role() = 'authenticated');
create policy "Admin can update projects" on projects for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete projects" on projects for delete using (auth.role() = 'authenticated');

create policy "Admin can insert certifications" on certifications for insert with check (auth.role() = 'authenticated');
create policy "Admin can update certifications" on certifications for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete certifications" on certifications for delete using (auth.role() = 'authenticated');

create policy "Admin can insert education" on education for insert with check (auth.role() = 'authenticated');
create policy "Admin can update education" on education for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete education" on education for delete using (auth.role() = 'authenticated');

create policy "Admin can insert achievements" on achievements for insert with check (auth.role() = 'authenticated');
create policy "Admin can update achievements" on achievements for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete achievements" on achievements for delete using (auth.role() = 'authenticated');

create policy "Admin can insert blog_posts" on blog_posts for insert with check (auth.role() = 'authenticated');
create policy "Admin can update blog_posts" on blog_posts for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete blog_posts" on blog_posts for delete using (auth.role() = 'authenticated');

create policy "Admin can insert social_links" on social_links for insert with check (auth.role() = 'authenticated');
create policy "Admin can update social_links" on social_links for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin can delete social_links" on social_links for delete using (auth.role() = 'authenticated');

-- ============================================
-- STORAGE
-- ============================================
-- Create a public bucket named 'portfolio-assets' in:
-- Supabase Dashboard → Storage → New Bucket → Name: portfolio-assets → Public: true
--
-- Then add a storage policy to allow authenticated users to upload:
-- Go to Storage → Policies → New Policy on 'portfolio-assets' bucket:
--   Policy name: "Allow authenticated uploads"
--   Allowed operation: INSERT
--   Target roles: authenticated
--   WITH CHECK expression: true
--
-- And a policy to allow public reads:
--   Policy name: "Allow public reads"
--   Allowed operation: SELECT
--   Target roles: public
--   USING expression: true
