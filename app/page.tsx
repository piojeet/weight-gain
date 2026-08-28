import BestSellingProducts from "@/components/home/BestSellingProducts";
import CommitmentSection from "@/components/home/CommitmentSection";
import CommunityReviews from "@/components/home/CommunityReviews";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import ScienceSection from "@/components/home/ScienceSection";
import TopCategories from "@/components/home/TopCategories";
import TrustStrip from "@/components/home/TrustStrip";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrustStrip />
      <TopCategories />
      <BestSellingProducts />
      <ScienceSection />
      <HowItWorks />
      <CommunityReviews />
      <CommitmentSection />
    </div>
  );
}
