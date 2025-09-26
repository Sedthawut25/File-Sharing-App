// src/pages/Landing.jsx
import React from "react";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";
import { features, pricingPlans, testimonials } from "../assets/data"; // ← ใช้ของจริงจาก data.js

const Landing = () => {
  return (
    <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">
      <HeroSection />
      <FeaturesSection features={features} />
      <PricingSection pricingPlans={pricingPlans} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Landing;
