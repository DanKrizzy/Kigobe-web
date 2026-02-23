import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/church/Navbar";
import Hero from "@/components/church/Hero";
import About from "@/components/church/About";
import Services from "@/components/church/Services";
import Sermons from "@/components/church/Sermons";
import Events from "@/components/church/Events";
import Ministries from "@/components/church/Ministries";
import PrayerRequest from "@/components/church/PrayerRequest";
import Gallery from "@/components/church/Gallery";
import Newsletter from "@/components/church/Newsletter";
import Contact from "@/components/church/Contact";
import Footer from "@/components/church/Footer";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Sermons />
        <Events />
        <Ministries />
        <Gallery />
        <PrayerRequest />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
