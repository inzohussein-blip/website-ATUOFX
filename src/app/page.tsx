import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { BrokersList } from "@/components/brokers-list";
import { ReviewsSection } from "@/components/reviews-section";
import { Footer } from "@/components/footer";
import { fetchBrokersServer, fetchReviewsServer } from "@/lib/supabase-rest";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [brokers, reviews] = await Promise.all([
    fetchBrokersServer(),
    fetchReviewsServer(),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <BrokersList initialBrokers={brokers} />
      <ReviewsSection initialReviews={reviews} />
      <Footer />
    </main>
  );
}
