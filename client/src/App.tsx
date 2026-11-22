import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { PracticeBridge } from "./components/PracticeBridge";
import { Approach } from "./components/Approach";
import { EngagementsSection } from "./components/EngagementsSection";
import { SubstackWriting } from "./components/Substack";
import { Background } from "./components/Resume";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { SeoSchema } from "./components/SeoSchema";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <SeoSchema />
      <Navbar />

      <main>
        <div className="flex min-h-[calc(100svh+1.25rem)] flex-col">
          <Hero />
          <LogoMarquee />
        </div>
        <Background />
        <PracticeBridge />
        <EngagementsSection />
        <Approach />
        <SubstackWriting />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
