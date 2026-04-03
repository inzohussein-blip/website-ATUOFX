import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForexReview - أفضل شركات التداول الموثوقة",
  description: "منصتك الموثوقة لمقارنة شركات الفوركس وقراءة تقييمات المتداولين الحقيقيين. اكتشف أفضل شركات التداول المرخصة.",
  keywords: "فوركس, تداول, شركات فوركس, وسطاء تداول, forex, brokers, trading",
  authors: [{ name: "ForexReview" }],
  openGraph: {
    title: "ForexReview - أفضل شركات التداول الموثوقة",
    description: "منصتك الموثوقة لمقارنة شركات الفوركس وقراءة تقييمات المتداولين الحقيقيين.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
