"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, MessageSquare, Check, Award } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarRating, RatingBadge } from "@/components/ui/star-rating";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Broker } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";

interface BrokerCardProps {
  broker: Broker;
}

export function BrokerCard({ broker }: BrokerCardProps) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  
  const { user } = useAuth();
  const { addReview } = useReviews(broker.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await addReview(broker.id, rating, comment, user.id);
    
    if (result.success) {
      setSubmitMessage("تم إرسال تقييمك بنجاح! سيتم مراجعته قبل النشر.");
      setRating(0);
      setComment("");
      setTimeout(() => {
        setIsReviewOpen(false);
        setSubmitMessage("");
      }, 2000);
    } else {
      setSubmitMessage(result.error || "حدث خطأ أثناء إرسال التقييم");
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border">
                {broker.logo_url ? (
                  <Image
                    src={broker.logo_url}
                    alt={broker.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-400">
                    {broker.name.charAt(0)}
                  </span>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold">{broker.name}</h3>
                <RatingBadge rating={broker.rating} reviewCount={broker.review_count} />
              </div>
            </div>

            {/* Regulation Badge */}
            {broker.regulation && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                <Award className="w-3 h-3" />
                مرخص
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {broker.description}
          </p>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {broker.features?.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/5 text-primary text-xs rounded-md"
                >
                  <Check className="w-3 h-3" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Trading Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <span className="text-muted-foreground block text-xs">الحد الأدنى للإيداع</span>
              <span className="font-semibold">{broker.minimum_deposit || 'غير محدد'}</span>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <span className="text-muted-foreground block text-xs">نوع السبريد</span>
              <span className="font-semibold">{broker.spread_type || 'متغير'}</span>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">المنصات:</span>
            <div className="flex gap-1">
              {broker.trading_platforms?.map((platform, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              onClick={() => window.open(broker.affiliate_link || broker.website_url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 ml-2" />
              زيارة الموقع
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsReviewOpen(true)}
            >
              <MessageSquare className="w-4 h-4 ml-2" />
              أضف تقييم
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent onClose={() => setIsReviewOpen(false)}>
          <DialogHeader>
            <DialogTitle>أضف تقييمك لـ {broker.name}</DialogTitle>
            <DialogDescription>
              شارك تجربتك مع هذا الوسيط مع المتداولين الآخرين
            </DialogDescription>
          </DialogHeader>

          {user ? (
            <form onSubmit={handleSubmitReview} className="space-y-4 mt-4">
              {submitMessage && (
                <div className={`p-3 text-sm rounded-md ${
                  submitMessage.includes('نجاح') 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {submitMessage}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">تقييمك</label>
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive
                  onRatingChange={setRating}
                  className="justify-center"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">تعليقك</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="شارك تجربتك مع هذا الوسيط..."
                  rows={4}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={rating === 0 || !comment.trim()}
              >
                إرسال التقييم
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                يجب تسجيل الدخول لإضافة تقييم
              </p>
              <Button onClick={() => { setIsReviewOpen(false); }}>
                تسجيل الدخول
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
