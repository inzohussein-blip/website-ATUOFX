"use client";

import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { BrokersList } from "@/components/brokers-list";
import { ReviewsSection } from "@/components/reviews-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <BrokersList />
      <ReviewsSection />
      <Footer />
    </main>
  );
}
