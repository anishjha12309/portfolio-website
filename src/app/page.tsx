import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { GitHubActivity } from "@/components/sections/github-activity";
import  {Skills } from "@/components/sections/skills";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { FloatingSatellite, ShootingStars } from "@/components/astronomy-decorations";
import { AsteroidGame } from "@/components/asteroid-game";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingSatellite />
      <ShootingStars />
      <AsteroidGame />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <GitHubActivity />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
