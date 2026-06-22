-- BELSOME Seed Data Script
-- Populates database with default mock records from belsomeStore.ts

-- Clear existing data
TRUNCATE TABLE corporate_accounts RESTART IDENTITY CASCADE;
TRUNCATE TABLE wedding_timeline RESTART IDENTITY CASCADE;
TRUNCATE TABLE wedding_booked_vendors RESTART IDENTITY CASCADE;
TRUNCATE TABLE wedding_projects RESTART IDENTITY CASCADE;
TRUNCATE TABLE exam_attempts RESTART IDENTITY CASCADE;
TRUNCATE TABLE vendor_products RESTART IDENTITY CASCADE;
TRUNCATE TABLE appointments RESTART IDENTITY CASCADE;
TRUNCATE TABLE services RESTART IDENTITY CASCADE;
TRUNCATE TABLE salons RESTART IDENTITY CASCADE;
TRUNCATE TABLE stylist_before_after RESTART IDENTITY CASCADE;
TRUNCATE TABLE stylists RESTART IDENTITY CASCADE;

-- 1. SEED SERVICES
INSERT INTO services (id, name, category, price, duration, image) VALUES
('e0000000-0000-0000-0000-000000000001', 'Signature Haircut & Consultation', 'Hair', 800, 40, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400'),
('e0000000-0000-0000-0000-000000000002', 'Premium Slicked Back Undercut', 'Hair', 1100, 50, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400'),
('e0000000-0000-0000-0000-000000000003', 'Beard Trim & Hot Towel Hydration', 'Beard', 500, 30, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400'),
('e0000000-0000-0000-0000-000000000004', 'Charcoal De-Tan Facial & Mask', 'Beauty', 1200, 45, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400'),
('e0000000-0000-0000-0000-000000000005', 'Royal Bridal Makeover Pack', 'Bridal', 15000, 180, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400');

-- 2. SEED SALONS
INSERT INTO salons (id, name, location, rating, image, min_price, max_price, peak_surge, off_peak_discount, city) VALUES
-- Hyderabad
('a0000000-0000-0000-0000-000000000001', 'BELSOME Signature Studio', 'Road No. 36, Jubilee Hills, Hyderabad', 4.9, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 500, 5000, 15, 20, 'Hyderabad'),
('a0000000-0000-0000-0000-000000000002', 'Velvet Cut Co.', 'DLF Cyber City, Gachibowli, Hyderabad', 4.7, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 400, 4000, 10, 15, 'Hyderabad'),
-- Bangalore
('a0000000-0000-0000-0000-000000000003', 'BELSOME Signature Studio', '100 Feet Road, Indiranagar, Bangalore', 4.9, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 500, 5000, 15, 20, 'Bangalore'),
('a0000000-0000-0000-0000-000000000004', 'Velvet Cut Co.', 'Outer Ring Road, Manyata Tech Park, Bangalore', 4.7, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 400, 4000, 10, 15, 'Bangalore'),
-- Mumbai
('a0000000-0000-0000-0000-000000000005', 'BELSOME Signature Studio', 'Carter Road, Bandra West, Mumbai', 4.9, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 500, 5000, 15, 20, 'Mumbai'),
('a0000000-0000-0000-0000-000000000006', 'Velvet Cut Co.', 'Link Road, Andheri West, Mumbai', 4.7, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 400, 4000, 10, 15, 'Mumbai'),
-- Delhi
('a0000000-0000-0000-0000-000000000007', 'BELSOME Signature Studio', 'Inner Circle, Connaught Place, New Delhi', 4.9, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 500, 5000, 15, 20, 'Delhi'),
('a0000000-0000-0000-0000-000000000008', 'Velvet Cut Co.', 'Nelson Mandela Marg, Vasant Kunj, New Delhi', 4.7, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400&h=400', 400, 4000, 10, 15, 'Delhi');

-- 3. SEED STYLISTS
INSERT INTO stylists (id, name, specialty, experience, rating, languages, certifications, ai_score, reviews_count, city) VALUES
-- Hyderabad
('b0000000-0000-0000-0000-000000000001', 'Vikram Malhotra', 'Master Hair Sculptor & Fade Specialist', '8 Years', 4.9, ARRAY['English', 'Hindi', 'Telugu'], ARRAY['Sassoon Academy London', 'BELSOME Diamond Stylist'], 94, 142, 'Hyderabad'),
('b0000000-0000-0000-0000-000000000002', 'Priya Rao', 'Celebrity Groomer & Hair Colorist', '6 Years', 4.8, ARRAY['English', 'Telugu'], ARRAY['L''Oreal Professional Color Expert'], 88, 96, 'Hyderabad'),
('b0000000-0000-0000-0000-000000000003', 'Suresh K.', 'Natural Wave Artist & Spa Therapy Specialist', '10 Years', 4.6, ARRAY['Telugu', 'Hindi'], ARRAY['Ayurvedic Beauty Therapist Certification'], 82, 78, 'Hyderabad'),
-- Bangalore
('b0000000-0000-0000-0000-000000000004', 'Arjun Reddy', 'Master Hair Sculptor & Fade Specialist', '8 Years', 4.9, ARRAY['English', 'Kannada', 'Telugu'], ARRAY['Sassoon Academy London', 'BELSOME Diamond Stylist'], 94, 142, 'Bangalore'),
('b0000000-0000-0000-0000-000000000005', 'Kavya Nair', 'Celebrity Groomer & Hair Colorist', '6 Years', 4.8, ARRAY['English', 'Kannada', 'Malayalam'], ARRAY['L''Oreal Professional Color Expert'], 88, 96, 'Bangalore'),
('b0000000-0000-0000-0000-000000000006', 'Rohan Sen', 'Natural Wave Artist & Spa Therapy Specialist', '10 Years', 4.6, ARRAY['English', 'Hindi', 'Bengali'], ARRAY['Ayurvedic Beauty Therapist Certification'], 82, 78, 'Bangalore'),
-- Mumbai
('b0000000-0000-0000-0000-000000000007', 'Sameer Khan', 'Master Hair Sculptor & Fade Specialist', '8 Years', 4.9, ARRAY['English', 'Hindi', 'Marathi'], ARRAY['Sassoon Academy London', 'BELSOME Diamond Stylist'], 94, 142, 'Mumbai'),
('b0000000-0000-0000-0000-000000000008', 'Aisha Patel', 'Celebrity Groomer & Hair Colorist', '6 Years', 4.8, ARRAY['English', 'Hindi', 'Gujarati'], ARRAY['L''Oreal Professional Color Expert'], 88, 96, 'Mumbai'),
('b0000000-0000-0000-0000-000000000009', 'Kabir Mehta', 'Natural Wave Artist & Spa Therapy Specialist', '10 Years', 4.6, ARRAY['English', 'Hindi'], ARRAY['Ayurvedic Beauty Therapist Certification'], 82, 78, 'Mumbai'),
-- Delhi
('b0000000-0000-0000-0000-000000000010', 'Rahul Sharma', 'Master Hair Sculptor & Fade Specialist', '8 Years', 4.9, ARRAY['English', 'Hindi', 'Punjabi'], ARRAY['Sassoon Academy London', 'BELSOME Diamond Stylist'], 94, 142, 'Delhi'),
('b0000000-0000-0000-0000-000000000011', 'Neha Kapoor', 'Celebrity Groomer & Hair Colorist', '6 Years', 4.8, ARRAY['English', 'Hindi', 'Punjabi'], ARRAY['L''Oreal Professional Color Expert'], 88, 96, 'Delhi'),
('b0000000-0000-0000-0000-000000000012', 'Amit Singh', 'Natural Wave Artist & Spa Therapy Specialist', '10 Years', 4.6, ARRAY['English', 'Hindi'], ARRAY['Ayurvedic Beauty Therapist Certification'], 82, 78, 'Delhi';

-- 4. SEED STYLIST BEFORE AFTER IMAGES
INSERT INTO stylist_before_after (stylist_id, before_url, after_url) VALUES
('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
('b0000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200');

-- 5. SEED CORPORATE ACCOUNTS
INSERT INTO corporate_accounts (company_name, plan, total_employees, allocated_credits, used_credits, city) VALUES
('TechCorp Hyderabad', 'Silver', 150, 120000, 48000, 'Hyderabad'),
('FinGlobal Gachibowli', 'Gold', 80, 160000, 92000, 'Hyderabad'),
('TechCorp Bangalore', 'Silver', 150, 120000, 48000, 'Bangalore'),
('FinGlobal Whitefield', 'Gold', 80, 160000, 92000, 'Bangalore'),
('TechCorp Mumbai', 'Silver', 150, 120000, 48000, 'Mumbai'),
('FinGlobal Nariman Point', 'Gold', 80, 160000, 92000, 'Mumbai'),
('TechCorp Delhi', 'Silver', 150, 120000, 48000, 'Delhi'),
('FinGlobal Gurgaon', 'Gold', 80, 160000, 92000, 'Delhi');

-- 6. SEED APPOINTMENTS
INSERT INTO appointments (id, customer_name, salon_id, salon_name, service_id, service_name, stylist_id, stylist_name, date, time_slot, product_preference, original_price, final_price, status, pricing_reason, city) VALUES
-- Hyderabad
('c0000000-0000-0000-0000-000000000001', 'Rahul Sharma', 'a0000000-0000-0000-0000-000000000001', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000001', 'Signature Haircut & Consultation', 'b0000000-0000-0000-0000-000000000001', 'Vikram Malhotra', '2026-06-02', '11:00 AM', ARRAY['Organic', 'Paraben-Free'], 800, 640, 'Completed', 'Off-Peak Discount (20% Off)', 'Hyderabad'),
('c0000000-0000-0000-0000-000000000002', 'Ananya Reddy', 'a0000000-0000-0000-0000-000000000001', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000005', 'Royal Bridal Makeover Pack', 'b0000000-0000-0000-0000-000000000002', 'Priya Rao', '2026-06-06', '02:00 PM', ARRAY['Vegan'], 15000, 17250, 'Upcoming', 'Peak Season Surge (15% Surge)', 'Hyderabad'),
-- Bangalore
('c0000000-0000-0000-0000-000000000003', 'Vikram Hegde', 'a0000000-0000-0000-0000-000000000003', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000001', 'Signature Haircut & Consultation', 'b0000000-0000-0000-0000-000000000004', 'Arjun Reddy', '2026-06-02', '11:00 AM', ARRAY['Organic', 'Paraben-Free'], 800, 640, 'Completed', 'Off-Peak Discount (20% Off)', 'Bangalore'),
('c0000000-0000-0000-0000-000000000004', 'Meera Krishnan', 'a0000000-0000-0000-0000-000000000003', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000005', 'Royal Bridal Makeover Pack', 'b0000000-0000-0000-0000-000000000005', 'Kavya Nair', '2026-06-06', '02:00 PM', ARRAY['Vegan'], 15000, 17250, 'Upcoming', 'Peak Season Surge (15% Surge)', 'Bangalore'),
-- Mumbai
('c0000000-0000-0000-0000-000000000005', 'Aditya Shroff', 'a0000000-0000-0000-0000-000000000005', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000001', 'Signature Haircut & Consultation', 'b0000000-0000-0000-0000-000000000007', 'Sameer Khan', '2026-06-02', '11:00 AM', ARRAY['Organic', 'Paraben-Free'], 800, 640, 'Completed', 'Off-Peak Discount (20% Off)', 'Mumbai'),
('c0000000-0000-0000-0000-000000000006', 'Riya Kapoor', 'a0000000-0000-0000-0000-000000000005', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000005', 'Royal Bridal Makeover Pack', 'b0000000-0000-0000-0000-000000000008', 'Aisha Patel', '2026-06-06', '02:00 PM', ARRAY['Vegan'], 15000, 17250, 'Upcoming', 'Peak Season Surge (15% Surge)', 'Mumbai'),
-- Delhi
('c0000000-0000-0000-0000-000000000007', 'Rohan Mehra', 'a0000000-0000-0000-0000-000000000007', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000001', 'Signature Haircut & Consultation', 'b0000000-0000-0000-0000-000000000010', 'Rahul Sharma', '2026-06-02', '11:00 AM', ARRAY['Organic', 'Paraben-Free'], 800, 640, 'Completed', 'Off-Peak Discount (20% Off)', 'Delhi'),
('c0000000-0000-0000-0000-000000000008', 'Simran Kaur', 'a0000000-0000-0000-0000-000000000007', 'BELSOME Signature Studio', 'e0000000-0000-0000-0000-000000000005', 'Royal Bridal Makeover Pack', 'b0000000-0000-0000-0000-000000000011', 'Neha Kapoor', '2026-06-06', '02:00 PM', ARRAY['Vegan'], 15000, 17250, 'Upcoming', 'Peak Season Surge (15% Surge)', 'Delhi');

-- 7. SEED VENDOR PRODUCTS
INSERT INTO vendor_products (id, name, brand, certifications, cost, retail, margin, score, status, explanation) VALUES
('d0000000-0000-0000-0000-000000000001', 'BELSOME Argan Scalp Cleanser', 'BioGlow', ARRAY['Vegan', 'Organic', 'Toxin-Free'], 250, 650, 61.5, 94, 'ACCEPT', 'High margin percentage and contains complete vegan certifications. Approved for automated listing.');

-- 8. SEED EXAM ATTEMPTS
INSERT INTO exam_attempts (id, candidate_name, language, scenario, score, status, feedback, date) VALUES
('f0000000-0000-0000-0000-000000000001', 'Praveen Kumar', 'Telugu', 'Complaint Handling', 87, 'HIRE', 'Demonstrated strong empathy in Telugu language, apologized appropriately, and successfully offered a complimentary hair massage to resolve the client''s scheduling conflict.', '2026-06-01'),
('f0000000-0000-0000-0000-000000000002', 'Aditi Sen', 'English', 'Upselling Objections', 74, 'TRAIN', 'Clear language structure but failed to address price objections head-on. Needs training in conveying service value rather than conceding immediate discount.', '2026-06-02');

-- 9. SEED WEDDING PROJECTS
INSERT INTO wedding_projects (id, bride_name, wedding_date, budget, progress) VALUES
('90000000-0000-0000-0000-000000000001', 'Divya Reddy', '2026-11-20', 80000, 40);

-- 10. SEED WEDDING BOOKED VENDORS
INSERT INTO wedding_booked_vendors (wedding_project_id, role, name, cost, status) VALUES
('90000000-0000-0000-0000-000000000001', 'Makeup Artist', 'Priya Rao (BELSOME)', 15000, 'Confirmed'),
('90000000-0000-0000-0000-000000000001', 'Mehendi Artist', 'Sita Mehendi Design', 8000, 'Confirmed'),
('90000000-0000-0000-0000-000000000001', 'Hair Stylist', 'Vikram Malhotra', 12000, 'Pending');

-- 11. SEED WEDDING TIMELINE
INSERT INTO wedding_timeline (wedding_project_id, time, event, status) VALUES
('90000000-0000-0000-0000-000000000001', '09:00 AM', 'Mehendi Application Begins', 'Completed'),
('90000000-0000-0000-0000-000000000001', '02:00 PM', 'Hair Prep and Conditioning', 'Upcoming'),
('90000000-0000-0000-0000-000000000001', '04:30 PM', 'Bridal Makeup Session', 'Upcoming');
