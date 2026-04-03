-- ============================================
-- Create Admin User
-- ============================================

-- After creating a user through the app, run this query to make them admin
-- Replace 'USER_UUID_HERE' with the actual user UUID

UPDATE profiles 
SET is_admin = true 
WHERE id = 'USER_UUID_HERE';

-- To find all users and their IDs:
-- SELECT id, email FROM auth.users;

-- To list all admins:
-- SELECT p.id, p.full_name, u.email 
-- FROM profiles p 
-- JOIN auth.users u ON p.id = u.id 
-- WHERE p.is_admin = true;
