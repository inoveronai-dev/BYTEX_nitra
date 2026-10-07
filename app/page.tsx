export const dynamic = "force-dynamic";

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
import {
  getAbout,
  getBenefits,
  getChangeManager,
  getContactPage,
  getHero,
  getPartners,
  getReconstructions,
  getReferences,
  getRevisions,
  getServices,
} from "@/lib/cms/queries";

export default function Home() {
  const hero = getHero();
  const about = getAbout();
  const benefitItems = getBenefits();
  const serviceItems = getServices();
  const revisionData = getRevisions();
  const referenceItems = getReferences();
  const reconstructionItems = getReconstructions();
  const partnerItems = getPartners();
  const changeManager = getChangeManager();
  const contactData = getContactPage();

  return (
    <>
      <SplashScreen />
      <div className="relative">
        <Hero
          headlineLines={hero?.headlineLines}
          imageSrc={hero?.imageSrc}
        />
        <Header />
      </div>
      <main className="flex-1">
        <About
          eyebrow={about?.eyebrow}
          heading={about?.heading}
          body={about?.body}
        />
        <Benefits items={benefitItems} />
        <Services items={serviceItems} />
        <Reconstructions projects={reconstructionItems} />
        <ChangeManagerCta data={changeManager} />
        <Revisions intro={revisionData.intro} items={revisionData.items} />
        <References items={referenceItems} />
        <Partners items={partnerItems} />
        <DownloadsCta />
        <Contact
          contact={contactData.contact}
          hours={contactData.hours}
          settings={contactData.settings}
        />
      </main>
      <Footer settings={contactData.settings} />
    </>
  );
}
