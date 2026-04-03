-- ============================================
-- إصلاح RLS Policies - شغّل هذا في Supabase SQL Editor
-- ============================================

-- حذف الـ policies القديمة
DROP POLICY IF EXISTS "Brokers are viewable by everyone" ON brokers;
DROP POLICY IF EXISTS "brokers_public_read" ON brokers;

-- إنشاء policy صحيحة تسمح للجميع بالقراءة (بما فيهم الزوار)
CREATE POLICY "brokers_public_read" ON brokers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- تأكيد إن RLS مفعّل
ALTER TABLE brokers ENABLE ROW LEVEL SECURITY;

-- اختبار: يجب أن يرجع هذا بيانات
SELECT id, name, rating FROM brokers WHERE is_active = true LIMIT 5;
