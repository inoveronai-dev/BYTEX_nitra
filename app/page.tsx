import About from "@/components/About";
import Benefits from "@/components/Benefits";
import ChangeManagerCta from "@/components/ChangeManagerCta";
import Contact from "@/components/Contact";
import DownloadsCta from "@/components/DownloadsCta";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import Reconstructions from "@/components/Reconstructions";
import References from "@/components/References";
import Revisions from "@/components/Revisions";
import Services from "@/components/Services";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  return (
    <>
      <SplashScreen />
      <div className="relative">
        <Hero />
        <Header />
      </div>
      <main className="flex-1">
        <About />
        <Benefits />
        <Services />
        <Reconstructions />
        <ChangeManagerCta />
        <Revisions />
        <References />
        <Partners />
        <DownloadsCta />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
