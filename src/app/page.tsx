import { HeroSection } from "@/components/layout/HeroSection";
import { BentoFeatures } from "@/components/features/home/BentoFeatures";
import { VibeGallery } from "@/components/features/home/VibeGallery";
import { TestimonialSection, ReviewData } from "@/components/features/home/TestimonialSection";
import { LocationSection } from "@/components/features/home/LocationSection";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  // Fetch user to allow them to write reviews
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the latest 10 reviews with user profile data
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
          id, 
          rating, 
          content,
          created_at, 
          profiles (full_name, role)
      `)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      <HeroSection />

      <BentoFeatures />
      <VibeGallery />
      <TestimonialSection reviews={(reviews as unknown as ReviewData[]) || []} user={user} />
      <LocationSection />
    </main>
  );
}
