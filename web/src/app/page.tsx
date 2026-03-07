import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ForContributors from "@/components/ForContributors";
import ForCompanies from "@/components/ForCompanies";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div style={{ background: "#0a0a0a" }}>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <ForContributors />
        <ForCompanies />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
