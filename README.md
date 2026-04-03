# ForexReview - موقع تقييم شركات الفوركس

موقع احترافي لتقييم ومراجعة شركات الفوركس، مشابه لموقع AUTOFX.ME، مع إمكانية تسجيل المستخدمين وإضافة تقييماتهم.

## 🚀 الميزات الرئيسية

- ✅ **واجهة مستخدم حديثة** - تصميم عصري وسريع الاستجابة
- ✅ **قائمة شركات الفوركس** - عرض الشركات في بطاقات جذابة مع التقييمات
- ✅ **نظام تقييمات** - إمكانية إضافة تقييمات وتعليقات للمستخدمين المسجلين
- ✅ **مصادقة آمنة** - تسجيل دخول وإنشاء حساب باستخدام Supabase Auth
- ✅ **بحث وفلترة** - البحث عن الشركات والفلترة حسب التقييم
- ✅ **روابط أفلييت** - روابط تسجيل مخصصة لكل شركة
- ✅ **قاعدة بيانات قوية** - Supabase PostgreSQL مع RLS

## 🛠️ التقنيات المستخدمة

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## 📁 هيكل المشروع

```
my-app/
├── src/
│   ├── app/
│   │   ├── auth/callback/     # صفحة معالجة مصادقة Supabase
│   │   ├── globals.css        # الأنماط العامة
│   │   ├── layout.tsx         # تخطيط التطبيق الرئيسي
│   │   └── page.tsx           # الصفحة الرئيسية
│   ├── components/
│   │   ├── ui/                # مكونات واجهة المستخدم
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── star-rating.tsx
│   │   │   └── textarea.tsx
│   │   ├── broker-card.tsx    # بطاقة شركة الفوركس
│   │   ├── brokers-list.tsx   # قائمة الشركات
│   │   ├── footer.tsx         # تذييل الصفحة
│   │   ├── hero.tsx           # قسم البانر الرئيسي
│   │   ├── navbar.tsx         # شريط التنقل
│   │   └── reviews-section.tsx # قسم التقييمات
│   ├── hooks/
│   │   ├── useAuth.ts         # hook المصادقة
│   │   ├── useBrokers.ts      # hook شركات الفوركس
│   │   └── useReviews.ts      # hook التقييمات
│   ├── lib/
│   │   ├── supabase.ts        # إعداد Supabase
│   │   └── utils.ts           # دوال مساعدة
│   └── types/
│       ├── database.ts        # أنواع قاعدة البيانات
│       └── index.ts           # الأنواع العامة
├── supabase/
│   └── schema.sql             # مخطط قاعدة البيانات
├── public/                    # الملفات الثابتة
├── .env.example               # مثال على متغيرات البيئة
├── next.config.js             # إعداد Next.js
├── package.json               # اعتمادات المشروع
├── postcss.config.js          # إعداد PostCSS
├── tailwind.config.ts         # إعداد Tailwind CSS
└── tsconfig.json              # إعداد TypeScript
```

## 🚀 خطوات الإعداد والتشغيل

### 1. إنشاء مشروع Supabase

1. اذهب إلى [supabase.com](https://supabase.com) وسجل دخولك
2. أنشئ مشروع جديد
3. اذهب إلى **SQL Editor** ← **New query**
4. انسخ محتوى ملف `supabase/schema.sql` والصقه في المحرر
5. اضغط **Run** لإنشاء الجداول

### 2. الحصول على مفاتيح Supabase

1. اذهب إلى **Project Settings** ← **API**
2. انسخ القيم التالية:
   - **Project URL** ← `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public** ← `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** ← `SUPABASE_SERVICE_ROLE_KEY` (احتفظ بها سرية!)

### 3. إعداد Environment Variables

#### للتطوير المحلي:

```bash
cp .env.example .env.local
```

ثم عدل الملف:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### للنشر على Vercel:

1. اذهب إلى [vercel.com](https://vercel.com) واستورد مشروعك من GitHub
2. اذهب إلى **Settings** ← **Environment Variables**
3. أضف المتغيرات التالية:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` |

> ⚠️ **ملاحظة**: المتغيرات التي تبدأ بـ `NEXT_PUBLIC_` تكون متاحة في المتصفح، أما `SUPABASE_SERVICE_ROLE_KEY` فاستخدمها فقط في API Routes.

### 4. تثبيت الاعتمادات وتشغيل المشروع

```bash
# تثبيت الاعتمادات
npm install

# تشغيل خادم التطوير
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

### 5. البناء للإنتاج

```bash
npm run build
```

## 📊 مخطط قاعدة البيانات

### جدول `brokers` (شركات الفوركس)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | المفتاح الأساسي |
| `name` | VARCHAR | اسم الشركة |
| `logo_url` | TEXT | رابط الشعار |
| `website_url` | TEXT | رابط الموقع الرسمي |
| `affiliate_link` | TEXT | رابط الأفلييت |
| `description` | TEXT | وصف الشركة |
| `rating` | DECIMAL | التقييم (0-5) |
| `review_count` | INTEGER | عدد التقييمات |
| `features` | JSONB | مميزات الشركة |
| `regulation` | VARCHAR | الترخيص |
| `minimum_deposit` | VARCHAR | الحد الأدنى للإيداع |
| `spread_type` | VARCHAR | نوع السبريد |
| `trading_platforms` | JSONB | منصات التداول |
| `is_active` | BOOLEAN | هل الشركة نشطة؟ |

### جدول `reviews` (التقييمات)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | المفتاح الأساسي |
| `broker_id` | UUID | معرف الشركة |
| `user_id` | UUID | معرف المستخدم |
| `rating` | INTEGER | التقييم (1-5) |
| `comment` | TEXT | التعليق |
| `is_approved` | BOOLEAN | هل تمت الموافقة؟ |

### جدول `profiles` (ملفات المستخدمين)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | معرف المستخدم |
| `full_name` | VARCHAR | الاسم الكامل |
| `avatar_url` | TEXT | رابط الصورة |
| `is_admin` | BOOLEAN | هل هو مسؤول؟ |

## 🔐 Row Level Security (RLS)

تم تفعيل RLS على جميع الجداول للحماية:

- **brokers**: يمكن للجميع عرض الشركات النشطة، فقط المسؤولون يمكنهم التعديل
- **reviews**: يمكن للجميع عرض التقييمات المعتمدة، المستخدمون يمكنهم إدارة تقييماتهم
- **profiles**: يمكن للجميع عرض الملفات، المستخدمون يمكنهم تعديل ملفهم فقط

## 🎯 الميزات القادمة

- [ ] لوحة تحكم المسؤول
- [ ] إدارة الشركات (إضافة/تعديل/حذف)
- [ ] مراجعة واعتماد التقييمات
- [ ] إحصائيات متقدمة
- [ ] دعم اللغة الإنجليزية
- [ ] Dark Mode
- [ ] PWA

## 📄 الترخيص

هذا المشروع مفتوح المصدر تحت رخصة MIT.

## 🤝 المساهمة

نرحب بمساهماتكم! يمكنكم:

1. عمل Fork للمشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. عمل Commit للتغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📧 التواصل

للاستفسارات والاقتراحات:

- البريد: info@forexreview.com
- تويتر: [@ForexReview](https://twitter.com/forexreview)

---

<div align="center">
  <p>صُنع بـ ❤️ للمتداولين العرب</p>
</div>
