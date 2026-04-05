"use client";


import React from "react";
import { MessageSquare, User, Calendar } from "lucide-react";
import { StarRating } from "@/components/ui/star-rating";
import { useReviews } from "@/hooks/useReviews";
import { formatDate } from "@/lib/utils";


export function ReviewsSection({ initialReviews = [] }: { initialReviews?: any[] }) {
  const { reviews, loading } = useReviews(undefined, { initialReviews });


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
