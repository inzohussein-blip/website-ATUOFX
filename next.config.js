/** @type {import('next').NextConfig} */
const nextConfig = {
  // أثناء التطوير يمكن تفعيل ignoreBuildErrors/ignoreDuringBuilds مؤقتًا.
  // في الإنتاج يفضّل تركها false حتى لا تُنشر أخطاء.
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
