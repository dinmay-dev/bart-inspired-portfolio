import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import WorkSection from "@/components/WorkSection";
import ResearchSection from "@/components/ResearchSection";
import BlogSection from "@/components/BlogSection";
import LogoMarquee from "@/components/LogoMarquee";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const Index = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ResearchSection />
        <BlogSection />
        <LogoMarquee />
        <StatsSection />
        <ContactSection />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
