# ForexReview - موقع تقييم شركات الفوركس

موقع احترافي لتقييم ومراجعة شركات الفوركس (مشابه لفكرة AUTOFX.ME) مع:
- عرض الشركات (brokers)
- تسجيل/تسجيل دخول Supabase Auth
- إضافة تقييمات المستخدمين (reviews) مع نظام موافقة (approval)

---

## 1) المتطلبات

- Node.js 18+ (يفضّل 20+)
- حساب Supabase + مشروع جديد
- حساب Vercel (اختياري للنشر)

---

## 2) تشغيل سريع محليًا (يشغّل مباشرة)

### 2.1 تثبيت الحزم

```bash
npm install
```

### 2.2 إعداد متغيرات البيئة (مهم جدًا)

انسخ ملف المثال:

```bash
cp .env.example .env.local
```

ثم ضع القيم من Supabase:

- من Supabase → Project Settings → API:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

مثال:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 2.3 إعداد قاعدة البيانات

1) Supabase → SQL Editor → New query
2) شغّل ملف:
- `supabase/schema.sql`

3) (مهم) شغّل ملف تحسين الخصوصية:
- `supabase/migrations/001_harden_profiles.sql`

4) (اختياري) إذا واجهت أن الزوار لا يرون brokers:
- شغّل `supabase/fix-rls.sql`

### 2.4 التشغيل

```bash
npm run dev
```

افتح:
- http://localhost:3000

---

## 3) النشر على Vercel (Production)

1) ارفع المشروع على GitHub
2) Vercel → Add New → Project → Import من GitHub
3) Vercel → Settings → Environment Variables

أضف:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

ملاحظة: أي متغير يبدأ بـ `NEXT_PUBLIC_` يظهر في المتصفح، لذلك لا تضع `service_role` هنا.

ثم Deploy.

---

## 4) إعداد Google OAuth (اختياري)

لأن المشروع يحتوي زر Google في `useAuth.ts`:

1) Supabase → Authentication → Providers → Google → Enable
2) Supabase → Authentication → URL Configuration
   - أضف Redirect URL:
     - `https://YOUR_DOMAIN/auth/callback`
     - مثال Vercel: `https://website-autofx.vercel.app/auth/callback`

---

## 5) إدارة التقييمات (Approval)

عند إضافة تقييم جديد يتم حفظه بـ `is_approved=false`.
لكي يظهر للزوار يجب تغييره إلى `true` (يدويًا حاليًا).

مثال استعلام (من SQL Editor) لاعتماد تقييم:

```sql
update reviews set is_approved = true where id = 'REVIEW_UUID';
```

---

## 6) ملاحظات تقنية (مفيدة)

- تم تعديل إنشاء Supabase client ليكون **Lazy** (لن ينهار build إذا كانت ENV ناقصة).
- تم إضافة `export const dynamic = 'force-dynamic'` لبعض الصفحات لمنع مشاكل prerender.
- تم إضافة ESLint config + .env.example + .gitignore.

---

## 7) ملفات Supabase داخل المشروع

- `supabase/schema.sql`: الجداول + RLS + triggers + بيانات تجريبية
- `supabase/migrations/001_harden_profiles.sql`: تحسين خصوصية profiles + view `public_profiles`
- `supabase/fix-rls.sql`: إصلاح قراءة جدول brokers للزوار إذا لزم
- `supabase/seed-admin.sql`: تحويل مستخدم إلى admin (بعد إنشائه)
