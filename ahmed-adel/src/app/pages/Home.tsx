import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Education } from "../components/Education";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Volunteering } from "../components/Volunteering";
import { Contact } from "../components/Contact";
import { useSite } from "../context/SiteContext";

export function Home() {
  const { sectionsVisibility } = useSite();

  return (
    <>
      {sectionsVisibility.hero && <Hero />}
      {sectionsVisibility.about && <About />}
      {sectionsVisibility.education && <Education />}
      {sectionsVisibility.skills && <Skills />}
      {sectionsVisibility.projects && <Projects />}
      {sectionsVisibility.volunteering && <Volunteering />}
      {sectionsVisibility.contact && <Contact />}
    </>
  );
}
