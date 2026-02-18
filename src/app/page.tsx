"use client";

import { HeroSection } from "@/components/layout/HeroSection";
// @ts-ignore
import { BentoFeatures } from "@/components/features/home/BentoFeatures";
// @ts-ignore
import { VibeGallery } from "@/components/features/home/VibeGallery";
// @ts-ignore
import { LocationSection } from "@/components/features/home/LocationSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      <HeroSection />

      <BentoFeatures />
      <VibeGallery />
      <LocationSection />
    </main>
  );
}
