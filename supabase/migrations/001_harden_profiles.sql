-- ============================================
-- Migration 001: Hardening profiles privacy
-- هدفها: منع كشف is_admin وبقية بيانات profiles للزوار.
--
-- ✅ ينشئ View عام اسمه public_profiles (id, full_name, avatar_url)
-- ✅ يسمح للـ anon/authenticated بقراءته
-- ✅ يمنع anon من قراءة جدول profiles
-- ✅ يقيّد قراءة profiles للمستخدم على نفسه (مع خيار admin قراءة الكل)
--
-- شغّل هذا الملف في Supabase SQL Editor بعد schema.sql
-- ============================================

-- 1) إسقاط policy القراءة العامة القديمة إن وجدت
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;

-- 2) سياسات profiles: قراءة الملف الشخصي للمستخدم فقط
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- (اختياري) admin يقرأ كل profiles (مفيد للوحة تحكم)
DROP POLICY IF EXISTS "profiles_admin_select_all" ON profiles;
CREATE POLICY "profiles_admin_select_all"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- 3) إنشاء View عام للعرض (بدون is_admin)
DROP VIEW IF EXISTS public_profiles;
CREATE VIEW public_profiles AS
  SELECT id, full_name, avatar_url
  FROM profiles;

-- 4) صلاحيات (قد تختلف حسب إعدادات مشروعك)
-- السماح بالقراءة للـ anon/authenticated على الـ view
GRANT SELECT ON public_profiles TO anon, authenticated;

-- منع anon من قراءة جدول profiles مباشرة
REVOKE ALL ON profiles FROM anon;

-- (اختياري) تأكيد صلاحيات authenticated على جدول profiles (حتى تعمل useAuth)
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- 5) اختبار سريع
-- يفترض أن ينجح للـ anon:
-- select * from public_profiles limit 3;
-- ويفشل/يُمنع للـ anon على profiles:
-- select * from profiles limit 1;
