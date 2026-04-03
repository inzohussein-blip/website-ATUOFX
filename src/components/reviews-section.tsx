"use client";

import React from "react";
import { MessageSquare, User, Calendar } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { useReviews } from "@/hooks/useReviews";
import { formatDate } from "@/lib/utils";

export function ReviewsSection() {
  const { reviews, loading } = useReviews();

  // Get latest 6 reviews
  const latestReviews = reviews.slice(0, 6);

  return (
    <section id="reviews" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm mb-4">
            <MessageSquare className="w-4 h-4" />
            آراء المتداولين
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            تقييمات حقيقية من متداولين حقيقيين
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اقرأ تجارب المتداولين مع مختلف شركات الفوركس وشارك رأيك أيضاً
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : latestReviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      {review.profiles?.avatar_url ? (
                        <img
                          src={review.profiles.avatar_url}
                          alt={review.profiles.full_name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {review.profiles?.full_name || "مستخدم مجهول"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.created_at || new Date())}
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>

                {/* Review Content */}
                <p className="text-gray-700 leading-relaxed line-clamp-4">
                  &quot;{review.comment}&quot;
                </p>

                {/* Review Footer */}
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    تم التحقق من التقييم
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-green-600">موثوق</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">لا توجد تقييمات بعد</h3>
            <p className="text-muted-foreground">
              كن أول من يضيف تقييماً!
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            هل لديك تجربة مع إحدى شركات التداول؟
          </p>
          <button
            onClick={() => document.getElementById('brokers')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            أضف تقييمك الآن
          </button>
        </div>
      </div>
    </section>
  );
}
