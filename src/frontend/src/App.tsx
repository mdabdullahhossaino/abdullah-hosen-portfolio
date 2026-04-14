import { MobileHeader } from "@/components/MobileHeader";
import { Sidebar } from "@/components/Sidebar";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Experience } from "@/sections/Experience";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { Portfolio } from "@/sections/Portfolio";
import { Services } from "@/sections/Services";
import { Skills } from "@/sections/Skills";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Mobile sticky header */}
      <MobileHeader />

      {/* Main content — offset for sidebar on lg+ */}
      <main
        className="lg:ml-[280px] min-h-screen overflow-y-auto scrollbar-thin pt-14 lg:pt-0"
        id="main-content"
      >
        <Hero />
        <About />
        <Skills />
        <Services />
        <Portfolio />
        <Experience />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
