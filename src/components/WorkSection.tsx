import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const projects = [
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

const AnimatedText = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <span ref={ref} className="inline">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: i * 0.012, duration: 0.1 }}
          className="inline"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="border-t border-border py-12 md:py-16 group"
    >
      <p className="text-sm text-accent font-medium mb-4">{project.highlight}</p>
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
        {project.title}
      </h3>
      <p className="text-lg text-muted-foreground max-w-2xl mb-8">
        {project.subtitle}
      </p>

      <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground mb-6">
        <div>
          <span className="block text-xs uppercase tracking-wider mb-1">Role</span>
          <span className="text-foreground">{project.role}</span>
        </div>
        <div>
          <span className="block text-xs uppercase tracking-wider mb-1">Date</span>
          <span className="text-foreground">{project.date}</span>
        </div>
      </div>

      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:underline transition-all group-hover:gap-3"
      >
        {project.linkText}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </motion.div>
  );
};

const WorkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
        >
          Work worth scrolling
        </motion.h2>
        <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
          Stuff I've designed, built or shipped
        </p>
        <div className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-16 leading-relaxed">
          <AnimatedText text="A mix of shipped products, experiments, and code that made it to production. Built with clarity, curiosity, and just enough chaos." />
        </div>

        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
};

export default WorkSection;
