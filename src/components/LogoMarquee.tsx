import { motion } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultTechnologies = [
  "React", "TypeScript", "Python", "TailwindCSS", "Node.js",
  "TensorFlow", "Docker", "Git", "PostgreSQL", "Linux",
  "Vite", "Next.js", "FastAPI", "MongoDB", "Redis",
];

const LogoMarquee = () => {
  const { get } = useSiteContent();

  const raw = get("technologies_list", "");
  const technologies = raw
    ? raw.split(",").map((t) => t.trim()).filter(Boolean)
    : defaultTechnologies;

  return (
    <section className="py-20 md:py-28 border-t border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3"
        >
          Name-dropping, briefly
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Technologies I work with. Not that important, but people seem to care.
        </motion.p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
        
        <div className="flex animate-marquee whitespace-nowrap">
          {[...technologies, ...technologies].map((tech, i) => (
            <span
              key={i}
              className="mx-8 text-2xl md:text-3xl font-semibold text-muted-foreground/30 hover:text-foreground transition-colors duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;
