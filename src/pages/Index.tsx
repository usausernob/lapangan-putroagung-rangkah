import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SportCards from "@/components/SportCards";
import SOPSection from "@/components/SOPSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SportCards />
      <SOPSection />
      <MapSection />
      <Footer />
    </div>
  );
};

export default Index;
