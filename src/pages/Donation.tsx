import Navbar from "@/components/church/Navbar";
import Donation from "@/components/church/Donation";
import Footer from "@/components/church/Footer";

const DonationPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Donation />
      </main>
      <Footer />
    </div>
  );
};

export default DonationPage;
