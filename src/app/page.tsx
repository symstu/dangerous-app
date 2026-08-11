"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shouldAnimate } from "@/lib/is-dev";
import Navbar from "@/components/home/navbar";
import HeroSection from "@/components/home/hero-section";

const NFTSection = dynamic(() => import("@/components/home/nft-section"));
const SocialSection = dynamic(() => import("@/components/home/social-section"));
const RewardsSection = dynamic(() => import("@/components/home/rewards-section"));
const Footer = dynamic(() => import("@/components/home/footer"));

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HomePage() {
  useEffect(() => {
    if (!shouldAnimate) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col bg-black text-white selection:bg-purple-500 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        <HeroSection />
        <NFTSection />
        <SocialSection />
        <RewardsSection />
      </main>
      <Footer />
    </div>
  );
}
