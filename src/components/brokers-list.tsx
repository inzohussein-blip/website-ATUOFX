"use client";

import React, { useState } from "react";
import { Search, Filter, TrendingUp, Star, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrokerCard } from "@/components/broker-card";
import { useBrokers } from "@/hooks/useBrokers";

export function BrokersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "reviews" | "newest">("rating");
  const { brokers, loading, error } = useBrokers();

  // Filter and sort brokers
  const filteredBrokers = brokers
    .filter((broker) =>
      broker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      broker.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "reviews":
          return (b.review_count || 0) - (a.review_count || 0);
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <section id="brokers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">جاري تحميل الشركات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="brokers" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>حدث خطأ أثناء تحميل البيانات</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="brokers" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-4">
            <TrendingUp className="w-4 h-4" />
            شركات التداول الموثوقة
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            اختر الوسيط الأنسب لك
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            قارن بين أفضل شركات الفوركس المرخصة واقرأ تقييمات المتداولين الحقيقيين
            قبل اتخاذ قرارك
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="ابحث عن شركة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sortBy === "rating" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("rating")}
            >
              <Star className="w-4 h-4 ml-2" />
              الأعلى تقييماً
            </Button>
            <Button
              variant={sortBy === "reviews" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("reviews")}
            >
              <Filter className="w-4 h-4 ml-2" />
              الأكثر تقييماً
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-sm">
              <strong>{brokers.length}</strong> شركة مرخصة
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm">
              <strong>{brokers.reduce((acc, b) => acc + (b.review_count || 0), 0)}</strong> تقييم
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="text-sm">
              متوسط التقييم: <strong>
                {(brokers.reduce((acc, b) => acc + (b.rating || 0), 0) / brokers.length).toFixed(1)}
              </strong>
            </span>
          </div>
        </div>

        {/* Brokers Grid */}
        {filteredBrokers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrokers.map((broker) => (
              <BrokerCard key={broker.id} broker={broker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">لا توجد نتائج</h3>
            <p className="text-muted-foreground">
              لم نجد أي شركة تطابق بحثك. جرب كلمات مختلفة.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
