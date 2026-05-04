import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { LinkedIn } from "./components/LinkedIn";
import { Projects } from "./components/Projects";
import { Media } from "./components/Media";
import { Resume } from "./components/Resume";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      <main>
        <Hero />
        <About />
        <LinkedIn />
        <Projects />
        <Media />
        <Resume />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
