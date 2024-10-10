"use client"
import { useRef } from 'react';
import Hero from "./components/hero";
import Problem from "./components/problem";
import Solution from "./components/solution";
import WhyNow from "./components/whyNow";
import WhyThis from "./components/whyThis";
import Footer from "./components/footer";
import AboutUsOne from "./components/aboutUsOne";

const HomePage = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="relative overflow-x-hidden">
      <Hero backgroundColor="bg-gradient-to-b from-[#1a0b2e] to-[#14103F]" />
      <Problem backgroundColor="bg-[#14103F]" />
      <div className="bg-gradient-to-r from-[#1a1a60] to-[#2a2a80]">
        <Solution />
        <WhyThis />
        <AboutUsOne />
        <WhyNow />
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;

