import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Approach } from "./components/Approach";
import { SystemsSection } from "./components/SystemsSection";
import { EngagementsSection } from "./components/EngagementsSection";
import { SubstackWriting } from "./components/Substack";
import { Media } from "./components/Media";
import { Background } from "./components/Resume";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main>
        <Hero />
        <Approach />
        <SystemsSection />
        <SubstackWriting />
        <Media />
        <Background />
        <EngagementsSection />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
