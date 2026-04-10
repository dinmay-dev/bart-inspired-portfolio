import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultProjects = [
  {
    title: "Open Source ML Contributions",
    subtitle: "Contributing to machine learning projects that power real applications",
    role: "Developer & Contributor",
    date: "2023-Present",
    link: "https://github.com/dino65-dev",
    linkText: "View on GitHub",
    highlight: "Multiple repos, real-world impact",
  },
  {
    title: "Full-Stack Portfolio",
    subtitle: "Built with TanStack, Tailwind, and Appwrite — a showcase of modern web dev",
    role: "Full-stack developer",
    date: "2026",
    link: "https://github.com/dino65-dev/Portfolio",
    linkText: "View project",
    highlight: "Shipped in a weekend",
  },
  {
    title: "Developer Tools & CLIs",
    subtitle: "Automation scripts and developer tooling for improved workflows",
    role: "Solo developer",
    date: "2023-2026",
    link: "https://github.com/dino65-dev",
    linkText: "Explore repos",
    highlight: "Built for developers, by a developer",
  },
];

interface Project {
  title: string;
  subtitle: string;
  role: string;
  date: string;
  link: string;
  linkText: string;
  highlight: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="border-t border-border py-14 md:py-20 group"
    >
      <p className="font-mono-label text-accent mb-6">{project.highlight}</p>
      <h3
        className="text-[clamp(1.75rem,4vw,3.5rem)] font-headline font-bold text-foreground mb-4"
        style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
      >
        {project.title}
      </h3>
      <p className="text-lg text-muted-foreground max-w-2xl mb-10 font-light" style={{ letterSpacing: "-0.01em" }}>
        {project.subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-10 mb-8">
        <div>
          <span className="font-mono-label text-muted-foreground block mb-1">Role</span>
          <span className="text-sm text-foreground font-medium">{project.role}</span>
        </div>
        <div>
          <span className="font-mono-label text-muted-foreground block mb-1">Date</span>
          <span className="text-sm text-foreground font-medium">{project.date}</span>
        </div>
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-accent font-semibold text-[13px] hover:gap-4 transition-all tracking-tight"
      >
        {project.linkText}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </motion.div>
  );
};

const WorkSection = () => {
  const ref = useRef(null);
  const { get } = useSiteContent();

  const projects = useMemo(() => {
    const raw = get("projects_json", "");
    if (!raw) return defaultProjects;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProjects;
    } catch {
      return defaultProjects;
    }
  }, [get]);

  return (
    <section id="work" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-label text-muted-foreground mb-6">Selected Work</p>
          <h2
            className="text-[clamp(2rem,4.5vw,4rem)] font-headline font-bold text-foreground mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Work worth <em className="font-script font-normal italic text-accent">scrolling</em>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl font-light mb-4" style={{ letterSpacing: "-0.01em" }}>
            {get("work_subtitle", "Stuff I've designed, built or shipped")}
          </p>
          <p className="text-sm text-muted-foreground/60 max-w-xl mb-16 font-light">
            A curated selection of projects I've worked on — from open source tools to full-stack applications.
          </p>
        </motion.div>

        {projects.map((project: Project, i: number) => (
          <ProjectCard key={project.title + i} project={project} />
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
