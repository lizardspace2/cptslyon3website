import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MissionsSection from "@/components/MissionsSection";
import NewsSection from "@/components/NewsSection";
import KeyFigures from "@/components/KeyFigures";
import FAQSection from "@/components/FAQSection";
import PartnersSection from "@/components/PartnersSection";
import NewsletterSection from "@/components/NewsletterSection";
import TerritorySection from "@/components/TerritorySection";
import SearchProSection from "@/components/SearchProSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MissionsSection />
        <NewsSection />
        <KeyFigures />
        <PartnersSection />
        <FAQSection />
        <NewsletterSection />
        <TerritorySection />
        <SearchProSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
