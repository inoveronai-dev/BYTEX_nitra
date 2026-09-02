import About from "@/components/About";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import References from "@/components/References";
import Services from "@/components/Services";

export default function Home() {
  return (
    <>
      <div className="relative">
        <Hero />
        <Header />
      </div>
      <main className="flex-1">
        <About />
        <Benefits />
        <Services />
        <References />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
