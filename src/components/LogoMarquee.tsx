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
    <section className="py-16 border-t border-b border-border overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-sm text-muted-foreground mb-10"
      >
        Technologies I work with
      </motion.p>

      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...technologies, ...technologies].map((tech, i) => (
            <span
              key={i}
              className="mx-8 text-xl md:text-2xl font-semibold text-muted-foreground/40 hover:text-foreground transition-colors cursor-default"
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
