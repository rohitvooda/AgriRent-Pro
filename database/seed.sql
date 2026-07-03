-- Seed script for AgriRent-Pro
-- Note: All seeded users use the password 'password123' (bcrypt hash: $2b$12$sb96uIu1zYw/M1vY.c2Qfe/c4y0oW7u9.q2.7WkXF7rX3y6Wz1p3G)

-- 1. Insert Users (Admin, Owners, Farmers)
-- Let's generate static UUIDs so foreign key references work consistently.

INSERT INTO users (id, email, hashed_password, name, role, phone, address) VALUES
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'admin@agrirent.com', '$2b$12$sb96uIu1zYw/M1vY.c2Qfe/c4y0oW7u9.q2.7WkXF7rX3y6Wz1p3G', 'AgriRent Admin', 'admin', '+919999999999', 'Admin Head Office, New Delhi'),
('b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'ramesh_owner@gmail.com', '$2b$12$sb96uIu1zYw/M1vY.c2Qfe/c4y0oW7u9.q2.7WkXF7rX3y6Wz1p3G', 'Ramesh Kumar', 'owner', '+919876543210', 'Plot No. 42, Green Fields, Ludhiana, Punjab'),
('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'suresh_farmer@gmail.com', '$2b$12$sb96uIu1zYw/M1vY.c2Qfe/c4y0oW7u9.q2.7WkXF7rX3y6Wz1p3G', 'Suresh Singh', 'farmer', '+919123456789', 'Village Kheri, Near Canal, Karnal, Haryana'),
('d4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'anil_owner@gmail.com', '$2b$12$sb96uIu1zYw/M1vY.c2Qfe/c4y0oW7u9.q2.7WkXF7rX3y6Wz1p3G', 'Anil Sharma', 'owner', '+918887776665', 'Model Town, Bhatinda, Punjab');

-- 2. Insert Equipment Listings (Associated with Owners Ramesh and Anil)
INSERT INTO equipment (id, owner_id, name, category, description, price_per_day, location, image_url, is_available) VALUES
('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'John Deere 5050D Tractor', 'Tractor', 'High-performance 50 HP tractor suitable for all tillage, haulage, and agricultural applications. Comes with rotavator attachment capability.', 2500.00, 'Ludhiana, Punjab', 'https://res.cloudinary.com/demo/image/upload/v1615234567/tractor.jpg', true),
('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'b2c3d4e5-f67a-8b9c-0d1e-2f3a4b5c6d7e', 'Mahindra Arjun Novo 605 Harvester', 'Harvester', 'Self-propelled multi-crop harvester designed for harvesting wheat, paddy, and soy. Offers high productivity and clean grain quality.', 8000.00, 'Ludhiana, Punjab', 'https://res.cloudinary.com/demo/image/upload/v1615234568/harvester.jpg', true),
('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Massey Ferguson Multi-Crop Seed Drill', 'Seed Drill', 'Advanced seed drill with 11 rows for uniform seed distribution and fertilizer application. Compatible with 35-50 HP tractors.', 1200.00, 'Bhatinda, Punjab', 'https://res.cloudinary.com/demo/image/upload/v1615234569/seeddrill.jpg', true),
('b4c5d6e7-f89a-0b1c-2d3e-4f5a6b7c8d9e', 'd4e5f67a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'Shaktiman Semi Champion Rotavator', 'Rotavator', 'High-speed heavy-duty rotavator for soil preparation. Removes previous crop residues and prepares seed beds instantly.', 1500.00, 'Bhatinda, Punjab', 'https://res.cloudinary.com/demo/image/upload/v1615234570/rotavator.jpg', true);

-- 3. Insert Bookings (Suresh booking equipment from Ramesh and Anil)
INSERT INTO bookings (id, farmer_id, equipment_id, start_date, end_date, total_price, status, created_at) VALUES
-- Past Completed Booking (John Deere Tractor)
('b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', '2026-06-15', '2026-06-18', 7500.00, 'completed', '2026-06-10 10:00:00+05:30'),
-- Active/Approved Booking (Mahindra Harvester)
('b2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', '2026-07-10', '2026-07-12', 16000.00, 'approved', '2026-07-01 14:30:00+05:30'),
-- Pending Booking Request (Seed Drill)
('b3a4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', '2026-07-20', '2026-07-21', 12000.00, 'pending', '2026-07-02 09:15:00+05:30');

-- 4. Insert Payments
INSERT INTO payments (id, booking_id, amount, payment_status, payment_method, transaction_id, created_at) VALUES
-- Payment for past completed booking
('p1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 7500.00, 'completed', 'UPI', 'TXN987654321000', '2026-06-10 10:05:00+05:30'),
-- Payment for approved harvester booking
('p2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 'b2a3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', 16000.00, 'completed', 'Card', 'TXN554433221100', '2026-07-01 14:35:00+05:30');

-- 5. Insert Reviews
INSERT INTO reviews (id, booking_id, rating, comment, created_at) VALUES
('r1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 5, 'The tractor was in excellent condition. Ramesh was very cooperative and delivered it right to my farm. Will rent again!', '2026-06-19 12:00:00+05:30');
